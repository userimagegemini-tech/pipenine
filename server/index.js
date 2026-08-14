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
app.set('trust proxy', 1);
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
const sendGridApiKey = process.env.SENDGRID_API_KEY || '';
const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL || '';
const sendGridToEmail = process.env.SENDGRID_TO_EMAIL || '';
const sendGridFromName = process.env.SENDGRID_FROM_NAME || 'Mühlenbruch Insurance Website';
const sendGridContactTemplateId = process.env.SENDGRID_CONTACT_TEMPLATE_ID || '';
const openAiApiKey = process.env.OPENAI_API_KEY || '';
const openAiModel = process.env.OPENAI_MODEL || 'gpt-5.4-mini';
const chatRateLimits = new Map();

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
const isBlank = (value) => typeof value !== 'string' || !value.trim();
const validCmsLink = (value) => /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(String(value || '').trim());
const missingFields = (input, fields) => fields.filter(([key]) => isBlank(input[key])).map(([, label]) => label);
const requiredMessage = (missing) => `Please complete the required ${missing.length === 1 ? 'field' : 'fields'}: ${missing.join(', ')}.`;
const parseEmailList = (value) => [...new Set(String(value || '').split(/[,;\n]+/).map((email) => email.trim().toLowerCase()).filter(Boolean))];
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
}[character]));
const getChatAnswer = (response) => (response.output || [])
  .flatMap((item) => item.content || [])
  .filter((content) => content.type === 'output_text')
  .map((content) => content.text || '')
  .join('\n')
  .trim();
