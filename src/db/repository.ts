import { asc, desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  caseStudies,
  enquiries,
  portfolioProjects,
  pricingPackages,
  services,
  siteSettings,
  teamMembers,
  testimonials,
  users,
} from './schema.ts';
import type { AgencyStatItem, CaseStudyChartPoint } from './schema.ts';

const OWNER_ADMIN_EMAIL = 'niteshsharma25201@gmail.com';

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runInitialSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function runInitialSeed(): Promise<void> {
  try {
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      const defaultStats: AgencyStatItem[] = [
        {
          id: 'stat-1',
          label: 'Core Channel Focus',
          value: 'Meta & IG',
          note: 'Full-funnel paid social systems',
          isSample: false,
        },
        {
          id: 'stat-2',
          label: 'Creative Iteration',
          value: 'Weekly',
          note: 'Structured hook, format & copy testing',
          isSample: false,
        },
        {
          id: 'stat-3',
          label: 'Account Ownership',
          value: '100%',
          note: 'Transparent ad account & data access',
          isSample: false,
        },
        {
          id: 'stat-4',
          label: 'Sample Target ROAS',
          value: '3.2x',
          note: 'Editable demo benchmark in Admin',
          isSample: true,
        },
      ];

      await db.insert(siteSettings).values({
        agencyName: 'META FLUX',
        tagline: 'We Turn Attention Into Growth.',
        heroEyebrow: 'DIGITAL GROWTH PARTNER',
        heroHeadline: 'We Turn Attention Into Growth.',
        heroSubheadline:
          'We help ambitious businesses grow with powerful Meta Ads, creative social media strategies and performance-driven digital marketing.',
        aboutHeadline: 'Marketing That Moves Businesses Forward.',
        aboutDescription:
          'META FLUX partners with ambitious businesses to elevate online visibility, capture qualified customer demand, and build repeatable acquisition systems across Meta Ads, creative storytelling, and conversion funnels.',
        whatsappNumber: '917879733808',
        displayWhatsapp: '+91 7879733808',
        contactEmail: 'hello@metaflux.agency',
        location: 'Mumbai · Serving Brands Globally',
        instagramUrl: 'https://instagram.com',
        linkedinUrl: 'https://linkedin.com',
        statsJson: defaultStats,
      });
    }

    const existingServices = await db.select().from(services).limit(1);
    if (existingServices.length === 0) {
      await db.insert(services).values([
        {
          title: 'Meta Ads Management',
          description:
            'Full-funnel campaign architecture, audience structuring, pixel/CAPI tracking, and continuous budget allocation across Meta.',
          iconName: 'Target',
          deliverables: 'Campaign Architecture · Pixel & CAPI Setup · Weekly Scaling',
          sortOrder: 1,
          isActive: true,
        },
        {
          title: 'Facebook & Instagram Advertising',
          description:
            'High-intent paid social placements engineered to capture attention in feeds, stories, and reels with clear acquisition targets.',
          iconName: 'Megaphone',
          deliverables: 'Feed & Story Ads · Retargeting Funnels · Lookalike Testing',
          sortOrder: 2,
          isActive: true,
        },
        {
          title: 'WhatsApp Lead Generation',
          description:
            'Click-to-WhatsApp ad workflows designed to turn scrollers into instant, qualified sales conversations for service businesses.',
          iconName: 'MessageCircle',
          deliverables: 'Click-to-WhatsApp Ads · Lead Qualification · Fast Follow-Up',
          sortOrder: 3,
          isActive: true,
        },
        {
          title: 'Social Media Management',
          description:
            'Cohesive editorial calendars, brand positioning, and daily community presence that builds compounding trust.',
          iconName: 'Calendar',
          deliverables: 'Content Calendar · Brand Voice · Community Engagement',
          sortOrder: 4,
          isActive: true,
        },
        {
          title: 'Instagram Reels & Video Editing',
          description:
            'Short-form vertical video pacing, hook engineering, motion typography, and retention-focused edits built for discovery.',
          iconName: 'Film',
          deliverables: 'Hook Scripting · Dynamic Cuts · Subtitles & Sound Design',
          sortOrder: 5,
          isActive: true,
        },
        {
          title: 'Creative Ad Designing',
          description:
            'Static and carousel ad systems built around clear value propositions, visual hierarchy, and scroll-stopping clarity.',
          iconName: 'Palette',
          deliverables: 'Static Ad Suites · Carousel Stories · A/B Visual Variants',
          sortOrder: 6,
          isActive: true,
        },
        {
          title: 'Brand Awareness Campaigns',
          description:
            'Top-of-funnel reach and recall campaigns that introduce your brand to new market segments with disciplined frequency.',
          iconName: 'Compass',
          deliverables: 'Reach Strategy · Audience Expansion · Brand Recall Lift',
          sortOrder: 7,
          isActive: true,
        },
        {
          title: 'Campaign Optimization',
          description:
            'Granular creative fatigue monitoring, bid tuning, and funnel diagnostics to protect efficiency as spend scales.',
          iconName: 'SlidersHorizontal',
          deliverables: 'CPA Diagnostics · Creative Refresh · Budget Reallocation',
          sortOrder: 8,
          isActive: true,
        },
        {
          title: 'Digital Marketing Strategy',
          description:
            'End-to-end growth roadmaps aligning offer positioning, media mix, creative testing, and lead conversion.',
          iconName: 'TrendingUp',
          deliverables: '90-Day Roadmap · Funnel Audit · KPI Benchmarking',
          sortOrder: 9,
          isActive: true,
        },
      ]);
    }

    const existingPortfolio = await db.select().from(portfolioProjects).limit(1);
    if (existingPortfolio.length === 0) {
      await db.insert(portfolioProjects).values([
        {
          title: 'Aura Botanicals — Launch Ad Suite',
          industry: 'Luxury Skincare',
          category: 'Meta Ads Campaigns',
          description:
            'Sample campaign showcase featuring minimalist product creative, benefit-led carousel ads, and dynamic retargeting sequences.',
          mediaUrl: '/src/assets/images/portfolio_skincare_ad_1794978983811.jpg',
          mediaType: 'image',
          objective: 'Scale product trial orders while keeping customer acquisition costs predictable.',
          deliverables: '12 Static Ad Variants · 3 Funnel Stages · Landing Page Alignment',
          isSample: true,
          sortOrder: 1,
        },
        {
          title: 'Kinetix Studio — Motion Reels Series',
          industry: 'Athleisure & Apparel',
          category: 'Instagram Reels',
          description:
            'Sample short-form vertical creative suite designed for high 3-second hook retention and direct collection discovery.',
          mediaUrl: '/src/assets/images/portfolio_streetwear_reel_1794978984606.jpg',
          mediaType: 'image',
          objective: 'Increase qualified profile visits and organic-to-paid remarketing pools.',
          deliverables: '8 Edited Reels · Hook Variations · Sound-Synced Cuts',
          isSample: true,
          sortOrder: 2,
        },
        {
          title: 'Veloce Card — Digital Launch Campaign',
          industry: 'Modern Fintech',
          category: 'Brand Promotions',
          description:
            'Sample high-contrast brand promotion creative engineered for waitlist sign-ups and premium product positioning.',
          mediaUrl: '/src/assets/images/portfolio_fintech_launch_1794978982588.jpg',
          mediaType: 'image',
          objective: 'Drive early-access waitlist registrations across Tier-1 metro audiences.',
          deliverables: 'Brand Film Stills · Waitlist Funnel · Audience Segmentation',
          isSample: true,
          sortOrder: 3,
        },
        {
          title: 'Monolith Atelier — Consultation Funnel',
          industry: 'Architecture & Interiors',
          category: 'Lead Generation',
          description:
            'Sample Click-to-WhatsApp lead generation system pairing editorial studio photography with pre-qualification prompts.',
          mediaUrl: '/src/assets/images/hero_agency_studio_1794978983050.jpg',
          mediaType: 'image',
          objective: 'Generate qualified architectural design consultation enquiries directly on WhatsApp.',
          deliverables: 'WhatsApp Ad Flow · Lead Form Filtering · Weekly Cost Audit',
          isSample: true,
          sortOrder: 4,
        },
        {
          title: 'Maison Nord — Editorial Social System',
          industry: 'Lifestyle & Retail',
          category: 'Social Media Creatives',
          description:
            'Sample cohesive grid architecture and typography-led campaign templates crafted for brand consistency.',
          mediaUrl: '/src/assets/images/about_strategy_studio_1794978984710.jpg',
          mediaType: 'image',
          objective: 'Unify organic social storytelling with paid acquisition ad aesthetics.',
          deliverables: 'Modular Creative System · Monthly Content Grid · Copy Playbook',
          isSample: true,
          sortOrder: 5,
        },
        {
          title: 'Aether Labs — Founder Video Ads',
          industry: 'Consumer Hardware',
          category: 'Video Advertising',
          description:
            'Sample founder-led narrative video ad framework combining problem-agitate-solve scripting with clean product cutaways.',
          mediaUrl: '/src/assets/images/portfolio_fintech_launch_1794978982588.jpg',
          mediaType: 'image',
          objective: 'Educate cold audiences and lift click-through rates on Meta video placements.',
          deliverables: '3 Scripted Video Angles · Motion Captions · Thumbstop Testing',
          isSample: true,
          sortOrder: 6,
        },
      ]);
    }

    const existingCases = await db.select().from(caseStudies).limit(1);
    if (existingCases.length === 0) {
      await db.insert(caseStudies).values([
        {
          clientName: 'Aura Botanicals (Sample)',
          industry: 'D2C Skincare',
          campaignObjective: 'Generate qualified WhatsApp & landing-page consultation leads for a flagship serum line.',
          marketingStrategy:
            'Split cold prospecting into problem-aware video hooks and ingredient-proof carousels, paired with a 7-day dynamic retargeting sequence.',
          campaignDuration: '90 Days (Sample)',
          adBudget: '₹2,40,000',
          leadsGenerated: '1,120',
          costPerLead: '₹214',
          resultsInsights:
            'Illustrative sample insights: Consolidating ad sets under Advantage+ budgets and rotating fresh Reels hooks every 14 days reduced cost per lead over the 3-month sample window.',
          chartDataJson: [
            { period: 'Month 1', leads: 260, cpl: 269, spend: 70000 },
            { period: 'Month 2', leads: 390, cpl: 218, spend: 85000 },
            { period: 'Month 3', leads: 470, cpl: 181, spend: 85000 },
          ],
          isSample: true,
          sortOrder: 1,
        },
        {
          clientName: 'Crestline Interiors (Sample)',
          industry: 'Luxury Interiors & Design',
          campaignObjective: 'Acquire high-intent residential renovation enquiries via Click-to-WhatsApp ads.',
          marketingStrategy:
            'Geo-targeted high-income postal zones using before/after architectural walkthrough Reels and automated WhatsApp qualification questions.',
          campaignDuration: '60 Days (Sample)',
          adBudget: '₹1,50,000',
          leadsGenerated: '340',
          costPerLead: '₹441',
          resultsInsights:
            'Illustrative sample insights: Introducing budget-range pre-qualification reduced low-intent enquiries while preserving steady consultation volume.',
          chartDataJson: [
            { period: 'Weeks 1–2', leads: 62, cpl: 564, spend: 35000 },
            { period: 'Weeks 3–4', leads: 81, cpl: 469, spend: 38000 },
            { period: 'Weeks 5–6', leads: 94, cpl: 404, spend: 38000 },
            { period: 'Weeks 7–8', leads: 103, cpl: 378, spend: 39000 },
          ],
          isSample: true,
          sortOrder: 2,
        },
        {
          clientName: 'Kinetix Studio (Sample)',
          industry: 'Apparel & Fitness',
          campaignObjective: 'Build awareness and capture launch-drop leads ahead of seasonal collection release.',
          marketingStrategy:
            'Reels-first creator storytelling paired with instant lead forms and VIP early-access WhatsApp broadcast opt-ins.',
          campaignDuration: '45 Days (Sample)',
          adBudget: '₹1,80,000',
          leadsGenerated: '780',
          costPerLead: '₹230',
          resultsInsights:
            'Illustrative sample insights: Short-form 15-second studio motion edits outperformed static product stills on cold click-through efficiency.',
          chartDataJson: [
            { period: 'Phase 1', leads: 190, cpl: 289, spend: 55000 },
            { period: 'Phase 2', leads: 270, cpl: 222, spend: 60000 },
            { period: 'Phase 3', leads: 320, cpl: 203, spend: 65000 },
          ],
          isSample: true,
          sortOrder: 3,
        },
      ]);
    }

    const existingTeam = await db.select().from(teamMembers).limit(1);
    if (existingTeam.length === 0) {
      await db.insert(teamMembers).values([
        {
          name: 'Ananya Verma',
          designation: 'Founder & CEO',
          bio: 'Leads agency vision, growth strategy, and executive client partnerships with a focus on measurable paid social ROI.',
          skills: 'Growth Strategy · Brand Positioning · Client Advisory',
          photoUrl: '/src/assets/images/team_founder_portrait_1794978985073.jpg',
          linkedinUrl: 'https://linkedin.com',
          instagramUrl: 'https://instagram.com',
          isSample: true,
          sortOrder: 1,
        },
        {
          name: 'Rohan Kapoor',
          designation: 'Meta Ads Specialist',
          bio: 'Architects full-funnel Meta campaign structures, conversion API tracking, and disciplined audience scaling.',
          skills: 'Meta Ads Manager · Pixel & CAPI · Media Buying',
          photoUrl: '',
          linkedinUrl: 'https://linkedin.com',
          instagramUrl: 'https://instagram.com',
          isSample: true,
          sortOrder: 2,
        },
        {
          name: 'Siddharth Nair',
          designation: 'Performance Marketing Manager',
          bio: 'Oversees cross-channel attribution, weekly cost-per-lead optimization, and transparent executive reporting.',
          skills: 'Funnel Analytics · CRO · Budget Optimization',
          photoUrl: '',
          linkedinUrl: 'https://linkedin.com',
          instagramUrl: '',
          isSample: true,
          sortOrder: 3,
        },
        {
          name: 'Meera Joshi',
          designation: 'Social Media Manager',
          bio: 'Builds consistent editorial calendars, brand narratives, and high-engagement organic social ecosystems.',
          skills: 'Content Strategy · Copywriting · Community Growth',
          photoUrl: '',
          linkedinUrl: 'https://linkedin.com',
          instagramUrl: 'https://instagram.com',
          isSample: true,
          sortOrder: 4,
        },
        {
          name: 'Kabir Malhotra',
          designation: 'Creative Designer',
          bio: 'Crafts minimalist static ad suites, high-converting carousels, and luxury visual identity systems.',
          skills: 'Art Direction · Ad Design · Brand Systems',
          photoUrl: '',
          linkedinUrl: 'https://linkedin.com',
          instagramUrl: 'https://instagram.com',
          isSample: true,
          sortOrder: 5,
        },
        {
          name: 'Devika Rao',
          designation: 'Video Editor',
          bio: 'Produces retention-engineered Instagram Reels, motion graphics, and direct-response video advertisements.',
          skills: 'Reels Editing · Motion Design · Hook Pacing',
          photoUrl: '',
          linkedinUrl: '',
          instagramUrl: 'https://instagram.com',
          isSample: true,
          sortOrder: 6,
        },
      ]);
    }

    const existingTestimonials = await db.select().from(testimonials).limit(1);
    if (existingTestimonials.length === 0) {
      await db.insert(testimonials).values([
        {
          clientName: 'Nandini Kulkarni',
          businessName: 'Aura Botanicals (Sample)',
          clientRole: 'Founder',
          photoUrl: '',
          review:
            'Sample review placeholder: Replace in the Admin Dashboard with verified client feedback describing campaign clarity, communication, and lead quality.',
          rating: 5,
          isSample: true,
          sortOrder: 1,
        },
        {
          clientName: 'Vikramaditya Sen',
          businessName: 'Crestline Interiors (Sample)',
          clientRole: 'Managing Partner',
          photoUrl: '',
          review:
            'Sample review placeholder: META FLUX structured our WhatsApp lead campaigns and weekly reporting so our sales team knew exactly where every enquiry originated.',
          rating: 5,
          isSample: true,
          sortOrder: 2,
        },
        {
          clientName: 'Tara Deshmukh',
          businessName: 'Kinetix Studio (Sample)',
          clientRole: 'Head of Growth',
          photoUrl: '',
          review:
            'Sample review placeholder: Their Reels creative testing workflow and clean design direction brought consistency to both our organic and paid social presence.',
          rating: 5,
          isSample: true,
          sortOrder: 3,
        },
      ]);
    }

    const existingPricing = await db.select().from(pricingPackages).limit(1);
    if (existingPricing.length === 0) {
      await db.insert(pricingPackages).values([
        {
          name: 'STARTER',
          targetAudience: 'For emerging brands launching structured Meta Ads',
          summary: 'Essential campaign foundation, strategy alignment, and transparent monthly reporting.',
          featuresJson: [
            'Basic Meta Ads Setup',
            'Campaign Strategy',
            'Creative Consultation',
            'Monthly Report',
          ],
          note: 'Advertising budget is separate from agency service charges.',
          isFeatured: false,
          sortOrder: 1,
        },
        {
          name: 'GROWTH',
          targetAudience: 'For scaling businesses focused on consistent lead flow',
          summary: 'Full Facebook & Instagram execution with ongoing optimization and creative support.',
          featuresJson: [
            'Facebook & Instagram Ads',
            'Lead Generation',
            'Campaign Optimization',
            'Creative Support',
            'Monthly Reporting',
          ],
          note: 'Advertising budget is separate from agency service charges.',
          isFeatured: true,
          sortOrder: 2,
        },
        {
          name: 'PREMIUM',
          targetAudience: 'For ambitious brands seeking full-stack creative & growth',
          summary: 'End-to-end social management, multi-campaign scaling, video support, and dedicated leadership.',
          featuresJson: [
            'Complete Social Media Management',
            'Multiple Campaigns',
            'Advanced Lead Generation',
            'Creative & Video Support',
            'Dedicated Account Manager',
            'Performance Reporting',
          ],
          note: 'Advertising budget is separate from agency service charges.',
          isFeatured: false,
          sortOrder: 3,
        },
      ]);
    }
  } catch (error) {
    console.error('Database seed failed:', error);
    throw new Error('Failed to initialize agency data.', { cause: error });
  }
}

