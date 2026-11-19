'use strict';
// Слайды 11–19: блок ПРО
const U = require('./lib-ui');
const { C, W, H, ML, MR, CW, text, para, wrap, measure, fitText, rr, rect, circle, line, poly, lg, rg, card, bg, drawImg } = U;

function hbar(ctx, th, x, y, w, h, frac, o = {}) {
  rr(ctx, x, y, w, h, h / 2, th.dark ? 'rgba(255,255,255,0.10)' : '#E4DED2');
  const fw = Math.max(h, w * frac);
  if (!th.dark) rr(ctx, x, y, fw, h, h / 2, o.color || lg(ctx, x, y, x + fw, y, [[0, '#FFD65C'], [1, '#EFAE00']]));
  else rr(ctx, x, y, fw, h, h / 2, o.color || lg(ctx, x, y, x + fw, y, [[0, '#FFE39B'], [1, '#E39B00']]), { shadow: { color: 'rgba(255,198,30,0.5)', blur: 10, y: 0 } });
}

// ---------- знак-домик Лемана ПРО ----------
// В светлой 3D-теме знак рисуется фигурами: он всегда виден и не зависит от темы.
function houseMark(ctx, x, y, w, o = {}) {
  const a = C.yellow;
  const s = w / 100;
  // пятиугольник дома (100 × 118 пропорции исходного знака)
  poly(ctx, [[x + 50 * s, y], [x + 100 * s, y + 48 * s], [x + 100 * s, y + 118 * s], [x, y + 118 * s], [x, y + 48 * s]], a, {});
  // белая «дверь» — тоже пятиугольник, соразмерно
  poly(ctx, [[x + 50 * s, y + 40 * s], [x + 74 * s, y + 63 * s], [x + 74 * s, y + 100 * s], [x + 26 * s, y + 100 * s], [x + 26 * s, y + 63 * s]],
    o.door || '#FFFFFF', {});
}

function logo(ctx, d, x, y, w) {
  if (TH_LIGHT && d) {
    // светлая 3D-сцена: жёлтый домик + тёмный логотип-надпись
    const lh = w * 359 / 1281;              // высота логотипа как в исходной картинке
    const hh = lh * 0.98, hw = hh / 1.18;   // домик по высоте логотипа
    houseMark(ctx, x, y + (lh - hh) / 2 - lh * 0.02, hw, { door: '#F3F0E9' });
    drawImg(ctx, 'wordmark-dark.png', x + hw + lh * 0.16, y + lh * 0.10, w * 0.735, lh * 0.80);
    return;
  }
  drawImg(ctx, d ? 'logo-light.png' : 'logo-dark.png', x, y, w, w * 359 / 1281);
}

const TH_LIGHT = !!U.THEMES['3d'].light;   // светлая 3D-сцена

const slides = {};

