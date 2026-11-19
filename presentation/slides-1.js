'use strict';
// Слайды 1–10
const U = require('./lib-ui');
const { C, W, H, ML, MR, CW, text, para, wrap, measure, fitText, fitSize, rr, rect, circle, line, poly, lg, rg, card, bg, shadow, noShadow, drawImg } = U;

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

function logo(ctx, dOrX, x, y, w) {
  // поддержка вызова logo(ctx, x, y, w) и logo(ctx, d, x, y, w)
  let d = false, X = dOrX, Y = x, Wd = y;
  if (typeof dOrX === 'boolean') { d = dOrX; X = x; Y = y; Wd = w; }
  if (TH_LIGHT && d) {
    // светлая 3D-сцена: жёлтый домик + тёмный логотип-надпись
    const lh = w * 359 / 1281;              // высота логотипа как в исходной картинке
    const hh = lh * 0.98, hw = hh / 1.18;   // домик по высоте логотипа
    houseMark(ctx, x, y + (lh - hh) / 2 - lh * 0.02, hw, { door: '#F3F0E9' });
    drawImg(ctx, 'wordmark-dark.png', x + hw + lh * 0.16, y + lh * 0.10, w * 0.735, lh * 0.80);
    return;
  }
  U.drawImg(ctx, d ? 'logo-light.png' : 'logo-dark.png', X, Y, Wd, Wd * 359 / 1281);
}

const TH_LIGHT = !!U.THEMES['3d'].light;   // светлая 3D-сцена

const slides = {};

// ============ 1. Обложка ============
slides[1] = (ctx, th) => {
  const d = th.dark;
  bg(ctx, th);
  if (!d) {
    drawImg(ctx, 'bridge.jpg', 468, 0, 492, H, {
      grad: lg(ctx, 468, 0, 620, 0, [[0, 'rgba(0,0,0,0.28)'], [1, 'rgba(0,0,0,0)']]),
      gradRect: { x: 468, y: 0, w: 152, h: H },
    }); // фото во всю высоту
    poly(ctx, [[790, 0], [960, 0], [960, 128]], C.yellow);
    rect(ctx, 468, 0, 2, H, C.paper);
    logo(ctx, false, 56, 34, 104);
    rect(ctx, 56, 196, 96, 4, C.yellow);
    fitText(ctx, 'ВЛАДИВОСТОК', 56, 292, 408, { size: 66, weight: 800, color: C.ink, ls: -1.6, minSize: 30 });
    text(ctx, 'СТРАТЕГИЯ 2027', 58, 342, { size: 25, weight: 600, color: C.inkSoft, ls: 4.2 });
    line(ctx, 58, 382, 400, 382, C.line2, 1);
    para(ctx, 'Шесть стратегических миров, четыре рычага роста и один путь клиента: от рынка агломерации до проектного центра.', 58, 412, 356, { size: 14.5, lh: 21, color: C.inkSoft, page: 1 });
    text(ctx, 'Л Е М А Н А  П Р О   ·   М А Г А З И Н 7 5   ·   2 0 2 6 → 2 0 2 7', 58, 498, { size: 10.5, weight: 600, color: C.faint, ls: 0.6 });
  } else {
    // 3D: карточка-фото с объёмной рамкой
    const ix = 512, iy = 46, iw = 448, ih = 448;
    rr(ctx, ix - 14, iy + 10, iw + 30, ih, 26, 'rgba(0,0,0,0.55)', { shadow: { color: 'rgba(0,0,0,0.8)', blur: 44, y: 22 } });
    drawImg(ctx, 'bridge.jpg', ix, iy, iw, ih, { clip: 'round', r: 20 });
    rr(ctx, ix, iy, iw, ih, 20, null, { stroke: 'rgba(255,198,30,0.55)', strokeW: 1.5 });
    poly(ctx, [[ix + iw - 4, iy + 4], [ix + iw - 4, iy + 96], [ix + iw - 96, iy + 4]], C.yellow);
    logo(ctx, true, ML, 40, 96);
    rect(ctx, ML, 176, 64, 3, C.yellow);
    fitText(ctx, 'ВЛАДИВОСТОК', ML, 268, 420, { size: 47, weight: 800, fam: 'u', color: '#fff', ls: -1.4, minSize: 30 });
    fitText(ctx, 'СТРАТЕГИЯ 2027', ML + 2, 314, 400, { size: 21, weight: 600, fam: 'u', color: C.yellow, ls: 5, minSize: 14 });
    line(ctx, ML, 352, 372, 352, 'rgba(255,255,255,0.18)', 1);
    para(ctx, 'Шесть стратегических миров, четыре рычага роста и один путь клиента: от рынка агломерации до проектного центра.', ML, 386, 372, { size: 15.5, lh: 23, color: 'rgba(255,255,255,0.82)', page: 1 });
    text(ctx, 'Л Е М А Н А  П Р О   ·   М А Г А З И Н 7 5', ML, 492, { size: 10.5, weight: 700, color: 'rgba(255,255,255,0.5)', ls: 1.4 });
    text(ctx, '2026 → 2027', ML, 512, { size: 10.5, weight: 700, color: C.yellow, ls: 1.4 });
  }
};

