import { motion } from 'framer-motion';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';

export function PerformanceResults() {
  return (
    <SectionReveal id="results" className="py-20 sm:py-32 relative bg-[var(--color-ares-charcoal)] overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[var(--color-ares-teal)]/50 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" distance={40} speed={0.9}>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-mono text-[var(--color-ares-teal)] tracking-[0.2em] mb-4 uppercase">Proven Efficacy</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">
              QUANTIFIABLE IMPROVEMENT.
            </h3>
            <p className="text-lg text-white/60 leading-relaxed text-balance">
              We do not rely on subjective feelings. Through our objective A.R.E.S. evaluation protocol, we measure the millisecond improvements that separate average performance from elite execution.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Reaction Time Improvement */}
          <ScrollReveal direction="up" distance={30} speed={1.0}>
            <div className="bg-[#0B0F2A] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-teal)]/50 transition-colors h-full flex flex-col">
              <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
              <h4 className="text-white font-bold text-lg mb-8">Choice Reaction Time</h4>
              
              <div className="mt-auto space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-white/60">
                    <span>Baseline (Pre)</span>
                    <span className="font-mono">512ms</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-white/40" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 text-[var(--color-ares-teal)] font-bold">
                    <span>Post-Protocol</span>
                    <span className="font-mono">398ms</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "77%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-[var(--color-ares-teal)]" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[var(--color-ares-border)]">
                  <div className="text-[var(--color-ares-teal)] text-3xl font-bold tracking-tighter">-22%</div>
                  <div className="text-white/40 text-[10px] font-mono mt-1 uppercase">Reduction in lag</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Spatial Awareness */}
          <ScrollReveal direction="up" distance={30} speed={1.1}>
            <div className="bg-[#0B0F2A] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-purple)]/50 transition-colors h-full flex flex-col">
              <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
              <h4 className="text-white font-bold text-lg mb-8">Peripheral Processing</h4>
              
              <div className="mt-auto space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-white/60">
                    <span>Baseline (Pre)</span>
                    <span className="font-mono">62%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "62%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-white/40" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 text-[var(--color-ares-purple)] font-bold">
                    <span>Post-Protocol</span>
                    <span className="font-mono">94%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-[var(--color-ares-purple)]" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[var(--color-ares-border)]">
                  <div className="text-[var(--color-ares-purple)] text-3xl font-bold tracking-tighter">+32%</div>
                  <div className="text-white/40 text-[10px] font-mono mt-1 uppercase">Accuracy Increase</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Cognitive Load Accuracy */}
          <ScrollReveal direction="up" distance={30} speed={1.2}>
            <div className="bg-[#0B0F2A] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-teal)]/50 transition-colors h-full flex flex-col">
              <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
              <h4 className="text-white font-bold text-lg mb-8">Execution Under Load</h4>
              
              <div className="mt-auto space-y-6">
                <div className="flex items-end gap-3 h-24">
                  <div className="w-1/2 flex flex-col justify-end items-center relative group">
                    <span className="text-xs text-white/50 font-mono mb-2">Pre</span>
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: "45%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full bg-white/20 rounded-t-sm"
                    />
                  </div>
                  <div className="w-1/2 flex flex-col justify-end items-center relative group">
                    <span className="text-xs text-[var(--color-ares-teal)] font-mono mb-2">Post</span>
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: "88%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full bg-[var(--color-ares-teal)] rounded-t-sm"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[var(--color-ares-border)]">
                  <div className="text-[var(--color-ares-teal)] text-3xl font-bold tracking-tighter">+43%</div>
                  <div className="text-white/40 text-[10px] font-mono mt-1 uppercase">Load Resilience</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Oculomotor Tracking */}
          <ScrollReveal direction="up" distance={30} speed={1.3}>
            <div className="bg-[#0B0F2A] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-purple)]/50 transition-colors h-full flex flex-col">
              <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
              <h4 className="text-white font-bold text-lg mb-8">Dynamic Acuity Speed</h4>
              
              <div className="mt-auto space-y-6">
                 <div className="flex items-end gap-3 h-24">
                  <div className="w-1/2 flex flex-col justify-end items-center relative">
                    <span className="text-xs text-white/50 font-mono mb-2">Pre</span>
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: "35%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full bg-white/20 rounded-t-sm"
                    />
                  </div>
                  <div className="w-1/2 flex flex-col justify-end items-center relative">
                    <span className="text-xs text-[var(--color-ares-purple)] font-mono mb-2">Post</span>
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full bg-[var(--color-ares-purple)] rounded-t-sm"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[var(--color-ares-border)]">
                  <div className="text-[var(--color-ares-purple)] text-3xl font-bold tracking-tighter">2.6x</div>
                  <div className="text-white/40 text-[10px] font-mono mt-1 uppercase">Tracking Velocity</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </SectionReveal>
  );
}