// ============ 11. Раздел: Стратегия ПРО ============
slides[11] = (ctx, th) => {
  const d = th.dark;
  bg(ctx, th);
  if (!d) {
    drawImg(ctx, 'store.jpg', 604, 0, 356, H, {
      grad: lg(ctx, 604, 0, 700, 0, [[0, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]),
      gradRect: { x: 604, y: 0, w: 96, h: H },
    });
    poly(ctx, [[604, 0], [548, 0], [664, H], [604, H]], C.yellow, {});
    logo(ctx, d, ML, 40, 128);
    rect(ctx, ML, 214, 90, 4, C.yellow);
    text(ctx, 'СТРАТЕГИЯ ПРО', ML, 268, { size: 15, weight: 700, ls: 3.4, color: C.yellowDeep });
    text(ctx, 'ВЛАДИВОСТОК 2027', ML, 322, { size: 44, weight: 800, color: C.ink, ls: -1.6 });
    text(ctx, 'Ноябрь 2026 · сжатая версия, 9 слайдов', ML, 356, { size: 12.5, color: C.muted });
    const kp = [['GMV 2027', '3 млрд ₽', '+30% к 2026'], ['Доступный рынок 2027', '20 млрд ₽', 'из 30,7 млрд ₽ рынка'], ['Рынок ПРО кластера', '30,7 млрд ₽', 'доля 7%']];
    kp.forEach((k, i) => {
      const x = ML + i * 150;
      rect(ctx, x, 400, 2, 56, C.line2);
      text(ctx, k[0].toUpperCase(), x + 14, 412, { size: 8.8, weight: 700, ls: 1, color: C.muted });
      text(ctx, k[1], x + 14, 440, { size: 19, weight: 800, color: C.ink, ls: -0.6 });
      text(ctx, k[2], x + 14, 455, { size: 9.2, color: C.muted });
    });
  } else {
    drawImg(ctx, 'store.jpg', 600, 40, 400, 380, { clip: 'round', r: 20, overlay: 'rgba(10,13,18,0.35)' });
    rr(ctx, 600, 40, 400, 380, 20, null, { stroke: 'rgba(255,198,30,0.4)', strokeW: 1.4 });
    logo(ctx, d, ML, 40, 118);
    rect(ctx, ML, 200, 60, 3, C.yellow);
    text(ctx, 'СТРАТЕГИЯ ПРО', ML, 250, { size: 13, weight: 700, fam: 'u', ls: 3.6, color: C.yellow });
    text(ctx, 'ВЛАДИВОСТОК', ML, 306, { size: 40, weight: 800, fam: 'u', color: '#fff', ls: -1.2 });
    text(ctx, '2027', ML, 352, { size: 40, weight: 800, fam: 'u', color: '#fff', ls: -1.2 });
    text(ctx, 'Ноябрь 2026 · сжатая версия, 9 слайдов', ML, 384, { size: 11.5, color: 'rgba(255,255,255,0.55)' });
    const kp = [['GMV 2027', '3 млрд ₽', '+30% к 2026'], ['Доступный рынок 2027', '20 млрд ₽', 'из 30,7 млрд ₽'], ['Рынок ПРО', '30,7 млрд ₽', 'доля 7%']];
    kp.forEach((k, i) => {
      const y = 424 + i * 34;
      text(ctx, k[0].toUpperCase(), ML, y, { size: 8.4, weight: 700, ls: 1, color: 'rgba(255,255,255,0.42)' });
      text(ctx, k[1], ML + 190, y + 3, { size: 15, weight: 800, color: C.yellow, align: 'left' });
      text(ctx, k[2], ML + 300, y + 3, { size: 9.4, color: 'rgba(255,255,255,0.55)' });
    });
    text(ctx, String(U.pageNum(11)), W - 44, H - 24, { size: 10, color: 'rgba(255,255,255,0.40)', align: 'right' });
  }
};

// ============ 12. ПРО · Рынок ============
slides[12] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 12, {
    kicker: 'ПРО · рынок', title: 'Приморский край и Владивосток: деньги есть, федеральной розницы нет',
    lead: 'Экономика края, новостройки, город и люди · контекст для ПРО 2027', titleSize: d ? 23 : 27, gap: 16,
  });
  const cw = (CW - 24) / 3;
  const cols = [
    { t: 'ЭКОНОМИКА', v: '2,54 трлн ₽', n: '+2,6% · прогнозный ВРП края', items: ['Транспорт, логистика и торговля — ≈ 40% ВРП', 'Строительство и АПК — 12,6%, энергетика +12,2%', 'Инвестиции ПГС — 400 млрд ₽, 95% в 5 отраслей', 'Горнорудная 186,4 · нефтегаз и химия 147,4 · стройка 70,1 млрд ₽'] },
    { t: 'НОВОСТРОЙКИ', v: '251 МКД', n: 'до 2030 = 70,1 млрд ₽', items: ['≈ 9 000 домов ИЖС, сдача +25%, средний дом 110 м²', '42 школы и 15 поликлиник до 2030', '87 капремонтов = 4 млрд ₽'] },
    { t: 'ГОРОД И ЛЮДИ', v: '80%', n: 'урбанизация · 46-й ранг качества жизни', items: ['Каждый 2-й житель зарабатывает > 100 000 ₽', 'Нет федеральных игроков (Hoff, Ашан)', 'Сильные локальные: Farpost, Drom', '> 35% жителей планируют переезд'] },
  ];
  const ph = 186;
  cols.forEach((c, i) => {
    const x = ML + i * (cw + 12);
    card(ctx, th, x, top, cw, ph, {});
    U.panelHead(ctx, th, x + 18, top + 30, cw - 36, c.t);
    fitText(ctx, c.v, x + 18, top + 68, cw - 36, { size: 25, weight: 800, color: th.ink, ls: -1, minSize: 15 });
    text(ctx, c.n, x + 18, top + 85, { size: 9.4, color: th.muted });
    let y = top + 104;
    c.items.forEach((s) => {
      rect(ctx, x + 18, y - 4, 8, 2, d ? C.yellow : C.yellowDeep);
      y += para(ctx, s, x + 32, y, cw - 50, { size: 9.6, lh: 12, color: th.inkSoft, maxLines: 3, page: 12, minSize: 8.4 }) + 5;
    });
  });
  // города
  const ty = top + ph + 10;
  card(ctx, th, ML, ty, CW, 96, {});
  U.panelHead(ctx, th, ML + 18, ty + 28, 300, 'Города вокруг магазина');
  const gw = [110, 200, 200, 200];
  const head = ['Город', 'Расстояние', 'Население'];
  let hx = ML + 18;
  head.forEach((h, i) => { text(ctx, h.toUpperCase(), hx, ty + 42, { size: 8.4, weight: 700, ls: 1, color: th.muted }); hx += gw[i]; });
  const cities = [['Владивосток', '34 км', '592 тыс.'], ['Артём', '10 км', '109 тыс.'], ['Уссурийск', '78 км', '180 тыс.'], ['Находка', '135 км', '134 тыс.']];
  cities.forEach((c, i) => {
    const y = ty + 58 + i * 14;
    if (i % 2 === 0) rr(ctx, ML + 10, y - 12, CW - 20, 19, 3, d ? 'rgba(255,255,255,0.04)' : '#EFEAE1');
    let cx = ML + 18;
    c.forEach((cell, j) => {
      text(ctx, cell, cx, y, { size: 10.4, weight: j === 0 ? 700 : 400, color: j === 0 ? th.ink : th.inkSoft });
      cx += gw[j];
    });
  });
  U.band(ctx, th, ML, ty + 104, CW, 36, 'Деньги в регионе есть, федеральной розницы нет — окно возможностей для Лемана ПРО. Экономические ворота в АТР, центр «Поворота на Восток».', { size: 12, weight: 600, color: d ? '#fff' : C.ink });
  U.footer(ctx, th, 'Источники: данные заказчика — анализ рынка Приморского края и Владивостока, 2026 (ВРП 2,54 трлн ₽, +2,6%; инвестиции ПГС 400 млрд ₽; 251 МКД до 2030 = 70,1 млрд ₽; ≈ 9 000 домов ИЖС; 42 школы и 15 поликлиник; 87 капремонтов = 4 млрд ₽).', 12);
};

