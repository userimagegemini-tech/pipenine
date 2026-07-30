import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT || 3001);
const sessions = new Set();
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleAdminEmails = new Set(
  (process.env.GOOGLE_ADMIN_EMAILS || process.env.GOOGLE_ADMIN_EMAIL || 'pchouhan@starlab.co.in')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);
const googleAuth = new OAuth2Client(googleClientId);
const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uploadDirectory = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'uploads')
  : path.join(rootDirectory, 'public', 'uploads');
const distDirectory = path.join(rootDirectory, 'dist');

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadDirectory));
app.use('/api/uploads', express.static(uploadDirectory));

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions.has(token)) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/auth/google-config', (_req, res) => res.json({ clientId: googleClientId, configured: Boolean(googleClientId) }));

app.post('/api/auth/google', asyncRoute(async (req, res) => {
  if (!googleClientId) return res.status(503).json({ error: 'Google OAuth Client ID is not configured.' });
  if (!req.body.credential) return res.status(400).json({ error: 'Google credential is required.' });
  let ticket;
  try {
    ticket = await googleAuth.verifyIdToken({ idToken: req.body.credential, audience: googleClientId });
  } catch {
    return res.status(401).json({ error: 'Google sign-in could not be verified.' });
  }
  const profile = ticket.getPayload();
  if (!profile?.email_verified || !googleAdminEmails.has(profile.email?.toLowerCase())) {
    return res.status(403).json({ error: 'This Google account is not authorized for the admin dashboard.' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  sessions.add(token);
  res.json({ token, user: { email: profile.email, name: profile.name || 'Mühlenbruch Admin', picture: profile.picture || '' } });
}));

app.post('/api/auth/logout', requireAdmin, (req, res) => {
  sessions.delete(req.headers.authorization.replace('Bearer ', ''));
  res.status(204).end();
});

const uploadTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

app.post(
  '/api/admin/uploads',
  requireAdmin,
  express.raw({ type: Object.keys(uploadTypes), limit: '8mb' }),
  asyncRoute(async (req, res) => {
    const extension = uploadTypes[req.headers['content-type']];
    if (!extension || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Choose a JPG, PNG, WebP, GIF, or AVIF image.' });
    }
    fs.mkdirSync(uploadDirectory, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`;
    await fs.promises.writeFile(path.join(uploadDirectory, filename), req.body);
    res.status(201).json({ url: `/api/uploads/${filename}` });
  }),
);

app.get('/api/retreats', asyncRoute(async (_req, res) => {
  res.json(await prisma.retreat.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } }));
}));
app.get('/api/retreats/:id', asyncRoute(async (req, res) => {
  const retreat = await prisma.retreat.findFirst({ where: { id: Number(req.params.id), active: true } });
  if (!retreat) return res.status(404).json({ error: 'Insurance service not found' });
  res.json(retreat);
}));

app.post('/api/contacts', asyncRoute(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) return res.status(400).json({ error: 'All fields are required' });
  res.status(201).json(await prisma.contact.create({ data: { name: name.trim(), email: email.trim(), message: message.trim() } }));
}));

app.get('/api/content', asyncRoute(async (_req, res) => {
  const [site, heroSlides, featureCards, about, contactContent, footer, footerLinks, dynamicSections, menuItems] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.heroSlide.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.featureCard.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.contactContent.findUnique({ where: { id: 1 } }),
    prisma.footerSetting.findUnique({ where: { id: 1 } }),
    prisma.footerLink.findMany({ where: { active: true }, orderBy: [{ groupName: 'asc' }, { sortOrder: 'asc' }] }),
    prisma.dynamicSection.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
    prisma.menuItem.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
  ]);
  res.json({ site, heroSlides, featureCards, about, contactContent, footer, footerLinks, dynamicSections, menuItems });
}));

app.get('/api/admin/retreats', requireAdmin, asyncRoute(async (_req, res) => {
  res.json(await prisma.retreat.findMany({ orderBy: { createdAt: 'asc' } }));
}));
app.post('/api/admin/retreats', requireAdmin, asyncRoute(async (req, res) => {
  const { name, price, bed, bath, image, style = 'cabin', active = true } = req.body;
  res.status(201).json(await prisma.retreat.create({ data: { name, price: Number(price), bed, bath, image, style, active } }));
}));
app.put('/api/admin/retreats/:id', requireAdmin, asyncRoute(async (req, res) => {
  const { name, price, bed, bath, image, style = 'cabin', active = true } = req.body;
  res.json(await prisma.retreat.update({ where: { id: Number(req.params.id) }, data: { name, price: Number(price), bed, bath, image, style, active } }));
}));
app.delete('/api/admin/retreats/:id', requireAdmin, asyncRoute(async (req, res) => {
  await prisma.retreat.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}));

app.get('/api/admin/contacts', requireAdmin, asyncRoute(async (_req, res) => {
  res.json(await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }));
}));
app.patch('/api/admin/contacts/:id', requireAdmin, asyncRoute(async (req, res) => {
  res.json(await prisma.contact.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status } }));
}));
app.delete('/api/admin/contacts/:id', requireAdmin, asyncRoute(async (req, res) => {
  await prisma.contact.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}));

app.get('/api/admin/content', requireAdmin, asyncRoute(async (_req, res) => {
  const [site, heroSlides, featureCards, retreats, about, contactContent, contacts, footer, footerLinks, dynamicSections, menuItems] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.featureCard.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.retreat.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.contactContent.findUnique({ where: { id: 1 } }),
    prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.footerSetting.findUnique({ where: { id: 1 } }),
    prisma.footerLink.findMany({ orderBy: [{ groupName: 'asc' }, { sortOrder: 'asc' }] }),
    prisma.dynamicSection.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
    prisma.menuItem.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
  ]);
  res.json({ site, heroSlides, featureCards, retreats, about, contactContent, contacts, footer, footerLinks, dynamicSections, menuItems });
}));

const singletonRoutes = [
  ['site', 'siteSetting'],
  ['about', 'aboutContent'],
  ['contact-content', 'contactContent'],
  ['footer', 'footerSetting'],
];
for (const [route, model] of singletonRoutes) {
  app.put(`/api/admin/${route}`, requireAdmin, asyncRoute(async (req, res) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = req.body;
    res.json(await prisma[model].upsert({ where: { id: 1 }, update: data, create: { ...data, id: 1 } }));
  }));
}

const collectionRoutes = [
  ['hero-slides', 'heroSlide'],
  ['feature-cards', 'featureCard'],
  ['footer-links', 'footerLink'],
  ['dynamic-sections', 'dynamicSection'],
  ['menu-items', 'menuItem'],
];
for (const [route, model] of collectionRoutes) {
  app.post(`/api/admin/${route}`, requireAdmin, asyncRoute(async (req, res) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = req.body;
    let data = { ...input, sortOrder: Number(input.sortOrder || 0), active: input.active !== false };
    if (model === 'dynamicSection') {
      if (!input.menuLabel?.trim() || !input.title?.trim()) return res.status(400).json({ error: 'Menu label and section title are required.' });
      data = { eyebrow: '', accentTitle: '', description: '', image: '', buttonLabel: 'Learn more', buttonUrl: '/contact', imageSide: 'left', ...data, menuLabel: input.menuLabel.trim(), title: input.title.trim() };
    }
    if (model === 'menuItem' && (!input.label?.trim() || !input.url?.trim())) return res.status(400).json({ error: 'Menu label and destination are required.' });
    const created = await prisma[model].create({ data });
    if (model === 'dynamicSection') {
      await prisma.menuItem.create({ data: { label: created.menuLabel, url: `#section-${created.id}`, sectionId: created.id, sortOrder: created.sortOrder, active: created.active } });
    }
    res.status(201).json(created);
  }));
  app.put(`/api/admin/${route}/:id`, requireAdmin, asyncRoute(async (req, res) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = req.body;
    let data = { ...input, sortOrder: Number(input.sortOrder || 0), active: input.active !== false };
    if (model === 'dynamicSection') {
      if (!input.menuLabel?.trim() || !input.title?.trim()) return res.status(400).json({ error: 'Menu label and section title are required.' });
      data = { ...data, menuLabel: input.menuLabel.trim(), title: input.title.trim() };
    }
    if (model === 'menuItem' && (!input.label?.trim() || !input.url?.trim())) return res.status(400).json({ error: 'Menu label and destination are required.' });
    const updated = await prisma[model].update({ where: { id: Number(req.params.id) }, data });
    if (model === 'dynamicSection') {
      await prisma.menuItem.updateMany({ where: { sectionId: updated.id }, data: { label: updated.menuLabel, url: `#section-${updated.id}`, sortOrder: updated.sortOrder, active: updated.active } });
    }
    res.json(updated);
  }));
  app.delete(`/api/admin/${route}/:id`, requireAdmin, asyncRoute(async (req, res) => {
    await prisma[model].delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  }));
}

if (fs.existsSync(distDirectory)) {
  app.use(express.static(distDirectory));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(distDirectory, 'index.html')));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
});

