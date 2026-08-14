import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  ArrowUpRight,
  Check,
  MessageCircle,
  Video,
  Mail,
  Menu,
  X,
  Globe,
  Award,
  Calendar,
  Send
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';

// --- Motion utilities ---

const useScrollDirection = () => {
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateDirection = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastY.current) > 8) {
        setDirection(currentY < lastY.current ? 'up' : 'down');
        lastY.current = currentY;
      }
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateDirection);
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
};

const revealViewport = { once: false, amount: 0.2, margin: '0px 0px -10% 0px' } as const;

// --- Components ---

const CinematicSection = ({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.45 });
  const y = useTransform(progress, [0, 0.5, 1], [32, 0, -32]);
  const opacity = useTransform(progress, [0, 0.16, 0.84, 1], [0.78, 1, 1, 0.78]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.985, 1, 0.985]);
  const blur = useTransform(progress, [0, 0.18, 0.82, 1], [2, 0, 0, 2]);

  return (
    <motion.div ref={ref} id={id} className={`cinematic-chapter ${className}`} style={{ y, opacity, scale, filter: blur }}>
      <div className="cinematic-chapter-scan" aria-hidden="true" />
      {children}
    </motion.div>
  );
};

const Logo = ({ size = "normal" }: { size?: "small" | "normal" | "large" }) => {
  const dimensions = size === "small" ? "w-8 h-8" : size === "large" ? "w-16 h-16" : "w-10 h-10";
  return (
    <div className={`${dimensions} flex items-center justify-center select-none`}>
      <img 
        src="/images/logo.png" 
        alt="Infinity Trader Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Purpose', href: '#purpose' },
    { name: 'Systems', href: '#systems' },
    { name: 'Next-Level ', href: '#premium' },
    { name: 'Brokers', href: '#brokers' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-3 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold tracking-tighter uppercase">
            Infinity <span className="text-red-500">Trader</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-white/70 hover:text-red-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="https://t.me/+ttDUW71_HVwyMWM9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            Join Community
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-white/70"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="https://t.me/+ttDUW71_HVwyMWM9"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 text-white py-3 rounded-xl font-semibold text-center"
              >
                Join Community
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CONTACT_EMAIL = 'iinfinitytraders@gmail.com';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    const subject = encodeURIComponent('New Message from Website');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm"
      style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 0 80px rgba(234, 100, 30, 0.03)' }}
    >
      <h3 className="text-xl font-bold text-white mb-1">Send us a message</h3>
      <p className="text-white/30 text-sm mb-8">We will get back to you as soon as possible.</p>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-12 gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-green-400" />
            </div>
            <p className="text-white font-semibold text-lg">Message Ready</p>
            <p className="text-white/40 text-sm text-center max-w-xs">
              Your email client should open with the message pre-filled. Just hit send!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-5"
          >
            <div>
              <label htmlFor="contact-name" className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none transition-all duration-300 focus:border-orange-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(234,100,30,0.08)]"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none transition-all duration-300 focus:border-orange-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(234,100,30,0.08)]"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none transition-all duration-300 focus:border-orange-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(234,100,30,0.08)] resize-none"
              />
            </div>
            <button
              type="submit"
              className="group relative w-full bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98] hover:shadow-2xl hover:shadow-orange-500/20 overflow-hidden mt-1"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2.5">
                Send Message <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

const SectionHeading = ({ title, subtitle, centered = true }: { title: string; subtitle?: string; centered?: boolean }) => (
  <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      className="text-3xl md:text-4xl font-bold mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ delay: 0.1 }}
        className="text-white/60 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
    <div className={`h-1 w-20 bg-red-500 mt-6 ${centered ? 'mx-auto' : ''} rounded-full`} />
  </div>
);

type TradingSystem = { id: string; title: string; subtitle: string; points: string[]; href: string; type: 'smc' | 'ict' | 'snr' };

const SystemVisualization = ({ type }: { type: TradingSystem['type'] }) => (
  <div className={`system-visual system-visual-${type}`} aria-hidden="true">
    <div className="system-visual-grid" />
    {type === 'smc' && <svg viewBox="0 0 360 150" role="presentation"><path className="visual-line" d="M12 112 L62 92 L94 106 L130 62 L166 78 L204 38 L244 54 L280 25 L348 42" /><path className="visual-guide" d="M12 126 H348 M26 84 H348" /><circle className="visual-node" cx="204" cy="38" r="4" /><text x="215" y="32">BOS</text><text x="25" y="79">LIQUIDITY</text></svg>}
    {type === 'ict' && <svg viewBox="0 0 360 150" role="presentation"><path className="visual-guide" d="M18 120 H342 M72 28 V130 M180 28 V130 M288 28 V130" /><path className="visual-line" d="M18 101 L60 96 L104 102 L146 58 L180 72 L214 43 L258 82 L298 55 L342 64" /><circle className="visual-node" cx="214" cy="43" r="4" /><text x="48" y="24">LONDON</text><text x="156" y="24">NY OPEN</text><text x="276" y="24">NY CLOSE</text></svg>}
    {type === 'snr' && <svg viewBox="0 0 360 150" role="presentation"><path className="visual-zone" d="M18 42 H342 M18 108 H342" /><path className="visual-guide" d="M18 75 H342" /><path className="visual-line" d="M18 84 L62 80 L104 86 L142 67 L176 72 L214 92 L248 57 L286 65 L342 30" /><circle className="visual-node" cx="248" cy="57" r="4" /><text x="24" y="36">RESISTANCE</text><text x="24" y="126">SUPPORT</text></svg>}
  </div>
);

const TradingSystemCard = ({ system, index }: { system: TradingSystem; index: number; key?: string }) => (
  <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={revealViewport} transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="trading-system-card">
    <div className="system-card-top"><span>SYSTEM {system.id}</span><b><i /> FREE</b></div>
    <h3>{system.title}</h3><div className="system-card-subtitle">{system.subtitle}</div>
    <SystemVisualization type={system.type} />
    <ul>{system.points.map((point) => <li key={point}><span />{point}</li>)}</ul>
    <div className="system-card-footer"><strong>100% FREE</strong><a href={system.href} target="_blank" rel="noopener noreferrer">Explore System <ArrowRight /></a></div>
  </motion.article>
);

const SystemCard = ({ title, description, icon: Icon, buttonText, href }: { title: string; description: string; icon: any; buttonText: string; href: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-8 rounded-3xl flex flex-col h-full red-glow-hover transition-all duration-300"
  >
    <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
      <Icon className="text-red-500 w-8 h-8" />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-white/60 mb-8 flex-grow">{description}</p>
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-red-500 font-semibold hover:gap-4 transition-all"
    >
      {buttonText} <ArrowRight className="w-4 h-4" />
    </a>
  </motion.div>
);

const BrokerCard = ({ name, year, awards, description, logo: Logo }: { name: string; year: string; awards: string[]; description: string; logo: any }) => (
  <div className="glass p-8 rounded-3xl border-red-500/10 hover:border-red-500/30 transition-all">
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-2xl font-bold">{name}</h3>
      <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
        EST. {year}
      </div>
    </div>
    <p className="text-white/60 mb-6">{description}</p>
    <div className="space-y-3 mb-8">
      {awards.map((award, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-white/80">
          <Award className="w-4 h-4 text-red-500" />
          {award}
        </div>
      ))}
    </div>
    <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold">
      Learn More
    </button>
  </div>
);

type AccountOption = {
  name: string;
  spread: string;
  commission: string;
  minDeposit?: string;
};

type BrokerAccess = {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
  tagline: string;
  platforms: string[];
  accounts: AccountOption[];
  ctaUrl: string;
};

const brokerAccess: BrokerAccess[] = [
  {
    id: 'vt-markets',
    name: 'VT Markets',
    logo: '/brokers/vt-markets.webp',
    logoAlt: 'VT Markets logo',
    tagline: 'Global Market Access',
    platforms: ['MT4', 'MT5', 'TradingView', 'WebTrader'],
    accounts: [
      { name: 'Standard STP', spread: 'From 1.2 pips', commission: '$0' },
      { name: 'Raw ECN', spread: 'From 0.0 pips', commission: '$6 round turn' },
    ],
    ctaUrl: 'https://www.vtmarkets.com/trade-now/?affid=22393651',
  },
  {
    id: 'ultima-markets',
    name: 'Ultima Markets',
    logo: '/brokers/ultima-markets.jpg',
    logoAlt: 'Ultima Markets logo',
    tagline: 'Multi-Asset Market Access',
    platforms: ['MT4', 'MT5', 'WebTrader'],
    accounts: [
      { name: 'Standard', spread: 'From 1.0 pips', commission: '$0', minDeposit: '$20' },
      { name: 'ECN', spread: 'From 0.0 pips', commission: '$5' },
    ],
    ctaUrl: 'https://ultgo.com/la-com/BavQ65KR',
  },
];

const AccountOption = ({ account }: { account: AccountOption; key?: React.Key }) => (
  <div className="broker-account-option">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h4 className="text-sm font-semibold text-[#F5F5F5]">{account.name}</h4>
      <Check className="h-4 w-4 text-[#FF4D3D]" />
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div><div className="broker-spec-label">Spread</div><div className="broker-spec-value">{account.spread}</div></div>
      <div><div className="broker-spec-label">Commission</div><div className="broker-spec-value">{account.commission}</div></div>
      {account.minDeposit && <div><div className="broker-spec-label">Min deposit</div><div className="broker-spec-value">{account.minDeposit}</div></div>}
    </div>
  </div>
);

const BrokerActionBlock = ({ broker, index }: { broker: BrokerAccess; index: number; key?: React.Key }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={revealViewport}
    transition={{ delay: index * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    className="broker-access-card group"
  >
    <div className="broker-card-glow" />
    <div className="broker-card-accent" />
    <div className="relative z-10 flex h-full flex-col">
      <div className="flex items-start justify-between gap-6">
        <div className="broker-logo-wrap">
          <img src={broker.logo} alt={broker.logoAlt} className="broker-logo" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-[#71717A] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF4D3D]" />
      </div>
      <div className="mt-5">
        <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#71717A]">{broker.tagline}</h3>
      </div>
      <div className="mt-8">
        <div className="broker-section-label">Account options</div>
        <div className="mt-3 flex flex-col gap-3">
          {broker.accounts.map((account) => <AccountOption key={account.name} account={account} />)}
        </div>
      </div>
      <div className="mt-7">
        <div className="broker-section-label">Platforms</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {broker.platforms.map((platform) => <span key={platform} className="broker-platform-chip">{platform}</span>)}
        </div>
      </div>
      <a href={broker.ctaUrl} target="_blank" rel="noopener noreferrer" className="broker-cta mt-8">
        Open Live Account <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </a>
    </div>
  </motion.article>
);

// --- Main App ---

export default function App() {
  const scrollDirection = useScrollDirection();

  return (
    <div
      data-scroll-direction={scrollDirection}
      className="min-h-screen font-sans selection:bg-red-500/30 transition-colors duration-300"
    >
      <Navbar />

      {/* Hero Section */}
      <CinematicSection className="cinematic-hero">
      <section className="hero-section relative min-h-[90vh] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_72%,rgba(255,55,45,0.08),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_50%_35%,rgba(255,106,42,0.035),transparent_75%)]" />
        <div className="hero-grid absolute inset-x-0 bottom-0 h-[48%] pointer-events-none" />
        <div className="hero-line hero-line-left absolute left-[-6%] top-[28%] h-[55%] w-px rotate-[28deg] bg-white/[0.07]" />
        <div className="hero-line hero-line-right absolute right-[-6%] top-[26%] h-[58%] w-px rotate-[-28deg] bg-white/[0.07]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 pb-32 pt-32 text-center md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30] hero-status-dot" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/55 md:text-[11px]">{"Myanmar's #1 Trading Community"}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1100px] text-balance text-[clamp(48px,7vw,92px)] font-black leading-[0.96] tracking-[-0.055em]"
          >
            <span className="text-[#F5F5F5]">Infinity Knowledge.</span>
            <br />
            <span className="bg-gradient-to-r from-[#FF3B30] to-[#FF6A2A] bg-clip-text text-transparent">Infinity Growth.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-[620px] text-[15px] leading-[1.6] text-[#A1A1AA] md:text-[18px]"
          >
            Empowering Myanmar traders with free professional trading education and real broker support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
          >
            <a href="https://t.me/+ttDUW71_HVwyMWM9" target="_blank" rel="noopener noreferrer" className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3B30] to-[#FF5A30] px-7 text-[15px] font-semibold text-white shadow-lg shadow-red-500/15 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-red-500/25 active:scale-[0.98]">
              Join Free Community <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#systems" className="inline-flex h-14 items-center justify-center rounded-xl border border-white/[0.18] bg-white/[0.02] px-7 text-[15px] font-semibold text-white/80 transition-all duration-300 hover:border-white/[0.35] hover:bg-white/[0.05] hover:text-white active:scale-[0.98]">
              Explore Systems
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex items-center justify-center divide-x divide-white/[0.12]"
          >
            {[
              { value: '100%', label: 'Free Core Education' },
              { value: '3', label: 'Trading Systems' },
              { value: '2', label: 'Broker Partners' },
            ].map((stat) => (
              <div key={stat.label} className="px-5 text-center first:pl-0 last:pr-0 sm:px-9">
                <div className="font-sans text-2xl font-bold tracking-tight text-[#F5F5F5] md:text-3xl">{stat.value}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#71717A] md:text-[10px]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hero-marquee absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-y border-red-500/[0.25] bg-[#050505]/70 py-3 backdrop-blur-sm md:py-4">
          <div className="mb-2 text-center font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-white/40 md:text-[10px]">In collaboration with</div>
          <div className="hero-marquee-mask overflow-hidden">
            <div className="hero-marquee-track flex w-max items-center">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10">
                  {['VT Markets', 'Ultima Markets', 'Burmese Funded Trader', 'Select2Notion'].map((name) => (
                    <span key={`${copy}-${name}`} className="flex items-center gap-6 whitespace-nowrap font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-white md:gap-10 md:text-[15px]">
                      {name}<span className="h-1 w-1 rounded-full bg-[#FF3B30]" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </CinematicSection>

      {/* Purpose Section */}
      <CinematicSection id="purpose" className="cinematic-purpose">
      <section className="py-24 bg-stone-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading 
                title="Our Purpose" 
                centered={false}
              />
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Infinity Trader Community exists to improve and elevate the trading standard in Myanmar. 
                We provide free access to powerful trading systems including SMC, ICT, and SNR.
              </p>
              <p className="text-lg text-white/70 mb-12 leading-relaxed">
                We support traders with the lowest possible spreads through our broker collaborations. 
                Our mission is simple: <span className="text-red-500 font-bold">Give real knowledge. Build real traders. Create financial independence.</span>
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: ShieldCheck, text: "100% Free Core Education" },
                  { icon: BookOpen, text: "Structured System-Based Learning" },
                  { icon: Users, text: "Live Account Broker Support" },
                  { icon: TrendingUp, text: "Long-Term Trader Development" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-medium text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden glass p-2">
                <img 
              src="/images/purpose-community.png"
              alt="Infinity Traders community and brand partnerships"
              className="w-full h-full object-contain rounded-xl opacity-100 border border-white/20"
              style={{ marginTop: '4px' }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl red-glow animate-float">
                <div className="text-3xl font-bold text-red-500">100%</div>
                <div className="text-xs text-white/60 uppercase tracking-widest font-bold">Free Education</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </CinematicSection>

      {/* Systems Section */}
      <CinematicSection id="systems" className="cinematic-systems">
      <section className="trading-systems-section relative overflow-hidden">
        <div className="systems-technical-bg" aria-hidden="true"><div className="systems-radar" /><div className="systems-chart-line" /></div>
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 py-20 md:px-12 md:py-28">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={revealViewport} className="systems-header">
            <div className="systems-label"><span /> FREE TRADING EDUCATION</div>
            <h2>Master Proven<br /><em>Trading Systems.</em></h2>
            <p>Structured trading frameworks built to help you read the market with clarity, precision and discipline.</p>
            <div className="free-education-panel"><div className="free-panel-icon">%</div><div><strong><b>100%</b> FREE EDUCATION</strong><span>Every system. No payment required.</span></div><i /></div>
          </motion.div>
          <div className="trading-systems-grid">
            {([
              { id: '01', title: 'SMC', subtitle: 'Smart Money Concept', type: 'smc', href: 'https://t.me/c/3540469523/16', points: ['Market Structure', 'Liquidity Concepts', 'Institutional Order Flow'] },
              { id: '02', title: 'ICT', subtitle: 'Inner Circle Trader', type: 'ict', href: 'https://t.me/c/3540469523/24', points: ['Session Timing', 'Liquidity Sweeps', 'Price Delivery'] },
              { id: '03', title: 'SNR', subtitle: 'Support & Resistance', type: 'snr', href: 'https://t.me/c/3540469523/22', points: ['Key Reaction Zones', 'Clean Price Action', 'Entry & Exit Models'] }
            ] as TradingSystem[]).map((system, index) => <TradingSystemCard key={system.id} system={system} index={index} />)}
          </div>
          <div className="benefits-strip">{[['100% FREE', 'All systems and lessons are completely free.'], ['HIGH QUALITY', 'Structured trading education.'], ['PRACTICAL LEARNING', 'Real market concepts and implementation.'], ['FOR EVERY TRADER', 'Beginners to advanced, everyone can learn.']].map(([title, text]) => <div key={title}><span>◆</span><strong>{title}</strong><p>{text}</p></div>)}</div>
        </div>
      </section>
      </CinematicSection>

      {/* Premium Section */}
      <CinematicSection id="premium" className="cinematic-premium">
      <section className="premium-coming-soon relative overflow-hidden">
        <div className="premium-atmosphere" aria-hidden="true" />
        <div className="premium-shell relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <div className="premium-layout">
            <div className="premium-copy">
              <div className="premium-kicker"><span /> PREMIUM MEMBERSHIP PROGRAM</div>
              <h2>THE NEXT LEVEL<br /><em>IS LOADING.</em></h2>
              <p>We&apos;re building a premium trading ecosystem for traders who want sharper systems, deeper execution, and a serious edge.</p>
              <div className="premium-status"><i /> ACCESS RESTRICTED <span>·</span> COMING SOON</div>
            </div>
            <div className="premium-core">
              <div className="premium-core-corners" aria-hidden="true" />
              <div className="premium-core-label">PREMIUM ENVIRONMENT</div>
              <div className="premium-logo-pulse"><img src="/images/logo.png" alt="Infinity Trader" /></div>
              <div className="premium-core-wordmark">INFINITY<br />TRADER</div>
              <div className="premium-core-meta"><span>SYS: PREPARING</span><span>V.01</span></div>
            </div>
            <div className="premium-features">
              {[
                ["01", "THE TRADING DESK", "Execution frameworks, market context and repeatable systems."],
                ["02", "PRIVATE SIGNALS", "High-conviction ideas built around process, not noise."],
                ["03", "LIVE BREAKDOWNS", "Real-time thinking for traders ready to sharpen their edge."],
                ["04", "THE INNER CIRCLE", "A focused room for serious growth and accountability."]
              ].map(([number, title, description]) => (
                <div className="premium-feature" key={number}>
                  <div className="premium-feature-top"><span>{number}</span><i>LOCKED</i></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <button type="button" className="premium-cta" aria-label="Stay tuned for the Premium Membership Program">STAY TUNED <span>→</span></button>
          </div>
          <div className="premium-marquee" aria-label="Future premium modules">
            <div className="premium-marquee-track"><span>PRIVATE SIGNALS</span><b>◆</b><span>LIVE BREAKDOWNS</span><b>◆</b><span>ADVANCED SYSTEMS</span><b>◆</b><span>THE INNER CIRCLE</span><b>◆</b><span>PRIVATE SIGNALS</span><b>◆</b><span>LIVE BREAKDOWNS</span><b>◆</b></div>
          </div>
        </div>
      </section>
      </CinematicSection>

      {/* Partners & Collaborations / Trading Ecosystem */}
      <CinematicSection id="brokers" className="cinematic-brokers">
      <section className="ecosystem-section relative min-h-[100svh] overflow-hidden py-16 md:py-20">
        <div className="ecosystem-grid" />
        <div className="ecosystem-terrain" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={revealViewport} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center">
            <div className="ecosystem-eyebrow"><span>03</span><i />PARTNERS &amp; COLLABORATIONS</div>
            <h2 className="mt-7 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#F5F5F5] md:text-7xl">Built With The<br /><span>Trading Ecosystem.</span></h2>
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-[#A1A1AA] md:text-lg">Working alongside brokers, funded trading programs and tools that help our community trade, learn and grow.</p>
          </motion.div>

          <div className="ecosystem-map mt-12 md:mt-14">
            <svg className="ecosystem-routes" viewBox="0 0 1000 380" aria-hidden="true" preserveAspectRatio="none">
              <path id="route-vt" d="M 230 70 C 330 70, 365 140, 401 146" />
              <path id="route-ultima" d="M 230 310 C 330 310, 365 240, 401 234" />
              <path id="route-bft" d="M 770 70 C 670 70, 635 140, 599 146" />
              <path id="route-select" d="M 770 310 C 670 310, 635 240, 599 234" />
              {['route-vt', 'route-ultima', 'route-bft', 'route-select'].map((route, index) => <circle key={route} className="route-pulse" r="4"><animateMotion dur="4s" begin={`${index * 0.75}s`} repeatCount="indefinite"><mpath href={`#${route}`} /></animateMotion></circle>)}
            </svg>
            <div className="ecosystem-orbit orbit-one" /><div className="ecosystem-orbit orbit-two" /><div className="ecosystem-orbit orbit-three" />
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={revealViewport} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="ecosystem-hub">
              <div className="ecosystem-hub-ring"><Logo size="large" /></div>
              <div className="ecosystem-hub-wordmark">INFINITY<br />TRADER</div>
            </motion.div>
            {[
              { name: 'VT Markets', category: 'BROKER PARTNER', logo: '/brokers/vt-markets.webp', alt: 'VT Markets', position: 'node-vt', id: 'vt' },
              { name: 'Ultima Markets', category: 'BROKER PARTNER', logo: '/brokers/ultima-markets.jpg', alt: 'Ultima Markets', position: 'node-ultima', id: 'ultima' },
              { name: 'Burmese Funded Trader', category: 'PROP TRADING PARTNER', logo: '/brokers/burmese-funded-trader.webp', alt: 'Burmese Funded Trader', position: 'node-bft', id: 'bft' },
              { name: 'Select2Notion', category: 'TRADING JOURNAL PLATFORM', logo: '/brokers/select2notion.jpg', alt: 'Select2Notion', position: 'node-select', id: 'select' },
            ].map((partner, index) => (
              <motion.div key={partner.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={revealViewport} transition={{ delay: 0.1 * index, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className={`ecosystem-node ${partner.position}`}>
                <div className="ecosystem-node-top"><span><i />COLLABORATION</span></div>
                <div className="ecosystem-logo-frame"><img src={partner.logo} alt={`${partner.alt} logo`} /></div>
                <div className="ecosystem-node-label"><span>{partner.category.split(' ')[0]}</span> {partner.category.split(' ').slice(1).join(' ')}</div>
              </motion.div>
            ))}
          </div>

          <div className="ecosystem-statement"><span>DIFFERENT PLATFORMS.</span><strong>ONE TRADING ECOSYSTEM.</strong></div>

          <div className="ecosystem-marquee-header"><span><i />OUR PARTNERS</span><span>TRUSTED COLLABORATIONS</span></div>
          <div className="ecosystem-marquee"><div className="ecosystem-marquee-track">{[0, 1].map((copy) => <div key={copy} className="ecosystem-marquee-copy">{['VT Markets', 'Ultima Markets', 'Burmese Funded Trader', 'Select2Notion'].map((name) => <span key={`${copy}-${name}`}>{name}<b>•</b></span>)}</div>)}</div></div>
          <div className="ecosystem-auto-loop">AUTO LOOP <i /></div>

          <div className="ecosystem-benefits">
            {[{ icon: ShieldCheck, title: 'TRUSTED PARTNERS', text: 'We collaborate only with established trading entities.' }, { icon: Users, title: 'STRONG RELATIONSHIPS', text: 'Long-term relationships built around transparency and value.' }, { icon: Award, title: 'MORE OPPORTUNITIES', text: 'More access, more tools and more opportunities for traders.' }, { icon: TrendingUp, title: 'COMMUNITY FIRST', text: 'Everything we build is designed around our community.' }].map((benefit) => <div key={benefit.title} className="ecosystem-benefit"><benefit.icon /><div><h3>{benefit.title}</h3><p>{benefit.text}</p></div></div>)}
          </div>
        </div>
      </section>
      </CinematicSection>

      <CinematicSection id="live-account" className="cinematic-live-account">
      <div id="live-account" className="broker-access-section relative overflow-hidden px-6 py-24 md:px-10 md:py-36">
        <div className="broker-access-atmosphere" />
        <div className="broker-access-grid" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="broker-eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30]" />Live Account Access</div>
            <h2 className="mt-5 text-balance text-4xl font-bold tracking-[-0.04em] text-[#F5F5F5] md:text-6xl">Open Your Live Account.</h2>
            <p className="mt-6 text-pretty text-base leading-relaxed text-[#A1A1AA] md:text-lg">Choose the trading setup that fits your strategy, platform and trading conditions.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#71717A] md:text-[11px]">
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#FF3B30]" />Broker Access</span><span>MT4 · MT5</span><span>Global Markets</span>
            </div>
          </motion.div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {brokerAccess.map((broker, index) => <BrokerActionBlock key={broker.id} broker={broker} index={index} />)}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center font-mono text-[9px] leading-relaxed text-[#52525B] md:text-[10px]">Trading conditions, spreads, commissions and availability may vary by region, account type and market conditions.</p>
        </div>
      </div>
      </CinematicSection>

      {/* Contact Section */}
      <CinematicSection id="contact" className="cinematic-contact">
      <section className="relative py-28 md:py-36 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #050505 0%, #0d0808 35%, #120a07 60%, #080505 100%)' }} />
        <div 
          className="absolute pointer-events-none"
          style={{ top: '5%', right: '10%', width: '50%', height: '80%', background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(234, 100, 20, 0.06) 0%, transparent 70%)' }}
        />
        {/* Faint watermark text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <span className="text-[12vw] font-black uppercase tracking-widest text-white/[0.015] whitespace-nowrap">CONTACT</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* LEFT SIDE - Contact Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-white/60 text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-6">
                  Contact
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                  Get in touch
                </h2>
                <p className="text-white/40 text-lg leading-relaxed max-w-md mb-10">
                  Have questions about trading, our community, or broker support? Reach out through any of the channels below.
                </p>
              </motion.div>

              <div className="flex flex-col gap-4">
                {[
                  { 
                    label: 'Email Us', 
                    detail: 'iinfinitytraders@gmail.com', 
                    icon: Mail, 
                    href: 'mailto:iinfinitytraders@gmail.com',
                    iconBg: 'bg-red-500/15',
                    iconColor: 'text-red-400',
                  },
                  { 
                    label: 'Telegram', 
                    detail: 'Infinity Trader Community', 
                    icon: MessageCircle, 
                    href: 'https://t.me/+ttDUW71_HVwyMWM9',
                    iconBg: 'bg-sky-500/15',
                    iconColor: 'text-sky-400',
                  },
                  { 
                    label: 'TikTok', 
                    detail: '@infinity_traders1', 
                    icon: Video, 
                    href: 'https://www.tiktok.com/@infinity_traders1?_r=1&_t=ZS-94Oxj7X8eaC',
                    iconBg: 'bg-pink-500/15',
                    iconColor: 'text-pink-400',
                  },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={revealViewport}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/20 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/[0.04]"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm mb-0.5">{item.label}</div>
                      <div className="text-white/35 text-sm truncate">{item.detail}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-orange-400 transition-all duration-300 group-hover:translate-x-1 shrink-0" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE - Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex-1 relative"
            >
              {/* Glow behind form */}
              <div 
                className="absolute -inset-4 pointer-events-none hidden lg:block"
                style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(234, 100, 30, 0.05) 0%, transparent 70%)' }}
              />
              
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
      </CinematicSection>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Logo size="small" />
                <span className="text-xl font-bold tracking-tighter uppercase">
                  Infinity <span className="text-red-500">Trader</span>
                </span>
              </div>
              <p className="text-white/50 max-w-sm mb-6">
                Empowering Myanmar Traders Since 2024. We are dedicated to building a professional trading ecosystem through education and support.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><a href="#purpose" className="hover:text-red-500 transition-colors">Our Purpose</a></li>
                <li><a href="#systems" className="hover:text-red-500 transition-colors">Trading Systems</a></li>
                <li><a href="#premium" className="hover:text-red-500 transition-colors">Premium Mentorship</a></li>
                <li><a href="#brokers" className="hover:text-red-500 transition-colors">Broker Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Risk Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
            <p>© 2026 Infinity Trader Community. All rights reserved.</p>
            <p className="max-w-2xl text-center md:text-right">
              Trading financial instruments involves high risk. Past performance is not indicative of future results. Please trade responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
