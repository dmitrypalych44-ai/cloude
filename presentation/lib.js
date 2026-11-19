'use strict';
// Рендер-библиотека: 960x540, векторный текст, две темы (classic / 3d)
const fs = require('fs');
const path = require('path');
const { createCanvas, PDFDocument, GlobalFonts, Image } = require('@napi-rs/canvas');

const W = 960, H = 540;
const ML = 56, MR = 56, CW = W - ML - MR;

const warnings = [];
let _maxBottom = 0;
// ---- запись операций для экспорта в PPTX ----
let EMIT = null;
const GRAD = new WeakMap();
const MAPPED = new WeakMap();
let ctxCache = null;   // контекст, в котором создаются перекрашенные градиенты
let SHADOW = null, ALPHA = 1, DASH = null;
let CLIP = null;  // текущая область отсечения (для PPTX-экспорта изображений)
function setEmitter(fn) { EMIT = fn; }
function emit(op) {
  if (!EMIT) return;
  if (ALPHA !== 1) op.alpha = ALPHA;
  if (DASH && DASH.length) op.dash = DASH.slice();
  if (SHADOW) op.shadow = { ...SHADOW };
  EMIT(op);
}
function colorInfo(f) {
  if (!f) return null;
  if (typeof f === 'string') return f;
  const g = GRAD.get(f);
  return g ? { grad: true, ...g } : null;
}
let PAGE_MAP = null;
function setPageMap(m) { PAGE_MAP = m; }
function pageNum(n) {
  if (!PAGE_MAP) return n;
  if (PAGE_MAP.has(n)) return PAGE_MAP.get(n);
  if (PAGE_MAP.has(Number(n))) return PAGE_MAP.get(Number(n));
  return n;
}
function resetBottom() { _maxBottom = 0; }
function trackB(y) { if (y > _maxBottom) _maxBottom = y; }
function warn(page, msg) { warnings.push(`${page}: ${msg}`); }

// ---------- шрифты ----------
const FONT_DIR = path.join(__dirname, 'assets', 'fonts');
let fontsReady = false;
// режим «системных» шрифтов для PPTX (Arimo = метрики Arial, есть кириллица и ₽)
const PPTX_FONTS = process.env.PPTX_FONTS === 'safe';
function registerFonts() {
  if (fontsReady) return;
  if (PPTX_FONTS) {
    for (const f of ['Arimo-400', 'Arimo-700', 'Arimo-Italic-400', 'Arimo-Italic-700']) {
      try { GlobalFonts.registerFromPath(path.join(FONT_DIR, 'safe', `${f}.ttf`), f); } catch (e) { /* нет файла — не критично */ }
    }
  }
  for (const w of [300, 400, 500, 600, 700, 800]) {
    GlobalFonts.registerFromPath(path.join(FONT_DIR, `Onest-${w}.ttf`), `Onest-${w}`);
  }
  for (const w of [600, 800]) {
    GlobalFonts.registerFromPath(path.join(FONT_DIR, `Unbounded-${w}.ttf`), `Unbounded-${w}`);
  }
  fontsReady = true;
}
function tf(size, weight = 400, fam = 'o') {
  if (PPTX_FONTS) return `${weight >= 600 ? 700 : 400} ${size}px Arimo-${weight >= 600 ? 700 : 400}`;
  return `${weight} ${size}px ${fam === 'u' ? 'Unbounded' : 'Onest'}-${weight}`;
}

// ---------- палитра ----------
const C = {
  ink: '#232323', ink2: '#33352F', inkSoft: '#4C4F48', muted: '#7A7566', faint: '#A29B8C',
  paper: '#F4F1EC', paper2: '#E7E2D8', white: '#FFFFFF', line: '#DBD4C7', line2: '#C9C1B1',
  yellow: '#FFC61E', yellowDeep: '#E8A800', yellowSoft: '#FFF4D4', yellowMid: '#FFE9A8',
  dark: '#26282B', dark2: '#33363A',
  red: '#B4462F', green: '#3E7A52',
};

