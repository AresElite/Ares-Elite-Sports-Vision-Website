import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function ConcussionBaselinePage() {
  return (
    <>
      <SEO 
        title="Concussion Baseline Vision Testing for Athletes | Ares"
        description="Ares provides visual and neurocognitive baseline testing to help track athlete performance before and after concussion concerns."
        path="/concussion-baseline-testing"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Concussion Baseline Vision Testing",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Visual and neurocognitive baseline testing to help track athlete performance before and after concussion concerns."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Concussion Baseline Vision <br className="hidden md:block"/> Testing for Athletes
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed mb-6">
            Ares provides visual and neurocognitive baseline testing to help athletes, families, and support teams better understand performance before and after concussion concerns. Because vision, reaction time, eye movement, and processing speed can be affected after head impacts, baseline data can provide useful context when monitoring athlete performance.
          </p>

          <div className="bg-white/5 border border-[var(--color-ares-teal)]/30 rounded-xl p-6 mb-12 flex items-start gap-4">
            <Activity className="w-6 h-6 text-[var(--color-ares-teal)] flex-shrink-0 mt-1" />
            <p className="text-sm text-white/80 leading-relaxed">
              <strong>Notice:</strong> Ares Elite Sports Vision does not diagnose concussions or clear athletes for return-to-play. Our baseline testing provides objective data on visual function and neurocognitive performance to support the athlete's broader care team.
            </p>
          </div>

          <div className="grid gap-12">
            
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">
                What We Track
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Visual clarity",
                  "Eye teaming",
                  "Eye movement",
                  "Tracking",
                  "Depth perception",
                  "Visual processing speed",
                  "Reaction time",
                  "Choice reaction time",
                  "Eye-hand coordination",
                  "Cognitive response control"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-ares-teal)] flex-shrink-0 mt-2" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  variant="primary" 
                  href="/book/evaluation" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide"
                >
                  Schedule a Baseline Evaluation
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
