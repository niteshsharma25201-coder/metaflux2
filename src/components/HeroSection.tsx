import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, BarChart2, Layers, TrendingUp } from 'lucide-react';
import type { SiteSettings } from '../types/cms.ts';

interface HeroSectionProps {
  settings: SiteSettings;
  onExploreWork: () => void;
  onGetConsultation: () => void;
}

export function HeroSection({
  settings,
  onExploreWork,
  onGetConsultation,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const renderHeadlineWithAccent = (headline: string) => {
    const words = headline.trim().split(' ');
    if (words.length <= 1) return headline;
    const lastWord = words[words.length - 1];
    const prefix = words.slice(0, -1).join(' ');
    return (
      <>
        {prefix}{' '}
        <span className="text-[#7651D9]">{lastWord}</span>
      </>
    );
  };

  return (
    <section
      id="home"
      className="relative bg-white overflow-hidden border-b border-black/[0.07]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Typography Column */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-[#7651D9] mb-5">
              {settings.heroEyebrow}
            </p>

            <h1 className="font-display text-[clamp(2.5rem,4.5vw,4.125rem)] font-bold tracking-[-0.03em] leading-[1.06] text-[#111111] text-balance mb-6">
              {renderHeadlineWithAccent(settings.heroHeadline)}
            </h1>

            <p className="text-base sm:text-lg leading-[1.65] text-[#111111]/70 max-w-xl mb-9">
              {settings.heroSubheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onGetConsultation}
                className="inline-flex items-center gap-2 bg-[#7651D9] hover:bg-[#623EC4] text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7651D9] focus-visible:ring-offset-2"
              >
                <span>Get Free Consultation</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreWork}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7FA] text-[#111111] border border-black/15 text-sm font-semibold px-6 py-3.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                <span>Explore Our Work</span>
                <ArrowDownRight className="w-4 h-4 text-[#7651D9]" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-12 pt-7 border-t border-black/[0.08] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#111111]/60">
              <span>Meta Ads Strategy</span>
              <span aria-hidden="true">·</span>
              <span>Creative Direction</span>
              <span aria-hidden="true">·</span>
              <span>WhatsApp Lead Systems</span>
              <span aria-hidden="true">·</span>
              <span>Performance Reporting</span>
            </div>
          </motion.div>

          {/* Right Architectural Visual Column */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative min-h-[340px] lg:min-h-[500px]"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-black/[0.08] bg-[#F7F7FA]">
              <img
                src="/src/assets/images/hero_agency_studio_1794978983050.jpg"
                alt="META FLUX minimalist creative strategy studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Subtle Floating Architectural Graphic 1 */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -6, 0] }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-xl px-4 py-3 absolute top-5 left-5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F3F0FA] text-[#7651D9] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#111111]/55">
                    Acquisition Architecture
                  </p>
                  <p className="text-xs font-semibold text-[#111111]">
                    Full-Funnel Paid Social
                  </p>
                </div>
              </motion.div>

              {/* Subtle Floating Architectural Graphic 2 */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, 6, 0] }
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-xl px-4 py-3.5 absolute bottom-5 right-5 left-5 sm:left-auto sm:w-72 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-semibold text-[#111111]">
                    Creative &amp; Media Loop
                  </span>
                  <Layers className="w-4 h-4 text-[#7651D9]" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/[0.07] text-[11px] text-[#111111]/70">
                  <div className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3 text-[#7651D9]" />
                    <span>Signal</span>
                  </div>
                  <span>Creative</span>
                  <span>Conversion</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
