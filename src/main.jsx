import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Bath, BedDouble, Calendar, Camera, ChevronLeft, ChevronRight, CircleStar, Clock,
  Leaf, MapPin, Menu, MessageCircle, Mountain, Sparkles, Trees, Utensils, ClipboardList,
  ImageUp, LayoutDashboard, LogOut, Mail, Pencil, Phone, Play, Plus, Star, Trash2, X
} from 'lucide-react';
import './styles.css';

const initialRetreats = [
  { id: 1, name: 'Auto Insurance', price: 'Free quote', bed: 'Personal coverage', bath: '15+ carriers', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85', className: 'cabin' },
  { id: 2, name: 'Home Insurance', price: 'Free quote', bed: 'Home protection', bath: 'Custom plans', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85', className: 'lodge' },
  { id: 3, name: 'Recreational Vehicles', price: 'Free quote', bed: 'RV coverage', bath: 'Flexible plans', image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=900&q=85', className: 'treehouse' },
  { id: 4, name: 'Pet Insurance', price: 'Free quote', bed: 'Pet protection', bath: 'Trusted coverage', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85', className: 'cabin' },
  { id: 5, name: 'Dental Service', price: 'Free quote', bed: 'Dental coverage', bath: 'Family plans', image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=85', className: 'lodge' },
  { id: 6, name: 'Disability', price: 'Free quote', bed: 'Income protection', bath: 'Custom plans', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85', className: 'treehouse' },
  { id: 7, name: 'Health Insurance', price: 'Free quote', bed: 'Health coverage', bath: 'Multiple carriers', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=85', className: 'cabin' },
  { id: 8, name: 'Workers Compensation', price: 'Free quote', bed: 'Business coverage', bath: 'Worker protection', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=85', className: 'lodge' },
  { id: 9, name: 'Crop Insurance', price: 'Free quote', bed: 'Farm protection', bath: 'Local expertise', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85', className: 'treehouse' },
];

const amenities = [
  { image: '/affordable-coverage.png', title: 'Affordable Coverage', text: 'Complete insurance coverage with low premiums and less out-of-pocket expense.' },
  { image: '/wide-policy-choice.jpg', title: 'Wide Policy Choice', text: 'More than 15 represented companies help us find the right coverage for you.' },
  { image: '/dedicated-agents.jpg', title: 'Dedicated Agents', text: 'Experienced agents focused on your needs and a plan made specifically for you.' },
];

const reveal = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

const insuranceDetails = {
  'Auto Insurance': { intro: 'Stay protected wherever the road takes you with coverage built around your vehicle, driving habits, and budget.', benefits: ['Liability and collision options', 'Comprehensive vehicle protection', 'Uninsured motorist coverage', 'Flexible deductibles and premiums'] },
  'Home Insurance': { intro: 'Protect your home, personal belongings, and financial security with a policy tailored to the way you live.', benefits: ['Dwelling and property coverage', 'Personal belongings protection', 'Personal liability options', 'Additional living expenses'] },
  'Recreational Vehicles': { intro: 'Enjoy every journey with dependable protection for your camper, motorhome, trailer, or recreational vehicle.', benefits: ['Collision and comprehensive coverage', 'Roadside assistance options', 'Personal property protection', 'Vacation liability coverage'] },
  'Pet Insurance': { intro: 'Prepare for unexpected veterinary expenses with practical coverage for the four-legged members of your family.', benefits: ['Accident and illness options', 'Emergency veterinary care', 'Diagnostic and treatment coverage', 'Plans for different life stages'] },
  'Dental Service': { intro: 'Maintain a healthy smile with dental plans designed for individuals and families.', benefits: ['Preventive care coverage', 'Basic and major services', 'Individual and family options', 'Access to trusted providers'] },
  'Disability': { intro: 'Protect your income and financial stability when an illness or injury keeps you from working.', benefits: ['Short-term disability options', 'Long-term income protection', 'Custom benefit periods', 'Coverage tailored to your occupation'] },
  'Health Insurance': { intro: 'Find health coverage that balances dependable benefits, provider access, and affordable premiums.', benefits: ['Individual and family plans', 'Preventive care benefits', 'Prescription coverage options', 'Multiple carrier comparisons'] },
  'Workers Compensation': { intro: 'Help protect your employees and business with workers compensation coverage suited to your operation.', benefits: ['Workplace injury protection', 'Medical expense coverage', 'Lost wage benefits', 'Employer liability protection'] },
  'Crop Insurance': { intro: 'Safeguard your operation against unpredictable weather, yield loss, and changing market conditions.', benefits: ['Yield and revenue protection', 'Weather-related loss coverage', 'Policies suited to your acreage', 'Local agricultural expertise'] },
};

const heroSlides = [
  { eyebrow: 'Protection You Can Trust', lines: ['Protecting what', 'matters most,', 'beautifully.'], image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=90' },
  { eyebrow: 'Coverage Made Personal', lines: ['Insurance for', 'the life you', 'are building.'], image: '/dedicated-agents.jpg' },
  { eyebrow: 'Experienced Local Guidance', lines: ['Local advice.', 'Lasting', 'confidence.'], image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=90' },
  { eyebrow: 'Plans For Every Chapter', lines: ['Your future,', 'thoughtfully', 'protected.'], image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=90' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [retreats, setRetreats] = useState(initialRetreats);
  const [cms, setCms] = useState(null);
  const [contactSent, setContactSent] = useState(false);
  const activeHeroSlides = cms?.heroSlides?.length ? cms.heroSlides.map((slide) => ({ ...slide, lines: [slide.lineOne, slide.lineTwo, slide.lineThree] })) : heroSlides;
  const displayAmenities = cms?.featureCards?.length ? cms.featureCards.map((card) => ({ ...card, text: card.description })) : amenities;
  const aboutContent = cms?.about;
  const contactCms = cms?.contactContent;
  const footerCms = cms?.footer;
  const footerLinks = cms?.footerLinks || [];
  const dynamicSections = cms?.dynamicSections || [];
  const navigationItems = cms ? (cms.menuItems || []) : [
    {id:'home',label:'Home',url:'/'},{id:'insurance',label:'Insurance',url:'#stays'},
    {id:'about',label:'About',url:'#experiences'},{id:'contact',label:'Contact Us',url:'#contact'},
  ];
  const footerGroups = footerLinks.reduce((groups, link) => ({ ...groups, [link.groupName]: [...(groups[link.groupName] || []), link] }), {});
  const location = useLocation();
  useEffect(() => {
    fetch('/api/retreats').then((response) => response.ok ? response.json() : Promise.reject()).then(setRetreats).catch(() => {});
    fetch('/api/content').then((response) => response.ok ? response.json() : Promise.reject()).then(setCms).catch(() => {});
  }, []);
  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY >= 60);
    updateScroll(); window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % activeHeroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, [activeHeroSlides.length]);
  useEffect(() => {
    const section = location.pathname === '/about' ? 'sustainability' : location.pathname === '/insurance' ? 'stays' : location.pathname.slice(1);
    if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [location.pathname]);
  const submitContact = (event) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(() => { form.reset(); setContactSent(true); })
      .catch(() => setContactSent('error'));
  };
  const heroSlide = activeHeroSlides[heroIndex] || activeHeroSlides[0];
  const changeHero = (direction) => setHeroIndex((index) => (index + direction + activeHeroSlides.length) % activeHeroSlides.length);
  return <>
    <header className={`topbar luxury-nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="brand" aria-label="Mühlenbruch Insurance home"><img className="brand-logo" src={cms?.site?.logoUrl || '/muhlenbruch-insurance-logo.jpg'} alt=""/><span>{cms?.site?.brandName || 'MÜHLENBRUCH'}</span><small>{cms?.site?.brandSuffix || 'INSURANCE'}</small></Link>
      <nav className={menuOpen ? 'navlinks open' : 'navlinks'} aria-label="Primary navigation">
        {navigationItems.map((item)=>item.url.startsWith('/')?<Link key={item.id} onClick={()=>setMenuOpen(false)} to={item.url}>{item.label}</Link>:<a key={item.id} onClick={()=>setMenuOpen(false)} href={item.url}>{item.label}</a>)}
      </nav>
      <Link to="/admin" className="button button-dark nav-cta">Admin <ArrowUpRight size={16}/></Link>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
    </header>
    <main id="home">
      <section className="luxury-hero">
        <div className="luxury-media"><AnimatePresence mode="wait"><motion.img key={heroIndex} src={heroSlide.image} alt="" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1.2,ease:[.22,1,.36,1]}}/></AnimatePresence></div>
        <div className="luxury-top-blend"/><div className="luxury-left-grade"/><div className="luxury-warm-grade"/><div className="luxury-bottom-grade"/><div className="luxury-bloom"/>
        <div className="luxury-inner section-shell"><AnimatePresence mode="wait"><motion.div className="luxury-copy" key={heroIndex} initial="hidden" animate="visible" exit="exit" variants={{hidden:{opacity:0,y:40},visible:{opacity:1,y:0,transition:{duration:1.2,ease:[.22,1,.36,1],staggerChildren:.12}},exit:{opacity:0,y:-20,transition:{duration:.5}}}}><motion.div className="luxury-eyebrow" variants={reveal}><span></span>{heroSlide.eyebrow}</motion.div><h1>{heroSlide.lines.map((line,index)=><motion.span key={line} className={index===1?'accent-line':''} variants={reveal}>{line}</motion.span>)}</h1><motion.div className="luxury-ctas" variants={reveal}><Link to="/insurance" className="luxury-primary">Explore Coverage <ArrowRight size={17}/></Link><Link to="/contact" className="luxury-secondary">Book Consultation</Link></motion.div><motion.div className="luxury-stats" variants={reveal}><div><strong>10+</strong><small>Years</small></div><i></i><div><strong>15+</strong><small>Companies</small></div><i></i><div><strong>9</strong><small>Coverage Areas</small></div></motion.div></motion.div></AnimatePresence></div>
        <motion.aside className="featured-glass" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{delay:1,duration:.8}}><p>✦ Featured Protection</p><h3>Complete Coverage</h3><span>DOWS, IOWA</span><div className="featured-meta"><div><small>Service</small><b>Personal</b></div><div><small>Carriers</small><b>15+</b></div><div><small>Quote</small><b>Free</b></div></div><div className="progress-pill"><i className="tag-pulse"></i>Now Available</div></motion.aside>
        <div className="luxury-scroll"><span>Scroll</span><i className="scroll-line"></i></div><div className="luxury-vertical">{cms?.site?.tagline || 'PROTECTION YOU CAN TRUST'} — 2026</div><div className="hero-dots">{activeHeroSlides.map((slide,index)=><button key={slide.id || slide.eyebrow} className={index===heroIndex?'active':''} onClick={()=>setHeroIndex(index)} aria-label={`Show ${slide.eyebrow}`}/>)}</div>
      </section>
      <section className="amenities section-shell butterfly-section">
        <span className="feature-butterfly butterfly-one" aria-hidden="true"><i></i><i></i><b></b></span><span className="feature-butterfly butterfly-two" aria-hidden="true"><i></i><i></i><b></b></span>
        {displayAmenities.map(({image,title,text,ctaLabel,ctaUrl},index) => <motion.article key={title} className="amenity amenity-card" initial={{opacity:0,y:index===1?65:35,x:index===0?-75:index===2?75:0,rotateY:index===0?35:index===2?-35:0,filter:'blur(14px)'}} whileInView={{opacity:1,y:0,x:0,rotateY:0,filter:'blur(0px)'}} whileHover={{y:-12,rotateX:-2,rotateY:index===0?3:index===2?-3:0,scale:1.015}} viewport={{once:true, amount:.3}} transition={{type:'spring',stiffness:105,damping:17,delay:index*.14}}><div className="amenity-photo"><img src={image} alt="" loading="lazy"/><span>0{index+1}</span></div><div><h3>{title}</h3><p>{text}</p><Link to={ctaUrl || '/contact'} className="amenity-link">{ctaLabel || (index === 0 ? 'Get a free quote' : index === 1 ? 'Find your plan' : 'Contact us today')} <ArrowRight size={14}/></Link></div></motion.article>)}
      </section>
      <section className="stays section-shell" id="stays">
        <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{duration:.8}}><div><p className="eyebrow">INSURANCE FOR REAL LIFE <span></span></p><h2>Coverage for <em>every chapter.</em></h2></div><a className="text-link" href="#contact">Get a free quote <ArrowRight size={17}/></a></motion.div>
        <InsuranceCarousel services={retreats}/>
      </section>
      <section className="experience section-shell about-3d" id="experiences">
        <motion.div className="experience-image about-3d-image" initial={{opacity:0,y:40,rotateY:10}} whileInView={{opacity:1,y:0,rotateY:0}} whileHover={{y:-10,rotateY:-4,rotateX:2}} viewport={{once:true}} transition={{type:'spring',stiffness:90,damping:17}}><span className="about-orbit orbit-one"></span><span className="about-orbit orbit-two"></span><img src={aboutContent?.image || '/about-agent.png'} alt="Experienced Mühlenbruch insurance agent helping a family" loading="lazy"/><div className="image-label"><CircleStar size={16}/><span>Serving Iowa<br/>for 10+ years</span></div><div className="about-float-stat"><strong>15+</strong><span>INSURANCE<br/>COMPANIES</span></div><div className="about-shine"></div></motion.div>
        <motion.div className="experience-copy" initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{duration:.8, delay:.1}}><p className="eyebrow">{aboutContent?.eyebrow || 'ABOUT US'} <span></span></p><h2>{aboutContent?.title || 'Experienced agents'}<br/><em>{aboutContent?.accentTitle || 'working for you.'}</em></h2><p>{aboutContent?.description || 'For over 10 years, our insurance agency has worked with many national and regional insurance companies to offer you the best prices and coverage available.'}</p><div className="experience-list">{(aboutContent ? [aboutContent.bulletOne,aboutContent.bulletTwo,aboutContent.bulletThree,aboutContent.bulletFour] : ['Customized insurance plans','Plenty of add-ons to choose from','Low premiums that work for your budget','Personal service Monday–Friday, 8am–5pm']).filter(Boolean).map((item,index)=><motion.a href="#contact" key={item} initial={{opacity:0,x:-15}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:.25+index*.1}}><span>0{index+1}</span>{item}<ChevronRight size={18}/></motion.a>)}</div><a href="#contact" className="button button-dark">Meet your coverage needs <ArrowRight size={17}/></a></motion.div>
      </section>
      <section className="story" id="sustainability"><div className="story-inner section-shell"><motion.div className="story-copy" initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{duration:.8}}><p className="eyebrow light">OUR COMMITMENT <span></span></p><h2>Coverage that <em>works for you.</em></h2><p>We strive to provide the lowest practical costs. By learning your needs and providing personal service, we build protection that fits your budget and keeps you covered when it matters.</p><a href="#contact" className="button button-cream">Get your free quote <ArrowRight size={17}/></a></motion.div><motion.div className="story-image" initial={{opacity:0,scale:.96}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:1}}><img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1400&q=90" alt="A happy family enjoying time together at home" loading="lazy"/><div className="story-stamp"><Leaf size={25}/><span>PROTECTION<br/>YOU CAN<br/>TRUST</span></div></motion.div></div></section>
      <section className="journal section-shell" id="journal"><motion.div className="journal-intro" initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal}><p className="eyebrow">LOCAL SERVICE <span></span></p><h2>People who<br/><em>know your needs.</em></h2></motion.div><motion.article initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{delay:.15}}><p>EXPERIENCE · PERSONAL SERVICE</p><h3>Shannon Muhlenbruch, Mikyla Hefli, and Eric Bruns are here to help.</h3><a href="tel:5158524156">Call our team <ArrowRight size={16}/></a></motion.article><motion.article initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{delay:.25}}><p>MONDAY–FRIDAY · 8AM–5PM</p><h3>Friendly guidance, free quotes, and access to more than 15 companies.</h3><a href="#contact">Request a quote <ArrowRight size={16}/></a></motion.article></section>
      {dynamicSections.map((section,index)=><DynamicWebsiteSection key={section.id} section={section} index={index}/>)}
      <section className="contact-split section-shell" id="contact"><div className="contact-split-card" style={contactCms?.background ? {backgroundImage:`url(${contactCms.background})`} : undefined}><motion.div className="contact-split-copy" initial={{opacity:0,x:-35}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.8}}><p className="eyebrow light">{contactCms?.eyebrow || 'CONTACT US'} <span></span></p><h2>{contactCms?.title || 'Let’s protect'}<br/><em>{contactCms?.accentTitle || 'what you’ve built.'}</em></h2><p>{contactCms?.description || 'Tell us what matters to you. Our local team will compare options and help you find thoughtful coverage.'}</p><div className="contact-direct"><a href={`tel:${(cms?.site?.phone || '515-852-4156').replace(/\D/g,'')}`}><Phone size={17}/><span><small>CALL OUR TEAM</small>{cms?.site?.phone || '515-852-4156'}</span></a><a href={`mailto:${cms?.site?.email || 'muhlenbruchinsurance@hotmail.com'}`}><Mail size={17}/><span><small>EMAIL US</small>{cms?.site?.email || 'muhlenbruchinsurance@hotmail.com'}</span></a><a href="#contact"><MapPin size={17}/><span><small>VISIT</small>{cms?.site?.address || '110 East Ellsworth, Dows, Iowa'}</span></a></div></motion.div><motion.form className="contact-split-form" onSubmit={submitContact} initial={{opacity:0,x:35}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.8,delay:.12}}><p>REQUEST A FREE QUOTE</p><h3>{contactCms?.formTitle || 'How can we help?'}</h3><div><label><span>Your name</span><input name="name" required placeholder="Jane Smith"/></label><label><span>Email address</span><input name="email" type="email" required placeholder="jane@example.com"/></label></div><label><span>Your message</span><textarea name="message" required placeholder="Tell us what you would like to protect..."/></label><button type="submit">Send enquiry <ArrowUpRight size={17}/></button><small>{contactSent ? 'Thank you — our team will contact you shortly.' : 'Your information stays private and secure.'}</small></motion.form></div></section>
    </main>
    <footer className="footer-v4" style={footerCms?.background ? {'--footer-background':`url(${footerCms.background})`} : undefined}><div className="footer-v4-shell section-shell"><Link to="/" className="footer-v4-logo"><img src={cms?.site?.logoUrl || '/muhlenbruch-insurance-logo.jpg'} alt="Mühlenbruch Insurance"/><span><b>{cms?.site?.brandName || 'MÜHLENBRUCH'}</b><small>{cms?.site?.brandSuffix || 'INSURANCE'}</small></span></Link><div className="footer-v4-links">{Object.keys(footerGroups).length ? Object.entries(footerGroups).map(([group,links])=><div key={group}><small>{group}</small>{links.map((link)=><Link key={link.id} to={link.url}>{link.label}</Link>)}</div>) : <><div><small>INSURANCE</small><Link to="/insurance">All coverage</Link><Link to="/insurance/1">Auto insurance</Link><Link to="/insurance/2">Home insurance</Link></div><div><small>AGENCY</small><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/admin">Admin</Link></div></>}</div><div className="footer-v4-trust"><span className="tag-pulse"></span><div><b>{cms?.site?.tagline || 'Protection you can trust'}</b><small>{footerCms?.tagline || 'Serving Iowa for more than 10 years.'}</small></div></div><div className="footer-v4-legal"><span>{footerCms?.copyright || 'Copyright © muhlenbruchinsuranceagency.com 2026'}</span><a className="footer-facebook" href={footerCms?.facebookUrl || 'https://www.facebook.com/'} target="_blank" rel="noreferrer"><b>f</b> Facebook</a><span>{cms?.site?.address || 'Dows, Iowa'} · {cms?.site?.phone || '515-852-4156'}</span></div></div></footer>
  </>;
}

function DynamicWebsiteSection({section,index}) {
  const imageRight=section.imageSide==='right';
  return <section id={`section-${section.id}`} className={`dynamic-web-section ${imageRight?'image-right':''}`}><div className="section-shell dynamic-web-inner"><motion.div className="dynamic-web-image" initial={{opacity:0,x:imageRight?45:-45,rotateY:imageRight?-8:8}} whileInView={{opacity:1,x:0,rotateY:0}} viewport={{once:true,amount:.25}} transition={{duration:.85,ease:[.22,1,.36,1]}}>{section.image?<img src={section.image} alt={section.title} loading="lazy"/>:<span><ImageUp size={30}/>Section image</span>}<b>{String(index+1).padStart(2,'0')}</b></motion.div><motion.div className="dynamic-web-copy" initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.8,delay:.1}}><p className="eyebrow">{section.eyebrow}<span></span></p><h2>{section.title}<br/><em>{section.accentTitle}</em></h2><p>{section.description}</p>{section.buttonLabel&&<a className="button button-dark" href={section.buttonUrl||'#contact'}>{section.buttonLabel}<ArrowRight size={16}/></a>}</motion.div></div></section>;
}

function InsuranceCarousel({ services }) {
  const [active, setActive] = useState(0);
  useEffect(() => { if (active >= services.length) setActive(0); }, [services.length, active]);
  useEffect(() => {
    if (services.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % services.length), 2000);
    return () => window.clearInterval(timer);
  }, [services.length]);
  if (!services.length) return null;
  const move = (direction) => setActive((index) => (index + direction + services.length) % services.length);
  const getOffset = (index) => {
    let offset = index - active;
    if (offset > services.length / 2) offset -= services.length;
    if (offset < -services.length / 2) offset += services.length;
    return offset;
  };
  return <div className="insurance-carousel"><motion.div className="carousel-stage" drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.12} onDragEnd={(_,info) => { if (info.offset.x < -45) move(1); if (info.offset.x > 45) move(-1); }}>{services.map((service,index) => {
    const offset = getOffset(index); const distance = Math.abs(offset); const visible = distance <= 2;
    return <motion.article key={service.id} className={`carousel-card ${offset === 0 ? 'active' : ''}`} initial={false} animate={{x:`${offset * 82}%`,y:distance * 25,scale:offset === 0 ? 1 : distance === 1 ? .91 : .81,rotateY:offset * -13,rotateZ:offset * 1.5,opacity:visible ? 1 : 0,z:offset === 0 ? 100 : 0}} transition={{type:'spring',stiffness:170,damping:23,mass:.8}} style={{zIndex:10-distance,pointerEvents:visible?'auto':'none'}} onClick={() => offset !== 0 && setActive(index)}><Link to={offset === 0 ? `/insurance/${service.id}` : '#'} onClick={(event) => offset !== 0 && event.preventDefault()}><div className="carousel-image"><img src={service.image} alt={service.name} loading="lazy"/><span className="carousel-number">{String(index+1).padStart(2,'0')}</span><span className="image-arrow"><ArrowUpRight size={19}/></span></div><div className="carousel-info"><p>{service.bed}</p><h3>{service.name}</h3><span>Explore coverage <ArrowRight size={14}/></span></div></Link></motion.article>;
  })}</motion.div><div className="carousel-controls"><button onClick={() => move(-1)} aria-label="Previous insurance"><ChevronLeft size={19}/></button><div className="carousel-progress">{services.map((service,index) => <button key={service.id} className={index===active?'active':''} onClick={() => setActive(index)} aria-label={`Show ${service.name}`}/>)}</div><button onClick={() => move(1)} aria-label="Next insurance"><ChevronRight size={19}/></button></div><p className="carousel-hint">Drag to explore · Select a card to view details</p></div>;
}

function AdminDashboard({ retreats, setRetreats, contacts, setContacts, onClose }) {
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const blank = { name: '', price: '$400', bed: '1 king bed', bath: '1 bath', image: '', className: 'cabin' };
  const [form, setForm] = useState(blank);
  const saveRetreat = (event) => {
    event.preventDefault();
    if (editing) setRetreats((list) => list.map((item) => item.id === editing ? { ...form, id: editing } : item));
    else setRetreats((list) => [...list, { ...form, id: Date.now(), image: form.image || initialRetreats[0].image }]);
    setEditing(null); setForm(blank);
  };
  if (!signedIn) return <main className="admin-login"><button className="admin-back" onClick={onClose}>← Back to Pinehaven</button><div className="google-card"><div className="google-mark"><span>G</span></div><h1>Welcome to Pinehaven</h1><p>Sign in to manage retreats and guest enquiries.</p><button className="google-signin" onClick={() => setSignedIn(true)}><span className="google-g">G</span> Continue with Google</button><small>Demo sign-in · no account details are collected</small></div></main>;
  return <main className="admin-app"><aside className="admin-sidebar"><a className="brand" href="#admin"><Leaf size={22}/><span>PINEHAVEN</span><small>ADMIN CONSOLE</small></a><div className="admin-nav"><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}><LayoutDashboard size={18}/> Overview</button><button className={tab === 'retreats' ? 'active' : ''} onClick={() => setTab('retreats')}><Trees size={18}/> Retreats</button><button className={tab === 'contacts' ? 'active' : ''} onClick={() => setTab('contacts')}><Mail size={18}/> Enquiries <b>{contacts.length}</b></button></div><button className="logout" onClick={onClose}><LogOut size={17}/> Exit admin</button></aside><section className="admin-content"><header className="admin-header"><div><p>ADMINISTRATION</p><h1>{tab === 'overview' ? 'Good morning, Pinehaven.' : tab === 'retreats' ? 'Retreat collection' : 'Guest enquiries'}</h1></div><div className="admin-user"><span>AH</span><div>Alex Harper<small>Administrator</small></div></div></header>{tab === 'overview' && <><div className="stats"><article><span>ACTIVE RETREATS</span><strong>{retreats.length}</strong><small>Available to book</small></article><article><span>NEW ENQUIRIES</span><strong>{contacts.length}</strong><small>All contact form submissions</small></article><article><span>AVERAGE NIGHTLY</span><strong>${Math.round(retreats.reduce((sum, item) => sum + Number(String(item.price).replace(/\D/g, '')), 0) / (retreats.length || 1))}</strong><small>Across your retreat collection</small></article></div><div className="admin-panel"><div className="panel-title"><h2>Recent guest enquiries</h2><button onClick={() => setTab('contacts')}>View all <ArrowRight size={15}/></button></div>{contacts.length ? contacts.slice(0, 4).map((contact) => <div className="contact-row" key={contact.id}><span className="contact-avatar">{contact.name?.charAt(0)}</span><div><b>{contact.name}</b><small>{contact.email}</small></div><p>{contact.message}</p><time>{contact.date}</time></div>) : <div className="empty-state">No enquiries yet. Submissions from the public contact form will appear here.</div>}</div></>}{tab === 'retreats' && <div className="admin-panel"><div className="panel-title"><h2>All retreats</h2><button className="admin-primary" onClick={() => { setEditing('new'); setForm(blank); }}><Plus size={16}/> Add retreat</button></div>{editing && <form className="retreat-form" onSubmit={saveRetreat}><h3>{editing === 'new' ? 'Add a retreat' : 'Edit retreat'}</h3>{[['name','Retreat name'],['price','Nightly price'],['bed','Bed details'],['bath','Bath details'],['image','Image URL']].map(([key,label]) => <label key={key}>{label}<input required={key !== 'image'} value={form[key]} onChange={(event) => setForm({...form, [key]: event.target.value})}/></label>)}<div className="form-actions"><button className="button button-dark" type="submit">Save retreat</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div></form>}<div className="admin-table">{retreats.map((item) => <div className="retreat-row" key={item.id}><img src={item.image} alt=""/><div><b>{item.name}</b><small>{item.bed} · {item.bath}</small></div><span>{item.price} / night</span><div><button aria-label={`Edit ${item.name}`} onClick={() => { setEditing(item.id); setForm(item); }}><Pencil size={16}/></button><button aria-label={`Delete ${item.name}`} onClick={() => setRetreats((all) => all.filter((entry) => entry.id !== item.id))}><Trash2 size={16}/></button></div></div>)}</div></div>}{tab === 'contacts' && <div className="admin-panel"><div className="panel-title"><h2>All enquiries</h2><button onClick={() => setContacts([])}>Clear list</button></div>{contacts.length ? contacts.map((contact) => <div className="contact-row full" key={contact.id}><span className="contact-avatar">{contact.name?.charAt(0)}</span><div><b>{contact.name}</b><small>{contact.email}</small></div><p>{contact.message}</p><time>{contact.date}</time><button aria-label="Delete enquiry" onClick={() => setContacts((all) => all.filter((entry) => entry.id !== contact.id))}><Trash2 size={16}/></button></div>) : <div className="empty-state">Your contact list is currently empty.</div>}</div>}</section></main>;
}

const adminRequest = async (path, options = {}) => {
  const token = sessionStorage.getItem('pinehaven-admin-token');
  const binaryBody = options.body instanceof Blob || options.body instanceof FormData;
  const response = await fetch(path, {
    ...options,
    headers: { ...(binaryBody ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (response.status === 401) {
    sessionStorage.removeItem('pinehaven-admin-token');
    throw new Error('Unauthorized');
  }
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Request failed');
  return response.status === 204 ? null : response.json();
};

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(null);
  const googleButton = useRef(null);
  const login = async (credential) => {
    setLoading(true); setError('');
    try {
      const result = await adminRequest('/api/auth/google', { method: 'POST', body: JSON.stringify({credential}) });
      sessionStorage.setItem('pinehaven-admin-token', result.token);
      navigate('/admin', { replace: true });
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(()=>{
    let cancelled=false;
    const setup=async()=>{
      try{
        const config=await fetch('/api/auth/google-config').then((response)=>response.json());
        if(cancelled)return;
        setConfigured(config.configured);
        if(!config.configured){setError('Google OAuth Client ID is not configured yet.');return;}
        const render=()=>{
          if(cancelled||!googleButton.current||!window.google?.accounts?.id)return;
          window.google.accounts.id.initialize({client_id:config.clientId,callback:(response)=>login(response.credential)});
          googleButton.current.innerHTML='';
          window.google.accounts.id.renderButton(googleButton.current,{theme:'outline',size:'large',shape:'pill',text:'continue_with',width:320,logo_alignment:'left'});
        };
        if(window.google?.accounts?.id)render();
        else{
          let script=document.querySelector('script[data-google-identity]');
          if(!script){script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.dataset.googleIdentity='true';document.head.appendChild(script);}
          script.addEventListener('load',render,{once:true});
        }
      }catch{if(!cancelled)setError('Unable to load Google Sign-In.');}
    };
    setup();
    return()=>{cancelled=true;};
  },[]);
  if (sessionStorage.getItem('pinehaven-admin-token')) return <Navigate to="/admin" replace />;
  return <main className="admin-login"><Link className="admin-back" to="/">← Back to Mühlenbruch Insurance</Link><section className="google-card"><div className="google-mark logo-mark"><img src="/muhlenbruch-insurance-logo.jpg" alt="Mühlenbruch Insurance"/></div><h1>Welcome to Mühlenbruch</h1><p>Continue with an approved Google account to manage website content and enquiries.</p><div className={`google-button-host ${loading?'is-loading':''}`} ref={googleButton}>{configured===null&&!error?<span>Loading Google Sign-In…</span>:null}</div>{error&&<div className="login-error">{error}</div>}<small>Access is restricted to approved administrator accounts.</small></section></main>;
}

function DatabaseAdmin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [retreats, setRetreats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const blank = { name: '', price: 400, bed: '1 king bed', bath: '1 bath', image: '', style: 'cabin', active: true };
  const [form, setForm] = useState(blank);
  const load = async () => {
    try {
      const [stayData, contactData] = await Promise.all([adminRequest('/api/admin/retreats'), adminRequest('/api/admin/contacts')]);
      setRetreats(stayData); setContacts(contactData);
    } catch { navigate('/admin/login', { replace: true }); }
  };
  useEffect(() => { if (!sessionStorage.getItem('pinehaven-admin-token')) navigate('/admin/login', { replace: true }); else load(); }, []);
  const saveRetreat = async (event) => {
    event.preventDefault(); setError('');
    try {
      const saved = await adminRequest(editing && editing !== 'new' ? `/api/admin/retreats/${editing}` : '/api/admin/retreats', { method: editing && editing !== 'new' ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setRetreats((list) => editing && editing !== 'new' ? list.map((item) => item.id === saved.id ? saved : item) : [...list, saved]);
      setEditing(null); setForm(blank);
    } catch (err) { setError(err.message); }
  };
  const removeRetreat = async (id) => {
    if (!window.confirm('Delete this retreat permanently?')) return;
    await adminRequest(`/api/admin/retreats/${id}`, { method: 'DELETE' }); setRetreats((list) => list.filter((item) => item.id !== id));
  };
  const removeContact = async (id) => {
    await adminRequest(`/api/admin/contacts/${id}`, { method: 'DELETE' }); setContacts((list) => list.filter((item) => item.id !== id));
  };
  const logout = async () => {
    await adminRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
    sessionStorage.removeItem('pinehaven-admin-token'); navigate('/admin/login', { replace: true });
  };
  const average = Math.round(retreats.reduce((sum, item) => sum + Number(item.price), 0) / (retreats.length || 1));
  return <main className="admin-app"><aside className="admin-sidebar"><Link className="brand" to="/"><Leaf size={22}/><span>PINEHAVEN</span><small>ADMIN CONSOLE</small></Link><div className="admin-nav"><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}><LayoutDashboard size={18}/> Overview</button><button className={tab === 'retreats' ? 'active' : ''} onClick={() => setTab('retreats')}><Trees size={18}/> Retreats</button><button className={tab === 'contacts' ? 'active' : ''} onClick={() => setTab('contacts')}><Mail size={18}/> Enquiries <b>{contacts.length}</b></button></div><button className="logout" onClick={logout}><LogOut size={17}/> Sign out</button></aside><section className="admin-content"><header className="admin-header"><div><p>PRISMA · SQLITE</p><h1>{tab === 'overview' ? 'Pinehaven overview' : tab === 'retreats' ? 'Retreat collection' : 'Guest enquiries'}</h1></div><div className="admin-user"><span>PA</span><div>Pinehaven Admin<small>Database connected</small></div></div></header>{error && <div className="login-error">{error}</div>}{tab === 'overview' && <><div className="stats"><article><span>ACTIVE RETREATS</span><strong>{retreats.filter((item) => item.active).length}</strong><small>Published on the website</small></article><article><span>NEW ENQUIRIES</span><strong>{contacts.filter((item) => item.status === 'new').length}</strong><small>Stored in SQLite</small></article><article><span>AVERAGE NIGHTLY</span><strong>${average}</strong><small>Across your collection</small></article></div><ContactPanel contacts={contacts.slice(0, 4)} onDelete={removeContact} onViewAll={() => setTab('contacts')}/></>}{tab === 'retreats' && <div className="admin-panel"><div className="panel-title"><h2>All retreats</h2><button className="admin-primary" onClick={() => { setEditing('new'); setForm(blank); }}><Plus size={16}/> Add retreat</button></div>{editing && <form className="retreat-form" onSubmit={saveRetreat}><h3>{editing === 'new' ? 'Add retreat' : 'Edit retreat'}</h3>{[['name','Retreat name'],['price','Nightly price'],['bed','Bed details'],['bath','Bath details'],['image','Image URL']].map(([key,label]) => <label key={key}>{label}<input type={key === 'price' ? 'number' : 'text'} required value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })}/></label>)}<label>Card style<select value={form.style} onChange={(event) => setForm({ ...form, style: event.target.value })}><option value="cabin">Cabin</option><option value="lodge">Lodge</option><option value="treehouse">Treehouse</option></select></label><label className="checkbox-label"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })}/> Visible on website</label><div className="form-actions"><button className="button button-dark">Save retreat</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div></form>}<div className="admin-table">{retreats.map((item) => <div className="retreat-row" key={item.id}><img src={item.image} alt=""/><div><b>{item.name}</b><small>{item.bed} · {item.bath}{!item.active && ' · Hidden'}</small></div><span>${item.price} / night</span><div><button aria-label={`Edit ${item.name}`} onClick={() => { setEditing(item.id); setForm(item); }}><Pencil size={16}/></button><button aria-label={`Delete ${item.name}`} onClick={() => removeRetreat(item.id)}><Trash2 size={16}/></button></div></div>)}</div></div>}{tab === 'contacts' && <ContactPanel contacts={contacts} onDelete={removeContact}/>}</section></main>;
}

function ContactPanel({ contacts, onDelete, onViewAll }) {
  return <div className="admin-panel"><div className="panel-title"><h2>Guest enquiries</h2>{onViewAll && <button onClick={onViewAll}>View all <ArrowRight size={15}/></button>}</div>{contacts.length ? contacts.map((contact) => <div className="contact-row full" key={contact.id}><span className="contact-avatar">{contact.name?.charAt(0).toUpperCase()}</span><div><b>{contact.name}</b><small>{contact.email}</small></div><p>{contact.message}</p><time>{new Date(contact.createdAt).toLocaleDateString()}</time><button aria-label="Delete enquiry" onClick={() => onDelete(contact.id)}><Trash2 size={16}/></button></div>) : <div className="empty-state">No enquiries yet. New contact submissions will appear here.</div>}</div>;
}

const cmsSections = [
  ['overview','Overview'],['site','Site'],['hero','Hero'],['features','Featured Cards'],
  ['insurance','Insurance'],['menus','Navigation Menu'],['sections','Website Sections'],['about','About Us'],['contact','Contact'],['footer','Footer'],
];

function FullAdmin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const load = async () => {
    try { setData(await adminRequest('/api/admin/content')); }
    catch { navigate('/admin/login', { replace: true }); }
  };
  useEffect(() => { if (!sessionStorage.getItem('pinehaven-admin-token')) navigate('/admin/login', { replace: true }); else load(); }, []);
  const logout = async () => { await adminRequest('/api/auth/logout', { method:'POST' }).catch(()=>{}); sessionStorage.removeItem('pinehaven-admin-token'); navigate('/admin/login'); };
  if (!data) return <main className="cms-loading">Loading Mühlenbruch CMS…</main>;
  const singleton = (title, dataKey, endpoint, fields) => <SingletonEditor title={title} value={data[dataKey]} fields={fields} onSave={async (values) => { try { const saved=await adminRequest(endpoint,{method:'PUT',body:JSON.stringify(values)}); setData({...data,[dataKey]:saved}); setError(''); } catch(err){setError(err.message);} }}/>;
  const menuDestinations = [
    ['/','Home / page top'],['#stays','Insurance section'],['#experiences','About Us section'],
    ['#sustainability','Commitment section'],['#journal','Agents section'],['#contact','Contact section'],
    ...(data.dynamicSections||[]).map((section)=>[`#section-${section.id}`,`${section.menuLabel} — section-${section.id}`]),
  ];
  return <main className="cms-admin"><aside className="cms-sidebar"><Link to="/" className="cms-brand"><img src={data.site?.logoUrl || '/muhlenbruch-insurance-logo.jpg'} alt=""/><span><b>MÜHLENBRUCH</b><small>CONTENT STUDIO</small></span></Link><nav>{cmsSections.map(([key,label])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}>{label}{key==='contact'&&data.contacts.length>0?<b>{data.contacts.length}</b>:null}</button>)}</nav><button className="cms-logout" onClick={logout}><LogOut size={16}/> Sign out</button></aside><section className="cms-workspace"><header className="cms-header"><div><p>WEBSITE CONTENT MANAGEMENT</p><h1>{cmsSections.find(([key])=>key===tab)?.[1]}</h1></div><a href="/" target="_blank">View website <ArrowUpRight size={16}/></a></header>{error&&<div className="cms-error">{error}</div>}{tab==='overview'&&<CmsOverview data={data} onNavigate={setTab}/>}
  {tab==='site'&&singleton('Site identity and agency details','site','/api/admin/site',[
    ['brandName','Brand name'],['brandSuffix','Brand suffix'],['logoUrl','Logo image'],['tagline','Tagline'],['phone','Phone'],['email','Email'],['address','Address']
  ])}
  {tab==='hero'&&<CrudManager title="Hero slides" items={data.heroSlides} endpoint="/api/admin/hero-slides" fields={[
    ['eyebrow','Eyebrow'],['lineOne','Headline line 1'],['lineTwo','Headline line 2'],['lineThree','Headline line 3'],['image','Slide image'],['sortOrder','Sort order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='features'&&<CrudManager title="Featured cards" items={data.featureCards} endpoint="/api/admin/feature-cards" fields={[
    ['title','Title'],['description','Description','textarea'],['image','Card image'],['ctaLabel','Button label'],['ctaUrl','Button URL'],['sortOrder','Sort order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='insurance'&&<CrudManager title="Insurance services" items={data.retreats} endpoint="/api/admin/retreats" fields={[
    ['name','Insurance name'],['price','Price value','number'],['bed','Coverage label'],['bath','Plan label'],['image','Insurance image'],['style','Card style'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='menus'&&<CrudManager title="Header navigation links" items={data.menuItems||[]} endpoint="/api/admin/menu-items" fields={[
    ['label','Menu label'],['url','Destination',menuDestinations],['sortOrder','Menu order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='sections'&&<CrudManager title="Custom website sections" items={data.dynamicSections||[]} endpoint="/api/admin/dynamic-sections" fields={[
    ['menuLabel','Navigation label (menu added automatically)'],['eyebrow','Section eyebrow'],['title','Section title'],['accentTitle','Accent title'],['description','Section description','textarea'],['image','Section image'],['buttonLabel','Button label'],['buttonUrl','Button destination'],['imageSide','Image side'],['sortOrder','Section order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='about'&&singleton('About Us section','about','/api/admin/about',[
    ['eyebrow','Eyebrow'],['title','Title'],['accentTitle','Accent title'],['description','Description','textarea'],['image','About image'],['bulletOne','Bullet 1'],['bulletTwo','Bullet 2'],['bulletThree','Bullet 3'],['bulletFour','Bullet 4']
  ])}
  {tab==='contact'&&<><div className="cms-two-panel">{singleton('Contact section content','contactContent','/api/admin/contact-content',[
    ['eyebrow','Eyebrow'],['title','Title'],['accentTitle','Accent title'],['description','Description','textarea'],['formTitle','Form title'],['background','Contact background']
  ])}<div className="cms-panel"><div className="cms-panel-title"><div><p>SUBMISSIONS</p><h2>Contact enquiries</h2></div><span>{data.contacts.length} total</span></div><div className="cms-submissions">{data.contacts.length?data.contacts.map((contact)=><article key={contact.id}><div><b>{contact.name}</b><a href={`mailto:${contact.email}`}>{contact.email}</a></div><p>{contact.message}</p><time>{new Date(contact.createdAt).toLocaleDateString()}</time><select aria-label={`Status for ${contact.name}`} value={contact.status} onChange={async(event)=>{await adminRequest(`/api/admin/contacts/${contact.id}`,{method:'PATCH',body:JSON.stringify({status:event.target.value})});load();}}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select><button aria-label={`Delete submission from ${contact.name}`} onClick={async()=>{if(!window.confirm('Delete this contact submission?'))return;await adminRequest(`/api/admin/contacts/${contact.id}`,{method:'DELETE'});load();}}><Trash2 size={15}/></button></article>):<div className="cms-empty">No contact submissions yet.</div>}</div></div></div></>}
  {tab==='footer'&&<><div className="cms-two-panel">{singleton('Footer settings','footer','/api/admin/footer',[
    ['copyright','Copyright'],['tagline','Footer tagline'],['facebookUrl','Facebook URL'],['background','Footer background']
  ])}<CrudManager title="Footer links" items={data.footerLinks} endpoint="/api/admin/footer-links" fields={[
    ['groupName','Group'],['label','Link label'],['url','URL'],['sortOrder','Sort order','number'],['active','Visible','checkbox']
  ]} onChange={load}/></div></>}</section></main>;
}

function CmsOverview({data,onNavigate}) {
  const cards=[['Hero slides',data.heroSlides.length,'hero'],['Featured cards',data.featureCards.length,'features'],['Insurance services',data.retreats.length,'insurance'],['Navigation links',(data.menuItems||[]).length,'menus'],['Website sections',(data.dynamicSections||[]).length,'sections'],['Contact enquiries',data.contacts.length,'contact'],['Footer links',data.footerLinks.length,'footer']];
  return <><div className="cms-stats">{cards.map(([label,count,tab])=><button key={label} onClick={()=>onNavigate(tab)}><small>{label}</small><strong>{count}</strong><span>Manage section <ArrowRight size={14}/></span></button>)}</div><div className="cms-panel cms-welcome"><p>CONTENT STATUS</p><h2>Your complete website is connected.</h2><span>Changes saved in any section are stored in SQLite and shown on the public website automatically.</span></div></>;
}

function SingletonEditor({title,value,fields,onSave}) {
  const [form,setForm]=useState(value||{});
  useEffect(()=>setForm(value||{}),[value]);
  return <form className="cms-panel cms-form" onSubmit={(event)=>{event.preventDefault();onSave(form);}}><div className="cms-panel-title"><div><p>SINGLE SECTION</p><h2>{title}</h2></div><button type="submit">Save changes</button></div><div className="cms-fields">{fields.map(([key,label,type])=><CmsField key={key} fieldKey={key} label={label} type={type} value={form[key]} onChange={(next)=>setForm({...form,[key]:next})}/>)}</div></form>;
}

function CrudManager({title,items,endpoint,fields,onChange}) {
  const [editing,setEditing]=useState(null); const [form,setForm]=useState({}); const [formError,setFormError]=useState('');
  const start=(item={})=>{const defaults=Object.fromEntries(fields.filter(([, ,type])=>Array.isArray(type)).map(([key,,options])=>[key,options[0]?.[0]||'']));setEditing(item.id||'new');setForm({...defaults,...item,active:item.active!==false});setFormError('');};
  const save=async(event)=>{event.preventDefault();const isNew=editing==='new';try{await adminRequest(isNew?endpoint:`${endpoint}/${editing}`,{method:isNew?'POST':'PUT',body:JSON.stringify(form)});setEditing(null);setFormError('');onChange();}catch(error){setFormError(error.message);}};
  const remove=async(id)=>{if(!window.confirm('Delete this item?'))return;await adminRequest(`${endpoint}/${id}`,{method:'DELETE'});onChange();};
  return <div className="cms-panel"><div className="cms-panel-title"><div><p>CRUD LISTING</p><h2>{title}</h2></div><button onClick={()=>start()}><Plus size={15}/> Add new</button></div>{editing&&<form className="cms-inline-form" onSubmit={save}>{formError&&<div className="cms-error">{formError}</div>}<div className="cms-fields">{fields.map(([key,label,type])=><CmsField key={key} fieldKey={key} label={label} type={type} value={form[key]} onChange={(next)=>setForm({...form,[key]:next})}/>)}</div><div className="cms-form-actions"><button type="submit">Save item</button><button type="button" onClick={()=>setEditing(null)}>Cancel</button></div></form>}<div className="cms-list">{items.map((item)=><article key={item.id}>{item.image?<img src={item.image} alt=""/>:<span className="cms-list-icon"><ClipboardList size={18}/></span>}<div><b>{item.menuLabel||item.title||item.name||item.label||item.eyebrow}</b><small>{item.menuLabel?`Section ID: section-${item.id} · ${item.title}`:item.description||item.groupName||item.bed||item.lineOne}</small></div><span className={item.active===false?'hidden-item':'live-item'}>{item.active===false?'Hidden':'Live'}</span><button onClick={()=>start(item)}><Pencil size={15}/></button><button onClick={()=>remove(item.id)}><Trash2 size={15}/></button></article>)}</div></div>;
}

function CmsField({fieldKey,label,type='text',value,onChange}) {
  const [uploading,setUploading]=useState(false);
  const [uploadError,setUploadError]=useState('');
  const [localPreview,setLocalPreview]=useState('');
  const [previewFailed,setPreviewFailed]=useState(false);
  const imageField=fieldKey==='image'||fieldKey==='background'||fieldKey.toLowerCase().includes('image')||fieldKey.toLowerCase().includes('logo');
  const previewSource=localPreview||value;
  useEffect(()=>()=>{if(localPreview)URL.revokeObjectURL(localPreview);},[localPreview]);
  useEffect(()=>setPreviewFailed(false),[previewSource]);
  const upload=async(file)=>{
    if(!file)return;
    if(!file.type.startsWith('image/')){setUploadError('Please select an image file.');return;}
    if(file.size>8*1024*1024){setUploadError('Image must be smaller than 8 MB.');return;}
    const nextPreview=URL.createObjectURL(file);
    setLocalPreview(nextPreview);
    setUploading(true);setUploadError('');
    try{
      const result=await adminRequest('/api/admin/uploads',{method:'POST',body:file,headers:{'Content-Type':file.type,'X-File-Name':file.name}});
      onChange(result.url);
    }catch(error){setUploadError(error.message);setLocalPreview('');}
    finally{setUploading(false);}
  };
  if(type==='checkbox')return <label className="cms-checkbox"><input type="checkbox" checked={value!==false} onChange={(event)=>onChange(event.target.checked)}/><span>{label}</span></label>;
  if(type==='textarea')return <label className="cms-field cms-wide"><span>{label}</span><textarea value={value||''} onChange={(event)=>onChange(event.target.value)}/></label>;
  if(Array.isArray(type))return <label className="cms-field"><span>{label}</span><select value={value||type[0]?.[0]||''} onChange={(event)=>onChange(event.target.value)}>{type.map(([optionValue,optionLabel])=><option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
  if(fieldKey==='imageSide')return <label className="cms-field"><span>{label}</span><select value={value||'left'} onChange={(event)=>onChange(event.target.value)}><option value="left">Image left</option><option value="right">Image right</option></select></label>;
  if(imageField)return <div className="cms-field cms-wide cms-image-field"><span>{label}</span><div className="cms-image-control"><div className={`cms-image-preview ${uploading?'is-uploading':''}`}>{previewSource&&!previewFailed?<img src={previewSource} alt={`${label} preview`} onError={()=>setPreviewFailed(true)}/>:<span><ImageUp size={24}/>{previewFailed?'Image unavailable — upload a replacement':'No image uploaded'}</span>}{uploading&&<b className="cms-preview-progress">Uploading image…</b>}</div><div className="cms-image-actions"><label className="cms-upload-button"><ImageUp size={15}/><span>{uploading?'Uploading…':value?'Update image':'Upload image'}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploading} onChange={(event)=>upload(event.target.files?.[0])}/></label><small>{value?'Choose a new file to replace the current image.':'Choose an image for this entry.'}<br/>JPG, PNG, WebP, GIF or AVIF · maximum 8 MB</small></div></div>{uploadError&&<small className="cms-upload-error">{uploadError}</small>}</div>;
  return <label className={`cms-field ${fieldKey.toLowerCase().includes('image')||fieldKey==='background'?'cms-wide':''}`}><span>{label}</span><input type={type} value={value??''} onChange={(event)=>onChange(type==='number'?Number(event.target.value):event.target.value)}/></label>;
}

function InsuranceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    fetch(`/api/retreats/${id}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setService)
      .catch(() => {
        const fallback = initialRetreats.find((item) => String(item.id) === String(id));
        if (fallback) setService(fallback); else setMissing(true);
      });
  }, [id]);
  if (missing) return <Navigate to="/insurance" replace />;
  if (!service) return <main className="detail-loading">Loading coverage details…</main>;
  const detail = insuranceDetails[service.name] || {
    intro: `Flexible ${service.name.toLowerCase()} coverage selected around your needs, priorities, and budget.`,
    benefits: ['Personal guidance from local agents', 'Plans from multiple trusted carriers', 'Flexible coverage choices', 'A free, no-pressure quote'],
  };
  return <><header className="topbar detail-nav"><Link to="/" className="brand" aria-label="Mühlenbruch Insurance home"><img className="brand-logo" src="/muhlenbruch-insurance-logo.jpg" alt=""/><span>MÜHLENBRUCH</span><small>INSURANCE</small></Link><nav className="navlinks"><Link to="/">Home</Link><Link to="/insurance">Insurance</Link><Link to="/about">About</Link><Link to="/contact">Contact Us</Link></nav><Link to="/contact" className="button button-dark nav-cta">Get a free quote <ArrowUpRight size={16}/></Link></header><main className="insurance-detail"><section className="detail-hero section-shell"><motion.div className="detail-photo" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.8}}><img src={service.image} alt={service.name}/><span>{service.bed}</span></motion.div><motion.div className="detail-copy" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.12}}><p className="eyebrow">MÜHLENBRUCH INSURANCE <span></span></p><Link className="detail-back" to="/insurance">← All insurance</Link><h1>{service.name}</h1><p className="detail-intro">{detail.intro}</p><div className="detail-benefits">{detail.benefits.map((benefit) => <div key={benefit}><CircleStar size={18}/><span>{benefit}</span></div>)}</div><Link to="/contact" className="button button-dark">Request your free quote <ArrowRight size={17}/></Link><p className="detail-phone">Prefer to talk? Call <a href="tel:5158524156">515-852-4156</a></p></motion.div></section><section className="detail-note"><div className="section-shell"><p className="eyebrow light">LOCAL GUIDANCE <span></span></p><h2>Coverage should feel <em>clear and personal.</em></h2><p>Our experienced agents compare options from more than 15 companies to help you find protection that fits your life and your budget.</p></div></section></main></>;
}

function RoutedApp() {
  return <BrowserRouter><Routes><Route path="/" element={<App/>}/><Route path="/insurance" element={<App/>}/><Route path="/insurance/:id" element={<InsuranceDetail/>}/><Route path="/stays" element={<App/>}/><Route path="/experiences" element={<App/>}/><Route path="/about" element={<App/>}/><Route path="/contact" element={<App/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<FullAdmin/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></BrowserRouter>;
}

createRoot(document.getElementById('root')).render(<RoutedApp />);
