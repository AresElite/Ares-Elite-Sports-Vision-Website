import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Monitor, Database, BarChart2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { VideoEmbed } from '../components/ui/VideoEmbed';

export function TechnologyPage() {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const emrImages = [
    '/EMR Screenshot 1.jpeg',
    '/EMR Screenshot 2.jpeg',
    '/EMR Screenshot 3.jpeg'
  ];

  return (
    <>
      <SEO 
        title="Sports Vision Technology & Performance Data | Ares Elite"
        description="The sensory analytics dashboard. Explore custom EMR tracking, the AQ™ (Ares Quotient) Score, and advanced neurocognitive training hardware."
        path="/technology-and-data"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sports Vision Technology & Performance Data",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Ares Elite Sports Vision"
          },
          "description": "Sensory tracking analytics, custom EMR, and advanced neurocognitive sports vision training hardware."
        }}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Data Stack & Hardware
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
            The sensory <br className="hidden md:block"/> analytics dashboard.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12">
            Custom EMR, cognitive testing suites, and data tracking.
          </p>

          <div className="grid gap-12">
            
            {/* The Tech Overview */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Monitor className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Objective Performance Architecture
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                Performance training should not rely on subjective guesswork. Ares utilizes a premium hardware and software stack to measure sensory latency down to the millisecond. By tracking eyes, brain, and body under dynamic load, we compile a data-driven blueprint of your performance.
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10 font-bold">
                Every metric is centralized in our custom EMR portal, allowing athletes and coaches to analyze progress, isolate bottlenecks, and adjust training programs in real-time.
              </p>
            </section>

            {/* Tech Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Database className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Custom EMR Logging</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Track progress over weeks and months. Your evaluation metrics, baseline charts, and training progression histories are logged securely in our proprietary cloud portal.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <BarChart2 className="w-10 h-10 text-[var(--color-ares-teal)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">AQ™ Quotient Scores</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  The Ares Quotient (AQ™) is a weighted score indicating your system's processing efficiency across visual capture, cognitive routing, motor execution, and coordination synchronization.
                </p>
              </div>

              <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl p-8 flex flex-col">
                <Shield className="w-10 h-10 text-[var(--color-ares-purple)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Hardware Stack</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We integrate virtual reality target captures, strobe occlusion lenses, high-speed eye tracking systems, and spatial target boards to isolate sensory bottlenecks.
                </p>
              </div>
            </section>

            {/* EMR Showcase Row */}
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] to-transparent border border-white/5 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                    Data-Driven Upgrades
                  </h2>
                  <p className="text-white/70 leading-relaxed mb-6 text-base sm:text-lg">
                    Our custom EMR gives coaches, trainers, and athletes an instant visual report of sensory performance. No spreadsheets or vague summaries. You get clean charts illustrating exactly how your Choice Reaction Time is dropping and how your tracking accuracy is climbing.
                  </p>
                  <p className="text-white/70 leading-relaxed font-bold text-base sm:text-lg mb-8">
                    This is the standard of performance analytics that elite collegiate programs and professional motorsports rosters demand.
                  </p>
                </div>
                <div className="relative flex justify-center">
                  <div className="w-full max-w-lg bg-[#1a1b23] rounded-[2rem] border-[4px] border-[#2b2b36] p-2 sm:p-3 shadow-2xl relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {/* Camera Notch/Bezel detail */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#000] rounded-full mt-3"></div>
                    
                    {/* Inner Screen */}
                    <div className="w-full bg-[var(--color-ares-charcoal)] rounded-[1.2rem] border border-black/50 overflow-hidden relative flex flex-col">
                      {/* Fake App Header */}
                      <div className="bg-[var(--color-ares-bg)] px-6 py-4 flex justify-between items-center border-b border-[var(--color-ares-border)]">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-500"></div>
                           <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                           <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase">A.R.E.S. EMR Portal</div>
                        <div className="w-8"></div>
                      </div>

                      {/* Tabbed Selectors */}
                      <div className="bg-[#0e111a] px-4 py-3 flex justify-center gap-2 border-b border-[var(--color-ares-border)]">
                        {['Overview', 'Acquisition Stats', 'Cognitive Load'].map((label, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTab(idx as any)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase transition-all ${
                              activeTab === idx 
                                ? 'bg-[var(--color-ares-teal)] text-black shadow-lg shadow-[var(--color-ares-teal)]/20' 
                                : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Dashboard Image Viewport */}
                      <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={activeTab}
                            src={emrImages[activeTab]}
                            alt={`A.R.E.S. EMR Screenshot ${activeTab + 1}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover object-top"
                          />
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics Video Row */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <ScrollReveal direction="left" distance={30} speed={0.8}>
                  <div>
                    <h3 className="text-[var(--color-ares-teal)] font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4">Analytics & EMR Platform</h3>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">OBJECTIVE DATA. NOT GUESSWORK.</h2>
                    <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6">
                      If something affects performance, it should be measured, tracked, and communicated clearly. We built a custom EMR and tracking platform because athletes deserve more than opinions and vague notes. We measure what most programs miss. We track what others guess.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" distance={30} speed={0.8}>
                  <div className="mx-auto w-full max-w-2xl lg:max-w-none">
                    <VideoEmbed 
                      src="https://www.youtube.com/embed/qdEmN0iYLq4?si=r7kK-W1VnQe5L7P1" 
                      title="Importance of Analytics and Tracking Information for Athletes" 
                    />
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* Performance Suite Hardware Gallery */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 uppercase">
                The A.R.E.S. Performance Suite
              </h2>
              <p className="text-white/70 leading-relaxed mb-10 max-w-3xl text-base sm:text-lg">
                Training sensory processing requires specialized equipment. Our facility features virtual reality spatial trackers, high-speed eye tracking cameras, strobe occlusion optics, and multi-target spatial coordination boards designed to stress-test your visual routing system.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { src: '/A.R.E.S. Performance Suite 1.jpeg', title: 'VR Target Capture', desc: 'Isolating dynamic peripheral targets under fatigue.' },
                  { src: '/A.R.E.S. Performance Suite 2.jpeg', title: 'Strobe Occlusion Optics', desc: 'Slowing visual frame rates to force cognitive prediction.' },
                  { src: '/A.R.E.S. Performance Suite 3.jpeg', title: 'Spatial Target Boards', desc: 'Decomposing eye-to-hand reaction latency.' }
                ].map((item, i) => (
                  <div key={i} className="group bg-[var(--color-ares-bg)] rounded-xl border border-white/5 overflow-hidden hover:border-[var(--color-ares-purple)] transition-all flex flex-col">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-mono tracking-widest text-[var(--color-ares-purple)] uppercase border border-[var(--color-ares-purple)]/30">
                        Suite 0{i + 1}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[var(--color-ares-purple)] transition-colors">{item.title}</h4>
                      <p className="text-xs text-white/50 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase">
                See the System in Action
              </h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                Request a platform demo to explore our EMR dashboard, check custom telemetry integration capabilities, or speak to our data coordinator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                >
                  Request Platform Demo
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
