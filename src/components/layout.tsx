import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Sun, Moon, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { useCart } from '../lib/cart';

const DotMatrix = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="12" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
  </svg>
);

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);
  const location = useLocation();
  const { count: cartCount } = useCart();

  const [isLightMode, setIsLightMode] = useState(() => {
    return document.documentElement.classList.contains('light');
  });

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('light')) {
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLightMode(false);
    } else {
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLightMode(true);
    }
  };

  const navCategories = [
    {
      title: "PERFORMANCE",
      links: [
        { label: "Elite Athletes", path: "/athletes" },
        { label: "Parents & Youth", path: "/parents" },
        { label: "Pro & Motorsports", path: "/pro-sports" },
        { label: "Officials & Referees", path: "/officials" },
        { label: "By Sport Hub", path: "/sports" }
      ]
    },
    {
      title: "PLATFORMS & TECH",
      links: [
        { label: "The A.R.E.S. System", path: "/ares-performance-system" },
        { label: "Coaches Protocol", path: "/coaches" },
        { label: "Teams & Facilities", path: "/teams-and-organizations" },
        { label: "Technology & Data", path: "/technology-and-data" },
        { label: "Purchase Packages", path: "/book/packages" },
        { label: "Performance Shop", path: "/shop" },
        { label: "A.R.E.S. Certification", path: "/certification" }
      ]
    },
    {
      title: "OUTCOMES & COMPANY",
      links: [
        { label: "Results & Case Studies", path: "/results" },
        { label: "Research & Insights", path: "/resources" },
        { label: "Speaking & Keynotes", path: "/speaking" },
        { label: "Who We Are", path: "/identity" },
        { label: "Training FAQ", path: "/faq" }
      ]
    }
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <>
      {/* Hybrid HUD Header (Desktop & Mobile Top Elements) */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none safe-top bg-[var(--color-ares-bg)]/80 backdrop-blur-md border-b border-[var(--color-ares-border)]">
        
        {/* Minimal Luxury Notification Bar */}
        <div className="w-full bg-[var(--color-ares-charcoal)] border-b border-[var(--color-ares-border)] py-1.5 px-4 flex justify-center items-center pointer-events-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-mono tracking-widest uppercase">
            <span className="text-[var(--color-ares-muted)] font-bold">Active Clients:</span>
            <Link to="/book/in-office" className="text-white hover:text-[var(--color-ares-teal)] transition-colors inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)]"></span>
              Book In-Office
            </Link>
            <span className="text-[var(--color-ares-border)] hidden sm:inline">|</span>
            <Link to="/book/tele-training" className="text-white hover:text-[var(--color-ares-purple)] transition-colors inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-purple)]"></span>
              Book Tele-Training
            </Link>
            <span className="text-[var(--color-ares-border)] hidden sm:inline">|</span>
            <Link to="/book/packages" className="text-white hover:text-[var(--color-ares-teal)] transition-colors inline-flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] animate-ping"></span>
              Purchase Packages
            </Link>
            <span className="text-[var(--color-ares-border)] hidden sm:inline">|</span>
            <Link to="/cart" className="text-white hover:text-[var(--color-ares-teal)] transition-colors inline-flex items-center gap-1.5" aria-label="Cart">
              <ShoppingCart className="w-3.5 h-3.5" />
              Cart{cartCount > 0 ? ` (${cartCount})` : ''}
            </Link>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
          
          {/* Top Left: Logo */}
          <div className="pointer-events-auto shrink-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 transition-colors">
              <img 
                src="/logo.png" 
                alt="A.R.E.S. Logo" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
              <span className="text-sm sm:text-base font-bold tracking-tight text-white hidden md:block">
                A.R.E.S. Elite Sports Vision
              </span>
            </Link>
          </div>

          {/* Top Center: Desktop Navigation Dropdown Menu */}
          <nav className="hidden lg:flex items-center gap-8 pointer-events-auto relative">
            <div className="relative group flex items-center">
              <button className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] text-white/80 hover:text-white transition-colors uppercase outline-none py-4 cursor-pointer">
                Menu <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Unified Mega Menu */}
              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[850px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-4 group-hover:translate-y-0 z-50">
                {/* Invisible bridge to prevent hover gap issues */}
                <div className="absolute -top-8 left-0 right-0 h-8 bg-transparent"></div>
                
                <div className="bg-[var(--color-ares-charcoal)]/95 backdrop-blur-xl border border-[var(--color-ares-border)] rounded-2xl p-10 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden relative">
                  {/* Decorative ambient lighting */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-ares-teal)]/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-ares-purple)]/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="grid grid-cols-3 gap-12 relative z-10">
                    {navCategories.map(category => (
                      <div key={category.title} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-[var(--color-ares-border)]">
                          <div className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full animate-pulse"></div>
                          <h3 className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[var(--color-ares-muted)] uppercase">
                            {category.title}
                          </h3>
                        </div>
                        <ul className="space-y-5">
                          {category.links.map(link => (
                            <li key={link.label}>
                              <Link 
                                to={link.path} 
                                className="text-base font-bold text-white hover:text-[var(--color-ares-teal)] transition-colors flex items-center gap-3 group/link"
                              >
                                <span className="w-0 h-[2px] bg-[var(--color-ares-teal)] transition-all duration-300 group-hover/link:w-4"></span>
                                <span className="whitespace-nowrap">{link.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Top Right: Utility & CTA */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-lg bg-[var(--color-ares-charcoal)]/80 hover:bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] text-[var(--color-ares-white)] hover:text-[var(--color-ares-teal)] transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isLightMode ? <Moon className="w-4 h-4 sm:w-5 h-5" /> : <Sun className="w-4 h-4 sm:w-5 h-5" />}
            </button>

            <div className="hidden xl:flex flex-col items-end mr-2">
              <a href="tel:+17739811447" className="text-[var(--color-ares-teal)] hover:text-[var(--color-ares-teal)]/80 text-xs font-bold tracking-wider transition-colors">
                Call Us
              </a>
            </div>
            
            <Link 
              to="/assessment" 
              className="hidden sm:flex items-center justify-center bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] text-xs md:text-sm font-bold tracking-widest uppercase px-4 py-2.5 md:py-3 rounded-lg transition-all shadow-glow"
            >
              <span>Start Free Assessment</span>
            </Link>

            <Link 
              to="/book/evaluation" 
              className="hidden sm:flex items-center justify-center border border-[var(--color-ares-purple)] text-white hover:bg-[var(--color-ares-purple)]/20 text-xs md:text-sm font-bold tracking-widest uppercase px-4 py-2.5 md:py-3 rounded-lg transition-all"
            >
              <span>Book Evaluation</span>
            </Link>

            {/* Mobile/Tablet Menu Toggle */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex lg:hidden items-center justify-center bg-[var(--color-ares-charcoal)]/90 backdrop-blur-xl border border-[var(--color-ares-border)] p-2.5 rounded-lg text-white hover:text-[var(--color-ares-teal)] transition-colors"
              aria-label="Open menu"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>

        </div>
      </header>

      {/* Sticky Mobile Dual CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[var(--color-ares-charcoal)]/95 backdrop-blur-xl border-t border-[var(--color-ares-border)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex gap-3 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Link 
          to="/book/evaluation"
          className="flex-1 text-center py-3 rounded-lg border border-[var(--color-ares-purple)] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center"
        >
          Book Eval
        </Link>
        <Link 
          to="/assessment"
          className="flex-1 text-center py-3 rounded-lg bg-[var(--color-ares-teal)] text-[#0A0B14] text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[var(--color-ares-teal)]/20 active:scale-95 flex items-center justify-center"
        >
          Start Free Assessment
        </Link>
      </div>

      {/* Routing Matrix Overlay (Mobile & Tablet) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[var(--color-ares-charcoal)]/95 backdrop-blur-xl overflow-y-auto lg:hidden gpu-accelerated"
          >
            <nav className="min-h-dvh px-6 py-20 sm:py-24 md:p-24 max-w-[1400px] mx-auto relative flex flex-col justify-center">
              
              {/* Mobile Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="absolute top-6 right-16 md:top-8 md:right-24 text-[var(--color-ares-white)]/70 hover:text-[var(--color-ares-white)] bg-[var(--color-ares-charcoal)]/90 border border-[var(--color-ares-border)] p-3 rounded-full transition-colors z-10 cursor-pointer"
                aria-label="Toggle theme"
              >
                {isLightMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </button>

              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-4 md:top-8 md:right-8 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-colors z-10"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col gap-2 mt-12 sm:mt-0 w-full max-w-2xl mx-auto">
                {/* Quick Action Hub for High-Conversion Links */}
                <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] text-[var(--color-ares-teal)] uppercase mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to="/book/evaluation" 
                      onClick={() => setIsOpen(false)}
                      className="py-3 px-4 rounded-xl bg-[var(--color-ares-purple)] text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-[var(--color-ares-purple)]/90 transition-colors"
                    >
                      Book Eval
                    </Link>
                    <Link 
                      to="/book/packages" 
                      onClick={() => setIsOpen(false)}
                      className="py-3 px-4 rounded-xl bg-[var(--color-ares-teal)] text-[#0A0B14] text-xs font-bold uppercase tracking-wider text-center hover:bg-[#4FC3F7] transition-colors"
                    >
                      Packages
                    </Link>
                    <Link 
                      to="/book/in-office" 
                      onClick={() => setIsOpen(false)}
                      className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-white/10 transition-colors"
                    >
                      In-Office
                    </Link>
                    <Link 
                      to="/book/tele-training" 
                      onClick={() => setIsOpen(false)}
                      className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-white/10 transition-colors"
                    >
                      Tele-Session
                    </Link>
                  </div>
                </div>

                {navCategories.map((category, idx) => {
                  const isOpenCategory = openMobileCategory === category.title;
                  return (
                    <motion.div 
                      key={category.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.05), duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col border-b border-white/10 overflow-hidden"
                    >
                      <button 
                        onClick={() => setOpenMobileCategory(isOpenCategory ? null : category.title)}
                        className="w-full py-5 flex items-center justify-between text-left text-xl font-black tracking-tight text-white uppercase cursor-pointer"
                      >
                        <span>{category.title}</span>
                        <ChevronDown className={`w-5 h-5 text-[var(--color-ares-teal)] transition-transform duration-300 ${isOpenCategory ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpenCategory && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="pl-4 pb-4 overflow-hidden"
                          >
                            <ul className="space-y-4">
                              {category.links.map(link => (
                                <li key={link.label}>
                                  <Link 
                                    to={link.path}
                                    className="group relative inline-flex text-lg font-bold text-white/80 hover:text-white transition-colors"
                                  >
                                    <span>{link.label}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (navCategories.length * 0.05) }}
                  className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/10"
                >
                  <Link 
                    to="/assessment"
                    className="w-full py-4 rounded-xl bg-[var(--color-ares-teal)] text-[#0A0B14] font-bold text-lg shadow-glow hover:bg-[#4FC3F7] transition-all text-center"
                  >
                    Start Free Assessment
                  </Link>
                  <Link 
                    to="/book/evaluation"
                    className="w-full py-4 rounded-xl bg-transparent border border-[var(--color-ares-purple)] text-white font-bold text-lg hover:bg-[var(--color-ares-purple)]/10 transition-all text-center"
                  >
                    Book Evaluation
                  </Link>
                </motion.div>
              </div>

              {/* Bottom Matrix Branding */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-16 sm:mt-24 pt-8 border-t border-[var(--color-ares-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="A.R.E.S." className="h-8 sm:h-10 opacity-50" />
                  <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">A.R.E.S. Elite Sports Vision // Active</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--color-ares-teal)] tracking-widest uppercase">Milliseconds Matter™</span>
              </motion.div>

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );

  return (
    <footer className="bg-[var(--color-ares-bg)] border-t border-[var(--color-ares-border)] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-5 mb-8 md:mb-0">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="A.R.E.S. Logo" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tighter text-white">
                A.R.E.S. Elite Sports Vision
              </span>
            </Link>
            <p className="mt-4 text-[var(--color-ares-muted)] max-w-sm leading-relaxed text-sm sm:text-base">
              We evaluate and optimize the complete Human Operating System that elite athletes depend on under pressure. If every detail matters in your sport, your entire visual and cognitive framework must be calibrated.
            </p>
            <div className="mt-8 flex items-center gap-5">
              <a href="https://www.instagram.com/areselitesportsvision1" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ares-muted)] hover:text-[var(--color-ares-teal)] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.tiktok.com/@areselitesportsvision" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ares-muted)] hover:text-[var(--color-ares-teal)] transition-colors" aria-label="TikTok">
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/102292953/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ares-muted)] hover:text-[var(--color-ares-teal)] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase mb-4 sm:mb-6">Platform</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><Link to="/ares-performance-system" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">The A.R.E.S. System</Link></li>
              <li><Link to="/athletes" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Elite Athletes</Link></li>
              <li><Link to="/parents" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Parents & Youth</Link></li>
              <li><Link to="/pro-sports" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Pro & Motorsports</Link></li>
              <li><Link to="/teams-and-organizations" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Teams & Facilities</Link></li>
              <li><Link to="/book/packages" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors font-bold text-[var(--color-ares-teal)]">Purchase Packages</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase mb-4 sm:mb-6">Tech & Research</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><Link to="/technology-and-data" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Technology & Data</Link></li>
              <li><Link to="/results" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Results & Case Studies</Link></li>
              <li><Link to="/certification" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">A.R.E.S. Certification</Link></li>
              <li><Link to="/resources" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Research & Insights</Link></li>
              <li><Link to="/faq" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Training FAQ</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-3">
            <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase mb-4 sm:mb-6 mt-4 md:mt-0">Contact & Info</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><Link to="/speaking" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Speaking & Keynotes</Link></li>
              <li><Link to="/identity" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">Who We Are</Link></li>
              <li><Link to="/contact" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">General Inquiry</Link></li>
              <li><a href="tel:+17739811447" className="text-sm sm:text-base text-[var(--color-ares-muted)] hover:text-white transition-colors">(773) 981-1447</a></li>
              <li className="text-sm sm:text-base leading-relaxed mt-4">
                <a href="https://maps.google.com/?q=510+West+Carmel+Drive,+Carmel,+IN+46032" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ares-muted)] hover:text-white transition-colors">
                  A.R.E.S. Headquarters<br />
                  510 W. Carmel Dr.<br />
                  Carmel, IN 46032<br />
                  <span className="text-xs text-[var(--color-ares-muted)]/80 mt-1 block">Inside of Elemental Fitness, 2nd Floor</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 md:mt-16 pt-8 border-t border-[var(--color-ares-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-[11px] sm:text-xs text-[var(--color-ares-muted)]/70 max-w-3xl leading-relaxed">
            <span className="font-bold text-white/50">INDIANAPOLIS & CARMEL SPORTS VISION TRAINING:</span> A.R.E.S. Elite Sports Vision provides advanced neurocognitive evaluation, reaction time training, and visual performance optimization for athletes in Carmel, Indianapolis, and across Central Indiana. We specialize in sports vision evaluations, peripheral awareness training, and concussion baseline testing for elite, collegiate, and youth athletes.
          </div>
          <p className="text-[11px] sm:text-xs text-[var(--color-ares-muted)]/60 text-center md:text-right shrink-0">
            &copy; {new Date().getFullYear()} Ares Elite Sports Vision.<br className="hidden md:block" /> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