// ============ 2. Рынок · Застройка ============
slides[2] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 2, {
    kicker: 'Рынок · застройка',
    title: 'Рынок 29,3 млрд ₽: доля 20% и растущий рынок новосёлов',
    lead: 'Ввод до 2030: 1 016 тыс. м² МКД и 1 000 тыс. м² ИЖС · приоритет — путь клиента новосёла и бригадира',
    titleSize: d ? 25 : 30, gap: 20,
  });
  // левая колонка — приоритеты
  const lx = ML, lw = 268, ly = top - 4, lh = 486 - ly;
  if (!d) {
    rr(ctx, lx, ly, lw, lh, 10, C.dark, { shadow: th.shadow });
    text(ctx, 'ПРИОРИТЕТЫ 2027', lx + 20, ly + 28, { size: 10, weight: 700, ls: 1.6, color: C.yellow });
    para(ctx, 'Путь клиента новосёла и бригадира', lx + 20, ly + 64, lw - 40, { size: 17, weight: 700, lh: 22, color: '#fff', page: 2 });
    const items = ['Приоритет на путь клиента новосёла и бригадира', 'Оффер по доставке', 'Совместная работа с командой ЦО по новосёлам',
      'Работа с отделами продаж ЖК и застройщиками (ПРО + B2C)', 'Готовые решения для застройщиков: БУК проектов под ключевые ЖК',
      'Работа с товарным запасом, прогноз на каждый квартал'];
    let y = ly + 118;
    items.forEach((s) => {
      rect(ctx, lx + 20, y - 4, 10, 2, C.yellow);
      y += para(ctx, s, lx + 38, y, lw - 58, { size: 10.6, lh: 13.6, color: 'rgba(255,255,255,0.88)', page: 2, maxLines: 3 }) + 12;
    });
  } else {
    card(ctx, th, lx, ly, lw, lh, { topAccent: C.yellow });
    text(ctx, 'ПРИОРИТЕТЫ 2027', lx + 22, ly + 34, { size: 9.5, weight: 700, ls: 1.6, color: C.yellow });
    para(ctx, 'Путь клиента новосёла и бригадира', lx + 22, ly + 70, lw - 44, { size: 15.5, weight: 700, lh: 21, color: '#fff', page: 2 });
    const items = ['Приоритет на путь клиента новосёла и бригадира', 'Оффер по доставке', 'Команда ЦО по новосёлам',
      'Отделы продаж ЖК и застройщики (ПРО + B2C)', 'Решения для застройщиков: БУК под ключевые ЖК',
      'Товарный запас и прогноз по кварталам'];
    let y = ly + 124;
    items.forEach((s) => {
      rect(ctx, lx + 22, y - 4, 10, 2, C.yellow);
      y += para(ctx, s, lx + 40, y, lw - 62, { size: 10.4, lh: 13.4, color: 'rgba(255,255,255,0.85)', page: 2, maxLines: 3 }) + 11;
    });
  }
  // центральная колонка — рынок и доля
  const mx = lx + lw + 14, mw = 232;
  card(ctx, th, mx, ly, mw, 178, { fill: d ? undefined : C.yellowSoft, topAccent: d ? null : C.yellow });
  text(ctx, 'РЫНОК И ДОЛЯ', mx + 18, ly + 30, { size: 9.5, weight: 700, ls: 1.4, color: d ? C.yellow : C.yellowDeep });
  text(ctx, 'Объём рынка B2C', mx + 18, ly + 52, { size: 10, color: d ? 'rgba(255,255,255,0.55)' : C.muted });
  fitText(ctx, '29,3 млрд ₽', mx + 18, ly + 84, mw - 36, { size: 28, weight: 800, color: d ? '#fff' : C.ink, ls: -1 });
  para(ctx, 'Владивосток и Артём — растущий рынок новосёлов', mx + 18, ly + 104, mw - 36, { size: 9.8, lh: 12.5, color: d ? 'rgba(255,255,255,0.6)' : C.muted, maxLines: 2, page: 2 });
  text(ctx, 'Доля Лемана ПРО сегодня', mx + 18, ly + 140, { size: 10, color: d ? 'rgba(255,255,255,0.55)' : C.muted });
  text(ctx, '20%', mx + 18, ly + 166, { size: 22, weight: 800, color: d ? C.yellow : C.ink });
  fitText(ctx, 'цель — рост за счёт ПРО и ЖК', mx + 72, ly + 165, mw - 90, { size: 9, color: d ? 'rgba(255,255,255,0.6)' : C.muted, minSize: 7.6 });
  // МКД / ИЖС
  const rows = [['МКД', '1 016', 'тыс. м² · 50% зоны', '251 МКД до 2030'], ['ИЖС', '1 000', 'тыс. м² · 25% зоны', '≈ 9 000 домов']];
  rows.forEach((r, i) => {
    const y = ly + 186 + i * 80;
    card(ctx, th, mx, y, mw, 68, {});
    text(ctx, r[0], mx + 18, y + 26, { size: 9.5, weight: 700, ls: 1.2, color: d ? C.yellow : C.yellowDeep });
    text(ctx, r[1], mx + 18, y + 54, { size: 24, weight: 800, color: th.ink, ls: -0.8 });
    text(ctx, r[2], mx + 92, y + 32, { size: 9.5, color: th.muted });
    text(ctx, r[3], mx + 92, y + 52, { size: 10.5, weight: 600, color: th.inkSoft });
  });
  // правая колонка
  const rx = mx + mw + 16, rw = W - MR - rx;
  // график
  const ch = 174;
  card(ctx, th, rx, ly, rw, ch, {});
  text(ctx, 'Плановые сроки ввода МКД', rx + 18, ly + 28, { size: 11.5, weight: 700, color: th.ink });
  const chartX = rx + 54, chartY = ly + 46, chartW = rw - 76, chartH = 100;
  const data = [{ y: 2026, v: 205 }, { y: 2027, v: 330 }, { y: 2028, v: 210 }, { y: 2029, v: 160 }, { y: 2030, v: 55 }];
  const maxV = 340;
  [0, 170, 340].forEach((g) => {
    const gy = chartY + chartH - (g / maxV) * chartH;
    line(ctx, chartX, gy, chartX + chartW, gy, d ? 'rgba(255,255,255,0.10)' : '#E4DED2', 1);
    text(ctx, String(g), chartX - 8, gy + 3, { size: 8.5, color: th.faint, align: 'right' });
  });
  const bw = chartW / 5 * 0.62;
  data.forEach((p, i) => {
    const bx = chartX + (i + 0.5) * (chartW / 5) - bw / 2;
    const bh = (p.v / maxV) * chartH;
    const hot = p.y === 2027;
    if (!d) rect(ctx, bx, chartY + chartH - bh, bw, bh, hot ? C.yellow : '#D9D2C4');
    else if (hot) rr(ctx, bx, chartY + chartH - bh, bw, bh, 4, lg(ctx, bx, chartY, bx, chartY + chartH, [[0, '#FFE08A'], [1, '#E39B00']]), { shadow: { color: 'rgba(255,198,30,0.45)', blur: 14, y: 0 } });
    else rr(ctx, bx, chartY + chartH - bh, bw, bh, 4, 'rgba(255,255,255,0.16)');
    text(ctx, String(p.y), bx + bw / 2, chartY + chartH + 14, { size: 9, color: hot ? th.ink : th.muted, align: 'center', weight: hot ? 700 : 400 });
    if (hot) text(ctx, String(p.v), bx + bw / 2, chartY + chartH - bh - 6, { size: 9.5, weight: 700, color: d ? C.yellow : C.yellowDeep, align: 'center' });
  });
  text(ctx, 'тыс. м² · пик 2027', rx + rw - 18, ly + 28, { size: 9, color: th.muted, align: 'right' });
  // 251 МКД
  const y2 = ly + ch + 12;
  card(ctx, th, rx, y2, rw, Math.max(150, 486 - y2), {});
  text(ctx, '251 МКД до 2030 года', rx + 18, y2 + 28, { size: 11.5, weight: 700, color: th.ink });
  const facts = ['Запуски новых проектов снижаются: −50% г-1', 'Распроданность: 50% — 2026, 34% — 2027',
    'Рынок завоевали федеральные девелоперы', 'Комфорт-класс с отделкой WB и чистовой',
    '65% — 40 м², 23% — 53 м², 10% — более 65 м²'];
  let fy = y2 + 50;
  facts.forEach((f) => {
    rect(ctx, rx + 18, fy - 4, 8, 2, d ? C.yellow : C.yellowDeep);
    fy += para(ctx, f, rx + 34, fy, rw - 56, { size: 10.2, lh: 13, color: th.inkSoft, maxLines: 2, page: 2 }) + 8.5;
  });
  U.footer(ctx, th, 'Источники: данные заказчика по рынку застройки Владивостока и Артёма; ЕРЗ / Наш.Дом.РФ, Приморскстат; BI ЛП 2026.', 2);
};

