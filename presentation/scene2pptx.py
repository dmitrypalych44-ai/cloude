#!/usr/bin/env python3
"""
Конвертер сцены презентации (JSON от export-scene.js) в PPTX с нативными,
редактируемыми объектами: текстовые блоки, автофигуры, линии, картинки, градиенты.

python3 scene2pptx.py out/scene-classic.json out/strategiya-2027-classic.pptx [safe|styled]
"""
import json
import re
import sys
import os

from pptx import Presentation
from pptx.util import Emu, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn
from lxml import etree

PT = 12700          # EMU в пункте
W_PT, H_PT = 960, 540

# safe: метрики сцены сняты с Arimo (= Arial), поэтому и «дисплейный» слой
# отдаём Arial Bold — ширины совпадают 1:1, переполнения исключены.
FONTS = {
    'safe':   {'o': 'Arial', 'u': 'Arial'},
    'styled': {'o': 'Onest', 'u': 'Unbounded'},
}

# ---------------------------------------------------------------- утилиты

def parse_color(c):
    """'#RRGGBB' | 'rgba(r,g,b,a)' | 'rgb(r,g,b)' → (RGBColor, alpha 0..1)"""
    if c is None:
        return None, 1.0
    m = re.match(r'rgba?\(([^)]+)\)', c)
    if m:
        parts = [p.strip() for p in m.group(1).split(',')]
        r, g, b = (int(float(p)) for p in parts[:3])
        a = float(parts[3]) if len(parts) > 3 else 1.0
        return RGBColor(r, g, b), a
    h = c.lstrip('#')
    if len(h) == 3:
        h = ''.join(ch * 2 for ch in h)
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)), 1.0


def emu(v_pt):
    return Emu(int(round(v_pt * PT)))


def _srgb(color, alpha):
    """элемент <a:srgbClr> с прозрачностью"""
    rgb, a0 = parse_color(color) if isinstance(color, str) else (color, 1.0)
    a0 = a0 * 1.0
    el = etree.SubElement(etree.Element('dummy'), qn('a:srgbClr'))
    el.set('val', '%02X%02X%02X' % (rgb[0], rgb[1], rgb[2]))
    if alpha * a0 < 0.999:
        al = etree.SubElement(el, qn('a:alpha'))
        al.set('val', str(int(round(alpha * a0 * 100000))))
    return el



def strip_style(shape):
    """Убираем <p:style>: иначе PowerPoint подмешивает тему (тень, обводку, цвет)."""
    el = shape._element
    st = el.find(qn('p:style'))
    if st is not None:
        el.remove(st)
    spPr = el.find(qn('p:spPr'))
    if spPr is not None:
        for e in spPr.findall(qn('a:effectLst')):
            spPr.remove(e)
        etree.SubElement(spPr, qn('a:effectLst'))


def set_solid_fill(shape, color, alpha=1.0):
    rgb, a0 = parse_color(color)
    alpha = alpha * a0   # rgba(...) в сцене уже несёт прозрачность
    spPr = shape.fill._xPr
    for tag in ('a:noFill', 'a:solidFill', 'a:gradFill', 'a:pattFill', 'a:blipFill', 'a:grpFill'):
        for el in spPr.findall(qn(tag)):
            spPr.remove(el)
    fill = etree.SubElement(spPr, qn('a:solidFill'))
    fill.append(_srgb(rgb, alpha))
    # srgbClr должен идти после удаления в правильном порядке: переставим в конец блока
    _reorder_fill(spPr)


def _reorder_fill(spPr):
    """a:solidFill/a:gradFill обязаны стоять перед a:ln в spPr"""
    tags = {'a:noFill', 'a:solidFill', 'a:gradFill', 'a:pattFill', 'a:blipFill', 'a:grpFill'}
    fills = [el for el in spPr if el.tag in {qn(t) for t in tags}]
    for el in fills:
        spPr.remove(el)
    idx = 0
    for el in list(spPr):
        if el.tag in (qn('a:xfrm'), qn('a:prstGeom'), qn('a:custGeom')):
            idx = list(spPr).index(el) + 1
    for el in fills:
        spPr.insert(idx, el)
        idx += 1


