import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const services = [
  ['Auto Insurance', 'Personal coverage', '15+ carriers', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85', 'cabin'],
  ['Home Insurance', 'Home protection', 'Custom plans', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85', 'lodge'],
  ['Recreational Vehicles', 'RV coverage', 'Flexible plans', 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=900&q=85', 'treehouse'],
  ['Pet Insurance', 'Pet protection', 'Trusted coverage', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85', 'cabin'],
  ['Dental Service', 'Dental coverage', 'Family plans', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=85', 'lodge'],
  ['Disability', 'Income protection', 'Custom plans', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85', 'treehouse'],
  ['Health Insurance', 'Health coverage', 'Multiple carriers', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=85', 'cabin'],
  ['Workers Compensation', 'Business coverage', 'Worker protection', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=85', 'lodge'],
  ['Crop Insurance', 'Farm protection', 'Local expertise', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85', 'treehouse'],
];

if (await prisma.retreat.count() === 0) {
  await prisma.retreat.createMany({
    data: services.map(([name, bed, bath, image, style]) => ({ name, price: 0, bed, bath, image, style })),
  });
}
await prisma.siteSetting.upsert({
  where: { id: 1 },
  update: {},
  create: { id: 1 },
});
if (await prisma.heroSlide.count() === 0) {
  await prisma.heroSlide.createMany({ data: [
    { eyebrow: 'Protection You Can Trust', lineOne: 'Protecting what', lineTwo: 'matters most,', lineThree: 'beautifully.', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=90', sortOrder: 1 },
    { eyebrow: 'Coverage Made Personal', lineOne: 'Insurance for', lineTwo: 'the life you', lineThree: 'are building.', image: '/dedicated-agents.jpg', sortOrder: 2 },
    { eyebrow: 'Experienced Local Guidance', lineOne: 'Local advice.', lineTwo: 'Lasting', lineThree: 'confidence.', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=90', sortOrder: 3 },
    { eyebrow: 'Plans For Every Chapter', lineOne: 'Your future,', lineTwo: 'thoughtfully', lineThree: 'protected.', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=90', sortOrder: 4 },
  ]});
}
if (await prisma.featureCard.count() === 0) {
  await prisma.featureCard.createMany({ data: [
    { title: 'Affordable Coverage', description: 'Complete insurance coverage with low premiums and less out-of-pocket expense.', image: '/affordable-coverage.png', ctaLabel: 'Get a free quote', sortOrder: 1 },
    { title: 'Wide Policy Choice', description: 'More than 15 represented companies help us find the right coverage for you.', image: '/wide-policy-choice.jpg', ctaLabel: 'Find your plan', sortOrder: 2 },
    { title: 'Dedicated Agents', description: 'Experienced agents focused on your needs and a plan made specifically for you.', image: '/dedicated-agents.jpg', ctaLabel: 'Contact us today', sortOrder: 3 },
  ]});
}
await prisma.aboutContent.upsert({
  where: { id: 1 }, update: {},
  create: { id: 1, eyebrow: 'ABOUT US', title: 'Experienced agents', accentTitle: 'working for you.', description: 'For over 10 years, our insurance agency has worked with many national and regional insurance companies to offer you the best prices and coverage available.', image: '/about-agent.png', bulletOne: 'Customized insurance plans', bulletTwo: 'Plenty of add-ons to choose from', bulletThree: 'Low premiums that work for your budget', bulletFour: 'Personal service Monday–Friday, 8am–5pm' },
});
await prisma.contactContent.upsert({
  where: { id: 1 }, update: {},
  create: { id: 1, eyebrow: 'CONTACT US', title: 'Let’s protect', accentTitle: 'what you’ve built.', description: 'Tell us what matters to you. Our local team will compare options and help you find thoughtful coverage.', formTitle: 'How can we help?', background: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=90' },
});
await prisma.footerSetting.upsert({
  where: { id: 1 }, update: {},
  create: { id: 1, copyright: 'Copyright © muhlenbruchinsuranceagency.com 2026', tagline: 'Protection You Can Trust · Dows, Iowa', facebookUrl: 'https://www.facebook.com/', background: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70' },
});
if (await prisma.footerLink.count() === 0) {
  await prisma.footerLink.createMany({ data: [
    { groupName: 'INSURANCE', label: 'All coverage', url: '/insurance', sortOrder: 1 },
    { groupName: 'INSURANCE', label: 'Auto insurance', url: '/insurance/1', sortOrder: 2 },
    { groupName: 'INSURANCE', label: 'Home insurance', url: '/insurance/2', sortOrder: 3 },
    { groupName: 'AGENCY', label: 'About us', url: '/about', sortOrder: 1 },
    { groupName: 'AGENCY', label: 'Contact', url: '/contact', sortOrder: 2 },
    { groupName: 'AGENCY', label: 'Admin', url: '/admin', sortOrder: 3 },
  ]});
}
if (await prisma.menuItem.count() === 0) {
  await prisma.menuItem.createMany({ data: [
    { label: 'Home', url: '/', sortOrder: 1 },
    { label: 'Insurance', url: '#stays', sortOrder: 2 },
    { label: 'About', url: '#experiences', sortOrder: 3 },
    { label: 'Contact Us', url: '#contact', sortOrder: 4 },
  ]});
}
await prisma.$disconnect();
console.log(`Seeded complete CMS content and ${services.length} insurance services.`);
