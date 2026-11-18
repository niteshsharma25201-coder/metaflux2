import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Film, X } from 'lucide-react';
import type { PortfolioProject } from '../types/cms.ts';
import { MediaFrame } from './MediaFrame.tsx';

interface PortfolioSectionProps {
  projects: PortfolioProject[];
  onDiscussProject: (projectTitle: string) => void;
}

const PORTFOLIO_CATEGORIES = [
  'All',
  'Meta Ads Campaigns',
  'Lead Generation',
  'Social Media Creatives',
  'Instagram Reels',
  'Brand Promotions',
  'Video Advertising',
];

export function PortfolioSection({
  projects,
  onDiscussProject,
}: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const hasSampleItems = projects.some((p) => p.isSample);

  return (
    <section id="portfolio" className="bg-[#F7F7FA] border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
              OUR PORTFOLIO
            </p>
            <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance">
              Selected Creative &amp; Campaign Systems.
            </h2>
          </div>
          {hasSampleItems && (
            <p className="text-xs text-[#111111]/55 max-w-sm leading-relaxed">
              Demo showcase items below are clearly labeled as sample concepts until replaced with live client campaigns in the Admin Dashboard.
            </p>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Portfolio Categories"
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-10"
        >
          {PORTFOLIO_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7651D9] ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#111111]/70 border border-black/[0.08] hover:text-[#111111] hover:border-black/20'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-black/[0.08] rounded-xl p-12 text-center">
            <p className="text-sm font-medium text-[#111111] mb-2">
              No projects found in &ldquo;{selectedCategory}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-semibold text-[#7651D9] hover:underline cursor-pointer"
            >
              Show all categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.2),
                }}
                onClick={() => setActiveProject(project)}
                className="group bg-white border border-black/[0.08] hover:border-[#7651D9]/45 rounded-xl overflow-hidden flex flex-col cursor-pointer transition-colors duration-150"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F0FA] border-b border-black/[0.06]">
                  <MediaFrame
                    src={project.mediaUrl}
                    mediaType={project.mediaType}
                    alt={project.title}
                    fallbackLabel={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  {project.mediaType === 'video' && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#111111] flex items-center justify-center border border-black/10">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-[#111111]/55 mb-2.5">
                      <span className="font-medium text-[#7651D9]">
                        {project.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.industry}</span>
                      {project.isSample && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Sample Concept</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-semibold tracking-tight text-[#111111] mb-2">
                      {project.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-[#111111]/68 line-clamp-2 mb-5">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] group-hover:text-[#7651D9] transition-colors cursor-pointer"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="portfolio-modal-title"
              className="bg-white border border-black/10 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-black/[0.08] sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2 text-xs text-[#111111]/60 truncate">
                  <span className="font-semibold text-[#7651D9]">
                    {activeProject.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProject.industry}</span>
                  {activeProject.isSample && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Sample Concept</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close project modal"
                  className="w-9 h-9 rounded-lg border border-black/10 flex items-center justify-center text-[#111111] hover:bg-[#F7F7FA] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-black/[0.08] bg-[#F7F7FA]">
                  <MediaFrame
                    src={activeProject.mediaUrl}
                    mediaType={activeProject.mediaType}
                    alt={activeProject.title}
                    fallbackLabel={activeProject.title}
                    controls={activeProject.mediaType === 'video'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3
                    id="portfolio-modal-title"
                    className="font-display text-2xl font-bold tracking-tight text-[#111111] mb-3"
                  >
                    {activeProject.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#111111]/72">
                    {activeProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/[0.08]">
                  {activeProject.objective && (
                    <div className="bg-[#F7F7FA] rounded-lg p-4">
                      <p className="text-xs font-semibold text-[#111111]/55 mb-1.5">
                        Campaign Objective
                      </p>
                      <p className="text-sm text-[#111111] leading-relaxed">
                        {activeProject.objective}
                      </p>
                    </div>
                  )}
                  {activeProject.deliverables && (
                    <div className="bg-[#F7F7FA] rounded-lg p-4">
                      <p className="text-xs font-semibold text-[#111111]/55 mb-1.5">
                        Deliverables &amp; Scope
                      </p>
                      <p className="text-sm text-[#111111] leading-relaxed">
                        {activeProject.deliverables}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#111111]/55">
                    Want a tailored campaign system like this for your business?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeProject.title;
                      setActiveProject(null);
                      onDiscussProject(title);
                    }}
                    className="inline-flex items-center gap-2 bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold px-5 py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Get Free Consultation</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
