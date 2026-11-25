import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Square,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Compass,
  Layers,
  FileCheck2,
  Gift,
  Download,
} from 'lucide-react';

const isStandalone =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'file:' ||
    (window as unknown as { __STANDALONE_DEMO__?: boolean }).__STANDALONE_DEMO__ === true);

export const DemoTourDock: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(isStandalone);
  const [autoRunning, setAutoRunning] = useState<boolean>(false);
  const [stepLabel, setStepLabel] = useState<string>('');
  const timersRef = useRef<number[]>([]);
  const navigate = useNavigate();

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const jumpTo = (path: string, sectionId?: string) => {
    clearTimers();
    setAutoRunning(false);
    setStepLabel('');
    navigate(sectionId ? `${path}?section=${sectionId}` : path);
    setExpanded(false);
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  const startAutoPresentation = () => {
    clearTimers();
    setAutoRunning(true);
    setExpanded(false);

    const schedule = [
      {
        delay: 0,
        label: 'Шаг 1/5 · Главный экран и позиционирование специалиста',
        action: () => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      {
        delay: 4200,
        label: 'Шаг 2/5 · Трансформация «До / После ремонта»',
        action: () => {
          document.getElementById('before-after')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        delay: 8500,
        label: 'Шаг 3/5 · Онлайн-конструктор плитки и расчёт выгоды',
        action: () => {
          document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        delay: 13200,
        label: 'Шаг 4/5 · Готовые дизайн-решения и каталог плитки Владивостока',
        action: () => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        delay: 17800,
        label: 'Шаг 5/5 · Заполненная демо-Анкета клиента и акция Новосёлы −10%',
        action: () => {
          navigate('/anketa?demo=1');
        },
      },
      {
        delay: 23000,
        label: 'Финал · Страница «Привилегии для новосёлов — без лимита по сумме»',
        action: () => {
          navigate('/novosyoly');
        },
      },
      {
        delay: 28000,
        label: '',
        action: () => {
          setAutoRunning(false);
          setStepLabel('');
        },
      },
    ];

    schedule.forEach((item) => {
      const id = window.setTimeout(() => {
        if (item.label) setStepLabel(item.label);
        item.action();
      }, item.delay);
      timersRef.current.push(id);
    });
  };

  const stopAutoPresentation = () => {
    clearTimers();
    setAutoRunning(false);
    setStepLabel('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-xs sm:max-w-sm">
      {autoRunning && stepLabel && (
        <div className="mb-2.5 bg-[#141414] text-white rounded-2xl px-4 py-3 shadow-2xl border-2 border-[#FFCC00] flex items-center justify-between gap-3">
          <div className="text-xs font-bold leading-snug">
            <div className="text-[#FFCC00] uppercase tracking-wider text-[10px] font-extrabold">
              Идёт авто-презентация
            </div>
            <div>{stepLabel}</div>
          </div>
          <button
            type="button"
            onClick={stopAutoPresentation}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#D9232E] text-white text-xs font-extrabold inline-flex items-center gap-1"
          >
            <Square className="w-3 h-3 fill-current" /> Стоп
          </button>
        </div>
      )}

      {expanded && !autoRunning && (
        <div className="mb-2.5 bg-[#141414] text-white rounded-3xl p-5 shadow-2xl border border-white/15 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFCC00] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Гид по демо-версии сайта
            </span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[11px] text-white/60 hover:text-white"
            >
              Свернуть
            </button>
          </div>

          <button
            type="button"
            onClick={startAutoPresentation}
            className="w-full justify-center px-3.5 py-3 rounded-xl bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] flex items-center gap-2 font-black text-xs uppercase tracking-wider transition-colors shadow"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>Запустить авто-обзор сайта (28 сек)</span>
          </button>

          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => jumpTo('/', 'before-after')}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <Compass className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>1. Шторка сравнения «До / После ремонта»</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/', 'configurator')}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <Layers className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>2. Онлайн-конструктор плитки и тумбы</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/', 'projects')}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <Play className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>3. Готовые решения со сметой товаров</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/anketa?demo=1')}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 font-semibold transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <span>4. Анкета клиента с демо-заполнением в 1 клик</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo('/novosyoly')}
              className="w-full text-left px-3 py-2 rounded-xl bg-[#FFCC00]/15 hover:bg-[#FFCC00]/25 text-[#FFCC00] flex items-center gap-2.5 font-extrabold transition-colors"
            >
              <Gift className="w-4 h-4 shrink-0" />
              <span>5. Промо «Новосёлы −10%» + калькулятор</span>
            </button>

            {!isStandalone && (
              <div className="pt-2 border-t border-white/10">
                <a
                  href="/demo-nikolaeva-alexandra.html"
                  download="demo-nikolaeva-alexandra.html"
                  className="w-full justify-center px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#FFCC00] shrink-0" />
                  <span>Скачать автономный HTML-файл</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="ml-auto flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#141414] hover:bg-[#262626] text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl border-2 border-[#FFCC00] transition-all"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] animate-pulse" />
        <span>{autoRunning ? 'Презентация...' : 'Демо-режим'}</span>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-[#FFCC00]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-[#FFCC00]" />
        )}
      </button>
    </div>
  );
};
