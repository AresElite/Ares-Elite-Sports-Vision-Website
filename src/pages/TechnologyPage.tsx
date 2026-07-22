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
  const emrScreenshots = [
    {
      label: 'Admin Dashboard',
      badge: 'Evaluation Floor HUD',
      title: 'Real-Time Evaluation & Floor Management',
      description: 'Centralized admin control panel tracking active athlete rosters (426+ enrolled), appointment throughput, live evaluation queues, and weekly performance completion metrics.',
      src: '/images/emr/emr-admin-dashboard.jpg'
    },
    {
      label: 'Custom Training Suite',
      badge: 'Drill Builder Engine',
      title: '42+ Neuro-Vision Drill Configuration Engine',
      description: 'Custom drill builder allowing clinicians and performance coaches to filter 42+ proprietary neuro-vision drills by category, difficulty level, platform, and athlete baseline targets.',
      src: '/images/emr/emr-custom-training.png'
    },
    {
      label: 'Secure Portal Access',
      badge: 'Gated Authentication',
      title: 'Gated Client & Practitioner EMR Portal',
      description: 'Role-based authentication login screen securing medical-grade evaluation data, baseline tracking histories, and personalized athlete training portals.',
      src: '/images/emr/emr-login.png'
    }
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
            <section className="bg-gradient-to-br from-[var(--color-ares-charcoal)] via-[#0A0B14] to-black border border-[var(--color-ares-teal)]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(41,182,246,0.1)]">
              <div className="flex flex-col gap-8">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--color-ares-teal)] block mb-2">
                    PROPRIETARY SOFTWARE STACK EXCLUSIVE
                  </span>
                  <h2 className="text-2xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
                    The A.R.E.S. Custom EMR Architecture
                  </h2>
                  <p className="text-white/70 leading-relaxed text-base sm:text-lg mt-4 max-w-3xl">
                    Built ground-up specifically for high-performance sports vision and neuro-cognitive athletic development. Below are live interface captures from the active A.R.E.S. clinical platform.
                  </p>
                </div>

                {/* Tabbed Navigation */}
                <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4">
                  {emrScreenshots.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx as any)}
                      className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === idx 
                          ? 'bg-[var(--color-ares-teal)] text-[#0A0B14] shadow-lg shadow-[var(--color-ares-teal)]/20' 
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${activeTab === idx ? 'bg-[#0A0B14]' : 'bg-[var(--color-ares-teal)]'}`}></span>
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Screenshot Display Console */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Metadata & Explanation */}
                  <div className="lg:col-span-4 flex flex-col justify-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-ares-purple)]/20 border border-[var(--color-ares-purple)]/40 text-[var(--color-ares-purple)] text-[10px] font-mono font-bold uppercase tracking-widest mb-4 w-fit">
                      {emrScreenshots[activeTab].badge}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      {emrScreenshots[activeTab].title}
                    </h3>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                      {emrScreenshots[activeTab].description}
                    </p>
                  </div>

                  {/* Right High-Res Laptop Preview Frame */}
                  <div className="lg:col-span-8 relative">
                    <div className="w-full bg-[#161722] rounded-2xl border border-white/10 p-2 sm:p-3 shadow-2xl overflow-hidden group">
                      {/* Window Controls Header */}
                      <div className="bg-[#0D0E15] px-4 py-3 rounded-t-xl flex justify-between items-center border-b border-white/5 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="text-[10px] font-mono text-[var(--color-ares-teal)] tracking-widest uppercase font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] animate-pulse"></span>
                          ARES-EMR-LIVE-CONSOLE :: {emrScreenshots[activeTab].label}
                        </div>
                        <div className="w-10"></div>
                      </div>

                      {/* Image Frame */}
                      <div className="relative rounded-xl overflow-hidden bg-black aspect-[16/9] flex items-center justify-center border border-white/5">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={activeTab}
                            src={emrScreenshots[activeTab].src}
                            alt={emrScreenshots[activeTab].title}
                            initial={{ opacity: 0, scale: 0.98 }}
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

            {/* Performance Suite Gallery */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--color-ares-purple)] block mb-2">
                    PROPRIETARY NEURO-VISION SUITE
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">
                    The A.R.E.S. Performance Suite
                  </h2>
                </div>
                <div className="text-xs font-mono text-[var(--color-ares-teal)] bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 px-3 py-1.5 rounded-full w-fit">
                  25 Proprietary Modules Enabled
                </div>
              </div>

              <p className="text-white/70 leading-relaxed mb-10 max-w-3xl text-base sm:text-lg">
                The A.R.E.S. Performance Suite is our core neuro-cognitive software system. Designed specifically for sports vision specialists, athletic trainers, and performance coaches, it delivers 25+ specialized visual capture, decision velocity, and spatial tracking drills.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    src: '/images/performance-suite/performance-suite-modules.png', 
                    title: '25-Module Neuro-Vision Grid', 
                    desc: 'Full suite array featuring Choice Reaction, Cognitive Crossfire, Dual Stream Sync, Eye-Hand Coordination, Flanker, Focus Frenzy, Go/No-Go, MOT Dual Task, Neural Phase Lock, and Occlusion Horizon.' 
                  },
                  { 
                    src: '/images/performance-suite/cognitive-crossfire-protocol.png', 
                    title: 'Drill Protocol & Parametric Controls', 
                    desc: 'Tactical protocol configuration engine with neural tier scaling (1–315), strobe mode integration, weighted hands, cardio load modifiers, and central task controls.' 
                  },
                  { 
                    src: '/images/performance-suite/mot-level-35-trial.png', 
                    title: 'Multiple Object Tracking Arena', 
                    desc: 'Real-time multi-target tracking arena running physics-based elastic collision bounce technology with custom target colors and latency/accuracy scoring.' 
                  }
                ].map((item, i) => (
                  <div key={i} className="group bg-[var(--color-ares-bg)] rounded-xl border border-white/5 overflow-hidden hover:border-[var(--color-ares-purple)] transition-all flex flex-col">
                    <div className="relative overflow-hidden aspect-[16/10] bg-black flex items-center justify-center">
                      <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-mono tracking-widest text-[var(--color-ares-purple)] uppercase border border-[var(--color-ares-purple)]/30">
                        Suite Module 0{i + 1}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[var(--color-ares-purple)] transition-colors">{item.title}</h4>
                        <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
                      </div>
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
