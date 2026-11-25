import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  Download,
  Printer,
  Copy,
  Sparkles,
  Home,
  Wrench,
  UserCheck,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import { SPECIALIST_INFO } from '../data/siteData';

const PROPERTY_TYPES = [
  'Новостройка',
  'Вторичка',
  'ИЖС (индивидуальное жилищное строительство)',
];

const ROOM_COUNTS = ['Студия', '1 комн.', '2 комн.', '3 комн.', '4 и более', 'Другое'];

const FINISH_TYPES = [
  'Черновая',
  'White box (предчистовая) — базовая подготовка под финиш',
  'Чистовая отделка — полностью готовый ремонт',
  'Частичный ремонт (требует доработки/иных решений)',
];

const REQUIRED_WORKS = [
  {
    id: 'vk',
    label: 'ВК — ванная комната (блок работ по помещению: гидроизоляция, плитка, сантехника)',
    featured: true,
  },
  { id: 'demolition', label: 'Демонтаж / обустройство перегородок', featured: false },
  {
    id: 'rough',
    label: 'Черновые работы (стяжка, штукатурка, инженерные сети и т. п.)',
    featured: false,
  },
  { id: 'balcony', label: 'Отделка балкона — комплекс работ по обустройству', featured: false },
  {
    id: 'flooring',
    label: 'Напольное покрытие — выбор и укладка: ламинат, кварцвинил, керамогранит, линолеум',
    featured: false,
  },
  {
    id: 'walls',
    label: 'Отделка стен — поклейка обоев, декоративная штукатурка, покраска',
    featured: false,
  },
  {
    id: 'putty',
    label: 'Стены — шпатлёвка (выравнивание поверхностей перед финишной отделкой)',
    featured: false,
  },
  {
    id: 'doors',
    label: 'Двери — установка/замена (МК — межкомнатные, ВВ — входные)',
    featured: false,
  },
  {
    id: 'ceiling',
    label: 'Потолок + освещение — монтаж потолочного покрытия и осветительных приборов',
    featured: false,
  },
  {
    id: 'kitchen',
    label: 'Кухня — блок отделочных и монтажных работ в кухонном помещении',
    featured: false,
  },
  { id: 'ac', label: 'Установка сплит-систем', featured: false },
  {
    id: 'living',
    label: 'Обустройство гостиной/прихожей — отделка и подготовка к эксплуатации',
    featured: false,
  },
  {
    id: 'decor',
    label: 'Обустройство уютного дома — дополнительные элементы интерьера: карнизы, текстиль и прочее',
    featured: false,
  },
];

