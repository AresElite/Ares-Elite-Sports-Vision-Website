import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Eye, Shield, Activity, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function OfficialsPage() {
  return (
    <>
      <SEO 
        title="Sports Vision for Officials & Referees | Ares Elite"
        description="Flawless sequencing at game speed. Expand peripheral awareness, improve gaze stability, and make accurate calls under pressure."
        path="/officials"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision for Officials & Referees",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Visual training for sports officials, referees, and judges to improve decision accuracy under pressure."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-purple)]/30 bg-[var(--color-ares-purple)]/10 text-[var(--color-ares-purple)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Officiating & Arbitration
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            Flawless sequencing <br className="hidden md:block"/> at game speed.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-purple)] font-medium leading-relaxed mb-12">
            Expand peripheral awareness and make accurate calls under pressure.
          </p>

          <div className="grid gap-12">
            
            {/* The Officiating Pain Point */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Award className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                The Referee's Challenge
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                Officials have one of the hardest jobs in sports. You are expected to be correct 100% of the time, in a fraction of a second, with bodies flying, crowds screaming, and plays occurring at extreme speeds.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10">
                Ares trains high-level referees and officials (including NBA and collegiate arbiters) to stabilize their gaze, ignore visual distractions, expand peripheral coverage, and sequence chaotic visual information accurately.
              </p>
            </section>

            {/* Officiating Skills */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Eye className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Gaze Stability</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Keep your focus clear on the key interaction point while maintaining visual tracking on surrounding players and potential violations.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Shield className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Visual Noise Filtering</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Ignore moving backgrounds, screaming crowds, and decoy actions. Isolate and track only the relevant sequence to make the correct call.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Activity className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Decision Sequencing</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Process multi-step sequences (e.g., ball contact, foot placement, boundary lines) in the correct chronological order without visual lag.
                </p>
              </div>
            </section>

            {/* Performance Program */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                Trusted by the Best
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Our programs are trusted by referees and officials operating at the highest levels of collegiate and professional sports. We help arbiters maintain perfect consistency through the fourth quarter or final lap, when fatigue sets in.
              </p>
              <p className="text-white/70 leading-relaxed font-bold">
                Get objective analysis of your tracking latency, peripheral gaps, and visual fatigue threshold.
              </p>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                Master the Speed of the Game
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Connect with our team to schedule an individual evaluation or secure a custom program for your officiating association.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Secure Officiating Intake
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
