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
const serviceDetails = {
  'Auto Insurance': ['Stay protected wherever the road takes you with coverage built around your vehicle, driving habits, and budget.', 'Liability and collision options', 'Comprehensive vehicle protection', 'Uninsured motorist coverage', 'Flexible deductibles and premiums'],
  'Home Insurance': ['Protect your home, personal belongings, and financial security with a policy tailored to the way you live.', 'Dwelling and property coverage', 'Personal belongings protection', 'Personal liability options', 'Additional living expenses'],
  'Recreational Vehicles': ['Enjoy every journey with dependable protection for your camper, motorhome, trailer, or recreational vehicle.', 'Collision and comprehensive coverage', 'Roadside assistance options', 'Personal property protection', 'Vacation liability coverage'],
  'Pet Insurance': ['Prepare for unexpected veterinary expenses with practical coverage for the four-legged members of your family.', 'Accident and illness options', 'Emergency veterinary care', 'Diagnostic and treatment coverage', 'Plans for different life stages'],
  'Dental Service': ['Maintain a healthy smile with dental plans designed for individuals and families.', 'Preventive care coverage', 'Basic and major services', 'Individual and family options', 'Access to trusted providers'],
  Disability: ['Protect your income and financial stability when an illness or injury keeps you from working.', 'Short-term disability options', 'Long-term income protection', 'Custom benefit periods', 'Coverage tailored to your occupation'],
  'Health Insurance': ['Find health coverage that balances dependable benefits, provider access, and affordable premiums.', 'Individual and family plans', 'Preventive care benefits', 'Prescription coverage options', 'Multiple carrier comparisons'],
  'Workers Compensation': ['Help protect your employees and business with workers compensation coverage suited to your operation.', 'Workplace injury protection', 'Medical expense coverage', 'Lost wage benefits', 'Employer liability protection'],
  'Crop Insurance': ['Safeguard your operation against unpredictable weather, yield loss, and changing market conditions.', 'Yield and revenue protection', 'Weather-related loss coverage', 'Policies suited to your acreage', 'Local agricultural expertise'],
};

if (await prisma.retreat.count() === 0) {
  await prisma.retreat.createMany({
    data: services.map(([name, bed, bath, image, style]) => ({ name, price: 0, bed, bath, image, style })),
  });
}
for (const [name, [detailDescription, benefitOne, benefitTwo, benefitThree, benefitFour]] of Object.entries(serviceDetails)) {
  await prisma.retreat.updateMany({
    where: { name, detailDescription: '' },
    data: { detailDescription, benefitOne, benefitTwo, benefitThree, benefitFour, quoteLabel: 'Request your free quote', quoteUrl: '/contact' },
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
await prisma.localServiceContent.upsert({
  where: { id: 1 }, update: {},
  create: { id: 1, eyebrow: 'LOCAL SERVICE', title: 'People who', accentTitle: 'know your needs.', firstMeta: 'EXPERIENCE · PERSONAL SERVICE', firstTitle: 'Shannon Muhlenbruch, Mikyla Hefli, and Eric Bruns are here to help.', firstLinkLabel: 'Call our team', firstLinkUrl: 'tel:5158524156', secondMeta: 'MONDAY–FRIDAY · 8AM–5PM', secondTitle: 'Friendly guidance, free quotes, and access to more than 15 companies.', secondLinkLabel: 'Request a quote', secondLinkUrl: '#contact' },
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
