import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  createEnquiry,
  deleteCaseStudy,
  deleteEnquiry,
  deletePortfolioProject,
  deleteService,
  deleteTeamMember,
  deleteTestimonial,
  getAdminOverview,
  getPublicSiteData,
  reorderTeamMembers,
  updateEnquiryStatus,
  updateSiteSettingsRecord,
  updateUserRole,
  upsertCaseStudy,
  upsertPortfolioProject,
  upsertPricingPackage,
  upsertService,
  upsertTeamMember,
  upsertTestimonial,
} from './src/db/repository.ts';
import { requireAdmin } from './src/middleware/auth.ts';
import type { AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Upload JPG, PNG, WebP, GIF, MP4, WebM, or MOV.'));
    }
  },
});

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use('/uploads', express.static(uploadsDir));

  // Public health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Public CMS data
  app.get('/api/site-data', async (_req, res) => {
    try {
      const data = await getPublicSiteData();
      res.json(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load site data';
      res.status(500).json({ error: message });
    }
  });

  // Public Enquiry Submission
  app.post('/api/enquiries', async (req, res) => {
    try {
      const {
        fullName = '',
        businessName = '',
        phone = '',
        email = '',
        industry = '',
        requiredService = '',
        monthlyBudget = '',
        message = '',
      } = req.body || {};

      if (
        !String(fullName).trim() ||
        !String(businessName).trim() ||
        !String(phone).trim() ||
        !String(email).trim() ||
        !String(industry).trim() ||
        !String(requiredService).trim() ||
        !String(monthlyBudget).trim() ||
        !String(message).trim()
      ) {
        return res.status(400).json({ error: 'All enquiry fields are required.' });
      }

      if (!isValidEmail(String(email))) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      if (!isValidPhone(String(phone))) {
        return res.status(400).json({ error: 'Please provide a valid phone or WhatsApp number.' });
      }

      const created = await createEnquiry({
        fullName: String(fullName).trim(),
        businessName: String(businessName).trim(),
        phone: String(phone).trim(),
        email: String(email).trim(),
        industry: String(industry).trim(),
        requiredService: String(requiredService).trim(),
        monthlyBudget: String(monthlyBudget).trim(),
        message: String(message).trim(),
      });

      return res.status(201).json({ enquiry: created });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to submit enquiry';
      return res.status(500).json({ error: message });
    }
  });

  // Admin Overview & Auth Verification
  app.get('/api/admin/overview', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const overview = await getAdminOverview();
      res.json({
        ...overview,
        currentUser: {
          uid: req.user?.uid,
          email: req.user?.email,
          name: req.user?.name,
          role: req.userRole,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load admin overview';
      res.status(500).json({ error: message });
    }
  });

  // Admin Media Upload (images & videos)
  app.post(
    '/api/admin/upload',
    requireAdmin,
    (req, res, next) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message || 'File upload failed' });
        }
        return next();
      });
    },
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided.' });
      }
      const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      return res.status(201).json({
        url: `/uploads/${req.file.filename}`,
        mediaType,
        filename: req.file.originalname,
      });
    }
  );

  // Admin Site Settings
  app.put('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const updated = await updateSiteSettingsRecord(req.body || {});
      res.json({ settings: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update settings';
      res.status(500).json({ error: message });
    }
  });

  // Admin Portfolio CRUD
  app.post('/api/admin/portfolio', requireAdmin, async (req, res) => {
    try {
      const { title, industry, category, description } = req.body || {};
      if (!title?.trim() || !industry?.trim() || !category?.trim() || !description?.trim()) {
        return res.status(400).json({ error: 'Title, industry, category, and description are required.' });
      }
      const created = await upsertPortfolioProject(null, {
        title: String(title).trim(),
        industry: String(industry).trim(),
        category: String(category).trim(),
        description: String(description).trim(),
        mediaUrl: String(req.body.mediaUrl || '').trim(),
        mediaType: req.body.mediaType === 'video' ? 'video' : 'image',
        objective: String(req.body.objective || '').trim(),
        deliverables: String(req.body.deliverables || '').trim(),
        isSample: Boolean(req.body.isSample),
        sortOrder: Number(req.body.sortOrder) || 0,
      });
      return res.status(201).json({ project: created });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create project';
      return res.status(500).json({ error: message });
    }
  });

  app.put('/api/admin/portfolio/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid project ID.' });
      }
      const updated = await upsertPortfolioProject(id, {
        title: String(req.body.title || '').trim(),
        industry: String(req.body.industry || '').trim(),
        category: String(req.body.category || '').trim(),
        description: String(req.body.description || '').trim(),
        mediaUrl: String(req.body.mediaUrl || '').trim(),
        mediaType: req.body.mediaType === 'video' ? 'video' : 'image',
        objective: String(req.body.objective || '').trim(),
        deliverables: String(req.body.deliverables || '').trim(),
        isSample: Boolean(req.body.isSample),
        sortOrder: Number(req.body.sortOrder) || 0,
      });
      return res.json({ project: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update project';
      return res.status(500).json({ error: message });
    }
  });

  app.delete('/api/admin/portfolio/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await deletePortfolioProject(id);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete project';
      res.status(500).json({ error: message });
    }
  });

  // Admin Case Studies CRUD
  app.post('/api/admin/case-studies', requireAdmin, async (req, res) => {
    try {
      const b = req.body || {};
      if (!b.clientName?.trim() || !b.industry?.trim() || !b.campaignObjective?.trim()) {
        return res.status(400).json({ error: 'Client name, industry, and campaign objective are required.' });
      }
      const created = await upsertCaseStudy(null, {
        clientName: String(b.clientName).trim(),
        industry: String(b.industry).trim(),
        campaignObjective: String(b.campaignObjective).trim(),
        marketingStrategy: String(b.marketingStrategy || '').trim(),
        campaignDuration: String(b.campaignDuration || '').trim(),
        adBudget: String(b.adBudget || '').trim(),
        leadsGenerated: String(b.leadsGenerated || '').trim(),
        costPerLead: String(b.costPerLead || '').trim(),
        resultsInsights: String(b.resultsInsights || '').trim(),
        chartDataJson: Array.isArray(b.chartDataJson) ? b.chartDataJson : [],
        isSample: Boolean(b.isSample),
        sortOrder: Number(b.sortOrder) || 0,
      });
      return res.status(201).json({ caseStudy: created });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create case study';
      return res.status(500).json({ error: message });
    }
  });

  app.put('/api/admin/case-studies/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const b = req.body || {};
      const updated = await upsertCaseStudy(id, {
        clientName: String(b.clientName || '').trim(),
        industry: String(b.industry || '').trim(),
        campaignObjective: String(b.campaignObjective || '').trim(),
        marketingStrategy: String(b.marketingStrategy || '').trim(),
        campaignDuration: String(b.campaignDuration || '').trim(),
        adBudget: String(b.adBudget || '').trim(),
        leadsGenerated: String(b.leadsGenerated || '').trim(),
        costPerLead: String(b.costPerLead || '').trim(),
        resultsInsights: String(b.resultsInsights || '').trim(),
        chartDataJson: Array.isArray(b.chartDataJson) ? b.chartDataJson : [],
        isSample: Boolean(b.isSample),
        sortOrder: Number(b.sortOrder) || 0,
      });
      res.json({ caseStudy: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update case study';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/admin/case-studies/:id', requireAdmin, async (req, res) => {
    try {
      await deleteCaseStudy(Number(req.params.id));
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete case study';
      res.status(500).json({ error: message });
    }
  });

  // Admin Team CRUD & Reorder
  app.post('/api/admin/team', requireAdmin, async (req, res) => {
    try {
      const b = req.body || {};
      if (!b.name?.trim() || !b.designation?.trim()) {
        return res.status(400).json({ error: 'Name and designation are required.' });
      }
      const created = await upsertTeamMember(null, {
        name: String(b.name).trim(),
        designation: String(b.designation).trim(),
        bio: String(b.bio || '').trim(),
        skills: String(b.skills || '').trim(),
        photoUrl: String(b.photoUrl || '').trim(),
        linkedinUrl: String(b.linkedinUrl || '').trim(),
        instagramUrl: String(b.instagramUrl || '').trim(),
        isSample: Boolean(b.isSample),
        sortOrder: Number(b.sortOrder) || 0,
      });
      return res.status(201).json({ member: created });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add team member';
      return res.status(500).json({ error: message });
    }
  });

  app.put('/api/admin/team/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const b = req.body || {};
      const updated = await upsertTeamMember(id, {
        name: String(b.name || '').trim(),
        designation: String(b.designation || '').trim(),
        bio: String(b.bio || '').trim(),
        skills: String(b.skills || '').trim(),
        photoUrl: String(b.photoUrl || '').trim(),
        linkedinUrl: String(b.linkedinUrl || '').trim(),
        instagramUrl: String(b.instagramUrl || '').trim(),
        isSample: Boolean(b.isSample),
        sortOrder: Number(b.sortOrder) || 0,
      });
      res.json({ member: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update team member';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/admin/team/:id', requireAdmin, async (req, res) => {
    try {
      await deleteTeamMember(Number(req.params.id));
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete team member';
      res.status(500).json({ error: message });
    }
  });

  app.put('/api/admin/team-reorder', requireAdmin, async (req, res) => {
    try {
      const orderedIds = Array.isArray(req.body?.orderedIds)
        ? req.body.orderedIds.map((id: unknown) => Number(id)).filter((id: number) => Number.isInteger(id) && id > 0)
        : [];
      await reorderTeamMembers(orderedIds);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to reorder team';
      res.status(500).json({ error: message });
    }
  });

  // Admin Testimonials CRUD
  app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
    try {
      const b = req.body || {};
      if (!b.clientName?.trim() || !b.businessName?.trim() || !b.review?.trim()) {
        return res.status(400).json({ error: 'Client name, business name, and review are required.' });
      }
      const created = await upsertTestimonial(null, {
        clientName: String(b.clientName).trim(),
        businessName: String(b.businessName).trim(),
        clientRole: String(b.clientRole || 'Founder').trim(),
        photoUrl: String(b.photoUrl || '').trim(),
        review: String(b.review).trim(),
        rating: Math.min(5, Math.max(1, Number(b.rating) || 5)),
        isSample: Boolean(b.isSample),
        sortOrder: Number(b.sortOrder) || 0,
      });
      return res.status(201).json({ testimonial: created });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save testimonial';
      return res.status(500).json({ error: message });
    }
  });

  app.put('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const b = req.body || {};
      const updated = await upsertTestimonial(id, {
        clientName: String(b.clientName || '').trim(),
        businessName: String(b.businessName || '').trim(),
        clientRole: String(b.clientRole || 'Founder').trim(),
        photoUrl: String(b.photoUrl || '').trim(),
        review: String(b.review || '').trim(),
        rating: Math.min(5, Math.max(1, Number(b.rating) || 5)),
        isSample: Boolean(b.isSample),
        sortOrder: Number(b.sortOrder) || 0,
      });
      res.json({ testimonial: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update testimonial';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
    try {
      await deleteTestimonial(Number(req.params.id));
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete testimonial';
      res.status(500).json({ error: message });
    }
  });

  // Admin Services CRUD
  app.post('/api/admin/services', requireAdmin, async (req, res) => {
    try {
      const b = req.body || {};
      const created = await upsertService(null, {
        title: String(b.title || '').trim(),
        description: String(b.description || '').trim(),
        iconName: String(b.iconName || 'Target').trim(),
        deliverables: String(b.deliverables || '').trim(),
        sortOrder: Number(b.sortOrder) || 0,
        isActive: b.isActive !== false,
      });
      res.status(201).json({ service: created });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create service';
      res.status(500).json({ error: message });
    }
  });

  app.put('/api/admin/services/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const b = req.body || {};
      const updated = await upsertService(id, {
        title: String(b.title || '').trim(),
        description: String(b.description || '').trim(),
        iconName: String(b.iconName || 'Target').trim(),
        deliverables: String(b.deliverables || '').trim(),
        sortOrder: Number(b.sortOrder) || 0,
        isActive: b.isActive !== false,
      });
      res.json({ service: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update service';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
    try {
      await deleteService(Number(req.params.id));
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete service';
      res.status(500).json({ error: message });
    }
  });

  // Admin Pricing CRUD
  app.put('/api/admin/pricing/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const b = req.body || {};
      const updated = await upsertPricingPackage(id, {
        name: String(b.name || '').trim(),
        targetAudience: String(b.targetAudience || '').trim(),
        summary: String(b.summary || '').trim(),
        featuresJson: Array.isArray(b.featuresJson) ? b.featuresJson : [],
        note: String(
          b.note || 'Advertising budget is separate from agency service charges.'
        ).trim(),
        isFeatured: Boolean(b.isFeatured),
        sortOrder: Number(b.sortOrder) || 0,
      });
      res.json({ package: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update pricing package';
      res.status(500).json({ error: message });
    }
  });

  // Admin Enquiries Management
  app.patch('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const status = String(req.body?.status || 'reviewed').trim();
      const updated = await updateEnquiryStatus(id, status);
      res.json({ enquiry: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update enquiry';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
    try {
      await deleteEnquiry(Number(req.params.id));
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete enquiry';
      res.status(500).json({ error: message });
    }
  });

  // Admin User Role Management
  app.patch('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const role = req.body?.role === 'admin' ? 'admin' : 'viewer';
      const updated = await updateUserRole(id, role);
      res.json({ user: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update role';
      res.status(500).json({ error: message });
    }
  });

  // Vite Dev Middleware or Production Static Files
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`META FLUX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
