import { motion } from 'framer-motion';
import { Award, Globe, ShieldCheck } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';

export function CertificationSection() {
  return (
    <SectionReveal id="certification" className="py-20 sm:py-32 border-t border-[var(--color-ares-border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-[var(--color-ares-bg)] border border-[var(--color-ares-purple)]/20 rounded-3xl p-8 sm:p-12 md:p-20 relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)]">
          {/* Background Pattern */}
          <ScrollReveal direction="down" distance={100} speed={0.2} className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[var(--color-ares-purple)]/20 via-transparent to-transparent">
            <div className="w-full h-full"></div>
          </ScrollReveal>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="right" distance={40} speed={0.8} className="text-center lg:text-left">
              <div>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-ares-purple)]/10 text-[var(--color-ares-purple)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-8 border border-[var(--color-ares-purple)]/30 uppercase">
                  FOR MEDICAL & PERFORMANCE PROFESSIONALS
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight text-balance">
                  BECOME A.R.E.S. CERTIFIED.
                </h2>
                <p className="text-white/70 text-lg sm:text-xl mb-10 leading-relaxed text-balance font-light">
                  A.R.E.S. Certification is the professional pathway for optometrists, neurologists, athletic trainers, and performance coaches to learn and implement the system. We provide a structured way to evaluate athletes beyond basic eyesight and isolated symptoms.
                </p>
                
                <div className="space-y-6 mb-12 flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-5">
                    <div className="h-8 w-8 rounded-full bg-[var(--color-ares-purple)]/20 flex items-center justify-center border border-[var(--color-ares-purple)]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      <ShieldCheck className="h-4 w-4 text-[var(--color-ares-purple)]" />
                    </div>
                    <span className="text-white/90 font-medium text-sm sm:text-base tracking-wide">Master the Complete A.R.E.S. Framework</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="h-8 w-8 rounded-full bg-[var(--color-ares-purple)]/20 flex items-center justify-center border border-[var(--color-ares-purple)]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      <Globe className="h-4 w-4 text-[var(--color-ares-purple)]" />
                    </div>
                    <span className="text-white/90 font-medium text-sm sm:text-base tracking-wide">Access the Proprietary Evaluation & Data Platform</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="h-8 w-8 rounded-full bg-[var(--color-ares-purple)]/20 flex items-center justify-center border border-[var(--color-ares-purple)]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      <Award className="h-4 w-4 text-[var(--color-ares-purple)]" />
                    </div>
                    <span className="text-white/90 font-medium text-sm sm:text-base tracking-wide">Communicate Findings Clearly to Athletes & Teams</span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="!bg-[var(--color-ares-purple)] !text-white hover:!bg-[#7c4dff] shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-[var(--color-ares-purple)]/50 w-full sm:w-auto"
                  href="https://arescertification.com/"
                >
                  Apply for Certification
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={40} speed={1.1} rotate={1} className="flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                <div className="aspect-square rounded-2xl bg-gradient-to-b from-[#13152a] to-[var(--color-ares-bg)] border border-[var(--color-ares-border)] p-8 sm:p-12 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                  
                  {/* Internal Glow Effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--color-ares-purple)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="text-center relative z-10 scale-95 group-hover:scale-100 transition-transform duration-700">
                    <div className="text-5xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-2">ARES</div>
                    <div className="text-[var(--color-ares-purple)] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-mono font-bold">Certified Partner</div>
                    <div className="mt-12 w-20 h-20 sm:w-28 sm:h-28 mx-auto border border-[var(--color-ares-purple)]/50 bg-[var(--color-ares-purple)]/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)] group-hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] transition-shadow duration-700">
                      <Award className="h-10 w-10 sm:h-14 sm:w-14 text-[var(--color-ares-purple)] drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                    </div>
                  </div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-[var(--color-ares-purple)]/10 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-[var(--color-ares-purple)]/10 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
