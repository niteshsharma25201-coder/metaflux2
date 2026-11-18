import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export interface AgencyStatItem {
  id: string;
  label: string;
  value: string;
  note: string;
  isSample?: boolean;
}

export interface CaseStudyChartPoint {
  period: string;
  leads: number;
  cpl: number;
  spend: number;
}

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name').default(''),
  role: text('role').notNull().default('viewer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  agencyName: text('agency_name').notNull().default('META FLUX'),
  tagline: text('tagline').notNull().default('We Turn Attention Into Growth.'),
  heroEyebrow: text('hero_eyebrow').notNull().default('DIGITAL GROWTH PARTNER'),
  heroHeadline: text('hero_headline').notNull().default('We Turn Attention Into Growth.'),
  heroSubheadline: text('hero_subheadline')
    .notNull()
    .default(
      'We help ambitious businesses grow with powerful Meta Ads, creative social media strategies and performance-driven digital marketing.'
    ),
  aboutHeadline: text('about_headline')
    .notNull()
    .default('Marketing That Moves Businesses Forward.'),
  aboutDescription: text('about_description')
    .notNull()
    .default(
      'META FLUX partners with ambitious brands to sharpen online visibility, attract high-intent customers, generate qualified leads, and scale revenue through disciplined performance marketing and creative direction.'
    ),
  whatsappNumber: text('whatsapp_number').notNull().default('917879733808'),
  displayWhatsapp: text('display_whatsapp').notNull().default('+91 7879733808'),
  contactEmail: text('contact_email').notNull().default('hello@metaflux.agency'),
  location: text('location').notNull().default('Mumbai & Remote Worldwide'),
  instagramUrl: text('instagram_url').notNull().default('https://instagram.com'),
  linkedinUrl: text('linkedin_url').notNull().default('https://linkedin.com'),
  statsJson: jsonb('stats_json').$type<AgencyStatItem[]>().notNull().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull().default('Target'),
  deliverables: text('deliverables').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

export const portfolioProjects = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  industry: text('industry').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  mediaUrl: text('media_url').notNull().default(''),
  mediaType: text('media_type').notNull().default('image'),
  objective: text('objective').notNull().default(''),
  deliverables: text('deliverables').notNull().default(''),
  isSample: boolean('is_sample').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const caseStudies = pgTable('case_studies', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  industry: text('industry').notNull(),
  campaignObjective: text('campaign_objective').notNull(),
  marketingStrategy: text('marketing_strategy').notNull(),
  campaignDuration: text('campaign_duration').notNull(),
  adBudget: text('ad_budget').notNull(),
  leadsGenerated: text('leads_generated').notNull(),
  costPerLead: text('cost_per_lead').notNull(),
  resultsInsights: text('results_insights').notNull(),
  chartDataJson: jsonb('chart_data_json')
    .$type<CaseStudyChartPoint[]>()
    .notNull()
    .default([]),
  isSample: boolean('is_sample').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  designation: text('designation').notNull(),
  bio: text('bio').notNull(),
  skills: text('skills').notNull(),
  photoUrl: text('photo_url').notNull().default(''),
  linkedinUrl: text('linkedin_url').notNull().default(''),
  instagramUrl: text('instagram_url').notNull().default(''),
  isSample: boolean('is_sample').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  businessName: text('business_name').notNull(),
  clientRole: text('client_role').notNull().default('Founder'),
  photoUrl: text('photo_url').notNull().default(''),
  review: text('review').notNull(),
  rating: integer('rating').notNull().default(5),
  isSample: boolean('is_sample').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pricingPackages = pgTable('pricing_packages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  targetAudience: text('target_audience').notNull().default(''),
  summary: text('summary').notNull().default(''),
  featuresJson: jsonb('features_json').$type<string[]>().notNull().default([]),
  note: text('note')
    .notNull()
    .default('Advertising budget is separate from agency service charges.'),
  isFeatured: boolean('is_featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  businessName: text('business_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  industry: text('industry').notNull(),
  requiredService: text('required_service').notNull(),
  monthlyBudget: text('monthly_budget').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
