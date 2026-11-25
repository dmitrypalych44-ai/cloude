import React, { useState } from 'react';
import { Calculator, X, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TileItem } from '../data/siteData';

interface TileCalculatorModalProps {
  tile: TileItem | null;
  onClose: () => void;
}

export const TileCalculatorModal: React.FC<TileCalculatorModalProps> = ({ tile, onClose }) => {
  const [area, setArea] = useState<string>('18');
  const [reservePercent, setReservePercent] = useState<number>(10);
  const [isNovosel, setIsNovosel] = useState<boolean>(true);

  if (!tile) return null;

  const numericArea = Math.max(1, parseFloat(area) || 0);
  const areaWithReserve = numericArea * (1 + reservePercent / 100);
  const boxesNeeded = Math.ceil(areaWithReserve / tile.boxArea);
  const totalCoveredArea = +(boxesNeeded * tile.boxArea).toFixed(2);
  const baseTotal = Math.round(boxesNeeded * tile.pricePerBox);
  const finalTotal = isNovosel ? Math.round(baseTotal * 0.9) : baseTotal;
  const discountSaved = baseTotal - finalTotal;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#141414] text-white p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FFCC00] text-[#141414] flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#FFCC00] font-bold uppercase tracking-wider">
                Калькулятор раскладки и запаса
              </div>
              <h3 className="text-lg font-extrabold leading-snug">{tile.name}</h3>
              <p className="text-xs text-white/65">
                Арт. {tile.sku} · Формат {tile.size} · Упаковка {tile.boxArea} м²
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Area input */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#6E685F] mb-2">
              Чистая площадь облицовки стен / пола (м²)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={300}
                step={0.5}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/15 font-extrabold text-lg focus:outline-none focus:border-[#141414]"
              />
              <div className="flex gap-1.5 shrink-0">
                {['12', '18', '24', '32'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setArea(preset)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      area === preset
                        ? 'bg-[#141414] text-white border-[#141414]'
                        : 'bg-[#F7F5F0] text-[#141414] border-transparent hover:border-black/20'
                    }`}
                  >
                    {preset} м²
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reserve selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#6E685F] mb-2">
              Технологический запас на подрезку
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 7, label: '+7% Крупный формат' },
                { val: 10, label: '+10% Прямая укладка' },
                { val: 15, label: '+15% Сложные углы / ниши' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setReservePercent(opt.val)}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                    reservePercent === opt.val
                      ? 'bg-[#FFCC00] border-[#141414] text-[#141414]'
                      : 'bg-[#F7F5F0] border-transparent text-[#242424] hover:border-black/15'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Novosely toggle */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8D6] border border-[#FFCC00] cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#141414]" />
              <div>
                <div className="text-sm font-extrabold text-[#141414]">
                  Применить скидку «Новосёлы −10%»
                </div>
                <div className="text-xs text-[#6E685F]">
                  При заказе проекта ванной комнаты от 70 000 ₽
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isNovosel}
              onChange={(e) => setIsNovosel(e.target.checked)}
              className="w-5 h-5 accent-[#141414] rounded"
            />
          </label>

          {/* Calculation Result */}
          <div className="bg-[#F7F5F0] rounded-2xl p-5 space-y-2 border border-black/5">
            <div className="flex justify-between text-sm">
              <span className="text-[#6E685F]">Необходимо упаковок (кратно коробке):</span>
              <span className="font-extrabold text-[#141414]">
                {boxesNeeded} кор. ({totalCoveredArea} м²)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6E685F]">Цена в Лемана ПРО Владивосток:</span>
              <span className="font-semibold text-[#141414]">
                {tile.pricePerBox.toLocaleString('ru-RU')} ₽ / кор.
              </span>
            </div>
            {isNovosel && (
              <div className="flex justify-between text-sm text-[#D9232E] font-bold">
                <span>Экономия в составе проекта Новосёла:</span>
                <span>−{discountSaved.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            <div className="pt-3 border-t border-black/10 flex items-baseline justify-between">
              <span className="text-sm font-extrabold uppercase tracking-wider">Итого за плитку:</span>
              <span className="text-2xl font-extrabold text-[#141414]">
                {finalTotal.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/anketa?tile=${encodeURIComponent(`${tile.name} (Арт. ${tile.sku}) — ${boxesNeeded} кор.`)}`}
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#141414] text-white font-bold text-sm hover:bg-black/85 transition-colors"
            >
              Включить в мой 3D-проект <ArrowRight className="w-4 h-4 text-[#FFCC00]" />
            </Link>
            <a
              href={tile.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-full border border-black/15 text-xs font-bold hover:bg-[#F7F5F0] transition-colors"
            >
              На сайте <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
