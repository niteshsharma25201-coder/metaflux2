import { ArrowUpRight, Check } from 'lucide-react';
import type { PricingPackage } from '../types/cms.ts';

interface PricingSectionProps {
  packages: PricingPackage[];
  onGetCustomQuote: (packageName: string) => void;
}

export function PricingSection({
  packages,
  onGetCustomQuote,
}: PricingSectionProps) {
  return (
    <section id="pricing" className="bg-white border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
              ENGAGEMENT PACKAGES
            </p>
            <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance">
              Tailored Retainers Built Around Your Growth Stage.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#111111]/65 max-w-md leading-relaxed bg-[#F3F0FA] border border-[#7651D9]/20 rounded-lg px-4 py-3">
            Note: Advertising budget is separate from agency service charges and is billed directly through your Meta Ads account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {packages.map((pkg) => {
            const featured = pkg.isFeatured;
            return (
              <div
                key={pkg.id}
                className={`rounded-xl p-8 flex flex-col justify-between transition-colors ${
                  featured
                    ? 'bg-[#F3F0FA]/55 border-2 border-[#7651D9]'
                    : 'bg-white border border-black/[0.09]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-display text-xl font-bold tracking-tight text-[#111111]">
                      {pkg.name}
                    </h3>
                    {featured && (
                      <span className="text-xs font-semibold text-[#7651D9]">
                        Most Requested
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-[#7651D9] mb-3">
                    {pkg.targetAudience}
                  </p>

                  <p className="text-sm leading-relaxed text-[#111111]/70 mb-7">
                    {pkg.summary}
                  </p>

                  <div className="pt-6 border-t border-black/[0.08] space-y-3.5 mb-8">
                    {(pkg.featuresJson || []).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#F3F0FA] text-[#7651D9] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-[#111111]/85 leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-[#111111]/55 leading-relaxed">
                    {pkg.note}
                  </p>

                  <button
                    type="button"
                    onClick={() => onGetCustomQuote(pkg.name)}
                    className={`w-full inline-flex items-center justify-center gap-2 text-xs font-semibold px-5 py-3.5 rounded-lg transition-colors cursor-pointer ${
                      featured
                        ? 'bg-[#7651D9] hover:bg-[#623EC4] text-white'
                        : 'bg-[#111111] hover:bg-[#7651D9] text-white'
                    }`}
                  >
                    <span>Get Custom Quote</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