// ---------- темы ----------
const THEMES = {
  classic: {
    key: 'classic', dark: false,
    bg: C.paper, ink: C.ink, inkSoft: C.inkSoft, muted: C.muted, faint: C.faint,
    accent: C.yellow, accentDeep: C.yellowDeep, accentSoft: C.yellowSoft,
    card: C.white, cardEdge: C.line, cardAlt: '#FBF8F3',
    titleFam: 'o', titleW: 800, titleSize: 34,
    kicker: C.muted, lead: C.inkSoft, foot: '#9A9488', rule: C.line,
    shadow: { color: 'rgba(46,38,22,0.13)', blur: 16, y: 6 },
    shadowSoft: { color: 'rgba(46,38,22,0.08)', blur: 10, y: 3 },
    radius: 10,
  },
  // «3D-дизайн», но светлый: тёплая бумага, объёмные карточки, мягкие тени
  '3d': {
    key: '3d', dark: true, light: true,
    bg: '#F3F0E9', ink: '#1F2124', inkSoft: 'rgba(24,27,31,0.78)', muted: 'rgba(28,31,36,0.60)', faint: 'rgba(30,33,38,0.44)',
    accent: '#FFC61E', accentDeep: '#C98A00', accentSoft: '#FFF3CF',
    card: '#FFFFFF', cardEdge: 'rgba(38,33,22,0.10)', cardAlt: '#F8F5ED',
    titleFam: 'u', titleW: 800, titleSize: 27,
    kicker: '#C98A00', lead: 'rgba(24,27,31,0.74)', foot: 'rgba(30,33,38,0.50)', rule: 'rgba(38,33,22,0.13)',
    shadow: { color: 'rgba(58,46,22,0.20)', blur: 28, y: 12 },
    shadowSoft: { color: 'rgba(58,46,22,0.13)', blur: 16, y: 6 },
    radius: 18,
  },
};