// ============ 3. NPS ============
slides[3] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 3, {
    kicker: 'NPS 2027',
    title: 'NPS 58,59 пп — до цели компании 1,41 пп. Осталось дожать сервис',
    lead: 'Замер 2027 · Оффлайн, Онлайн, ПРО и ПП · цель компании 60 пп, амбиция магазина 70 пп',
    titleSize: d ? 26 : 31, gap: 18,
  });
  const cards = [
    ['NPS магазина', '58,59 пп', 'к цели −1,41 пп', C.ink],
    ['Год к году', '−1 пп', 'держим темп', C.ink],
    ['Оффлайн', '59,9 пп', 'магазин и зал', C.ink],
    ['Онлайн', '60,4 пп', 'сильнее всех', C.ink],
    ['ПРО', '49,5 пп', 'зона роста', C.ink],
    ['ПП', '−3,63 пп', 'исправляем', C.ink],
    ['Цель 2027', '60 → 70 пп', 'компания → магазин', C.ink],
  ];
  const gap = 8, cw = (CW - gap * 6) / 7, ch = 84;
  cards.forEach((c, i) => {
    const x = ML + i * (cw + gap);
    const hot = i === 0;
    card(ctx, th, x, top, cw, ch, { fill: hot && !d ? C.yellowSoft : undefined, topAccent: hot ? C.yellow : (d ? null : '#DCD5C7') });
    text(ctx, c[0].toUpperCase(), x + 12, top + (d ? 32 : 22), { size: 8.6, weight: 700, ls: 0.7, color: th.muted });
    fitText(ctx, c[1], x + 12, top + (d ? 60 : 50), cw - 24, { size: 19, weight: 800, color: hot ? (d ? C.yellow : C.ink) : th.ink, ls: -0.6, minSize: 12 });
    text(ctx, c[2], x + 12, top + ch - (d ? 10 : 12), { size: 9.2, color: th.muted });
  });
  const cy = top + ch + 14;
  const colW = (CW - 20) / 2;
  const colH = 490 - cy;
  // левая колонка
  card(ctx, th, ML, cy, colW, colH, {});
  U.panelHead(ctx, th, ML + 18, cy + 26, colW - 36, 'Что просят клиенты — топ-5 тем');
  const reqs = [
    ['1 · Самовывоз и доставка', 'Заказ не готов к приезду, очереди и срывы. Начинаем с готовности заказа и честного оповещения.'],
    ['2 · Точность заказов и остатков', 'Ошибка в сборке или «на сайте есть — в магазине нет» = повторная поездка.'],
    ['3 · Общение и решение проблем', 'Не дозвониться, отделы перекладывают. Один ответственный ведёт обращение до решения.'],
    ['4 · Ассортимент и цены', 'Отмечают высокие цены — работаем с полкой под проект.'],
    ['5 · Телеги в сезон', 'В сезон телег не хватало — возвращаем в зал к следующему пику.'],
  ];
  let y = cy + 46;
  reqs.forEach((r) => {
    text(ctx, r[0], ML + 18, y, { size: 11, weight: 700, color: d ? C.yellow : C.ink });
    y += 14;
    y += para(ctx, r[1], ML + 18, y, colW - 36, { size: 9.4, lh: 11.6, color: th.inkSoft, maxLines: 2, page: 3, minSize: 8.4 }) + 9;
  });
  // правая колонка
  const rx = ML + colW + 20;
  card(ctx, th, rx, cy, colW, colH, {});
  U.panelHead(ctx, th, rx + 18, cy + 26, colW - 36, 'План действий · и что уже сделали');
  const blocks = [
    ['Что уже сделали', ['Чек-лист ПП ТК: контролируем погрузку транспортных компаний', '30 минут на проверку товара вместе с клиентом при доставке', 'Работали со сборщиками: проверка партий, ноль брака']],
    ['Еженедельный контроль — без выходных', ['Собираем низкие оценки и комментарии в единый список', 'Один ответственный на обращение — до закрытия', 'Звоним клиенту, предлагаем решение: довоз, обмен, возврат или компенсация', 'Называем срок следующего шага']],
    ['Готовимся к сезону', ['Планируем потребность в людях на логистику заранее', 'Грузчик в зоне самовывоза — помогаем с погрузкой', 'Закупаем покупательские телеги к сезону']],
  ];
  let by = cy + 46;
  blocks.forEach((b) => {
    text(ctx, b[0], rx + 18, by, { size: 10.8, weight: 700, color: d ? C.yellow : C.ink });
    by += 13;
    b[1].forEach((it) => {
      rect(ctx, rx + 18, by - 4, 8, 2, d ? C.yellow : C.yellowDeep);
      by += para(ctx, it, rx + 32, by, colW - 52, { size: 9.2, lh: 11.2, color: th.inkSoft, maxLines: 2, page: 3, minSize: 8.2 }) + 2;
    });
    by += 7;
  });
  U.footer(ctx, th, 'Источники: замер NPS (58,59 пп · Оффлайн 59,9 · Онлайн 60,4 · ПРО 49,5 · ПП −3,63 · к цели −1,41 пп · г-г −1 пп), цели: компания 60 пп, магазин 70 пп · магазин 75, Владивосток.', 3);
};

