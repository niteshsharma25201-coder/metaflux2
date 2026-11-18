import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { ServiceItem } from '../types/cms.ts';
import { IconResolver } from './IconResolver.tsx';

interface ServicesSectionProps {
  services: ServiceItem[];
  onLearnMore: (serviceTitle: string) => void;
}

export function ServicesSection({ services, onLearnMore }: ServicesSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="services" className="bg-white border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
              OUR SERVICES
            </p>
            <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance">
              Full-Funnel Capabilities Built For Measurable Growth.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#111111]/65 max-w-md leading-relaxed">
            From paid acquisition and WhatsApp lead generation to Reels production and creative systems, every service is structured around business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.04, 0.24),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group bg-white border border-black/[0.08] hover:border-[#7651D9]/45 rounded-xl p-7 flex flex-col justify-between transition-colors duration-150"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-11 h-11 rounded-lg bg-[#F3F0FA] text-[#7651D9] flex items-center justify-center group-hover:bg-[#7651D9] group-hover:text-white transition-colors duration-150">
                    <IconResolver name={service.iconName} className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-[#111111]/35 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold tracking-tight text-[#111111] mb-2.5">
                  {service.title}
                </h3>

                <p className="text-sm leading-[1.65] text-[#111111]/68 mb-5">
                  {service.description}
                </p>
              </div>

              <div className="pt-5 border-t border-black/[0.07] flex flex-col gap-4">
                {service.deliverables && (
                  <p className="text-xs text-[#111111]/55 leading-relaxed">
                    {service.deliverables}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onLearnMore(service.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7651D9] hover:text-[#623EC4] transition-colors w-fit cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
