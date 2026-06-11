import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Calendar, Mic, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function SpeakingPage() {
  return (
    <>
      <SEO 
        title="Dr. Joe LaPlaca Speaking & Keynotes | Ares Elite"
        description="Book Dr. Joe LaPlaca for keynotes, panels, and workshops. Learn the science of human decision speed, sensory processing, and neurocognitive performance."
        path="/speaking"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Dr. Joe LaPlaca Speaking & Keynotes",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Speaking engagements, panel discussions, and corporate performance workshops by Dr. Joe LaPlaca."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Education & Keynotes
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            The science of <br className="hidden md:block"/> decision speed.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12">
            Book Dr. Joe LaPlaca for keynotes, workshops, and performance panels.
          </p>

          <div className="grid gap-12">
            
            {/* Dr. LaPlaca Profile */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Mic className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                About the Speaker
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                Dr. Joe LaPlaca is a leading expert in neurocognitive sports training, sports vision, and human performance metrics. As the founder of Ares Elite Sports Vision, he has designed and integrated performance training programs for professional drivers (IndyCar, NASCAR), elite collegiate programs, and high-G environment professionals.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10">
                Dr. LaPlaca translates complex neuroscience and visual-cognitive research into actionable, high-performance strategies that athletes, coaches, and corporate leaders can implement immediately.
              </p>
            </section>

            {/* Speaking Topics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <BookOpen className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Milliseconds Decide</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  How sensory latency, Choice Reaction Time (CRT), and brain routing speed determine success in sports and high-risk environments.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Users className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Executive Functions</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Applying sports cognitive training methods (focus, stress management, situational awareness) to corporate leadership and decision performance.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Calendar className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Interactive Workshops</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Hands-on sessions utilizing strobe technology, peripheral tracking, and neuro-motor coordination tools to experience sensory fatigue first-hand.
                </p>
              </div>
            </section>

            {/* Speaking Experience */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                Audience Engagements
              </h2>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Sports Science & Performance Conferences</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Coaching & Athletic Director Seminars</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Corporate Leadership & Performance Retreats</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[var(--color-ares-teal)] rounded-full shrink-0"></span>Optometric & Neurological Forums</li>
              </ul>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                Secure Speaking Availability
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Submit an inquiry with your event dates, audience profile, and proposed location to request Dr. LaPlaca's availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Request Speaking Availability
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
