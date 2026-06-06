import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SPORTS = [
  { id: 'hockey-vision-training', name: 'Hockey', desc: 'Tracking ultra-fast pucks, peripheral awareness in traffic, and split-second decision-making.' },
  { id: 'baseball-vision-training', name: 'Baseball / Softball', desc: 'Pitch recognition, contrast sensitivity, and extreme choice reaction time.' },
  { id: 'racing-vision-training', name: 'Racing', desc: 'High-speed visual processing, gaze control, and sustained performance under load.' },
  { id: 'basketball-vision-training', name: 'Basketball', desc: 'Multi-object tracking, spatial awareness, and quick-trigger execution.' },
  { id: 'soccer-vision-training', name: 'Soccer', desc: 'Field vision, anticipation, and fast, accurate foot coordination under pressure.' },
  { id: 'football-vision-training', name: 'Football', desc: 'Pre-snap processing, route anticipation, and dynamic depth tracking.' },
  { id: 'volleyball-vision-training', name: 'Volleyball', desc: 'High-contrast trajectory tracking, depth perception, and explosive reaction speed.' }
];

export function SportsHubPage() {
  return (
    <>
      <SEO 
        title="Sports Vision Training by Sport | Ares Elite Sports Vision"
        description="Explore sports vision training for hockey, baseball, racing, basketball, soccer, football, volleyball, and other high-speed sports."
        path="/sports"
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight">
              Sports Vision Training <br className="hidden md:block"/> by Sport
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--color-ares-muted)] leading-relaxed">
              Every sport places different demands on the visual and cognitive system. Ares evaluates and trains the skills athletes need for their specific environment, including tracking, reaction time, peripheral awareness, anticipation, decision speed, and eye-hand coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPORTS.map((sport) => (
              <Link 
                key={sport.id} 
                to={`/sports/${sport.id}`}
                className="group bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 hover:border-[var(--color-ares-teal)] transition-all flex flex-col h-full"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{sport.name}</h3>
                <p className="text-sm text-white/70 leading-relaxed flex-grow mb-8 line-clamp-3">
                  {sport.desc}
                </p>
                <div className="text-[var(--color-ares-teal)] text-sm font-bold flex items-center mt-auto uppercase tracking-wide">
                  View Program <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
