import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, ShieldCheck, Target, PlayCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';

export function CertificationPage() {
  return (
    <>
      <SEO 
        title="A.R.E.S. Certification | Sports Vision Performance Training"
        description="The A.R.E.S. Certification equips optometrists and performance staff with the blueprint to transform athletic performance."
        path="/certification"
      />
      <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-ares-purple)]/5 transform skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-[var(--color-ares-teal)]/5 transform -skew-x-12 -translate-x-1/4" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 text-[var(--color-ares-teal)] text-xs font-bold tracking-wider mb-6 border border-[var(--color-ares-teal)]/30">
                A.R.E.S. ACCREDITATION
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                CERTIFICATION LEVELS
              </h1>
              <div className="text-xl text-white/80 leading-relaxed space-y-6">
                <p>
                  Your patients and athletes are looking for an edge, and traditional optometry or coaching isn't enough to get them there. You want to be the go-to expert they trust to unlock their ultimate potential.
                </p>
                <p>
                  The A.R.E.S. Certification equips you with the exact blueprint to transform your clients' performance and elevate your practice above the competition. We guide you step-by-step through our proven system, turning you into the undisputed authority in neuro-cognitive sports vision.
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <motion.img 
                src="/A.R.E.S. Certification Badge.png" 
                alt="A.R.E.S. Certification Badge" 
                className="w-48 sm:w-64 h-auto object-contain drop-shadow-[0_0_35px_rgba(41,182,246,0.15)]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="space-y-8 mb-16">
            {/* Level 1 */}
            <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)]/90 to-amber-900/20 backdrop-blur-sm border border-amber-700/30 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(217,119,6,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/10 rounded-bl-full -z-10 blur-2xl" />
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-[0_0_15px_rgba(217,119,6,0.2)]">
                  <ShieldCheck className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-4 mb-2">
                    <h2 className="text-3xl font-bold text-white">Level 1 <span className="text-amber-500 text-lg font-medium ml-2">| Bronze</span></h2>
                    <span className="text-amber-400 font-mono text-lg">$5,000</span>
                  </div>
                  <h3 className="text-lg text-amber-500/80 font-medium mb-4 uppercase tracking-wider">For Performance Staff & Coaches</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Built for athletic trainers, performance coaches, and team staff ready to integrate the A.R.E.S. framework directly into their organization's daily operations.
                  </p>
                  <p className="text-white/80 leading-relaxed mb-4">
                    <strong>Value Proposition:</strong> Transform your athletes' reaction times and decision-making speed. This immersive <strong>2-day intensive</strong>, led personally by Dr. LaPlaca, goes beyond basic protocols. You will dissect the underlying neuroscience, master our cutting-edge technology, and gain the hands-on expertise required to run this complex system flawlessly on the floor. Stop guessing and start measuring neuro-cognitive performance.
                  </p>
                  <div className="mt-8">
                    <Button variant="primary" href="https://arescertification.com/">
                      Apply for Level 1 CPVT Certification
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 2 */}
            <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)]/90 to-slate-600/20 backdrop-blur-sm border border-slate-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(148,163,184,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-400/10 rounded-bl-full -z-10 blur-2xl" />
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-16 w-16 rounded-2xl bg-slate-400/10 flex items-center justify-center shrink-0 border border-slate-400/30 shadow-[0_0_15px_rgba(148,163,184,0.2)]">
                  <Target className="h-8 w-8 text-slate-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-4 mb-2">
                    <h2 className="text-3xl font-bold text-white">Level 2 <span className="text-slate-300 text-lg font-medium ml-2">| Silver</span></h2>
                    <span className="text-slate-300 font-mono text-lg">$7,500</span>
                  </div>
                  <h3 className="text-lg text-slate-400 font-medium mb-4 uppercase tracking-wider">For Optometrists</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Designed for optometrists ready to make elite sports vision the cornerstone of their practice and dominate their local market.
                  </p>
                  <p className="text-white/80 leading-relaxed mb-4">
                    <strong>Value Proposition:</strong> Turn your practice into a high-performance destination. This comprehensive <strong>3-day intensive</strong>, led personally by Dr. LaPlaca, provides the clinical and operational blueprint to deploy the A.R.E.S. system as a highly profitable standalone facility or primary practice pillar. You'll receive the exact frameworks we use to attract and train elite athletes.
                  </p>
                  <div className="p-5 rounded-xl bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/20 mb-4">
                    <p className="text-white/90 leading-relaxed text-sm">
                      <strong>The A.R.E.S. Standard:</strong> We demand total commitment. To qualify for Level 2, sports vision must represent at least 50% of your practice. We do not partner with practitioners treating this as a "side hustle." Elite athletes demand practitioners who live and breathe their world—to succeed with A.R.E.S., you must be all in.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Button variant="primary" href="https://arescertification.com/">
                      Apply for Level 2 Provider Certification
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 3 */}
            <div className="bg-gradient-to-br from-[var(--color-ares-charcoal)]/90 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/40 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(234,179,8,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-bl-full -z-10 blur-2xl" />
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-16 w-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-4 mb-2">
                    <h2 className="text-3xl font-bold text-white">Level 3 <span className="text-yellow-400 text-lg font-medium ml-2">| Gold Mastery</span></h2>
                  </div>
                  <h3 className="text-lg text-yellow-500/90 font-medium mb-4 uppercase tracking-wider">Exclusive Mastery Level</h3>
                  <p className="text-white/90 leading-relaxed mb-4">
                    The absolute pinnacle of neuro-performance accreditation. Level 3 is an exclusive mastery tier, led personally by Dr. LaPlaca, reserved strictly for Level 2 Optometrists who have successfully deployed the A.R.E.S. system in the trenches for a minimum of two years.
                  </p>
                  <p className="text-white/90 leading-relaxed">
                    <strong>Value Proposition:</strong> Become the undisputed authority in sports vision. This tier represents the highest standard of clinical excellence and athletic impact in the industry. You will gain access to our most advanced, unreleased protocols, collaborate directly on research, and join an elite mastermind of the world's top neuro-performance practitioners.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Template & Registry Section */}
          <div className="border-t border-[var(--color-ares-border)] pt-16 mt-16 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 uppercase">The Official Accreditation</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Upon completion of the A.R.E.S. intensive, clinicians receive the physical A.R.E.S. Certification of Competency, alongside digital accreditation badges and listing in our official provider directory.
                </p>
                <p className="text-white/70 leading-relaxed font-bold">
                  This validates your training and unlocks full access to the proprietary A.R.E.S. EMR platform and patient tracking tools.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                <img 
                  src="/A.R.E.S. Certification Template.png" 
                  alt="A.R.E.S. Certification Template" 
                  className="w-full aspect-[4/3] object-contain p-4" 
                />
              </div>
            </div>

            <h3 className="text-center text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-ares-teal)] mb-8">[Registered Certified Clinicians & Coaches]</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "Blair Julian", title: "CPVT Level 1", src: "/A.R.E.S Certification - CVPT - Blair Julian.png" },
                { name: "Cameron Gray", title: "CPVT Provider", src: "/A.R.E.S. Certification - Cameron Gray - CPVT.png" },
                { name: "Christopher Wheeler", title: "CPVT Provider", src: "/A.R.E.S. Certification - Christopher Wheeler.png" },
                { name: "Dr. Lauren Roderick", title: "CPVT Level 2", src: "/A.R.E.S. Certification Badge.png" },
                { name: "Jordan Guler", title: "CPVT Provider", src: "/A.R.E.S. Certification - Jordan Guler.png" },
                { name: "Joseph Sero", title: "CPVT Provider", src: "/A.R.E.S. Certification - Joseph Sero.png" },
                { name: "William Plummer", title: "CPVT Provider", src: "/A.R.E.S. Certification - William Plummer.png" },
                { name: "Chris Snyder", title: "CPVT Level 1", src: "/Chris Snyder - A.R.E.S. Certification CPVT Level 1.png" }
              ].map((practitioner, i) => (
                <div key={i} className="group bg-[var(--color-ares-charcoal)] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center hover:border-[var(--color-ares-teal)]/30 transition-all shadow-lg hover:shadow-glow/10">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-black/30 border border-white/10 flex items-center justify-center">
                    <img 
                      src={practitioner.src} 
                      alt={`${practitioner.name} Badge`} 
                      className="w-16 h-16 object-contain group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{practitioner.name}</h4>
                  <span className="text-[10px] font-mono text-[var(--color-ares-teal)] uppercase tracking-wider mt-1">{practitioner.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 border-t border-[var(--color-ares-border)]">
            <Button variant="primary" href="/contact">
              Contact Certification Team
            </Button>
            <Button variant="outline" href="/book/consultation">
              Book Consultation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