// ---------- перевод «тёмного» дизайна в светлый ----------
// Слайды 3D-темы написаны под тёмную сцену. Чтобы получить тот же 3D-рисунок,
// но светлым, цвета не переписываем в 49 файлах, а переводим в момент рисования.
let LIGHT = false;          // включён ли перевод (задаётся сборкой по теме)
function setLight(v, ctx) { LIGHT = !!v; if (ctx) ctxCache = ctx; }
const LIGHT_MAP = {
  '#FFFFFF': '#1F2124', '#FFF': '#1F2124', '#fff': '#1F2124', '#ffffff': '#1F2124',
  '#241C00': '#241C00',
  // тёмные поверхности → светлые
  '#232932': '#FFFFFF', '#2B323C': '#FFFFFF', '#1B2028': '#F7F3EB', '#1A1F26': '#F3EEE4',
  '#2A313B': '#FFFDF8', '#191D25': '#F7F4ED', '#12151B': '#F2EEE6', '#0C0E13': '#EDE7DC',
  '#11141A': '#F3F0E9', '#3C3F43': '#D9D3C6', '#26282B': '#232629', '#33363A': '#33363A',
  // акценты, читаемые на светлом фоне
  '#FFD75E': '#FFD75E', '#DF9A00': '#C98A00', '#FFE39B': '#FFE9B8', '#E39B00': '#C98A00',
};
function mcFill(c) {
  // белые заливки (текст на тёмных плашках, «стекло») в светлой теме не трогаем
  if (!LIGHT || typeof c !== 'string' || /^#(fff|ffffff)$/i.test(c)) return c;
  const hit = LIGHT_MAP[c] || LIGHT_MAP[c.toUpperCase()];
  if (hit) return hit;
  const m = c.match(/^rgba\(255,255,255,([0-9.]+)\)$/);
  if (m) return `rgba(26,29,34,${Math.min(1, +m[1] * 1.25).toFixed(3)})`;
  const k = c.match(/^rgba\(0,0,0,([0-9.]+)\)$/);
  if (k) return `rgba(58,46,22,${(+k[1] * 0.5).toFixed(3)})`;
  return c;
}
function mcText(c) {
  if (!LIGHT || typeof c !== 'string') return c;
  const hit = LIGHT_MAP[c] || LIGHT_MAP[c.toUpperCase()];
  if (hit) return hit === '#FFFFFF' ? '#1F2124' : hit;
  const m = c.match(/^rgba\(255,255,255,([0-9.]+)\)$/);
  if (m) {
    const a = +m[1];
    const v = a >= 0.75 ? 0.86 : a >= 0.55 ? 0.66 : a >= 0.38 ? 0.52 : 0.34;
    return `rgba(24,27,31,${v})`;
  }
  // ярко-жёлтый текст на светлом фоне делаем янтарным
  if (/^#FFC61E$/i.test(c)) return '#B07A00';
  const y = c.match(/^rgba\(255,198,30,([0-9.]+)\)$/);
  if (y) return `rgba(176,122,0,${Math.min(1, +y[1] + 0.25).toFixed(2)})`;
  return c;
}
function mcShadow(c) {
  if (!LIGHT || typeof c !== 'string') return c;
  const k = c.match(/^rgba\(0,0,0,([0-9.]+)\)$/);
  if (k) return `rgba(58,46,22,${Math.min(1, +k[1] * 0.42).toFixed(3)})`;
  return c;
}
// градиенты перекрашиваются в момент создания (см. lg/rg)
function mappedGrad(g) { return g; }

// ---------- примитивы ----------
function shadow(ctx, s) {
  if (!s) return;
  s = { ...s, color: mcShadow(s.color) };
  SHADOW = { color: s.color, blur: s.blur, x: s.x || 0, y: s.y || 0 };
  ctx.shadowColor = s.color; ctx.shadowBlur = s.blur; ctx.shadowOffsetX = s.x || 0; ctx.shadowOffsetY = s.y || 0;
}
function noShadow(ctx) { SHADOW = null; ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }

function rr(ctx, x, y, w, h, r, fill, o = {}) {
  const _prevShadow = SHADOW;
  if (o.shadow) SHADOW = { color: mcShadow(o.shadow.color), blur: o.shadow.blur, x: o.shadow.x || 0, y: o.shadow.y || 0 };
  fill = mappedGrad(fill); fill = mcFill(fill);
  const _stroke = o.stroke ? mcFill(o.stroke) : null;
  emit({ op: 'rr', x, y, w, h, r: r || 0, fill: colorInfo(fill), stroke: _stroke, strokeW: o.strokeW || 1 });
  SHADOW = _prevShadow;
  ctx.beginPath();
  if (r > 0) ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); else ctx.rect(x, y, w, h);
  if (fill) { ctx.fillStyle = fill; shadow(ctx, o.shadow); ctx.fill(); noShadow(ctx); }
  if (_stroke) { ctx.strokeStyle = _stroke; ctx.lineWidth = o.strokeW || 1; ctx.stroke(); }
  trackB(y + h);
  return { x, y, w, h };
}
function rect(ctx, x, y, w, h, fill, o = {}) { return rr(ctx, x, y, w, h, 0, fill, o); }
function circle(ctx, cx, cy, r, fill, o = {}) {
  const _prevShadow = SHADOW;
  if (o.shadow) SHADOW = { color: mcShadow(o.shadow.color), blur: o.shadow.blur, x: o.shadow.x || 0, y: o.shadow.y || 0 };
  fill = mappedGrad(fill); fill = mcFill(fill);
  const _stroke = o.stroke ? mcFill(o.stroke) : null;
  emit({ op: 'circle', cx, cy, r, fill: colorInfo(fill), stroke: _stroke, strokeW: o.strokeW || 1 });
  SHADOW = _prevShadow;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; shadow(ctx, o.shadow); ctx.fill(); noShadow(ctx); }
  if (_stroke) { ctx.strokeStyle = _stroke; ctx.lineWidth = o.strokeW || 1; ctx.stroke(); }
}
function line(ctx, x1, y1, x2, y2, color, w = 1, dash) {
  DASH = dash;
  color = mcFill(color);
  emit({ op: 'line', x1, y1, x2, y2, color, w });
  DASH = null;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
}
function polyClip(pts) { return pts; }
function poly(ctx, pts, fill, o = {}) {
  if (o.clipSet) CLIP = pts;
  fill = mappedGrad(fill); fill = mcFill(fill);
  const _stroke = o.stroke ? mcFill(o.stroke) : null;
  emit({ op: 'poly', pts, fill: colorInfo(fill), stroke: _stroke, strokeW: o.strokeW || 1 });
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; shadow(ctx, o.shadow); ctx.fill(); noShadow(ctx); }
  if (_stroke) { ctx.strokeStyle = _stroke; ctx.lineWidth = o.strokeW || 1; ctx.stroke(); }
}
function lg(ctx, x0, y0, x1, y1, stops) {
  if (LIGHT) stops = stops.map(([p, c]) => [p, mcFill(c)]);
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [p, c] of stops) g.addColorStop(p, c);
  GRAD.set(g, { type: 'linear', x0, y0, x1, y1, stops });
  return g;
}
function rg(ctx, x0, y0, r0, x1, y1, r1, stops) {
  if (LIGHT) stops = stops.map(([p, c]) => [p, mcFill(c)]);
  const g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  for (const [p, c] of stops) g.addColorStop(p, c);
  GRAD.set(g, { type: 'radial', x0, y0, x1, y1, stops });
  return g;
}

