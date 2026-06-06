import { motion } from 'framer-motion';
import { BarChart3, Target, Brain, Layers } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';

export function MeasurementSection() {
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
                <div className="w-full bg-[var(--color-ares-charcoal)] rounded-[1.2rem] border border-black/50 overflow-hidden relative">
                  {/* Fake App Header */}
                  <div className="bg-[#0B0F2A] px-6 py-4 flex justify-between items-center border-b border-[var(--color-ares-border)]">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500"></div>
                       <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase">A.R.E.S. Evaluation Portal</div>
                    <div className="w-8"></div>
                  </div>

                  <div className="p-6 sm:p-8 relative">
                    <div className="flex justify-between items-center mb-8 pb-4">
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Athlete Profile</div>
                        <div className="text-white font-bold text-xl">Marcus J.</div>
                        <div className="text-[var(--color-ares-teal)] text-xs font-mono mt-1">ID: AR-0749-X</div>
                      </div>
                      <div className="bg-[var(--color-ares-purple)] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[var(--color-ares-purple)]/30 flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-wider opacity-80 font-normal">AQ™ SCORE</span>
                        137 <span className="text-white/50 text-xs">/ 200</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Acquire (AQ-A)</span>
                      <span className="text-white font-mono">142/200</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "71%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-[var(--color-ares-teal)] relative overflow-hidden" 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Route (AQ-R)</span>
                      <span className="text-white font-mono">131/200</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "65.5%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-[var(--color-ares-purple)]" 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Execute (AQ-E)</span>
                      <span className="text-white font-mono">139/200</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "69.5%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-white" 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Synchronize (AQ-S)</span>
                      <span className="text-white font-mono">136/200</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "68%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-[var(--color-ares-teal)]/50" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-[var(--color-ares-bg)] p-4 rounded-xl border border-[var(--color-ares-border)] shadow-inner overflow-hidden relative">
                    <div className="text-[9px] text-white/40 uppercase tracking-widest font-mono mb-1">Raw RT</div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="text-lg font-mono text-white tracking-tighter"
                    >
                      294ms
                    </motion.div>
                  </div>
                  <div className="bg-[var(--color-ares-bg)] p-4 rounded-xl border border-[var(--color-ares-border)] shadow-inner overflow-hidden relative">
                    <div className="text-[9px] text-white/40 uppercase tracking-widest font-mono mb-1">Accuracy</div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="text-lg font-mono text-white tracking-tighter"
                    >
                      87%
                    </motion.div>
                  </div>
                  <div className="bg-[var(--color-ares-bg)] p-4 rounded-xl border border-[var(--color-ares-border)] shadow-inner overflow-hidden relative">
                    <div className="text-[9px] text-white/40 uppercase tracking-widest font-mono mb-1">Choice RT</div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="text-lg font-mono text-white tracking-tighter"
                    >
                      507ms
                    </motion.div>
                  </div>
                </div>
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
      </div>
    </SectionReveal>
  );
}