export async function upsertUserWithRole(
  uid: string,
  email: string,
  displayName: string
) {
  try {
    const existingAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'))
      .limit(1);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.uid, uid))
      .limit(1);

    const isOwnerEmail =
      email.toLowerCase().trim() === OWNER_ADMIN_EMAIL.toLowerCase();
    const shouldBeAdmin =
      isOwnerEmail ||
      existingAdmins.length === 0 ||
      existingUser[0]?.role === 'admin';

    const role = shouldBeAdmin ? 'admin' : existingUser[0]?.role || 'viewer';

    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName,
        role,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName,
          role,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to upsert user:', error);
    throw new Error('Authentication synchronization failed.', { cause: error });
  }
}

export async function getPublicSiteData() {
  try {
    await ensureSeeded();
    const [
      settingsRows,
      serviceRows,
      portfolioRows,
      caseStudyRows,
      teamRows,
      testimonialRows,
      pricingRows,
    ] = await Promise.all([
      db.select().from(siteSettings).limit(1),
      db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.sortOrder), asc(services.id)),
      db.select().from(portfolioProjects).orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.id)),
      db.select().from(caseStudies).orderBy(asc(caseStudies.sortOrder), desc(caseStudies.id)),
      db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
      db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), desc(testimonials.id)),
      db.select().from(pricingPackages).orderBy(asc(pricingPackages.sortOrder), asc(pricingPackages.id)),
    ]);

    return {
      settings: settingsRows[0],
      services: serviceRows,
      portfolio: portfolioRows,
      caseStudies: caseStudyRows,
      team: teamRows,
      testimonials: testimonialRows,
      pricing: pricingRows,
    };
  } catch (error) {
    console.error('Failed to load public site data:', error);
    throw new Error('Unable to load agency content.', { cause: error });
  }
}