// ---------- текст ----------
function setFont(ctx, o) {
  ctx.font = tf(o.size, o.weight === undefined ? 400 : o.weight, o.fam || 'o');
  ctx.letterSpacing = o.ls ? `${o.ls}px` : '0px';
}
function text(ctx, s, x, y, o = {}) {
  if (typeof o !== 'object' || typeof o.size !== 'number' || !isFinite(o.size)) {
    throw new Error(`text(): некорректный size у «${String(s).slice(0, 30)}» (${JSON.stringify(o)})`);
  }
  setFont(ctx, o);
  const _col = o.raw ? (o.color || C.ink) : mcText(o.color || C.ink);
  ctx.fillStyle = _col;
  ctx.textAlign = o.align || 'left';
  ctx.textBaseline = o.baseline || 'alphabetic';
  ALPHA = o.alpha === undefined ? 1 : o.alpha;
  emit({ op: 'text', s, x, y, size: o.size, weight: o.weight === undefined ? 400 : o.weight, fam: o.fam || 'o', color: _col, align: o.align || 'left', ls: o.ls || 0, w: ctx.measureText(s).width });
  ctx.globalAlpha = ALPHA;
  ctx.fillText(s, x, y);
  ALPHA = 1;
  trackB(y + o.size * 0.28);
  ctx.globalAlpha = 1; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px';
}
function measure(ctx, s, o) { setFont(ctx, o); const w = ctx.measureText(s).width; ctx.letterSpacing = '0px'; return w; }

function wrap(ctx, s, maxW, o) {
  const lines = [];
  for (const hard of String(s).split('\n')) {
    const words = hard.split(/\s+/).filter(Boolean);
    if (!words.length) { lines.push(''); continue; }
    let cur = words[0];
    for (let i = 1; i < words.length; i++) {
      const t = cur + ' ' + words[i];
      if (measure(ctx, t, o) <= maxW) cur = t;
      else { lines.push(cur); cur = words[i]; }
    }
    lines.push(cur);
  }
  return lines;
}

// абзац: возвращает высоту; при переполнении предупреждает
function para(ctx, s, x, y, maxW, o = {}) {
  const maxLines = o.maxLines || 99;
  const page = o.page || '?';
  let size = o.size;
  let lines = wrap(ctx, s, maxW, { ...o, size });
  // авто-подгон: если строк больше допустимого — уменьшаем кегль
  if (lines.length > maxLines) {
    const minSize = o.minSize || Math.max(8.4, o.size - 2.6);
    while (lines.length > maxLines && size > minSize) {
      size -= 0.2;
      lines = wrap(ctx, s, maxW, { ...o, size });
    }
  }
  if (lines.length > maxLines) { warn(page, `переполнение абзаца (${lines.length} > ${maxLines}): ${String(s).slice(0, 44)}…`); }
  const k = size / o.size;
  const lh = (o.lh || (o.size * 1.32)) * k;
  const n = Math.min(lines.length, maxLines);
  for (let i = 0; i < n; i++) text(ctx, lines[i], x, y + i * lh, { ...o, size });
  return n * lh;
}

