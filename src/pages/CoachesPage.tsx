import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, BarChart2, EyeOff, Clipboard, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function CoachesPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Metrics for Coaches & Directors | Ares Elite"
        description="Stop guessing. Start measuring. Isolate whether player errors are visual, cognitive, or physical. Integrate objective sensory metrics into your team."
        path="/coaches"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision Metrics for Coaches & Directors",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Isolate player bottlenecks and integrate objective sensory metrics into high-performance athletic programs."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Team Diagnostics & Science
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            Stop guessing. <br className="hidden md:block"/> Start measuring.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12">
            Visual-cognitive metrics that translate directly to game performance.
          </p>

          <div className="grid gap-12">
            
            {/* The Coaching Problem */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <EyeOff className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Why Do Elite Players Freeze?
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                You have athletes who look spectacular in slow, controlled practice drills, but consistently make late reads, commit turnover errors, or miss gaps during high-speed game play. 
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10">
                Without objective diagnostics, it’s impossible to determine if a mistake is a mental error, a lack of visual information, or a physical execution failure. Ares provides the tools to isolate where the bottleneck is happening in your athlete's processing chain.
              </p>
            </section>

            {/* Diagnostics Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Clipboard className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Decompose Latency</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Isolate visual search delay, choice decision-making lag, and physical motor execution time. Know exactly where your athletes are losing milliseconds.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <BarChart2 className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Objective Baseline Data</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Establish a benchmark of your team's visual-cognitive capabilities. Compare players objectively to understand who handles processing loads best.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Users className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Injury & Return Protocols</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Utilize precise post-injury checks against established pre-season baselines to ensure players are neurologically ready before returning to play.
                </p>
              </div>
            </section>

            {/* Team Audits */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                Custom Team Screening Programs
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Ares works directly with athletic programs, high schools, club teams, and professional training camps. We offer localized, on-site sensory testing days to map out team-wide performance and safety data.
              </p>
              <p className="text-white/70 leading-relaxed font-bold">
                Get team-level visual processing dashboards, individual player feedback sheets, and structured recommendations for coaches.
              </p>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                Eliminate the Guesswork From Athlete Development
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Request a custom consultation to discuss integrating the A.R.E.S. system into your team, academy, or athletic training facility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Request Team Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link to="/teams-and-organizations" className="text-white/60 hover:text-white transition-colors text-sm font-medium px-4">
                  Learn About Team Programs &rarr;
                </Link>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
