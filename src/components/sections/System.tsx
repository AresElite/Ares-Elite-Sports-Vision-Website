import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Cpu, Zap, RefreshCw, ChevronLeft, ChevronRight, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { VideoEmbed } from '../ui/VideoEmbed';

const GALLERY_IMAGES = [
  "/DSC_1736.jpg",
  "/Office 2.jpg",
  "/Office 6.jpg",
  "/Office 7.jpg"
];

const steps = [
  {
    id: "01",
    letter: "A",
    title: "ACQUIRE",
    subtitle: "Visual Intake Optimization",
    description: "How the eyes acquire visual information. We evaluate how efficiently your mechanical visual system gathers accurate data from the environment before a decision is ever made.",
    focus: "Eyes & Ocular Muscles",
    metrics: ["Dynamic Acuity", "Saccadic Speed", "Contrast Sensitivity", "Peripheral Field"],
    microBenefit: "Isolates mechanical tracking to eliminate visual input delays before neural routing.",
    icon: Eye,
    colorTheme: "teal",
    gradient: "from-[var(--color-ares-teal)] to-cyan-400",
    badgeBg: "bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] border-[var(--color-ares-teal)]/30",
    borderHover: "hover:border-[var(--color-ares-teal)]",
    glow: "group-hover:shadow-[0_0_30px_rgba(41,152,170,0.25)]",
    link: "/detail/acquire"
  },
  {
    id: "02",
    letter: "R",
    title: "ROUTE",
    subtitle: "Neural Pathway Processing",
    description: "How the brain processes information. We measure how fast the visual cortex filters noise, routes visual data, and formulates decisions under stress.",
    focus: "Visual Cortex & Neural Pathways",
    metrics: ["Signal-to-Noise Ratio", "Cortical Latency", "Decision Speed", "Cognitive Load"],
    microBenefit: "Maps neural transmission to convert conscious deliberation into rapid subconscious reflex.",
    icon: Cpu,
    colorTheme: "purple",
    gradient: "from-[var(--color-ares-purple)] to-indigo-400",
    badgeBg: "bg-[var(--color-ares-purple)]/10 text-[var(--color-ares-purple)] border-[var(--color-ares-purple)]/30",
    borderHover: "hover:border-[var(--color-ares-purple)]",
    glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]",
    link: "/detail/route"
  },
  {
    id: "03",
    letter: "E",
    title: "EXECUTE",
    subtitle: "Motor Output Response",
    description: "How the body responds. We evaluate reaction time, neuromuscular speed, and physical execution after the brain commits to a decision.",
    focus: "Motor Cortex & Neuromuscular System",
    metrics: ["Choice Reaction Time", "Motor Latency", "Post-Error Recovery", "Hand-Eye Speed"],
    microBenefit: "Ensures motor response is crisp, explosive, and uninhibited once a decision is made.",
    icon: Zap,
    colorTheme: "teal",
    gradient: "from-[var(--color-ares-teal)] to-emerald-400",
    badgeBg: "bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] border-[var(--color-ares-teal)]/30",
    borderHover: "hover:border-[var(--color-ares-teal)]",
    glow: "group-hover:shadow-[0_0_30px_rgba(41,152,170,0.25)]",
    link: "/detail/execute"
  },
  {
    id: "04",
    letter: "S",
    title: "SYNCHRONIZE",
    subtitle: "Game-Speed Integration",
    description: "How the entire system works together. We train the complete loop under game-speed pressure and physical fatigue to ensure flawless real-time performance.",
    focus: "Integrated Human Operating System",
    metrics: ["Neuro-Endurance", "Fatigue Resistance", "Gaze-Motor Coupling", "Real-Time Adaptability"],
    microBenefit: "Stress-tests macro-system integration so peak execution holds under championship pressure.",
    icon: RefreshCw,
    colorTheme: "purple",
    gradient: "from-[var(--color-ares-purple)] to-fuchsia-400",
    badgeBg: "bg-[var(--color-ares-purple)]/10 text-[var(--color-ares-purple)] border-[var(--color-ares-purple)]/30",
    borderHover: "hover:border-[var(--color-ares-purple)]",
    glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]",
    link: "/detail/synchronize"
  }
];

