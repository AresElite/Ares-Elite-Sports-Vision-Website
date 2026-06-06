import { SEO } from '../components/SEO';
import { ArrowLeft, Eye, Activity, Brain, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function AresPerformanceSystemPage() {
  return (
    <>
      <SEO 
        title="A.R.E.S. Performance System | Acquire Route Execute Synchronize"
        description="Learn how Ares Elite Sports Vision evaluates and trains athlete performance through Acquire, Route, Execute, and Synchronize."
        path="/ares-performance-system"
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            The A.R.E.S. Performance System
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed mb-16 max-w-3xl">
            The A.R.E.S. Performance System is the framework Ares Elite Sports Vision uses to evaluate and train the full performance loop athletes depend on during competition: Acquire, Route, Execute, and Synchronize.
          </p>

          <div className="grid gap-8 mb-16">
            
            {/* Phase 1: Acquire */}
            <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Eye className="w-32 h-32 text-white" />
              </div>
              <div className="text-[var(--color-ares-teal)] font-mono text-sm tracking-widest mb-4">PHASE 01</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Acquire</h2>
              <p className="text-white/70 leading-relaxed max-w-2xl relative z-10">
                Acquire is how the athlete’s eyes collect usable visual information. This includes clarity, tracking, depth perception, peripheral awareness, contrast, and the ability to detect relevant information quickly.
              </p>
            </div>

            {/* Phase 2: Route */}
            <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Brain className="w-32 h-32 text-white" />
              </div>
              <div className="text-[var(--color-ares-teal)] font-mono text-sm tracking-widest mb-4">PHASE 02</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Route</h2>
              <p className="text-white/70 leading-relaxed max-w-2xl relative z-10">
                Route is how the brain processes, filters, prioritizes, and interprets visual information. This includes visual processing speed, attention, decision selection, and the ability to ignore irrelevant information.
              </p>
            </div>

            {/* Phase 3: Execute */}
            <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity className="w-32 h-32 text-white" />
              </div>
              <div className="text-[var(--color-ares-teal)] font-mono text-sm tracking-widest mb-4">PHASE 03</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Execute</h2>
              <p className="text-white/70 leading-relaxed max-w-2xl relative z-10">
                Execute is how the athlete turns perception and decision-making into action. This includes reaction time, choice reaction time, eye-hand coordination, motor response, and response accuracy.
              </p>
            </div>

            {/* Phase 4: Synchronize */}
            <div className="bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="w-32 h-32 text-[var(--color-ares-teal)]" />
              </div>
              <div className="text-[var(--color-ares-teal)] font-mono text-sm tracking-widest mb-4 font-bold">PHASE 04</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Synchronize</h2>
              <p className="text-white/90 leading-relaxed max-w-2xl relative z-10 font-medium">
                Synchronize is how the full system performs under real-world sport demands: speed, pressure, fatigue, uncertainty, distraction, and time constraint.
              </p>
            </div>

          </div>

          <section className="mb-12">
             <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
              Why This Framework Matters
            </h2>
            <p className="text-white/70 leading-relaxed mb-10 text-lg">
              Athletic performance is not just what the eyes see or how fast the body moves. It is how quickly and accurately the entire system works together. A.R.E.S. gives coaches, athletes, and performance professionals a clearer way to understand and train that system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button 
                variant="primary" 
                href="/book/evaluation" 
                className="w-full sm:w-auto text-center justify-center font-bold tracking-wide"
              >
                Book a Sports Vision Performance Evaluation
              </Button>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
