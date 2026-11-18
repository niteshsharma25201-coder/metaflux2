import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Testimonial } from '../types/cms.ts';
import { MediaFrame } from './MediaFrame.tsx';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  if (testimonials.length === 0) return null;

  const active = testimonials[activeIndex] || testimonials[0];
  const hasSamples = testimonials.some((t) => t.isSample);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="bg-[#F7F7FA] border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
              CLIENT PERSPECTIVES
            </p>
            <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance">
              Partner Feedback &amp; Reviews.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {hasSamples && (
              <span className="text-xs text-[#111111]/55 mr-2">
                Sample placeholders · Editable in Admin
              </span>
            )}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-lg bg-white border border-black/10 hover:border-[#7651D9] flex items-center justify-center text-[#111111] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-lg bg-white border border-black/10 hover:border-[#7651D9] flex items-center justify-center text-[#111111] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-black/[0.08] rounded-xl p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-8">
                <div
                  className="flex items-center gap-1 mb-5"
                  aria-label={`${active.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < active.rating
                          ? 'fill-[#7651D9] text-[#7651D9]'
                          : 'text-black/15'
                      }`}
                    />
                  ))}
                  {active.isSample && (
                    <span className="ml-3 text-xs text-[#111111]/55">
                      Sample Review Placeholder
                    </span>
                  )}
                </div>

                <blockquote className="font-display text-xl sm:text-2xl lg:text-[26px] font-medium leading-[1.45] tracking-[-0.01em] text-[#111111]">
                  &ldquo;{active.review}&rdquo;
                </blockquote>
              </div>

              <div className="lg:col-span-4 lg:border-l lg:border-black/[0.08] lg:pl-8 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-black/[0.08] shrink-0">
                  <MediaFrame
                    src={active.photoUrl}
                    mediaType="image"
                    alt={active.clientName}
                    fallbackLabel={active.clientName}
                    variant="portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-[#111111]">
                    {active.clientName}
                  </p>
                  <p className="text-xs text-[#111111]/65 mt-0.5">
                    {active.clientRole} · {active.businessName}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div className="mt-8 pt-6 border-t border-black/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View testimonial from ${t.clientName}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'w-7 bg-[#7651D9]'
                        : 'w-2 bg-black/15 hover:bg-black/30'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-[#111111]/50 tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
