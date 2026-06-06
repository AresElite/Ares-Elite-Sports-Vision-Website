import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function AresAcademyPage() {
  return (
    <>
      <SEO 
        title="Ares Academy | Sports Vision Training for Athletes"
        description="Ares Academy provides structured sports vision training for athletes focused on reaction time, decision speed, visual processing, and eye-hand coordination."
        path="/ares-academy"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Ares Academy",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Structured sports vision training for athletes focused on reaction time, decision speed, visual processing, and eye-hand coordination."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Ares Academy
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed mb-12">
            Ares Academy is structured sports vision training for athletes who want to improve the visual and cognitive skills that drive performance under pressure.
          </p>

          <div className="grid gap-12">
            
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">
                What Ares Academy Trains
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Reaction time",
                  "Choice reaction time",
                  "Decision speed",
                  "Visual processing",
                  "Eye-hand coordination",
                  "Peripheral awareness",
                  "Go/no-go control",
                  "Cognitive flexibility",
                  "Sport-specific visual demands"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[var(--color-ares-teal)] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Who It Is For
              </h2>
              <p className="text-white/70 leading-relaxed mb-10">
                Ares Academy is for athletes who have completed or are ready to complete a Sports Vision Performance Evaluation and want a structured training pathway instead of random drills.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  variant="primary" 
                  href="/book/evaluation" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide"
                >
                  Start With an Evaluation
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
