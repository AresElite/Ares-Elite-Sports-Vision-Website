import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Shield, Zap, TrendingUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function ParentsPage() {
  return (
    <>
      <SEO 
        title="Youth Athlete Cognitive Training & Safety | Ares Elite"
        description="Equip your youth athlete with the decision-making speed that scouts notice. Build an objective visual-cognitive baseline for safety and performance."
        path="/parents"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Youth Athlete Cognitive Training & Safety",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Equip youth athletes with decision-making speed and visual-cognitive baselines for performance and concussion safety."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-purple)]/30 bg-[var(--color-ares-purple)]/10 text-[var(--color-ares-purple)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Development & Safety
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            Invest in their <br className="hidden md:block"/> cognitive OS.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-purple)] font-medium leading-relaxed mb-12">
            Equip your athlete with the decision-making speed that scouts notice.
          </p>

          <div className="grid gap-12">
            
            {/* The Parent Dilemma */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <HelpCircle className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                The Missing Link in Youth Development
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                Parents spend thousands of dollars every year on travel teams, private coaches, and expensive equipment. Yet they often overlook the very system that directs all physical actions: the brain and eyes.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10">
                If an athlete can't see the play develop, process options, and react instantly, the best equipment in the world won't make a difference. Ares trains the dynamic visual-cognitive skills that help young athletes stand out and play safer.
              </p>
            </section>

            {/* Why It Matters for Development */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <TrendingUp className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Competitive Edge</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Scouts notice athletes who make the right decisions under pressure. We train visual anticipation, focus under distraction, and Choice Reaction Time.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Shield className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Concussion Safety</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Establish an objective, millisecond-accurate neurological baseline. In the event of an injury, this baseline removes the guesswork from safe return-to-play decisions.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Zap className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Skill Integration</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Visual training works best during developmental years, cementing good sensory habits before visual bottlenecks or reaction delay patterns solidify.
                </p>
              </div>
            </section>

            {/* The Concussion Baseline Focus */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                An Objective Safety Net
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Standard concussion checks rely on subjective memory and basic balance tests. Because the visual system utilizes over 50% of the brain's pathways, subtle post-injury deficits show up instantly as visual routing errors, peripheral lag, or reaction delays.
              </p>
              <p className="text-white/70 leading-relaxed font-bold">
                With an Ares baseline evaluation, you secure a highly precise neurological blueprint of your child's brain performance, providing peace of mind all season long.
              </p>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                Prepare Them for the Next Level
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Schedule your youth athlete's 75-minute Sports Vision Performance Evaluation today. Get objective data on their visual speed, tracking, and focus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/book/evaluation" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Schedule Youth Baseline Evaluation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link to="/concussion-baseline-testing" className="text-white/60 hover:text-white transition-colors text-sm font-medium px-4">
                  Learn About Baseline Testing &rarr;
                </Link>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
