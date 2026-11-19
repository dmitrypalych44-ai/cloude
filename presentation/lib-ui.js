'use strict';
// Расширенный набор блоков верстки, общий для двух тем
const L = require('./lib');
const { C, text, wrap, para, measure, fitText, rr, rect, circle, line, poly, lg, rg, card, bg, shadow, noShadow } = L;

const gapX = 12;

// ---------- служебное ----------
function panelHead(ctx, th, x, y, w, label, o = {}) {
  const txt = label.toUpperCase();
  if (th.dark) {
    const size = o.size || 10;
    const maxW = (w || 1e4) - 14;
    // подгоняем кегль/разрядку, чтобы длинный заголовок не выходил за панель
    let sz = size, ls = 1.6;
    while (sz > 7 && measure(ctx, txt, { size: sz, weight: 700, ls }) > maxW) {
      sz -= 0.2; ls = Math.max(0.4, ls - 0.1);
    }
    text(ctx, txt, x, y, { size: sz, weight: 700, ls, color: o.color || th.accent });
    return y + 14;
  }
  rect(ctx, x, y - 7, 4, 12, th.accent);
  const size = o.size || 10;
  const maxW = (w || 1e4) - 14;
  let sz = size, ls = 1.4;
  while (sz > 7 && measure(ctx, txt, { size: sz, weight: 700, ls }) > maxW) {
    sz -= 0.2; ls = Math.max(0.4, ls - 0.1);
  }
  text(ctx, txt, x + 11, y, { size: sz, weight: 700, ls, color: o.color || C.inkSoft });
  return y + 14;
}

// ---------- KPI ----------
function kpiRow(ctx, th, x, y, w, h, items, o = {}) {
  const gap = o.gap === undefined ? 12 : o.gap;
  const n = items.length;
  const cw = (w - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    L.kpi(ctx, th, x + i * (cw + gap), y, cw, h, {
      label: it.label, value: it.value, note: it.note,
      valueColor: it.color, accent: it.accent === null ? null : (it.accent || o.accent),
      size: it.size || o.size, noteSize: o.noteSize || 10, labelSize: o.labelSize || 9.5,
    });
    if (it.tag) {
      const tw = measure(ctx, it.tag, { size: 9.5, weight: 700 }) + 16;
      rr(ctx, x + i * (cw + gap) + 14, y + h - 12, tw, 17, 8, th.dark ? 'rgba(255,198,30,0.18)' : C.yellowSoft);
      text(ctx, it.tag, x + i * (cw + gap) + 22, y + h - 0.5, { size: 9.5, weight: 700, color: th.dark ? th.accent : C.yellowDeep });
    }
  });
  return y + h;
}

// Ширина строки так, как её реально нарисует text() (с учётом letterSpacing)
function textW(ctx, str, o = {}) {
  return measure(ctx, str, o) + (o.ls ? o.ls * Math.max(0, String(str).length - 1) : 0);
}

// Строка в две колонки: левая часть не наезжает на правую
function row2(ctx, th, left, right, x, y, xr, o = {}) {
  const size = o.size || 10;
  const gapMin = o.gapMin === undefined ? 16 : o.gapMin;
  const roomForLeft = xr - x - gapMin;
  let lsz = size;
  while (lsz > 7.5 && textW(ctx, left, { size: lsz, weight: o.weight || 400 }) > roomForLeft) lsz -= 0.2;
  text(ctx, left, x, y, { size: lsz, weight: o.weight || 400, color: o.color || th.inkSoft });
  text(ctx, right, xr, y, { size: o.sizeR || size, weight: o.weightR || 700, color: o.colorR || th.ink, align: 'right' });
}

// ---------- Панель с заголовком ----------
function panel(ctx, th, x, y, w, h, title, o = {}) {
  card(ctx, th, x, y, w, h, o);
  if (title) panelHead(ctx, th, x + 18, y + 30, w - 36, title, o);
  return y + (title ? 46 : 16);
}

