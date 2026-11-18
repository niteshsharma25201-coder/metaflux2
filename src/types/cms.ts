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

export interface SiteSettings {
  id: number;
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
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  deliverables: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PortfolioProject {
  id: number;
  title: string;
  industry: string;
  category: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | string;
  objective: string;
  deliverables: string;
  isSample: boolean;
  sortOrder: number;
}

export interface CaseStudy {
  id: number;
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

export interface TeamMember {
  id: number;
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

export interface Testimonial {
  id: number;
  clientName: string;
  businessName: string;
  clientRole: string;
  photoUrl: string;
  review: string;
  rating: number;
  isSample: boolean;
  sortOrder: number;
}

export interface PricingPackage {
  id: number;
  name: string;
  targetAudience: string;
  summary: string;
  featuresJson: string[];
  note: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface Enquiry {
  id: number;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  industry: string;
  requiredService: string;
  monthlyBudget: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  role: string;
  createdAt: string;
}

export interface PublicSiteData {
  settings: SiteSettings;
  services: ServiceItem[];
  portfolio: PortfolioProject[];
  caseStudies: CaseStudy[];
  team: TeamMember[];
  testimonials: Testimonial[];
  pricing: PricingPackage[];
}

export interface AdminOverviewData extends PublicSiteData {
  enquiries: Enquiry[];
  users: AdminUser[];
  currentUser: {
    uid: string;
    email: string;
    name?: string;
    role: string;
  };
}