// ============ 4. CJM ============
slides[4] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 4, {
    kicker: 'CJM · снимаем боли клиентов',
    title: 'Путь клиента: 4 ключевых этапа роста в 2027',
    lead: 'Формирование потребности → развитие вовлечения и лояльности: где работают страт-миры, новосёлы и доставка',
    titleSize: d ? 26 : 32, gap: 16,
  });
  const stages = [
    { k: 'ШАГ', t: 'Формирование потребности' }, { k: 'ШАГ', t: 'Поиск и выбор решения', star: 1 },
    { k: 'ШАГ', t: 'Оформление и покупка', star: 1 }, { k: 'ШАГ', t: 'Оплата' },
    { k: 'ШАГ', t: 'Коммуникации и сопровождение' }, { k: 'ШАГ', t: 'Получение товара / услуги', star: 1, hot: 1 },
    { k: 'ШАГ', t: 'Отмены / возвраты' }, { k: 'ШАГ', t: 'Развитие вовлечения и лояльности', star: 1, hot: 1 },
  ];
  U.stepsRow(ctx, th, ML, top, CW, 72, stages, { gap: 7, size: 9.6 });
  const gy = top + 88;
  const cw = (CW - 20) / 2, chh = 124;
  const blocks = [
    { t: 'ДОСТУПНОСТЬ ТОВАРА', sub: 'Сток в магазине + СК Хабаровск', lead: 'Доступность товара для клиента по факту, а не на бумаге 98%', m: ['Гамма А, А0, АС – 95% присутствие', 'Присутствие НК 95%+', 'Доля 20/80 – 48%, Best Seller – 15%+'], hot: false },
    { t: 'ИСПОЛНЕНИЕ ЗАКАЗОВ КЛИЕНТОВ', sub: 'Оффер, сервис, ДС за 3 дня', lead: 'Трансформация логистики. Акция для новосёлов: охват ЖК до 20', m: ['CSAT с 4,64 до 4,85', 'OTIF с 83% до 90%', 'Доля КЗ с 43% до 50%'], hot: false },
    { t: 'РАЗВИТИЕ ПРОДАЖ', sub: 'Рост компетенций сотрудников в ТЗ', lead: 'Больше консультаций с ростом полноты решения', m: ['Рост консультаций с 1,33 до 2 в час', 'Полнота решения с 50% до 85%', 'Рост передачи клиентов, трекинг через УО', 'Продажи услуг SAR с 5,96% до 7,5%'], hot: true },
    { t: 'НОВОСЁЛЫ + БРИГАДИРЫ', sub: 'Увеличить охват клиентов', lead: 'Рост доли охвата новосёлов и рефералов', m: ['Доля охвата новосёлов 50% от 30 тыс. клиентов', 'Проектов на клиента с 1,3 до 5+', 'Доля рефералов от АКБ с 4,34% до 30%'], hot: true },
  ];
  blocks.forEach((b, i) => {
    const x = ML + (i % 2) * (cw + 20), y = gy + Math.floor(i / 2) * (chh + 16);
    card(ctx, th, x, y, cw, chh, { fill: b.hot && !d ? '#FDF6E2' : (d && b.hot ? lg(ctx, x, y, x, y + chh, [[0, 'rgba(255,198,30,0.14)'], [1, 'rgba(255,198,30,0.03)']]) : undefined), topAccent: b.hot ? C.yellow : (d ? null : null) });
    text(ctx, b.t, x + 18, y + 24, { size: 11.6, weight: 700, color: th.ink, ls: 0.2 });
    text(ctx, b.sub, x + 18, y + 40, { size: 9.6, color: th.muted });
    text(ctx, b.lead, x + 18, y + 58, { size: 10.4, weight: 600, color: d ? '#fff' : C.ink });
    let my = y + 74;
    b.m.forEach((m) => {
      rect(ctx, x + 18, my - 4, 8, 2, d ? C.yellow : C.yellowDeep);
      my += para(ctx, m, x + 32, my, cw - 50, { size: 9.6, lh: 12, color: th.inkSoft, maxLines: 1, page: 4 }) + 2;
    });
  });
  U.footer(ctx, th, 'Источник: CJM магазина 75 (данные заказчика). ★ — ключевые шаги 2027; *** — целевой прирост продаж проектов, требует подтверждения владельца метрики.', 4);
};

// ============ 5. Доступность ============
slides[5] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 5, {
    kicker: 'Доступность · склад',
    title: 'Склад наполняет полку раньше, чем клиент придёт',
    lead: '977 → 1 200 паллетомест, 1 700+ новых артикулов, обратный поток −34% и 720 м² крытой отгрузки',
    titleSize: d ? 24 : 31, gap: 12,
  });
  U.kpiRow(ctx, th, ML, top, CW, 74, [
    { label: 'Ёмкость склада', value: '977 → 1 200', note: '+223 пм · +23%' },
    { label: 'Гамма подбора', value: '1 700+', note: 'новых артикулов · 6 отделов' },
    { label: 'Обратный поток', value: '37,7% → 25%', note: '−34% к текущему уровню' },
    { label: 'Доступность товара', value: '98%', note: 'цель на полке · +32,6% SKU' },
    { label: 'Эффект RD в год', value: '29,9 млн ₽', note: 'упущенный ТО 23,1 млн ₽', accent: C.yellow },
  ], { size: 20 });
  const gy = top + 86, ph = 452 - gy;
  const cw = (CW - 24) / 3;
  const cols = [
    { t: 'СКЛАД И ГАММА', lead: 'Сборки со склада под КЗ: 15% → 25%+', m: ['1 700+ артикулов подбора: отделы 4, 5, 8, 11, 12, 14', '+223 паллетоместа — место под сборку клиентских заказов', 'Обратный поток 37,7% → 25%: −34% к текущему уровню'] },
    { t: 'ДОСТУПНОСТЬ ТОВАРА', lead: 'Цель доступности на полке 98%', m: ['+32,6% SKU доступности с удалённого склада', 'Товары с RD — в склад магазина: полка не пустеет', '≥ 30 SKU/ч — нацеленность команды пополнения', '+1 МЦПМ в команде пополнения'] },
    { t: 'УДОБСТВО КЛИЕНТА · НАВЕС', lead: 'Крытая зона отгрузки 720 м²', m: ['Сухо: не мокнем под дождём и снегом', 'Предсказуемо: слоты держим по времени', 'Безопасно: ровное покрытие без луж и наледи', 'Комфортно: отдельная зона для доставок'] },
  ];
  cols.forEach((c, i) => {
    const x = ML + i * (cw + 12);
    card(ctx, th, x, gy, cw, ph, {});
    U.panelHead(ctx, th, x + 18, gy + 28, cw - 36, c.t);
    text(ctx, c.lead, x + 18, gy + 60, { size: 11.6, weight: 700, color: d ? '#fff' : C.ink });
    let y = gy + 82;
    c.m.forEach((m) => {
      rect(ctx, x + 18, y - 4, 8, 2, d ? C.yellow : C.yellowDeep);
      y += para(ctx, m, x + 32, y, cw - 50, { size: 10.6, lh: 13.4, color: th.inkSoft, maxLines: 2, page: 5 }) + 8;
    });
  });
  U.band(ctx, th, ML, gy + ph + 8, CW, 38, 'Склад перестаёт быть «местом хранения»: товар приезжает на полку раньше, чем клиент придёт за ним. CSAT 4,85 — цель · грузчик +1 в смену', { size: 11.4, weight: 600, color: d ? '#fff' : C.ink });
  U.footer(ctx, th, 'Источники: данные заказчика — стратегия ЦПМ 75, переимплантация склада и доступность товара, 2026–2027. RD — удалённый склад · КЗ — клиентский заказ · CSAT — оценка клиента · SKU — товарная позиция.', 5);
};

