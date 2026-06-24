import { ArrowRight, Award } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';

export function PerformanceResults() {
  const highlights = [
    { value: "-38%", label: "Choice Latency", desc: "Faster brain-to-muscle routing" },
    { value: "+32%", label: "Peripheral Processing", desc: "Wider usable visual field" },
    { value: "+43%", label: "Load Resilience", desc: "Accurate decisions under stress" }
  ];

  return (
    <SectionReveal id="results" className="py-20 md:py-28 relative bg-[var(--color-ares-bg)] border-t border-[var(--color-ares-border)]">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,242,254,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Info Block */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <ScrollReveal direction="right" distance={40}>
              <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                <Award className="h-4 w-4 text-[var(--color-ares-teal)]" />
                <span className="text-sm font-mono text-[var(--color-ares-teal)] tracking-[0.2em] uppercase">Proven Efficacy</span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight uppercase">
                QUANTIFIABLE <br className="hidden lg:block" /> IMPROVEMENT.
              </h3>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 text-balance font-light">
                We do not rely on subjective feelings. Through our objective A.R.E.S. evaluation protocol, we measure the millisecond improvements that separate average performance from elite execution.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Button 
                  variant="primary" 
                  href="/results"
                  className="font-bold tracking-wide"
                >
                  View Case Studies & Data
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Highlights Block */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" distance={40} speed={1.0}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {highlights.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 md:p-8 rounded-2xl bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] hover:border-[var(--color-ares-teal)]/30 transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="text-[var(--color-ares-teal)] text-4xl sm:text-5xl font-black tracking-tight mb-2">
                        {item.value}
                      </div>
                      <div className="text-white font-bold text-base tracking-tight mb-1">
                        {item.label}
                      </div>
                    </div>
                    <div className="text-xs text-white/50 leading-relaxed font-light mt-4">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </SectionReveal>
  );
}