// подгон размера под ширину
function fitSize(ctx, s, maxW, o, minSize = 11) {
  let size = o.size;
  while (size > minSize && measure(ctx, s, { ...o, size }) > maxW) size -= 0.5;
  return size;
}
function fitText(ctx, s, x, y, maxW, o = {}) {
  const size = fitSize(ctx, s, maxW, o, o.minSize || 11);
  text(ctx, s, x, y, { ...o, size });
  return size;
}

// ---------- изображения ----------
const imgCache = new Map();
function loadImg(rel) {
  if (imgCache.has(rel)) return imgCache.get(rel);
  const img = new Image();
  img.src = fs.readFileSync(path.join(__dirname, 'assets', 'img', rel));
  imgCache.set(rel, img);
  return img;
}
function ptsDummy() { return []; }
function ptsDummy2() { return []; }
function drawImg(ctx, rel, x, y, w, h, o = {}) {
  // на светлой сцене белый логотип меняем на тёмный
  if (LIGHT && rel === 'logo-light.png') rel = 'logo-dark.png';
  const img = loadImg(rel);
  ctx.save();
  if (o.clip === 'round') { ctx.beginPath(); ctx.roundRect(x, y, w, h, o.r || 12); ctx.clip(); }
  else if (o.clip === 'tri') { ctx.beginPath(); o.triPath(ctx); ctx.clip(); }
  else { ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); }
  const ar = img.width / img.height, boxAr = w / h;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ar > boxAr) { sw = img.height * boxAr; sx = (img.width - sw) / 2; }
  else { sh = img.width / boxAr; sy = (img.height - sh) / 2; }
  if (o.overlay) o = { ...o, overlay: mcFill(o.overlay) };
  emit({ op: 'image', file: rel, x, y, w, h, clip: o.clip || 'rect', r: o.r || 0, overlay: o.overlay || null,
    alpha: o.alpha === undefined ? 1 : o.alpha, region: CLIP,
    grad: o.grad ? colorInfo(o.grad) : null, gradRect: o.gradRect || { x, y, w, h },
    crop: { l: sx / img.width, t: sy / img.height, r: 1 - (sx + sw) / img.width, b: 1 - (sy + sh) / img.height } });
  ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.globalAlpha = 1;
  const gr = o.gradRect || { x, y, w, h };
  if (o.overlay) { ctx.fillStyle = o.overlay; ctx.fillRect(gr.x, gr.y, gr.w, gr.h); }
  if (o.grad) { ctx.fillStyle = o.grad; ctx.fillRect(gr.x, gr.y, gr.w, gr.h); }
  ctx.restore();
  return img;
}

// ---------- фоны ----------
function bgClassic(ctx, th) {
  emit({ op: 'bg', kind: 'paper', color: th.bg });
  ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H);
}
function bg3d(ctx) {
  emit({ op: 'bg', kind: 'dark' });
  ctx.fillStyle = lg(ctx, 0, 0, W * 0.6, H, [[0, '#191D25'], [0.55, '#12151B'], [1, '#0C0E13']]);
  ctx.fillRect(0, 0, W, H);
  // верхний свет
  ctx.fillStyle = rg(ctx, W * 0.78, -60, 20, W * 0.78, -60, 520, [[0, 'rgba(255,198,30,0.20)'], [1, 'rgba(255,198,30,0)']]);
  ctx.fillRect(0, 0, W, H);
  // сетка-пол
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.045)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 14; i++) {
    const x = -200 + i * 100;
    ctx.beginPath(); ctx.moveTo(W / 2 + (x - W / 2) * 0.35, H * 0.72); ctx.lineTo(x, H + 30); ctx.stroke();
  }
  for (let i = 1; i <= 7; i++) {
    const y = H * 0.72 + Math.pow(i / 7, 2.1) * (H * 0.30);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}
