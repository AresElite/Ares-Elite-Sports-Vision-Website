import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ArrowRight } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';

export function TrainingShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SectionReveal id="training-showcase" className="py-24 md:py-32 relative bg-[var(--color-ares-charcoal)] border-t border-[var(--color-ares-border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-mono text-[var(--color-ares-teal)] tracking-[0.2em] mb-4 uppercase">Inside The Lab</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight uppercase">
              NEURAL ADAPTATION IN ACTION
            </h3>
            <p className="text-lg text-white/60 leading-relaxed text-balance font-light">
              We train visual processing, decision speed, and physical execution under high-tension loads. Explore our methodology in action.
            </p>
          </div>
        </ScrollReveal>

        {/* Video Reel Teaser Card */}
        <ScrollReveal direction="up" distance={30} speed={1.0}>
          <div className="max-w-4xl mx-auto">
            <div 
              onClick={() => setIsModalOpen(true)}
              className="relative group rounded-3xl overflow-hidden border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] shadow-[0_20px_50px_rgba(0,0,0,0.4)] aspect-[16/9] md:aspect-[21/9] cursor-pointer"
            >
              {/* Poster Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale opacity-45 group-hover:grayscale-0 group-hover:opacity-70 group-hover:scale-[1.02] transition-all duration-700"
                style={{ backgroundImage: `url('/Office 6.jpg')` }}
              />
              
              {/* Neon Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ares-charcoal)] via-black/40 to-transparent z-10" />

              {/* Centered Play Button & Content */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[var(--color-ares-teal)] text-black shadow-[0_0_30px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_40px_rgba(0,242,254,0.6)] group-hover:bg-white transition-all duration-300 mb-6"
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-black stroke-black ml-1" />
                </motion.div>
                
                <h4 className="text-white font-bold text-xl sm:text-2xl md:text-3xl tracking-tight mb-2 uppercase drop-shadow-md">
                  Watch 30-Second Training Reel
                </h4>
                <p className="text-white/80 max-w-lg text-xs sm:text-sm md:text-base leading-relaxed font-light drop-shadow-md">
                  See how collegiate racers, court athletes, and tactical professionals build elite speed.
                </p>
              </div>

              {/* Bottom Right Details Accent */}
              <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                <span className="h-2 w-2 rounded-full bg-[var(--color-ares-teal)] animate-pulse"></span>
                <span className="text-[10px] font-mono tracking-wider text-white/70 uppercase">0:30 RUNTIME</span>
              </div>
            </div>

            {/* Sub-CTA */}
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <span className="text-white/50 text-sm font-light">Want to see the full 6-week training progression?</span>
              <Button 
                variant="outline" 
                href="/sports-vision-training"
                className="font-bold tracking-wide"
              >
                Explore Training Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Modal Player */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 md:p-10 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-4xl bg-[#13141f] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header / Close */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/20">
                  <span className="text-[10px] font-mono tracking-widest text-[var(--color-ares-teal)] uppercase">A.R.E.S. Lab Session Reel</span>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Container */}
                <div className="relative aspect-video w-full bg-black">
                  <iframe 
                    src="https://www.youtube.com/embed/U2VTKv5Imf0?autoplay=1"
                    title="A.R.E.S. Training Reel"
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SectionReveal>
  );
}
