import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Calculator,
  FileText,
  KeyRound,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Gift,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { NOVOSELY_CATEGORIES, SPECIALIST_INFO } from '../data/siteData';

export const NovosyolyPage: React.FC = () => {
  // Interactive calculator for Unlimited 10% Savings
  const [bathSpend, setBathSpend] = useState<number>(165000);
  const [kitchenSpend, setKitchenSpend] = useState<number>(210000);
  const [otherProjectsSpend, setOtherProjectsSpend] = useState<number>(115000);
  const [homeGardenSpend, setHomeGardenSpend] = useState<number>(45000);

  const bathEligible = bathSpend >= 70000;
  const kitchenEligible = kitchenSpend >= 150000;

  const totalEligibleSpend =
    (bathEligible ? bathSpend : 0) +
    (kitchenEligible ? kitchenSpend : 0) +
    otherProjectsSpend +
    homeGardenSpend;

  const unlimitedSavings = Math.round(totalEligibleSpend * 0.1);

  return (
    <div className="py-10 lg:py-16 space-y-16">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#5C554B] hover:text-[#141414]"
        >
          <ArrowLeft className="w-4 h-4" /> Назад в портфолио проектов
        </Link>
        <a
          href="https://vladivostok.lemanapro.ru/promo/novosyoly/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/15 text-xs font-extrabold hover:border-[#141414]"
        >
          Официальная страница акции Лемана ПРО Владивосток <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* HERO BANNER STYLED EXACTLY AFTER THE UPLOADED SLIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[34px] overflow-hidden border-2 border-[#141414] shadow-editorial bg-white">
          {/* White Top Header like the slide */}
          <div className="bg-white px-6 sm:px-12 pt-8 pb-6 border-b border-black/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] text-[#FFCC00] text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Программа лояльности Лемана ПРО Владивосток
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-[#141414] leading-[1.03]">
              ПРИВИЛЕГИИ ДЛЯ НОВОСЁЛОВ
            </h1>
            <p className="text-xl sm:text-3xl font-black uppercase tracking-tight mt-2">
              <span className="text-[#141414]">ОБНОВЛЕНИЕ </span>
              <span className="text-[#FFB300]">С 1 СЕНТЯБРЯ</span>
            </p>
          </div>

          {/* Yellow Main Slide Block */}
          <div className="bg-[#FFCC00] px-6 sm:px-12 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <ul className="space-y-3.5 text-base sm:text-xl font-extrabold text-[#141414]">
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                  <span>
                    Скидка <strong>−10% без лимита по сумме</strong> по всем проектам (больше нет
                    прежнего потолка в 85 000 ₽!)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                  <span>Новые подотделы в проектах для полной чистовой и инженерной комплектации</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                  <span>Двери — снижение порога входа в проект (теперь от 25 000 ₽)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                  <span>
                    Клиенты с <strong>Ключ-картой ПРО</strong> тоже могут быть Новосёлами
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                  <span>
                    <strong>+1 промокод «Дом и Сад»</strong> — скидка 10% на другие покупки
                  </span>
                </li>
              </ul>

              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/anketa?tab=novosel"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#D9232E] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity"
                >
                  Оформить статус Новосёла −10% <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#141414] text-white font-extrabold text-sm hover:bg-black/85 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-[#FFCC00]" /> Калькулятор безлимитной выгоды
                </button>
              </div>
            </div>

            {/* Original Uploaded Slide Visual */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#141414]/15 bg-white">
                <img
                  src="/images/novosely-slide.png"
                  alt="Привилегии для новосёлов с 1 сентября — скидка -10% Лемана ПРО"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT DIRECTIONS & THRESHOLDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#6E685F]">
            Направления программы · Единые условия по всей стране
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414]">
            На какие проекты действует скидка{' '}
            <span className="px-2.5 py-0.5 rounded-xl bg-[#D9232E] text-white">−10%</span> без
            ограничения суммы
          </h2>
          <p className="text-sm sm:text-base text-[#5C554B]">
            При оформлении проекта ванной комнаты с Николаевой Александрой вы получаете скидку 10% на
            всю смету направления — сколько бы ни стоила ваша сантехника и керамогранит.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {NOVOSELY_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 border flex flex-col justify-between space-y-4 ${
                cat.highlight
                  ? 'bg-[#141414] text-white border-[#141414] shadow-editorial'
                  : 'bg-white text-[#141414] border-black/10 shadow-card'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      cat.highlight
                        ? 'bg-[#FFCC00] text-[#141414]'
                        : 'bg-[#F7F5F0] text-[#141414]'
                    }`}
                  >
                    {cat.threshold > 0
                      ? `Порог от ${cat.threshold.toLocaleString('ru-RU')} ₽`
                      : 'Бонусный промокод'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#D9232E] text-white text-xs font-black">
                    −{cat.discountPercent}%
                  </span>
                </div>
                <h3 className="text-xl font-extrabold">{cat.title}</h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    cat.highlight ? 'text-white/75' : 'text-[#5C554B]'
                  }`}
                >
                  {cat.details}
                </p>
              </div>

              <div
                className={`pt-3 border-t text-xs font-bold flex items-center justify-between ${
                  cat.highlight ? 'border-white/15 text-[#FFCC00]' : 'border-black/8 text-[#141414]'
                }`}
              >
                <span>Лимит максимальной скидки:</span>
                <span className="uppercase font-extrabold">Без лимита ∞</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE UNLIMITED SAVINGS CALCULATOR */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-black/10 shadow-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#6E685F] mb-1">
                <Calculator className="w-4 h-4 text-[#141414]" /> Интерактивный расчёт экономии
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141414]">
                Посчитайте вашу выгоду Новосёла с обновлёнными условиями
              </h2>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span>Проект «Ванная комната» (порог от 70 000 ₽)</span>
                  <span className="font-extrabold">
                    {bathSpend.toLocaleString('ru-RU')} ₽{' '}
                    {!bathEligible && (
                      <span className="text-xs text-[#D9232E]">(ниже порога 70 000 ₽)</span>
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min={40000}
                  max={600000}
                  step={5000}
                  value={bathSpend}
                  onChange={(e) => setBathSpend(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span>Проект «Кухня» (порог от 150 000 ₽)</span>
                  <span className="font-extrabold">{kitchenSpend.toLocaleString('ru-RU')} ₽</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={800000}
                  step={10000}
                  value={kitchenSpend}
                  onChange={(e) => setKitchenSpend(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span>Двери (от 25 000 ₽), Полы, Хранение и Отделка стен</span>
                  <span className="font-extrabold">
                    {otherProjectsSpend.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={600000}
                  step={5000}
                  value={otherProjectsSpend}
                  onChange={(e) => setOtherProjectsSpend(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span>Покупки по +1 промокоду «Дом и Сад» (−10%)</span>
                  <span className="font-extrabold">{homeGardenSpend.toLocaleString('ru-RU')} ₽</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={5000}
                  value={homeGardenSpend}
                  onChange={(e) => setHomeGardenSpend(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FFCC00] rounded-3xl p-7 sm:p-8 space-y-5 border-2 border-[#141414]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#141414]">
                Ваша суммарная выгода −10%
              </span>
              <Gift className="w-6 h-6 text-[#141414]" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-[#141414] tracking-tight">
              −{unlimitedSavings.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#141414]/85 leading-relaxed">
              Сумма покупок с учётом скидки:{' '}
              <strong>{(totalEligibleSpend - unlimitedSavings).toLocaleString('ru-RU')} ₽</strong>{' '}
              вместо {totalEligibleSpend.toLocaleString('ru-RU')} ₽. Скидка начисляется без верхнего
              порога ограничения!
            </p>
            <div className="pt-2 space-y-2.5">
              <Link
                to="/anketa?tab=novosel"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#141414] text-white font-extrabold text-sm hover:bg-black/85 transition-colors"
              >
                Зафиксировать участие в анкете <ArrowRight className="w-4 h-4 text-[#FFCC00]" />
              </Link>
              <a
                href="https://vladivostok.lemanapro.ru/promo/novosyoly/"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-white/80 hover:bg-white text-[#141414] font-bold text-xs transition-colors"
              >
                Правила акции на vladivostok.lemanapro.ru <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY & DOCUMENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-black/10 shadow-card space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FFCC00] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#141414]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#141414]">Кто может стать Новосёлом?</h3>
            <p className="text-sm text-[#5C554B] leading-relaxed">
              Покупатели, оформившие право на жильё в течение последних <strong>36 месяцев (3 лет)</strong>:
            </p>
            <ul className="space-y-2 text-sm text-[#242424] font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 fill-[#FFCC00]" /> Квартиры в новостройках (ДДУ / Акт)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 fill-[#FFCC00]" /> Вторичное жильё и комнаты
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 fill-[#FFCC00]" /> Частные дома (ИЖС) и таунхаусы
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 fill-[#FFCC00]" /> Жильё по программе реновации
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-black/10 shadow-card space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FFCC00] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#141414]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#141414]">Какие документы понадобятся?</h3>
            <p className="text-sm text-[#5C554B] leading-relaxed">
              Для быстрой регистрации в торговом центре Лемана ПРО Владивосток ({SPECIALIST_INFO.city}) возьмите:
            </p>
            <ul className="space-y-2 text-sm text-[#242424] font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 fill-[#FFCC00]" />
                <span>Паспорт гражданина РФ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 fill-[#FFCC00]" />
                <span>Выписку из ЕГРН (не старше 36 мес.), ДДУ или договор купли-продажи / акт приёма-передачи</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 fill-[#FFCC00]" />
                <span>Действующую Ключ-карту для дома или Ключ-карту ПРО (можно выпустить на месте за 1 минуту)</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#141414] text-white rounded-3xl p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFCC00] flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-[#141414]" />
              </div>
              <h3 className="text-xl font-extrabold">Ключ-карта ПРО теперь тоже в акции!</h3>
              <p className="text-sm text-white/75 leading-relaxed">
                С 1 сентября участники профессиональной программы <strong>Ключ-карта ПРО</strong> также
                могут зарегистрировать статус Новосёла для обустройства собственной недвижимости и
                получить −10% без лимита по сумме.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#FFCC00] font-bold">
                <ShieldCheck className="w-4 h-4" /> Помогу оформить статус прямо во время расчёта ванной!
              </div>
              <Link
                to="/anketa?tab=novosel"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#FFCC00] text-[#141414] font-extrabold text-xs uppercase tracking-wider"
              >
                Заполнить анкету Новосёла онлайн
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
