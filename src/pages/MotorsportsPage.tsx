import React from 'react';
import { SEO } from '../components/SEO';
import { ArrowLeft, ArrowRight, Gauge, Target, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function MotorsportsPage() {
  return (
    <>
      <SEO 
        title="High-Speed Motorsports Visual Training | Ares Elite Sports Vision"
        description="A hesitation at 220 MPH isn't a mistake—it's a catastrophe. Train visual acquisition, gaze control, and cognitive stability under extreme G-force."
        path="/motorsports"
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-28 pb-20 px-6 sm:px-8 relative overflow-hidden">
        {/* Glow Details */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-ares-purple)]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-ares-teal)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group font-mono text-xs uppercase tracking-wider">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
            Motorsports Performance Lab
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none uppercase">
            A HESITATION AT 220 MPH <br className="hidden md:block"/> IS A CATASTROPHE.
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-ares-teal)] font-medium leading-relaxed mb-12 uppercase tracking-wide">
            Calibration for high-speed open-wheel, sports car, and motorcycle racers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button 
              variant="primary" 
              href="/assessment"
              className="font-bold tracking-widest uppercase shadow-glow px-8 py-4 bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14]"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              href="/book/evaluation"
              className="font-bold tracking-widest uppercase px-8 py-4 border border-[var(--color-ares-purple)] text-white hover:bg-[var(--color-ares-purple)]/10"
            >
              Book Evaluation
            </Button>
          </div>

          <div className="grid gap-12">
            
            {/* The Millisecond Margin */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Gauge className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                The G-Force Bottleneck
              </h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg mb-6 relative z-10">
                At 220 mph, you cover the length of a football field in under one second. Your brain has less than 150 milliseconds to detect a slip, adjust your steering angle, or brake before a collision. Under physical vibrations, cockpit heat, and high G-forces, your visual systems degrade. 
              </p>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg relative z-10 font-bold text-[var(--color-ares-teal)]">
                If your visual-cognitive routing is slow, your physical reaction will always be late. We train racers to stabilize their gaze, expand peripheral tracking, and keep reaction latency under 180ms under stress.
              </p>
            </section>

            {/* A.R.E.S. Pillars for Racing */}
            <section className="border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)]/30 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4 uppercase tracking-tight">
                THE A.R.E.S. PATHWAY FOR MOTORSPORTS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-ares-teal)] uppercase mb-2">1. ACQUIRE (Visual Capture)</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Stabilizing your gaze through high-frequency vibrations to track the apex, spot track debris, and recognize flagging systems instantly.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-ares-teal)] uppercase mb-2">2. ROUTE (Optic Processing)</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Sending coordinates through the optic nerve to the visual cortex. We train drivers to suppress sensory noise (engine noise, heat, opponent position) to prioritize pathing.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-ares-purple)] uppercase mb-2">3. EXECUTE (Response Precision)</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Converting raw spatial coordinates into physical steering corrections and micro-modulations of the throttle and brake pedals.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-ares-purple)] uppercase mb-2">4. SYNCHRONIZE (Fatigue Resistance)</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Preventing post-error slowing and visual tunneling. Keep your peripheral field wide and cognitive processing speed consistent in the final laps.
                  </p>
                </div>
              </div>
            </section>

            {/* What Happens in the 75-Minute Evaluation */}
            <section className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                THE 75-MINUTE MOTORSPORTS EVALUATION
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                Your visual system is the primary telemetry channel of your vehicle. Before drafting a custom training protocol, we map your performance envelope in our Carmel facility:
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] flex items-center justify-center font-mono font-bold shrink-0">
                    01
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase">Dynamic Acuity & Gaze Tracking</h4>
                    <p className="text-sm text-white/60 leading-relaxed mt-1">
                      We check how accurately your eyes lock onto apexes while your body is subject to simulated vibrations or physical load.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] flex items-center justify-center font-mono font-bold shrink-0">
                    02
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase">Choice Reaction Calibration</h4>
                    <p className="text-sm text-white/60 leading-relaxed mt-1">
                      Measuring your motor response latency to multiple conflicting visual symbols to calculate your decision delay under high-speed stress.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] flex items-center justify-center font-mono font-bold shrink-0">
                    03
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase">Peripheral Recognition & Memory</h4>
                    <p className="text-sm text-white/60 leading-relaxed mt-1">
                      Testing how wide you can keep your visual field to detect overtaking opponents on your flanks without turning your head.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonial / Proof */}
            <section className="bg-gradient-to-r from-[var(--color-ares-purple)]/10 to-transparent border border-[var(--color-ares-purple)]/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Award className="w-8 h-8 text-[var(--color-ares-purple)]" />
              </div>
              <div>
                <p className="text-white/80 italic text-lg leading-relaxed mb-4">
                  "In open-wheel racing, if you wait to see it, you're already in the wall. Training at Ares sharpened my peripheral tracking and visual acquisition, helping me pick up my reference points early and brake with absolute confidence."
                </p>
                <span className="text-sm font-mono text-[var(--color-ares-teal)] uppercase tracking-wider block font-bold">
                  — Pro Open-Wheel Racing Driver
                </span>
              </div>
            </section>

            {/* Bottom conversion CTAs */}
            <div className="text-center py-6">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Calibrate Your Command Center</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  href="/assessment"
                  className="font-bold tracking-widest uppercase shadow-glow px-8 py-4 bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14]"
                >
                  Start Online Assessment
                </Button>
                <Button 
                  variant="outline" 
                  href="/book/evaluation"
                  className="font-bold tracking-widest uppercase px-8 py-4 border border-[var(--color-ares-purple)] text-white hover:bg-[var(--color-ares-purple)]/10"
                >
                  Schedule Evaluation ($449)
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
