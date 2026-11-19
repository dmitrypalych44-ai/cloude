'use strict';
// Слайд «Сводные результаты · FY24 — FY26» (по макету заказчика)
const U = require('./lib-ui');
const { C, W, H, ML, MR, CW, text, para, wrap, measure, fitText, rr, rect, circle, line, poly, lg, rg, card, bg, drawImg } = U;
const TH_LIGHT = !!U.THEMES['3d'].light;

// эталон: 1240 × 700 pt из макета → коэффициенты пересчёта в 960 × 540
const KX = W / 1240, KY = H / 700;

const DATA = [
  { name: 'FY24 · факт', turn: '8,40', turnD: '+8%', gmv: '8,60', gmvD: '+9%', ebit: '0,70', ebitD: '−3%', ratio: '10%' },
  { name: 'FY25 · факт', turn: '7,92', turnD: '−6%', gmv: '8,15', gmvD: '−5%', ebit: '0,92', ebitD: '+29%', ratio: '14%' },
  { name: 'FY26 · факт', turn: '8,88', turnD: '+12%', gmv: '9,17', gmvD: '+13%', ebit: '1,23', ebitD: '+31%', ratio: '16%', hot: true },
  { name: '2027 · кадраж', turn: '9,08', turnD: '+2%', gmv: '9,41', gmvD: '+3%', ebit: '1,21', ebitD: '−1%', ratio: '16%' },
  { name: '2028 · кадраж', turn: '9,78', turnD: '+10%', gmv: '10,12', gmvD: '+10%', ebit: '1,33', ebitD: '+8%', ratio: '16,0%' },
  { name: '2027 · амбиция (с ПЦ)', turn: '10,18', turnD: '+15%', gmv: '10,52', gmvD: '+15%', ebit: '1,38', ebitD: '+12%', ratio: '16%', goal: true },
];

const KPIS = [
  { label: 'Оборот товаров 4Р с НДС', value: '8,88 млрд ₽', note: '+12% к FY25' },
  { label: 'GMV итого с НДС', value: '9,17 млрд ₽', note: '+13% к FY25' },
  { label: 'Результат хоз. деятельности', value: '1,23 млрд ₽', note: '+31% к FY25' },
  { label: 'РХД к GMV', value: '16%', note: '+2 п.п. к FY25 · было 14%' },
];

function slide(ctx, th) {
  const d = th.dark;
  bg(ctx, th);
  if (th.light) U.cornerMark(ctx, th);

  // ---- заголовок
  text(ctx, 'СВОДНЫЕ РЕЗУЛЬТАТЫ · FY24 — FY26', ML, 64, { size: 24, weight: 800, fam: th.light ? 'u' : 'o', color: th.ink, ls: -0.5 });
  text(ctx, 'Итоги 2026: оборот 8,88 млрд ₽, GMV 9,17 млрд ₽ и РХД 1,23 млрд ₽', ML, 98, { size: 14, color: th.inkSoft });
  text(ctx, 'Три года факта, кадраж и амбиция 2027–2028 · все суммы в млрд ₽ · рост год к году', ML, 120, { size: 10.4, color: th.muted });
  rect(ctx, ML, 136, 96, 3, C.yellow);
  rect(ctx, ML + 104, 136, 700, 1, th.line);

  // ---- четыре KPI-карточки с жёлтым уголком
  const ky = 152, kh = 84, gap = 14;
  const kw = (CW - gap * 3) / 4;
  KPIS.forEach((k, i) => {
    const x = ML + i * (kw + gap);
    card(ctx, th, x, ky, kw, kh, { r: th.light ? 3 : 12 });
    rect(ctx, x, ky, kw, 3, C.yellow);
    poly(ctx, [[x + kw - 27, ky], [x + kw - 3, ky], [x + kw - 3, ky + 24]], C.yellow, {});
    text(ctx, k.label, x + 16, ky + 30, { size: 9.2, color: th.muted });
    fitText(ctx, k.value, x + 16, ky + 62, kw - 32, { size: 24, weight: 800, color: th.ink, ls: -0.8, minSize: 15 });
    text(ctx, k.note, x + 16, ky + 79, { size: 9.2, weight: 700, color: C.yellowDeep });
  });

  // ---- таблица: шапка тёмной плашкой, строки «зеброй»
  const ty = ky + kh + 16;  // 252
  // правые края колонок — из макета 1240 pt, пересчитанные в наши 960
  const RIGHT = [285, 406, 549, 608, 751, 796, 904];
  const LEFT = ML + 14;
  const rowH = 26;
  // шапка
  rr(ctx, ML, ty, CW, 26, th.light ? 3 : 8, th.light ? '#2B2D31' : '#1D222A');
  const head = ['Сценарий', 'Оборот 4Р с НДС, млрд ₽', 'г-1', 'GMV с НДС, млрд ₽', 'г-1', 'РХД, млрд ₽', 'г-1', 'РХД / GMV'];
  head.forEach((h, i) => {
    const o = { size: 8.4, weight: 700, color: '#FFFFFF', ls: 0.1, raw: true };
    if (i === 0) text(ctx, h, LEFT, ty + 17, o);
    else text(ctx, h, RIGHT[i - 1], ty + 17, { ...o, align: 'right' });
  });
  // строки
  DATA.forEach((r, i) => {
    const y = ty + 26 + i * rowH;
    if (i % 2 === 0) rr(ctx, ML, y, CW, rowH, 0, th.light ? '#E9E4D9' : 'rgba(0,0,0,0.045)');
    if (r.hot || r.goal) rect(ctx, ML, y, 3, rowH, r.goal ? C.yellowDeep : C.yellow);
    text(ctx, r.name, LEFT, y + rowH / 2 + 4, { size: 10.4, weight: 700, color: th.ink });
    const cell = (v, ci, weight, color) =>
      text(ctx, v, RIGHT[ci], y + rowH / 2 + 4, { size: 10.4, weight, color, align: 'right' });
    cell(r.turn, 0, 700, th.ink);
    cell(r.turnD, 1, 400, th.inkSoft);
    cell(r.gmv, 2, 700, th.ink);
    cell(r.gmvD, 3, 400, th.inkSoft);
    cell(r.ebit, 4, 700, th.ink);
    cell(r.ebitD, 5, 400, th.inkSoft);
    cell(r.ratio, 6, 700, th.ink);
  });

  // ---- вывод
  const by = ty + 26 + DATA.length * rowH + 14;
  U.band(ctx, th, ML, by, CW, 50,
    '2026 — лучший год по прибыли: оборот +12%, GMV +13%, РХД +31% при 16% к GMV. Амбиция 2027 — 10,18 млрд ₽ оборота, 10,52 млрд ₽ GMV и 1,38 млрд ₽ РХД.',
    { size: 11.4 });

  U.footer(ctx, th, 'Источники: данные заказчика — сводная таблица результатов FY24–FY26, кадраж и амбиция 2027–2028; суммы — млрд ₽ с НДС. Амбиция 2027 с ПЦ совпадает с амбицией; РХД — результат хозяйственной деятельности.', 'fy');
}

module.exports = { fy: slide };
