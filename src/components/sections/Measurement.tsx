import { Eye, Cpu, Zap, RefreshCw, ArrowRight } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';

export function MeasurementSection() {
  const pillars = [
    {
      icon: Eye,
      title: "ACQUIRE",
      subtitle: "Visual Intake Evaluation",
      desc: "We measure how fast and accurately your eyes capture visual stimuli, tracking eye alignment, visual focus, and peripheral field size."
    },
    {
      icon: Cpu,
      title: "ROUTE",
      subtitle: "Neural Processing Lag",
      desc: "We isolate sensory cognitive routing, measuring how fast the brain recognizes a change and decides on a course of action."
    },
    {
      icon: Zap,
      title: "EXECUTE",
      subtitle: "Motor Response Execution",
      desc: "We decompose execution mechanics, separating pure cognitive decision time from physical neuromuscular reaction output."
    },
    {
      icon: RefreshCw,
      title: "SYNCHRONIZE",
      subtitle: "Dynamic Systems Harmony",
      desc: "We analyze the entire loop under extreme physical fatigue and high-tension cognitive load to measure performance decay."
    }
  ];

  return (
    <SectionReveal id="measurement" className="py-24 md:py-32 border-t border-[var(--color-ares-border)] relative bg-[var(--color-ares-bg)]">
      {/* Geometric background accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Text Column */}
          <ScrollReveal direction="right" distance={50} speed={0.8} className="text-center lg:text-left">
            <div>
              <span className="text-[var(--color-ares-teal)] font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4 block animate-pulse">The A.R.E.S. Measurement Protocol</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight text-balance uppercase">
                Find Your <br /> Decision-Speed Baseline.
              </h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed text-balance font-light">
                We reject subjective "feeling" and "eye test" guesses. We extract objective data from your Human Operating System to find exactly where you are losing milliseconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="primary" 
                  href="/technology-and-data"
                  className="font-bold tracking-wide"
                >
                  Explore Technology & Data Stack
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Pillars List Column */}
          <div className="space-y-6 flex flex-col group/list">
            {pillars.map((pillar, i) => (
              <ScrollReveal key={i} direction="up" distance={20} speed={0.5 + (i * 0.15)} className="w-full">
                <div className="flex gap-4 sm:gap-6 p-5 rounded-2xl bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] hover:border-[var(--color-ares-teal)]/30 transition-all duration-300">
                  <div className="bg-[var(--color-ares-purple)]/10 border border-[var(--color-ares-purple)]/20 p-3.5 rounded-xl shrink-0 h-fit self-start">
                    <pillar.icon className="h-6 w-6 text-[var(--color-ares-teal)]" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[var(--color-ares-teal)] font-mono text-xs font-bold tracking-wider">{pillar.title}</span>
                      <span className="text-white/45 text-[10px] font-mono">•</span>
                      <span className="text-white/50 text-[11px] font-mono uppercase tracking-wider">{pillar.subtitle}</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed font-light">{pillar.desc}</p>
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
