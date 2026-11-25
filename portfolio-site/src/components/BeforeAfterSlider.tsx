import React, { useState, useRef } from 'react';
import { MoveHorizontal, Sparkles } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(52);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          if (e.buttons === 1) updateFromClientX(e.clientX);
        }}
        onClick={(e) => updateFromClientX(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) updateFromClientX(e.touches[0].clientX);
        }}
        className="relative w-full h-[320px] sm:h-[440px] lg:h-[500px] rounded-[28px] overflow-hidden select-none cursor-ew-resize border border-black/15 shadow-editorial bg-[#141414]"
      >
        {/* AFTER (full width base) */}
        <img
          src="/images/after-finished-bathroom.jpg"
          alt="После: реализованный дизайн-проект ванной комнаты с керамогранитом и душевой"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* BEFORE (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src="/images/before-rough-bathroom.jpg"
            alt="До: черновая отделка санузла в новостройке с разводкой труб и инсталляцией"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#141414]/85 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider pointer-events-none">
          До · Черновая новостройка
        </div>
        <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#FFCC00] text-[#141414] text-xs font-extrabold uppercase tracking-wider shadow pointer-events-none inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> После · Готовый проект ВК
        </div>

        {/* Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#FFCC00] shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFCC00] border-2 border-[#141414] text-[#141414] flex items-center justify-center shadow-xl">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Accessible Range Control */}
      <div className="flex items-center justify-between gap-4 px-2">
        <span className="text-xs font-bold text-[#6E685F]">Потяните ползунок сравнения «До / После»:</span>
        <div className="flex items-center gap-2">
          {[
            { label: 'Черновая', pos: 88 },
            { label: '50 / 50', pos: 50 },
            { label: 'Готовый интерьер', pos: 12 },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => setSliderPos(btn.pos)}
              className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-black/15 hover:bg-[#FFCC00] transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
