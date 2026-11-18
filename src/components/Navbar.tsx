import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  agencyName: string;
  onNavigateSection: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Case Studies', id: 'case-studies' },
  { label: 'Our Team', id: 'team' },
  { label: 'Contact', id: 'contact' },
];

export function Navbar({ agencyName, onNavigateSection }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/[0.08]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="font-display text-lg sm:text-xl font-bold tracking-[-0.03em] text-[#111111] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7651D9] rounded"
        >
          {agencyName || 'META FLUX'}
        </a>

        {/* Zone 2: Single-line Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 xl:gap-7"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className="text-[13px] font-medium text-[#111111]/70 hover:text-[#111111] transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#7651D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7651D9] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="inline-flex items-center gap-1.5 bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold tracking-wide px-4 py-2.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7651D9] focus-visible:ring-offset-2"
          >
            <span>LET&apos;S TALK</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-black/10 text-[#111111] hover:bg-[#F7F7FA] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden bg-white border-t border-black/[0.08] px-5 py-4 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className="py-2.5 px-3 text-sm font-medium text-[#111111] hover:bg-[#F3F0FA] hover:text-[#7651D9] rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
