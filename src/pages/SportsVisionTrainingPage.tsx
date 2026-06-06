import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function SportsVisionTrainingPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Training for Athletes | Ares Elite Sports Vision"
        description="Train reaction time, decision speed, visual processing, peripheral awareness, and eye-hand coordination with structured sports vision training."
        path="/sports-vision-training"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision Training",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Train reaction time, decision speed, visual processing, peripheral awareness, and eye-hand coordination with structured sports vision training."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Sports Vision Training <br className="hidden md:block" /> for Athletes
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed mb-12">
            Sports vision training at Ares is built from evaluation data. Athletes do not receive random drills. Their training plan is based on measured strengths, bottlenecks, sport demands, and progress over time.
          </p>

          <div className="grid gap-12">
            
            {/* Section: What we train */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">
                What We Train
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Reaction time",
                  "Choice reaction time",
                  "Visual processing speed",
                  "Peripheral awareness",
                  "Eye-hand coordination",
                  "Decision speed",
                  "Visual tracking",
                  "Depth judgment",
                  "Go/no-go response control",
                  "Cognitive inhibition",
                  "Multi-object awareness",
                  "Performance under pressure"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-ares-teal)] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: How Training Works */}
            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                The 6-Week Protocol (Post-Evaluation Expectations)
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Ares training is structured, progressive, and measurable. Athletes are challenged through visual, cognitive, and reaction-based tasks that increase in complexity as they improve. The goal is not to simply make drills harder. The goal is to build a faster, cleaner, more synchronized performance system.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-[#0B0F2A] border border-[var(--color-ares-border)] rounded-xl p-6 md:p-8 hover:border-[var(--color-ares-teal)]/50 transition-colors">
                  <div className="text-[var(--color-ares-teal)] font-mono text-xl font-bold mb-4">WEEKS 1-2</div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-3">System De-Synchronization</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    We start by breaking down complex athletic movements to isolate specific visual and cognitive bottlenecks. You will experience failure as we challenge your baseline capabilities and force your visual system to adapt to new stimulus speeds.
                  </p>
                </div>
                
                <div className="bg-[#0B0F2A] border border-[var(--color-ares-border)] rounded-xl p-6 md:p-8 hover:border-[var(--color-ares-purple)]/50 transition-colors">
                  <div className="text-[var(--color-ares-purple)] font-mono text-xl font-bold mb-4">WEEKS 3-4</div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-3">Neuromuscular Integration</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Once the visual/cognitive pathways begin to fire faster, we re-introduce sport-specific motor output. We train your body to execute complex physical actions while processing dense visual information at extremely high speeds.
                  </p>
                </div>

                <div className="bg-[#0B0F2A] border border-[var(--color-ares-border)] rounded-xl p-6 md:p-8 hover:border-white/50 transition-colors">
                  <div className="text-white font-mono text-xl font-bold mb-4">WEEKS 5-6</div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-3">Pressure Consolidation</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    We overload the system physically and cognitively. The goal is to ensure your new, faster reaction speed does not collapse under game-level stress. We conclude with a full re-evaluation to measure objective millisecond gains.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Why Generic Drills Are Not Enough */}
            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Why Generic Drills Are Not Enough
              </h2>
              <p className="text-white/70 leading-relaxed mb-10">
                Most athletes do not need more random reaction drills. They need to know what is actually limiting performance. Ares starts with objective evaluation, then trains the specific skills that matter for that athlete and that sport.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  variant="primary" 
                  href="/book/training" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide"
                >
                  Book Training
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
