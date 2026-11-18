import { Instagram, Linkedin, Lock } from 'lucide-react';
import type { SiteSettings } from '../types/cms.ts';

interface FooterProps {
  settings: SiteSettings;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export function Footer({
  settings,
  onNavigateSection,
  onOpenAdmin,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <p className="font-display text-xl font-bold tracking-[-0.03em] text-white mb-3">
              {settings.agencyName}
            </p>
            <p className="text-sm text-white/70 max-w-sm leading-relaxed mb-6">
              {settings.tagline} Digital marketing, Meta Ads management, and performance creative studio built for ambitious brands.
            </p>
            <div className="flex items-center gap-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="META FLUX Instagram"
                  className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-white/75 hover:text-white hover:border-[#7651D9] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="META FLUX LinkedIn"
                  className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-white/75 hover:text-white hover:border-[#7651D9] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-wider text-white/45 mb-4">
              NAVIGATION
            </p>
            <ul className="space-y-2.5 text-sm text-white/75">
              {[
                { label: 'About', id: 'about' },
                { label: 'Services', id: 'services' },
                { label: 'Portfolio', id: 'portfolio' },
                { label: 'Case Studies', id: 'case-studies' },
                { label: 'Our Team', id: 'team' },
                { label: 'Pricing', id: 'pricing' },
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateSection(link.id);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold tracking-wider text-white/45 mb-4">
              CONTACT
            </p>
            <div className="space-y-2.5 text-sm text-white/75">
              <p>{settings.contactEmail}</p>
              <p className="tabular-nums">{settings.displayWhatsapp}</p>
              <p className="text-white/55">{settings.location}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50">
          <p>
            &copy; {year} {settings.agencyName}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
