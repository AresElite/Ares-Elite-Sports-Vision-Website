import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Crosshair } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import { VideoEmbed } from '../ui/VideoEmbed';
import { variants } from '../../config/motion';

export function ConcussionBaseline() {
  return (
    <SectionReveal id="concussion-baseline" className="py-20 sm:py-32 relative bg-[var(--color-ares-charcoal)]/50 border-y border-[var(--color-ares-border)]">
      {/* Background Elements */}
      <ScrollReveal direction="down" distance={100} speed={0.3} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-[var(--color-ares-teal)]/5 blur-[80px] sm:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[var(--color-ares-purple)]/5 blur-[80px] sm:blur-[120px] rounded-full" />
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Concussion Baseline */}
          <ScrollReveal direction="right" distance={40} speed={0.8} className="text-center lg:text-left">
            <motion.div variants={variants.cardReveal}>
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-8 uppercase">
                MAXIMAL SAFETY & RECOVERY
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight text-balance">
                THE MOST EXTENSIVE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] to-[var(--color-ares-white)]">
                  CONCUSSION BASELINING
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-10 text-balance font-light">
                Your brain health and long-term safety are the foundation of everything you do. By establishing an extensive, personalized concussion baseline, you gain rigorous tracking across every phase of your season. When head injuries occur, you have <strong>exact data points</strong> to rely on—empowering you to return to play safely, efficiently, and with absolute confidence in your visual and cognitive recovery.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[var(--color-ares-purple)]/20 flex items-center justify-center shrink-0 shadow-lg">
                    <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-ares-teal)]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 tracking-tight">Exact Data Points</h4>
                    <p className="text-sm sm:text-base text-white/50 font-light">Objective metrics eliminate guesswork to ensure your maximal safety.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[var(--color-ares-purple)]/20 flex items-center justify-center shrink-0 shadow-lg">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-ares-teal)]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 tracking-tight">Longitudinal Tracking</h4>
                    <p className="text-sm sm:text-base text-white/50 font-light">Continuous monitoring to protect your health across all phases of the season.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Right Column: The Difference */}
          <ScrollReveal direction="left" distance={40} speed={1.1} className="mt-12 lg:mt-0">
            <motion.div variants={variants.cardReveal} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ares-purple)]/20 to-transparent rounded-xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700"></div>
              <div className="relative bg-[var(--color-ares-bg)] border border-[var(--color-ares-border)] p-8 sm:p-12 md:p-16 rounded-xl shadow-glow transition-all duration-500 group-hover:border-[var(--color-ares-teal)]/30">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-[var(--color-ares-purple)] to-[var(--color-ares-purple)]/50 flex items-center justify-center mb-10 shadow-glow group-hover:scale-110 transition-transform duration-500">
                  <Crosshair className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">
                  THE A.R.E.S. DIFFERENCE
                </h3>
                
                <div className="space-y-8">
                  <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                    Your recovery deserves more than guesswork. True rehabilitation requires analytical tracking of your progress, utilizing advanced progressions and integrated technology designed specifically to protect and restore your brain's unique neural pathways.
                  </p>
                  <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                    This data-driven approach has empowered athletes to step out of concussion-induced retirement, reclaim their maximum potential, and restore unshakeable confidence before career-defining events like the Indy500.
                  </p>
                  <div className="p-6 rounded-2xl bg-[var(--color-ares-teal)]/5 border border-[var(--color-ares-teal)]/20 shadow-inner">
                    <p className="text-white font-medium leading-relaxed text-sm sm:text-base">
                      This is not traditional vision therapy. <span className="text-[var(--color-ares-teal)]">It is the future of your return to play—giving you the objective data to actually know when your brain is fully healed and ready.</span>
                    </p>
                  </div>
                  <div className="pt-6 flex justify-center sm:justify-start">
                    <Button variant="outline" href="/resources" className="w-full sm:w-auto">
                      Read the Research
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

        </div>

        {/* Concussion Video Embed */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto">
          <ScrollReveal direction="up" distance={40}>
             <VideoEmbed 
               src="https://www.youtube.com/embed/zwzcccgevhk" 
               title="The Importance of Concussion Baselining" 
             />
          </ScrollReveal>
        </div>
      </div>
    </SectionReveal>
  );
}
