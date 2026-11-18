import { motion, useReducedMotion } from 'motion/react';
import { Instagram, Linkedin } from 'lucide-react';
import type { TeamMember } from '../types/cms.ts';
import { MediaFrame } from './MediaFrame.tsx';

interface TeamSectionProps {
  team: TeamMember[];
}

export function TeamSection({ team }: TeamSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const hasSampleMembers = team.some((m) => m.isSample);

  return (
    <section id="team" className="bg-[#F7F7FA] border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
              OUR TEAM
            </p>
            <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance">
              Strategists, Media Buyers &amp; Creative Specialists.
            </h2>
          </div>
          {hasSampleMembers && (
            <p className="text-xs text-[#111111]/55 max-w-sm leading-relaxed">
              Placeholder team profiles shown below can be edited, reordered, or replaced with real team photos in the Admin Dashboard.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <motion.article
              key={member.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.04, 0.2),
              }}
              className="bg-white border border-black/[0.08] rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] bg-[#F3F0FA] border-b border-black/[0.06] overflow-hidden">
                  <MediaFrame
                    src={member.photoUrl}
                    mediaType="image"
                    alt={`${member.name} — ${member.designation}`}
                    fallbackLabel={member.name}
                    variant="portrait"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#111111]/55 mb-1.5">
                    <span className="font-semibold text-[#7651D9]">
                      {member.designation}
                    </span>
                    {member.isSample && <span>Demo Profile</span>}
                  </div>

                  <h3 className="font-display text-xl font-semibold tracking-tight text-[#111111] mb-3">
                    {member.name}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#111111]/68 mb-4">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-black/[0.06] flex items-center justify-between gap-4">
                <p className="text-xs text-[#111111]/55 truncate">
                  {member.skills}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center text-[#111111]/70 hover:text-[#7651D9] hover:border-[#7651D9]/40 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on Instagram`}
                      className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center text-[#111111]/70 hover:text-[#7651D9] hover:border-[#7651D9]/40 transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