const buildChatContext = async () => {
  const [site, services, about, localService, contact, sections] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 }, select: { brandName: true, brandSuffix: true, tagline: true, phone: true, email: true, address: true } }),
    prisma.retreat.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' }, select: { name: true, bed: true, bath: true, detailDescription: true, benefitOne: true, benefitTwo: true, benefitThree: true, benefitFour: true } }),
    prisma.aboutContent.findUnique({ where: { id: 1 }, select: { title: true, accentTitle: true, description: true, bulletOne: true, bulletTwo: true, bulletThree: true, bulletFour: true } }),
    prisma.localServiceContent.findUnique({ where: { id: 1 } }),
    prisma.contactContent.findUnique({ where: { id: 1 }, select: { description: true } }),
    prisma.dynamicSection.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' }, select: { menuLabel: true, title: true, accentTitle: true, description: true, buttonLabel: true, buttonUrl: true } }),
  ]);
  return { site, services, about, localService, contact, sections };
};
const allowChatRequest = (ip) => {
  const now = Date.now();
  const recent = (chatRateLimits.get(ip) || []).filter((timestamp) => now - timestamp < 60_000);
  if (recent.length >= 10) return false;
  recent.push(now);
  chatRateLimits.set(ip, recent);
  if (chatRateLimits.size > 1_000) {
    for (const [key, timestamps] of chatRateLimits) if (!timestamps.some((timestamp) => now - timestamp < 60_000)) chatRateLimits.delete(key);
  }
  return true;
};
const sendContactNotification = async (contact, site) => {
  const siteRecipients = parseEmailList(site?.notificationEmails);
  const fallbackRecipients = parseEmailList(sendGridToEmail);
  const recipients = [...new Set(
    siteRecipients.length
      ? siteRecipients
      : fallbackRecipients.length
        ? fallbackRecipients
        : parseEmailList(site?.email),
  )];
  if (!sendGridApiKey || !sendGridFromEmail || !recipients.length) return false;
  const personalizations = {
    to: recipients.map((email) => ({ email })),
    ...(sendGridContactTemplateId ? {
      dynamic_template_data: {
        name: contact.name,
        email: contact.email,
        message: contact.message,
        phone: contact.phone,
      },
    } : {}),
  };
  const message = {
    personalizations: [personalizations],
    from: { email: sendGridFromEmail, name: sendGridFromName },
    reply_to: { email: contact.email, name: contact.name },
    ...(sendGridContactTemplateId ? {
      template_id: sendGridContactTemplateId,
    } : {
      subject: `New website enquiry from ${contact.name}`,
      content: [
        {
          type: 'text/plain',
          value: `A new contact enquiry was submitted.\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\n\nMessage:\n${contact.message}`,
        },
        {
          type: 'text/html',
          value: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#182019"><h2 style="margin-bottom:18px">New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(contact.name)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p><p><strong>Phone:</strong> <a href="tel:${escapeHtml(contact.phone.replace(/\D/g, ''))}">${escapeHtml(contact.phone)}</a></p><p><strong>Message:</strong></p><div style="padding:16px;border-left:3px solid #c9a56a;background:#f7f5ef;white-space:pre-wrap">${escapeHtml(contact.message)}</div></div>`,
        },
      ],
    }),
  };
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sendGridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    const details = (await response.text()).slice(0, 500);
    throw new Error(`SendGrid returned ${response.status}: ${details}`);
  }
  return true;
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/chat', asyncRoute(async (req, res) => {
  if (req.get('sec-fetch-site') === 'cross-site') return res.status(403).json({ error: 'Chat requests must come from this website.' });
  if (!allowChatRequest(req.ip || 'unknown')) return res.status(429).json({ error: 'Too many messages. Please wait a minute and try again.' });
  if (!openAiApiKey) return res.status(503).json({ error: 'The AI assistant is not configured yet.' });
  const messages = (Array.isArray(req.body?.messages) ? req.body.messages : [])
    .slice(-8)
    .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message?.content === 'string')
    .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 500) }))
    .filter((message) => message.content);
  if (!messages.length || messages.at(-1).role !== 'user') return res.status(400).json({ error: 'Please enter a question.' });
  const projectContext = await buildChatContext();
  const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openAiApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: openAiModel,
      store: false,
      max_output_tokens: 500,
      instructions: `You are the friendly website guide for Mühlenbruch Insurance in Dows, Iowa. Answer only questions about the agency, its website, listed insurance services, office and contact details, and requesting a quote. Use only the WEBSITE DATA supplied below. Give a direct answer first, then add useful supporting details or simple next steps when the website data supports them. When comparing listed services, clearly explain each relevant option without recommending a specific policy. Never invent prices, discounts, carriers, policy terms, eligibility, availability, or guarantees. Do not provide personalized insurance, legal, medical, or financial advice. Explain that coverage, eligibility, and pricing require confirmation from a licensed agent. If the data does not answer a question, say you do not have that information and direct the visitor to the Contact Us form, phone, or email. Keep answers warm, clear, and easy to scan—normally two to four short paragraphs. Use short bullet points when they make multiple details easier to understand, but do not use markdown tables. WEBSITE DATA: ${JSON.stringify(projectContext)}`,
      input: messages,
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!openAiResponse.ok) {
    const details = (await openAiResponse.text()).slice(0, 500);
    console.error(`OpenAI chat request failed (${openAiResponse.status}): ${details}`);
    return res.status(502).json({ error: 'The AI assistant is temporarily unavailable.' });
  }
  const answer = getChatAnswer(await openAiResponse.json());
  if (!answer) return res.status(502).json({ error: 'The AI assistant could not create an answer.' });
  res.json({ answer });
}));
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
  const { name, email, phone, message } = req.body;
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  if (!cleanName || !cleanEmail || !cleanPhone || !cleanMessage) return res.status(400).json({ error: 'Please complete every field.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (!/^\d{3}-\d{3}-\d{4}$/.test(cleanPhone)) return res.status(400).json({ error: 'Please enter your phone number in the format 515-852-4156.' });
  if (cleanName.length > 100 || cleanEmail.length > 200 || cleanPhone.length > 12 || cleanMessage.length > 3000) {
    return res.status(400).json({ error: 'Your submission is too long. Please shorten it and try again.' });
  }
  const contact = await prisma.contact.create({
    data: { name: cleanName, email: cleanEmail, phone: cleanPhone, message: cleanMessage },
  });
  const site = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  let notificationSent = false;
  try {
    notificationSent = await sendContactNotification(contact, site);
  } catch (error) {
    console.error('Contact saved, but SendGrid notification failed:', error.message);
  }
  res.status(201).json({ ...contact, notificationSent });
}));

app.get('/api/content', asyncRoute(async (_req, res) => {
  const [site, heroSlides, featureCards, about, localService, contactContent, footer, footerLinks, dynamicSections, menuItems] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.heroSlide.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.featureCard.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.localServiceContent.findUnique({ where: { id: 1 } }),
    prisma.contactContent.findUnique({ where: { id: 1 } }),
    prisma.footerSetting.findUnique({ where: { id: 1 } }),
    prisma.footerLink.findMany({ where: { active: true }, orderBy: [{ groupName: 'asc' }, { sortOrder: 'asc' }] }),
    prisma.dynamicSection.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
    prisma.menuItem.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
  ]);
  const { notificationEmails: _notificationEmails, ...publicSite } = site || {};
  res.json({ site: publicSite, heroSlides, featureCards, about, localService, contactContent, footer, footerLinks, dynamicSections, menuItems });
}));