export function SystemSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  };

  return (
    <SectionReveal id="system" className="pt-16 pb-28 md:pt-24 md:pb-36 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 4vw))' }}>
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 md:mb-24">
          <ScrollReveal direction="right" distance={40} className="text-center lg:text-left">
            <span className="text-[var(--color-ares-teal)] font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase">The Visual-Neurocognitive Chain</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-8 tracking-tight text-balance">THE A.R.E.S. FRAMEWORK</h2>
            <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
              Athletes do not just need to see clearly; they need to acquire the right information, process it quickly, decide accurately, and respond under pressure.
              <br />
              <span className="text-white font-medium mt-6 block tracking-wide">Acquire → Route → Execute → Synchronize.</span>
            </p>
          </ScrollReveal>
          
          {/* System Visual */}
          <ScrollReveal direction="left" distance={60}>
            <div className="relative group">
              <div className="aspect-[4/3] sm:aspect-video bg-[var(--color-ares-charcoal)] rounded-xl border border-[var(--color-ares-border)] overflow-hidden relative shadow-glow transition-all duration-700 group-hover:border-[var(--color-ares-teal)]/30">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cover bg-center mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700"
                    style={{ backgroundImage: `url('${encodeURI(GALLERY_IMAGES[currentImageIndex])}')` }}
                    role="img"
                    aria-label={`ARES Training Facility showcasing ${currentImageIndex + 1}`}
                  >
                    <img 
                      src={encodeURI(GALLERY_IMAGES[(currentImageIndex + 1) % GALLERY_IMAGES.length])} 
                      className="hidden" 
                      loading="lazy" 
                      decoding="async" 
                      alt="" 
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ares-bg)] via-transparent to-transparent z-10 pointer-events-none"></div>
                
                {/* Navigation Controls */}
                <button 
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-ares-teal)] z-30"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-ares-teal)] z-30"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Gallery Indicators */}
                <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  {GALLERY_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.preventDefault(); setCurrentImageIndex(i); }}
                      className={`h-1.5 rounded-full transition-all ${
                        currentImageIndex === i ? "w-6 bg-[var(--color-ares-teal)]" : "w-1.5 bg-white/40 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Overlay UI */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 pointer-events-none">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-2 w-2 bg-[var(--color-ares-teal)] rounded-full animate-pulse"></div>
                    <div className="text-[10px] font-mono text-[var(--color-ares-teal)] tracking-[0.3em]">SYSTEM_ACTIVE</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 4 }}
                          className="h-full bg-[var(--color-ares-teal)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 border-t-2 border-r-2 border-[var(--color-ares-teal)]/30 rounded-tr-3xl -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 border-b-2 border-l-2 border-[var(--color-ares-teal)]/30 rounded-bl-3xl -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
          </ScrollReveal>
        </div>

        {/* Interactive A.R.E.S. Performance Loop Section */}
        <div className="mb-20 max-w-7xl mx-auto">
          <ScrollReveal direction="up" distance={40}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 text-[var(--color-ares-teal)] text-xs font-mono tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Framework Breakdown
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">The Performance Loop</h3>
              <p className="text-white/60 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
                Hover over any phase to inspect the neuro-mechanical mechanism, then click to view detailed telemetry breakdowns.
              </p>
            </div>

            {/* 4 Interactive Hover Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <Link
                    key={step.id}
                    to={step.link}
                    className={`group relative bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] ${step.borderHover} ${step.glow} rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:bg-[#161822] shadow-xl overflow-hidden`}
                  >
                    {/* Top Decorative Glow Corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                    <div>
                      {/* Card Header: Letter Badge + ID + Icon */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className={`text-3xl font-black font-display bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                            {step.letter}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${step.badgeBg}`}>
                            PHASE {step.id}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                          <IconComponent className="w-6 h-6 text-white group-hover:text-[var(--color-ares-teal)] transition-colors" />
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="text-2xl font-bold text-white tracking-tight mb-1 group-hover:text-[var(--color-ares-teal)] transition-colors">
                        {step.title}
                      </h4>
                      <div className="text-xs font-mono font-medium text-[var(--color-ares-teal)] tracking-wider uppercase mb-4">
                        {step.subtitle}
                      </div>

                      {/* Main Description */}
                      <p className="text-white/70 text-sm leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Expanded Hover Details */}
                      <div className="border-t border-white/10 pt-4 mt-auto space-y-3">
                        <div>
                          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Anatomical Focus</span>
                          <div className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-[var(--color-ares-teal)] shrink-0" />
                            {step.focus}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">Key Telemetry Metrics</span>
                          <div className="flex flex-wrap gap-1.5">
                            {step.metrics.map((m, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80 group-hover:border-white/20 transition-colors">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Micro Benefit Callout on Hover */}
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-white/15 transition-all mt-3">
                          <span className="text-[10px] font-mono text-[var(--color-ares-teal)] uppercase tracking-wider block mb-1">Impact</span>
                          <p className="text-xs text-white/80 leading-snug">
                            {step.microBenefit}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Action Button */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white group-hover:text-[var(--color-ares-teal)] transition-colors">
                      <span>Explore {step.title} Phase</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>
        </div>

        {/* System Video Embed */}
        <div className="mt-20 sm:mt-32 max-w-4xl mx-auto">
          <ScrollReveal direction="up" distance={40}>
             <VideoEmbed 
               src="https://www.youtube.com/embed/EBUfMFxkNks" 
               title="The A.R.E.S. Performance Loop" 
             />
          </ScrollReveal>
        </div>
      </div>
    </SectionReveal>
  );
}
