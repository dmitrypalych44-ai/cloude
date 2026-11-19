'use strict';
// Сборка PDF: node build.js → out/classic.pdf, out/3d.pdf (и PNG-превью)
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const { THEMES, PDFDocument, createCanvas } = L;

L.registerFonts();

const parts = [1, 2, 3, 4, 5].map((n) => path.join(__dirname, `slides-${n}.js`)).filter((f) => fs.existsSync(f));
const registry = {};
for (const f of parts) Object.assign(registry, require(f));
const slideNums = Object.keys(registry).map(Number).sort((a, b) => a - b);

function render(themeKey, opts = {}) {
  const th = THEMES[themeKey];
  const doc = new PDFDocument({
    title: 'Стратегия Владивосток 2027 — Лемана ПРО',
    author: 'Лемана ПРО',
    subject: 'Трансформация магазина 75: шесть миров и вайтбокс, четыре рычага роста и один путь клиента',
    creator: `presentation build (${themeKey})`,
  });
  const pngDir = opts.pngDir;
  if (pngDir) fs.mkdirSync(pngDir, { recursive: true });
  for (const n of slideNums) {
    const ctx = doc.beginPage(L.W, L.H);
    L.resetBottom();
    try {
      registry[n](ctx, th);
    } catch (e) {
      console.error(`  !! слайд ${n}: ${e.stack}`);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, L.W, L.H);
      L.text(ctx, `Ошибка на слайде ${n}`, 60, 80, { size: 20, weight: 700, color: '#b00' });
    }
    doc.endPage();
    if (pngDir) {
      const c = createCanvas(L.W, L.H);
      L.resetBottom();
      registry[n](c.getContext('2d'), th);
      fs.writeFileSync(path.join(pngDir, `s${String(n).padStart(2, '0')}.png`), c.toBuffer('image/png'));
    }
  }
  return doc.close();
}

const which = process.argv[2] || 'all';
const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

const themes = which === 'all' ? ['classic', '3d'] : [which];
for (const t of themes) {
  const pngDir = process.argv.includes('--png') ? path.join(outDir, `png-${t}`) : null;
  const buf = render(t, { pngDir });
  const file = path.join(outDir, t === '3d' ? 'strategiya-2027-3d.pdf' : 'strategiya-2027-classic.pdf');
  fs.writeFileSync(file, buf);
  console.log(`${t}: ${slideNums.length} слайдов → ${file} (${(buf.length / 1024).toFixed(0)} КБ)`);
}
if (L.warnings.length) {
  console.log('\nПредупреждения вёрстки:');
  for (const w of L.warnings.slice(0, 40)) console.log('  - ' + w);
}