async function seed() {
  if (!(await prisma.retreat.count())) await prisma.retreat.createMany({ data: [
    { name: 'Auto Insurance', price: 0, bed: 'Personal coverage', bath: '15+ carriers', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85', style: 'cabin' },
    { name: 'Home Insurance', price: 0, bed: 'Home protection', bath: 'Custom plans', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85', style: 'lodge' },
    { name: 'Recreational Vehicles', price: 0, bed: 'RV coverage', bath: 'Flexible plans', image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=900&q=85', style: 'treehouse' },
    { name: 'Pet Insurance', price: 0, bed: 'Pet protection', bath: 'Trusted coverage', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85', style: 'cabin' },
    { name: 'Dental Service', price: 0, bed: 'Dental coverage', bath: 'Family plans', image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=85', style: 'lodge' },
    { name: 'Disability', price: 0, bed: 'Income protection', bath: 'Custom plans', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85', style: 'treehouse' },
    { name: 'Health Insurance', price: 0, bed: 'Health coverage', bath: 'Multiple carriers', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=85', style: 'cabin' },
    { name: 'Workers Compensation', price: 0, bed: 'Business coverage', bath: 'Worker protection', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=85', style: 'lodge' },
    { name: 'Crop Insurance', price: 0, bed: 'Farm protection', bath: 'Local expertise', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85', style: 'treehouse' },
  ]});
  if (!(await prisma.menuItem.count())) await prisma.menuItem.createMany({ data: [
    { label: 'Home', url: '/', sortOrder: 1 },
    { label: 'Insurance', url: '#stays', sortOrder: 2 },
    { label: 'About', url: '#experiences', sortOrder: 3 },
    { label: 'Contact Us', url: '#contact', sortOrder: 4 },
  ]});
}

seed().then(() => app.listen(port, () => console.log(`Mühlenbruch API listening on http://localhost:${port}`)));