export const QuestionnairePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('tab') === 'novosel' ? 'novosel' : 'full';
  const [mode, setMode] = useState<'full' | 'novosel'>(initialMode);

  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [fillDate, setFillDate] = useState(todayStr);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [propertyTypes, setPropertyTypes] = useState<string[]>(['Новостройка']);
  const [complexName, setComplexName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [roomCount, setRoomCount] = useState('2 комн.');
  const [finishStates, setFinishStates] = useState<string[]>([
    'White box (предчистовая) — базовая подготовка под финиш',
  ]);

  const [selectedWorks, setSelectedWorks] = useState<string[]>(['vk']);
  const [bathroomArea, setBathroomArea] = useState('5.5');
  const [comments, setComments] = useState('');

  // Novosel Loyalty Questions (from Анкета Новосел.pdf)
  const [hasKeyCard, setHasKeyCard] = useState<'Да' | 'Нет'>('Да');
  const [wantsNovosel10, setWantsNovosel10] = useState<'Да' | 'Нет'>('Да');
  const [wantsPush, setWantsPush] = useState<'Да' | 'Нет'>('Да');
  const [wantsFreeConsult, setWantsFreeConsult] = useState<'Да' | 'Нет'>('Да');
  const [consentChecked, setConsentChecked] = useState<boolean>(true);

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const fillDemoData = () => {
    setFullName('Ковалёв Артём Сергеевич');
    setPhone('+7 (914) 782-19-45');
    setEmail('artem.kovalev.vl@mail.ru');
    setPropertyTypes(['Новостройка']);
    setComplexName('ЖК «Маринист» / Патрокл');
    setFullAddress('г. Владивосток, ул. Сочинская, д. 15, кв. 84');
    setRoomCount('2 комн.');
    setBathroomArea('6.1');
    setFinishStates(['Черновая']);
    setSelectedWorks(['vk', 'rough', 'flooring', 'doors', 'ceiling']);
    setHasKeyCard('Да');
    setWantsNovosel10('Да');
    setWantsPush('Да');
    setWantsFreeConsult('Да');
    setComments(
      'Демо-заявка: хотим душевую walk-in в строительном исполнении, керамогранит 60×120 под светлый травертин и мрамор, подвесную тумбу со стиральной машиной под единой столешницей. Ключи получены 2 месяца назад (ДДУ на руках).'
    );
  };

  useEffect(() => {
    if (searchParams.get('demo') === '1') {
      fillDemoData();
      return;
    }
    const projectParam = searchParams.get('project');
    const tileParam = searchParams.get('tile');
    const additions: string[] = [];
    if (projectParam) additions.push(`Выбранный референс проекта: «${projectParam}».`);
    if (tileParam) additions.push(`Выбранная плитка: ${tileParam}.`);
    if (additions.length > 0) {
      setComments((prev) => (prev ? prev : additions.join('\n')));
    }
  }, [searchParams]);

  const toggleMulti = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const buildSummaryText = () => {
    const worksLabels = REQUIRED_WORKS.filter((w) => selectedWorks.includes(w.id)).map(
      (w) => `• ${w.label}`
    );
    return [
      `АНКЕТА КЛИЕНТА — ПРОЕКТ ВАННОЙ КОМНАТЫ (Николаева Александра, Лемана ПРО Владивосток)`,
      `Дата заполнения: ${fillDate}`,
      `ФИО заявителя: ${fullName}`,
      `Телефон: ${phone}`,
      email ? `Email: ${email}` : null,
      `--- Недвижимость ---`,
      `Тип: ${propertyTypes.join(', ') || 'Не указан'}`,
      complexName ? `ЖК: ${complexName}` : null,
      fullAddress ? `Адрес: ${fullAddress}` : null,
      `Комнатность: ${roomCount}`,
      `Площадь санузла (ВК): ~${bathroomArea} м²`,
      `Текущая отделка: ${finishStates.join(', ')}`,
      mode === 'full' ? `--- Требуемые работы ---\n${worksLabels.join('\n')}` : null,
      `--- Программа лояльности и НОВОСЁЛ -10% ---`,
      `Участник Ключ-карты Лемана ПРО: ${hasKeyCard}`,
      `Участие в программе «НОВОСЁЛ -10%»: ${wantsNovosel10}`,
      `Пуш-уведомления о скидках и кешбэке: ${wantsPush}`,
      `Бесплатная консультация и 3D-проектирование: ${wantsFreeConsult}`,
      comments ? `--- Пожелания и комментарии ---\n${comments}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !consentChecked) return;
    const savedList = JSON.parse(localStorage.getItem('lemana_questionnaires') || '[]');
    savedList.unshift({
      id: Date.now(),
      date: fillDate,
      fullName,
      phone,
      summary: buildSummaryText(),
    });
    localStorage.setItem('lemana_questionnaires', JSON.stringify(savedList.slice(0, 20)));
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(buildSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & PDF Download Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#5C554B] hover:text-[#141414]"
          >
            <ArrowLeft className="w-4 h-4" /> Вернуться в портфолио проектов
          </Link>
          <div className="flex flex-wrap gap-2">
            <a
              href="/docs/anketa-klienta.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-black/15 text-xs font-bold hover:border-[#141414]"
            >
              <Download className="w-3.5 h-3.5" /> Бланк «Анкета клиента» (PDF)
            </a>
            <a
              href="/docs/anketa-novosel.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFCC00] text-[#141414] text-xs font-extrabold hover:bg-[#F2BE00]"
            >
              <Download className="w-3.5 h-3.5" /> Бланк «Анкета Новосёл» (PDF)
            </a>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border border-black/10 shadow-card space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8D6] border border-[#FFCC00] text-xs font-extrabold text-[#141414] mb-3">
                <FileCheck2 className="w-3.5 h-3.5" /> Персональный расчёт с Николаевой Александрой
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#141414]">
                Анкета клиента · Ремонт и проектирование
              </h1>
              <p className="text-sm sm:text-base text-[#5C554B] mt-1">
                Заполните форму для предварительной оценки стоимости ремонтных работ, бесплатного
                3D-проекта ванной комнаты и подключения привилегии «Новосёлы −10%».
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoData}
              className="shrink-0 self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFF8D6] hover:bg-[#FFCC00] border border-[#141414] text-xs font-extrabold text-[#141414] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Заполнить демо-примером клиента
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 rounded-2xl bg-[#F7F5F0]">
            <button
              type="button"
              onClick={() => setMode('full')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                mode === 'full'
                  ? 'bg-[#141414] text-[#FFCC00] shadow-sm'
                  : 'text-[#4A4640] hover:text-[#141414]'
              }`}
            >
              Полная анкета клиента (ремонт + работы + Новосёл)
            </button>
            <button
              type="button"
              onClick={() => setMode('novosel')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                mode === 'novosel'
                  ? 'bg-[#FFCC00] text-[#141414] shadow-sm'
                  : 'text-[#4A4640] hover:text-[#141414]'
              }`}
            >
              Экспресс-анкета участника «НОВОСЁЛ −10%»
            </button>
          </div>
        </div>

        {/* Submitted Confirmation Screen */}
        {submitted ? (
          <div className="bg-white rounded-[28px] p-7 sm:p-10 border-2 border-[#FFCC00] shadow-editorial space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFCC00] text-[#141414] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#141414]">
                  Анкета успешно сформирована!
                </h2>
                <p className="text-sm text-[#5C554B] mt-1">
                  Специалист по продаже проектов <strong>Николаева Александра</strong> подготовит для
                  вас 3D-проект ванной комнаты, подборку плитки и расчёт выгоды 10%.
                </p>
              </div>
            </div>

            <pre className="p-5 rounded-2xl bg-[#F7F5F0] text-xs sm:text-sm text-[#141414] whitespace-pre-wrap font-sans leading-relaxed border border-black/10">
              {buildSummaryText()}
            </pre>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#141414] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-black/85"
              >
                <Copy className="w-4 h-4 text-[#FFCC00]" />
                {copied ? 'Анкета скопирована!' : 'Скопировать текст анкеты'}
              </button>
              <a
                href={`${SPECIALIST_INFO.whatsappLink}?text=${encodeURIComponent(buildSummaryText())}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFCC00] text-[#141414] text-xs font-extrabold uppercase tracking-wider hover:bg-[#F2BE00]"
              >
                Отправить специалисту в WhatsApp
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#F7F5F0] text-[#141414] text-xs font-bold hover:bg-black/10"
              >
                <Printer className="w-4 h-4" /> Распечатать анкету
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold underline text-[#5C554B]"
              >
                Редактировать ответы
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* BLOCK 1: Основная информация */}
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-card space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/8">
                <UserCheck className="w-5 h-5 text-[#141414]" />
                <h2 className="text-xl font-extrabold text-[#141414]">1. Основная информация</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-1.5">
                    ФИО собственника / заявителя *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Фамилия Имя Отчество"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-1.5">
                    Контактный номер телефона *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                  />
                </div>

                {mode === 'full' && (
                  <>
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-1.5">
                        Дата заполнения
                      </label>
                      <input
                        type="date"
                        value={fillDate}
                        onChange={(e) => setFillDate(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-1.5">
                        Email (для отправки 3D-визуализации и сметы)
                      </label>
                      <input
                        type="email"
                        placeholder="example@mail.ru"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* BLOCK 2: Информация о недвижимости */}
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-card space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/8">
                <Home className="w-5 h-5 text-[#141414]" />
                <h2 className="text-xl font-extrabold text-[#141414]">
                  2. Информация о недвижимости
                </h2>
              </div>

              {/* Тип недвижимости */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-2.5">
                  Тип недвижимости
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PROPERTY_TYPES.map((pt) => {
                    const active = propertyTypes.includes(pt);
                    return (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => toggleMulti(propertyTypes, pt, setPropertyTypes)}
                        className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-bold transition-all ${
                          active
                            ? 'bg-[#FFF8D6] border-[#141414] text-[#141414]'
                            : 'bg-[#F7F5F0] border-transparent text-[#4A4640] hover:border-black/20'
                        }`}
                      >
                        {pt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {mode === 'full' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-1.5">
                      Название ЖК
                    </label>
                    <input
                      type="text"
                      placeholder="Например: ЖК «Северный» / «Фьорд»"
                      value={complexName}
                      onChange={(e) => setComplexName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-1.5">
                      Полный адрес объекта
                    </label>
                    <input
                      type="text"
                      placeholder="Город, улица, дом, квартира"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-1.5">
                      Площадь ванной комнаты (м²)
                    </label>
                    <input
                      type="text"
                      placeholder="Например: 5.5"
                      value={bathroomArea}
                      onChange={(e) => setBathroomArea(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Ваша квартира / Количество комнат */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-2.5">
                  Ваша квартира (количество комнат)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_COUNTS.map((rc) => (
                    <button
                      key={rc}
                      type="button"
                      onClick={() => setRoomCount(rc)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        roomCount === rc
                          ? 'bg-[#141414] text-[#FFCC00] border-[#141414]'
                          : 'bg-[#F7F5F0] text-[#242424] border-transparent hover:border-black/20'
                      }`}
                    >
                      {rc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ваш ремонт / Отделка недвижимости */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C554B] mb-2.5">
                  Ваш ремонт (текущая отделка недвижимости)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FINISH_TYPES.map((ft) => {
                    const active = finishStates.includes(ft);
                    return (
                      <button
                        key={ft}
                        type="button"
                        onClick={() => toggleMulti(finishStates, ft, setFinishStates)}
                        className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                          active
                            ? 'bg-[#FFF8D6] border-[#141414] text-[#141414] font-bold'
                            : 'bg-[#F7F5F0] border-transparent text-[#4A4640] hover:border-black/20'
                        }`}
                      >
                        {ft}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BLOCK 3: Требуемые работы (Full Questionnaire) */}
            {mode === 'full' && (
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-card space-y-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/8">
                  <div className="flex items-center gap-2.5">
                    <Wrench className="w-5 h-5 text-[#141414]" />
                    <h2 className="text-xl font-extrabold text-[#141414]">3. Требуемые работы</h2>
                  </div>
                  <span className="text-xs font-bold text-[#6E685F]">
                    Выбрано: {selectedWorks.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C554B]">
                  Отметьте работы, которые необходимо выполнить на вашем объекте:
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {REQUIRED_WORKS.map((work) => {
                    const checked = selectedWorks.includes(work.id);
                    return (
                      <label
                        key={work.id}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          work.featured
                            ? checked
                              ? 'bg-[#FFCC00]/35 border-[#141414]'
                              : 'bg-[#FFF8D6] border-[#FFCC00]'
                            : checked
                            ? 'bg-[#F7F5F0] border-[#141414]'
                            : 'bg-[#FAF9F6] border-black/5 hover:border-black/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleMulti(selectedWorks, work.id, setSelectedWorks)
                          }
                          className="w-5 h-5 mt-0.5 accent-[#141414] rounded shrink-0"
                        />
                        <span className="text-sm font-semibold text-[#141414]">{work.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BLOCK 4: Анкета Новосёл и Программа лояльности Лемана ПРО */}
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border-2 border-[#FFCC00] shadow-card space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/8">
                <Sparkles className="w-5 h-5 text-[#141414] fill-[#FFCC00]" />
                <h2 className="text-xl font-extrabold text-[#141414]">
                  {mode === 'full' ? '4.' : '3.'} Программа лояльности и привилегии «НОВОСЁЛ −10%»
                </h2>
              </div>

              {[
                {
                  q: 'Вы участник программы лояльности Лемана ПРО? (Ключ-карта или Ключ-карта ПРО)',
                  sub: 'Система накоплений, повышенный кэшбэк, скидки по промокодам. Клиенты с Ключ-картой ПРО также могут быть Новосёлами.',
                  val: hasKeyCard,
                  setVal: setHasKeyCard,
                },
                {
                  q: 'Вы хотите стать участником программы «НОВОСЁЛ» — скидка 10% без лимита по сумме?',
                  sub: 'Скидка −10% на ключевые проекты (Кухня, Ванные комнаты, Хранение, Двери, Напольные покрытия, Отделка стен) + 1 промокод «Дом и Сад» −10%.',
                  val: wantsNovosel10,
                  setVal: setWantsNovosel10,
                },
                {
                  q: 'Вы хотите получать пуш-уведомления об актуальных скидках Лемана ПРО?',
                  sub: 'Повышенный кешбэк в категориях, сезонные предложения и персональные промокоды.',
                  val: wantsPush,
                  setVal: setWantsPush,
                },
                {
                  q: 'Вы хотите получить БЕСПЛАТНУЮ консультацию по ремонту?',
                  sub: 'Предварительный расчёт стоимости, бесплатное 3D-проектирование ванной комнаты с Николаевой Александрой.',
                  val: wantsFreeConsult,
                  setVal: setWantsFreeConsult,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F7F5F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-extrabold text-[#141414]">{item.q}</div>
                    <div className="text-xs text-[#5C554B]">{item.sub}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {(['Да', 'Нет'] as const).map((ans) => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => item.setVal(ans)}
                        className={`px-5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                          item.val === ans
                            ? ans === 'Да'
                              ? 'bg-[#FFCC00] border-[#141414] text-[#141414]'
                              : 'bg-[#141414] border-[#141414] text-white'
                            : 'bg-white border-black/15 text-[#5C554B]'
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* BLOCK 5: Дополнительные комментарии и Согласие ПДн */}
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-card space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/8">
                <MessageSquare className="w-5 h-5 text-[#141414]" />
                <h2 className="text-xl font-extrabold text-[#141414]">
                  Дополнительные комментарии и пожелания
                </h2>
              </div>

              <textarea
                rows={4}
                placeholder="Опишите ваши пожелания по ванной комнате (душ или ванна, любимые оттенки плитки, бюджет, планируемая дата начала ремонта)..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#F7F5F0] border border-black/10 focus:bg-white focus:border-[#141414] focus:outline-none text-sm font-medium"
              />

              {/* Consent from Анкета Новосел.pdf */}
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#F7F5F0] border border-black/10 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-[#141414] rounded shrink-0"
                />
                <span className="text-[11px] leading-relaxed text-[#5C554B]">
                  Настоящим я даю своё согласие ООО «ЛЕ МОНЛИД» на обработку моих персональных
                  данных (фамилия, имя, отчество, номер телефона, адрес электронной почты, почтовый
                  адрес), в том числе на их сбор, запись, систематизацию, накопление, хранение,
                  уточнение, использование и передачу в целях наиболее полной реализации услуги по
                  обслуживанию клиентов, подготовки дизайн-проекта и расчёта стоимости. Настоящее
                  согласие действует в течение 5 лет и может быть отозвано письменным уведомлением по
                  адресу: 141031, Московская область, г. Мытищи, Осташковское шоссе, д. 1, в ООО «ЛЕ
                  МОНЛИД».
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-4 px-8 rounded-full bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] font-black text-sm sm:text-base uppercase tracking-wider shadow-md transition-all"
              >
                Отправить анкету и получить расчёт проекта
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