app.get('/api/admin/retreats', requireAdmin, asyncRoute(async (_req, res) => {
  res.json(await prisma.retreat.findMany({ orderBy: { createdAt: 'asc' } }));
}));
app.post('/api/admin/retreats', requireAdmin, asyncRoute(async (req, res) => {
  const { name, price = 0, bed, bath, image, style = 'cabin', detailDescription, benefitOne = '', benefitTwo = '', benefitThree = '', benefitFour = '', quoteLabel, quoteUrl, active = true } = req.body;
  const missing = missingFields(req.body, [['name', 'Insurance name'], ['bed', 'Coverage label'], ['bath', 'Plan label'], ['image', 'Insurance image'], ['detailDescription', 'Detail description'], ['quoteLabel', 'Quote button label'], ['quoteUrl', 'Quote button link']]);
  if (missing.length) return res.status(400).json({ error: requiredMessage(missing) });
  if (!Number.isFinite(Number(price)) || Number(price) < 0) return res.status(400).json({ error: 'Price value must be zero or a positive number.' });
  if (!validCmsLink(quoteUrl)) return res.status(400).json({ error: 'Quote button link must start with https://, /, #, mailto:, or tel:.' });
  res.status(201).json(await prisma.retreat.create({ data: { name, price: Number(price), bed, bath, image, style, detailDescription, benefitOne, benefitTwo, benefitThree, benefitFour, quoteLabel, quoteUrl, active } }));
}));
app.put('/api/admin/retreats/:id', requireAdmin, asyncRoute(async (req, res) => {
  const { name, price = 0, bed, bath, image, style = 'cabin', detailDescription, benefitOne = '', benefitTwo = '', benefitThree = '', benefitFour = '', quoteLabel, quoteUrl, active = true } = req.body;
  const missing = missingFields(req.body, [['name', 'Insurance name'], ['bed', 'Coverage label'], ['bath', 'Plan label'], ['image', 'Insurance image'], ['detailDescription', 'Detail description'], ['quoteLabel', 'Quote button label'], ['quoteUrl', 'Quote button link']]);
  if (missing.length) return res.status(400).json({ error: requiredMessage(missing) });
  if (!Number.isFinite(Number(price)) || Number(price) < 0) return res.status(400).json({ error: 'Price value must be zero or a positive number.' });
  if (!validCmsLink(quoteUrl)) return res.status(400).json({ error: 'Quote button link must start with https://, /, #, mailto:, or tel:.' });
  res.json(await prisma.retreat.update({ where: { id: Number(req.params.id) }, data: { name, price: Number(price), bed, bath, image, style, detailDescription, benefitOne, benefitTwo, benefitThree, benefitFour, quoteLabel, quoteUrl, active } }));
}));
app.delete('/api/admin/retreats/:id', requireAdmin, asyncRoute(async (req, res) => {
  await prisma.retreat.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}));

app.get('/api/admin/contacts', requireAdmin, asyncRoute(async (_req, res) => {
  res.json(await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }));
}));
app.patch('/api/admin/contacts/mark-viewed', requireAdmin, asyncRoute(async (_req, res) => {
  const result = await prisma.contact.updateMany({ where: { viewed: false }, data: { viewed: true } });
  res.json({ updated: result.count });
}));
app.patch('/api/admin/contacts/:id/viewed', requireAdmin, asyncRoute(async (req, res) => {
  res.json(await prisma.contact.update({ where: { id: Number(req.params.id) }, data: { viewed: true } }));
}));
app.patch('/api/admin/contacts/:id', requireAdmin, asyncRoute(async (req, res) => {
  res.json(await prisma.contact.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status } }));
}));
app.delete('/api/admin/contacts/:id', requireAdmin, asyncRoute(async (req, res) => {
  await prisma.contact.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}));

app.get('/api/admin/content', requireAdmin, asyncRoute(async (_req, res) => {
  const [site, heroSlides, featureCards, retreats, about, localService, contactContent, contacts, footer, footerLinks, dynamicSections, menuItems] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.featureCard.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.retreat.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.localServiceContent.findUnique({ where: { id: 1 } }),
    prisma.contactContent.findUnique({ where: { id: 1 } }),
    prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.footerSetting.findUnique({ where: { id: 1 } }),
    prisma.footerLink.findMany({ orderBy: [{ groupName: 'asc' }, { sortOrder: 'asc' }] }),
    prisma.dynamicSection.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
    prisma.menuItem.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
  ]);
  res.json({ site, heroSlides, featureCards, retreats, about, localService, contactContent, contacts, footer, footerLinks, dynamicSections, menuItems });
}));

