import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Target, Brain, Activity, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function AthletesPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Training for Elite Athletes | Ares Elite"
        description="Physical training doesn't fix a late read. Isolate visual-cognitive bottlenecks, decrease Choice Reaction Time (CRT), and expand peripheral awareness."
        path="/athletes"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision Training for Elite Athletes",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Isolate visual-cognitive bottlenecks, decrease Choice Reaction Time (CRT), and expand peripheral awareness for elite performance."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Performance Optimization
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            Movement starts <br className="hidden md:block"/> before action.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12">
            Isolate neural bottlenecks and reduce response latency.
          </p>

          <div className="grid gap-12">
            
            {/* The Hard Truth Section */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldAlert className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                The Performance Bottleneck
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                You’ve invested thousands of hours in strength conditioning, speed drills, and technical skill. But physical speed is useless if your brain receives the signal too late. If your visual-cognitive routing is congested, your athletic execution will always feel half a step behind.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10 font-bold">
                Ares trains the system that controls movement. We help you read gaps, track trajectories, and make choices in milliseconds.
              </p>
            </section>

            {/* Core Training Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Target className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Choice Reaction Time</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  In games, you don't react to simple lights. You react to complex options. We decompose your processing chain into sensory, routing, and execution phases to reduce choice latency.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Brain className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Spatial & Peripheral Awareness</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Expand your field of view. Recognize threats, targets, and gaps in your periphery without dropping your gaze or losing tracking accuracy.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Activity className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Processing Under Load</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Decisions get sloppy when physical exhaustion hits. We train your visual-cognitive loop under athletic fatigue to maintain precision when it matters most.
                </p>
              </div>
            </section>

            {/* Comparison */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4 uppercase">
                The Performance Standard
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                  <div>
                    <h4 className="text-sm font-mono tracking-widest text-[var(--color-ares-muted)] uppercase mb-2">Static Vision (20/20)</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Checks visual acuity at rest. Tells you if your physical optical hardware is clear while sitting in a dark room. Useful for glasses, useless for sports.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono tracking-widest text-[var(--color-ares-teal)] uppercase mb-2">A.R.E.S. Dynamic Processing</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Measures visual acquisition, brain routing latency, choice selection speed, and spatial coordination under physical load and high-speed motion.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                Ready to Upgrade Your Neural Operating System?
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Every athlete begins with a comprehensive 75-minute Sports Vision Performance Evaluation. Establish your baseline, isolate your bottlenecks, and build your training program.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/book/evaluation" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Book Performance Evaluation ($449)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link to="/sports-vision-training" className="text-white/60 hover:text-white transition-colors text-sm font-medium px-4">
                  Explore Training Pathways &rarr;
                </Link>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