export async function createEnquiry(input: {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  industry: string;
  requiredService: string;
  monthlyBudget: string;
  message: string;
}) {
  try {
    const [created] = await db.insert(enquiries).values(input).returning();
    return created;
  } catch (error) {
    console.error('Failed to create enquiry:', error);
    throw new Error('Failed to submit enquiry. Please try again.', { cause: error });
  }
}

export async function getAdminOverview() {
  try {
    await ensureSeeded();
    const [
      siteData,
      enquiryRows,
      allServices,
      adminUsers,
    ] = await Promise.all([
      getPublicSiteData(),
      db.select().from(enquiries).orderBy(desc(enquiries.createdAt)),
      db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id)),
      db.select().from(users).orderBy(desc(users.createdAt)),
    ]);

    return {
      ...siteData,
      services: allServices,
      enquiries: enquiryRows,
      users: adminUsers,
    };
  } catch (error) {
    console.error('Failed to load admin overview:', error);
    throw new Error('Failed to load admin dashboard data.', { cause: error });
  }
}

export async function updateSiteSettingsRecord(
  payload: Partial<{
    agencyName: string;
    tagline: string;
    heroEyebrow: string;
    heroHeadline: string;
    heroSubheadline: string;
    aboutHeadline: string;
    aboutDescription: string;
    whatsappNumber: string;
    displayWhatsapp: string;
    contactEmail: string;
    location: string;
    instagramUrl: string;
    linkedinUrl: string;
    statsJson: AgencyStatItem[];
  }>
) {
  try {
    const existing = await db.select().from(siteSettings).limit(1);
    if (existing.length === 0) {
      throw new Error('Site settings record not found.');
    }
    const [updated] = await db
      .update(siteSettings)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(siteSettings.id, existing[0].id))
      .returning();
    return updated;
  } catch (error) {
    console.error('Failed to update site settings:', error);
    throw new Error('Failed to save site settings.', { cause: error });
  }
}