def set_gradient_fill(shape, grad, theme_bg=None):
    """многоцветный линейный градиент (угол по вектору x0,y0→x1,y1)"""
    stops = grad['stops']
    x0, y0, x1, y1 = grad.get('x0', 0), grad.get('y0', 0), grad.get('x1', 0), grad.get('y1', 1)
    dx, dy = x1 - x0, y1 - y0
    # OOXML: ang в 1/60000 градуса, 0 = слева-направо, по часовой
    import math
    ang = (math.degrees(math.atan2(dy, dx)) + 360) % 360
    spPr = shape.fill._xPr
    for tag in ('a:noFill', 'a:solidFill', 'a:gradFill', 'a:pattFill', 'a:blipFill', 'a:grpFill'):
        for el in spPr.findall(qn(tag)):
            spPr.remove(el)
    g = etree.SubElement(spPr, qn('a:gradFill'))
    g.set('rotWithShape', '1')
    gs_lst = etree.SubElement(g, qn('a:gsLst'))
    for pos, col in stops:
        gs = etree.SubElement(gs_lst, qn('a:gs'))
        gs.set('pos', str(int(round(float(pos) * 100000))))
        gs.append(_srgb(col, 1.0))
    lin = etree.SubElement(g, qn('a:lin'))
    lin.set('ang', str(int(round(ang * 60000))))
    lin.set('scaled', '0')
    _reorder_fill(spPr)


def set_line(shape, color=None, width=1, alpha=1.0, dash=None):
    ln = shape.line
    if color is None:
        shape.line.fill.background()
        return
    shape.line.width = Pt(max(0.5, width))
    ln_el = shape.line._get_or_add_ln()
    for el in ln_el.findall(qn('a:solidFill')):
        ln_el.remove(el)
    fill = etree.SubElement(ln_el, qn('a:solidFill'))
    fill.append(_srgb(color, alpha))
    # цвет линии должен идти до a:prstDash
    for el in ln_el.findall(qn('a:prstDash')):
        ln_el.remove(el)
    if dash:
        d = etree.SubElement(ln_el, qn('a:prstDash'))
        d.set('val', 'sysDot' if len(dash) and dash[0] <= 2 else 'dash')
    # caps
    ln_el.set('cap', 'flat')


def set_shadow(shape, sh):
    if not sh:
        return
    rgb, a0 = parse_color(sh.get('color', 'rgba(0,0,0,0.3)'))
    a = min(1.0, a0 * 1.35)
    spPr = shape._element.spPr
    for el in spPr.findall(qn('a:effectLst')):
        spPr.remove(el)
    eff = etree.SubElement(spPr, qn('a:effectLst'))
    shd = etree.SubElement(eff, qn('a:outerShdw'))
    shd.set('blurRad', str(int(round((sh.get('blur', 12) / 2) * PT))))
    dist = ((sh.get('x') or 0) ** 2 + (sh.get('y') or 0) ** 2) ** 0.5
    shd.set('dist', str(int(round(dist * PT))))
    import math
    ang = math.degrees(math.atan2(sh.get('y') or 0, sh.get('x') or 0)) if (sh.get('x') or sh.get('y')) else 90
    shd.set('dir', str(int(round(((ang + 360) % 360) * 60000))))
    shd.set('algn', 'ctr')
    shd.set('rotWithShape', '0')
    shd.append(_srgb(rgb, a))
    # эффекты должны быть после a:ln
    for el in list(spPr):
        if el.tag == qn('a:effectLst'):
            spPr.remove(el)
            spPr.append(el)


def no_shadow(shape):
    spPr = shape._element.spPr
    for el in spPr.findall(qn('a:effectLst')):
        spPr.remove(el)
    etree.SubElement(spPr, qn('a:effectLst'))


