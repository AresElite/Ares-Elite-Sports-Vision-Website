import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionReveal } from '../ui/SectionReveal';

interface HeroProps {
  isReady?: boolean;
}

export function Hero({ isReady = true }: HeroProps) {
  return (
    <SectionReveal 
      className="relative min-h-dvh flex items-center justify-center overflow-hidden pt-28 pb-32 lg:pt-32 lg:pb-32"
      animate={isReady ? "visible" : "hidden"}
    >
      {/* High-Tension Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0B0F2A]/75 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F2A] via-[#0B0F2A]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F2A] via-[#0B0F2A]/60 to-transparent z-10" />
        
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover object-center mix-blend-luminosity opacity-80"
          poster="/DSC_1736.jpg"
        >
          <source src="/cam-fl-6.mov" type="video/mp4" />
          <source src="/cam-fl-6.mov" type="video/quicktime" />
        </video>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-center xl:text-left flex flex-col items-center xl:items-start"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-4 uppercase">
              THE OPERATING SYSTEM FOR VISUAL-NEUROCOGNITIVE PERFORMANCE
            </div>
            
            <motion.h1 
              className="text-[2.75rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] xl:text-[5rem] 2xl:text-[5.5rem] font-black tracking-tighter text-white leading-[0.95] mb-6 cursor-default uppercase drop-shadow-xl"
              whileHover={{
                x: [-1, 1, -0.5, 0.5, 0],
                y: [0.5, -0.5, 0.5, -0.5, 0],
                opacity: [1, 0.9, 1, 0.95, 1],
                transition: { duration: 0.2, repeat: Infinity, repeatType: "mirror" }
              }}
            >
              MILLISECONDS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] to-white mt-1 sm:mt-2 block drop-shadow-none">
                MATTER™
              </span>
            </motion.h1>
            
            <p className="text-xl sm:text-2xl xl:text-[1.35rem] 2xl:text-2xl text-white/90 font-medium mb-10 max-w-2xl leading-snug text-balance drop-shadow-lg">
              Cut reaction-time lag, make faster decisions under fatigue, and uncover hidden bottlenecks. Whether you're struggling with late reads or looking to squeeze another 10% out of an already elite performance, Ares finds the milliseconds that keep you ahead.
            </p>

            <div className="flex flex-col w-full items-center xl:items-start gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center xl:justify-start">
                <Link to="/book/evaluation" className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(41,152,170,0.3)] hover:shadow-[0_0_30px_rgba(41,152,170,0.5)] font-bold tracking-wide uppercase text-sm sm:text-base">
                  Find Your Baseline
                </Link>
                <Link to="/ares-performance-system" className="inline-flex items-center justify-center px-8 py-4 bg-black/40 backdrop-blur-md border border-[var(--color-ares-border)] hover:bg-white/10 text-white rounded-xl transition-all font-bold tracking-wide uppercase text-sm sm:text-base shadow-md">
                  See How It Works
                </Link>
              </div>
              <p className="text-white/60 text-xs sm:text-sm max-w-sm text-center xl:text-left mt-1 font-medium tracking-wide">
                Secure your 80-90 minute objective evaluation to discover the processing gaps you didn't know were holding you back.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
            animate={isReady ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.9, rotateY: 30 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="block text-left mt-8 xl:mt-0"
          >
            {/* Audience Pathway Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:max-w-md mx-auto xl:mx-0 xl:ml-auto">
              {/* Athlete / Parent */}
              <Link to="/book/evaluation" className="group relative p-6 sm:p-8 rounded-2xl border border-[var(--color-ares-border)] bg-[#111428]/95 hover:bg-[#1A1F3D] transition-all overflow-hidden shadow-glow flex flex-col h-full backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ares-teal)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="font-bold text-white mb-3 text-xl sm:text-2xl leading-tight text-balance">Athletes & Parents</div>
                  <div className="text-sm sm:text-base text-white/80 font-medium mb-8 leading-relaxed flex-grow drop-shadow-md">Start with an Evaluation to identify visual and cognitive bottlenecks affecting your performance.</div>
                  <div className="text-[var(--color-ares-teal)] text-sm font-bold flex items-center mt-auto uppercase tracking-widest">
                    Book Your Evaluation <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Team / Organization */}
              <Link to="/teams-and-organizations" className="group relative p-6 sm:p-8 rounded-2xl border border-[var(--color-ares-border)] bg-[#111428]/95 hover:bg-[#1A1F3D] transition-all overflow-hidden shadow-glow flex flex-col h-full backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="font-bold text-white mb-3 text-xl sm:text-2xl leading-tight text-balance">Teams & Organizations</div>
                  <div className="text-sm sm:text-base text-white/80 font-medium mb-8 leading-relaxed flex-grow drop-shadow-md">Bring objective testing and structured training to your athletes or facility.</div>
                  <div className="text-white text-sm font-bold flex items-center mt-auto uppercase tracking-widest">
                    Team Consultation <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
            
          </motion.div>
        </div>
      </div>

      {/* Full-width Trusted By Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-0 left-0 w-full border-t border-[var(--color-ares-border)] bg-black/80 backdrop-blur-xl py-4 sm:py-5 z-20"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[var(--color-ares-teal)] animate-pulse"></div>
            <p className="text-[10px] sm:text-xs text-white/80 font-bold uppercase tracking-[0.2em] whitespace-nowrap">Objective data for elite performance</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-5 sm:gap-8 items-center opacity-60 hover:opacity-100 transition-all duration-500 w-full md:w-auto">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-ares-muted)] mr-2 hidden sm:block">Trusted by athletes who cannot afford to be slow:</span>
            <div className="text-[11px] sm:text-xs font-bold text-white tracking-widest uppercase">INDYCAR</div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="text-[11px] sm:text-xs font-bold text-white tracking-widest uppercase">NHL</div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="text-[11px] sm:text-xs font-bold text-white tracking-widest uppercase">NCAA</div>
          </div>
        </div>
      </motion.div>
    </SectionReveal>
  );
}
