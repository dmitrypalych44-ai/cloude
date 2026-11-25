import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { VLADIVOSTOK_TILES } from '../data/siteData';

const FIXTURE_OPTIONS = [
  { id: 'black', label: 'Чёрный матовый', hex: '#181818' },
  { id: 'chrome', label: 'Хром глянец', hex: '#D4D8DD' },
  { id: 'brass', label: 'Тёплая латунь', hex: '#C8A45D' },
] as const;

const VANITY_OPTIONS = [
  { id: 'oak', label: 'Натуральный дуб', bg: '#B98C5E', text: '#FFFFFF' },
  { id: 'beige', label: 'Кашемир Soft-touch', bg: '#DFD6C7', text: '#141414' },
  { id: 'graphite', label: 'Антрацит матовый', bg: '#2B2C30', text: '#FFFFFF' },
] as const;

export const InteractiveConfigurator: React.FC = () => {
  const wallTiles = VLADIVOSTOK_TILES.filter((t) =>
    ['marbella-white', 'duna-cemento-perla', 'pulpis-nero-carving', 'keramin-fels-beige', 'kreaforta-mersey-blue', 'kreaforta-mersey-mint'].includes(t.id)
  );
  const floorTiles = VLADIVOSTOK_TILES.filter((t) =>
    ['kreaforta-oakland', 'keramin-fels-beige', 'marbella-white', 'grasaro-loft'].includes(t.id)
  );

  const [selectedWall, setSelectedWall] = useState(wallTiles[0]);
  const [selectedFloor, setSelectedFloor] = useState(floorTiles[0]);
  const [fixture, setFixture] = useState<(typeof FIXTURE_OPTIONS)[number]>(FIXTURE_OPTIONS[0]);
  const [vanity, setVanity] = useState<(typeof VANITY_OPTIONS)[number]>(VANITY_OPTIONS[0]);
  const [roomArea, setRoomArea] = useState<number>(5.8);

  // Realistic demo calculation
  const wallSqm = +(roomArea * 3.4).toFixed(1);
  const floorSqm = +(roomArea * 1.1).toFixed(1);
  const wallBoxes = Math.ceil(wallSqm / selectedWall.boxArea);
  const floorBoxes = Math.ceil(floorSqm / selectedFloor.boxArea);
  const tilesCost = Math.round(wallBoxes * selectedWall.pricePerBox + floorBoxes * selectedFloor.pricePerBox);
  const plumbingAndFurnitureBase = 68500;
  const fullProjectEstimate = tilesCost + plumbingAndFurnitureBase;
  const novoselyDiscount = fullProjectEstimate >= 70000 ? Math.round(fullProjectEstimate * 0.1) : 0;

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-black/10 shadow-editorial">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-8 border-b border-black/10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00] text-[#141414] text-xs font-extrabold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Интерактивный демо-стенд подбора сочетаний
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414]">
            Соберите ваш мудборд ванной{' '}
            <span className="font-serif italic font-semibold text-[#5C554B]">онлайн за 30 секунд</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5C554B]">
            Попробуйте сочетать настенную и напольную плитку с сайта <strong>vladivostok.lemanapro.ru</strong> с
            оттенком мебели и смесителей — система мгновенно пересчитает смету и скидку Новосёла.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F7F5F0] px-4 py-2.5 rounded-2xl border border-black/8">
          <span className="text-xs font-bold text-[#5C554B]">Площадь ванной:</span>
          {[3.8, 5.8, 7.5].map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => setRoomArea(sq)}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-colors ${
                roomArea === sq ? 'bg-[#141414] text-[#FFCC00]' : 'bg-white text-[#141414]'
              }`}
            >
              {sq} м²
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch">
        {/* Left Visual Moodboard */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-[26px] overflow-hidden border border-black/15 bg-[#141414] shadow-lg">
          {/* Architectural Moodboard Collage */}
          <div className="relative h-80 sm:h-96 flex flex-col">
            {/* Wall Tile Zone (70% height) */}
            <div className="relative flex-1 overflow-hidden">
              <img
                src={selectedWall.image}
                alt={selectedWall.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30" />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 text-[#141414] text-xs font-extrabold shadow">
                Стены: {selectedWall.collection} ({selectedWall.size})
              </div>

              {/* Simulated Backlit Round Mirror + Vanity + Faucet */}
              <div className="absolute bottom-4 right-5 left-5 sm:left-auto sm:w-64 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-black/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6E685F]">
                    Акценты проекта
                  </span>
                  <span
                    className="w-5 h-5 rounded-full border border-black/20 shadow-inner"
                    style={{ backgroundColor: fixture.hex }}
                    title={fixture.label}
                  />
                </div>
                <div
                  className="rounded-xl px-3 py-2.5 text-xs font-extrabold flex items-center justify-between transition-colors"
                  style={{ backgroundColor: vanity.bg, color: vanity.text }}
                >
                  <span>Тумба: {vanity.label}</span>
                  <span className="opacity-80">100 см</span>
                </div>
                <div className="text-[11px] font-bold text-[#141414] flex items-center justify-between">
                  <span>Сантехника и профиль:</span>
                  <span>{fixture.label}</span>
                </div>
              </div>
            </div>

            {/* Floor Tile Zone (30% height) */}
            <div className="relative h-28 border-t-4 border-[#141414] overflow-hidden">
              <img
                src={selectedFloor.image}
                alt={selectedFloor.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-3 left-3.5 px-3 py-1 rounded-full bg-[#141414]/90 text-white text-xs font-extrabold">
                Пол / Душевая: {selectedFloor.collection} ({selectedFloor.size})
              </div>
            </div>
          </div>

          {/* Live Estimate Strip */}
          <div className="p-5 sm:p-6 bg-[#141414] text-white space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs text-white/75 pb-3 border-b border-white/10">
              <div>
                <div>Настенная плитка ({wallBoxes} кор.):</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  Арт. {selectedWall.sku} · {Math.round(wallBoxes * selectedWall.pricePerBox).toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div>
                <div>Керамогранит пол ({floorBoxes} кор.):</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  Арт. {selectedFloor.sku} · {Math.round(floorBoxes * selectedFloor.pricePerBox).toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/60 font-bold">
                  Проект под ключ с сантехникой (Новосёлам −10%)
                </div>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-2xl font-black text-[#FFCC00]">
                    {(fullProjectEstimate - novoselyDiscount).toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-xs line-through text-white/45">
                    {fullProjectEstimate.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D9232E] text-white text-[11px] font-extrabold">
                    Выгода −{novoselyDiscount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
              <Link
                to={`/anketa?tile=${encodeURIComponent(
                  `Стены: ${selectedWall.name} (${selectedWall.sku}), Пол: ${selectedFloor.name} (${selectedFloor.sku}), Мебель: ${vanity.label}, Смесители: ${fixture.label}`
                )}`}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] font-extrabold text-xs uppercase tracking-wider shrink-0 transition-colors"
              >
                Передать в анкету <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Wall Tile Picker */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-2.5">
              1. Выберите фоновую / акцентную плитку стен
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {wallTiles.map((t) => {
                const active = selectedWall.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedWall(t)}
                    className={`p-2 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      active
                        ? 'bg-[#FFF8D6] border-[#141414] ring-1 ring-[#141414]'
                        : 'bg-[#F7F5F0] border-transparent hover:border-black/20'
                    }`}
                  >
                    <img
                      src={t.image}
                      alt={t.collection}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-black/10"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#141414] truncate">{t.collection}</div>
                      <div className="text-[11px] text-[#6E685F]">{t.pricePerSqm} ₽/м²</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Floor Tile Picker */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-2.5">
              2. Выберите керамогранит для пола и душевой зоны
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {floorTiles.map((t) => {
                const active = selectedFloor.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedFloor(t)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      active
                        ? 'bg-[#FFF8D6] border-[#141414] ring-1 ring-[#141414]'
                        : 'bg-[#F7F5F0] border-transparent hover:border-black/20'
                    }`}
                  >
                    <img
                      src={t.image}
                      alt={t.collection}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-black/10"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#141414] truncate">{t.collection}</div>
                      <div className="text-[11px] text-[#6E685F] truncate">{t.color}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Vanity Finish */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-2.5">
              3. Фасад подвесной тумбы
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {VANITY_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVanity(v)}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    vanity.id === v.id
                      ? 'bg-[#FFF8D6] border-[#141414] text-[#141414]'
                      : 'bg-[#F7F5F0] border-transparent text-[#4A4640]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-black/20"
                    style={{ backgroundColor: v.bg }}
                  />
                  <span className="truncate">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Fixtures Color */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-2.5">
              4. Цвет смесителей, душевого профиля и клавиши смыва
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {FIXTURE_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFixture(f)}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    fixture.id === f.id
                      ? 'bg-[#FFF8D6] border-[#141414] text-[#141414]'
                      : 'bg-[#F7F5F0] border-transparent text-[#4A4640]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-black/20"
                    style={{ backgroundColor: f.hex }}
                  />
                  <span className="truncate">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-black/5 flex items-start gap-2.5 text-xs text-[#4A4640]">
            <CheckCircle2 className="w-4 h-4 text-[#141414] fill-[#FFCC00] shrink-0 mt-0.5" />
            <span>
              На очной встрече в проектном отделе Лемана ПРО Владивосток (ул. Махалина, 43) мы приложим
              живые образцы этих плит друг к другу при тёплом и нейтральном освещении.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