// ============ 13. ПРО · Потенциал рынка ============
slides[13] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 13, {
    kicker: 'ПРО · потенциал рынка', title: '30,7 млрд ₽ рынка ПРО, 20 млрд ₽ доступно в 2027',
    lead: 'Объём, сегменты и доступный рынок · база клиентов 16,8 млрд ₽', titleSize: d ? 25 : 30, gap: 16,
  });
  U.kpiRow(ctx, th, ML, top, CW, 78, [
    { label: 'Рынок ПРО кластера', value: '30,7 млрд ₽', note: 'объём рынка ПРО', accent: C.yellow },
    { label: 'Текущая доля Лемана ПРО', value: '7%', note: 'доля на рынке ПРО' },
    { label: 'Потенциал базы клиентов', value: '16,8 млрд ₽', note: '6 081 точка · 2 113 клиентов · 35%' },
    { label: 'Доступный рынок 2027', value: '20 млрд ₽', note: '65% рынка кластера' },
  ], { size: 21 });
  const gy = top + 84, ph = 200;
  const lw = 330;
  card(ctx, th, ML, gy, lw, ph, {});
  U.panelHead(ctx, th, ML + 18, gy + 28, lw - 36, 'Сегменты рынка, млрд ₽');
  const seg = [['ПГС · Лемана ПРО 4%', 14.5], ['ИЖС · Лемана ПРО 11%', 9.7], ['Торговля и прочее', 4.5], ['Обслуживание · 8%', 2.0], ['HoReCa · 5%', 2.0]];
  let sy = gy + 48;
  seg.forEach((s) => {
    text(ctx, s[0], ML + 18, sy + 9, { size: 9.8, color: th.inkSoft });
    hbar(ctx, th, ML + 18, sy + 14, lw - 36, 7, s[1] / 14.5);
    text(ctx, s[1].toFixed(1).replace('.', ','), ML + lw - 18, sy + 9, { size: 10.4, weight: 700, color: d ? C.yellow : C.ink, align: 'right' });
    sy += 29;
  });
  // доступный рынок
  const rx = ML + lw + 14, rw = W - MR - rx;
  card(ctx, th, rx, gy, rw, ph, {});
  U.panelHead(ctx, th, rx + 18, gy + 28, rw - 36, 'Доступный рынок 2027 — 20 млрд ₽');
  const av = [['Новое строительство', 9], ['Регулярное обеспечение', 4], ['Текущий ремонт', 4], ['Капремонт', 1], ['Частные проекты', 1], ['Реконструкция', 1]];
  const colW = (rw - 36 - 20) / 2;
  av.forEach((a, i) => {
    const x = rx + 18 + (i % 2) * (colW + 20);
    const y = gy + 46 + Math.floor(i / 2) * 38;
    text(ctx, a[0], x, y, { size: 9.8, color: th.inkSoft });
    fitText(ctx, String(a[1]) + ' млрд', x, y + 20, colW, { size: 15.5, weight: 800, color: d ? C.yellow : C.ink, minSize: 11 });
  });
  // три тезиса
  const by = gy + ph + 10;
  const bw = (CW - 24) / 3;
  [['01', 'Строительство и производство — основные потенциалы роста'],
   ['02', 'ИЖС: глубокие запасы ключевых групп + оффер-УТП (цена, доставка, услуги)'],
   ['03', '20% МКД — с чистовой отделкой и White Box, 100% из них — наши клиенты']].forEach((t, i) => {
    const x = ML + i * (bw + 12);
    card(ctx, th, x, by, bw, Math.max(76, 490 - by), {});
    if (!d) { rr(ctx, x + 18, by + 16, 24, 20, 5, C.dark); text(ctx, t[0], x + 30, by + 30, { size: 9.5, weight: 700, color: '#fff', align: 'center' }); }
    else { rr(ctx, x + 18, by + 16, 26, 21, 6, lg(ctx, x, by, x + 26, by + 37, [[0, '#FFD75E'], [1, '#DF9A00']])); text(ctx, t[0], x + 31, by + 31, { size: 9.5, weight: 800, color: '#241C00', align: 'center' }); }
    para(ctx, t[1], x + 50, by + 30, bw - 68, { size: 10.4, lh: 13.2, color: th.inkSoft, maxLines: 3, page: 13 });
  });
  U.footer(ctx, th, 'Источники: данные заказчика — рынок ПРО кластера Владивосток 30,7 млрд ₽, доля Лемана ПРО 7%, доступный рынок 2027 — 20 млрд ₽; база B2B — 6 081 точка, 2 113 клиентов ЛМ, потенциал 16,8 млрд ₽. Сегменты — оценка заказчика.', 13);
};

