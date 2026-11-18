import { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { CaseStudiesSection } from './components/CaseStudiesSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { Footer } from './components/Footer.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { Navbar } from './components/Navbar.tsx';
import { PortfolioSection } from './components/PortfolioSection.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { TeamSection } from './components/TeamSection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { WhyChooseSection } from './components/WhyChooseSection.tsx';
import type { PublicSiteData } from './types/cms.ts';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    () => window.location.pathname === '/admin'
  );
  const [siteData, setSiteData] = useState<PublicSiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [preselectedService, setPreselectedService] = useState('');
  const [preselectedMessage, setPreselectedMessage] = useState('');

  const fetchSiteData = useCallback(async () => {
    try {
      setLoadError('');
      const res = await fetch('/api/site-data');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load META FLUX agency data.');
      }
      setSiteData(data);
    } catch (err: unknown) {
      setLoadError(
        err instanceof Error ? err.message : 'Unable to connect to server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleConsultWithContext = (serviceName?: string, note?: string) => {
    if (serviceName) setPreselectedService(serviceName);
    if (note) setPreselectedMessage(note);
    scrollToSection('contact');
  };

  if (isAdminRoute) {
    return (
      <AdminDashboard
        onExitAdmin={exitAdmin}
        onDataUpdated={fetchSiteData}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="h-16 border-b border-black/[0.08] px-8 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight text-[#111111]">
            META FLUX
          </span>
        </div>
        <div className="max-w-[1280px] w-full mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-5">
            <div className="h-4 w-40 bg-[#F7F7FA] rounded animate-pulse" />
            <div className="h-14 w-full bg-[#F7F7FA] rounded animate-pulse" />
            <div className="h-20 w-5/6 bg-[#F7F7FA] rounded animate-pulse" />
          </div>
          <div className="lg:col-span-6 h-96 bg-[#F7F7FA] rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (loadError || !siteData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-black/10 rounded-xl p-8 text-center space-y-4">
          <h1 className="font-display text-xl font-bold text-[#111111]">
            META FLUX
          </h1>
          <p className="text-sm text-[#111111]/70">
            {loadError || 'Unable to load agency content right now.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchSiteData();
            }}
            className="bg-[#7651D9] text-white text-xs font-semibold px-5 py-2.5 rounded-lg cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <Navbar
        agencyName={siteData.settings.agencyName}
        onNavigateSection={scrollToSection}
      />

      <main>
        <HeroSection
          settings={siteData.settings}
          onExploreWork={() => scrollToSection('portfolio')}
          onGetConsultation={() => scrollToSection('contact')}
        />

        <AboutSection
          settings={siteData.settings}
          onConsultClick={() => scrollToSection('contact')}
        />

        <ServicesSection
          services={siteData.services}
          onLearnMore={(serviceTitle) =>
            handleConsultWithContext(
              serviceTitle,
              `I would like to learn more about ${serviceTitle} for our business.`
            )
          }
        />

        <PortfolioSection
          projects={siteData.portfolio}
          onDiscussProject={(projectTitle) =>
            handleConsultWithContext(
              'Meta Ads Management',
              `I am interested in a campaign system similar to "${projectTitle}".`
            )
          }
        />

        <CaseStudiesSection
          caseStudies={siteData.caseStudies}
          onStartSimilar={(industry) =>
            handleConsultWithContext(
              'Digital Marketing Strategy',
              `We operate in ${industry} and would like to discuss a custom Meta Ads strategy.`
            )
          }
        />

        <TeamSection team={siteData.team} />

        <WhyChooseSection />

        <TestimonialsSection testimonials={siteData.testimonials} />

        <PricingSection
          packages={siteData.pricing}
          onGetCustomQuote={(pkgName) =>
            handleConsultWithContext(
              `${pkgName} Package — Custom Quote`,
              `Please share a custom quote for the ${pkgName} package. (We understand ad budget is separate from agency charges.)`
            )
          }
        />

        <ContactSection
          settings={siteData.settings}
          services={siteData.services}
          preselectedService={preselectedService}
          preselectedMessage={preselectedMessage}
        />
      </main>

      <Footer
        settings={siteData.settings}
        onNavigateSection={scrollToSection}
        onOpenAdmin={openAdmin}
      />

      <FloatingWhatsApp whatsappNumber={siteData.settings.whatsappNumber} />
    </div>
  );
}
