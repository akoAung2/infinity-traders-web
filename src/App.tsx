import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  ExternalLink,
  MessageCircle,
  Video,
  Mail,
  Menu,
  X,
  Globe,
  Award,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

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
    { name: 'Premium', href: '#premium' },
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

const SectionHeading = ({ title, subtitle, centered = true }: { title: string; subtitle?: string; centered?: boolean }) => (
  <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-white/60 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
    <div className={`h-1 w-20 bg-red-500 mt-6 ${centered ? 'mx-auto' : ''} rounded-full`} />
  </div>
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

const BrokerActionBlock = ({ name, liveUrl, guideUrl }: { name: string; liveUrl: string; guideUrl: string }) => (
  <div className="glass p-8 rounded-3xl text-center">
    <h3 className="text-2xl font-bold mb-6">{name}</h3>
    <div className="flex flex-col gap-4">
      <a 
        href={liveUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
      >
        Open Live Account <ExternalLink className="w-4 h-4" />
      </a>
      <a 
        href={guideUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
      >
        Account Opening Guideline <BookOpen className="w-4 h-4" />
      </a>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-red-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-800/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-8"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Myanmar's #1 Trading Community</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
            >
              Infinite Knowledge.<br />
              <span className="text-red-500">Infinite Growth.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl leading-relaxed"
            >
              Empowering Myanmar traders with free professional trading education and real broker support.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <a 
                href="https://t.me/+ttDUW71_HVwyMWM9"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                Join Free Community <ChevronRight className="w-5 h-5" />
              </a>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95">
                Explore Systems
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 glass rounded-3xl border-red-500/10 max-w-xl"
            >
              <p className="text-white/70 italic leading-relaxed">
                "Infinity Trader Community is built to make Myanmar’s trading ecosystem stronger by giving everything we can for FREE — knowledge, systems, and broker support."
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-40 pointer-events-none select-none">
          <img 
            src="https://picsum.photos/seed/infinity-red-3d/1000/1000" 
            alt="Infinity Trader Decorative" 
            className="w-[700px] h-auto animate-float"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Purpose Section */}
      <section id="purpose" className="py-24 bg-stone-950/50">
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
                  src="https://picsum.photos/seed/trading/800/800" 
                  alt="Trading Purpose" 
                  className="w-full h-full object-cover rounded-2xl opacity-80"
                  referrerPolicy="no-referrer"
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

      {/* Systems Section */}
      <section id="systems" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Master Proven Trading Systems" 
            subtitle="Choose the system that fits your personality and master the markets with professional precision."
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <SystemCard 
              icon={TrendingUp}
              title="SMC (Smart Money Concept)"
              description="Learn institutional trading concepts in structured modules. Understand how big banks move the markets."
              buttonText="Start Learning SMC"
              href="https://t.me/c/3540469523/16"
            />
            <SystemCard 
              icon={Video}
              title="ICT (Inner Circle Trader)"
              description="Advanced liquidity and market structure training. Master time and price theory for high-probability setups."
              buttonText="Learn ICT"
              href="https://t.me/c/3540469523/24"
            />
            <SystemCard 
              icon={ShieldCheck}
              title="SNR (Support & Resistance)"
              description="Master strong price reaction zones and entry models. The foundation of technical analysis refined for modern markets."
              buttonText="Explore SNR Theory"
              href="https://t.me/c/3540469523/22"
            />
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section id="premium" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass p-12 md:p-20 rounded-[40px] border-red-500/20 red-glow">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
                  Mentorship
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Premium Membership Program</h2>
                <p className="text-xl text-white/60 mb-10 leading-relaxed">
                  For traders who want deeper mentorship, advanced strategy breakdown, and live market guidance. Take your trading from hobby to professional career.
                </p>
                
                <ul className="space-y-4 mb-12">
                  {[
                    "Premium Private Group Access",
                    "Advanced Strategy Course",
                    "Market Breakdown Sessions",
                    "Risk Management Masterclass"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-lg">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <button className="bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-red-500/40 active:scale-95">
                  Buy Premium Course
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img src="https://picsum.photos/seed/chart1/400/400" alt="Chart" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                    <img src="https://picsum.photos/seed/chart2/400/500" alt="Chart" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                    <img src="https://picsum.photos/seed/chart3/400/500" alt="Chart" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img src="https://picsum.photos/seed/chart4/400/400" alt="Chart" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brokers Section */}
      <section id="brokers" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Our Broker Collaborations" 
            subtitle="We partner with world-class brokers to ensure our community gets the best trading conditions, lowest spreads, and fastest execution."
          />
          
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <BrokerCard 
              name="VT Markets"
              year="2015"
              awards={["Best ECN Broker 2023", "Fastest Growing Broker", "Top Tier Liquidity"]}
              description="A global multi-asset broker providing traders with access to 1000+ financial instruments. Known for its robust technology and competitive spreads."
              logo={Globe}
            />
            <BrokerCard 
              name="Ultima Markets"
              year="2016"
              awards={["Most Transparent Broker", "Best Customer Support", "Innovation in Trading"]}
              description="An international brokerage firm dedicated to providing a premium trading environment with cutting-edge tools and deep market liquidity."
              logo={Globe}
            />
          </div>

          <SectionHeading 
            title="Open Your Live Trading Account" 
            subtitle="Start your professional trading journey today with our trusted partners."
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            <BrokerActionBlock 
              name="Ultima Markets"
              liveUrl="https://ultgo.com/la-com/BavQ65KR"
              guideUrl="#"
            />
            <BrokerActionBlock 
              name="VT Markets"
              liveUrl="https://www.vtmarkets.com/trade-now/?affid=22393651"
              guideUrl="#"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionHeading 
            title="Connect With Us" 
            subtitle="Have questions? Join our social channels or reach out directly to our support team."
          />
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { name: 'Telegram', icon: MessageCircle, color: 'bg-sky-500', href: 'https://t.me/+ttDUW71_HVwyMWM9' },
              { name: 'TikTok', icon: Video, color: 'bg-pink-600', href: '#' },
              { name: 'Gmail', icon: Mail, color: 'bg-red-500', href: '#' }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-4 group"
              >
                <div className={`w-20 h-20 rounded-3xl ${social.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all red-glow`}>
                  <social.icon className="w-10 h-10 text-white" />
                </div>
                <span className="font-bold text-lg">{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

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