// ============ 6. Логистика ============
slides[6] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 6, {
    kicker: 'Логистика',
    title: 'Команда в пике, короткий путь заказа и оффер в новостройки',
    lead: '176 человек в пике нагрузки, 58 FTE снимает 3PL, новостройки — 400 млн ₽ GMV к концу 2027',
    titleSize: d ? 24 : 30, gap: 16,
  });
  U.kpiRow(ctx, th, ML, top, CW, 78, [
    { label: 'Команда склада в пике', value: '176 чел.', note: '43 / 43 / 61 / 29 по участкам' },
    { label: 'Операционная нагрузка', value: '58 FTE', note: 'снимаем с магазина на год' },
    { label: 'Время магазину', value: '9 520 ч', note: 'возвращаем в год' },
    { label: 'GMV LT-отгрузок', value: '+18%', note: 'прогноз к 2027 году' },
    { label: 'Оффер в новостройки', value: '400 млн ₽', note: 'цель 2027 · ещё 10 ЖК', accent: C.yellow },
  ], { size: 21 });
  const gy = top + 92;
  // левый блок — команда
  const lw = 330;
  const bh = 200;
  card(ctx, th, ML, gy, lw, bh, {});
  U.panelHead(ctx, th, ML + 18, gy + 30, lw - 36, 'Команда в пике нагрузки');
  const team = [['43', 'Складские операции'], ['43', 'ОЗК'], ['61', 'Пополнение'], ['29', 'Выдача']];
  const tw = (lw - 36 - 24) / 4;
  team.forEach((t, i) => {
    const x = ML + 18 + i * (tw + 8);
    card(ctx, th, x, gy + 50, tw, 62, { fill: d ? 'rgba(255,255,255,0.05)' : '#F7F3EA', flat: true, stroke: d ? 'rgba(255,255,255,0.08)' : C.line });
    text(ctx, t[0], x + 10, gy + 78, { size: 21, weight: 800, color: d ? C.yellow : C.ink, ls: -0.6 });
    para(ctx, t[1], x + 10, gy + 94, tw - 16, { size: 8.6, lh: 10.5, color: th.muted, maxLines: 2, page: 6 });
  });
  let y = gy + 132;
  ['Штат считаем от целевой продуктивности и закрываем на месяц раньше сезона', 'Профессионализм: обучение, сертификация, совмещение профессий, кадровый резерв'].forEach((s) => {
    rect(ctx, ML + 18, y - 4, 8, 2, d ? C.yellow : C.yellowDeep);
    y += para(ctx, s, ML + 32, y, lw - 54, { size: 10.2, lh: 13, color: th.inkSoft, maxLines: 2, page: 6 }) + 9;
  });
  // центр — путь заказа
  const mx = ML + lw + 14, mw = 236;
  card(ctx, th, mx, gy, mw, bh, {});
  U.panelHead(ctx, th, mx + 18, gy + 30, mw - 36, 'LT-поток: путь заказа');
  const steps = [['ШАГ 1 · ДАРКСТОР', '800+ артикулов добавляется · отделы 2, 5, 6, 7, 14, 15'], ['ШАГ 2 · 3PL', '3PL — партнёрская обработка и доставка, снимаем нагрузку'], ['ШАГ 3 · КЛИЕНТ', 'Быстрее: стабильные сроки, меньше ручных операций']];
  let sy = gy + 52;
  steps.forEach((s, i) => {
    if (d) rr(ctx, mx + 18, sy, mw - 36, 52, 8, 'rgba(255,255,255,0.05)', { stroke: 'rgba(255,255,255,0.07)' });
    else rr(ctx, mx + 18, sy, mw - 36, 52, 6, '#F7F3EA', { stroke: C.line });
    rect(ctx, mx + 18, sy, 3, 52, d ? C.yellow : C.yellow);
    text(ctx, s[0], mx + 30, sy + 18, { size: 8.8, weight: 700, ls: 0.8, color: d ? C.yellow : C.yellowDeep });
    para(ctx, s[1], mx + 30, sy + 32, mw - 58, { size: 9.4, lh: 11.4, color: th.inkSoft, maxLines: 2, page: 6 });
    sy += 60;
  });
  // правый блок — новостройки
  const rx = mx + mw + 14, rw = W - MR - rx;
  card(ctx, th, rx, gy, rw, bh, { fill: d ? lg(ctx, rx, gy, rx, gy + bh, [[0, 'rgba(255,198,30,0.12)'], [1, 'rgba(255,198,30,0.02)']]) : C.yellowSoft });
  U.panelHead(ctx, th, rx + 18, gy + 30, rw - 36, 'Клиентский оффер в новостройки');
  const offs = [['СЕГОДНЯ', '60 млн ₽', 'текущий GMV по 5 ЖК · 4% GMV доставки'], ['КОНЕЦ 2026', '100 млн ₽', 'прогноз по всем ЖК · +20 млн ₽'], ['ЦЕЛЬ · КОНЕЦ 2027', '400 млн ₽', 'ещё 10 новых ЖК в 2027']];
  let oy = gy + 52;
  offs.forEach((o, i) => {
    const last = i === 2;
    text(ctx, o[0], rx + 18, oy + 8, { size: 8.6, weight: 700, ls: 1.1, color: last ? (d ? C.yellow : C.yellowDeep) : th.muted });
    fitText(ctx, o[1], rx + 18, oy + 32, rw - 130, { size: last ? 24 : 20, weight: 800, color: th.ink, ls: -0.8, minSize: 13 });
    text(ctx, o[2], rx + 18, oy + 47, { size: 9.2, color: th.inkSoft });
    if (last) hbar(ctx, th, rx + 18, oy + 54, rw - 36, 4, 1);
    oy += 52;
  });
  U.band(ctx, th, ML, gy + bh + 10, CW, 42, 'Один склад, одна команда, понятный путь заказа — и клиент, который возвращается.', { size: 12, weight: 600, color: d ? '#fff' : C.ink });
  U.footer(ctx, th, 'Источники: данные заказчика — стратегия ЦПМ 75 (команда склада, LT-поток, новостройки), 2026–2027. 5 ЖК сегодня и 5 с октября 2026 · 3PL — партнёрская логистика · ОЗК — обработка заказов клиентов · FTE — полная занятость.', 6);
};