// ---------- Маркированный список ----------
function bullets(ctx, th, x, y, w, items, o = {}) {
  const size = o.size || 11.5;
  const lh = o.lh || size * 1.36;
  const gap = o.gap === undefined ? 6 : o.gap;
  let cy = y;
  items.forEach((it) => {
    const s = typeof it === 'string' ? it : it.t;
    const mark = typeof it === 'string' ? 'dash' : (it.mark || 'dash');
    if (mark === 'dash') {
      if (!th.dark) rect(ctx, x, cy - size * 0.42, 9, 2, th.accent);
      else rect(ctx, x, cy - size * 0.42, 9, 2, th.accent);
      const h = para(ctx, s, x + 16, cy, w - 16, { size, lh, color: o.color || th.inkSoft, page: o.page, maxLines: o.maxLines || 3 });
      cy += Math.max(h, lh) + gap - (lh - size * 1.36) * 0;
      cy += 0;
    } else if (mark === 'num') {
      text(ctx, it.n, x, cy, { size, weight: 800, color: th.dark ? th.accent : C.yellowDeep });
      const h = para(ctx, s, x + 22, cy, w - 22, { size, lh, color: o.color || th.inkSoft, page: o.page, maxLines: o.maxLines || 3 });
      cy += Math.max(h, lh) + gap;
    } else {
      circle(ctx, x + 3, cy - size * 0.3, 2.2, th.dark ? th.accent : C.yellowDeep);
      const h = para(ctx, s, x + 14, cy, w - 14, { size, lh, color: o.color || th.inkSoft, page: o.page, maxLines: o.maxLines || 3 });
      cy += Math.max(h, lh) + gap;
    }
  });
  return cy;
}

// ---------- Сетка нумерованных инициатив ----------
function numGrid(ctx, th, x, y, w, h, items, cols, o = {}) {
  const gap = o.gap === undefined ? 12 : o.gap;
  const rows = Math.ceil(items.length / cols);
  const cw = (w - gap * (cols - 1)) / cols;
  const ch = (h - gap * (rows - 1)) / rows;
  items.forEach((it, i) => {
    const cx = x + (i % cols) * (cw + gap);
    const cy = y + Math.floor(i / cols) * (ch + gap);
    card(ctx, th, cx, cy, cw, ch, { r: o.r, shadow: o.flat ? null : undefined });
    const padX = th.dark ? 18 : 16;
    if (it.n) {
      if (!th.dark) {
        rr(ctx, cx + padX, cy + 16, 24, 24, 6, C.dark);
        text(ctx, it.n, cx + padX + 12, cy + 32, { size: 10.5, weight: 700, color: '#fff', align: 'center' });
      } else {
        rr(ctx, cx + padX, cy + 16, 26, 26, 8, lg(ctx, cx, cy, cx + 26, cy + 26, [[0, '#FFD75E'], [1, '#E39B00']]));
        text(ctx, it.n, cx + padX + 13, cy + 33, { size: 10.5, weight: 800, color: '#241C00', align: 'center' });
      }
    }
    const tx = it.n ? cx + padX + 34 : cx + padX;
    const tw2 = cw - (it.n ? padX * 2 + 34 : padX * 2);
    fitText(ctx, it.title, tx, cy + (it.n ? 33 : 30), tw2, { size: o.titleSize || 12, weight: 700, color: th.ink, minSize: 9.5 });
    para(ctx, it.text, cx + padX, cy + (it.n ? 52 : 46), cw - padX * 2, {
      size: o.size || 10.5, lh: o.lh || 14, color: th.inkSoft, page: o.page, maxLines: o.maxLines || 4,
    });
    if (it.tag) {
      const tw = measure(ctx, it.tag, { size: 9, weight: 700 }) + 14;
      if (!th.dark) {
        rr(ctx, cx + padX, cy + ch - 24, tw, 16, 8, C.yellowSoft);
        text(ctx, it.tag, cx + padX + 7, cy + ch - 12, { size: 9, weight: 700, color: C.yellowDeep });
      } else {
        rr(ctx, cx + padX, cy + ch - 26, tw, 17, 8.5, 'rgba(255,198,30,0.16)');
        text(ctx, it.tag, cx + padX + 7, cy + ch - 13, { size: 9, weight: 700, color: th.accent });
      }
    }
  });
  return y + h;
}

