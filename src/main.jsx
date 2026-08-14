import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Bath, BedDouble, Calendar, Camera, ChevronLeft, ChevronRight, CircleStar, Clock,
  Leaf, MapPin, Menu, MessageCircle, Mountain, Sparkles, Trees, Utensils, ClipboardList,
  Eye, ImageUp, LayoutDashboard, LogOut, Mail, Pencil, Phone, Play, Plus, RefreshCw, Star, Trash2, X
} from 'lucide-react';
import './styles.css';
import Chatbot from './Chatbot.jsx';

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

const defaultSite = {
  brandName: 'MÜHLENBRUCH',
  brandSuffix: 'INSURANCE',
  logoUrl: '/muhlenbruch-insurance-logo.jpg',
  tagline: 'Protection You Can Trust',
  phone: '515-852-4156',
  email: 'muhlenbruchinsurance@hotmail.com',
  address: '110 East Ellsworth, Dows, Iowa',
};

function syncSiteIdentity(site) {
  if (!site) return;
  document.title = `${site.brandName || defaultSite.brandName} ${site.brandSuffix || defaultSite.brandSuffix}`;
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = site.logoUrl || defaultSite.logoUrl;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [retreats, setRetreats] = useState(initialRetreats);
  const [cms, setCms] = useState(null);
  const [contactState, setContactState] = useState({ status: 'idle', message: '' });
  const [contactErrors, setContactErrors] = useState({});
  const activeHeroSlides = cms?.heroSlides?.length ? cms.heroSlides.map((slide) => ({ ...slide, lines: getHeroHeadingLines(slide) })) : heroSlides;
  const displayAmenities = cms?.featureCards?.length ? cms.featureCards.map((card) => ({ ...card, text: card.description })) : amenities;
  const aboutContent = cms?.about;
  const localService = cms?.localService;
  const contactCms = cms?.contactContent;
  const footerCms = cms?.footer;
  const footerLinks = cms?.footerLinks || [];
  const dynamicSections = cms?.dynamicSections || [];
  const navigationItems = cms ? (cms.menuItems || []) : [
    {id:'home',label:'Home',url:'/'},{id:'insurance',label:'Insurance',url:'#stays'},
    {id:'about',label:'About',url:'#experiences'},{id:'contact',label:'Contact Us',url:'#contact'},
  ];
  const location = useLocation();
  useEffect(() => {
    fetch('/api/retreats').then((response) => response.ok ? response.json() : Promise.reject()).then(setRetreats).catch(() => {});
    fetch('/api/content').then((response) => response.ok ? response.json() : Promise.reject()).then((content) => {
      setCms(content);
      syncSiteIdentity(content.site);
    }).catch(() => {});
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
    const section = location.pathname === '/about' ? 'experiences' : location.pathname === '/insurance' ? 'stays' : location.pathname.slice(1);
    if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [location.pathname]);
  const submitContact = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const errors = {};
    if (!String(data.name || '').trim()) errors.name = 'Please enter your name.';
    const cleanEmail = String(data.email || '').trim();
    if (!cleanEmail) errors.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errors.email = 'Enter a valid email, such as jane@example.com.';
    const cleanPhone = String(data.phone || '').trim();
    if (!cleanPhone) errors.phone = 'Please enter your mobile number.';
    else if (!/^\d{3}-\d{3}-\d{4}$/.test(cleanPhone)) errors.phone = 'Use the format 515-852-4156.';
    if (!String(data.message || '').trim()) errors.message = 'Please tell us how we can help.';
    if (Object.keys(errors).length) {
      setContactErrors(errors);
      setContactState({ status: 'error', message: 'Please correct the highlighted fields and try again.' });
      form.elements.namedItem(Object.keys(errors)[0])?.focus();
      return;
    }
    setContactErrors({});
    setContactState({ status: 'sending', message: 'Sending your enquiry…' });
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to send your enquiry.');
      form.reset();
      setContactErrors({});
      setContactState({ status: 'success', message: 'Thank you — your enquiry was submitted successfully.' });
    } catch (error) {
      setContactState({ status: 'error', message: error.message || 'Unable to send your enquiry. Please try again.' });
    }
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
        <div className="luxury-inner section-shell"><AnimatePresence mode="wait"><motion.div className="luxury-copy" key={heroIndex} initial="hidden" animate="visible" exit="exit" variants={{hidden:{opacity:0,y:40},visible:{opacity:1,y:0,transition:{duration:1.2,ease:[.22,1,.36,1],staggerChildren:.12}},exit:{opacity:0,y:-20,transition:{duration:.5}}}}><motion.div className="luxury-eyebrow" variants={reveal}><span></span>{heroSlide.eyebrow}</motion.div><h1>{heroSlide.lines.map((line,index)=><motion.span key={`${line}-${index}`} className={index===1?'accent-line':''} variants={reveal}>{line}</motion.span>)}</h1></motion.div></AnimatePresence></div>
        <div className="hero-dots">{activeHeroSlides.map((slide,index)=><button key={slide.id || slide.eyebrow} className={index===heroIndex?'active':''} onClick={()=>setHeroIndex(index)} aria-label={`Show ${slide.eyebrow}`}/>)}</div>
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
        <motion.div className="experience-image about-3d-image" initial={{opacity:0,y:40,rotateY:10}} whileInView={{opacity:1,y:0,rotateY:0}} whileHover={{y:-10,rotateY:-4,rotateX:2}} viewport={{once:true}} transition={{type:'spring',stiffness:90,damping:17}}><span className="about-orbit orbit-one"></span><span className="about-orbit orbit-two"></span><img src={aboutContent?.image || '/about-agent.png'} alt="Experienced Mühlenbruch insurance agent helping a family" loading="lazy"/><div className="image-label"><CircleStar size={16}/><span>Serving Iowa<br/>for 10+ years</span></div><div className="about-shine"></div></motion.div>
        <motion.div className="experience-copy" initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{duration:.8, delay:.1}}><p className="eyebrow">{aboutContent?.eyebrow || 'ABOUT US'} <span></span></p><h2>{aboutContent?.title || 'Experienced agents'}<br/><em>{aboutContent?.accentTitle || 'working for you.'}</em></h2><p>{aboutContent?.description || 'For over 10 years, our insurance agency has worked with many national and regional insurance companies to offer you the best prices and coverage available.'}</p><div className="experience-list">{(aboutContent ? [aboutContent.bulletOne,aboutContent.bulletTwo,aboutContent.bulletThree,aboutContent.bulletFour] : ['Customized insurance plans','Plenty of add-ons to choose from','Low premiums that work for your budget','Personal service Monday–Friday, 8am–5pm']).filter(Boolean).map((item,index)=><motion.a href="#contact" key={item} initial={{opacity:0,x:-15}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:.25+index*.1}}><span>0{index+1}</span>{item}<ChevronRight size={18}/></motion.a>)}</div><a href="#contact" className="button button-dark">Meet your coverage needs <ArrowRight size={17}/></a></motion.div>
      </section>
      <section className="journal section-shell" id="journal"><motion.div className="journal-intro" initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal}><p className="eyebrow">{localService?.eyebrow || 'LOCAL SERVICE'} <span></span></p><h2>{localService?.title || 'People who'}<br/><em>{localService?.accentTitle || 'know your needs.'}</em></h2></motion.div><motion.article initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{delay:.15}}><p>{localService?.firstMeta || 'EXPERIENCE · PERSONAL SERVICE'}</p><h3>{localService?.firstTitle || 'Shannon Muhlenbruch, Mikyla Hefli, and Eric Bruns are here to help.'}</h3><a href={localService?.firstLinkUrl || 'tel:5158524156'}>{localService?.firstLinkLabel || 'Call our team'} <ArrowRight size={16}/></a></motion.article><motion.article initial="hidden" whileInView="visible" viewport={{once:true}} variants={reveal} transition={{delay:.25}}><p>{localService?.secondMeta || 'MONDAY–FRIDAY · 8AM–5PM'}</p><h3>{localService?.secondTitle || 'Friendly guidance, free quotes, and access to more than 15 companies.'}</h3><a href={localService?.secondLinkUrl || '#contact'}>{localService?.secondLinkLabel || 'Request a quote'} <ArrowRight size={16}/></a></motion.article></section>
      {dynamicSections.map((section,index)=><DynamicWebsiteSection key={section.id} section={section} index={index}/>)}
      <section className="contact-split section-shell" id="contact"><div className="contact-split-card" style={contactCms?.background ? {backgroundImage:`url(${contactCms.background})`} : undefined}><motion.div className="contact-split-copy" initial={{opacity:0,x:-35}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.8}}><p className="eyebrow light">{contactCms?.eyebrow || 'CONTACT US'} <span></span></p><h2>{contactCms?.title || 'Let’s protect'}<br/><em>{contactCms?.accentTitle || 'what you’ve built.'}</em></h2><p>{contactCms?.description || 'Tell us what matters to you. Our local team will compare options and help you find thoughtful coverage.'}</p><div className="contact-direct"><a href={`tel:${(cms?.site?.phone || defaultSite.phone).replace(/\D/g,'')}`}><Phone size={17}/><span><small>CALL OUR TEAM</small>{cms?.site?.phone || defaultSite.phone}</span></a><a href={`mailto:${cms?.site?.email || defaultSite.email}`}><Mail size={17}/><span><small>EMAIL US</small>{cms?.site?.email || defaultSite.email}</span></a><a href="#contact"><MapPin size={17}/><span><small>VISIT</small>{cms?.site?.address || defaultSite.address}</span></a></div></motion.div><motion.form className="contact-split-form" onSubmit={submitContact} noValidate initial={{opacity:0,x:35}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.8,delay:.12}}><p>REQUEST A FREE QUOTE</p><h3>{contactCms?.formTitle || 'How can we help?'}</h3><div><label className={contactErrors.name?'has-error':''}><span>Your name</span><input name="name" required maxLength="100" autoComplete="name" placeholder="Enter your full name" aria-invalid={Boolean(contactErrors.name)} aria-describedby={contactErrors.name?'contact-name-error':undefined} onInput={()=>setContactErrors((current)=>({...current,name:''}))}/>{contactErrors.name&&<small id="contact-name-error" className="contact-field-error">{contactErrors.name}</small>}</label><label className={contactErrors.email?'has-error':''}><span>Email address</span><input name="email" type="email" required maxLength="200" autoComplete="email" inputMode="email" placeholder="you@example.com" aria-invalid={Boolean(contactErrors.email)} aria-describedby={contactErrors.email?'contact-email-error':undefined} onInput={()=>setContactErrors((current)=>({...current,email:''}))}/>{contactErrors.email&&<small id="contact-email-error" className="contact-field-error">{contactErrors.email}</small>}</label><label className={`contact-phone-field ${contactErrors.phone?'has-error':''}`}><span>Mobile number</span><input name="phone" type="tel" required maxLength="12" autoComplete="tel" inputMode="numeric" placeholder="515-852-4156" aria-invalid={Boolean(contactErrors.phone)} aria-describedby={contactErrors.phone?'contact-phone-error':undefined} onInput={(event)=>{const digits=event.currentTarget.value.replace(/\D/g,'').slice(0,10);event.currentTarget.value=digits.length>6?`${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`:digits.length>3?`${digits.slice(0,3)}-${digits.slice(3)}`:digits;setContactErrors((current)=>({...current,phone:''}));}}/>{contactErrors.phone&&<small id="contact-phone-error" className="contact-field-error">{contactErrors.phone}</small>}</label></div><label className={contactErrors.message?'has-error':''}><span>Your message</span><textarea name="message" required maxLength="3000" placeholder="Tell us which coverage you need and how we can help." aria-invalid={Boolean(contactErrors.message)} aria-describedby={contactErrors.message?'contact-message-error':undefined} onInput={()=>setContactErrors((current)=>({...current,message:''}))}/>{contactErrors.message&&<small id="contact-message-error" className="contact-field-error">{contactErrors.message}</small>}</label><button type="submit" disabled={contactState.status==='sending'}>{contactState.status==='sending' ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={17}/></button><small className={`form-status ${contactState.status}`} role="status">{contactState.message || 'Your information stays private and secure.'}</small></motion.form></div></section>
    </main>
    <footer className="footer-v4" style={footerCms?.background ? {'--footer-background':`url(${footerCms.background})`} : undefined}>
      <div className="footer-v4-shell section-shell">
        <div className="footer-v4-cta">
          <div><small>LOCAL GUIDANCE · PERSONAL SERVICE</small><h2>Let’s protect what<br/><em>matters to you.</em></h2><p>Connect with our Dows team for clear answers and a free, no-pressure quote.</p></div>
          <a href="#contact" className="footer-v4-quote">Request a free quote <ArrowUpRight size={17}/></a>
        </div>
        <div className="footer-v4-main">
          <div className="footer-v4-about">
            <Link to="/" className="footer-v4-logo"><img src={cms?.site?.logoUrl || '/muhlenbruch-insurance-logo.jpg'} alt="Mühlenbruch Insurance"/><span><b>{cms?.site?.brandName || 'MÜHLENBRUCH'}</b><small>{cms?.site?.brandSuffix || 'INSURANCE'}</small></span></Link>
            <p>{footerCms?.tagline || cms?.site?.tagline || 'Protection you can trust from local agents who understand your needs.'}</p>
          </div>
          <nav className="footer-v4-links" aria-label="Footer navigation"><div><small>AGENCY</small>{footerLinks.length ? footerLinks.map((link)=><Link key={link.id} to={link.url}>{link.label}</Link>) : <><Link to="/">Home</Link><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/admin">Admin</Link></>}</div></nav>
          <address className="footer-v4-contact">
            <small>VISIT &amp; CONTACT</small>
            <div className="footer-v4-contact-card">
              <a href={`tel:${(cms?.site?.phone || defaultSite.phone).replace(/\D/g,'')}`} aria-label="Call our team"><i><Phone size={17}/></i><span><b>Call our team</b></span><ArrowUpRight size={14}/></a>
              <a href={`mailto:${cms?.site?.email || defaultSite.email}`} aria-label="Email us"><i><Mail size={17}/></i><span><b>Email us</b></span><ArrowUpRight size={14}/></a>
              <span><i><MapPin size={17}/></i><span><b>Visit our office</b>{cms?.site?.address || defaultSite.address}</span></span>
              <a className="footer-facebook" href={footerCms?.facebookUrl || 'https://www.facebook.com/'} target="_blank" rel="noreferrer"><i><b>f</b></i><span><b>Follow us</b>Facebook</span><ArrowUpRight size={14}/></a>
            </div>
          </address>
        </div>
        <div className="footer-v4-legal"><span>{footerCms?.copyright || 'Copyright © muhlenbruchinsuranceagency.com 2026'}</span><span>Independent local insurance guidance · Dows, Iowa</span></div>
      </div>
    </footer>
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
    return <motion.article key={service.id} className={`carousel-card ${offset === 0 ? 'active' : ''}`} initial={false} animate={{x:`${offset * 82}%`,y:distance * 25,scale:offset === 0 ? 1 : distance === 1 ? .91 : .81,rotateY:offset * -13,rotateZ:offset * 1.5,opacity:visible ? 1 : 0,z:offset === 0 ? 100 : 0}} transition={{type:'spring',stiffness:170,damping:23,mass:.8}} style={{zIndex:10-distance,pointerEvents:visible?'auto':'none'}} onClick={() => offset !== 0 && setActive(index)}><Link to={offset === 0 ? `/insurance/${service.id}` : '#'} onClick={(event) => offset !== 0 && event.preventDefault()}><div className="carousel-image"><img src={service.image} alt={service.name} loading="lazy"/><span className="carousel-number">{String(index+1).padStart(2,'0')}</span><span className="image-arrow"><ArrowUpRight size={19}/></span></div><div className="carousel-info"><h3>{service.name}</h3><span>Explore coverage <ArrowRight size={14}/></span></div></Link></motion.article>;
  })}</motion.div><div className="carousel-controls"><button onClick={() => move(-1)} aria-label="Previous insurance"><ChevronLeft size={19}/></button><div className="carousel-progress">{services.map((service,index) => <button key={service.id} className={index===active?'active':''} onClick={() => setActive(index)} aria-label={`Show ${service.name}`}/>)}</div><button onClick={() => move(1)} aria-label="Next insurance"><ChevronRight size={19}/></button></div></div>;
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
  const [site, setSite] = useState(defaultSite);
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
  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((content) => {
        if (content.site) {
          setSite(content.site);
          syncSiteIdentity(content.site);
        }
      })
      .catch(() => {});
  }, []);
  if (sessionStorage.getItem('pinehaven-admin-token')) return <Navigate to="/admin" replace />;
  return <main className="admin-login"><Link className="admin-back" to="/">← Back to {site.brandName} {site.brandSuffix}</Link><section className="google-card"><div className="google-mark logo-mark"><img src={site.logoUrl || defaultSite.logoUrl} alt={`${site.brandName} ${site.brandSuffix}`}/></div><h1>Welcome to {site.brandName}</h1><p>Continue with an approved Google account to manage website content and enquiries.</p><div className={`google-button-host ${loading?'is-loading':''}`} ref={googleButton}>{configured===null&&!error?<span>Loading Google Sign-In…</span>:null}</div>{error&&<div className="login-error">{error}</div>}<small>Access is restricted to approved administrator accounts.</small></section></main>;
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
  ['insurance','Insurance'],['menus','Navigation Menu'],['sections','Website Sections'],['about','About Us'],['local','Local Service'],['contact','Contact'],['footer','Footer'],
];