// ============ 7. Проектные продажи ============
slides[7] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 7, {
    kicker: 'Проектные продажи',
    title: 'Комплексное решение вместо товара',
    lead: 'Потенциал входящего потока, конкуренты, конверсия, комплектность и обучение — пять фокусов 2027',
    titleSize: d ? 26 : 32, gap: 16,
  });
  U.kpiRow(ctx, th, ML, top, CW, 86, [
    { label: 'GMV проектных продаж, 2027', value: '1 634 млн ₽', note: '+58,3% к 2026', accent: C.yellow },
    { label: 'GMV проектных продаж, 2026', value: '952,7 млн ₽', note: '+7% к цели' },
    { label: 'Сделки', value: '21 176', note: '+44% к 2026' },
    { label: 'Конверсия', value: '55%', note: '+14% к 2026' },
  ], { size: 25 });
  const gy = top + 100;
  const items = [
    { n: '01', title: 'Потенциал во входящем потоке', text: 'Партнёрства с дизайнерами, бригадами и застройщиками · целевой трафик для каждого проектного мира · быстрая обработка лидов' },
    { n: '02', title: 'Конкуренты', text: 'Ежемесячно посещаем конкурентов, анализируем сервис, разрабатываем УТП и сравниваем цены «ТОВАР + УСЛУГА»' },
    { n: '03', title: 'Конверсия', text: 'Прозрачная смета в разрезе «товар», «доставка», «услуга» · обещание и соблюдение сроков · клиент получает решение, а не товар' },
    { n: '04', title: 'Комплектность и услуги', text: 'Стандарт наполнения каждого проекта и презентация через выгоду · ежемесячный анализ NPS с обратной связью партнёрам · воркшоп с мастерами' },
    { n: '05', title: 'Обучение', text: 'Еженедельный разбор 3–5 звонков клиентам · ежеквартальное обучение ВИП с практикой · 100% бланков выявления потребности' },
  ];
  const rh = 49;
  items.forEach((it, i) => {
    const y = gy + i * (rh + 5);
    card(ctx, th, ML, y, CW, rh, { flat: !d, shadow: null });
    if (!d) {
      rr(ctx, ML, y, 34, rh, 0, C.dark);
      rr(ctx, ML, y, 3, rh, 0, C.yellow);
      text(ctx, it.n, ML + 19, y + rh / 2 + 4, { size: 11, weight: 700, color: '#fff', align: 'center' });
    } else {
      rr(ctx, ML + 6, y + 8, 30, rh - 16, 7, lg(ctx, ML, y, ML + 36, y + rh, [[0, '#FFD75E'], [1, '#DF9A00']]));
      text(ctx, it.n, ML + 21, y + rh / 2 + 4, { size: 11, weight: 800, color: '#241C00', align: 'center' });
    }
    text(ctx, it.title, ML + 50, y + rh / 2 + 4, { size: 12, weight: 700, color: th.ink });
    para(ctx, it.text, ML + 250, y + 15, CW - 268, { size: 10.4, lh: 13, color: th.inkSoft, maxLines: 2, page: 7 });
  });
  U.footer(ctx, th, 'Источники: данные заказчика — проектные продажи магазина 75: GMV 2027 — 1 634 млн ₽ (+58,3%), 2026 — 952,7 млн ₽, 21 176 сделок, конверсия 55%.', 7);
};

// ============ 8. Проектный центр ============
slides[8] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 8, {
    kicker: 'Проектный центр',
    title: 'Пять отделов в одном пространстве — 1 634 млн ₽ проектных продаж',
    lead: 'Открытие — февраль 2027 · 530 м² · ванная + кухня + хранение + двери + полы',
    titleSize: d ? 24 : 29, gap: 14,
  });
  U.kpiRow(ctx, th, ML, top, CW, 80, [
    { label: 'GMV проектных продаж, 2027', value: '1 634 млн ₽', note: '2026: 797 · +53,8% г-г', accent: C.yellow },
    { label: 'GMV проектного центра', value: '446 млн ₽', note: 'без НДС · +324 млн к магазину' },
    { label: 'Маржа ПЦ 2027', value: '105 млн ₽', note: '23,5% от GMV центра' },
    { label: 'Конверсия прорисовки', value: '56%', note: '508 прорисовок в месяц' },
  ], { size: 23 });
  const gy = top + 90, ph = 210;
  const lw = 470;
  card(ctx, th, ML, gy, lw, ph, {});
  U.panelHead(ctx, th, ML + 18, gy + 30, lw - 36, 'Пять миров в одну воронку');
  text(ctx, 'доля / конверсия', ML + lw - 18, gy + 28, { size: 9, color: th.muted, align: 'right' });
  const worlds = [['Ванная', 'драйвер проектных продаж', '67%'], ['Кухня', 'прибыли ПЦ', '45%'], ['Гардеробные', 'локомотив трафика', '41%'], ['Двери', 'план с 4-го месяца', '73%'], ['Полы', 'план с 4-го месяца', '73%']];
  let wy = gy + 48;
  const wrh = 34;
  worlds.forEach((w, i) => {
    if (i % 2 === 0) rr(ctx, ML + 12, wy, lw - 24, wrh, 4, d ? 'rgba(255,255,255,0.045)' : '#EFEAE1');
    text(ctx, w[0], ML + 24, wy + 15, { size: 11.2, weight: 700, color: th.ink });
    text(ctx, w[1], ML + 24, wy + 28, { size: 8.8, color: th.muted });
    hbar(ctx, th, ML + 190, wy + 19, lw - 300, 6, parseInt(w[2]) / 100);
    text(ctx, w[2], ML + lw - 24, wy + 22, { size: 12, weight: 800, color: d ? C.yellow : C.ink, align: 'right' });
    wy += wrh + 2;
  });
  // экономика
  const rx = ML + lw + 14, rw = W - MR - rx;
  card(ctx, th, rx, gy, rw, ph, {});
  U.panelHead(ctx, th, rx + 18, gy + 30, rw - 36, 'Экономика запуска');
  const eco = [
    ['CAPEX проекта', '14,6 млн ₽', 1], ['OPEX, в т. ч.:', '127,6 млн ₽', 1],
    ['непрямые затраты', '33,7', 0], ['затраты на ремонт', '30,0', 0], ['расходы на персонал', '27,45', 0],
    ['административные', '13,3', 0], ['изъятие товаров на образцы', '6,9', 0],
    ['RO ПЦ 2027', '+12,4 млн ₽', 1], ['Окупаемость', 'июль 2027', 1], ['Новых сделок', '4 782', 1],
  ];
  let ey = gy + 48;
  eco.forEach((r) => {
    const bold = r[2];
    if (bold) {
      if (!d) line(ctx, rx + 18, ey + 5, rx + rw - 18, ey + 5, C.line, 1);
    }
    text(ctx, r[0], rx + (bold ? 18 : 30), ey, { size: bold ? 10.6 : 9.8, weight: bold ? 700 : 400, color: bold ? th.ink : th.inkSoft });
    text(ctx, r[1], rx + rw - 18, ey, { size: bold ? 10.6 : 9.8, weight: bold ? 800 : 500, color: bold ? (d ? C.yellow : C.ink) : th.inkSoft, align: 'right' });
    ey += bold ? 19 : 14;
  });
  U.band(ctx, th, ML, gy + ph + 10, CW, 36, 'Прочее 16,2 млн ₽: списание материалов 6,3 · реклама 3,8 · текущие 3,5 · амортизация 2,1 · командировки 0,5', { size: 10 });
  U.footer(ctx, th, 'Источники: кейс «Лемана ПРО · Проектный центр · Владивосток 2026» (версия 03.11); BI ЛП 2026; расчётные модели «Расчет_открытия_малого_ПЦ» и «Расчет_ПЦ_интерактивная_модель».', 8);
};