// ============ 14. ПРО · Конкуренция ============
slides[14] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 14, {
    kicker: 'ПРО · конкуренция', title: 'Активные продажи — дилеры, входящий поток — 3 000 специалистов',
    lead: 'С кем делим рынок ПРО · сильные стороны конкурентов и критерии выбора клиента', titleSize: d ? 23 : 27, gap: 14,
  });
  const lw = 430, ph = 196;
  card(ctx, th, ML, top, lw, ph, {});
  U.panelHead(ctx, th, ML + 18, top + 28, lw - 36, 'Активные продажи — дилеры');
  const dl = [
    ['Прогресс Строй', '50 000 SKU, склад 150 000 м² · дилер Волма / Кнауф / Церезит — «первые цены» · свои тупики, контейнерные отгрузки'],
    ['Помощник', 'довоз за 30 минут · скидки для ЮЛ и ПРОФИ · сильное присутствие в городе'],
    ['ДТС', 'крупные складские запасы · закуп большими партиями по минимальным ценам · города края'],
    ['Технониколь', 'крупнейший производитель · кровля и фасады заложены в проекты · экспертиза, лучшие цены'],
  ];
  dl.forEach((c, i) => {
    const x = ML + 18 + (i % 2) * ((lw - 36 - 10) / 2 + 10);
    const y = top + 46 + Math.floor(i / 2) * 76;
    const cw2 = (lw - 36 - 10) / 2;
    rr(ctx, x, y, cw2, 70, 7, d ? 'rgba(255,255,255,0.04)' : '#F8F4EC', { stroke: d ? 'rgba(255,255,255,0.07)' : C.line });
    text(ctx, c[0], x + 12, y + 18, { size: 10.8, weight: 700, color: d ? C.yellow : C.ink });
    para(ctx, c[1], x + 12, y + 31, cw2 - 24, { size: 8.8, lh: 11, color: th.inkSoft, maxLines: 3, page: 14, minSize: 8 });
  });
  // специалисты
  const rx = ML + lw + 14, rw = W - MR - rx;
  card(ctx, th, rx, top, rw, ph, {});
  U.panelHead(ctx, th, rx + 18, top + 28, rw - 36, 'Входящий поток — специалисты');
  text(ctx, '≈ 3 000 точек · × 8 игроков', rx + 18, top + 60, { size: 13, weight: 700, color: th.ink });
  const players = ['Аквадом', 'ДальЭТО', 'Эксполес', 'Энергосфера', 'Интеркабель', 'Вся фанера', 'Красный мамонт', 'Технодром'];
  players.forEach((p, i) => {
    const w = measure(ctx, p, { size: 9.6, weight: 600 }) + 22;
    const row = Math.floor(i / 4);
    const x = rx + 18 + (i % 4) * ((rw - 36) / 4);
    U.chip(ctx, th, x, top + 76 + row * 26, p, { size: 9.4 });
  });
  // критерии
  const cy2 = top + ph + 10;
  card(ctx, th, ML, cy2, CW, 92, {});
  U.panelHead(ctx, th, ML + 18, cy2 + 26, 300, 'Как клиент выбирает поставщика');
  const crit = ['Скорость ответа', 'Конкурентная цена', 'Скорость отгрузки', 'Полный проект', 'Документооборот', 'Срок поставки', 'Экспертиза', 'Омниканальность'];
  let cx2 = ML + 18;
  let rowY = cy2 + 42;
  crit.forEach((c, i) => {
    const w = measure(ctx, c, { size: 10, weight: 600 }) + 24;
    if (cx2 + w > ML + CW - 24) { cx2 = ML + 18; rowY += 26; }
    U.chip(ctx, th, cx2, rowY, c, { size: 10 });
    cx2 += w + 8;
  });
  U.band(ctx, th, ML, cy2 + 100, CW, 36, 'У дилеров сильны цена и запасы, у нас — сервис, доставка и комплексное решение: выигрываем проектом, а не позицией.', { size: 12, weight: 600, color: d ? '#fff' : C.ink });
  U.footer(ctx, th, 'Источники: данные заказчика — карта конкуренции ПРО Владивостока, 2026: дилеры (Прогресс Строй, Помощник, ДТС, Технониколь) и входящий поток специалистов (≈ 3 000 точек, 8 ключевых игроков); критерии выбора — интервью с клиентами ПРО.', 14);
};

