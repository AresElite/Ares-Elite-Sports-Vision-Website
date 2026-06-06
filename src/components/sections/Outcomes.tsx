import { motion } from 'framer-motion';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';

export function OutcomesSection() {
  return (
    <SectionReveal id="outcomes" className="py-20 sm:py-32 relative bg-[var(--color-ares-bg)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        
        {/* Athlete Focus */}
        <ScrollReveal direction="up" distance={30} speed={0.8}>
          <div className="mb-20">
            <h2 className="text-sm font-mono text-[var(--color-ares-teal)] tracking-[0.2em] mb-4 uppercase">For Athletes & Parents</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">THE GAME IS NOT TOO FAST.<br/>YOUR PROCESSING IS LATE.</h3>
            <p className="text-lg sm:text-xl text-white/60 max-w-3xl leading-relaxed text-balance">
              You are working hard, but you may still be losing milliseconds. If you are reacting late, missing reads, losing track of the play, or feeling overwhelmed under pressure, a regular eye exam will tell you your vision is "fine". But we know it is not.
            </p>
            <p className="text-lg sm:text-xl text-white/60 max-w-3xl leading-relaxed text-balance mt-4">
              We identify exactly where the breakdown happens—whether it is acquiring information, processing it, or executing under game-speed pressure. Training your eyes and brain can make you faster, sharper, and more confident when it counts.
            </p>
          </div>
        </ScrollReveal>

        {/* Coach Focus */}
        <ScrollReveal direction="up" distance={30} speed={0.8}>
          <div className="mb-24 lg:ml-auto lg:w-3/4">
            <div className="pl-0 lg:pl-12 lg:border-l lg:border-[var(--color-ares-border)]">
              <h2 className="text-sm font-mono text-[var(--color-ares-purple)] tracking-[0.2em] mb-4 uppercase">For Coaches & Organizations</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">YOU SEE THE OUTCOME.<br/>WE IDENTIFY THE CAUSE.</h3>
              <p className="text-lg sm:text-xl text-white/60 leading-relaxed text-balance">
                An athlete's performance issue may not be their effort, toughness, mechanics, or skill. You may be trying to fix a visible execution problem when the real issue is upstream.
              </p>
              <p className="text-lg sm:text-xl text-white/60 leading-relaxed text-balance mt-4">
                If an athlete sees the play late, processes the wrong cue, or chooses too slowly, the mechanical execution will inevitably look poor. You do not have to guess anymore. We give teams objective data, not vague impressions, to identify hidden bugs in their operating system.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Table Section */}
        <ScrollReveal direction="up" distance={40} speed={1}>
          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl overflow-hidden shadow-glow">
            <div className="p-6 md:p-8 border-b border-[var(--color-ares-border)] bg-white/5">
              <h3 className="text-2xl font-bold text-white tracking-tight">The Upstream Performance Deficit</h3>
              <p className="text-white/60 mt-2">What you observe might just be a symptom of a deeper bottleneck in the human operating system.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-ares-border)] bg-black/40">
                    <th className="p-4 md:p-6 text-sm font-mono text-white/60 uppercase tracking-wider">What You See (Problem)</th>
                    <th className="p-4 md:p-6 text-sm font-mono text-[var(--color-ares-teal)] uppercase tracking-wider">Possible Upstream Cause</th>
                    <th className="p-4 md:p-6 text-sm font-mono text-[var(--color-ares-purple)] uppercase tracking-wider">How A.R.E.S. Evaluates It</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-ares-border)] text-sm md:text-base">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 md:p-6 text-white font-medium">Late reaction to the play</td>
                    <td className="p-4 md:p-6 text-white/70">Slow visual acquisition or narrow peripheral awareness</td>
                    <td className="p-4 md:p-6 text-white/70">Dynamic visual acuity & peripheral tracking metrics</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors bg-black/20">
                    <td className="p-4 md:p-6 text-white font-medium">Poor decision making under pressure</td>
                    <td className="p-4 md:p-6 text-white/70">Cognitive overload or inefficient neural routing</td>
                    <td className="p-4 md:p-6 text-white/70">Complex choice-reaction speed under cognitive load</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 md:p-6 text-white font-medium">Inconsistent mechanical execution</td>
                    <td className="p-4 md:p-6 text-white/70">Disconnect between visual decision and motor execution</td>
                    <td className="p-4 md:p-6 text-white/70">Eye-hand/Eye-body coordination timing</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors bg-black/20">
                    <td className="p-4 md:p-6 text-white font-medium">Fatigue leading to late-game errors</td>
                    <td className="p-4 md:p-6 text-white/70">Lack of system synchronization causing premature exhaustion</td>
                    <td className="p-4 md:p-6 text-white/70">Sustained attention & prolonged reaction endurance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </SectionReveal>
  );
}