// ---------- Шаги / этапы ----------
function stepsRow(ctx, th, x, y, w, h, items, o = {}) {
  const gap = o.gap === undefined ? 10 : o.gap;
  const n = items.length;
  const cw = (w - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    const cx = x + i * (cw + gap);
    if (!th.dark) {
      rr(ctx, cx, y, cw, h, 8, it.hot ? th.accent : '#EFEAE1', { stroke: it.hot ? null : th.cardEdge });
      text(ctx, it.k, cx + 14, y + 22, { size: 9, weight: 700, ls: 1.2, color: it.hot ? 'rgba(0,0,0,0.55)' : C.faint });
      para(ctx, it.t, cx + 14, y + 40, cw - 24, { size: o.size || 10.5, lh: 13, weight: 600, color: it.hot ? C.ink : C.inkSoft, page: o.page, maxLines: 3 });
      if (it.star) text(ctx, '★', cx + cw - 16, y + 20, { size: 11, color: C.ink, align: 'right' });
    } else {
      const fill = it.hot ? lg(ctx, cx, y, cx, y + h, [[0, '#FFD75E'], [1, '#DF9A00']]) : lg(ctx, cx, y, cx, y + h, [[0, '#2A313B'], [1, '#1A1F26']]);
      rr(ctx, cx, y, cw, h, 10, fill, { stroke: it.hot ? null : th.cardEdge, shadow: th.shadowSoft });
      text(ctx, it.k, cx + 14, y + 22, { size: 9, weight: 700, ls: 1.2, color: it.hot ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.45)' });
      para(ctx, it.t, cx + 14, y + 40, cw - 24, { size: o.size || 10.5, lh: 13, weight: 600, color: it.hot ? '#241C00' : '#fff', page: o.page, maxLines: 3 });
      if (it.star) text(ctx, '★', cx + cw - 16, y + 20, { size: 11, color: it.hot ? '#241C00' : th.accent, align: 'right' });
    }
  });
  return y + h;
}

// ---------- Таблица ----------
function table(ctx, th, x, y, w, head, rows, widths, o = {}) {
  const size = o.size || 10.5;
  const rowH = o.rowH || 34;
  const padX = 12;
  // шапка
  if (head) {
    if (!th.dark) line(ctx, x, y, x + w, y, th.line2, 1);
    head.forEach((t, i) => {
      const cx = x + widths.slice(0, i).reduce((a, b) => a + b, 0);
      text(ctx, t.toUpperCase(), cx + (i === 0 ? 0 : padX), y + 14, { size: 8.8, weight: 700, ls: 1.1, color: th.muted });
    });
    y += 24;
  }
  let cy = y;
  rows.forEach((r, ri) => {
    const heights = r.map((cell, ci) => {
      const cw = widths[ci] - (ci === 0 ? 0 : padX * 2);
      return wrap(ctx, String(cell || ''), cw, { size, weight: ci === 0 ? 600 : 400 }).length * size * 1.28;
    });
    const rh = Math.max(o.rowH || 30, Math.max(...heights) + 14);
    if (!th.dark) {
      if (ri % 2 === 0) rr(ctx, x - 8, cy, w + 8, rh, 4, '#EDE8DE');
      else line(ctx, x - 8, cy + rh, x + w, cy + rh, th.line, 1);
    } else {
      rr(ctx, x - 8, cy + 1, w + 8, rh - 2, 6, 'rgba(255,255,255,0.035)');
    }
    r.forEach((cell, ci) => {
      const cx = x + widths.slice(0, ci).reduce((a, b) => a + b, 0);
      const cw = widths[ci] - (ci === 0 ? 0 : padX * 2);
      para(ctx, String(cell || ''), cx + (ci === 0 ? 8 : padX), cy + rh / 2 - (wrap(ctx, String(cell || ''), cw, { size }).length - 1) * size * 0.62 + size * 0.2, cw, {
        size, lh: size * 1.28, weight: ci === 0 ? 600 : 400, color: ci === 0 ? th.ink : th.inkSoft, page: o.page, maxLines: 4,
      });
    });
    cy += rh;
  });
  if (!th.dark) line(ctx, x - 8, cy, x + w, cy, th.line2, 1);
  return cy;
}