// ============ 15. ПРО · Силы и риски ============
slides[15] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 15, {
    kicker: 'ПРО · силы и риски', title: 'Чем бьём конкурентов и что нас сдерживает',
    lead: 'Четыре преимущества, транзитные отгрузки и шесть рисков 2027', titleSize: d ? 25 : 30, gap: 14,
  });
  const lw = 452;
  card(ctx, th, ML, top, lw, 214, {});
  U.panelHead(ctx, th, ML + 18, top + 28, lw - 36, 'Наши преимущества');
  const adv = [['СЕРВИС', 'Гибкие скидки, акции, реферальная программа, два вида договоров'], ['ДОСТАВКА', 'До 3 т в новостройки с грузчиками, короткие интервалы, отгрузки по РФ'], ['АССОРТИМЕНТ', 'Широкая матрица, смета и визуализация для проектов'], ['КОМФОРТ', 'ЛК 24/7, прозрачный документооборот, лояльные возвраты, парковка']];
  adv.forEach((a, i) => {
    const x = ML + 18 + (i % 2) * ((lw - 36 - 10) / 2 + 10);
    const y = top + 46 + Math.floor(i / 2) * 76;
    const cw2 = (lw - 36 - 10) / 2;
    rr(ctx, x, y, cw2, 68, 7, d ? 'rgba(255,255,255,0.04)' : '#F8F4EC', { stroke: d ? 'rgba(255,255,255,0.07)' : C.line });
    rect(ctx, x, y, 3, 68, d ? C.yellow : C.yellow);
    text(ctx, a[0], x + 14, y + 20, { size: 9.6, weight: 700, ls: 1.2, color: d ? C.yellow : C.yellowDeep });
    para(ctx, a[1], x + 14, y + 36, cw2 - 26, { size: 9.6, lh: 12.2, color: th.inkSoft, maxLines: 2, page: 15 });
  });
  // транзиты и кейсы
  const rx = ML + lw + 14, rw = W - MR - rx;
  card(ctx, th, rx, top, rw, 214, { fill: d ? lg(ctx, rx, top, rx, top + 214, [[0, 'rgba(255,198,30,0.13)'], [1, 'rgba(255,198,30,0.02)']]) : C.yellowSoft });
  U.panelHead(ctx, th, rx + 18, top + 28, rw - 36, 'Транзитные отгрузки');
  text(ctx, '2026 — GMV ×4', rx + 18, top + 60, { size: 10.4, color: th.inkSoft });
  text(ctx, '125 млн ₽', rx + 18, top + 92, { size: 27, weight: 800, color: th.ink, ls: -1 });
  text(ctx, 'ЦЕЛЬ 2027', rx + rw - 18, top + 62, { size: 9, weight: 700, ls: 1.2, color: d ? C.yellow : C.yellowDeep, align: 'right' });
  text(ctx, 'КЕЙСЫ 2026', rx + 18, top + 116, { size: 9, weight: 700, ls: 1.2, color: th.muted });
  const cases = [['Пеноплэкс → Партизанская ГРЭС', '7 млн ₽'], ['ДКК-ДВ → ЖК НебоПарк', '9 млн ₽'], ['ВСК → ЖК Днепровский', '7 млн ₽'], ['Пеноплэкс → Аэропорт Красноярска', '3 млн ₽']];
  cases.forEach((c, i) => {
    const y = top + 136 + i * 19;
    text(ctx, c[0], rx + 18, y, { size: 9.6, color: th.inkSoft });
    text(ctx, c[1], rx + rw - 18, y, { size: 10, weight: 700, color: d ? C.yellow : C.ink, align: 'right' });
  });
  // риски
  const ty = top + 230;
  card(ctx, th, ML, ty, CW, 128, {});
  U.panelHead(ctx, th, ML + 18, ty + 26, 200, 'Риски — что сдерживает');
  const risks = [['Перебои KNAUF / Волма', 'срыв обязательств перед застройщиками', 'выс.'], ['Сезонный дефицит кадров', 'рост сроков, отказ от объёмных заказов', 'выс.'], ['Удалённость от клиентов', 'уход к ближайшим конкурентам', 'выс.'], ['Слабая экспертиза по ПРО', 'недополученная прибыль в B2B', 'выс.'], ['Скорость сборки и доставки', 'отток АКБ', 'выс.'], ['Тарифы и плечо поставки', 'неконкурентная цена', 'сред.']];
  risks.forEach((r, i) => {
    const x = ML + 18 + (i % 3) * ((CW - 36 - 24) / 3 + 12);
    const y = ty + 44 + Math.floor(i / 3) * 42;
    const cw2 = (CW - 36 - 24) / 3;
    rr(ctx, x, y, cw2, 36, 6, d ? 'rgba(255,255,255,0.04)' : '#F8F4EC', { stroke: d ? 'rgba(255,255,255,0.06)' : C.line });
    text(ctx, r[0], x + 10, y + 15, { size: 9.8, weight: 700, color: th.ink });
    text(ctx, r[1], x + 10, y + 28, { size: 8.8, color: th.muted });
    const hot = r[2] === 'выс.';
    if (!d) { rr(ctx, x + cw2 - 40, y + 10, 30, 15, 7, hot ? '#F6DDD5' : '#E8E3D8'); text(ctx, r[2], x + cw2 - 25, y + 21, { size: 8.6, weight: 700, color: hot ? C.red : C.muted, align: 'center' }); }
    else { rr(ctx, x + cw2 - 42, y + 10, 32, 16, 8, hot ? 'rgba(220,90,60,0.22)' : 'rgba(255,255,255,0.10)'); text(ctx, r[2], x + cw2 - 26, y + 22, { size: 8.6, weight: 700, color: hot ? '#FF9E80' : 'rgba(255,255,255,0.6)', align: 'center' }); }
  });
  U.footer(ctx, th, 'выс. — высокий уровень · сред. — средний уровень. Источники: данные заказчика — преимущества ПРО, кейсы транзитных отгрузок 2026, реестр рисков отдела ПРО на 2027 год.', 15);
};

// ============ 16. ПРО · Амбиция 2027 ============
slides[16] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 16, {
    kicker: 'ПРО · амбиция 2027', title: '3 млрд ₽ GMV: зал, поток и активные продажи растут вместе',
    lead: 'Структура амбиции по каналам · 2,14 → 2,30 → 3,00 млрд ₽', titleSize: d ? 24 : 29, gap: 14,
  });
  // динамика
  card(ctx, th, ML, top, CW, 88, {});
  text(ctx, '3 млрд ₽', ML + 20, top + 46, { size: 30, weight: 800, color: th.ink, ls: -1.2 });
  text(ctx, '+30% к 2026', ML + 20, top + 64, { size: 10.2, weight: 600, color: d ? C.yellow : C.yellowDeep });
  const yrs = [['2025', '2,14'], ['2026', '2,30'], ['2027 — ЦЕЛЬ', '3,00']];
  yrs.forEach((y2, i) => {
    const x = ML + 250 + i * 130;
    text(ctx, y2[0], x, top + 34, { size: 9.4, weight: 700, ls: 1.1, color: i === 2 ? (d ? C.yellow : C.yellowDeep) : th.muted });
    text(ctx, y2[1], x, top + 62, { size: 22, weight: 800, color: th.ink, ls: -0.8 });
    if (i < 2) text(ctx, '›', x + 84, top + 62, { size: 20, weight: 700, color: th.faint });
  });
  hbar(ctx, th, ML + 590, top + 44, CW - 620, 10, 0.72);
  text(ctx, '2,30 → 3,00 млрд ₽ за год', ML + 590, top + 72, { size: 9.6, color: th.muted });
  // три канала
  const gy = top + 98, ph = 208;
  const cw = (CW - 24) / 3;
  const ch = [
    { t: 'ТОРГОВЫЙ ЗАЛ', v: '1,55 млрд ₽', g: '+18% Y-1', items: [['ПРОФИ', '1 324 млн ₽'], ['ЮЛ', '226 млн ₽']], note: 'Рост даёт ПРОФИ: 1 035 → 1 324 млн ₽ за 2 года. Рост АКБ и чека, работа с бригадирами.' },
    { t: 'ВХОДЯЩИЙ ПОТОК', v: '650 млн ₽', g: '+5% Y-1', items: [['Обслуживание', '217 млн · 35%'], ['Строительство', '124 млн · 20%'], ['Оффлайн', '450 млн'], ['Онлайн', '200 млн']], note: 'АКБ 5 000 · конверсия 90% · 7 SKU в чеке (+22%) · маржа 21% · ТО 124 тыс. ₽.' },
    { t: 'АКТИВНЫЕ ПРОДАЖИ', v: '830 млн ₽', g: '+72% Y-1', items: [['Строительство', '550 млн'], ['HoReCa', '230 млн'], ['Обслуживание', '50 млн']], note: 'ЮЛ: 406 → 747 млн ₽ (×1,8). ≈ 2 команды продаж.' },
  ];
  ch.forEach((c, i) => {
    const x = ML + i * (cw + 12);
    card(ctx, th, x, gy, cw, ph, { topAccent: i === 2 ? C.yellow : (d ? null : '#DCD5C7') });
    text(ctx, c.t, x + 18, gy + 28, { size: 9.6, weight: 700, ls: 1.2, color: d ? C.yellow : C.inkSoft });
    fitText(ctx, c.v, x + 18, gy + 60, cw - 36, { size: 26, weight: 800, color: th.ink, ls: -1, minSize: 16 });
    U.chip(ctx, th, x + 18, gy + 70, c.g, { size: 9 });
    c.items.forEach((it, k) => {
      const y = gy + 100 + k * 17;
      text(ctx, it[0], x + 18, y, { size: 9.8, color: th.inkSoft });
      text(ctx, it[1], x + cw - 18, y, { size: 9.8, weight: 700, color: th.ink, align: 'right' });
    });
    line(ctx, x + 18, gy + 100 + c.items.length * 17 - 6, x + cw - 18, gy + 100 + c.items.length * 17 - 6, th.rule, 1);
    para(ctx, c.note, x + 18, gy + 100 + c.items.length * 17 + 8, cw - 36, { size: 9.2, lh: 11.6, color: th.muted, maxLines: 3, page: 16, minSize: 8.2 });
  });
  U.band(ctx, th, ML, gy + ph + 6, CW, 38, 'Каждый канал растёт: зал — за счёт ПРОФИ, поток — за счёт АКБ и чека, активные продажи — удвоение АКБ ЮЛ.', { size: 12, weight: 600, color: d ? '#fff' : C.ink });
  U.footer(ctx, th, 'Источники: данные заказчика — амбиция ПРО 2027: GMV 3,0 млрд ₽ (+30% к 2026), торговый зал 1,55 млрд ₽, входящий поток 650 млн ₽, активные продажи 830 млн ₽; ПРОФИ 1 035 → 1 324 млн ₽, ЮЛ 406 → 747 млн ₽.', 16);
};

