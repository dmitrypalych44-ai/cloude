import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronUp, ChevronDown, Sparkles, Compass, Layers, FileCheck2, Gift, Download } from 'lucide-react';

export const DemoTourDock: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const navigate = useNavigate();

  const jumpTo = (path: string, hashId?: string) => {
    navigate(path);
    setExpanded(false);
    if (hashId) {
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-xs sm:max-w-sm">
      {expanded && (
        <div className="mb-2.5 bg-[#141414] text-white rounded-3xl p-5 shadow-2xl border border-white/15 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFCC00] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Гид по демо-версии сайта
            </span>
            <span className="text-[11px] text-white/50">5 интерактивных зон</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => jumpTo('/', 'before-after')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <Compass className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>1. Шторка сравнения «До / После ремонта»</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/', 'configurator')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <Layers className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>2. Онлайн-конструктор плитки и тумбы</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/', 'projects')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <Play className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>3. Готовые решения со сметой товаров</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/anketa?demo=1')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>4. Анкета клиента с демо-заполнением в 1 клик</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/novosyoly')}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-[#FFCC00]/15 hover:bg-[#FFCC00]/25 text-[#FFCC00] flex items-center gap-2.5 font-extrabold transition-colors"
            >
              <Gift className="w-4 h-4 shrink-0" />
              <span>5. Промо «Новосёлы −10%» + калькулятор</span>
            </button>

            <div className="pt-2 border-t border-white/10">
              <a
                href="/demo-nikolaeva-alexandra.html"
                download="demo-nikolaeva-alexandra.html"
                className="w-full justify-center px-3 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] flex items-center gap-2 font-extrabold transition-colors"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Скачать автономный HTML-файл</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="ml-auto flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#141414] hover:bg-[#262626] text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl border-2 border-[#FFCC00] transition-all"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] animate-pulse" />
        <span>Демо-режим</span>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-[#FFCC00]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-[#FFCC00]" />
        )}
      </button>
    </div>
  );
};
