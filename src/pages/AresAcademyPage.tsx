import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Zap, CheckCircle2, Globe, Video, ShieldCheck, Cpu, Package, Tablet, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export function AresAcademyPage() {
  const academySchema = {
    "@context": "https://schema.org",
    "@type": "EducationalProgram",
    "name": "Ares Academy Remote & In-Office Sports Vision Training",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Ares Elite Sports Vision"
    },
    "description": "Remote tele-training sports vision program for athletes worldwide. Includes VR training applications, tablet-based A.R.E.S. Performance Suite, equipment, and tele-training sessions with an A.R.E.S. Certified Trainer.",
    "educationalProgramMode": "Blended / Remote"
  };

  return (
    <>
      <SEO 
        title="Ares Academy | Remote Sports Vision Training & Tele-Coaching"
        description="Don't live in Indiana? Train from anywhere with the Ares Academy Remote Program. Includes VR training apps, tablet-based A.R.E.S. Performance Suite, equipment & tele-training with an A.R.E.S. Certified Trainer."
        path="/ares-academy"
        schema={academySchema}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow highlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-ares-teal)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-ares-purple)]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-8 group text-xs font-mono uppercase tracking-wider">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-ares-teal)]/40 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-xs font-mono font-bold tracking-[0.2em] mb-6 uppercase shadow-[0_0_20px_rgba(41,182,246,0.15)]">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL REMOTE & IN-OFFICE PROGRAM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[0.95] mb-6 drop-shadow-2xl">
              ARES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] via-white to-[var(--color-ares-purple)]">ACADEMY</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 font-light leading-relaxed text-balance">
              Once your initial evaluation is completed, <strong className="text-white font-bold">all of your vision training does not need to be performed in-office</strong> if you do not live in Indiana. Train from anywhere in the world with full equipment, tech, and tele-training sessions included.
            </p>
          </div>

          {/* Key Highlight Banner */}
          <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)]/90 via-[#0A0B14] to-black border border-[var(--color-ares-teal)]/30 rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs font-mono font-bold text-[var(--color-ares-teal)] uppercase tracking-widest block">
                  THE REMOTE TRAINING ADVANTAGE
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase">
                  World-Class Sports Vision. Shipped Directly to You.
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
                  We empower competitive, collegiate, and professional athletes outside of Indiana to access elite visual-neurocognitive training protocols remotely. We provide all the specialized equipment, proprietary software applications, and tele-training sessions with an A.R.E.S. Certified Trainer for peak game-day execution.
                </p>
              </div>

              <div className="md:col-span-4 bg-white/5 border border-white/10 p-6 rounded-2xl text-center space-y-3 font-mono">
                <Package className="w-8 h-8 text-[var(--color-ares-teal)] mx-auto" />
                <div className="text-xs font-bold text-white uppercase">Complete Hardware & Tech Suite</div>
                <p className="text-[11px] text-white/50 leading-tight">VR Headset & Apps, Stroboscopic Glasses, & Tablet A.R.E.S. Performance Suite</p>
              </div>
            </div>
          </div>

          {/* 2 Remote Program Tier Cards */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="text-xs font-mono text-[var(--color-ares-teal)] uppercase tracking-widest font-bold">COMMITMENT TIERS</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-1">Ares Academy Remote Programs</h2>
              <p className="text-sm text-white/60 mt-2 max-w-xl mx-auto font-light">
                Choose the training intensity and tele-coaching frequency tailored to your athletic goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Tier 1: Elite Program ($499/mo) */}
              <ScrollReveal direction="up">
                <div className="h-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-teal)]/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-[var(--color-ares-teal)] transition-all shadow-[0_0_40px_rgba(41,182,246,0.15)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Zap className="w-32 h-32 text-[var(--color-ares-teal)]" />
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] border border-[var(--color-ares-teal)]/30">
                        MOST POPULAR FOR ATHLETES
                      </span>
                      <span className="text-xs font-mono text-white/50 uppercase">6-Mo Commitment</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
                      Elite Program
                    </h3>
                    <p className="text-xs text-white/60 font-light mb-6">
                      Structured remote training with complete equipment kit & monthly tele-coaching reviews.
                    </p>

                    <div className="mb-8 p-6 rounded-2xl bg-black/60 border border-white/10 text-center font-mono">
                      <div className="text-4xl sm:text-5xl font-black text-[var(--color-ares-teal)]">$499</div>
                      <div className="text-xs text-white/60 uppercase tracking-widest mt-1">/ Month · 6 Month Commitment</div>
                    </div>

                    <div className="space-y-3.5 mb-8 text-xs sm:text-sm">
                      <div className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2 font-bold">PROGRAM INCLUSIONS:</div>
                      {[
                        "Complete Home Visual-Neuro Equipment Kit Shipped Direct",
                        "Proprietary VR Training Applications & VR Headset Access",
                        "Tablet-Based A.R.E.S. Performance Suite Access",
                        "Stroboscopic Vision Training Glasses Included",
                        "Monthly Tele-Training Session with an A.R.E.S. Certified Trainer",
                        "Custom Weekly Drill Progression & Telemetry Tracking",
                        "Ideal for High School, Collegiate & Competitive Athletes"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-white/90">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-ares-teal)] shrink-0 mt-0.5" />
                          <span className="font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/book/tele-training"
                    className="w-full py-4 rounded-2xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-black text-xs uppercase tracking-wider text-center transition-all shadow-glow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>ENROLL IN ELITE PROGRAM ($499/MO)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>

              {/* Tier 2: Elite Custom Program ($1599/mo) */}
              <ScrollReveal direction="up" delay={0.15}>
                <div className="h-full bg-gradient-to-b from-[var(--color-ares-charcoal)] via-[#0A0B14] to-black border border-[var(--color-ares-purple)]/50 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-[var(--color-ares-purple)] transition-all shadow-[0_0_50px_rgba(139,92,246,0.2)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Award className="w-32 h-32 text-[var(--color-ares-purple)]" />
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--color-ares-purple)]/20 text-[var(--color-ares-purple)] border border-[var(--color-ares-purple)]/40">
                        MAXIMUM INTENSITY & PRO CARE
                      </span>
                      <span className="text-xs font-mono text-white/50 uppercase">12-Mo Commitment</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
                      Elite Custom Program
                    </h3>
                    <p className="text-xs text-white/60 font-light mb-6">
                      Weekly 1-on-1 live tele-coaching with an A.R.E.S. Certified Trainer, full hardware kit & bespoke weekly protocol adjustments.
                    </p>

                    <div className="mb-8 p-6 rounded-2xl bg-black/60 border border-white/10 text-center font-mono">
                      <div className="text-4xl sm:text-5xl font-black text-[var(--color-ares-purple)]">$1,599</div>
                      <div className="text-xs text-white/60 uppercase tracking-widest mt-1">/ Month · 12 Month Commitment</div>
                    </div>

                    <div className="space-y-3.5 mb-8 text-xs sm:text-sm">
                      <div className="font-mono text-[10px] text-[var(--color-ares-purple)] uppercase tracking-widest mb-2 font-bold">PRO-TIER INCLUSIONS:</div>
                      {[
                        "Complete Hardware Suite & Accessories Shipped to You",
                        "VR Training Applications & Custom Spatial Environments",
                        "Full Access to Tablet-Based A.R.E.S. Performance Suite",
                        "Weekly 1-on-1 Live Tele-Training with an A.R.E.S. Certified Trainer",
                        "Priority Direct Coach Access & VIP Scheduling",
                        "Custom Weekly Protocol Calibration Based on Game Schedule",
                        "Designed for Professional, Olympic & Motorsport Athletes"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-white/90">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-ares-purple)] shrink-0 mt-0.5" />
                          <span className="font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/book/tele-training"
                    className="w-full py-4 rounded-2xl bg-[var(--color-ares-purple)] hover:bg-fuchsia-600 text-white font-black text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>ENROLL IN ELITE CUSTOM ($1599/MO)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>

            </div>
          </div>

          {/* What's Shipped in Your Kit */}
          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-12 mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mb-8 border-b border-white/10 pb-4 text-center sm:text-left">
              Equipment & Tech Included in Your Remote Suite
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "VR Training Applications", desc: "Access to our custom VR software loaded with 3D spatial eye-tracking & multi-object tracking." },
                { title: "A.R.E.S. Performance Suite", desc: "Our tablet-based visual-neuro platform for tracking visual decision speed & baseline metrics." },
                { title: "Stroboscopic Glasses", desc: "Liquid crystal strobe lenses forcing faster visual intake & neural prediction." },
                { title: "A.R.E.S. Certified Trainer", desc: "Live 1-on-1 tele-training sessions to guide your drills, technique, and cognitive progressions." }
              ].map((tech, i) => (
                <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <Cpu className="w-6 h-6 text-[var(--color-ares-teal)] mb-2" />
                  <h4 className="text-white font-bold text-base uppercase">{tech.title}</h4>
                  <p className="text-xs text-white/60 font-light leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Onboarding Pathway */}
          <div className="space-y-8 mb-16">
            <div className="text-center">
              <span className="text-xs font-mono text-[var(--color-ares-teal)] uppercase tracking-widest font-bold">HOW IT WORKS</span>
              <h2 className="text-3xl font-black text-white uppercase mt-1">3 Steps to Remote Mastery</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative">
                <div className="text-4xl font-mono font-black text-[var(--color-ares-teal)] mb-4">01</div>
                <h3 className="text-lg font-bold text-white uppercase mb-2">Initial Evaluation</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Book your Sports Vision Evaluation ($449). Conducted at our Carmel, IN clinic or via our remote Tele-Assessment protocol.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative">
                <div className="text-4xl font-mono font-black text-[var(--color-ares-teal)] mb-4">02</div>
                <h3 className="text-lg font-bold text-white uppercase mb-2">Hardware Kit Shipped</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Your custom Ares Academy tech kit is assembled, pre-configured with your baseline metrics, and shipped directly to your home.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative">
                <div className="text-4xl font-mono font-black text-[var(--color-ares-teal)] mb-4">03</div>
                <h3 className="text-lg font-bold text-white uppercase mb-2">Tele-Training Begins</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Connect 1-on-1 with an A.R.E.S. Certified Trainer for tele-training sessions, telemetry tracking, and weekly drill updates.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[var(--color-ares-teal)]/20 via-black to-[var(--color-ares-purple)]/20 border border-[var(--color-ares-teal)]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-mono text-[var(--color-ares-teal)] uppercase tracking-widest font-bold block mb-1">Ready to Start?</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">Begin Your Ares Academy Journey</h3>
              <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl font-light">
                Book your initial evaluation ($449) or speak with a tele-training coordinator today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/book/evaluation"
                className="px-6 py-4 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-black text-xs uppercase tracking-wider transition-all shadow-glow text-center whitespace-nowrap cursor-pointer"
              >
                Book Evaluation ($449)
              </Link>
              <Link
                to="/book/tele-training"
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all text-center whitespace-nowrap cursor-pointer"
              >
                Book Tele-Consultation
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