// ============ 17. ПРО · Что меняем ============
slides[17] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 17, {
    kicker: 'ПРО · что меняем в 2027', title: 'Шесть изменений, которые ведут нас к 3 млрд ₽',
    lead: 'Органиграмма, экспертиза, доставка, запасы, транзиты и объекты', titleSize: d ? 24 : 29, gap: 14,
  });
  const items = [
    { n: '01', title: 'Органиграмма ПРО', text: 'Не закрываем подбор круглый год. У каждого нового сотрудника интеграция по стандарту.', val: 'штат 23 → 28', tag: '+5 человек' },
    { n: '02', title: 'Экспертиза ПРО', text: 'Обучить 2 менеджеров работе с тендерами — стажировка в ЦО.', val: 'тендеры в ЦО', tag: '2 менеджера' },
    { n: '03', title: 'Доставка грузов', text: 'До 50 кг — за 1 час; экспресс-минивэны; контр-оффер по срокам: СДЭК, ПЭК, отгрузки со склада поставщика.', val: 'до 50 кг', tag: 'за 1 час' },
    { n: '04', title: 'Запасы и поставщики', text: 'Глубокий запас KNAUF / Волма, локальные поставщики. Флагманы всегда в наличии: Makita, Interskol, профиль.', val: 'всегда в наличии', tag: 'KNAUF · Волма' },
    { n: '05', title: 'Транзиты, гамма, логистика', text: 'Транзиты → 124,5 млн ₽ (доля 6% → 15%); +800 артикулов LT; СЦ для обработки АТР: +150 млн ₽ в год.', val: '124,5 млн ₽', tag: 'доля 6% → 15%' },
    { n: '06', title: 'Объекты и «Новосёлы»', text: 'Карта «Новосёлы» — заход на объект на раннем этапе; готовые решения застройщикам; бронирование конструктивов.', val: '10 в месяц', tag: 'ранний заход' },
  ];
  const cols = 3, gap = 12, cw = (CW - gap * (cols - 1)) / cols, chh = 118;
  items.forEach((it, i) => {
    const x = ML + (i % cols) * (cw + gap), y = top + Math.floor(i / cols) * (chh + gap);
    card(ctx, th, x, y, cw, chh, {});
    if (!d) { rr(ctx, x + 18, y + 16, 26, 24, 6, C.dark); text(ctx, it.n, x + 31, y + 32, { size: 10, weight: 700, color: '#fff', align: 'center' }); }
    else { rr(ctx, x + 18, y + 16, 28, 25, 7, lg(ctx, x, y, x + 28, y + 40, [[0, '#FFD75E'], [1, '#DF9A00']])); text(ctx, it.n, x + 32, y + 33, { size: 10, weight: 800, color: '#241C00', align: 'center' }); }
    fitText(ctx, it.title, x + 52, y + 33, cw - 68, { size: 11.6, weight: 700, color: th.ink, minSize: 9.5 });
    para(ctx, it.text, x + 18, y + 56, cw - 36, { size: 9.6, lh: 12, color: th.inkSoft, maxLines: 3, page: 17 });
    text(ctx, it.val, x + 18, y + chh - 12, { size: 11, weight: 800, color: d ? C.yellow : C.ink });
    text(ctx, it.tag, x + cw - 18, y + chh - 12, { size: 8.8, weight: 600, color: th.muted, align: 'right' });
  });
  const by = top + 2 * (chh + gap) + 12;
  U.band(ctx, th, ML, by, CW, 76, 'БАЗОВЫЕ ПРАКТИКИ ПРОДАЖ: мониторинг цен конкурентов · наличие флагманов на полках · отдельная очередь выдачи для ПРОФИ и ЮЛ · разделение портфелей по контурам · академия ПРО (СП и КАМ) · бронирование объектов · доставка в новостройки за 1 ₽ · штат логистики под прогноз заказов.', { size: 10.4, maxLines: 3 });
  U.footer(ctx, th, 'Источники: данные заказчика — план изменений ПРО на 2027 (органиграмма, экспертиза, доставка, запасы, транзиты, объекты и «Новосёлы»); базовые практики продаж отдела.', 17);
};