// Portfolio CRUD
export async function upsertPortfolioProject(
  id: number | null,
  data: {
    title: string;
    industry: string;
    category: string;
    description: string;
    mediaUrl: string;
    mediaType: string;
    objective: string;
    deliverables: string;
    isSample: boolean;
    sortOrder: number;
  }
) {
  try {
    if (id) {
      const [updated] = await db
        .update(portfolioProjects)
        .set(data)
        .where(eq(portfolioProjects.id, id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(portfolioProjects).values(data).returning();
    return created;
  } catch (error) {
    console.error('Failed to save portfolio project:', error);
    throw new Error('Failed to save portfolio project.', { cause: error });
  }
}

export async function deletePortfolioProject(id: number) {
  try {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  } catch (error) {
    console.error('Failed to delete portfolio project:', error);
    throw new Error('Failed to delete portfolio project.', { cause: error });
  }
}

// Case Studies CRUD
export async function upsertCaseStudy(
  id: number | null,
  data: {
    clientName: string;
    industry: string;
    campaignObjective: string;
    marketingStrategy: string;
    campaignDuration: string;
    adBudget: string;
    leadsGenerated: string;
    costPerLead: string;
    resultsInsights: string;
    chartDataJson: CaseStudyChartPoint[];
    isSample: boolean;
    sortOrder: number;
  }
) {
  try {
    if (id) {
      const [updated] = await db
        .update(caseStudies)
        .set(data)
        .where(eq(caseStudies.id, id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(caseStudies).values(data).returning();
    return created;
  } catch (error) {
    console.error('Failed to save case study:', error);
    throw new Error('Failed to save case study.', { cause: error });
  }
}

export async function deleteCaseStudy(id: number) {
  try {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  } catch (error) {
    console.error('Failed to delete case study:', error);
    throw new Error('Failed to delete case study.', { cause: error });
  }
}

// Team CRUD & Reorder
export async function upsertTeamMember(
  id: number | null,
  data: {
    name: string;
    designation: string;
    bio: string;
    skills: string;
    photoUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    isSample: boolean;
    sortOrder: number;
  }
) {
  try {
    if (id) {
      const [updated] = await db
        .update(teamMembers)
        .set(data)
        .where(eq(teamMembers.id, id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(teamMembers).values(data).returning();
    return created;
  } catch (error) {
    console.error('Failed to save team member:', error);
    throw new Error('Failed to save team member.', { cause: error });
  }
}

export async function deleteTeamMember(id: number) {
  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  } catch (error) {
    console.error('Failed to delete team member:', error);
    throw new Error('Failed to delete team member.', { cause: error });
  }
}

export async function reorderTeamMembers(orderedIds: number[]) {
  try {
    await Promise.all(
      orderedIds.map((memberId, index) =>
        db
          .update(teamMembers)
          .set({ sortOrder: index + 1 })
          .where(eq(teamMembers.id, memberId))
      )
    );
  } catch (error) {
    console.error('Failed to reorder team members:', error);
    throw new Error('Failed to reorder team profiles.', { cause: error });
  }
}

// Testimonials CRUD
export async function upsertTestimonial(
  id: number | null,
  data: {
    clientName: string;
    businessName: string;
    clientRole: string;
    photoUrl: string;
    review: string;
    rating: number;
    isSample: boolean;
    sortOrder: number;
  }
) {
  try {
    if (id) {
      const [updated] = await db
        .update(testimonials)
        .set(data)
        .where(eq(testimonials.id, id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(testimonials).values(data).returning();
    return created;
  } catch (error) {
    console.error('Failed to save testimonial:', error);
    throw new Error('Failed to save testimonial.', { cause: error });
  }
}

export async function deleteTestimonial(id: number) {
  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    throw new Error('Failed to delete testimonial.', { cause: error });
  }
}

// Services CRUD
export async function upsertService(
  id: number | null,
  data: {
    title: string;
    description: string;
    iconName: string;
    deliverables: string;
    sortOrder: number;
    isActive: boolean;
  }
) {
  try {
    if (id) {
      const [updated] = await db
        .update(services)
        .set(data)
        .where(eq(services.id, id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(services).values(data).returning();
    return created;
  } catch (error) {
    console.error('Failed to save service:', error);
    throw new Error('Failed to save service.', { cause: error });
  }
}

export async function deleteService(id: number) {
  try {
    await db.delete(services).where(eq(services.id, id));
  } catch (error) {
    console.error('Failed to delete service:', error);
    throw new Error('Failed to delete service.', { cause: error });
  }
}

// Pricing CRUD
export async function upsertPricingPackage(
  id: number | null,
  data: {
    name: string;
    targetAudience: string;
    summary: string;
    featuresJson: string[];
    note: string;
    isFeatured: boolean;
    sortOrder: number;
  }
) {
  try {
    if (id) {
      const [updated] = await db
        .update(pricingPackages)
        .set(data)
        .where(eq(pricingPackages.id, id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(pricingPackages).values(data).returning();
    return created;
  } catch (error) {
    console.error('Failed to save pricing package:', error);
    throw new Error('Failed to save pricing package.', { cause: error });
  }
}

// Enquiries Management
export async function updateEnquiryStatus(id: number, status: string) {
  try {
    const [updated] = await db
      .update(enquiries)
      .set({ status })
      .where(eq(enquiries.id, id))
      .returning();
    return updated;
  } catch (error) {
    console.error('Failed to update enquiry status:', error);
    throw new Error('Failed to update enquiry status.', { cause: error });
  }
}

export async function deleteEnquiry(id: number) {
  try {
    await db.delete(enquiries).where(eq(enquiries.id, id));
  } catch (error) {
    console.error('Failed to delete enquiry:', error);
    throw new Error('Failed to delete enquiry.', { cause: error });
  }
}

export async function updateUserRole(userId: number, role: string) {
  try {
    const [updated] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw new Error('Failed to update user role.', { cause: error });
  }
}
