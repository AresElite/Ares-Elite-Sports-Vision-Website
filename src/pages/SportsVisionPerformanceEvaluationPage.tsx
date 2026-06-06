import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Target, Brain, Activity, Clock, Crosshair, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function SportsVisionPerformanceEvaluationPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Performance Evaluation | Ares Elite Sports Vision"
        description="Measure reaction time, decision speed, visual processing, eye-hand coordination, and performance vision with a sports vision evaluation."
        path="/sports-vision-performance-evaluation"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision Performance Evaluation",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Measure reaction time, decision speed, visual processing, eye-hand coordination, and performance vision with a sports vision evaluation.",
          "areaServed": ["Carmel", "Indianapolis", "Indiana"]
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Sports Vision Performance <br className="hidden md:block"/> Evaluation for Athletes
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed mb-12">
            A Sports Vision Performance Evaluation at Ares Elite Sports Vision is not a standard eye exam. It is a performance assessment designed to measure how an athlete’s eyes, brain, and body work together under sport-specific demands.
          </p>

          <div className="grid gap-12">
            
            {/* Section: What it measures */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">
                What the Evaluation Measures
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  "Visual clarity",
                  "Eye teaming",
                  "Eye alignment",
                  "Depth perception",
                  "Tracking",
                  "Peripheral awareness",
                  "Visual processing speed",
                  "Raw reaction time",
                  "Choice reaction time",
                  "Decision speed",
                  "Eye-hand coordination",
                  "Cognitive control",
                  "Performance under load"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-[var(--color-ares-teal)] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Why it matters */}
            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Why It Matters
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Athletes do not lose milliseconds in one place. They lose them across the system: seeing late, processing slowly, choosing incorrectly, reacting inefficiently, or failing to synchronize the eyes, brain, and body under pressure. The evaluation helps identify where the bottleneck is.
              </p>
            </section>

            {/* Section: Who it's for */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">
                Who It Is For
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/70">
                <li className="flex items-center gap-2">- Serious youth athletes</li>
                <li className="flex items-center gap-2">- High school athletes</li>
                <li className="flex items-center gap-2">- College athletes</li>
                <li className="flex items-center gap-2">- Professional athletes</li>
                <li className="flex items-center gap-2">- Hockey players</li>
                <li className="flex items-center gap-2">- Baseball and softball players</li>
                <li className="flex items-center gap-2">- Basketball players</li>
                <li className="flex items-center gap-2">- Soccer players</li>
                <li className="flex items-center gap-2">- Football players</li>
                <li className="flex items-center gap-2">- Volleyball players</li>
                <li className="flex items-center gap-2">- Racing drivers</li>
                <li className="flex items-center gap-2">- Athletes recovering from concussion concerns</li>
                <li className="flex items-center gap-2 sm:col-span-2">- Athletes who rely on reaction time, tracking, anticipation, and decision-making</li>
              </ul>
            </section>

            {/* Section: What happens after */}
            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                What Happens After the Evaluation
              </h2>
              <p className="text-white/70 leading-relaxed mb-10">
                After the evaluation, athletes receive a clearer picture of their visual and cognitive performance profile. If training is recommended, Ares builds a structured plan designed around the athlete’s measured needs, sport demands, and performance goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  variant="primary" 
                  href="/book/evaluation" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide"
                >
                  Book a Sports Vision Performance Evaluation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link to="/sports-vision-training" className="text-white/60 hover:text-white transition-colors text-sm font-medium px-4">
                  Learn about training &rarr;
                </Link>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