// ============ 18. ПРО · МП 1,2 ============
slides[18] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 18, {
    kicker: 'ПРО · как достигнем цели · МП 1,2', title: 'Лучший клиентский опыт: 1 200 → 1 550 клиентов и АКБ +12%',
    lead: 'Верх воронки, товар и УТП, проекты и объекты · KPI 2027', titleSize: d ? 23 : 27, gap: 14,
  });
  const lw = 236, ph = 250;
  card(ctx, th, ML, top, lw, ph, { fill: d ? lg(ctx, ML, top, ML, top + ph, [[0, 'rgba(255,198,30,0.14)'], [1, 'rgba(255,198,30,0.02)']]) : C.yellowSoft });
  text(ctx, 'КЛИЕНТЫ МП 1,2', ML + 18, top + 30, { size: 9.4, weight: 700, ls: 1.3, color: d ? C.yellow : C.yellowDeep });
  text(ctx, '1 200', ML + 18, top + 66, { size: 26, weight: 800, color: th.ink, ls: -1 });
  text(ctx, '›', ML + 18, top + 88, { size: 16, weight: 700, color: th.faint });
  text(ctx, '1 550', ML + 18, top + 118, { size: 30, weight: 800, color: th.ink, ls: -1.2 });
  para(ctx, 'цель 2027 · +29% к текущему уровню', ML + 18, top + 136, lw - 36, { size: 9.6, lh: 12, color: th.muted, maxLines: 2, page: 18 });
  text(ctx, 'KPI метрики — цель 2027', ML + 18, top + 168, { size: 9, weight: 700, ls: 1.1, color: th.muted });
  const kpis = [['АКБ', '+12%'], ['Среднее ТО на клиента', '135 000 · +8%'], ['Доступность Best B2B', '97%'], ['OTIF', '95%'], ['NPS', '90']];
  kpis.forEach((k, i) => {
    const y = top + 186 + i * 13.6;
    text(ctx, k[0], ML + 18, y, { size: 8.8, color: th.inkSoft });
    text(ctx, k[1], ML + lw - 18, y, { size: 9, weight: 700, color: d ? C.yellow : C.ink, align: 'right' });
  });
  // три блока
  const rx = ML + lw + 14, rw = W - MR - rx;
  const bw = (rw - 24) / 3;
  const bl = [
    { n: '01', t: 'Верх воронки и АКБ', s: 'Расширение верха воронки, рост АКБ', items: ['Персонализация через лиды МП 1,2 (4 200 шт)', 'Идентификация клиентов ПРОФИ (860 карт)', 'Еженедельный трекинг результатов', 'Работа с ТОП и ФЛОП МП 1,2'] },
    { n: '02', t: 'Товар, цена, УТП', s: 'Предложение и цена — на базе ОС ключевых клиентов', items: ['Сопровождение ТОП-10 клиентов в ключевых отделах', 'Анализ оттока за последние 6 месяцев', 'Круглые столы и интервью с новыми клиентами'] },
    { n: '03', t: 'Проекты и объекты', s: 'РС улучшает путь клиента ПРО в магазине', items: ['Доступность на проект (8 CPQ) в отделах 1, 3, 4, 6, 8, 10, 11', 'Ежемесячные встречи РС и куратора', 'Выезды на объекты с КАМ и обмен ОС', 'Мониторинг ТОП-700 арт. ПРО'] },
  ];
  bl.forEach((b, i) => {
    const x = rx + i * (bw + 12);
    card(ctx, th, x, top, bw, ph, {});
    if (!d) { rr(ctx, x + 18, top + 18, 24, 22, 5, C.dark); text(ctx, b.n, x + 30, top + 33, { size: 9.5, weight: 700, color: '#fff', align: 'center' }); }
    else { rr(ctx, x + 18, top + 18, 26, 23, 6, lg(ctx, x, top, x + 26, top + 41, [[0, '#FFD75E'], [1, '#DF9A00']])); text(ctx, b.n, x + 31, top + 34, { size: 9.5, weight: 800, color: '#241C00', align: 'center' }); }
    para(ctx, b.t, x + 48, top + 34, bw - 64, { size: 10.6, lh: 13, weight: 700, color: th.ink, maxLines: 2, page: 18 });
    para(ctx, b.s, x + 18, top + 64, bw - 36, { size: 9.4, lh: 11.8, color: th.muted, maxLines: 2, page: 18 });
    text(ctx, 'КЛЮЧЕВЫЕ ДЕЙСТВИЯ', x + 18, top + 98, { size: 8.4, weight: 700, ls: 1, color: th.faint });
    let y = top + 114;
    b.items.forEach((it) => {
      rect(ctx, x + 18, y - 4, 7, 2, d ? C.yellow : C.yellowDeep);
      y += para(ctx, it, x + 30, y, bw - 46, { size: 9.4, lh: 11.8, color: th.inkSoft, maxLines: 3, page: 18 }) + 5;
    });
  });
  U.band(ctx, th, ML, top + ph + 12, CW, 42, 'Расширяем верх воронки, усиливаем УТП ПРО и задаём приоритет команды на развитие направления ПРО.', { size: 12, weight: 600, color: d ? '#fff' : C.ink });
  U.footer(ctx, th, 'Источники: данные заказчика — стратегия МП 1,2 на 2027: клиенты 1 200 → 1 550, KPI (АКБ +12%, ТО 135 000 ₽ +8%, доступность Best B2B 97%, OTIF 95%, NPS 90), лиды МП 1,2 4 200 шт, карты ПРОФИ 860, 8 CPQ в 7 приоритетных отделах.', 18);
};

