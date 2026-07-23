import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Package, CheckCircle2, ArrowRight, Video, Zap, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export function AresAcademySection() {
  return (
    <section className="py-20 sm:py-28 bg-[#0A0B14] relative overflow-hidden border-t border-[var(--color-ares-border)]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--color-ares-teal)]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[var(--color-ares-purple)]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)]/90 via-[#0A0B14] to-black border border-[var(--color-ares-teal)]/30 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-[0_0_80px_rgba(41,182,246,0.15)] relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Information & Value Proposition */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-ares-teal)]/40 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-xs font-mono font-bold tracking-[0.2em] uppercase">
                  <Globe className="w-4 h-4" />
                  <span>DON'T LIVE IN INDIANA? TRAIN REMOTELY</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                  ARES ACADEMY <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] via-white to-[var(--color-ares-purple)]">
                    REMOTE TELE-TRAINING
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed">
                  Once your initial evaluation is completed, <strong className="text-white font-bold">all of your training does not need to be performed in-office</strong>. Through the Ares Academy Program, we provide all the specialized equipment, technology licenses, and tele-training sessions required for peak performance from anywhere in the world.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[var(--color-ares-teal)] uppercase">Elite Program</span>
                      <span className="text-[10px] font-mono text-white/50 uppercase">6-Mo Commit</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">$499 <span className="text-xs font-normal text-white/60">/mo</span></div>
                    <p className="text-[11px] text-white/60 font-light">Equipment kit shipped + monthly tele-coaching session included.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-[var(--color-ares-purple)]/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[var(--color-ares-purple)] uppercase">Elite Custom</span>
                      <span className="text-[10px] font-mono text-white/50 uppercase">12-Mo Commit</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">$1,599 <span className="text-xs font-normal text-white/60">/mo</span></div>
                    <p className="text-[11px] text-white/60 font-light">Pro hardware kit + weekly 1-on-1 live tele-training supervision.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    to="/ares-academy"
                    className="py-4 px-8 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-black text-xs uppercase tracking-wider transition-all shadow-glow text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>EXPLORE ARES ACADEMY</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/book/tele-training"
                    className="py-4 px-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>BOOK TELE-CONSULTATION</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hardware & Program Features */}
              <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <Package className="w-6 h-6 text-[var(--color-ares-teal)]" />
                  <div>
                    <h4 className="text-base font-bold text-white uppercase">Full Equipment Suite Shipped</h4>
                    <span className="text-[10px] font-mono text-white/50 uppercase">Included in All Academy Tiers</span>
                  </div>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm">
                  {[
                    "VR Headset & Pre-Loaded 3D Spatial Software",
                    "Stroboscopic Glasses & Visual Intake Optics",
                    "FitLight & Reactive Light Stimulus Pods",
                    "Senaptec Vision Software License",
                    "Telemetry EMR Portal Progress Tracking",
                    "Tele-Training Sessions with Dr. LaPlaca"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-ares-teal)] shrink-0" />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-2xl bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 text-center">
                  <span className="text-[10px] font-mono text-[var(--color-ares-teal)] uppercase tracking-widest block font-bold">
                    STEP 1: INITIAL EVALUATION ($449)
                  </span>
                  <span className="text-xs text-white/80 mt-0.5 block font-light">
                    In-Office at Carmel Clinic or Remote Tele-Evaluation
                  </span>
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
