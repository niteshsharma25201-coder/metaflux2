import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy, CaseStudyChartPoint } from '../types/cms.ts';

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
  onStartSimilar: (clientContext: string) => void;
}

function CaseStudyChart({ data }: { data: CaseStudyChartPoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-[#111111]/50 bg-[#F7F7FA] rounded-lg border border-black/[0.06]">
        No trajectory data points configured for this case study.
      </div>
    );
  }

  const maxLeads = Math.max(...data.map((d) => d.leads), 1);
  const maxCpl = Math.max(...data.map((d) => d.cpl), 1);

  return (
    <div className="bg-[#F7F7FA] border border-black/[0.07] rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-xs font-semibold text-[#111111]">
            Lead Volume vs. Cost Per Lead Trend
          </p>
          <p className="text-[11px] text-[#111111]/55">
            Hover or tap intervals to inspect editable period figures
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#111111]/65">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#7651D9]" />
            <span>Leads Generated</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#111111]" />
            <span>Cost Per Lead</span>
          </span>
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((point, idx) => {
          const leadPct = Math.max(14, Math.round((point.leads / maxLeads) * 100));
          const cplPct = Math.max(14, Math.round((point.cpl / maxCpl) * 100));
          const isHovered = hoverIdx === idx;

          return (
            <div
              key={`${point.period}-${idx}`}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => setHoverIdx(isHovered ? null : idx)}
              className={`bg-white border rounded-lg p-3 transition-colors cursor-pointer ${
                isHovered ? 'border-[#7651D9]' : 'border-black/[0.07]'
              }`}
            >
              <div className="h-32 flex items-end justify-center gap-2 pb-2 border-b border-black/[0.06]">
                <div className="w-5 sm:w-7 flex flex-col items-center justify-end h-full">
                  <span className="font-mono text-[10px] text-[#7651D9] font-medium tabular-nums mb-1">
                    {point.leads}
                  </span>
                  <div
                    className="w-full rounded-t bg-[#7651D9] transition-all duration-300"
                    style={{ height: `${leadPct}%` }}
                  />
                </div>
                <div className="w-5 sm:w-7 flex flex-col items-center justify-end h-full">
                  <span className="font-mono text-[10px] text-[#111111]/70 font-medium tabular-nums mb-1">
                    {point.cpl}
                  </span>
                  <div
                    className="w-full rounded-t bg-[#111111]/85 transition-all duration-300"
                    style={{ height: `${cplPct}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 text-center">
                <p className="text-[11px] font-semibold text-[#111111] truncate">
                  {point.period}
                </p>
                <p className="font-mono text-[10px] text-[#111111]/55 tabular-nums">
                  Spend: ₹{point.spend.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CaseStudiesSection({
  caseStudies,
  onStartSimilar,
}: CaseStudiesSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (caseStudies.length === 0) return null;

  const active = caseStudies[selectedIndex] || caseStudies[0];

  return (
    <section id="case-studies" className="bg-white border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
              CASE STUDIES
            </p>
            <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance">
              Structured Strategy &amp; Transparent Campaign Metrics.
            </h2>
          </div>
          <p className="text-xs text-[#111111]/55 max-w-sm leading-relaxed">
            Every case study field and metric below is editable from the Admin Dashboard. Sample case studies are clearly marked for demonstration.
          </p>
        </div>

        {/* Case Study Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {caseStudies.map((cs, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={cs.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#7651D9] text-white'
                    : 'bg-[#F7F7FA] text-[#111111]/75 hover:text-[#111111] border border-black/[0.06]'
                }`}
              >
                {cs.clientName}
              </button>
            );
          })}
        </div>

        {/* Active Case Study Detail Sheet */}
        <div className="border border-black/[0.09] rounded-xl bg-white overflow-hidden">
          {/* Header Strip */}
          <div className="px-6 sm:px-8 py-6 border-b border-black/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F7F7FA]/60">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#111111]/60 mb-1.5">
                <span className="font-semibold text-[#7651D9]">{active.industry}</span>
                <span aria-hidden="true">·</span>
                <span>Duration: {active.campaignDuration}</span>
                {active.isSample && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Sample Demo Data (Editable)</span>
                  </>
                )}
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-[#111111]">
                {active.clientName}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onStartSimilar(active.industry)}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#7651D9] text-white text-xs font-semibold px-5 py-3 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer w-fit"
            >
              <span>Request Strategy Plan</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* 4 Key Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#F3F0FA]/70 border border-[#7651D9]/15 rounded-xl p-5">
                <p className="text-xs font-medium text-[#111111]/60 mb-1.5">
                  Campaign Duration
                </p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#111111] tabular-nums">
                  {active.campaignDuration}
                </p>
              </div>
              <div className="bg-[#F7F7FA] border border-black/[0.07] rounded-xl p-5">
                <p className="text-xs font-medium text-[#111111]/60 mb-1.5">
                  Ad Budget
                </p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#111111] tabular-nums">
                  {active.adBudget}
                </p>
              </div>
              <div className="bg-[#F7F7FA] border border-black/[0.07] rounded-xl p-5">
                <p className="text-xs font-medium text-[#111111]/60 mb-1.5">
                  Leads Generated
                </p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#7651D9] tabular-nums">
                  {active.leadsGenerated}
                </p>
              </div>
              <div className="bg-[#F7F7FA] border border-black/[0.07] rounded-xl p-5">
                <p className="text-xs font-medium text-[#111111]/60 mb-1.5">
                  Cost Per Lead
                </p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#111111] tabular-nums">
                  {active.costPerLead}
                </p>
              </div>
            </div>

            {/* Strategy Breakdown + Interactive Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-[#111111]/55 mb-2">
                    CAMPAIGN OBJECTIVE
                  </h4>
                  <p className="text-sm leading-relaxed text-[#111111]">
                    {active.campaignObjective}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.07]">
                  <h4 className="text-xs font-semibold tracking-wider text-[#111111]/55 mb-2">
                    MARKETING STRATEGY
                  </h4>
                  <p className="text-sm leading-relaxed text-[#111111]/75">
                    {active.marketingStrategy}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.07]">
                  <h4 className="text-xs font-semibold tracking-wider text-[#111111]/55 mb-2">
                    RESULTS &amp; INSIGHTS
                  </h4>
                  <p className="text-sm leading-relaxed text-[#111111]/75">
                    {active.resultsInsights}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <CaseStudyChart data={active.chartDataJson} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