// ============ 19. ПРО · МП 3,5 ============
slides[19] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 19, {
    kicker: 'ПРО · как достигнем цели · МП 3,5', title: 'Команда 23 → 28 человек и ритуалы менеджмента',
    lead: 'Активные продажи: штат, скорость реакции на лид, ритуалы и KPI', titleSize: d ? 24 : 29, gap: 14,
  });
  const lw = 300;
  card(ctx, th, ML, top, lw, 88, { fill: d ? lg(ctx, ML, top, ML, top + 96, [[0, 'rgba(255,198,30,0.14)'], [1, 'rgba(255,198,30,0.02)']]) : C.yellowSoft });
  text(ctx, 'КОМАНДА', ML + 18, top + 24, { size: 9.4, weight: 700, ls: 1.2, color: d ? C.yellow : C.yellowDeep });
  text(ctx, '23', ML + 18, top + 56, { size: 25, weight: 800, color: th.ink, ls: -1 });
  text(ctx, '›', ML + 62, top + 56, { size: 19, weight: 700, color: th.faint });
  text(ctx, '28', ML + 84, top + 56, { size: 29, weight: 800, color: th.ink, ls: -1.2 });
  U.chip(ctx, th, ML + 140, top + 28, '+5 человек', { size: 9 });
  para(ctx, '+2 КАМ, +2 СП, +1 ИПП · акселератор СП → МП → РС', ML + 18, top + 70, lw - 36, { size: 8.8, lh: 11, color: th.muted, maxLines: 1, page: 19 });
  // скорость
  card(ctx, th, ML + lw + 14, top, 236, 88, {});
  text(ctx, 'ВХОДЯЩИЙ ПОТОК — СКОРОСТЬ', ML + lw + 32, top + 26, { size: 9, weight: 700, ls: 1, color: th.muted });
  text(ctx, '20 минут', ML + lw + 32, top + 58, { size: 24, weight: 800, color: d ? C.yellow : C.ink, ls: -1 });
  para(ctx, 'Реакция на лид · прозвон базы ЮЛ и ПРОФИ с рассылкой', ML + lw + 32, top + 74, 200, { size: 9, lh: 11.4, color: th.muted, maxLines: 2, page: 19 });
  // KPI
  const kx = ML + lw + 14 + 236 + 14, kw = W - MR - kx;
  card(ctx, th, kx, top, kw, 88, {});
  text(ctx, 'KPI АКТИВНЫХ ПРОДАЖ', kx + 18, top + 26, { size: 9, weight: 700, ls: 1, color: th.muted });
  const kp = [['1 800', 'выездов активные'], ['1 200', 'выездов неактивные'], ['10', 'бронирований в мес'], ['еженед.', 'тендеры']];
  kp.forEach((k, i) => {
    const cwk = (kw - 40) / 4;
    const x = kx + 18 + i * cwk;
    fitText(ctx, k[0], x, top + 54, cwk - 6, { size: 16, weight: 800, color: th.ink, ls: -0.5, minSize: 9.5 });
    para(ctx, k[1], x, top + 67, cwk - 6, { size: 8, lh: 9.6, color: th.muted, maxLines: 2, page: 19 });
  });
  // ритуалы
  const ty = top + 100;
  card(ctx, th, ML, ty, CW, 240, {});
  U.panelHead(ctx, th, ML + 18, ty + 28, 300, 'Ритуалы менеджмента');
  const rows = [
    ['Ежедневно', 'Утренний бриф и цели дня; проверка Presale по сделкам, КП в 1С'],
    ['Еженедельно', 'Цели недели; контроль качества отработки лидов'],
    ['Ежемесячно', 'Полевое сопровождение; обучение от поставщиков и мастер-классы'],
    ['Ежемесячно', 'Путь клиента в ЛМ и у конкурента'],
    ['Ежеквартально', 'Встречи с ТОП-5 поставщиками; защита портфелей КАМ; защита целей СП; деловые игры к сезону'],
    ['Ежеквартально', 'Круглые столы с клиентами, участие в городских мероприятиях'],
  ];
  rows.forEach((r, i) => {
    const y = ty + 48 + i * 31;
    if (i % 2 === 0) rr(ctx, ML + 10, y, CW - 20, 30, 4, d ? 'rgba(255,255,255,0.045)' : '#EFEAE1');
    U.chip(ctx, th, ML + 18, y + 5, r[0], { size: 9, bg: d ? 'rgba(255,198,30,0.14)' : C.yellowSoft });
    para(ctx, r[1], ML + 130, y + 19, CW - 160, { size: 10.2, lh: 12.6, color: th.inkSoft, maxLines: 1, page: 19 });
  });
  U.band(ctx, th, ML, ty + 248, CW, 38, '3 млрд ₽ GMV 2027 — амбиция, в которой Лемана ПРО становится партнёром стройки всего Приморья.', { size: 12, weight: 600, color: d ? '#fff' : C.ink });
  U.footer(ctx, th, 'Источники: данные заказчика — команда активных продаж 23 → 28 человек (+2 КАМ, +2 СП, +1 ИПП), KPI активных продаж (1 800 и 1 200 выездов в год, бронирование 10 объектов в месяц, база тендеров), регламент ритуалов менеджмента 2027.', 19);
};

module.exports = slides;
