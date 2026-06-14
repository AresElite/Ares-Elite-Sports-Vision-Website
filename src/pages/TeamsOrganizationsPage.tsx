import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function TeamsOrganizationsPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Testing for Teams | Ares Elite Sports Vision"
        description="Objective Human Operating System testing and sports vision training for teams, coaches, and performance organizations."
        path="/teams-and-organizations"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Team Sports Vision Program",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Objective Human Operating System testing and sports vision training for teams, coaches, and performance organizations."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Sports Vision Testing and <br className="hidden md:block"/> Training for Teams
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed mb-12">
            Ares Elite Sports Vision helps teams and organizations measure the visual, cognitive, and reaction-speed systems athletes rely on under pressure. We provide objective testing, baseline data, and structured training pathways designed for athlete development.
          </p>

          <div className="grid gap-12">
            
            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                For Coaches and Performance Directors
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Strength, speed, and conditioning matter. But athletes also need to see, process, decide, and execute faster. Ares gives teams a way to evaluate the systems that traditional performance testing often misses.
              </p>
            </section>

            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">
                Team Program Options
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Athlete evaluations",
                  "Baseline performance testing",
                  "Sports vision training programs",
                  "Re-evaluation and progress tracking",
                  "Team reporting",
                  "Coach education",
                  "Performance data review",
                  "Custom implementation options"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[var(--color-ares-teal)] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">
                Best Fit Organizations
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 mb-10">
                <li className="flex items-center gap-2">- Youth elite programs</li>
                <li className="flex items-center gap-2">- High school teams</li>
                <li className="flex items-center gap-2">- College programs</li>
                <li className="flex items-center gap-2">- Professional teams</li>
                <li className="flex items-center gap-2">- Hockey organizations</li>
                <li className="flex items-center gap-2">- Baseball and softball organizations</li>
                <li className="flex items-center gap-2">- Racing teams</li>
                <li className="flex items-center gap-2">- Basketball programs</li>
                <li className="flex items-center gap-2">- Soccer clubs</li>
                <li className="flex items-center gap-2">- Volleyball clubs</li>
                <li className="flex items-center gap-2">- Performance facilities</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  variant="primary" 
                  href="/assessment" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14]"
                >
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  href="/book/consultation" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide border border-[var(--color-ares-purple)] text-white hover:bg-[var(--color-ares-purple)]/10"
                >
                  Request a Team Consultation
                </Button>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </>
  );
}
