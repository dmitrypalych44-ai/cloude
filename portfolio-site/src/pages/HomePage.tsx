import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Calculator,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  Ruler,
  Compass,
  ShieldCheck,
  FileCheck2,
  ExternalLink,
  MessageCircle,
  Send,
} from 'lucide-react';
import {
  BATHROOM_PROJECTS,
  VLADIVOSTOK_TILES,
  SPECIALIST_INFO,
  BathroomProject,
  TileItem,
} from '../data/siteData';
import { ProjectModal } from '../components/ProjectModal';
import { TileCalculatorModal } from '../components/TileCalculatorModal';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { InteractiveConfigurator } from '../components/InteractiveConfigurator';

const STYLE_FILTERS = ['Все проекты', 'Минимализм', 'Мрамор', 'Сканди', 'Лофт', 'Неоклассика', 'Компакт'] as const;
const TILE_FILTERS = ['Все коллекции', 'Мрамор и Оникс', 'Бетон и Камень', 'Дерево', 'Цвет и 3D-рельеф'] as const;

export const HomePage: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>('Все проекты');
  const [selectedTileGroup, setSelectedTileGroup] = useState<string>('Все коллекции');
  const [activeProject, setActiveProject] = useState<BathroomProject | null>(null);
  const [calcTile, setCalcTile] = useState<TileItem | null>(null);

  // Quick consultation callback form
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickSlot, setQuickSlot] = useState('В торговом зале (Махалина, 43)');
  const [quickSent, setQuickSent] = useState(false);

  const filteredProjects =
    selectedStyle === 'Все проекты'
      ? BATHROOM_PROJECTS
      : BATHROOM_PROJECTS.filter((p) => p.styleTag === selectedStyle);

  const filteredTiles =
    selectedTileGroup === 'Все коллекции'
      ? VLADIVOSTOK_TILES
      : VLADIVOSTOK_TILES.filter((t) => t.textureGroup === selectedTileGroup);

  const marqueeItems = [
    { title: 'Керамогранит 60×120', sub: 'Бесшовная эстетика', img: '/images/tile-marble-white.jpg' },
    { title: 'Архитектурный бетон', sub: 'DUNA Cemento Perla', img: '/images/tile-concrete-grey.jpg' },
    { title: 'Тёплый дуб в душевой', sub: 'KREAFORTA Oakland', img: '/images/tile-wood-oak.jpg' },
    { title: 'Графитовый Carving', sub: 'Pulpis Nero 60×120', img: '/images/tile-onyx-dark.jpg' },
    { title: 'Природный травертин', sub: 'Керамин Фелс', img: '/images/tile-beige-travertine.jpg' },
    { title: 'Объёмный 3D-рельеф', sub: 'Artens Вега Волна', img: '/images/tile-white-3d.jpg' },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) return;
    setQuickSent(true);
  };

  return (
    <div className="space-y-0">
      {/* HERO SECTION: Filosofia-Style Editorial + Lemana PRO Bold Energy */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Editorial Typography */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#141414]">
                  Проектный центр Лемана ПРО · Владивосток
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#141414] leading-[1.06]">
                Продуманный дизайн{' '}
                <span className="font-serif italic font-semibold text-[#5C554B] text-[1.08em]">
                  ванной комнаты
                </span>{' '}
                без переплаты за интерьер мечты
              </h1>

              <p className="text-base sm:text-lg text-[#4A4640] leading-relaxed max-w-xl">
                Портфолио готовых и индивидуальных решений специалиста по продаже проектов{' '}
                <strong className="text-[#141414]">Николаевой Александры</strong>. Подбираем
                актуальные фактуры керамогранита, создаём бесплатную 3D-раскладку и комплектуем
                проект со склада во Владивостоке.
              </p>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] font-extrabold text-sm sm:text-base shadow-sm transition-all"
                >
                  Смотреть готовые решения <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/anketa"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#141414] hover:bg-[#2A2A2A] text-white font-bold text-sm sm:text-base transition-all"
                >
                  <FileCheck2 className="w-4 h-4 text-[#FFCC00]" />
                  Заполнить анкету{' '}
                  <span className="font-serif italic font-normal text-[#FFCC00] text-lg leading-none">
                    со скидкой −10%
                  </span>
                </Link>
              </div>

              {/* Specialist Mini Card */}
              <div className="pt-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/10 shadow-card max-w-xl">
                  <img
                    src="/images/specialist-alexandra.jpg"
                    alt="Николаева Александра — специалист по продаже проектов Ванная комната"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top shrink-0 border-2 border-[#FFCC00]"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-base text-[#141414]">
                        Николаева Александра
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFF8D6] text-[#141414] border border-[#FFCC00]">
                        Эксперт направления ВК
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C554B] mt-0.5 leading-snug">
                      Лично сопровождаю ваш проект: от замера и раскладки плитки до оформления
                      привилегии «Новосёлы −10%» и доставки.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-[#141414] underline hover:text-black/70"
                      >
                        Записаться на встречу →
                      </button>
                      <Link
                        to="/novosyoly"
                        className="text-[#D9232E] hover:underline"
                      >
                        Акция Новосёлы без лимита →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Architectural Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[28px] overflow-hidden shadow-editorial border border-black/10 bg-[#141414]">
                <img
                  src="/images/hero-bathroom.jpg"
                  alt="Современный дизайн-проект ванной комнаты с крупноформатным керамогранитом"
                  className="w-full h-[420px] sm:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                {/* Floating Badge Top Left */}
                <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#141414] text-xs font-extrabold shadow-md flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#141414] fill-[#FFCC00]" />
                  Бесплатный 3D-проект + смета за 1 визит
                </div>

                {/* Floating Promo Pill Bottom */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-black/5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#6E685F]">
                        Керамогранит 60×120 + Сантехника под ключ
                      </div>
                      <div className="text-sm font-extrabold text-[#141414] mt-0.5">
                        Травертин & Белый мрамор Calacatta
                      </div>
                    </div>
                    <Link
                      to="/novosyoly"
                      className="shrink-0 px-3 py-2 rounded-xl bg-[#D9232E] text-white font-extrabold text-sm shadow-sm hover:opacity-95 transition-opacity"
                    >
                      −10%
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SPECIALIST_INFO.stats.map((st, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-black/8 shadow-card flex flex-col justify-between"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm text-[#5C554B] font-medium mt-1">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILOSOFIA-STYLE TEXTURE MARQUEE RIBBON */}
      <section className="py-6 border-y border-black/10 bg-white overflow-hidden">
        <div className="animate-marquee gap-4 px-4">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => document.getElementById('tiles')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-left flex items-center gap-3.5 pr-6 pl-2.5 py-2 rounded-2xl bg-[#F7F5F0] hover:bg-[#FFCC00]/30 border border-black/5 transition-colors shrink-0"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-14 h-14 rounded-xl object-cover border border-black/10"
              />
              <div>
                <div className="text-sm font-extrabold text-[#141414]">{item.title}</div>
                <div className="text-xs text-[#6E685F]">{item.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* EDITORIAL PHILOSOPHY & SPECIALIST APPROACH (inspired by filosofia-style.ru) */}
      <section className="py-16 lg:py-24 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-[28px] overflow-hidden border border-black/10 shadow-editorial">
                <img
                  src="/images/specialist-alexandra.jpg"
                  alt="Специалист по продаже проектов Николаева Александра с образцами керамогранита"
                  className="w-full h-[380px] sm:h-[440px] object-cover"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-[#F7F5F0] rounded-2xl p-3.5 text-center">
                  <div className="font-serif italic text-xl font-semibold text-[#141414]">Красивые</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6E685F]">Фактуры</div>
                </div>
                <div className="bg-[#F7F5F0] rounded-2xl p-3.5 text-center">
                  <div className="font-serif italic text-xl font-semibold text-[#141414]">Актуальные</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6E685F]">Оттенки</div>
                </div>
                <div className="bg-[#FFCC00] rounded-2xl p-3.5 text-center">
                  <div className="font-serif italic text-xl font-semibold text-[#141414]">Честная</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#141414]">Смета</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-extrabold uppercase tracking-widest text-[#6E685F]">
                Философия грамотного проектирования
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] leading-tight">
                Материалы, которые выбирают дизайнеры —{' '}
                <span className="font-serif italic font-semibold text-[#5C554B]">
                  по ценам гипермаркета во Владивостоке
                </span>
              </h2>
              <p className="text-[#4A4640] leading-relaxed">
                Ремонт ванной комнаты — технически самый сложный этап обустройства квартиры. Здесь на
                нескольких квадратных метрах сходятся водопровод, электрика, гидроизоляция, укладка
                крупноформатного керамогранита и эргономика хранения. Моя задача как проектного
                специалиста — объединить эстетику интерьерной студии с наличием и прозрачной ценой
                Лемана ПРО.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    icon: Ruler,
                    title: '1. Точная геометрия и замер',
                    desc: 'Учитываем короба инсталляций, ниши, ревизионные люки, открывание дверей и выводы коммуникаций.',
                  },
                  {
                    icon: Compass,
                    title: '2. 3D-визуализация и раскладка',
                    desc: 'Подбираем сочетания камня, дерева и бетона без лишней подрезки и с расчётом клея и эпоксидной затирки.',
                  },
                  {
                    icon: ShieldCheck,
                    title: '3. Комплектация из наличия',
                    desc: 'Все позиции с реальными артикулами склада Лемана ПРО Владивосток (ул. Махалина, 43) без ожидания в месяцы.',
                  },
                  {
                    icon: Sparkles,
                    title: '4. Привилегии Новосёлам −10%',
                    desc: 'Оформляем скидку 10% без лимита по сумме на весь проект ванной комнаты (от 70 000 ₽) и дарим промокод «Дом и Сад».',
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#F7F5F0] border border-black/5 space-y-2"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FFCC00] text-[#141414] flex items-center justify-center">
                      <step.icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#141414]">{step.title}</h3>
                    <p className="text-xs text-[#5C554B] leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BEFORE / AFTER DEMO SECTION */}
      <section id="before-after" className="py-16 lg:py-20 bg-[#F7F5F0] border-b border-black/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#6E685F]">
                <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                Наглядная демонстрация трансформации
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414]">
                От черновых стен новостройки —{' '}
                <span className="font-serif italic font-semibold text-[#5C554B]">
                  к готовому SPA-интерьеру
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#5C554B]">
                Двигайте шторку на фото: продумываем инсталляцию, душевой трап, электрику и раскладку
                крупноформатного керамогранита 60×120 ещё на этапе голого бетона.
              </p>
            </div>
            <Link
              to="/anketa?demo=1"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#141414] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-black/85"
            >
              Посмотреть пример заполненной анкеты <ArrowRight className="w-4 h-4 text-[#FFCC00]" />
            </Link>
          </div>

          <BeforeAfterSlider />
        </div>
      </section>

      {/* INTERACTIVE ONLINE CONFIGURATOR DEMO */}
      <section id="configurator" className="py-16 lg:py-20 bg-[#EFECE6] border-b border-black/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveConfigurator />
        </div>
      </section>

      {/* READY SOLUTIONS / PORTFOLIO SECTION */}
      <section id="projects" className="py-16 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#6E685F]">
                <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                Портфолио и готовые решения · vladivostok.lemanapro.ru
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
                Готовые дизайн-решения{' '}
                <span className="font-serif italic font-semibold text-[#5C554B]">
                  ванных комнат
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#5C554B]">
                Каждый проект мы бесплатно адаптируем под размеры вашей квартиры — будь то студия в
                новостройке Патрокла или просторный дом в пригороде Владивостока.
              </p>
            </div>

            {/* Style Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {STYLE_FILTERS.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    selectedStyle === style
                      ? 'bg-[#141414] text-[#FFCC00] shadow-sm'
                      : 'bg-white text-[#242424] border border-black/10 hover:border-black/30'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group bg-white rounded-[26px] overflow-hidden border border-black/8 shadow-card hover:shadow-editorial transition-all duration-300 flex flex-col"
              >
                <div
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => setActiveProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#141414] text-xs font-extrabold">
                      {project.styleTag}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#141414]/80 backdrop-blur-md text-white text-xs font-semibold">
                      {project.area}
                    </span>
                  </div>
                  <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-[#D9232E] text-white text-xs font-extrabold shadow">
                    Новосёлам −{project.novoselySavings.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h3
                      onClick={() => setActiveProject(project)}
                      className="text-xl font-extrabold text-[#141414] leading-snug group-hover:text-black/75 cursor-pointer"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C554B] leading-relaxed">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-black/8">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#6E685F] font-bold">
                          Комплектация от
                        </div>
                        <div className="text-xl font-extrabold text-[#141414]">
                          {project.totalEstimate.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-[#6E685F]">Со скидкой −10%</div>
                        <div className="text-sm font-extrabold text-[#141414] bg-[#FFCC00] px-2.5 py-0.5 rounded-md inline-block">
                          {(project.totalEstimate - project.novoselySavings).toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="flex-1 py-3 px-4 rounded-full bg-[#141414] hover:bg-[#2B2B2B] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Состав и смета ({project.products.length})
                      </button>
                      <Link
                        to={`/anketa?project=${encodeURIComponent(project.title)}`}
                        className="p-3 rounded-full bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] transition-colors"
                        title="Заказать адаптацию проекта под мои размеры"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NOVOSYOLY SLIDE BANNER PREVIEW (exact match to user's uploaded slide aesthetic) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] overflow-hidden shadow-editorial border-2 border-[#141414] bg-white">
            {/* White Header Strip like the slide */}
            <div className="bg-white px-6 sm:px-10 py-6 sm:py-8 border-b border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#141414]">
                  ПРИВИЛЕГИИ ДЛЯ НОВОСЁЛОВ
                </h2>
                <p className="text-lg sm:text-2xl font-black uppercase tracking-tight mt-1">
                  <span className="text-[#141414]">ОБНОВЛЕНИЕ </span>
                  <span className="text-[#FFB800]">С 1 СЕНТЯБРЯ</span>
                </p>
              </div>
              <Link
                to="/novosyoly"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#141414] text-white font-extrabold text-sm hover:bg-black/85 transition-colors self-start md:self-center"
              >
                Открыть страницу акции <ArrowRight className="w-4 h-4 text-[#FFCC00]" />
              </Link>
            </div>

            {/* Signature Lemana Yellow Body */}
            <div className="bg-[#FFCC00] px-6 sm:px-10 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <ul className="space-y-3 text-base sm:text-lg font-bold text-[#141414]">
                  <li className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                    <span>Скидка без лимита по сумме по всем проектам (включая Ванную комнату от 70 000 ₽)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                    <span>Новые подотделы в проектах для полной комплектации</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                    <span>Двери — снижение порога входа в проект</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                    <span>Клиенты с Ключ-картой ПРО тоже могут быть Новосёлами</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#141414] shrink-0 mt-2.5" />
                    <span>+1 промокод «Дом и Сад» — скидка 10% на другие покупки</span>
                  </li>
                </ul>

                <div className="pt-3 flex flex-wrap gap-3">
                  <Link
                    to="/novosyoly"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#D9232E] text-white font-black text-sm uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity"
                  >
                    Рассчитать выгоду −10% <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/anketa?tab=novosel"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#141414] font-extrabold text-sm hover:bg-white/90 transition-colors"
                  >
                    Заполнить анкету Новосёла
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-black/10 bg-white">
                  <img
                    src="/images/novosely-slide.png"
                    alt="Привилегии для новосёлов — обновление с 1 сентября — Лемана ПРО -10%"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TILE CATALOG SECTION FROM VLADIVOSTOK.LEMANAPRO.RU */}
      <section id="tiles" className="py-16 lg:py-24 bg-white border-t border-black/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#6E685F]">
                <Layers className="w-4 h-4 text-[#141414]" />
                Подборка специалиста · Каталог vladivostok.lemanapro.ru
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
                Варианты плитки и{' '}
                <span className="font-serif italic font-semibold text-[#5C554B]">
                  керамогранита в наличии
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#5C554B]">
                Отобранные коллекции керамогранита 60×120, 60×60 и настенной керамики с проверенной
                геометрией. Нажмите «Рассчитать», чтобы узнать нужное число коробок и выгоду Новосёла.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {TILE_FILTERS.map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedTileGroup(grp)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    selectedTileGroup === grp
                      ? 'bg-[#FFCC00] text-[#141414] border border-[#141414]'
                      : 'bg-[#F7F5F0] text-[#242424] border border-transparent hover:border-black/20'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTiles.map((tile) => (
              <div
                key={tile.id}
                className="group bg-[#F7F5F0] rounded-3xl overflow-hidden border border-black/8 hover:border-black/25 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-[#E5E0D8]">
                    <img
                      src={tile.image}
                      alt={tile.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-[#141414] text-[11px] font-mono font-bold">
                      Арт. {tile.sku}
                    </div>
                    {tile.badge && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#FFCC00] text-[#141414] text-[11px] font-extrabold">
                        {tile.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#141414]/85 text-white text-[11px] font-semibold">
                      {tile.size}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E685F]">
                      {tile.brand} · {tile.type}
                    </div>
                    <h3 className="text-base font-extrabold text-[#141414] leading-snug line-clamp-2">
                      {tile.name}
                    </h3>
                    <p className="text-xs text-[#5C554B]">{tile.surface}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 space-y-3">
                  <div className="pt-3 border-t border-black/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-[#141414]">
                        {tile.pricePerSqm.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-xs text-[#6E685F]"> / м²</span>
                    </div>
                    <div className="text-xs font-semibold text-[#5C554B]">
                      {tile.pricePerBox.toLocaleString('ru-RU')} ₽ / кор.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcTile(tile)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#141414] hover:bg-[#2B2B2B] text-white text-xs font-bold transition-colors"
                    >
                      <Calculator className="w-3.5 h-3.5 text-[#FFCC00]" />
                      Рассчитать
                    </button>
                    <a
                      href={tile.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white border border-black/15 hover:bg-[#FFCC00] text-[#141414] transition-colors"
                      title="Открыть на vladivostok.lemanapro.ru"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F7F5F0] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-black/8">
            <div>
              <div className="font-extrabold text-base text-[#141414]">
                Нужен полный каталог плитки, мозаики, клея Церезит и эпоксидных затирок?
              </div>
              <p className="text-xs sm:text-sm text-[#5C554B]">
                В наличии во Владивостоке более 850 позиций керамической плитки и крупноформатного керамогранита.
              </p>
            </div>
            <a
              href="https://vladivostok.lemanapro.ru/catalogue/plitka/"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-black/15 hover:border-[#141414] font-bold text-xs uppercase tracking-wider"
            >
              Весь каталог Лемана ПРО Владивосток <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACTS & CONSULTATION BOOKING SECTION */}
      <section id="contacts" className="py-16 lg:py-24 bg-[#F7F5F0] border-t border-black/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Contact Details Card */}
            <div className="lg:col-span-6 bg-[#141414] text-white rounded-[30px] p-7 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00] text-[#141414] text-xs font-extrabold uppercase tracking-wider">
                  Контакты и запись на проектирование
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  Свяжитесь со специалистом{' '}
                  <span className="text-[#FFCC00]">Николаевой Александрой</span>
                </h2>
                <p className="text-white/75 text-sm sm:text-base leading-relaxed">
                  Приходите на бесплатное 3D-проектирование ванной комнаты в проектный центр Лемана ПРО
                  или отправьте план помещения онлайн — подготовлю раскладку и смету к вашему визиту.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Phone className="w-5 h-5 text-[#FFCC00] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-white/60 uppercase tracking-wider font-bold">
                        Прямая связь со специалистом / Единая линия
                      </div>
                      <a
                        href={`tel:${SPECIALIST_INFO.directPhone.replace(/[^\d+]/g, '')}`}
                        className="text-lg font-extrabold text-white hover:text-[#FFCC00] block"
                      >
                        {SPECIALIST_INFO.directPhone}
                      </a>
                      <span className="text-xs text-white/65">
                        Справочная Лемана ПРО: {SPECIALIST_INFO.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <MapPin className="w-5 h-5 text-[#FFCC00] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-white/60 uppercase tracking-wider font-bold">
                        Адрес проектного центра (Владивосток / Артём)
                      </div>
                      <div className="text-base font-bold text-white">
                        Приморский край, г. Артём, ул. Махалина, 43
                      </div>
                      <div className="text-xs text-white/65 mt-0.5">
                        Отдел «Ванные комнаты под ключ · Проектирование и дизайн»
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-xs text-white/60 font-bold uppercase mb-1">
                        <Mail className="w-4 h-4 text-[#FFCC00]" /> Почта отдела
                      </div>
                      <a
                        href={`mailto:${SPECIALIST_INFO.email}`}
                        className="text-sm font-bold text-white hover:text-[#FFCC00] break-all"
                      >
                        {SPECIALIST_INFO.email}
                      </a>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-xs text-white/60 font-bold uppercase mb-1">
                        <Clock className="w-4 h-4 text-[#FFCC00]" /> График работы
                      </div>
                      <div className="text-sm font-bold text-white">Ежедневно 08:00 – 22:00</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={SPECIALIST_INFO.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-[#141414] font-extrabold text-xs uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                </a>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider"
                >
                  <Send className="w-4 h-4 text-[#FFCC00]" /> Telegram {SPECIALIST_INFO.telegramHandle}
                </a>
              </div>
            </div>

            {/* Express Booking & Link to Full Questionnaire */}
            <div className="lg:col-span-6 bg-white rounded-[30px] p-7 sm:p-10 border border-black/10 shadow-card flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#6E685F]">
                  Бесплатное 3D-проектирование
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141414]">
                  Запишитесь на встречу или заполните подробную анкету клиента
                </h3>
                <p className="text-sm text-[#5C554B]">
                  Оставьте контакты для быстрой записи на удобное время либо перейдите к полной анкете
                  оценки ремонта недвижимости.
                </p>
              </div>

              {quickSent ? (
                <div className="p-6 rounded-2xl bg-[#FFF8D6] border-2 border-[#FFCC00] space-y-3">
                  <div className="flex items-center gap-2 text-[#141414] font-extrabold text-lg">
                    <CheckCircle2 className="w-6 h-6 text-[#141414] fill-[#FFCC00]" />
                    Заявка передана Николаевой Александре!
                  </div>
                  <p className="text-sm text-[#242424]">
                    Спасибо, <strong>{quickName}</strong>! Я свяжусь с вами по номеру{' '}
                    <strong>{quickPhone}</strong> для подтверждения времени консультации ({quickSlot}).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickSent(false);
                      setQuickName('');
                      setQuickPhone('');
                    }}
                    className="text-xs font-extrabold underline text-[#141414]"
                  >
                    Отправить ещё одну заявку
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E685F] mb-1.5">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Например: Елена Смирнова"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E685F] mb-1.5">
                      Контактный телефон *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (914) ___-__-__"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E685F] mb-1.5">
                      Формат проектирования
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'В торговом зале (Махалина, 43)',
                        'Онлайн по плану в WhatsApp/TG',
                      ].map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setQuickSlot(fmt)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                            quickSlot === fmt
                              ? 'bg-[#FFCC00] border-[#141414] text-[#141414]'
                              : 'bg-[#F7F5F0] border-transparent text-[#4A4640]'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] font-extrabold text-sm uppercase tracking-wider transition-colors"
                  >
                    Записаться на бесплатный 3D-проект
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-[#6E685F]">
                  Хотите сразу рассчитать весь комплекс ремонтных работ и оформить статус Новосёла?
                </div>
                <Link
                  to="/anketa"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold hover:bg-black/80"
                >
                  Открыть Анкету клиента <ArrowRight className="w-3.5 h-3.5 text-[#FFCC00]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      <TileCalculatorModal tile={calcTile} onClose={() => setCalcTile(null)} />
    </div>
  );
};