const singletonRoutes = [
  ['site', 'siteSetting'],
  ['about', 'aboutContent'],
  ['local-service', 'localServiceContent'],
  ['contact-content', 'contactContent'],
  ['footer', 'footerSetting'],
];
const requiredSingletonFields = {
  siteSetting: [['brandName', 'Brand name'], ['brandSuffix', 'Brand suffix'], ['logoUrl', 'Logo image'], ['phone', 'Phone'], ['email', 'Email'], ['address', 'Address']],
  aboutContent: [['title', 'Title'], ['accentTitle', 'Accent title'], ['description', 'Description'], ['image', 'About image']],
  localServiceContent: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['accentTitle', 'Accent title'], ['firstMeta', 'First card label'], ['firstTitle', 'First card text'], ['firstLinkLabel', 'First link label'], ['firstLinkUrl', 'First link URL'], ['secondMeta', 'Second card label'], ['secondTitle', 'Second card text'], ['secondLinkLabel', 'Second link label'], ['secondLinkUrl', 'Second link URL']],
  contactContent: [['title', 'Title'], ['accentTitle', 'Accent title'], ['description', 'Description'], ['formTitle', 'Form title'], ['background', 'Contact background']],
};
for (const [route, model] of singletonRoutes) {
  app.put(`/api/admin/${route}`, requireAdmin, asyncRoute(async (req, res) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = req.body;
    const missing = missingFields(data, requiredSingletonFields[model] || []);
    if (missing.length) return res.status(400).json({ error: requiredMessage(missing) });
    if (model === 'siteSetting' && !/^\d{3}-\d{3}-\d{4}$/.test(data.phone)) return res.status(400).json({ error: 'Phone must use the format 515-852-4156.' });
    if (model === 'siteSetting' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return res.status(400).json({ error: 'Enter a valid email, such as name@example.com.' });
    if (model === 'siteSetting') {
      const invalidRecipients = parseEmailList(data.notificationEmails).filter((email) => !validEmail(email));
      if (invalidRecipients.length) return res.status(400).json({ error: `Invalid notification ${invalidRecipients.length === 1 ? 'email' : 'emails'}: ${invalidRecipients.join(', ')}.` });
    }
    if (model === 'localServiceContent' && (!validCmsLink(data.firstLinkUrl) || !validCmsLink(data.secondLinkUrl))) return res.status(400).json({ error: 'Local Service links must start with https://, /, #, mailto:, or tel:.' });
    if (model === 'footerSetting' && data.facebookUrl && !validCmsLink(data.facebookUrl)) return res.status(400).json({ error: 'Facebook URL must start with https://.' });
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
const requiredCollectionFields = {
  heroSlide: [
    ['eyebrow', 'Eyebrow'],
    ['lineOne', 'Heading'],
    ['image', 'Slide image'],
  ],
  featureCard: [
    ['title', 'Title'],
    ['description', 'Description'],
    ['image', 'Card image'],
    ['ctaLabel', 'Button label'],
    ['ctaUrl', 'Button URL'],
  ],
  footerLink: [['groupName', 'Group'], ['label', 'Link label'], ['url', 'URL']],
  dynamicSection: [['menuLabel', 'Navigation label'], ['title', 'Section title']],
  menuItem: [['label', 'Menu label'], ['url', 'Destination']],
};
const missingRequiredFields = (model, input) => (requiredCollectionFields[model] || [])
  .filter(([key]) => typeof input[key] !== 'string' || !input[key].trim())
  .map(([, label]) => label);

for (const [route, model] of collectionRoutes) {
  app.post(`/api/admin/${route}`, requireAdmin, asyncRoute(async (req, res) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = req.body;
    const missing = missingRequiredFields(model, input);
    if (missing.length) return res.status(400).json({ error: `Please complete the required ${missing.length === 1 ? 'field' : 'fields'}: ${missing.join(', ')}.` });
    const linkKey = model === 'featureCard' ? 'ctaUrl' : model === 'footerLink' || model === 'menuItem' ? 'url' : model === 'dynamicSection' ? 'buttonUrl' : '';
    if (linkKey && input[linkKey] && !validCmsLink(input[linkKey])) return res.status(400).json({ error: 'Link must start with https://, /, #, mailto:, or tel:.' });
    let data = { ...input, sortOrder: Number(input.sortOrder || 0), active: input.active !== false };
    if (model === 'heroSlide') data = { ...data, lineOne: input.lineOne.trim(), lineTwo: '', lineThree: '' };
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
    const missing = missingRequiredFields(model, input);
    if (missing.length) return res.status(400).json({ error: `Please complete the required ${missing.length === 1 ? 'field' : 'fields'}: ${missing.join(', ')}.` });
    const linkKey = model === 'featureCard' ? 'ctaUrl' : model === 'footerLink' || model === 'menuItem' ? 'url' : model === 'dynamicSection' ? 'buttonUrl' : '';
    if (linkKey && input[linkKey] && !validCmsLink(input[linkKey])) return res.status(400).json({ error: 'Link must start with https://, /, #, mailto:, or tel:.' });
    let data = { ...input, sortOrder: Number(input.sortOrder || 0), active: input.active !== false };
    if (model === 'heroSlide') data = { ...data, lineOne: input.lineOne.trim(), lineTwo: '', lineThree: '' };
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
