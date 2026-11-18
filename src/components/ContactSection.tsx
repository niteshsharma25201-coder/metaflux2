import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Mail, MapPin, MessageCircle } from 'lucide-react';
import type { ServiceItem, SiteSettings } from '../types/cms.ts';

interface ContactSectionProps {
  settings: SiteSettings;
  services: ServiceItem[];
  preselectedService?: string;
  preselectedMessage?: string;
}

const BUDGET_OPTIONS = [
  'Under ₹25,000 / month',
  '₹25,000 – ₹75,000 / month',
  '₹75,000 – ₹1,50,000 / month',
  '₹1,50,000 – ₹3,00,000 / month',
  '₹3,00,000+ / month',
];

export function ContactSection({
  settings,
  services,
  preselectedService = '',
  preselectedMessage = '',
}: ContactSectionProps) {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [requiredService, setRequiredService] = useState(
    preselectedService || services[0]?.title || 'Meta Ads Management'
  );
  const [monthlyBudget, setMonthlyBudget] = useState(BUDGET_OPTIONS[1]);
  const [message, setMessage] = useState(preselectedMessage);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successWhatsAppUrl, setSuccessWhatsAppUrl] = useState('');

  const hiddenLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setRequiredService(preselectedService);
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedMessage) {
      setMessage(preselectedMessage);
    }
  }, [preselectedMessage]);

  const serviceOptions = [
    ...services.map((s) => s.title),
    'STARTER Package — Custom Quote',
    'GROWTH Package — Custom Quote',
    'PREMIUM Package — Custom Quote',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !fullName.trim() ||
      !businessName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !industry.trim() ||
      !requiredService.trim() ||
      !monthlyBudget.trim() ||
      !message.trim()
    ) {
      setErrorMsg('Please complete all required fields before submitting.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      setErrorMsg('Please enter a valid phone or WhatsApp number.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          businessName: businessName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          industry: industry.trim(),
          requiredService: requiredService.trim(),
          monthlyBudget: monthlyBudget.trim(),
          message: message.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Could not submit your enquiry.');
      }

      const whatsappText = [
        `Hello ${settings.agencyName}, I would like a free consultation.`,
        ``,
        `*Name:* ${fullName.trim()}`,
        `*Business:* ${businessName.trim()}`,
        `*Phone:* ${phone.trim()}`,
        `*Email:* ${email.trim()}`,
        `*Industry:* ${industry.trim()}`,
        `*Required Service:* ${requiredService.trim()}`,
        `*Monthly Ad Budget:* ${monthlyBudget.trim()}`,
        `*Message:* ${message.trim()}`,
      ].join('\n');

      const cleanWhatsapp = (settings.whatsappNumber || '917879733808').replace(
        /\D/g,
        ''
      );
      const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        whatsappText
      )}`;

      setSuccessWhatsAppUrl(waUrl);

      setFullName('');
      setBusinessName('');
      setPhone('');
      setEmail('');
      setIndustry('');
      setMessage('');

      // Trigger anchor opening in a new tab without window.open
      setTimeout(() => {
        hiddenLinkRef.current?.click();
      }, 100);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Submission failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[#F7F7FA]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Agency Contact Context */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#7651D9] mb-4">
                GET IN TOUCH
              </p>
              <h2 className="font-display text-[clamp(1.85rem,3.2vw,2.85rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111] text-balance mb-5">
                Start With a Free Growth Consultation.
              </h2>
              <p className="text-sm sm:text-base leading-[1.7] text-[#111111]/68">
                Share your business goals, current ad channels, and monthly ad budget. Our team reviews every enquiry and continues the conversation directly on WhatsApp.
              </p>
            </div>

            <div className="bg-white border border-black/[0.08] rounded-xl divide-y divide-black/[0.07]">
              <a
                href={`https://wa.me/${(settings.whatsappNumber || '917879733808').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-5 hover:bg-[#F3F0FA]/50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F0FA] text-[#7651D9] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#111111]/55">
                      Direct WhatsApp
                    </p>
                    <p className="text-sm font-semibold text-[#111111] tabular-nums">
                      {settings.displayWhatsapp}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7651D9]" />
              </a>

              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center justify-between gap-4 p-5 hover:bg-[#F3F0FA]/50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F7F7FA] text-[#111111] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#111111]/55">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-[#111111]">
                      {settings.contactEmail}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#111111]/40" />
              </a>

              <div className="flex items-center gap-3.5 p-5">
                <div className="w-10 h-10 rounded-lg bg-[#F7F7FA] text-[#111111] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#111111]/55">
                    Coverage
                  </p>
                  <p className="text-sm font-semibold text-[#111111]">
                    {settings.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Enquiry Form */}
          <div className="lg:col-span-7 bg-white border border-black/[0.08] rounded-xl p-6 sm:p-10">
            {successWhatsAppUrl && (
              <div
                role="status"
                className="mb-7 bg-[#F3F0FA] border border-[#7651D9]/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7651D9] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">
                      Enquiry submitted successfully.
                    </p>
                    <p className="text-xs text-[#111111]/70 mt-1">
                      Your details have been saved and formatted for WhatsApp chat.
                    </p>
                  </div>
                </div>
                <a
                  ref={hiddenLinkRef}
                  href={successWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap shrink-0 transition-colors"
                >
                  <span>Open WhatsApp Chat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-xs font-medium"
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="enquiry-full-name"
                    className="block text-xs font-semibold text-[#111111] mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id="enquiry-full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enquiry-business-name"
                    className="block text-xs font-semibold text-[#111111] mb-2"
                  >
                    Business Name *
                  </label>
                  <input
                    id="enquiry-business-name"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Aura Studio"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="enquiry-phone"
                    className="block text-xs font-semibold text-[#111111] mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="enquiry-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enquiry-email"
                    className="block text-xs font-semibold text-[#111111] mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="enquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="enquiry-industry"
                    className="block text-xs font-semibold text-[#111111] mb-2"
                  >
                    Business Industry *
                  </label>
                  <input
                    id="enquiry-industry"
                    type="text"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. D2C Skincare, Real Estate, SaaS"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enquiry-service"
                    className="block text-xs font-semibold text-[#111111] mb-2"
                  >
                    Required Service *
                  </label>
                  <select
                    id="enquiry-service"
                    value={requiredService}
                    onChange={(e) => setRequiredService(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9]"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="enquiry-budget"
                  className="block text-xs font-semibold text-[#111111] mb-2"
                >
                  Monthly Ad Budget *
                </label>
                <select
                  id="enquiry-budget"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9]"
                >
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="enquiry-message"
                  className="block text-xs font-semibold text-[#111111] mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="enquiry-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your products, target audience, and growth objectives..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] focus:ring-1 focus:ring-[#7651D9] resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7651D9] hover:bg-[#623EC4] disabled:opacity-60 text-white text-sm font-semibold px-7 py-3.5 rounded-lg transition-colors cursor-pointer"
              >
                <span>
                  {submitting ? 'Submitting Enquiry...' : 'Submit & Continue on WhatsApp'}
                </span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
