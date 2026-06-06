import { motion } from 'framer-motion';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';

const steps = [
  {
    number: "01",
    title: "Evaluate",
    description: "Establish a baseline across visual, cognitive, and reactive metrics using the A.R.E.S. testing protocol.",
  },
  {
    number: "02",
    title: "Analyze",
    description: "Identify neurological bottlenecks and visual deficits costing milliseconds in competitive environments.",
  },
  {
    number: "03",
    title: "Train",
    description: "Execute a targeted neurocognitive stimulus program adapting to your performance in real time.",
  },
  {
    number: "04",
    title: "Re-Evaluate",
    description: "Quantify adaptation, measure improvement, and push the baseline higher into elite margins.",
  }
];

export function RoadmapSection() {
  return (
    <SectionReveal id="roadmap" className="py-20 sm:py-24 relative bg-[var(--color-ares-bg)] border-t border-[var(--color-ares-border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={30}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-mono text-[var(--color-ares-teal)] tracking-[0.2em] mb-4 uppercase">The Process</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              THE A.R.E.S. PERFORMANCE LOOP
            </h3>
          </div>
        </ScrollReveal>

        <div className="relative mt-12">
          {/* Horizontal Line connecting steps (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-[var(--color-ares-border)] z-0" />
          <div className="hidden md:block absolute top-[44px] left-[10%] w-[33%] h-0.5 bg-gradient-to-r from-[var(--color-ares-teal)] to-transparent z-0 opacity-50" />

          {/* Vertical Line connecting steps (Mobile) */}
          <div className="md:hidden absolute top-[40px] bottom-[40px] left-[40px] w-0.5 bg-[var(--color-ares-border)] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <ScrollReveal 
                key={step.number} 
                direction="up" 
                distance={20} 
                speed={1 + (index * 0.1)}
              >
                <div className="relative flex md:flex-col items-center md:items-center text-left md:text-center group">
                  <div className="w-[80px] md:w-[88px] shrink-0 md:shrink flex justify-center md:mb-6 z-10 relative">
                    <div className="w-16 h-16 md:w-[88px] md:h-[88px] flex items-center justify-center rounded-2xl bg-[#0B0F2A] border border-[var(--color-ares-border)] text-[var(--color-ares-teal)] font-mono text-xl md:text-2xl font-bold tracking-widest shadow-lg group-hover:border-[var(--color-ares-teal)]/50 group-hover:scale-105 transition-all duration-300">
                      {step.number}
                    </div>
                  </div>
                  <div className="ml-6 md:ml-0 md:px-4">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[var(--color-ares-teal)] transition-colors">{step.title}</h4>
                    <p className="text-sm md:text-xs lg:text-sm text-white/60 leading-relaxed font-medium">{step.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
