'use strict';
// Экспорт «сцены» каждого слайда (все фигуры и текст) в JSON для конвертации в PPTX
// node export-scene.js [classic|3d|all] → out/scene-<theme>.json
const fs = require('fs');
const path = require('path');
const L = require('./lib');

L.registerFonts();
const parts = [1, 2, 3, 4, 5].map((n) => path.join(__dirname, `slides-${n}.js`)).filter((f) => fs.existsSync(f));
const registry = {};
for (const f of parts) Object.assign(registry, require(f));
const nums = Object.keys(registry).map(Number).sort((a, b) => a - b);

const which = process.argv[2] || 'all';
const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

for (const themeKey of which === 'all' ? ['classic', '3d'] : [which]) {
  const th = L.THEMES[themeKey];
  const slides = [];
  for (const n of nums) {
    const ops = [];
    L.setEmitter((op) => ops.push(op));
    L.setClip(null);
    const c = L.createCanvas(L.W, L.H);
    try {
      registry[n](c.getContext('2d'), th);
    } catch (e) {
      console.error(`!! слайд ${n}: ${e.message}`);
    }
    L.setEmitter(null);
    slides.push({ num: n, ops });
  }
  const file = path.join(outDir, `scene-${themeKey}.json`);
  fs.writeFileSync(file, JSON.stringify({ theme: themeKey, width: L.W, height: L.H, slides }));
  console.log(`${themeKey}: ${slides.length} слайдов, операций ${slides.reduce((a, s) => a + s.ops.length, 0)} → ${file}`);
}