// ============ 9. Проектный центр — инициативы ============
slides[9] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 9, {
    kicker: 'Проектный центр · инициативы запуска',
    title: 'Шесть инициатив: 14 специалистов, 508 прорисовок, каннибализация ≤ 15%',
    lead: 'GMV 446 млн ₽ без НДС · маржа 105 млн ₽ · RO +12,4 млн ₽ · конверсия 56%',
    titleSize: d ? 23 : 28, gap: 14,
  });
  const items = [
    { n: '01', title: 'Пять отделов в одном пространстве', text: 'Ванная 60 · кухня 70 · хранение 50 · двери 50 · полы 70 м² — 300 м² экспо без перегородок', tag: 'февраль', val: '5 миров' },
    { n: '02', title: 'Команда: 14 специалистов, 8 в смену', text: 'Ванная 4 · кухня 4 · хранение 3 · двери и пол 3; 4 профессионала, 10 специалистов+', tag: 'Q1', val: '14 / 8' },
    { n: '03', title: 'Поток: 508 прорисовок в месяц', text: 'Реклама, застройщики, дизайнеры и партнёрские программы — 47% прорисовок магазина', tag: 'Q1–Q4', val: '508 / мес' },
    { n: '04', title: 'Зона сторонних дизайнеров — 2 места', text: 'Партнёрская программа: внешние дизайнеры ведут клиентов на базе ПЦ', tag: 'Q1', val: '+2 партнёра' },
    { n: '05', title: 'Электронная очередь и расписание', text: '36 слотов приёма в смену: 4 специалиста 9:00–18:00 и 4 специалиста 12:00–21:00', tag: 'февраль', val: '36 слотов' },
    { n: '06', title: 'Контроль каннибализации ≤ 15%', text: 'Гео-аналитика с первых месяцев: разделение зон охвата с магазином', tag: 'ежемесячно', val: '≤ 15%' },
  ];
  const gy = top, cols = 3;
  const gap = 12, cw = (CW - gap * (cols - 1)) / cols, chh = 110;
  items.forEach((it, i) => {
    const x = ML + (i % cols) * (cw + gap), y = gy + Math.floor(i / cols) * (chh + gap);
    card(ctx, th, x, y, cw, chh, {});
    if (!d) {
      rr(ctx, x + 18, y + 18, 26, 26, 6, C.dark);
      text(ctx, it.n, x + 31, y + 36, { size: 10.5, weight: 700, color: '#fff', align: 'center' });
    } else {
      rr(ctx, x + 18, y + 18, 28, 28, 8, lg(ctx, x, y, x + 28, y + 28, [[0, '#FFD75E'], [1, '#DF9A00']]));
      text(ctx, it.n, x + 32, y + 37, { size: 10.5, weight: 800, color: '#241C00', align: 'center' });
    }
    fitText(ctx, it.title, x + 54, y + 36, cw - 72, { size: 12, weight: 700, color: th.ink, minSize: 9.5 });
    para(ctx, it.text, x + 18, y + 62, cw - 36, { size: 10.2, lh: 13, color: th.inkSoft, maxLines: 2, page: 9 });
    U.chip(ctx, th, x + 18, y + chh - 30, it.tag, { size: 8.8 });
    text(ctx, it.val, x + cw - 18, y + chh - 17, { size: 11.5, weight: 800, color: d ? C.yellow : C.ink, align: 'right' });
  });
  const by = gy + 2 * (chh + gap) + 8;
  // план запуска
  card(ctx, th, ML, by, CW, 88, { fill: d ? lg(ctx, ML, by, ML + CW, by + 96, [[0, 'rgba(255,198,30,0.13)'], [1, 'rgba(255,198,30,0.02)']]) : C.yellowSoft });
  text(ctx, 'ПЛАН ЗАПУСКА · 10.01.2027', ML + 20, by + 22, { size: 9.6, weight: 700, ls: 1.5, color: d ? C.yellow : C.yellowDeep });
  const plan = [['ФЕВРАЛЬ', 'Открытие ПЦ', '5 миров, 8 АРМ и 2 дизайнера'], ['МАРТ–ИЮНЬ', 'Ramp-up', '40% → 100% мощности'], ['ИЮЛЬ', '100% и окупаемость', '508 прорисовок в месяц'], ['УСПЕХ', 'Три условия', 'поток · каннибализация · контроль']];
  plan.forEach((p, i) => {
    const x = ML + 20 + i * ((CW - 40) / 4);
    const colW = (CW - 40) / 4 - 26;
    text(ctx, p[0], x, by + 44, { size: 8.8, weight: 700, ls: 1.1, color: th.muted });
    fitText(ctx, p[1], x, by + 61, colW, { size: 11.6, weight: 700, color: th.ink, minSize: 9.4 });
    para(ctx, p[2], x, by + 76, colW, { size: 9.2, lh: 11.2, color: th.inkSoft, maxLines: 1, page: 9 });
  });
  U.footer(ctx, th, 'Три условия успеха: поток 508 прорисовок/мес (47% потока магазина) · каннибализация ≤ 15% (при 15% ПЦ теряет 17,2 млн ₽ маржи магазина — учтено) · еженедельный операционный контроль факта, конверсии и чека.', 9);
};

