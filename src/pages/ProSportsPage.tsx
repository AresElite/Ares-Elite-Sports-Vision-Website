import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Zap, Target, Gauge, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function ProSportsPage() {
  return (
    <>
      <SEO 
        title="Professional Motorsports & Elite Sensory Training | Ares Elite"
        description="Where 0.1 seconds is the difference between winning and losing. High-speed visual processing, eye-tracking telemetry, and cognitive overload training."
        path="/pro-sports"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Professional Motorsports & Elite Sensory Training",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Sensory training and reaction speed optimization for motorsports, professional athletes, and elite officials."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Professional & Motorsports
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            Elite sensory <br className="hidden md:block"/> latency training.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12">
            Where 0.1 seconds is the difference between winning and losing.
          </p>

          <div className="grid gap-12">
            
            {/* Professional Standards */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Gauge className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                The Millisecond Margin
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                At 240 mph, an IndyCar covers 350 feet per second. In the NFL, a quarterback has under 2.5 seconds to survey, choose, and execute. In these arenas, standard human reaction time is not fast enough.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10">
                Ares trains professional drivers, D1 collegiate athletes, NBA/NFL officials, and Olympians to process visual information under high G-forces, stress, and extreme fatigue. We optimize your sensory latency to unlock speed you didn't know you had.
              </p>
            </section>

            {/* Professional Specifics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Gauge className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">High-G Processing</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Train gaze control, saccadic speed, and focus stability under physical vibrations, high-G loads, and cockpit heat.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Target className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Telemetry Integration</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We couple eye-tracking diagnostics with driver telemetry to show exactly how visual acquisition patterns correlate with track sector times and braking points.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Zap className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Sensory Overload</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Overload the cognitive system using strobe occlusion, multi-object tracking, and complex choices to expand decision bandwidth during competition.
                </p>
              </div>
            </section>

            {/* Motorsports Case Focus */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-6 h-6 text-[var(--color-ares-teal)]" />
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">
                  Pit Crew Optimization
                </h2>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">
                A pit stop is an athletic sequence where a delay of 0.1 seconds costs track positions. Ares trains tire changers, jacks, and refuelers to execute synchronization patterns under extreme speed and pressure constraints.
              </p>
              <p className="text-white/70 leading-relaxed font-bold">
                Our custom testing programs help teams measure crew latency, isolate individual coordination bottlenecks, and cut total execution times.
              </p>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                Work Directly With Dr. LaPlaca
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Consult with our director to set up custom testing, telemetry audits, or season-long training programs for your professional team or driver roster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Connect with Dr. LaPlaca
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link to="/sports/racing-vision-training" className="text-white/60 hover:text-white transition-colors text-sm font-medium px-4">
                  Explore Racing Program &rarr;
                </Link>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
