import { motion } from 'framer-motion';
import { Target, Compass, Zap } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';

const values = [
  "Excellence",
  "Innovation",
  "Commitment",
  "Integrity",
  "Challenge Convention"
];

export function MissionVisionSection() {
  return (
    <SectionReveal id="mission-vision" className="relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-ares-teal)]/20 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-[var(--color-ares-teal)] tracking-[0.2em] mb-4 uppercase">Identity</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
            WHO WE ARE
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Mission */}
          <ScrollReveal direction="up" distance={30} speed={0.8} className="h-full">
            <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-10 h-full flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-ares-teal)]/10 rounded-full blur-[40px] group-hover:bg-[var(--color-ares-teal)]/20 transition-colors" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[var(--color-ares-teal)]">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Mission</h4>
              </div>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed relative z-10">
                Improve performance through the <strong className="text-white font-medium">A.R.E.S. Performance Loop™</strong>.
              </p>
            </div>
          </ScrollReveal>

          {/* Vision */}
          <ScrollReveal direction="up" distance={30} speed={1} className="h-full">
            <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-10 h-full flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-ares-purple)]/10 rounded-full blur-[40px] group-hover:bg-[var(--color-ares-purple)]/20 transition-colors" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[var(--color-ares-purple)]">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Vision</h4>
              </div>
              <div className="space-y-4 relative z-10">
                <p className="text-lg text-white/80 leading-relaxed">
                  <strong className="text-white font-medium block mb-1">A.R.E.S. Performance Loop™</strong>
                  Performance framework standard
                </p>
                <div className="w-full h-px bg-white/10"></div>
                <p className="text-lg text-white/80 leading-relaxed">
                  <strong className="text-white font-medium block mb-1">Ares Quotient (AQ)™</strong>
                  Vision and neurocognitive measurement standard
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Core Values */}
        <ScrollReveal direction="up" distance={40} speed={1.2}>
          <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-[var(--color-ares-bg)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
              <div className="md:w-1/3">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[var(--color-ares-teal)]/20 border border-[var(--color-ares-teal)]/50 rounded-xl flex items-center justify-center text-[var(--color-ares-teal)]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Core Values</h4>
                </div>
                <p className="text-white/60">The principles that dictate how we operate, innovate, and train elite performers.</p>
              </div>
              
              <div className="md:w-2/3 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)]" />
                      <span className="text-white font-bold tracking-wide uppercase text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SectionReveal>
  );
}
