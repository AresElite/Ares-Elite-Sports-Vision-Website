import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Monitor, Database, BarChart2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function TechnologyPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Technology & Performance Data | Ares Elite"
        description="The sensory analytics dashboard. Explore custom EMR tracking, the AQ™ (Ares Quotient) Score, and advanced neurocognitive training hardware."
        path="/technology-and-data"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision Technology & Performance Data",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Sensory tracking analytics, custom EMR, and advanced neurocognitive sports vision training hardware."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Data Stack & Hardware
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            The sensory <br className="hidden md:block"/> analytics dashboard.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12">
            Custom EMR, cognitive testing suites, and data tracking.
          </p>

          <div className="grid gap-12">
            
            {/* The Tech Overview */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Monitor className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Objective Performance Architecture
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                Performance training should not rely on subjective guesswork. Ares utilizes a premium hardware and software stack to measure sensory latency down to the millisecond. By tracking eyes, brain, and body under dynamic load, we compile a data-driven blueprint of your performance.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10 font-bold">
                Every metric is centralized in our custom EMR portal, allowing athletes and coaches to analyze progress, isolate bottlenecks, and adjust training programs in real-time.
              </p>
            </section>

            {/* Tech Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Database className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Custom EMR Logging</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Track progress over weeks and months. Your evaluation metrics, baseline charts, and training progression histories are logged securely in our proprietary cloud portal.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <BarChart2 className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">AQ™ Quotient Scores</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  The Ares Quotient (AQ™) is a weighted score indicating your system's processing efficiency across visual capture, cognitive routing, motor execution, and coordination synchronization.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Shield className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Hardware Stack</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We integrate virtual reality target captures, strobe occlusion lenses, high-speed eye tracking systems, and spatial target boards to isolate sensory bottlenecks.
                </p>
              </div>
            </section>

            {/* EMR Showcase Row */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                Data-Driven Upgrades
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Our custom EMR gives coaches, trainers, and athletes an instant visual report of sensory performance. No spreadsheets or vague summaries. You get clean charts illustrating exactly how your Choice Reaction Time is dropping and how your tracking accuracy is climbing.
              </p>
              <p className="text-white/70 leading-relaxed font-bold">
                This is the standard of performance analytics that elite collegiate programs and professional motorsports rosters demand.
              </p>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                See the System in Action
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Request a platform demo to explore our EMR dashboard, check custom telemetry integration capabilities, or speak to our data coordinator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Request Platform Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