// ============ 10. Новосёлы ============
slides[10] = (ctx, th) => {
  const d = th.dark;
  const top = U.header(ctx, th, 10, {
    kicker: 'Новосёлы · Владивосток',
    title: '30 845 квартир в потенциале, 4 099 новосёлов в программе и 39% со сделкой',
    lead: 'Программа «Новосёл» · магазин 75 · регистрации с апреля 2025 · охват 13,29% · демарш лидера — Нижний Новгород',
    titleSize: d ? 23 : 27, gap: 14,
  });
  U.kpiRow(ctx, th, ML, top, CW, 76, [
    { label: 'Потенциал новосёлов', value: '30 845', note: 'квартир в зоне охвата', accent: C.yellow },
    { label: 'В программе', value: '4 099', note: '4 049 за период' },
    { label: 'Охват потенциала', value: '13,29%', note: '4 099 от 30 845' },
    { label: 'Со сделкой', value: '39,34%', note: '1 593 клиента' },
  ], { size: 24 });
  const gy = top + 84, ph = 164;
  // воронка
  const lw = 300;
  card(ctx, th, ML, gy, lw, ph, {});
  U.panelHead(ctx, th, ML + 18, gy + 30, lw - 36, 'Воронка программы, клиентов');
  const fun = [['Потенциал квартир', '30 845', '100%', 1], ['В программе', '4 099', '13,29% от потенциала', 0.72], ['Со сделкой', '1 593', '39,34% от новосёлов', 0.48]];
  let fy = gy + 52;
  fun.forEach((f) => {
    const bw = (lw - 40) * f[3];
    if (!d) {
      rr(ctx, ML + 20, fy, bw, 32, 5, f[3] === 1 ? C.dark : (f[3] === 0.72 ? '#3C3F43' : C.yellow));
      text(ctx, f[0], ML + 30, fy + 13, { size: 9.2, weight: 600, color: '#fff' });
      text(ctx, f[1], ML + 30, fy + 26, { size: 11.6, weight: 800, color: '#fff' });
    } else {
      rr(ctx, ML + 20, fy, bw, 32, 6, f[3] === 1 ? 'rgba(255,255,255,0.18)' : (f[3] === 0.72 ? 'rgba(255,255,255,0.10)' : lg(ctx, ML, fy, ML + bw, fy + 32, [[0, '#FFE08A'], [1, '#E39B00']])));
      text(ctx, f[0], ML + 30, fy + 13, { size: 9.2, weight: 600, color: f[3] === 0.48 ? '#241C00' : '#fff' });
      text(ctx, f[1], ML + 30, fy + 26, { size: 11.6, weight: 800, color: f[3] === 0.48 ? '#241C00' : '#fff' });
    }
    // подпись доли — внутри своей полосы справа, если влезает, иначе справа от неё
    {
      const lbl = f[2];
      const inside = bw - 76;
      const tw = U.textW(ctx, lbl, { size: 9.2 });
      const col = f[3] === 0.48 ? '#241C00' : (d ? 'rgba(255,255,255,0.85)' : '#fff');
      if (tw <= inside) text(ctx, lbl, ML + 20 + bw - 10, fy + 21, { size: 9.2, color: col, align: 'right' });
      else text(ctx, lbl, ML + 20 + bw + 8, fy + 21, { size: 8.8, color: th.muted });
    }
    fy += 36;
  });
  // GMV
  const mx = ML + lw + 14, mw = 210;
  card(ctx, th, mx, gy, mw, ph, {});
  U.panelHead(ctx, th, mx + 18, gy + 30, mw - 36, 'GMV новосёлов, млн ₽');
  const gmv = [['1 203,4', 'новосёлы'], ['318,6', 'сделки'], ['134,6', 'карты лояльности']];
  let my = gy + 52;
  gmv.forEach((g) => {
    text(ctx, g[0], mx + 18, my + 18, { size: 23, weight: 800, color: th.ink, ls: -0.8 });
    text(ctx, g[1], mx + 18, my + 31, { size: 9.4, color: th.muted });
    my += 38;
  });
  // демарш
  const rx = mx + mw + 14, rw = W - MR - rx;
  card(ctx, th, rx, gy, rw, ph, { fill: d ? lg(ctx, rx, gy, rx, gy + ph, [[0, 'rgba(255,198,30,0.12)'], [1, 'rgba(255,198,30,0.02)']]) : C.yellowSoft });
  U.panelHead(ctx, th, rx + 18, gy + 30, rw - 36, 'Демарш лидера');
  text(ctx, 'Нижний Новгород', rx + 18, gy + 56, { size: 13, weight: 700, color: th.ink });
  text(ctx, 'цель 2027 — сравняться', rx + 18, gy + 70, { size: 9.6, color: th.muted });
  const dm = [['Охват потенциала', '18,54%', 'у нас 13,29% · +5,2 п.п.'], ['Конверсия в сделку', '44,58%', 'у нас 39,34% · +5,2 п.п.'], ['GMV новосёлов', '681,7 млн ₽', '5 428 новосёлов'], ['Сделок на клиента', '1,23', 'проектных миров 1,19']];
  dm.forEach((r, i) => {
    const x = rx + 18 + (i % 2) * ((rw - 36) / 2 + 6);
    const y = gy + 84 + Math.floor(i / 2) * 42;
    text(ctx, r[0], x, y, { size: 9, color: th.muted });
    text(ctx, r[1], x, y + 19, { size: 17, weight: 800, color: th.ink, ls: -0.5 });
    text(ctx, r[2], x, y + 32, { size: 8.8, color: d ? 'rgba(255,255,255,0.55)' : C.muted });
  });
  // нижний ряд
  const by = gy + ph + 10;
  const cw3 = (CW - 24) / 3;
  const b3 = [
    ['Уже сделано в 2026', ['Выделен специалист сопровождения B2C-новосёлов', '26 билбордов по городу с актуальными акциями', 'Экспозиция на Week Design с регистрацией новосёлов']],
    ['Что делаем дальше', ['Купоны у застройщиков — при выдаче ключей', 'Массовые выдачи ключей с подарками', 'Брендинг лифтов и каталоги программы', 'Машины доставки с акцией «Новосёлы»']],
    ['Экономика программы', ['13,29% → 18,54% охвата потенциала', '39,34% → 44,58% конверсия в сделку', '681,7 млн ₽ GMV · 5 428 новосёлов']],
  ];
  b3.forEach((b, i) => {
    const x = ML + i * (cw3 + 12);
    card(ctx, th, x, by, cw3, Math.max(88, 478 - by), {});
    text(ctx, b[0], x + 18, by + 26, { size: 11, weight: 700, color: d ? C.yellow : C.ink });
    let y = by + 44;
    b[1].forEach((s) => {
      rect(ctx, x + 18, y - 4, 7, 2, d ? C.yellow : C.yellowDeep);
      y += para(ctx, s, x + 30, y, cw3 - 46, { size: 9.6, lh: 11.8, color: th.inkSoft, maxLines: 2, page: 10 }) + 1;
    });
  });
  U.footer(ctx, th, 'Источники: данные заказчика — сводная таблица «Новосёлы» по магазинам, апрель — ноябрь 2026; Нижний Новгород — лидер по охвату и конверсии.', 10);
};

module.exports = slides;