def set_text_frame(shape, op, fonts, mode):
    tf = shape.text_frame
    tf.word_wrap = False
    try:
        tf.auto_size = None
    except Exception:
        pass
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.TOP
    # фон и рамка текстового блока не нужны
    shape.fill.background()
    shape.line.fill.background()
    p = tf.paragraphs[0]
    align = {'left': PP_ALIGN.LEFT, 'right': PP_ALIGN.RIGHT, 'center': PP_ALIGN.CENTER}.get(op.get('align', 'left'), PP_ALIGN.LEFT)
    p.alignment = align
    run = p.add_run()
    run.text = op['s']

    size = op['size']
    weight = op['weight']
    fam = fonts['u'] if op.get('fam') == 'u' else fonts['o']
    safe = mode == 'safe'
    run.font.size = Pt(size)
    run.font.bold = (weight >= 600) if safe else weight >= 600
    run.font.name = fam
    rgb, a = parse_color(op['color'])
    run.font.color.rgb = rgb
    rPr = run._r.get_or_add_rPr()
    # латиница+кириллица одним шрифтом
    for tag in ('a:latin', 'a:cs', 'a:ea'):
        el = rPr.find(qn(tag))
        if el is None:
            el = etree.SubElement(rPr, qn(tag))
        el.set('typeface', fam)
    if a < 0.999:
        for el in rPr.findall(qn('a:solidFill')):
            rPr.remove(el)
        fill = etree.Element(qn('a:solidFill'))
        fill.append(_srgb(rgb, a))
        rPr.insert(0, fill)
    ls = op.get('ls') or 0
    if abs(ls) > 0.01:
        rPr.set('spc', str(int(round(ls * 100))))
    # межстрочный ровно 100%, чтобы позиция строки совпала с расчётом
    pPr = p._pPr if p._pPr is not None else p._p.get_or_add_pPr()
    ln = etree.SubElement(pPr, qn('a:lnSpc'))
    pct = etree.SubElement(ln, qn('a:spcPct'))
    pct.set('val', '100000')


def add_text(slide, op, fonts, mode, ascent):
    s = op['size']
    w = max(op.get('w') or 0, s * 0.55) + 2.0
    h = s * 1.40
    top = op['y'] - ascent * s
    align = op.get('align', 'left')
    if align == 'right':
        left = op['x'] - w
    elif align == 'center':
        left = op['x'] - w / 2
    else:
        left = op['x']
    box = slide.shapes.add_textbox(emu(left), emu(top), emu(w), emu(h))
    set_text_frame(box, op, fonts, mode)
    return box


def add_rrect(slide, op):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, emu(op['x']), emu(op['y']), emu(op['w']), emu(op['h']))
    shape.text_frame.word_wrap = False
    r = op.get('r') or 0
    if r:
        try:
            shape.adjustments[0] = min(0.5, r / max(1.0, min(op['w'], op['h']) / 2))
        except Exception:
            pass
    fill = op.get('fill')
    alpha = op.get('alpha', 1.0)
    if fill is None:
        shape.fill.background()
    elif isinstance(fill, dict) and fill.get('grad'):
        set_gradient_fill(shape, fill)
    elif isinstance(fill, str):
        set_solid_fill(shape, fill, alpha)
    else:
        shape.fill.background()
    if op.get('stroke'):
        set_line(shape, op['stroke'], op.get('strokeW', 1))
    else:
        shape.line.fill.background()
    if op.get('shadow'):
        strip_style(shape)
        set_shadow(shape, op['shadow'])
    else:
        strip_style(shape)
    return shape


def add_line(slide, op):
    from pptx.enum.shapes import MSO_CONNECTOR
    conn = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, emu(op['x1']), emu(op['y1']), emu(op['x2']), emu(op['y2']))
    set_line(conn, op['color'], op.get('w', 1), op.get('alpha', 1.0), op.get('dash'))
    strip_style(conn)
    return conn


def add_poly(slide, op):
    pts = op['pts']
    x0 = min(p[0] for p in pts)
    y0 = min(p[1] for p in pts)
    w = max(1.0, max(p[0] for p in pts) - x0)
    h = max(1.0, max(p[1] for p in pts) - y0)
    fb = slide.shapes.build_freeform(emu(pts[0][0]), emu(pts[0][1]), scale=1.0)
    fb.add_line_segments([(emu(p[0]), emu(p[1])) for p in pts[1:]], close=True)
    shape = fb.convert_to_shape()
    if op.get('fill'):
        set_solid_fill(shape, op['fill'], op.get('alpha', 1.0))
    else:
        shape.fill.background()
    if op.get('stroke'):
        set_line(shape, op['stroke'], op.get('strokeW', 1))
    else:
        shape.line.fill.background()
    strip_style(shape)
    return shape


