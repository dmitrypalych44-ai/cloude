import React from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, ExternalLink, Sparkles, ArrowRight, Layers, Clock, Maximize2 } from 'lucide-react';
import { BathroomProject } from '../data/siteData';

interface ProjectModalProps {
  project: BathroomProject | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-[#FFCC00] text-[#141414] flex items-center justify-center shadow-lg transition-colors"
          aria-label="Закрыть окно"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto">
          <div className="relative h-64 sm:h-80 md:h-96 bg-[#141414]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#FFCC00] text-[#141414] text-xs font-extrabold uppercase tracking-wider">
                  {project.styleTag}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold inline-flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" /> {project.area}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Срок ремонта: ~{project.duration}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">{project.title}</h3>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Price & Novosely Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F7F5F0] rounded-2xl p-5 border border-black/5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#6E685F]">
                  Ориентировочная комплектация товаров
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#141414] mt-1">
                  {project.totalEstimate.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-xs text-[#6E685F] mt-1">
                  Бесплатная адаптация 3D-макета под размеры вашего санузла
                </div>
              </div>
              <div className="bg-[#FFCC00] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#141414] inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> По акции «Новосёлы −10%»
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D9232E] text-white text-xs font-extrabold">
                    −{project.novoselySavings.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#141414] mt-1">
                  Итого: {(project.totalEstimate - project.novoselySavings).toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            {/* Description & Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#6E685F]">
                  Концепция и эргономика решения
                </h4>
                <p className="text-[#242424] leading-relaxed">{project.description}</p>
              </div>
              <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl p-5 border border-black/5 space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#141414]">
                  Ключевые преимущества
                </h4>
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#242424]">
                    <CheckCircle2 className="w-4 h-4 text-[#141414] shrink-0 mt-0.5 fill-[#FFCC00]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Specification Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#141414] inline-flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Ключевые товары из каталога Лемана ПРО Владивосток
                </h4>
                <a
                  href={project.lemanaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#141414] underline hover:text-black/70 inline-flex items-center gap-1"
                >
                  Страница проекта на сайте <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="border border-black/10 rounded-2xl overflow-hidden divide-y divide-black/10">
                {project.products.map((prod) => (
                  <div
                    key={prod.sku}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F7F5F0]/70 transition-colors"
                  >
                    <div>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/5 text-[#6E685F] mr-2">
                        Арт. {prod.sku}
                      </span>
                      <span className="text-sm font-semibold text-[#141414]">{prod.name}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <span className="text-sm font-extrabold text-[#141414]">
                        {prod.price} <span className="text-xs font-normal text-[#6E685F]">/ {prod.unit}</span>
                      </span>
                      <a
                        href={prod.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#FFCC00] transition-colors inline-flex items-center gap-1"
                      >
                        В каталог <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-black/10">
              <div className="text-xs text-[#6E685F]">
                Специалист <strong>Николаева Александра</strong> бесплатно пересчитает раскладку под вашу планировку.
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/anketa?project=${encodeURIComponent(project.title)}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FFCC00] hover:bg-[#F2BE00] text-[#141414] font-extrabold text-sm transition-colors"
                >
                  Рассчитать под мои размеры <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
