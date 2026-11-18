import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { SiteSettings } from '../types/cms.ts';

interface AboutSectionProps {
  settings: SiteSettings;
  onConsultClick: () => void;
}

export function AboutSection({ settings, onConsultClick }: AboutSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const stats = settings.statsJson || [];

  return (
    <section id="about" className="bg-[#F7F7FA] border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch mb-14">
          {/* Editorial Copy */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
              ABOUT META FLUX
            </p>
            <h2 className="font-display text-[clamp(1.85rem,3.2vw,3rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance mb-6">
              {settings.aboutHeadline}
            </h2>
            <p className="text-base sm:text-lg leading-[1.7] text-[#111111]/72 max-w-2xl mb-6">
              {settings.aboutDescription}
            </p>
            <p className="text-sm sm:text-base leading-[1.7] text-[#111111]/65 max-w-2xl mb-8">
              Every engagement pairs disciplined Meta Ads media buying with tailored creative production—so your brand improves online visibility, attracts qualified buyers, and converts attention into measurable pipeline.
            </p>
            <div>
              <button
                type="button"
                onClick={onConsultClick}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#7651D9] hover:text-[#623EC4] transition-colors cursor-pointer"
              >
                <span>Schedule a Growth Audit</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Studio Photo */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="w-full h-full min-h-[280px] rounded-xl overflow-hidden border border-black/[0.08] bg-white">
              <img
                src="/src/assets/images/about_strategy_studio_1794978984710.jpg"
                alt="META FLUX strategy and creative direction session"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Editable Agency Statistics Strip */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.08] border border-black/[0.08] rounded-xl overflow-hidden">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white p-6 sm:p-7 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#111111]/55">
                    {stat.label}
                  </span>
                  {stat.isSample && (
                    <span className="text-[11px] font-medium text-[#7651D9]">
                      Sample
                    </span>
                  )}
                </div>
                <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs leading-relaxed text-[#111111]/60">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
