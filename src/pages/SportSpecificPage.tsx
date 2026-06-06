import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Crosshair, Target, Activity } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Utility to format sport name
const formatSportName = (id: string) => {
  const mapping: Record<string, string> = {
    'hockey-vision-training': 'Hockey',
    'baseball-vision-training': 'Baseball and Softball',
    'racing-vision-training': 'Racing',
    'basketball-vision-training': 'Basketball',
    'soccer-vision-training': 'Soccer',
    'football-vision-training': 'Football',
    'volleyball-vision-training': 'Volleyball',
  };
  return mapping[id] || id.split('-')[0].charAt(0).toUpperCase() + id.split('-')[0].slice(1);
};

export function SportSpecificPage() {
  const { sport } = useParams<{ sport: string }>();
  const sportName = formatSportName(sport || '');

  return (
    <>
      <SEO 
        title={`Vision Training for ${sportName} Players | Ares Elite Sports Vision`}
        description={`${sportName} requires athletes to process fast-changing visual information, make rapid decisions, and execute accurately under pressure. Ares evaluates and trains the visual, cognitive, and reaction-speed skills that matter most.`}
        path={`/sports/${sport}`}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/sports" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Sports
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Vision Training for <br className="hidden md:block"/> {sportName} Players
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed mb-12">
            {sportName} requires athletes to process fast-changing visual information, make rapid decisions, and execute accurately under pressure. Ares evaluates and trains the visual, cognitive, and reaction-speed skills that matter most for {sportName?.toLowerCase()} performance.
          </p>

          <div className="grid gap-12">
            
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Crosshair className="w-5 h-5 text-[var(--color-ares-teal)]" />
                    Visual Demands
                  </h3>
                  <ul className="space-y-4 text-white/70">
                    <li>Dynamic tracking and anticipation</li>
                    <li>Extreme peripheral awareness</li>
                    <li>Fast depth judgment</li>
                    <li>Visual processing under fatigue</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[var(--color-ares-purple)]" />
                    Common Bottlenecks
                  </h3>
                  <ul className="space-y-4 text-white/70">
                    <li>Late reaction to fast-moving targets</li>
                    <li>Over-focusing (tunnel vision)</li>
                    <li>Slow choice decision making</li>
                    <li>Executing incorrectly under pressure</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                What Ares Measures
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                We use objective tools to evaluate your unique Human Operating System profile. By measuring how quickly you acquire information, route decisions, and execute coordination sequences, we identify the exact milliseconds that can be improved.
              </p>
            </section>

            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                How Training Helps
              </h2>
              <p className="text-white/70 leading-relaxed mb-10">
                Ares Academy and our in-person training pathways don't just provide generic drills. We structure training progressions tailored specifically to strengthen your weaknesses and maximize your sport-specific skills. Results are tracked so you can see your performance synchronize.
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
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
