import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ExternalLink, ArrowUpRight } from 'lucide-react';
import { LemanaHouseBadge } from './LemanaLogo';
import { SPECIALIST_INFO } from '../data/siteData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-white pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <LemanaHouseBadge className="w-10 h-10 shrink-0" />
              <div>
                <div className="font-extrabold text-lg tracking-tight">НИКОЛАЕВА АЛЕКСАНДРА</div>
                <div className="text-xs text-[#FFCC00] font-semibold">
                  Специалист по продаже проектов ВК
                </div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Авторский подход к проектированию ванных комнат: эстетика современных текстур, точная
              раскладка керамогранита и полная комплектация со склада во Владивостоке без переплат.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFCC00] mb-4">
              Разделы портфолио
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a href="/#projects" className="hover:text-[#FFCC00] transition-colors">
                  Готовые решения ванных комнат
                </a>
              </li>
              <li>
                <a href="/#tiles" className="hover:text-[#FFCC00] transition-colors">
                  Каталог плитки и керамогранита
                </a>
              </li>
              <li>
                <Link to="/anketa" className="hover:text-[#FFCC00] transition-colors">
                  Анкета клиента (оценка ремонта)
                </Link>
              </li>
              <li>
                <Link
                  to="/novosyoly"
                  className="text-[#FFCC00] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Акция «Новосёлы −10%» <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <a href="/#contacts" className="hover:text-[#FFCC00] transition-colors">
                  Запись на 3D-проектирование
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFCC00] mb-4">
              Лемана ПРО Владивосток
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a
                  href="https://vladivostok.lemanapro.ru/proekty/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFCC00] inline-flex items-center gap-1.5 transition-colors"
                >
                  Галерея готовых проектов <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://vladivostok.lemanapro.ru/catalogue/plitka/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFCC00] inline-flex items-center gap-1.5 transition-colors"
                >
                  Каталог плитки Владивосток <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://vladivostok.lemanapro.ru/promo/novosyoly/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFCC00] inline-flex items-center gap-1.5 transition-colors"
                >
                  Официальная страница Новосёлы <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="/docs/anketa-klienta.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFCC00] inline-flex items-center gap-1.5 transition-colors"
                >
                  Скачать бланк Анкеты клиента (PDF)
                </a>
              </li>
              <li>
                <a
                  href="/docs/anketa-novosel.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFCC00] inline-flex items-center gap-1.5 transition-colors"
                >
                  Скачать бланк Анкеты Новосёл (PDF)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFCC00] mb-4">
              Контакты специалиста
            </h4>
            <div className="flex items-start gap-2.5 text-white/85">
              <MapPin className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
              <span>Приморский край, {SPECIALIST_INFO.city} (Проектный центр «Ванные комнаты»)</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/85">
              <Phone className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <a href={`tel:${SPECIALIST_INFO.directPhone.replace(/[^\d+]/g, '')}`} className="font-bold hover:text-[#FFCC00]">
                {SPECIALIST_INFO.directPhone}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-white/75">
              <Phone className="w-4 h-4 text-white/40 shrink-0" />
              <span>Единая линия: {SPECIALIST_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/85">
              <Mail className="w-4 h-4 text-[#FFCC00] shrink-0" />
              <a href={`mailto:${SPECIALIST_INFO.email}`} className="hover:text-[#FFCC00]">
                {SPECIALIST_INFO.email}
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-white/70 text-xs pt-1">
              <Clock className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
              <span>{SPECIALIST_INFO.hours}</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © 2026 Портфолио проектов ванных комнат · Специалист по продаже проектов Николаева Александра.
          </p>
          <p>
            Обработка анкет осуществляется в соответствии с политикой персональных данных ООО «ЛЕ МОНЛИД».
          </p>
        </div>
      </div>
    </footer>
  );
};
