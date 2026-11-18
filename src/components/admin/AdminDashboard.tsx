import { useCallback, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  Briefcase,
  Check,
  FileText,
  FolderKanban,
  Inbox,
  LogOut,
  MessageSquareQuote,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { auth, googleAuthProvider } from '../../lib/firebase.ts';
import type {
  AdminOverviewData,
  AgencyStatItem,
  CaseStudy,
  CaseStudyChartPoint,
  PortfolioProject,
  PricingPackage,
  ServiceItem,
  SiteSettings,
  TeamMember,
  Testimonial,
} from '../../types/cms.ts';
import { MediaFrame } from '../MediaFrame.tsx';
import { AdminMediaUploader } from './AdminMediaUploader.tsx';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onDataUpdated: () => void;
}

type AdminTab =
  | 'overview'
  | 'settings'
  | 'portfolio'
  | 'case-studies'
  | 'team'
  | 'testimonials'
  | 'services-pricing'
  | 'enquiries';

const PORTFOLIO_CATEGORIES = [
  'Meta Ads Campaigns',
  'Lead Generation',
  'Social Media Creatives',
  'Instagram Reels',
  'Brand Promotions',
  'Video Advertising',
];

export function AdminDashboard({
  onExitAdmin,
  onDataUpdated,
}: AdminDashboardProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [token, setToken] = useState<string>('');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchOverview = useCallback(async (idToken: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Access denied');
      }
      setOverview(data);
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to authenticate admin session.'
      );
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
        await fetchOverview(idToken);
      } else {
        setToken('');
        setOverview(null);
      }
    });
    return () => unsub();
  }, [fetchOverview]);

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error ? err.message : 'Google Sign-In was cancelled or failed.'
      );
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setToken('');
    setOverview(null);
  };

  const refreshAll = async () => {
    if (firebaseUser) {
      const freshToken = await firebaseUser.getIdToken();
      setToken(freshToken);
      await fetchOverview(freshToken);
      onDataUpdated();
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const activeToken = firebaseUser ? await firebaseUser.getIdToken() : token;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeToken}`,
        ...(options.headers || {}),
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  };

  // Loading auth state
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F7F7FA] flex items-center justify-center p-6">
        <div className="bg-white border border-black/[0.08] rounded-xl p-8 text-center max-w-sm w-full">
          <p className="text-sm font-medium text-[#111111]">
            Initializing secure admin session...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated or Unauthorized view
  if (!firebaseUser || !overview) {
    return (
      <div className="min-h-screen bg-[#F7F7FA] flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-black/[0.09] rounded-xl p-8 sm:p-10 max-w-md w-full space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold tracking-tight text-[#111111]">
              META FLUX
            </span>
            <ShieldCheck className="w-5 h-5 text-[#7651D9]" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-[#111111] mb-2">
              Admin Dashboard Login
            </h1>
            <p className="text-sm text-[#111111]/65 leading-relaxed">
              Sign in with an authorized Google administrator account to manage agency content, portfolio media, case studies, team profiles, and client enquiries.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3.5 text-xs leading-relaxed">
              {authError}
            </div>
          )}

          {loading ? (
            <div className="py-3 text-center text-xs font-medium text-[#7651D9]">
              Verifying server-side permissions...
            </div>
          ) : !firebaseUser ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-[#7651D9] hover:bg-[#623EC4] text-white text-sm font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Sign in with Google
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#111111]/65">
                Signed in as <span className="font-semibold">{firebaseUser.email}</span>
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full bg-[#111111] text-white text-xs font-semibold py-3 px-4 rounded-lg hover:bg-black/85 transition-colors cursor-pointer"
              >
                Switch Account
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#111111]/70 hover:text-[#111111] pt-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    );
  }

  const navTabs: Array<{ id: AdminTab; label: string; icon: typeof BarChart3 }> = [
    { id: 'overview', label: 'Analytics Overview', icon: BarChart3 },
    { id: 'settings', label: 'Website & Contact', icon: Settings },
    { id: 'portfolio', label: 'Portfolio Projects', icon: FolderKanban },
    { id: 'case-studies', label: 'Case Studies', icon: FileText },
    { id: 'team', label: 'Team Profiles', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'services-pricing', label: 'Services & Pricing', icon: Briefcase },
    { id: 'enquiries', label: `Enquiries (${overview.enquiries.length})`, icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7FA] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-[260px] bg-white border-b lg:border-b-0 lg:border-r border-black/[0.08] shrink-0 flex flex-col justify-between">
        <div>
          <div className="h-16 px-6 border-b border-black/[0.08] flex items-center justify-between">
            <span className="font-display text-base font-bold tracking-tight text-[#111111]">
              META FLUX <span className="text-[#7651D9] font-medium text-xs ml-1">Admin</span>
            </span>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#F3F0FA] text-[#7651D9]'
                      : 'text-[#111111]/70 hover:bg-[#F7F7FA] hover:text-[#111111]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-black/[0.08] space-y-2 hidden lg:block">
          <div className="px-2 py-1">
            <p className="text-[11px] font-medium text-[#111111]/50">Signed in as</p>
            <p className="text-xs font-semibold text-[#111111] truncate">
              {overview.currentUser.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111111]/75 hover:bg-[#F7F7FA] rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-black/[0.08] px-6 flex items-center justify-between gap-4">
          <div className="text-xs text-[#111111]/55">
            <span>Admin</span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-[#111111]">
              {navTabs.find((t) => t.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {toast && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7651D9] bg-[#F3F0FA] px-3 py-1.5 rounded-lg">
                <Check className="w-3.5 h-3.5" />
                {toast}
              </span>
            )}
            <button
              type="button"
              onClick={onExitAdmin}
              className="lg:hidden text-xs font-semibold text-[#7651D9] cursor-pointer"
            >
              Public Site
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-8 max-w-6xl w-full space-y-6">
          {activeTab === 'overview' && (
            <OverviewPanel overview={overview} onNavigateTab={setActiveTab} />
          )}
          {activeTab === 'settings' && (
            <SettingsEditor
              settings={overview.settings}
              authFetch={authFetch}
              onSaved={() => {
                refreshAll();
                showToast('Website & contact settings saved.');
              }}
            />
          )}
          {activeTab === 'portfolio' && (
            <PortfolioManager
              projects={overview.portfolio}
              token={token}
              authFetch={authFetch}
              onChanged={(msg) => {
                refreshAll();
                showToast(msg);
              }}
            />
          )}
          {activeTab === 'case-studies' && (
            <CaseStudiesManager
              caseStudies={overview.caseStudies}
              authFetch={authFetch}
              onChanged={(msg) => {
                refreshAll();
                showToast(msg);
              }}
            />
          )}
          {activeTab === 'team' && (
            <TeamManager
              team={overview.team}
              token={token}
              authFetch={authFetch}
              onChanged={(msg) => {
                refreshAll();
                showToast(msg);
              }}
            />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsManager
              testimonials={overview.testimonials}
              token={token}
              authFetch={authFetch}
              onChanged={(msg) => {
                refreshAll();
                showToast(msg);
              }}
            />
          )}
          {activeTab === 'services-pricing' && (
            <ServicesPricingManager
              services={overview.services}
              pricing={overview.pricing}
              authFetch={authFetch}
              onChanged={(msg) => {
                refreshAll();
                showToast(msg);
              }}
            />
          )}
          {activeTab === 'enquiries' && (
            <EnquiriesManager
              enquiries={overview.enquiries}
              authFetch={authFetch}
              onChanged={(msg) => {
                refreshAll();
                showToast(msg);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// 1. Overview Panel
function OverviewPanel({
  overview,
  onNavigateTab,
}: {
  overview: AdminOverviewData;
  onNavigateTab: (tab: AdminTab) => void;
}) {
  const newEnquiries = overview.enquiries.filter((e) => e.status === 'new').length;
  const contactedEnquiries = overview.enquiries.filter(
    (e) => e.status === 'contacted' || e.status === 'qualified'
  ).length;

  const cards = [
    { label: 'Total Enquiries', value: overview.enquiries.length, tab: 'enquiries' as AdminTab },
    { label: 'New Enquiries', value: newEnquiries, tab: 'enquiries' as AdminTab },
    { label: 'Active Pipeline', value: contactedEnquiries, tab: 'enquiries' as AdminTab },
    { label: 'Portfolio Items', value: overview.portfolio.length, tab: 'portfolio' as AdminTab },
    { label: 'Case Studies', value: overview.caseStudies.length, tab: 'case-studies' as AdminTab },
    { label: 'Team Profiles', value: overview.team.length, tab: 'team' as AdminTab },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => onNavigateTab(c.tab)}
            className="bg-white border border-black/[0.08] hover:border-[#7651D9]/45 rounded-xl p-5 text-left transition-colors cursor-pointer"
          >
            <p className="text-xs text-[#111111]/55 mb-2">{c.label}</p>
            <p className="font-display text-2xl font-bold text-[#111111] tabular-nums">
              {c.value}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.08] flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#111111]">
            Recent Client Enquiries
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('enquiries')}
            className="text-xs font-semibold text-[#7651D9] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {overview.enquiries.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#111111]/55">
            No enquiries submitted yet. Submissions from the Contact form appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.07] text-[11px] font-semibold text-[#111111]/55 bg-[#F7F7FA]">
                  <th className="py-3 px-5">Client</th>
                  <th className="py-3 px-5">Business</th>
                  <th className="py-3 px-5">Service</th>
                  <th className="py-3 px-5">Monthly Budget</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] text-xs">
                {overview.enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F7F7FA]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#111111]">
                      {enq.fullName}
                    </td>
                    <td className="py-3.5 px-5 text-[#111111]/75">{enq.businessName}</td>
                    <td className="py-3.5 px-5 text-[#111111]/75">{enq.requiredService}</td>
                    <td className="py-3.5 px-5 font-mono text-[#111111]/75 tabular-nums">
                      {enq.monthlyBudget}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#7651D9] capitalize">
                      {enq.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Website & Contact Settings Editor
function SettingsEditor({
  settings,
  authFetch,
  onSaved,
}: {
  settings: SiteSettings;
  authFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateStat = (idx: number, patch: Partial<AgencyStatItem>) => {
    const next = [...(form.statsJson || [])];
    next[idx] = { ...next[idx], ...patch };
    setForm({ ...form, statsJson: next });
  };

  const addStat = () => {
    setForm({
      ...form,
      statsJson: [
        ...(form.statsJson || []),
        {
          id: `stat-${Date.now()}`,
          label: 'New Metric',
          value: '100%',
          note: 'Description',
          isSample: false,
        },
      ],
    });
  };

  const removeStat = (idx: number) => {
    setForm({
      ...form,
      statsJson: (form.statsJson || []).filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white border border-black/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-[#111111]">
          Brand &amp; Copywriting
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Agency Name" value={form.agencyName} onChange={(v) => setForm({ ...form, agencyName: v })} />
          <Field label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
          <Field label="Hero Small Heading" value={form.heroEyebrow} onChange={(v) => setForm({ ...form, heroEyebrow: v })} />
          <Field label="Hero Headline" value={form.heroHeadline} onChange={(v) => setForm({ ...form, heroHeadline: v })} />
        </div>

        <TextAreaField
          label="Hero Supporting Text"
          value={form.heroSubheadline}
          onChange={(v) => setForm({ ...form, heroSubheadline: v })}
        />

        <Field
          label="About Section Headline"
          value={form.aboutHeadline}
          onChange={(v) => setForm({ ...form, aboutHeadline: v })}
        />

        <TextAreaField
          label="About Section Description"
          value={form.aboutDescription}
          onChange={(v) => setForm({ ...form, aboutDescription: v })}
        />
      </div>

      <div className="bg-white border border-black/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-[#111111]">
          Agency Contact &amp; WhatsApp Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="WhatsApp Number (digits only, e.g. 917879733808)"
            value={form.whatsappNumber}
            onChange={(v) => setForm({ ...form, whatsappNumber: v })}
          />
          <Field
            label="Display WhatsApp Number"
            value={form.displayWhatsapp}
            onChange={(v) => setForm({ ...form, displayWhatsapp: v })}
          />
          <Field
            label="Contact Email"
            value={form.contactEmail}
            onChange={(v) => setForm({ ...form, contactEmail: v })}
          />
          <Field
            label="Location / Coverage"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
          />
          <Field
            label="Instagram URL"
            value={form.instagramUrl}
            onChange={(v) => setForm({ ...form, instagramUrl: v })}
          />
          <Field
            label="LinkedIn URL"
            value={form.linkedinUrl}
            onChange={(v) => setForm({ ...form, linkedinUrl: v })}
          />
        </div>
      </div>

      <div className="bg-white border border-black/[0.08] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[#111111]">
            Editable Agency Statistics
          </h2>
          <button
            type="button"
            onClick={addStat}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7651D9] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Statistic
          </button>
        </div>

        <div className="space-y-3">
          {(form.statsJson || []).map((stat, idx) => (
            <div
              key={stat.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-[#F7F7FA] rounded-lg items-center"
            >
              <div className="md:col-span-3">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(idx, { label: e.target.value })}
                  placeholder="Label"
                  className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(idx, { value: e.target.value })}
                  placeholder="Value"
                  className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg"
                />
              </div>
              <div className="md:col-span-4">
                <input
                  type="text"
                  value={stat.note}
                  onChange={(e) => updateStat(idx, { note: e.target.value })}
                  placeholder="Note"
                  className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={Boolean(stat.isSample)}
                  onChange={(e) => updateStat(idx, { isSample: e.target.checked })}
                />
                <span>Sample</span>
              </div>
              <div className="md:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeStat(idx)}
                  aria-label="Remove stat"
                  className="text-red-600 hover:text-red-700 p-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold px-6 py-3 rounded-lg cursor-pointer"
      >
        {saving ? 'Saving Changes...' : 'Save Website & Contact Settings'}
      </button>
    </form>
  );
}

// 3. Portfolio Manager
function PortfolioManager({
  projects,
  token,
  authFetch,
  onChanged,
}: {
  projects: PortfolioProject[];
  token: string;
  authFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
  onChanged: (msg: string) => void;
}) {
  const emptyForm = {
    id: null as number | null,
    title: '',
    industry: '',
    category: PORTFOLIO_CATEGORIES[0],
    description: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    objective: '',
    deliverables: '',
    isSample: false,
    sortOrder: projects.length + 1,
  };

  const [editing, setEditing] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await authFetch(`/api/admin/portfolio/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
        onChanged('Portfolio project updated.');
      } else {
        await authFetch('/api/admin/portfolio', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
        onChanged('Portfolio project added.');
      }
      setEditing(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await authFetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    onChanged('Portfolio project removed.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSave}
        className="lg:col-span-5 bg-white border border-black/[0.08] rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#111111]">
            {editing.id ? 'Edit Project' : 'Add Portfolio Project'}
          </h2>
          {editing.id && (
            <button
              type="button"
              onClick={() => setEditing(emptyForm)}
              className="text-xs text-[#7651D9] cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <Field label="Project Name *" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
        <Field label="Industry *" value={editing.industry} onChange={(v) => setEditing({ ...editing, industry: v })} required />

        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            Campaign Category *
          </label>
          <select
            value={editing.category}
            onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg"
          >
            {PORTFOLIO_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <TextAreaField
          label="Description *"
          value={editing.description}
          onChange={(v) => setEditing({ ...editing, description: v })}
          required
        />

        <Field
          label="Campaign Objective"
          value={editing.objective}
          onChange={(v) => setEditing({ ...editing, objective: v })}
        />

        <Field
          label="Deliverables"
          value={editing.deliverables}
          onChange={(v) => setEditing({ ...editing, deliverables: v })}
        />

        <div className="pt-2 space-y-2">
          <label className="block text-xs font-semibold text-[#111111]">
            Project Image or Video
          </label>
          <AdminMediaUploader
            token={token}
            onUploaded={({ url, mediaType }) =>
              setEditing({ ...editing, mediaUrl: url, mediaType })
            }
          />
          <Field
            label="Or paste Media URL"
            value={editing.mediaUrl}
            onChange={(v) => setEditing({ ...editing, mediaUrl: v })}
          />
          <select
            value={editing.mediaType}
            onChange={(e) =>
              setEditing({
                ...editing,
                mediaType: e.target.value === 'video' ? 'video' : 'image',
              })
            }
            className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs text-[#111111]">
          <input
            type="checkbox"
            checked={editing.isSample}
            onChange={(e) => setEditing({ ...editing, isSample: e.target.checked })}
          />
          <span>Mark as Sample / Demo Content</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold py-3 rounded-lg cursor-pointer"
        >
          {saving ? 'Saving...' : editing.id ? 'Update Project' : 'Publish Project'}
        </button>
      </form>

      <div className="lg:col-span-7 space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-black/[0.08] rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-24 h-18 rounded-lg overflow-hidden bg-[#F7F7FA] shrink-0">
              <MediaFrame
                src={p.mediaUrl}
                mediaType={p.mediaType}
                alt={p.title}
                fallbackLabel={p.title}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#7651D9]">
                {p.category} · {p.industry} {p.isSample ? '· Sample' : ''}
              </p>
              <p className="text-sm font-semibold text-[#111111] truncate">{p.title}</p>
              <p className="text-xs text-[#111111]/60 line-clamp-1">{p.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    id: p.id,
                    title: p.title,
                    industry: p.industry,
                    category: p.category,
                    description: p.description,
                    mediaUrl: p.mediaUrl,
                    mediaType: p.mediaType === 'video' ? 'video' : 'image',
                    objective: p.objective,
                    deliverables: p.deliverables,
                    isSample: p.isSample,
                    sortOrder: p.sortOrder,
                  })
                }
                className="px-3 py-1.5 text-xs font-semibold border border-black/15 rounded-lg hover:bg-[#F7F7FA] cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                aria-label="Delete project"
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Case Studies Manager
function CaseStudiesManager({
  caseStudies,
  authFetch,
  onChanged,
}: {
  caseStudies: CaseStudy[];
  authFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
  onChanged: (msg: string) => void;
}) {
  const defaultPoints: CaseStudyChartPoint[] = [
    { period: 'Month 1', leads: 120, cpl: 250, spend: 30000 },
    { period: 'Month 2', leads: 180, cpl: 200, spend: 36000 },
  ];

  const emptyForm = {
    id: null as number | null,
    clientName: '',
    industry: '',
    campaignObjective: '',
    marketingStrategy: '',
    campaignDuration: '',
    adBudget: '',
    leadsGenerated: '',
    costPerLead: '',
    resultsInsights: '',
    chartDataJson: defaultPoints,
    isSample: true,
    sortOrder: caseStudies.length + 1,
  };

  const [editing, setEditing] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await authFetch(`/api/admin/case-studies/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
        onChanged('Case study updated.');
      } else {
        await authFetch('/api/admin/case-studies', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
        onChanged('Case study created.');
      }
      setEditing(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  const updatePoint = (idx: number, patch: Partial<CaseStudyChartPoint>) => {
    const next = [...editing.chartDataJson];
    next[idx] = { ...next[idx], ...patch };
    setEditing({ ...editing, chartDataJson: next });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSave}
        className="lg:col-span-6 bg-white border border-black/[0.08] rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#111111]">
            {editing.id ? 'Edit Case Study' : 'Add Case Study'}
          </h2>
          {editing.id && (
            <button
              type="button"
              onClick={() => setEditing(emptyForm)}
              className="text-xs text-[#7651D9] cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Client Name *" value={editing.clientName} onChange={(v) => setEditing({ ...editing, clientName: v })} required />
          <Field label="Business Industry *" value={editing.industry} onChange={(v) => setEditing({ ...editing, industry: v })} required />
          <Field label="Campaign Duration *" value={editing.campaignDuration} onChange={(v) => setEditing({ ...editing, campaignDuration: v })} required />
          <Field label="Ad Budget *" value={editing.adBudget} onChange={(v) => setEditing({ ...editing, adBudget: v })} required />
          <Field label="Leads Generated *" value={editing.leadsGenerated} onChange={(v) => setEditing({ ...editing, leadsGenerated: v })} required />
          <Field label="Cost Per Lead *" value={editing.costPerLead} onChange={(v) => setEditing({ ...editing, costPerLead: v })} required />
        </div>

        <TextAreaField
          label="Campaign Objective *"
          value={editing.campaignObjective}
          onChange={(v) => setEditing({ ...editing, campaignObjective: v })}
          required
        />
        <TextAreaField
          label="Marketing Strategy *"
          value={editing.marketingStrategy}
          onChange={(v) => setEditing({ ...editing, marketingStrategy: v })}
          required
        />
        <TextAreaField
          label="Results and Insights *"
          value={editing.resultsInsights}
          onChange={(v) => setEditing({ ...editing, resultsInsights: v })}
          required
        />

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111111]">
              Chart Period Intervals
            </span>
            <button
              type="button"
              onClick={() =>
                setEditing({
                  ...editing,
                  chartDataJson: [
                    ...editing.chartDataJson,
                    { period: 'Next', leads: 100, cpl: 200, spend: 20000 },
                  ],
                })
              }
              className="text-xs font-semibold text-[#7651D9] cursor-pointer"
            >
              + Add Interval
            </button>
          </div>
          {editing.chartDataJson.map((pt, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2">
              <input
                type="text"
                value={pt.period}
                onChange={(e) => updatePoint(idx, { period: e.target.value })}
                placeholder="Period"
                className="px-2.5 py-1.5 text-xs border border-black/15 rounded-lg"
              />
              <input
                type="number"
                value={pt.leads}
                onChange={(e) => updatePoint(idx, { leads: Number(e.target.value) })}
                placeholder="Leads"
                className="px-2.5 py-1.5 text-xs border border-black/15 rounded-lg"
              />
              <input
                type="number"
                value={pt.cpl}
                onChange={(e) => updatePoint(idx, { cpl: Number(e.target.value) })}
                placeholder="CPL"
                className="px-2.5 py-1.5 text-xs border border-black/15 rounded-lg"
              />
              <input
                type="number"
                value={pt.spend}
                onChange={(e) => updatePoint(idx, { spend: Number(e.target.value) })}
                placeholder="Spend"
                className="px-2.5 py-1.5 text-xs border border-black/15 rounded-lg"
              />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-[#111111]">
          <input
            type="checkbox"
            checked={editing.isSample}
            onChange={(e) => setEditing({ ...editing, isSample: e.target.checked })}
          />
          <span>Mark as Sample Demo Case Study</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold py-3 rounded-lg cursor-pointer"
        >
          {saving ? 'Saving...' : editing.id ? 'Update Case Study' : 'Save Case Study'}
        </button>
      </form>

      <div className="lg:col-span-6 space-y-3">
        {caseStudies.map((cs) => (
          <div
            key={cs.id}
            className="bg-white border border-black/[0.08] rounded-xl p-5 space-y-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-[#7651D9]">
                  {cs.industry} · {cs.campaignDuration} {cs.isSample ? '· Sample' : ''}
                </p>
                <h3 className="text-sm font-semibold text-[#111111]">{cs.clientName}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      id: cs.id,
                      clientName: cs.clientName,
                      industry: cs.industry,
                      campaignObjective: cs.campaignObjective,
                      marketingStrategy: cs.marketingStrategy,
                      campaignDuration: cs.campaignDuration,
                      adBudget: cs.adBudget,
                      leadsGenerated: cs.leadsGenerated,
                      costPerLead: cs.costPerLead,
                      resultsInsights: cs.resultsInsights,
                      chartDataJson: cs.chartDataJson || [],
                      isSample: cs.isSample,
                      sortOrder: cs.sortOrder,
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold border border-black/15 rounded-lg cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await authFetch(`/api/admin/case-studies/${cs.id}`, {
                      method: 'DELETE',
                    });
                    onChanged('Case study deleted.');
                  }}
                  aria-label="Delete case study"
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-[#111111]/65">
              Budget: {cs.adBudget} · Leads: {cs.leadsGenerated} · CPL: {cs.costPerLead}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Team Manager (with Reorder)
function TeamManager({
  team,
  token,
  authFetch,
  onChanged,
}: {
  team: TeamMember[];
  token: string;
  authFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
  onChanged: (msg: string) => void;
}) {
  const emptyForm = {
    id: null as number | null,
    name: '',
    designation: '',
    bio: '',
    skills: '',
    photoUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    isSample: false,
    sortOrder: team.length + 1,
  };

  const [editing, setEditing] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await authFetch(`/api/admin/team/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
        onChanged('Team profile updated.');
      } else {
        await authFetch('/api/admin/team', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
        onChanged('Team profile added.');
      }
      setEditing(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  const moveMember = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= team.length) return;
    const reordered = [...team];
    const [item] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, item);
    await authFetch('/api/admin/team-reorder', {
      method: 'PUT',
      body: JSON.stringify({ orderedIds: reordered.map((m) => m.id) }),
    });
    onChanged('Team order updated.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSave}
        className="lg:col-span-5 bg-white border border-black/[0.08] rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#111111]">
            {editing.id ? 'Edit Team Profile' : 'Add Team Member'}
          </h2>
          {editing.id && (
            <button
              type="button"
              onClick={() => setEditing(emptyForm)}
              className="text-xs text-[#7651D9] cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        <Field label="Full Name *" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required />
        <Field label="Designation *" value={editing.designation} onChange={(v) => setEditing({ ...editing, designation: v })} required />
        <TextAreaField label="Biography *" value={editing.bio} onChange={(v) => setEditing({ ...editing, bio: v })} required />
        <Field label="Skills (separated by ·)" value={editing.skills} onChange={(v) => setEditing({ ...editing, skills: v })} />
        <Field label="LinkedIn URL" value={editing.linkedinUrl} onChange={(v) => setEditing({ ...editing, linkedinUrl: v })} />
        <Field label="Instagram URL" value={editing.instagramUrl} onChange={(v) => setEditing({ ...editing, instagramUrl: v })} />

        <div className="space-y-2">
          <AdminMediaUploader
            token={token}
            accept="image/*"
            label="Upload Profile Photo"
            onUploaded={({ url }) => setEditing({ ...editing, photoUrl: url })}
          />
          <Field label="Photo URL" value={editing.photoUrl} onChange={(v) => setEditing({ ...editing, photoUrl: v })} />
        </div>

        <label className="flex items-center gap-2 text-xs text-[#111111]">
          <input
            type="checkbox"
            checked={editing.isSample}
            onChange={(e) => setEditing({ ...editing, isSample: e.target.checked })}
          />
          <span>Mark as Demo Profile</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold py-3 rounded-lg cursor-pointer"
        >
          {saving ? 'Saving...' : editing.id ? 'Update Profile' : 'Add Team Member'}
        </button>
      </form>

      <div className="lg:col-span-7 space-y-3">
        {team.map((m, idx) => (
          <div
            key={m.id}
            className="bg-white border border-black/[0.08] rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
              <MediaFrame
                src={m.photoUrl}
                alt={m.name}
                fallbackLabel={m.name}
                variant="portrait"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#7651D9]">
                {m.designation} {m.isSample ? '· Demo' : ''}
              </p>
              <p className="text-sm font-semibold text-[#111111]">{m.name}</p>
              <p className="text-xs text-[#111111]/60 truncate">{m.skills}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveMember(idx, -1)}
                aria-label="Move up"
                className="p-1.5 rounded border border-black/10 disabled:opacity-30 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === team.length - 1}
                onClick={() => moveMember(idx, 1)}
                aria-label="Move down"
                className="p-1.5 rounded border border-black/10 disabled:opacity-30 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    id: m.id,
                    name: m.name,
                    designation: m.designation,
                    bio: m.bio,
                    skills: m.skills,
                    photoUrl: m.photoUrl,
                    linkedinUrl: m.linkedinUrl,
                    instagramUrl: m.instagramUrl,
                    isSample: m.isSample,
                    sortOrder: m.sortOrder,
                  })
                }
                className="px-2.5 py-1.5 text-xs font-semibold border border-black/15 rounded-lg ml-1 cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={async () => {
                  await authFetch(`/api/admin/team/${m.id}`, { method: 'DELETE' });
                  onChanged('Team member removed.');
                }}
                aria-label="Delete team member"
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Testimonials Manager
function TestimonialsManager({
  testimonials,
  token,
  authFetch,
  onChanged,
}: {
  testimonials: Testimonial[];
  token: string;
  authFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
  onChanged: (msg: string) => void;
}) {
  const emptyForm = {
    id: null as number | null,
    clientName: '',
    businessName: '',
    clientRole: 'Founder',
    photoUrl: '',
    review: '',
    rating: 5,
    isSample: false,
    sortOrder: testimonials.length + 1,
  };

  const [editing, setEditing] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await authFetch(`/api/admin/testimonials/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
        onChanged('Testimonial updated.');
      } else {
        await authFetch('/api/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
        onChanged('Testimonial added.');
      }
      setEditing(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form
        onSubmit={handleSave}
        className="lg:col-span-5 bg-white border border-black/[0.08] rounded-xl p-6 space-y-4"
      >
        <h2 className="font-display text-base font-semibold text-[#111111]">
          {editing.id ? 'Edit Testimonial' : 'Add Client Testimonial'}
        </h2>
        <Field label="Client Name *" value={editing.clientName} onChange={(v) => setEditing({ ...editing, clientName: v })} required />
        <Field label="Business Name *" value={editing.businessName} onChange={(v) => setEditing({ ...editing, businessName: v })} required />
        <Field label="Role / Title" value={editing.clientRole} onChange={(v) => setEditing({ ...editing, clientRole: v })} />
        <TextAreaField label="Review *" value={editing.review} onChange={(v) => setEditing({ ...editing, review: v })} required />

        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            Rating
          </label>
          <select
            value={editing.rating}
            onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
            className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>
        </div>

        <AdminMediaUploader
          token={token}
          accept="image/*"
          label="Upload Client Photo"
          onUploaded={({ url }) => setEditing({ ...editing, photoUrl: url })}
        />

        <label className="flex items-center gap-2 text-xs text-[#111111]">
          <input
            type="checkbox"
            checked={editing.isSample}
            onChange={(e) => setEditing({ ...editing, isSample: e.target.checked })}
          />
          <span>Mark as Sample Placeholder</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#7651D9] hover:bg-[#623EC4] text-white text-xs font-semibold py-3 rounded-lg cursor-pointer"
        >
          {saving ? 'Saving...' : editing.id ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </form>

      <div className="lg:col-span-7 space-y-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-black/[0.08] rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#7651D9]">
                {t.clientName} · {t.businessName} ({t.rating}★) {t.isSample ? '· Sample' : ''}
              </p>
              <p className="text-xs text-[#111111]/75 leading-relaxed">{t.review}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    id: t.id,
                    clientName: t.clientName,
                    businessName: t.businessName,
                    clientRole: t.clientRole,
                    photoUrl: t.photoUrl,
                    review: t.review,
                    rating: t.rating,
                    isSample: t.isSample,
                    sortOrder: t.sortOrder,
                  })
                }
                className="px-3 py-1.5 text-xs font-semibold border border-black/15 rounded-lg cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={async () => {
                  await authFetch(`/api/admin/testimonials/${t.id}`, {
                    method: 'DELETE',
                  });
                  onChanged('Testimonial removed.');
                }}
                aria-label="Delete testimonial"
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Services & Pricing Manager
function ServicesPricingManager({
  services,
  pricing,
  authFetch,
  onChanged,
}: {
  services: ServiceItem[];
  pricing: PricingPackage[];
  authFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
  onChanged: (msg: string) => void;
}) {
  const [pkgForms, setPkgForms] = useState<PricingPackage[]>(pricing);

  useEffect(() => {
    setPkgForms(pricing);
  }, [pricing]);

  const updatePackage = async (pkg: PricingPackage) => {
    await authFetch(`/api/admin/pricing/${pkg.id}`, {
      method: 'PUT',
      body: JSON.stringify(pkg),
    });
    onChanged(`${pkg.name} package updated.`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-black/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-[#111111]">
          Pricing Packages (STARTER / GROWTH / PREMIUM)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {pkgForms.map((pkg, idx) => (
            <div
              key={pkg.id}
              className="border border-black/[0.08] rounded-xl p-5 space-y-3 bg-[#F7F7FA]/50"
            >
              <Field
                label="Package Name"
                value={pkg.name}
                onChange={(v) => {
                  const next = [...pkgForms];
                  next[idx] = { ...next[idx], name: v };
                  setPkgForms(next);
                }}
              />
              <Field
                label="Target Audience"
                value={pkg.targetAudience}
                onChange={(v) => {
                  const next = [...pkgForms];
                  next[idx] = { ...next[idx], targetAudience: v };
                  setPkgForms(next);
                }}
              />
              <TextAreaField
                label="Features (one per line)"
                value={(pkg.featuresJson || []).join('\n')}
                onChange={(v) => {
                  const next = [...pkgForms];
                  next[idx] = {
                    ...next[idx],
                    featuresJson: v.split('\n').filter((line) => line.trim()),
                  };
                  setPkgForms(next);
                }}
              />
              <Field
                label="Ad Budget Note"
                value={pkg.note}
                onChange={(v) => {
                  const next = [...pkgForms];
                  next[idx] = { ...next[idx], note: v };
                  setPkgForms(next);
                }}
              />
              <button
                type="button"
                onClick={() => updatePackage(pkg)}
                className="w-full bg-[#111111] hover:bg-[#7651D9] text-white text-xs font-semibold py-2.5 rounded-lg cursor-pointer transition-colors"
              >
                Save {pkg.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-black/[0.08] rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-[#111111]">
          Services Directory ({services.length})
        </h2>
        <div className="divide-y divide-black/[0.07]">
          {services.map((srv) => (
            <ServiceRow
              key={srv.id}
              service={srv}
              onSave={async (updated) => {
                await authFetch(`/api/admin/services/${srv.id}`, {
                  method: 'PUT',
                  body: JSON.stringify(updated),
                });
                onChanged(`Updated "${updated.title}".`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceRow({
  service,
  onSave,
}: {
  service: ServiceItem;
  onSave: (s: ServiceItem) => Promise<void>;
}) {
  const [form, setForm] = useState(service);
  return (
    <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
      <div className="md:col-span-3">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 text-xs font-semibold border border-black/15 rounded-lg"
        />
      </div>
      <div className="md:col-span-5">
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 text-xs border border-black/15 rounded-lg"
        />
      </div>
      <div className="md:col-span-2 flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        <span>Visible</span>
      </div>
      <div className="md:col-span-2 text-right">
        <button
          type="button"
          onClick={() => onSave(form)}
          className="px-3.5 py-2 bg-[#7651D9] text-white text-xs font-semibold rounded-lg cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// 8. Enquiries Manager
function EnquiriesManager({
  enquiries,
  authFetch,
  onChanged,
}: {
  enquiries: AdminOverviewData['enquiries'];
  authFetch: (url: string, opts?: RequestInit) => Promise<unknown>;
  onChanged: (msg: string) => void;
}) {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'new', 'contacted', 'qualified', 'archived'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer ${
              filter === st
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-black/10 text-[#111111]/70'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-black/[0.08] rounded-xl p-10 text-center text-sm text-[#111111]/55">
          No enquiries match this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((enq) => (
            <div
              key={enq.id}
              className="bg-white border border-black/[0.08] rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#7651D9]">
                    {enq.requiredService} · {enq.monthlyBudget}
                  </p>
                  <h3 className="text-base font-semibold text-[#111111]">
                    {enq.fullName} — {enq.businessName} ({enq.industry})
                  </h3>
                  <p className="text-xs text-[#111111]/60 mt-0.5">
                    {enq.email} · {enq.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={async (e) => {
                      await authFetch(`/api/admin/enquiries/${enq.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ status: e.target.value }),
                      });
                      onChanged('Enquiry status updated.');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#F7F7FA] border border-black/15 rounded-lg"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="archived">Archived</option>
                  </select>

                  <a
                    href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi ${enq.fullName}, thank you for contacting META FLUX regarding ${enq.requiredService}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#7651D9] text-white text-xs font-semibold rounded-lg"
                  >
                    WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={async () => {
                      await authFetch(`/api/admin/enquiries/${enq.id}`, {
                        method: 'DELETE',
                      });
                      onChanged('Enquiry deleted.');
                    }}
                    aria-label="Delete enquiry"
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#111111]/75 bg-[#F7F7FA] rounded-lg p-3.5 leading-relaxed">
                {enq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
        {label}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9]"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
        {label}
      </label>
      <textarea
        rows={3}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:border-[#7651D9] resize-y"
      />
    </div>
  );
}