// ---------- Бейдж / чип ----------
function chip(ctx, th, x, y, label, o = {}) {
  const size = o.size || 9.5;
  const w = measure(ctx, label, { size, weight: 700, ls: o.ls || 0.4 }) + 20;
  if (!th.dark) rr(ctx, x, y, w, o.h || 20, (o.h || 20) / 2, o.bg || C.yellowSoft, { stroke: o.stroke || null });
  else rr(ctx, x, y, w, o.h || 20, (o.h || 20) / 2, o.bg || 'rgba(255,198,30,0.15)', { stroke: o.stroke || 'rgba(255,198,30,0.35)' });
  text(ctx, label, x + w / 2, y + (o.h || 20) / 2 + size * 0.36, { size, weight: 700, color: o.color || (th.dark ? th.accent : C.yellowDeep), align: 'center', ls: o.ls || 0.4 });
  return w;
}

// ---------- Прогресс ----------
function progress(ctx, th, x, y, w, h, frac, o = {}) {
  rr(ctx, x, y, w, h, h / 2, th.dark ? 'rgba(255,255,255,0.12)' : '#E6E0D4');
  const fw = Math.max(h, w * Math.max(0, Math.min(1, frac)));
  if (!th.dark) rr(ctx, x, y, fw, h, h / 2, o.color || lg(ctx, x, y, x + fw, y, [[0, '#FFD356'], [1, '#F0AE00']]));
  else rr(ctx, x, y, fw, h, h / 2, o.color || lg(ctx, x, y, x + fw, y, [[0, '#FFE08A'], [1, '#E39B00']]), { shadow: { color: 'rgba(255,198,30,0.45)', blur: 12, y: 0 } });
  return y + h;
}

// ---------- Большая цифра ----------
function bigStat(ctx, th, x, y, w, value, label, note, o = {}) {
  fitText(ctx, value, x, y, w, { size: o.size || 34, weight: 800, color: o.color || th.ink, ls: -1.2, minSize: 16 });
  if (label) text(ctx, label.toUpperCase(), x, y + 18, { size: 9.5, weight: 700, ls: 1.3, color: th.muted });
  if (note) para(ctx, note, x, y + 34, w, { size: 10, lh: 13, color: th.inkSoft, page: o.page, maxLines: 2 });
}

// ---------- Акцентная полоса-вывод ----------
function band(ctx, th, x, y, w, h, text_, o = {}) {
  if (!th.dark) {
    rr(ctx, x, y, w, h, 8, o.bg || '#FBF3DC', { stroke: o.stroke || null });
    rect(ctx, x, y, 4, h, th.accent);
  } else {
    rr(ctx, x, y, w, h, 12, lg(ctx, x, y, x + w, y + h, [[0, 'rgba(255,198,30,0.20)'], [1, 'rgba(255,198,30,0.07)']]), { stroke: 'rgba(255,198,30,0.34)', shadow: th.shadowSoft });
    rect(ctx, x, y + 6, 3, h - 12, th.accent);
  }
  const size = o.size || 11;
  const lines = wrap(ctx, text_, w - 44, { size, weight: o.weight || 400 });
  const lh = size * 1.34;
  const startY = y + h / 2 - (lines.length - 1) * lh / 2 + size * 0.34;
  lines.slice(0, o.maxLines || 3).forEach((l, i) => text(ctx, l, x + 20, startY + i * lh, { size, weight: o.weight || 400, color: o.color || th.inkSoft }));
  if (o.label) text(ctx, o.label.toUpperCase(), x + 20, y - 8, { size: 9, weight: 700, ls: 1.2, color: th.muted });
  return y + h;
}

// ---------- Выноска-заголовок блока (для 3D — с неоновой подложкой) ----------
function blockTitle(ctx, th, x, y, w, s, o = {}) {
  if (!th.dark) {
    text(ctx, s, x, y, { size: o.size || 13, weight: 700, color: C.ink });
  } else {
    text(ctx, s, x, y, { size: (o.size || 13) - 1, weight: 700, fam: 'u', color: '#fff', ls: -0.3 });
  }
  return y;
}

module.exports = {
  ...L,
  panelHead, kpiRow, panel, bullets, numGrid, stepsRow, table, chip, progress, bigStat, band, blockTitle, gapX, textW, row2,
};