function FullAdmin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const load = async () => {
    try {
      const content = await adminRequest('/api/admin/content');
      setData(content);
      syncSiteIdentity(content.site);
    }
    catch { navigate('/admin/login', { replace: true }); }
  };
  useEffect(() => { if (!sessionStorage.getItem('pinehaven-admin-token')) navigate('/admin/login', { replace: true }); else load(); }, []);
  useEffect(() => {
    if (tab !== 'contact' || !sessionStorage.getItem('pinehaven-admin-token')) return undefined;
    load();
    const refresh = window.setInterval(load, 10000);
    return () => window.clearInterval(refresh);
  }, [tab]);
  const refreshContacts = async () => { setRefreshing(true); await load(); setRefreshing(false); };
  const viewContact = async (contact) => {
    setSelectedContact(contact);
    if (!contact.viewed) {
      const viewed = await adminRequest(`/api/admin/contacts/${contact.id}/viewed`, { method:'PATCH' });
      setSelectedContact(viewed);
      await load();
    }
  };
  const logout = async () => { await adminRequest('/api/auth/logout', { method:'POST' }).catch(()=>{}); sessionStorage.removeItem('pinehaven-admin-token'); navigate('/admin/login'); };
  if (!data) return <main className="cms-loading">Loading Mühlenbruch CMS…</main>;
  const singleton = (title, dataKey, endpoint, fields) => <SingletonEditor title={title} value={data[dataKey]} fields={fields} onSave={async (values) => { try { const saved=await adminRequest(endpoint,{method:'PUT',body:JSON.stringify(values)}); setData({...data,[dataKey]:saved}); if(dataKey==='site')syncSiteIdentity(saved); setError(''); } catch(err){setError(err.message);} }}/>;
  const menuDestinations = [
    ['/','Home / page top'],['#stays','Insurance section'],['#experiences','About Us section'],
    ['#journal','Local Service section'],['#contact','Contact section'],
    ...(data.dynamicSections||[]).map((section)=>[`#section-${section.id}`,`${section.menuLabel} — section-${section.id}`]),
  ];
  const unreadContacts=data.contacts.filter((contact)=>!contact.viewed).length;
  return <main className="cms-admin"><aside className="cms-sidebar"><Link to="/" className="cms-brand"><img src={data.site?.logoUrl || defaultSite.logoUrl} alt={`${data.site?.brandName || defaultSite.brandName} ${data.site?.brandSuffix || defaultSite.brandSuffix}`}/><span><b>{data.site?.brandName || defaultSite.brandName}</b><small>{data.site?.brandSuffix || defaultSite.brandSuffix} · CONTENT STUDIO</small></span></Link><nav>{cmsSections.map(([key,label])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}>{label}{key==='contact'&&unreadContacts>0?<b>{unreadContacts}</b>:null}</button>)}</nav><button className="cms-logout" onClick={logout}><LogOut size={16}/> Sign out</button></aside><section className="cms-workspace"><header className="cms-header"><div><p>WEBSITE CONTENT MANAGEMENT</p><h1>{cmsSections.find(([key])=>key===tab)?.[1]}</h1></div><a href="/" target="_blank">View website <ArrowUpRight size={16}/></a></header>{error&&<div className="cms-error">{error}</div>}{tab==='overview'&&<CmsOverview data={data} onNavigate={setTab}/>}
  {tab==='site'&&singleton('Site identity and agency details','site','/api/admin/site',[
    ['brandName','Brand name','text',true],['brandSuffix','Brand suffix','text',true],['logoUrl','Logo image','text',true],['phone','Phone','tel',true],['email','Public email','email',true],['address','Address','text',true],['notificationEmails','Contact notification emails','textarea']
  ])}
  {tab==='hero'&&<CrudManager title="Hero slides" items={data.heroSlides} endpoint="/api/admin/hero-slides" fields={[
    ['eyebrow','Eyebrow','text',true],['lineOne','Heading','textarea',true],['image','Slide image','text',true],['sortOrder','Sort order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='features'&&<CrudManager title="Featured cards" items={data.featureCards} endpoint="/api/admin/feature-cards" fields={[
    ['title','Title','text',true],['description','Description','textarea',true],['image','Card image','text',true],['ctaLabel','Button label','text',true],['ctaUrl','Button URL','text',true],['sortOrder','Sort order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='insurance'&&<CrudManager title="Insurance services" items={data.retreats} endpoint="/api/admin/retreats" fields={[
    ['name','Insurance name','text',true],['bed','Coverage label','text',true],['bath','Plan label','text',true],['image','Insurance image','text',true],['style','Card style'],['detailDescription','Description and benefits','richtext',true],['quoteLabel','Quote button label','text',true],['quoteUrl','Quote button link','text',true],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='menus'&&<CrudManager title="Header navigation links" items={data.menuItems||[]} endpoint="/api/admin/menu-items" fields={[
    ['label','Menu label','text',true],['url','Destination',menuDestinations,true],['sortOrder','Menu order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='sections'&&<CrudManager title="Custom website sections" items={data.dynamicSections||[]} endpoint="/api/admin/dynamic-sections" fields={[
    ['menuLabel','Navigation label (menu added automatically)','text',true],['eyebrow','Section eyebrow'],['title','Section title','text',true],['accentTitle','Accent title'],['description','Section description','textarea'],['image','Section image'],['buttonLabel','Button label'],['buttonUrl','Button destination'],['imageSide','Image side'],['sortOrder','Section order','number'],['active','Visible','checkbox']
  ]} onChange={load}/>}
  {tab==='about'&&singleton('About Us section','about','/api/admin/about',[
    ['eyebrow','Eyebrow'],['title','Title','text',true],['accentTitle','Accent title','text',true],['description','Description','textarea',true],['image','About image','text',true],['bulletOne','Bullet 1'],['bulletTwo','Bullet 2'],['bulletThree','Bullet 3'],['bulletFour','Bullet 4']
  ])}
  {tab==='local'&&singleton('Local Service section','localService','/api/admin/local-service',[
    ['eyebrow','Eyebrow','text',true],['title','Heading','text',true],['accentTitle','Accent heading','text',true],['firstMeta','First card label','text',true],['firstTitle','First card text','textarea',true],['firstLinkLabel','First link label','text',true],['firstLinkUrl','First link URL','text',true],['secondMeta','Second card label','text',true],['secondTitle','Second card text','textarea',true],['secondLinkLabel','Second link label','text',true],['secondLinkUrl','Second link URL','text',true]
  ])}
  {tab==='contact'&&<><div className="cms-two-panel cms-contact-layout">{singleton('Contact section content','contactContent','/api/admin/contact-content',[
    ['eyebrow','Eyebrow'],['title','Title','text',true],['accentTitle','Accent title','text',true],['description','Description','textarea',true],['formTitle','Form title','text',true],['background','Contact background','text',true]
  ])}<div className="cms-panel"><div className="cms-panel-title"><div><p>SUBMISSIONS · AUTO-REFRESHES</p><h2>Contact enquiries</h2></div><button type="button" onClick={refreshContacts} disabled={refreshing}><RefreshCw size={14} className={refreshing?'is-spinning':''}/>{refreshing?'Refreshing…':`Refresh · ${data.contacts.length}`}</button></div><div className="cms-submissions">{data.contacts.length?data.contacts.map((contact)=><article key={contact.id} className={contact.viewed?'':'is-unread'}><div><b>{contact.name}{!contact.viewed&&<i>NEW</i>}</b><a href={`mailto:${contact.email}`}>{contact.email}</a>{contact.phone&&<a href={`tel:${contact.phone.replace(/\D/g,'')}`}>{contact.phone}</a>}</div><p title={contact.message}>{contact.message}</p><time>{new Date(contact.createdAt).toLocaleString()}</time><button className="cms-view-enquiry" aria-label={`View enquiry from ${contact.name}`} title="View enquiry" onClick={()=>viewContact(contact)}><Eye size={16}/></button><select aria-label={`Status for ${contact.name}`} value={contact.status} onChange={async(event)=>{await adminRequest(`/api/admin/contacts/${contact.id}`,{method:'PATCH',body:JSON.stringify({status:event.target.value})});load();}}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select><button aria-label={`Delete submission from ${contact.name}`} onClick={async()=>{if(!window.confirm('Delete this contact submission?'))return;await adminRequest(`/api/admin/contacts/${contact.id}`,{method:'DELETE'});if(selectedContact?.id===contact.id)setSelectedContact(null);load();}}><Trash2 size={15}/></button></article>):<div className="cms-empty">No contact submissions yet.</div>}</div></div></div>{selectedContact&&<div className="cms-enquiry-backdrop" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget)setSelectedContact(null);}}><section className="cms-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button className="cms-enquiry-close" onClick={()=>setSelectedContact(null)} aria-label="Close enquiry"><X size={18}/></button><p>CONTACT ENQUIRY · {selectedContact.status.toUpperCase()}</p><h2 id="enquiry-title">{selectedContact.name}</h2><div className="cms-enquiry-meta"><a href={`mailto:${selectedContact.email}`}><Mail size={15}/>{selectedContact.email}</a>{selectedContact.phone&&<a href={`tel:${selectedContact.phone.replace(/\D/g,'')}`}><Phone size={15}/>{selectedContact.phone}</a>}<span><Clock size={15}/>{new Date(selectedContact.createdAt).toLocaleString()}</span></div><div className="cms-enquiry-message">{selectedContact.message}</div><div className="cms-enquiry-actions"><a href={`mailto:${selectedContact.email}`}>Reply by email <ArrowUpRight size={15}/></a><button onClick={()=>setSelectedContact(null)}>Close</button></div></section></div>}</>}
  {tab==='footer'&&<><div className="cms-two-panel">{singleton('Footer settings','footer','/api/admin/footer',[
    ['copyright','Copyright'],['tagline','Footer tagline'],['facebookUrl','Facebook URL'],['background','Footer background']
  ])}<CrudManager title="Footer links" items={data.footerLinks} endpoint="/api/admin/footer-links" fields={[
    ['groupName','Group','text',true],['label','Link label','text',true],['url','URL','text',true],['sortOrder','Sort order','number'],['active','Visible','checkbox']
  ]} onChange={load}/></div></>}</section></main>;
}

function CmsOverview({data,onNavigate}) {
  const cards=[['Hero slides',data.heroSlides.length,'hero'],['Featured cards',data.featureCards.length,'features'],['Insurance services',data.retreats.length,'insurance'],['Navigation links',(data.menuItems||[]).length,'menus'],['Website sections',(data.dynamicSections||[]).length,'sections'],['Local Service',data.localService?1:0,'local'],['Contact enquiries',data.contacts.length,'contact'],['Footer links',data.footerLinks.length,'footer']];
  return <><div className="cms-stats">{cards.map(([label,count,tab])=><button key={label} onClick={()=>onNavigate(tab)}><small>{label}</small><strong>{count}</strong><span>Manage section <ArrowRight size={14}/></span></button>)}</div><div className="cms-panel cms-welcome"><p>CONTENT STATUS</p><h2>Your complete website is connected.</h2><span>Changes saved in any section are stored in SQLite and shown on the public website automatically.</span></div></>;
}

function validateCmsFields(fields,values) {
  const errors={};
  fields.forEach(([key,label,type,required])=>{
    const value=values[key];
    const empty=type==='richtext'?!richTextToPlainText(value).trim():typeof value==='string'?!value.trim():value===undefined||value===null||value==='';
    if(required&&empty){errors[key]=`${label} is required.`;return;}
    if(empty)return;
    const text=String(value).trim();
    if(type==='tel'&&!/^\d{3}-\d{3}-\d{4}$/.test(text))errors[key]=`${label} must use the format 515-852-4156.`;
    else if(type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))errors[key]=`Enter a valid ${label.toLowerCase()}, such as name@example.com.`;
    else if(key==='notificationEmails'){const invalid=text.split(/[,;\n]+/).map((email)=>email.trim()).filter(Boolean).filter((email)=>!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));if(invalid.length)errors[key]=`Check ${invalid.length===1?'this email address':'these email addresses'}: ${invalid.join(', ')}.`;}
    else if(type==='number'&&(!Number.isFinite(Number(value))||Number(value)<0))errors[key]=`${label} must be zero or a positive number.`;
    else if((key==='url'||key.endsWith('Url'))&&!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(text))errors[key]=`${label} must start with https://, /, #, mailto:, or tel:.`;
  });
  return errors;
}

function focusFirstCmsError(formElement,errors) {
  const firstKey=Object.keys(errors)[0];
  if(!firstKey)return;
  requestAnimationFrame(()=>{const field=formElement.querySelector(`[data-field="${firstKey}"]`);(field?.querySelector('input:not([type="file"]), textarea, select, [contenteditable="true"]')||field)?.focus();});
}

function SingletonEditor({title,value,fields,onSave}) {
  const [form,setForm]=useState(value||{});
  const [formError,setFormError]=useState(''); const [fieldErrors,setFieldErrors]=useState({});
  useEffect(()=>{setForm(value||{});setFormError('');setFieldErrors({});},[value]);
  const changeField=(key,next)=>{setForm({...form,[key]:next});if(fieldErrors[key]){const remaining=Object.keys(fieldErrors).filter((field)=>field!==key);setFieldErrors((current)=>{const updated={...current};delete updated[key];return updated;});if(!remaining.length)setFormError('');}};
  const save=async(event)=>{event.preventDefault();const errors=validateCmsFields(fields,form);if(Object.keys(errors).length){setFieldErrors(errors);setFormError(`Please review ${Object.keys(errors).length===1?'the highlighted field':'the highlighted fields'} below.`);focusFirstCmsError(event.currentTarget,errors);return;}setFormError('');setFieldErrors({});await onSave(form);};
  const hasRequired=fields.some(([, , ,required])=>required);
  return <form className="cms-panel cms-form" onSubmit={save} noValidate><div className="cms-panel-title"><div><p>SINGLE SECTION</p><h2>{title}</h2></div><button type="submit">Save changes</button></div>{formError&&<div className="cms-error cms-validation-summary" role="alert"><b>Some information needs your attention</b><span>{formError}</span></div>}{hasRequired&&<p className="cms-required-note"><span>*</span> Required fields</p>}<div className="cms-fields">{fields.map(([key,label,type,required])=><CmsField key={key} fieldKey={key} label={label} type={type} required={required} error={fieldErrors[key]} value={form[key]} onChange={(next)=>changeField(key,next)}/>)}</div></form>;
}

function CrudManager({title,items,endpoint,fields,onChange}) {
  const [editing,setEditing]=useState(null); const [form,setForm]=useState({}); const [formError,setFormError]=useState(''); const [fieldErrors,setFieldErrors]=useState({});
  const start=(item={})=>{const defaults=Object.fromEntries(fields.filter(([, ,type])=>Array.isArray(type)).map(([key,,options])=>[key,options[0]?.[0]||'']));let source=item;if(endpoint==='/api/admin/retreats'&&item.id)source={...item,detailDescription:combineInsuranceContent(item),benefitOne:'',benefitTwo:'',benefitThree:'',benefitFour:''};if(endpoint==='/api/admin/hero-slides'&&item.id)source={...item,lineOne:getHeroHeadingLines(item).join('\n'),lineTwo:'',lineThree:''};setEditing(item.id||'new');setForm({...defaults,...source,active:item.active!==false});setFormError('');setFieldErrors({});};
  const changeField=(key,next)=>{setForm({...form,[key]:next});if(fieldErrors[key]){const remaining=Object.keys(fieldErrors).filter((field)=>field!==key);setFieldErrors((current)=>{const updated={...current};delete updated[key];return updated;});if(!remaining.length)setFormError('');}};
  const save=async(event)=>{event.preventDefault();const errors=validateCmsFields(fields,form);if(Object.keys(errors).length){setFieldErrors(errors);setFormError(`Please review ${Object.keys(errors).length===1?'the highlighted field':'the highlighted fields'} below.`);focusFirstCmsError(event.currentTarget,errors);return;}const isNew=editing==='new';try{await adminRequest(isNew?endpoint:`${endpoint}/${editing}`,{method:isNew?'POST':'PUT',body:JSON.stringify(form)});setEditing(null);setFormError('');setFieldErrors({});onChange();}catch(error){setFormError(error.message);}};
  const remove=async(id)=>{if(!window.confirm('Delete this item?'))return;await adminRequest(`${endpoint}/${id}`,{method:'DELETE'});onChange();};
  const hasRequired=fields.some(([, , ,required])=>required);
  return <div className="cms-panel"><div className="cms-panel-title"><div><p>CRUD LISTING</p><h2>{title}</h2></div><button onClick={()=>start()}><Plus size={15}/> Add new</button></div>{editing&&<form className="cms-inline-form" onSubmit={save} noValidate>{formError&&<div className="cms-error cms-validation-summary" role="alert"><b>Some information needs your attention</b><span>{formError}</span></div>}{hasRequired&&<p className="cms-required-note"><span>*</span> Required fields</p>}<div className="cms-fields">{fields.map(([key,label,type,required])=><CmsField key={key} fieldKey={key} label={label} type={type} required={required} error={fieldErrors[key]} value={form[key]} onChange={(next)=>changeField(key,next)}/>)}</div><div className="cms-form-actions"><button type="submit">Save item</button><button type="button" onClick={()=>setEditing(null)}>Cancel</button></div></form>}<div className="cms-list">{items.map((item)=><article key={item.id}>{item.image?<img src={item.image} alt=""/>:<span className="cms-list-icon"><ClipboardList size={18}/></span>}<div><b>{item.menuLabel||item.title||item.name||item.label||item.eyebrow}</b><small>{item.menuLabel?`Section ID: section-${item.id} · ${item.title}`:item.description||item.groupName||item.bed||item.lineOne}</small></div><span className={item.active===false?'hidden-item':'live-item'}>{item.active===false?'Hidden':'Live'}</span><button onClick={()=>start(item)}><Pencil size={15}/></button><button onClick={()=>remove(item.id)}><Trash2 size={15}/></button></article>)}</div></div>;
}

const richTextAllowedTags=new Set(['P','BR','STRONG','B','EM','I','U','S','UL','OL','LI','BLOCKQUOTE','H2','H3','A']);
const richTextBlockedTags=new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FORM','INPUT','BUTTON','SVG','MATH']);
const escapeRichText=(value)=>String(value||'').replace(/[&<>"']/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character]));
const prepareRichText=(value)=>{
  const source=String(value||'').trim();
  if(!source)return '';
  if(/<\/?[a-z][\s\S]*>/i.test(source))return source;
  return source.split(/\n{2,}/).map((paragraph)=>`<p>${escapeRichText(paragraph).replace(/\n/g,'<br>')}</p>`).join('');
};
const sanitizeRichText=(value)=>{
  const documentObject=new DOMParser().parseFromString(prepareRichText(value),'text/html');
  Array.from(documentObject.body.querySelectorAll('*')).reverse().forEach((element)=>{
    if(richTextBlockedTags.has(element.tagName)){element.remove();return;}
    if(!richTextAllowedTags.has(element.tagName)){element.replaceWith(...element.childNodes);return;}
    const href=element.tagName==='A'?element.getAttribute('href')||'':'';
    Array.from(element.attributes).forEach((attribute)=>element.removeAttribute(attribute.name));
    if(element.tagName==='A'&&/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href)){
      element.setAttribute('href',href);
      if(/^https?:\/\//i.test(href)){element.setAttribute('target','_blank');element.setAttribute('rel','noopener noreferrer');}
    }
  });
  return documentObject.body.innerHTML;
};
const richTextToPlainText=(value)=>{
  if(typeof DOMParser==='undefined')return String(value||'').replace(/<[^>]*>/g,' ');
  return new DOMParser().parseFromString(String(value||''),'text/html').body.textContent||'';
};
const getHeroHeadingLines=(slide)=>{
  const legacyLines=[slide?.lineOne,slide?.lineTwo,slide?.lineThree].map((line)=>String(line||'').trim()).filter(Boolean);
  if(slide?.lineTwo||slide?.lineThree)return legacyLines;
  return String(slide?.lineOne||'').split(/\r?\n/).map((line)=>line.trim()).filter(Boolean);
};
const combineInsuranceContent=(service,fallbackDetail=null)=>{
  const storedDescription=service?.detailDescription||'';
  const description=storedDescription||fallbackDetail?.intro||'';
  const storedBenefits=[service?.benefitOne,service?.benefitTwo,service?.benefitThree,service?.benefitFour].filter((benefit)=>richTextToPlainText(benefit).trim());
  const benefits=storedBenefits.length?storedBenefits:!storedDescription?(fallbackDetail?.benefits||[]):[];
  const benefitsHtml=benefits.length?`<h3>Key benefits</h3><ul>${benefits.map((benefit)=>`<li>${sanitizeRichText(benefit)}</li>`).join('')}</ul>`:'';
  return sanitizeRichText(`${prepareRichText(description)}${benefitsHtml}`);
};

function RichTextEditor({value,onChange,label,errorId}) {
  const editorRef=useRef(null);
  useEffect(()=>{
    if(editorRef.current&&document.activeElement!==editorRef.current){
      const next=sanitizeRichText(value);
      if(editorRef.current.innerHTML!==next)editorRef.current.innerHTML=next;
    }
  },[value]);
  const emit=()=>onChange(editorRef.current?.innerHTML||'');
  const cleanAndEmit=()=>{
    if(!editorRef.current)return;
    const clean=sanitizeRichText(editorRef.current.innerHTML);
    if(editorRef.current.innerHTML!==clean)editorRef.current.innerHTML=clean;
    onChange(clean);
  };
  const command=(name,commandValue=null)=>{
    editorRef.current?.focus();
    document.execCommand(name,false,commandValue);
    emit();
  };
  const addLink=()=>{
    const url=window.prompt('Enter a link beginning with https://, /, #, mailto:, or tel:');
    if(url&&/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url))command('createLink',url);
    else if(url)window.alert('Please enter a valid link.');
  };
  const toolbar=[
    ['undo','↶','Undo'],['redo','↷','Redo'],['bold','B','Bold'],['italic','I','Italic'],['underline','U','Underline'],['strikeThrough','S','Strikethrough'],
    ['formatBlock','P','Paragraph','p'],['formatBlock','H2','Heading 2','h2'],['formatBlock','H3','Heading 3','h3'],
    ['insertUnorderedList','• List','Bullet list'],['insertOrderedList','1. List','Numbered list'],['formatBlock','❝','Quote','blockquote'],
  ];
  return <div className="cms-rich-editor">
    <div className="cms-rich-toolbar" role="toolbar" aria-label={`${label} formatting`}>
      {toolbar.map(([name,text,title,commandValue],index)=><button key={`${name}-${text}`} type="button" title={title} aria-label={title} className={index===2||index===6||index===9?'starts-group':''} onMouseDown={(event)=>event.preventDefault()} onClick={()=>command(name,commandValue)}><span className={name==='italic'?'is-italic':name==='underline'?'is-underline':name==='strikeThrough'?'is-strike':''}>{text}</span></button>)}
      <button type="button" title="Add link" aria-label="Add link" className="starts-group" onMouseDown={(event)=>event.preventDefault()} onClick={addLink}>Link</button>
      <button type="button" title="Remove link" aria-label="Remove link" onMouseDown={(event)=>event.preventDefault()} onClick={()=>command('unlink')}>Unlink</button>
      <button type="button" title="Clear formatting" aria-label="Clear formatting" className="starts-group" onMouseDown={(event)=>event.preventDefault()} onClick={()=>command('removeFormat')}>Clear</button>
    </div>
    <div ref={editorRef} className="cms-rich-content" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label={label} aria-invalid={Boolean(errorId)} aria-describedby={errorId||undefined} data-placeholder="Start writing…" onInput={emit} onBlur={cleanAndEmit}/>
    <small className="cms-rich-hint">{label==='Description and benefits'?'Write the complete description and all benefits here. Use headings and lists to organize the content.':'Use the toolbar to format text. Paste plain or formatted content directly into the editor.'}</small>
  </div>;
}

function RichContent({value,fallback='',className=''}) {
  return <div className={className} dangerouslySetInnerHTML={{__html:sanitizeRichText(value||fallback)}}/>;
}

function CmsField({fieldKey,label,type='text',required=false,error='',value,onChange}) {
  const [uploading,setUploading]=useState(false);
  const [uploadError,setUploadError]=useState('');
  const [localPreview,setLocalPreview]=useState('');
  const [previewFailed,setPreviewFailed]=useState(false);
  const imageField=fieldKey==='image'||fieldKey==='background'||fieldKey.toLowerCase().includes('image')||fieldKey.toLowerCase().includes('logo');
  const previewSource=localPreview||value;
  const fieldLabel=<>{label}{required&&<b className="cms-required-star" aria-hidden="true">*</b>}</>;
  const errorId=`cms-${fieldKey}-error`;
  const errorText=error&&<small id={errorId} className="cms-field-error" role="alert"><b>!</b>{error}</small>;
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
  if(type==='checkbox')return <label className="cms-checkbox" data-field={fieldKey}><input type="checkbox" checked={value!==false} onChange={(event)=>onChange(event.target.checked)}/><span>{label}</span></label>;
  if(type==='richtext')return <div className={`cms-field cms-wide ${error?'has-error':''}`} data-field={fieldKey}><span>{fieldLabel}</span><RichTextEditor value={value||''} onChange={onChange} label={label} errorId={error?errorId:''}/>{errorText}</div>;
  if(type==='textarea')return <label className={`cms-field cms-wide ${error?'has-error':''}`} data-field={fieldKey}><span>{fieldLabel}</span><textarea required={required} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} placeholder={fieldKey==='notificationEmails'?'quotes@example.com, owner@example.com':fieldKey==='lineOne'?'Enter the complete hero heading':undefined} value={value||''} onChange={(event)=>onChange(event.target.value)}/>{fieldKey==='notificationEmails'&&<small className="cms-field-hint">Separate multiple recipients with commas or new lines. If empty, the Public email receives enquiries.</small>}{fieldKey==='lineOne'&&<small className="cms-field-hint">Use Enter to start a new display line in the hero heading.</small>}{errorText}</label>;
  if(Array.isArray(type))return <label className={`cms-field ${error?'has-error':''}`} data-field={fieldKey}><span>{fieldLabel}</span><select aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} value={value||type[0]?.[0]||''} onChange={(event)=>onChange(event.target.value)}>{type.map(([optionValue,optionLabel])=><option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select>{errorText}</label>;
  if(fieldKey==='imageSide')return <label className={`cms-field ${error?'has-error':''}`} data-field={fieldKey}><span>{fieldLabel}</span><select aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} value={value||'left'} onChange={(event)=>onChange(event.target.value)}><option value="left">Image left</option><option value="right">Image right</option></select>{errorText}</label>;
  if(imageField)return <div className={`cms-field cms-wide cms-image-field ${error?'has-error':''}`} data-field={fieldKey} tabIndex={error?-1:undefined} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined}><span>{fieldLabel}</span><div className="cms-image-control"><div className={`cms-image-preview ${uploading?'is-uploading':''}`}>{previewSource&&!previewFailed?<img src={previewSource} alt={`${label} preview`} onError={()=>setPreviewFailed(true)}/>:<span><ImageUp size={24}/>{previewFailed?'Image unavailable — upload a replacement':'No image uploaded'}</span>}{uploading&&<b className="cms-preview-progress">Uploading image…</b>}</div><div className="cms-image-actions"><label className="cms-upload-button"><ImageUp size={15}/><span>{uploading?'Uploading…':value?'Update image':'Upload image'}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploading} aria-required={required} onChange={(event)=>upload(event.target.files?.[0])}/></label><small>{value?'Choose a new file to replace the current image.':required?'Upload an image to complete this required field.':'Choose an image for this entry.'}<br/>JPG, PNG, WebP, GIF or AVIF · maximum 8 MB</small></div></div>{errorText}{uploadError&&<small className="cms-upload-error">{uploadError}</small>}</div>;
  return <label className={`cms-field ${fieldKey.toLowerCase().includes('image')||fieldKey==='background'?'cms-wide':''} ${error?'has-error':''}`} data-field={fieldKey}><span>{fieldLabel}</span><input type={type} required={required} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} placeholder={type==='tel'?'515-852-4156':type==='email'?'name@example.com':undefined} inputMode={type==='tel'?'numeric':undefined} value={value??''} onChange={(event)=>{let next=event.target.value;if(type==='tel'){const digits=next.replace(/\D/g,'').slice(0,10);next=digits.length>6?`${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`:digits.length>3?`${digits.slice(0,3)}-${digits.slice(3)}`:digits;}onChange(type==='number'?Number(next):next);}}/>{errorText}</label>;
}

function InsuranceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [missing, setMissing] = useState(false);
  const [site, setSite] = useState(defaultSite);
  useEffect(() => {
    fetch(`/api/retreats/${id}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setService)
      .catch(() => {
        const fallback = initialRetreats.find((item) => String(item.id) === String(id));
        if (fallback) setService(fallback); else setMissing(true);
      });
  }, [id]);
  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((content) => {
        if (content.site) {
          setSite(content.site);
          syncSiteIdentity(content.site);
        }
      })
      .catch(() => {});
  }, []);
  if (missing) return <Navigate to="/insurance" replace />;
  if (!service) return <main className="detail-loading">Loading coverage details…</main>;
  const detail = insuranceDetails[service.name] || {
    intro: `Flexible ${service.name.toLowerCase()} coverage selected around your needs, priorities, and budget.`,
    benefits: ['Personal guidance from local agents', 'Plans from multiple trusted carriers', 'Flexible coverage choices', 'A free, no-pressure quote'],
  };
  const combinedContent=combineInsuranceContent(service,detail);
  return <><header className="topbar detail-nav"><Link to="/" className="brand" aria-label={`${site.brandName} ${site.brandSuffix} home`}><img className="brand-logo" src={site.logoUrl || defaultSite.logoUrl} alt=""/><span>{site.brandName || defaultSite.brandName}</span><small>{site.brandSuffix || defaultSite.brandSuffix}</small></Link><nav className="navlinks"><Link to="/">Home</Link><Link to="/insurance">Insurance</Link><Link to="/about">About</Link><Link to="/contact">Contact Us</Link></nav><Link to="/contact" className="button button-dark nav-cta">Get a free quote <ArrowUpRight size={16}/></Link></header><main className="insurance-detail"><section className="detail-hero section-shell"><motion.div className="detail-photo" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.8}}><img src={service.image} alt={service.name}/></motion.div><motion.div className="detail-copy" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.12}}><p className="eyebrow">{site.brandName || defaultSite.brandName} {site.brandSuffix || defaultSite.brandSuffix} <span></span></p><Link className="detail-back" to="/insurance">← All insurance</Link><h1>{service.name}</h1><RichContent className="detail-intro detail-combined-content rich-content" value={combinedContent}/><a href={service.quoteUrl || '/contact'} className="button button-dark">{service.quoteLabel || 'Request your free quote'} <ArrowRight size={17}/></a><p className="detail-phone">Prefer to talk? Call <a href={`tel:${(site.phone || defaultSite.phone).replace(/\D/g,'')}`}>{site.phone || defaultSite.phone}</a></p></motion.div></section><section className="detail-note"><div className="section-shell"><p className="eyebrow light">LOCAL GUIDANCE <span></span></p><h2>Coverage should feel <em>clear and personal.</em></h2><p>Our experienced agents compare options from more than 15 companies to help you find protection that fits your life and your budget.</p></div></section></main></>;
}

function RoutedApp() {
  return <BrowserRouter><Routes><Route path="/" element={<App/>}/><Route path="/insurance" element={<App/>}/><Route path="/insurance/:id" element={<InsuranceDetail/>}/><Route path="/stays" element={<App/>}/><Route path="/experiences" element={<App/>}/><Route path="/about" element={<App/>}/><Route path="/contact" element={<App/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<FullAdmin/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes><Chatbot/></BrowserRouter>;
}

createRoot(document.getElementById('root')).render(<RoutedApp />);
