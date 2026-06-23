import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Target, Brain, Layers } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { VideoEmbed } from '../ui/VideoEmbed';

export function MeasurementSection() {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const emrImages = [
    '/EMR Screenshot 1.jpeg',
    '/EMR Screenshot 2.jpeg',
    '/EMR Screenshot 3.jpeg'
  ];
  return (
    <SectionReveal id="measurement" className="pt-32 pb-40 border-t border-[var(--color-ares-border)] relative bg-[#0d1127]" style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% 100%, 0 calc(100% - 4vw))' }}>
      {/* Geometric background accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal direction="right" distance={50} speed={0.8} className="text-center lg:text-left">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight text-balance uppercase">
                Find Your <br /> Decision-Speed Baseline.
              </h2>
              <p className="text-white/80 text-lg sm:text-xl mb-12 leading-relaxed text-balance font-light">
                We reject subjective "feeling" and "eye test" guesses. We extract objective data from your Human Operating System to find exactly where you are losing milliseconds.
              </p>

              <div className="space-y-6 flex flex-col items-center lg:items-start group/list">
                {[
                  { icon: BarChart3, title: "Objective System Measurement", desc: "Tracking every millisecond of visual processing speed." },
                  { icon: Target, title: "Bottleneck Isolation", desc: "Identifying left/right dominance imbalances and blind spots." },
                  { icon: Brain, title: "Decision-Speed Decomposition", desc: "Separating visual detection from cognitive decision and motor output." },
                  { icon: Layers, title: "Cognitive Stress Testing", desc: "Measuring baseline collapse under game-speed pressure." }
                ].map((item, i) => (
                  <ScrollReveal key={i} direction="up" distance={20} speed={0.5 + (i * 0.2)} className="w-full">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left group relative p-4 -ml-4 rounded-xl hover:bg-white/5 transition-all cursor-crosshair">
                      <div className="bg-[var(--color-ares-purple)]/20 p-3 rounded-xl shadow-lg group-hover:bg-[var(--color-ares-teal)]/20 transition-colors shrink-0">
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-ares-teal)] group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-1 tracking-tight group-hover:text-[var(--color-ares-teal)] transition-colors">{item.title}</h4>
                        <p className="text-sm sm:text-base text-white/50 font-light">{item.desc}</p>
                      </div>
                      
                      {/* Hover Mock Data Sparkline */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 hidden sm:flex items-end gap-1 h-8">
                         {[40, 70, 45, 90, 65, 100].map((h, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.1 * idx, ease: [0.22, 1, 0.36, 1] }}
                              className="w-1.5 rounded-t-sm bg-[var(--color-ares-teal)]/50 group-hover:bg-[var(--color-ares-teal)] transition-colors"
                            />
                         ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="relative mt-12 lg:mt-0">
            {/* Real UI Mockup Frame (iPad / Tablet style) */}
            <ScrollReveal direction="left" distance={60} speed={1.1} rotate={-1} className="flex justify-center">
              <div className="w-full max-w-lg bg-[#1a1b23] rounded-[2rem] border-[4px] border-[#2b2b36] p-2 sm:p-3 shadow-2xl relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Camera Notch/Bezel detail */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#000] rounded-full mt-3"></div>
                
                {/* Inner Screen */}
                <div className="w-full bg-[var(--color-ares-charcoal)] rounded-[1.2rem] border border-black/50 overflow-hidden relative flex flex-col">
                  {/* Fake App Header */}
                  <div className="bg-[var(--color-ares-bg)] px-6 py-4 flex justify-between items-center border-b border-[var(--color-ares-border)]">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500"></div>
                       <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase">A.R.E.S. EMR Portal</div>
                    <div className="w-8"></div>
                  </div>

                  {/* Tabbed Selectors */}
                  <div className="bg-[#0e111a] px-4 py-3 flex justify-center gap-2 border-b border-[var(--color-ares-border)]">
                    {['Overview', 'Acquisition Stats', 'Cognitive Load'].map((label, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx as any)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase transition-all ${
                          activeTab === idx 
                            ? 'bg-[var(--color-ares-teal)] text-black shadow-lg shadow-[var(--color-ares-teal)]/20' 
                            : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Dashboard Image Viewport */}
                  <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeTab}
                        src={emrImages[activeTab]}
                        alt={`A.R.E.S. EMR Screenshot ${activeTab + 1}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover object-top"
                      />
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Decorative elements */}
            <ScrollReveal direction="down" distance={100} speed={0.4} className="absolute -top-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 bg-[var(--color-ares-teal)]/10 rounded-full blur-3xl -z-10">
              <div className="w-full h-full"></div>
            </ScrollReveal>
            <ScrollReveal direction="up" distance={100} speed={0.6} className="absolute -bottom-10 -left-10 w-48 sm:w-64 h-48 sm:h-64 bg-[var(--color-ares-purple)]/20 rounded-full blur-3xl -z-10">
              <div className="w-full h-full"></div>
            </ScrollReveal>
          </div>
        </div>

        {/* Separator and Video Row */}
        <div className="border-t border-white/10 pt-20 mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal direction="left" distance={30} speed={0.8}>
              <div className="text-center lg:text-left">
                <h3 className="text-[var(--color-ares-teal)] font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4">Analytics & EMR Platform</h3>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">OBJECTIVE DATA. NOT GUESSWORK.</h2>
                <p className="text-white/60 text-base sm:text-lg leading-relaxed mx-auto lg:mx-0 text-balance max-w-2xl font-light">
                  If something affects performance, it should be measured, tracked, and communicated clearly. We built a custom EMR and tracking platform because athletes deserve more than opinions and vague notes. We measure what most programs miss. We track what others guess.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" distance={30} speed={0.8}>
              <div className="mx-auto w-full max-w-2xl lg:max-w-none">
                <VideoEmbed 
                  src="https://www.youtube.com/embed/qdEmN0iYLq4?si=r7kK-W1VnQe5L7P1" 
                  title="Importance of Analytics and Tracking Information for Athletes" 
                />
              </div>
            </ScrollReveal>
          </div>
        </div>

      </div>
    </SectionReveal>
  );
}
