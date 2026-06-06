import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Cpu, Zap, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { VideoEmbed } from '../ui/VideoEmbed';
import { RadialOrbitalTimelineDemo } from '../ui/demo';
import { variants } from '../../config/motion';

const GALLERY_IMAGES = [
  "/DSC_1736.jpg",
  "/Office 2.jpg",
  "/Office 6.jpg",
  "/Office 7.jpg"
];

const steps = [
  {
    id: "01",
    title: "ACQUIRE",
    subtitle: "Visual Intake",
    description: "How the eyes acquire visual information. We evaluate how efficiently your mechanical visual system gathers the right data from the environment before a decision is ever made.",
    icon: Eye,
    color: "from-[var(--color-ares-teal)] to-[var(--color-ares-teal)]/50",
    link: "/detail/acquire"
  },
  {
    id: "02",
    title: "ROUTE",
    subtitle: "Neural Processing",
    description: "How the brain processes information. We measure how fast the brain filters noise, routes visual data, and makes decisions in complex environments.",
    icon: Cpu,
    color: "from-[var(--color-ares-purple)] to-[var(--color-ares-purple)]/50",
    link: "/detail/route"
  },
  {
    id: "03",
    title: "EXECUTE",
    subtitle: "Motor Response",
    description: "How the body responds. We evaluate reaction time, speed, and motor output execution after the brain commits to a decision.",
    icon: Zap,
    color: "from-[var(--color-ares-teal)] to-[var(--color-ares-teal)]/50",
    link: "/detail/execute"
  },
  {
    id: "04",
    title: "SYNCHRONIZE",
    subtitle: "Game-Speed Harmony",
    description: "How the entire system works together. We train the complete loop under game-speed pressure and cognitive load to ensure flawless real-time performance.",
    icon: RefreshCw,
    color: "from-[var(--color-ares-purple)] to-[var(--color-ares-purple)]/50",
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
                    {/* Preload the *next* image to avoid layout/flash issues, lazy loading the rest visually */}
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

        {/* A.R.E.S. Loop Visualization */}
        <div className="mb-20 max-w-5xl mx-auto">
          <ScrollReveal direction="up" distance={40}>
            <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="text-center mb-8 relative z-10 pt-4">
                <h3 className="text-2xl font-bold tracking-widest text-white uppercase">The Performance Loop</h3>
                <p className="text-[var(--color-ares-teal)] mt-2 font-mono text-sm tracking-widest">CONTINUOUS NEURO-MECHANICAL SYNCHRONIZATION</p>
              </div>
              <RadialOrbitalTimelineDemo />
            </div>
          </ScrollReveal>
        </div>



        {/* System Video Embed */}
        <div className="mt-20 sm:mt-32 max-w-4xl mx-auto">
          <ScrollReveal direction="up" distance={40}>
             <VideoEmbed 
               src="https://www.youtube.com/embed/U2VTKv5Imf0" 
               title="The A.R.E.S. Performance Loop" 
             />
          </ScrollReveal>
        </div>
      </div>
    </SectionReveal>
  );
}