// ---------- фоны ----------
// Светлая «объёмная» сцена: тёплая бумага, мягкое жёлтое свечение сверху,
// лёгкий наклонный ритм полос — тот же 3D-характер, но без тёмного фона.
function bg3dLight(ctx) {
  emit({ op: 'bg', kind: 'paper', color: '#F3F0E9' });
  ctx.fillStyle = '#F3F0E9'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rg(ctx, W * 0.80, -70, 20, W * 0.80, -70, 520, [[0, 'rgba(255,198,30,0.26)'], [1, 'rgba(255,198,30,0)']]);
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rg(ctx, W * 0.05, H * 0.95, 20, W * 0.05, H * 0.95, 420, [[0, 'rgba(255,255,255,0.85)'], [1, 'rgba(255,255,255,0)']]);
  ctx.fillRect(0, 0, W, H);
  // тонкие диагональные линии «объёмной сцены»
  ctx.save();
  ctx.strokeStyle = 'rgba(38,33,22,0.05)'; ctx.lineWidth = 11;
  for (let i = 0; i < 9; i++) {
    const x = -120 + i * 150;
    ctx.beginPath(); ctx.moveTo(x, -40); ctx.lineTo(x + 300, H + 40); ctx.stroke();
  }
  ctx.restore();
}
function bg(ctx, th) { if (th.dark) bg3d(ctx); else if (th.volumetric) bg3dLight(ctx); else bgClassic(ctx, th); }

// ---------- карточки / панели ----------
function card(ctx, th, x, y, w, h, o = {}) {
  if (!th.dark) {
    const fill = o.fill || th.card;
    rr(ctx, x, y, w, h, o.r === undefined ? th.radius : o.r, fill, {
      stroke: o.stroke === false ? null : (o.stroke || th.cardEdge), strokeW: 1,
      shadow: o.flat ? null : (o.shadow || th.shadowSoft),
    });
    if (o.topAccent) {
      rr(ctx, x, y, w, 4, 2, o.topAccent);
    }
  } else {
    // в светлой 3D-сцене тёмные поверхности становятся светлыми (красим по LIGHT_MAP)
    const glass = th.light ? [[0, '#2B323C'], [1, '#1B2028']] : [[0, '#2B323C'], [1, '#1B2028']];
    const fill = o.fill || lg(ctx, x, y, x, y + h, glass);
    rr(ctx, x, y, w, h, o.r === undefined ? th.radius : o.r, fill, {
      stroke: o.stroke || th.cardEdge, strokeW: 1, shadow: o.flat ? null : (o.shadow || (th.light ? th.shadowSoft : th.shadow)),
    });
    // блик сверху (в светлой теме не нужен)
    if (!th.light) rr(ctx, x, y, w, 26, o.r === undefined ? th.radius : o.r, lg(ctx, x, y, x, y + 26, [[0, 'rgba(255,255,255,0.10)'], [1, 'rgba(255,255,255,0)']]));
    if (o.topAccent) rr(ctx, x, y, w, 3, 2, o.topAccent);
  }
}

