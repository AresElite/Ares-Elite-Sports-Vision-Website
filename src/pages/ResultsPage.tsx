import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, TrendingDown, TrendingUp, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export function ResultsPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Case Studies & Performance Results | Ares Elite"
        description="Objective millisecond validation. Examine pre- and post-training data, Choice Reaction Time latency reductions, and sensory performance research studies."
        path="/results"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision Case Studies & Performance Results",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Case studies, pre/post performance metrics, and research on sports vision training efficacy."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Data Validation & Outcomes
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            Objective millisecond <br className="hidden md:block"/> validation.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12">
            Real data. Real athletes. Zero guesswork.
          </p>

          <div className="grid gap-12">
            
            {/* The Evidence Overview */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Award className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Measurable Transfer to Sport
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                At Ares Elite Sports Vision, we don't speak in vague generalizations. We measure everything. Over a standard 6-week neurocognitive training block, our athletes consistently achieve improvements in dynamic processing speed, peripheral target capture, and motor response coordination.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10">
                Below are the average performance gains measured across our database of competitive, collegiate, and professional athletes.
              </p>
            </section>

            {/* Performance Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Choice Reaction Time */}
              <ScrollReveal direction="up" distance={30} speed={1.0}>
                <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-teal)]/50 transition-colors h-full flex flex-col">
                  <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
                  <h4 className="text-white font-bold text-lg mb-8 uppercase">Choice Reaction Time</h4>
                  
                  <div className="mt-auto space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-white/60">
                        <span>Baseline (Pre-training)</span>
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
                        <span className="font-mono">317ms</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "62%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-[var(--color-ares-teal)]" 
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--color-ares-border)]">
                      <div className="text-[var(--color-ares-teal)] text-3xl font-bold tracking-tighter">-38%</div>
                      <div className="text-white/40 text-[10px] font-mono mt-1 uppercase">Choice Latency Reduction</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Peripheral Processing */}
              <ScrollReveal direction="up" distance={30} speed={1.1}>
                <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-purple)]/50 transition-colors h-full flex flex-col">
                  <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
                  <h4 className="text-white font-bold text-lg mb-8 uppercase">Peripheral Processing</h4>
                  
                  <div className="mt-auto space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-white/60">
                        <span>Baseline (Pre-training)</span>
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

              {/* Execution Under Load */}
              <ScrollReveal direction="up" distance={30} speed={1.2}>
                <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-teal)]/50 transition-colors h-full flex flex-col">
                  <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
                  <h4 className="text-white font-bold text-lg mb-8 uppercase">Execution Under Load</h4>
                  
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

              {/* Simple Reaction Time */}
              <ScrollReveal direction="up" distance={30} speed={1.3}>
                <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-purple)]/50 transition-colors h-full flex flex-col">
                  <div className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">Metric</div>
                  <h4 className="text-white font-bold text-lg mb-8 uppercase">Simple Reaction Time</h4>
                  
                  <div className="mt-auto space-y-6">
                     <div className="flex items-end gap-3 h-24">
                      <div className="w-1/2 flex flex-col justify-end items-center relative">
                        <span className="text-xs text-white/50 font-mono mb-2">280ms Pre</span>
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: "80%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full bg-white/20 rounded-t-sm"
                        />
                      </div>
                      <div className="w-1/2 flex flex-col justify-end items-center relative">
                        <span className="text-xs text-[var(--color-ares-purple)] font-bold mb-2">210ms Post</span>
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: "60%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full bg-[var(--color-ares-purple)] rounded-t-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--color-ares-border)]">
                      <div className="text-[var(--color-ares-purple)] text-3xl font-bold tracking-tighter">-25%</div>
                      <div className="text-white/40 text-[10px] font-mono mt-1 uppercase">Simple Latency Reduction</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </section>

            {/* Credibility Stats Bar */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                <div>
                  <div className="text-[var(--color-ares-teal)] text-4xl sm:text-5xl font-extrabold tracking-tight">2,500+</div>
                  <div className="text-white/50 text-[10px] sm:text-xs font-mono mt-2 uppercase tracking-widest">Evaluations Completed</div>
                </div>
                <div>
                  <div className="text-[var(--color-ares-purple)] text-4xl sm:text-5xl font-extrabold tracking-tight">7,000+</div>
                  <div className="text-white/50 text-[10px] sm:text-xs font-mono mt-2 uppercase tracking-widest">Training Sessions</div>
                </div>
                <div>
                  <div className="text-[var(--color-ares-teal)] text-4xl sm:text-5xl font-extrabold tracking-tight">600,000+</div>
                  <div className="text-white/50 text-[10px] sm:text-xs font-mono mt-2 uppercase tracking-widest">Performance Data Points</div>
                </div>
              </div>
            </section>

            {/* Testimonial Summary */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                Field Outcomes
              </h2>
              <div className="space-y-6">
                <div className="pb-6 border-b border-white/5">
                  <h4 className="text-sm font-mono tracking-widest text-[var(--color-ares-teal)] uppercase mb-2">Motorsports (IndyCar / NASCAR)</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Drivers report improved visual scanning, smoother gaze transition through high-speed turns, and increased visual stamina over 200+ lap races.
                  </p>
                </div>
                <div className="pb-6 border-b border-white/5">
                  <h4 className="text-sm font-mono tracking-widest text-[var(--color-ares-purple)] uppercase mb-2">Court & Field Sports (Basketball / Soccer)</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Players exhibit faster transition reads, fewer turnover mistakes under pressure, and improved spatial awareness of defender gaps.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-mono tracking-widest text-[var(--color-ares-teal)] uppercase mb-2">Target & Hand-Eye Sports (Baseball / Hockey)</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Hitters experience better contrast sensitivity and earlier pitch tracking. Goalies demonstrate faster glove-hand reaction times.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                Validate Your Performance Metrics
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Stop playing with sensory bottlenecks. Get evaluated, measure your current baseline, and see your millisecond gains compound.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/book/evaluation" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Book Baseline Evaluation ($449)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-white hover:text-[var(--color-ares-teal)] transition-colors text-sm font-bold border border-white/10 hover:border-[var(--color-ares-teal)]/30 bg-white/5 hover:bg-[var(--color-ares-teal)]/5 px-6 py-3 rounded-lg"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Request Research Folio
                </a>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
