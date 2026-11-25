import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Menu, X, Sparkles, FileCheck2, ArrowUpRight, Download } from 'lucide-react';
import { LemanaHouseBadge } from './LemanaLogo';
import { SPECIALIST_INFO } from '../data/siteData';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const goSection = (sectionId: string) => {
    setMobileOpen(false);
    navigate(`/?section=${sectionId}`);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: 'projects', label: 'Готовые решения', isAnchor: true },
    { to: 'tiles', label: 'Плитка Владивосток', isAnchor: true },
    { to: '/anketa', label: 'Анкета клиента' },
    { to: '/novosyoly', label: 'Новосёлы −10%', highlight: true },
    { to: 'contacts', label: 'Контакты', isAnchor: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#F7F5F0]/95 backdrop-blur-md">
      {/* Top Promo Strip */}
      <div className="bg-[#141414] text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#D9232E] text-white font-extrabold text-[11px] tracking-wide">
              −10%
            </span>
            <span>
              Привилегии для новосёлов (обновление с 1 сентября): скидка{' '}
              <strong className="text-[#FFCC00]">без лимита по сумме</strong> + промокод «Дом и Сад»
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-white/80 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FFCC00]" />
              {SPECIALIST_INFO.city}
            </span>
            <a
              href="/demo-nikolaeva-alexandra.html"
              download="demo-nikolaeva-alexandra.html"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 hover:bg-[#FFCC00] hover:text-[#141414] text-white font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Скачать демо HTML
            </a>
            <Link
              to="/novosyoly"
              className="text-[#FFCC00] hover:underline font-semibold inline-flex items-center gap-1"
            >
              Условия акции <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <LemanaHouseBadge className="w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-[#141414]">
                НИКОЛАЕВА АЛЕКСАНДРА
              </span>
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFCC00] text-[#141414]">
                ПРОЕКТЫ ВК
              </span>
            </div>
            <p className="text-xs text-[#6E685F] font-medium">
              Дизайн и комплектация ванных комнат · Лемана ПРО Владивосток
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((item) =>
            item.isAnchor ? (
              <button
                key={item.label}
                type="button"
                onClick={() => goSection(item.to)}
                className="px-3.5 py-2 rounded-full text-sm font-semibold text-[#242424] hover:bg-black/5 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  item.highlight
                    ? `px-3.5 py-1.5 rounded-full text-sm font-extrabold inline-flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-[#141414] text-[#FFCC00]'
                          : 'bg-[#FFCC00] text-[#141414] hover:bg-[#F2BE00]'
                      }`
                    : `px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                        isActive ? 'bg-[#141414] text-white' : 'text-[#242424] hover:bg-black/5'
                      }`
                }
              >
                {item.highlight && <Sparkles className="w-3.5 h-3.5" />}
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* CTA & Phone */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${SPECIALIST_INFO.directPhone.replace(/[^\d+]/g, '')}`}
            className="text-right group"
          >
            <div className="text-sm font-extrabold text-[#141414] group-hover:text-black/70 flex items-center gap-1.5 justify-end">
              <Phone className="w-3.5 h-3.5 text-[#141414]" />
              {SPECIALIST_INFO.directPhone}
            </div>
            <div className="text-[11px] text-[#6E685F]">Запись в проектный отдел</div>
          </a>
          <Link
            to="/anketa"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2c2c2c] transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-[#FFCC00]" />
            Заполнить анкету
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden p-2.5 rounded-xl border border-black/15 bg-white text-[#141414]"
          aria-label="Открыть меню"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-black/10 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((item) =>
            item.isAnchor ? (
              <button
                key={item.label}
                type="button"
                onClick={() => goSection(item.to)}
                className="w-full text-left block px-4 py-3 rounded-xl text-base font-bold text-[#141414] hover:bg-[#F7F5F0]"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold ${
                  item.highlight
                    ? 'bg-[#FFCC00] text-[#141414]'
                    : 'text-[#141414] hover:bg-[#F7F5F0]'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <div className="pt-3 border-t border-black/10 flex flex-col gap-2.5">
            <a
              href={`tel:${SPECIALIST_INFO.directPhone.replace(/[^\d+]/g, '')}`}
              className="px-4 py-3 rounded-xl bg-[#F7F5F0] font-bold text-sm flex items-center justify-between"
            >
              <span>Прямой телефон специалиста</span>
              <span>{SPECIALIST_INFO.directPhone}</span>
            </a>
            <Link
              to="/anketa"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3.5 rounded-xl bg-[#141414] text-white text-center font-bold text-sm"
            >
              Заполнить анкету клиента онлайн
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