def add_image(slide, op, img_dir):
    path = os.path.join(img_dir, op['file'])
    pic = slide.shapes.add_picture(path, emu(op['x']), emu(op['y']), emu(op['w']), emu(op['h']))
    c = op.get('crop') or {}
    if any(abs(c.get(k, 0)) > 0.001 for k in ('l', 't', 'r', 'b')):
        pic.crop_left = c.get('l', 0)
        pic.crop_right = c.get('r', 0)
        pic.crop_top = c.get('t', 0)
        pic.crop_bottom = c.get('b', 0)
    if op.get('clip') == 'round' and op.get('r'):
        # скругление через геометрию картинки
        pic._element.spPr.prstGeom.set('prst', 'roundRect')
        av = pic._element.spPr.prstGeom.find(qn('a:avLst'))
        if av is None:
            av = etree.SubElement(pic._element.spPr.prstGeom, qn('a:avLst'))
        gd = etree.SubElement(av, qn('a:gd'))
        gd.set('name', 'adj')
        gd.set('fmla', 'val %d' % int(round(min(0.5, op['r'] / max(1.0, min(op['w'], op['h']) / 2)) * 100000)))
    return pic


def add_overlay(slide, x, y, w, h, color):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, emu(x), emu(y), emu(w), emu(h))
    set_solid_fill(shape, color, 1.0)
    shape.line.fill.background()
    strip_style(shape)
    return shape


# ---------------------------------------------------------------- сборка

def build(scene_path, out_path, mode='safe', img_dir='assets/img'):
    scene = json.load(open(scene_path, encoding='utf-8'))
    fonts = FONTS[mode]
    prs = Presentation()
    prs.slide_width = emu(W_PT)
    prs.slide_height = emu(H_PT)
    blank = prs.slide_layouts[6]

    dark_bg = os.path.join('assets', 'img', 'bg-3d.png')
    stats = {}

    for s in scene['slides']:
        slide = prs.slides.add_slide(blank)
        for op in s['ops']:
            kind = op['op']
            stats[kind] = stats.get(kind, 0) + 1
            try:
                if kind == 'bg':
                    if op.get('kind') == 'paper':
                        add_overlay(slide, 0, 0, W_PT, H_PT, op.get('color', '#FFFFFF'))
                    else:
                        if os.path.exists(dark_bg):
                            slide.shapes.add_picture(dark_bg, 0, 0, emu(W_PT), emu(H_PT))
                        else:
                            add_overlay(slide, 0, 0, W_PT, H_PT, '#11141A')
                elif kind == 'rr':
                    add_rrect(slide, op)
                elif kind == 'line':
                    add_line(slide, op)
                elif kind == 'poly':
                    add_poly(slide, op)
                elif kind == 'text':
                    add_text(slide, op, fonts, mode, 0.90)
                elif kind == 'circle':
                    sh = slide.shapes.add_shape(MSO_SHAPE.OVAL, emu(op['cx'] - op['r']), emu(op['cy'] - op['r']), emu(op['r'] * 2), emu(op['r'] * 2))
                    if op.get('fill'):
                        set_solid_fill(sh, op['fill'], op.get('alpha', 1.0))
                    else:
                        sh.fill.background()
                    if op.get('stroke'):
                        set_line(sh, op['stroke'], op.get('strokeW', 1))
                    else:
                        sh.line.fill.background()
                    strip_style(sh)
                elif kind == 'image':
                    add_image(slide, op, img_dir)
                    g = op.get('grad')
                    if g and g.get('grad'):
                        gr = op['gradRect']
                        ov = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, emu(gr['x']), emu(gr['y']), emu(gr['w']), emu(gr['h']))
                        set_gradient_fill(ov, g)
                        ov.line.fill.background()
                        strip_style(ov)
                    if op.get('overlay'):
                        add_overlay(slide, op['x'], op['y'], op['w'], op['h'], op['overlay'])
            except Exception as e:  # не роняем сборку из-за одного объекта
                print(f'  !! слайд {s["num"]} {kind}: {e}')

    prs.core_properties.title = 'Стратегия Владивосток 2027 — Лемана ПРО'
    prs.core_properties.author = 'Лемана ПРО'
    prs.core_properties.subject = 'Трансформация магазина 75: шесть миров и вайтбокс, четыре рычага роста и один путь клиента'
    prs.save(out_path)
    print(f'{os.path.basename(out_path)}: {len(prs.slides.__iter__.__self__._sldIdLst)} слайдов, объектов: {sum(stats.values())}')
    return stats


if __name__ == '__main__':
    scene = sys.argv[1] if len(sys.argv) > 1 else 'out/scene-classic.json'
    out = sys.argv[2] if len(sys.argv) > 2 else 'out/presentation.pptx'
    mode = sys.argv[3] if len(sys.argv) > 3 else 'safe'
    build(scene, out, mode)
