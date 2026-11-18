import { motion, useReducedMotion } from 'motion/react';
import {
  BarChart3,
  Compass,
  Eye,
  Palette,
  Target,
  UserCheck,
} from 'lucide-react';

const PILLARS = [
  {
    number: '01',
    title: 'Performance-Driven Strategies',
    description:
      'Every campaign is built around qualified lead flow, cost-per-acquisition discipline, and measurable revenue contribution.',
    icon: Target,
  },
  {
    number: '02',
    title: 'Data-Based Decisions',
    description:
      'Budget shifts, audience exclusions, and creative scaling follow signal-backed funnel analytics rather than guesswork.',
    icon: BarChart3,
  },
  {
    number: '03',
    title: 'Creative Advertising',
    description:
      'Thumb-stopping static suites, carousels, and Reels engineered with clear positioning and high-retention pacing.',
    icon: Palette,
  },
  {
    number: '04',
    title: 'Transparent Reporting',
    description:
      'You retain full ownership of your ad accounts with clear weekly summaries covering spend, lead volume, and next iterations.',
    icon: Eye,
  },
  {
    number: '05',
    title: 'Dedicated Account Management',
    description:
      'Direct collaboration with strategists and media buyers who understand your sales cycle, offers, and customer objections.',
    icon: UserCheck,
  },
  {
    number: '06',
    title: 'Customized Business Solutions',
    description:
      'Tailored Meta Ads and WhatsApp lead funnels adapted to your industry, regional market, and monthly growth targets.',
    icon: Compass,
  },
];

export function WhyChooseSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
            WHY CHOOSE META FLUX
          </p>
          <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance">
            Built For Clarity, Speed &amp; Accountability.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.08] border border-black/[0.08] rounded-xl overflow-hidden">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.2),
                }}
                className="bg-white p-8 flex flex-col justify-between gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F0FA] text-[#7651D9] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-[#111111]/40 tabular-nums">
                    {pillar.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-[#111111] mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-[1.65] text-[#111111]/68">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