// 3D-плашка (жёлтая, объёмная)
function bar3d(ctx, x, y, w, h, o = {}) {
  const c1 = o.c1 || '#FFD65C', c2 = o.c2 || '#E9A100';
  rr(ctx, x, y + 4, w, h, o.r || 8, lg(ctx, x, y, x, y + h, [[0, '#000000'], [1, '#000000']]), { shadow: { color: 'rgba(0,0,0,0.35)', blur: 14, y: 6 } });
  ctx.save();
  ctx.globalAlpha = 0.001; // заглушка, чтобы тень сработала выше
  ctx.restore();
  rr(ctx, x, y, w, h, o.r || 8, lg(ctx, x, y, x, y + h, [[0, c1], [1, c2]]), {});
  // верхний блик
  rr(ctx, x, y, w, h * 0.5, o.r || 8, lg(ctx, x, y, x, y + h * 0.45, [[0, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]));
}

// ---------- знак-домик Лемана ПРО ----------
function houseMark(ctx, x, y, w, o = {}) {
  const s = w / 100;
  poly(ctx, [[x + 50 * s, y], [x + 100 * s, y + 48 * s], [x + 100 * s, y + 118 * s], [x, y + 118 * s], [x, y + 48 * s]], o.color || C.yellow, {});
  poly(ctx, [[x + 50 * s, y + 40 * s], [x + 74 * s, y + 63 * s], [x + 74 * s, y + 100 * s], [x + 26 * s, y + 100 * s], [x + 26 * s, y + 63 * s]], o.door || '#FFFFFF', {});
}

// ---------- правый верхний угол: жёлтая полоса и знак-домик ----------
function cornerMark(ctx, th) {
  poly(ctx, [[W - 150, 0], [W, 0], [W, 46]], 'rgba(255,198,30,0.13)', {});
  houseMark(ctx, W - 58, 9, 30, { door: '#F3F0E9' });
  poly(ctx, [[W - 12, 0], [W, 0], [W, H], [W - 12, H]], 'rgba(255,198,30,0.85)', {});
}

// ---------- шапка слайда ----------
function header(ctx, th, p, o) {
  const { kicker, title, lead, note } = o;
  const page = p;
  bg(ctx, th);
  let cy = 0;
  if (th.light) cornerMark(ctx, th);
  if (kicker) {
    if (!th.dark) {
      rect(ctx, ML, 32, 24, 3, th.accent);
      text(ctx, kicker.toUpperCase(), ML + 33, 37, { size: 10.5, weight: 700, ls: 1.8, color: th.kicker });
    } else {
      text(ctx, kicker.toUpperCase(), ML, 37, { size: 10.5, weight: 700, ls: 2.1, color: th.accent });
    }
    cy = 37;
  }
  // заголовок (до 2 строк)
  const ts = o.titleSize || th.titleSize;
  const tls = th.dark ? -0.4 : -0.6;
  const tLines = wrap(ctx, title, CW - 4, { size: ts, weight: th.titleW, fam: th.titleFam, ls: tls });
  if (tLines.length > 2) warn(page, `заголовок > 2 строк: ${title}`);
  const lhT = ts * 1.18;
  const baseY = cy + (kicker ? 34 : 30);
  tLines.slice(0, 2).forEach((l, i) => {
    text(ctx, l, ML, baseY + i * lhT, { size: ts, weight: th.titleW, fam: th.titleFam, color: th.ink, ls: tls });
  });
  cy = baseY + (Math.min(tLines.length, 2) - 1) * lhT;
  if (o.rule !== false && !th.dark) { /* линия под шапкой рисуется ниже */ }
  if (lead) {
    const base = o.leadSize || (th.dark ? 15 : 16);
    let lsz = base, lines = wrap(ctx, lead, CW - 16, { size: lsz, weight: 400 });
    while (lines.length > 1 && lsz > base - 3.5) {
      lsz -= 0.5;
      lines = wrap(ctx, lead, CW - 16, { size: lsz, weight: 400 });
    }
    const startY = cy + 26;
    const used = para(ctx, lead, ML, startY, CW - 16, { size: lsz, weight: 400, color: th.lead, lh: lsz * 1.3, page, maxLines: 2 });
    cy = startY + used - lsz * 1.3 + 7;
  } else {
    cy = cy + 8;
  }
  if (note) {
    cy += 16;
    const used = para(ctx, note, ML, cy, CW - 16, { size: 11, weight: 400, color: th.muted, lh: 14, page, maxLines: 2 });
    cy += used;
  }
  return Math.round(cy + (o.gap === undefined ? 14 : o.gap));
}

function footer(ctx, th, sources, num) {
  if (_maxBottom > H - 36) warn(num, `контент заходит в подвал: низ ${Math.round(_maxBottom)} > ${H - 36}`);
  line(ctx, ML, H - 34, W - MR, H - 34, th.dark ? 'rgba(255,255,255,0.10)' : '#DED7C9', 1);
  if (sources) {
    const fs2 = th.dark ? 7.8 : 8.6;
    let lines = wrap(ctx, sources, CW - 60, { size: fs2 });
    let sz = fs2;
    while (lines.length > 2 && sz > 6.6) { sz -= 0.2; lines = wrap(ctx, sources, CW - 60, { size: sz }); }
    const use = lines.slice(0, 2);
    use.forEach((l, i) => text(ctx, l, ML, H - (use.length > 1 ? 22 : 20) + i * (sz * 1.22), { size: sz, color: th.foot }));
    if (lines.length > 2) warn(num, 'сноска обрезана');
  }
  text(ctx, String(pageNum(num)), W - MR, H - 18, { size: 11, weight: 600, color: th.faint, align: 'right' });
}

// ---------- KPI ----------
function kpi(ctx, th, x, y, w, h, o) {
  card(ctx, th, x, y, w, h, { topAccent: th.dark ? null : (o.accent === undefined ? th.accent : o.accent), shadow: o.flat ? null : undefined });
  if (th.dark && o.accent !== null) rr(ctx, x + 18, y + 11, 20, 2.5, 1.5, th.accent);
  const padX = th.dark ? 18 : 16;
  const padT = th.dark ? 21 : (o.accent === null ? 14 : 18);
  const ls = o.labelSize || 9.4;
  const ns = o.noteSize || 9.6;
  let noteLines = o.note ? wrap(ctx, o.note, w - padX * 2, { size: ns }) : [];
  let noteSize = ns;
  while (noteLines.length > 1 && noteSize > 7.6) { noteSize -= 0.2; noteLines = wrap(ctx, o.note, w - padX * 2, { size: noteSize }); }
  const noteBlock = noteLines.length * (noteSize * 1.24);
  if (o.label) {
    let lsz = ls;
    let lines = wrap(ctx, o.label.toUpperCase(), w - padX * 2, { size: lsz, weight: 600, ls: 0.8 });
    while (lines.length > 1 && lsz > 6.6) { lsz -= 0.2; lines = wrap(ctx, o.label.toUpperCase(), w - padX * 2, { size: lsz, weight: 600, ls: 0.8 }); }
    text(ctx, lines.join(' '), x + padX, y + padT + lsz * 0.72, { size: lsz, weight: 600, ls: 0.8, color: th.muted });
  }
  let vsize = o.size || 24;
  // цифра не должна «наезжать» на подпись под ней: считаем по реальной ширине строки
  if (o.value) {
    const room = w - padX * 2;
    while (vsize > 11 && measure(ctx, o.value, { size: vsize, weight: 800, ls: -0.8 }) > room) vsize -= 0.4;
  }
  // подпись считается по фактическому кеглю (он мог уменьшиться при переносе)
  let labelSize = ls;
  if (o.label) {
    let lsz = ls;
    let wl = wrap(ctx, o.label.toUpperCase(), w - padX * 2, { size: lsz, weight: 600, ls: 0.8 });
    while (wl.length > 1 && lsz > 6.6) { lsz -= 0.2; wl = wrap(ctx, o.label.toUpperCase(), w - padX * 2, { size: lsz, weight: 600, ls: 0.8 }); }
    labelSize = lsz;
  }
  const minTop = y + padT + labelSize * 1.15 + 7;
  let valueBase = y + h - 12 - noteBlock + (o.note ? 0 : 2);
  while (valueBase - vsize * 0.76 < minTop && vsize > 11) vsize -= 0.5;
  if (valueBase - vsize * 0.76 < minTop) valueBase = minTop + vsize * 0.76;
  // …и не должна задевать выносными элементами подпись снизу (только если места совсем нет)
  if (o.note) {
    const noteTop = y + h - 11 - noteBlock + noteSize * 0.92 - noteSize * 0.78;
    while (valueBase + vsize * 0.24 > noteTop && vsize > 15) vsize -= 0.5;
  }
  if (o.value) {
    fitText(ctx, o.value, x + padX, valueBase, w - padX * 2, { size: vsize, weight: 800, color: o.valueColor || th.ink, ls: -0.8, minSize: 11 });
  }
  if (o.note) {
    noteLines.forEach((l, i) => text(ctx, l, x + padX, y + h - 11 - noteBlock + noteSize * 0.92 + i * (noteSize * 1.24), { size: noteSize, color: o.noteColor || (th.dark ? 'rgba(255,255,255,0.52)' : C.muted) }));
  }
}

module.exports = {
  W, H, ML, MR, CW, C, THEMES, warnings, warn, registerFonts, tf, text, measure, wrap, para, fitText, fitSize,
  rr, rect, circle, line, poly, lg, rg, card, bar3d, header, footer, kpi, bg, bg3d, bgClassic, drawImg, shadow, noShadow,
  createCanvas, PDFDocument, resetBottom, getBottom: () => _maxBottom, setEmitter, setLight, mcFill, mcText, houseMark, cornerMark, setPageMap, pageNum,
  setClip: (v) => { CLIP = v; },
};
