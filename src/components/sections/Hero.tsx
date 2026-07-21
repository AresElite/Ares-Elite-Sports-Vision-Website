import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Target, Brain, Activity, ShieldCheck, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionReveal } from '../ui/SectionReveal';

interface HeroProps {
  isReady?: boolean;
}

function HeroDrillWidget() {
  const [activeTab, setActiveTab] = useState<'drill' | 'framework'>('drill');
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'waiting' | 'active' | 'recorded' | 'complete' | 'early'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [trials, setTrials] = useState<number[]>([]);
  const [currentTrialTime, setCurrentTrialTime] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startDrill = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setGameState('countdown');
    setCountdown(3);
    setTrials([]);
    setCurrentTrialTime(null);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          triggerWaitingState();
          return 0;
        }
        return prev - 1;
      });
    }, 800);
  };

  useEffect(() => {
    if (gameState === 'active') {
      startTimeRef.current = performance.now();
    }
  }, [gameState]);

  const triggerWaitingState = () => {
    setGameState('waiting');
    const delay = 1000 + Math.random() * 1500;
    timerRef.current = setTimeout(() => {
      setGameState('active');
    }, delay);
  };

  const handleTap = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('early');
    } else if (gameState === 'active') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      setCurrentTrialTime(time);
      
      const newTrials = [...trials, time];
      setTrials(newTrials);

      if (newTrials.length >= 5) {
        setGameState('complete');
      } else {
        setGameState('recorded');
        timerRef.current = setTimeout(() => {
          triggerWaitingState();
        }, 1200);
      }
    }
  };

  const resetDrill = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setGameState('idle');
    setTrials([]);
    setCurrentTrialTime(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadData, setLeadData] = useState({ sport: 'Baseball', level: 'High School', email: '', phone: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.email) return;
    setIsSubmittingLead(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: `Reaction Lead (${leadData.sport})`,
          email: leadData.email,
          phone: leadData.phone,
          notes: `Homepage 5-Tap Reaction Lead - Sport: ${leadData.sport}, Level: ${leadData.level}, Phone: ${leadData.phone || 'N/A'}`
        })
      }).catch(err => console.error("Lead API error:", err));
      setLeadSubmitted(true);
    } catch (err) {
      console.error("Lead submission error:", err);
      setLeadSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="relative rounded-3xl border border-[var(--color-ares-teal)]/30 bg-[#0A0B14]/90 shadow-[0_0_50px_rgba(41,182,246,0.15)] backdrop-blur-xl overflow-hidden flex flex-col justify-between">
      {/* Top Header & Mode Toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-ares-teal)] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            A.R.E.S. NEURO-CONSOLE
          </span>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
          <button
            onClick={() => setActiveTab('drill')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer uppercase ${
              activeTab === 'drill'
                ? 'bg-[var(--color-ares-teal)] text-[#0A0B14] font-bold shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            5-Tap Drill
          </button>
          <button
            onClick={() => setActiveTab('framework')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer uppercase ${
              activeTab === 'framework'
                ? 'bg-[var(--color-ares-teal)] text-[#0A0B14] font-bold shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            A.R.E.S. Loop
          </button>
        </div>
      </div>

      {/* Console Main Display */}
      <div className="p-6 sm:p-8 min-h-[340px] flex flex-col justify-center relative">
        {activeTab === 'framework' ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-[10px] font-mono text-[var(--color-ares-teal)] uppercase tracking-widest">
                THE NEURO-COGNITIVE PERFORMANCE LOOP
              </span>
              <h3 className="text-lg font-bold text-white uppercase mt-1">Acquire · Route · Execute · Synchronize</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link to="/acquire" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--color-ares-teal)]/50 transition-all group">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-[var(--color-ares-teal)]" />
                  <span className="text-xs font-bold text-white uppercase">1. Acquire</span>
                </div>
                <p className="text-[11px] text-white/60 leading-tight">Visual intake & spatial eye tracking speed.</p>
              </Link>

              <Link to="/route" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--color-ares-teal)]/50 transition-all group">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-[var(--color-ares-purple)]" />
                  <span className="text-xs font-bold text-white uppercase">2. Route</span>
                </div>
                <p className="text-[11px] text-white/60 leading-tight">Neural processing & decision latency under stress.</p>
              </Link>

              <Link to="/execute" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--color-ares-teal)]/50 transition-all group">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase">3. Execute</span>
                </div>
                <p className="text-[11px] text-white/60 leading-tight">Bi-lateral motor output & reaction execution.</p>
              </Link>

              <Link to="/synchronize" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--color-ares-teal)]/50 transition-all group">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase">4. Synchronize</span>
                </div>
                <p className="text-[11px] text-white/60 leading-tight">Full-system calibration for game-day dominance.</p>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {gameState === 'idle' && (
              <div className="text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(41,182,246,0.2)]">
                  <Zap className="w-8 h-8 text-[var(--color-ares-teal)]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Test Your Reaction Latency</h3>
                  <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto leading-relaxed">
                    Tap 5 target flashes to benchmark your visual capture speed against collegiate & pro standards.
                  </p>
                </div>
                <button
                  onClick={startDrill}
                  className="w-full py-4 px-6 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(41,182,246,0.4)] cursor-pointer"
                >
                  START 5-TAP DRILL
                </button>
              </div>
            )}

            {gameState === 'countdown' && (
              <div className="text-center py-8">
                <div className="text-6xl font-black font-mono text-[var(--color-ares-teal)] animate-pulse mb-2">
                  {countdown}
                </div>
                <p className="text-xs font-mono text-white/50 uppercase tracking-widest">Prepare your finger or mouse cursor...</p>
              </div>
            )}

            {(gameState === 'waiting' || gameState === 'active' || gameState === 'recorded' || gameState === 'early') && (
              <div
                onPointerDown={handleTap}
                className={`w-full min-h-[220px] rounded-2xl border flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
                  gameState === 'active'
                    ? 'bg-[var(--color-ares-teal)] border-[var(--color-ares-teal)] shadow-[0_0_60px_rgba(41,182,246,0.8)]'
                    : gameState === 'early'
                    ? 'bg-red-500/20 border-red-500/50'
                    : 'bg-black/60 border-white/10 hover:border-white/20'
                }`}
              >
                {gameState === 'waiting' && (
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Tap when solid teal flashes!</span>
                    <div className="w-4 h-4 rounded-full bg-white/20 animate-ping mx-auto" />
                  </div>
                )}
                {gameState === 'active' && (
                  <span className="text-2xl font-black text-[#0A0B14] uppercase tracking-widest animate-bounce">TAP NOW!</span>
                )}
                {gameState === 'recorded' && (
                  <div className="text-center">
                    <span className="text-xs font-mono text-white/50 uppercase">Trial {trials.length}/5 Captured</span>
                    <div className="text-4xl font-black font-mono text-[var(--color-ares-teal)] mt-1">{currentTrialTime}ms</div>
                  </div>
                )}
                {gameState === 'early' && (
                  <div className="text-center">
                    <span className="text-sm font-bold text-red-400 uppercase">Too Early!</span>
                    <p className="text-[10px] font-mono text-white/60 mt-1">Wait for solid teal flash...</p>
                  </div>
                )}
              </div>
            )}

            {gameState === 'complete' && (() => {
              const avg = Math.round(trials.reduce((a, b) => a + b, 0) / trials.length);
              
              if (!leadSubmitted) {
                return (
                  <div className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 5-Tap Test Completed
                    </div>
                    <div>
                      <div className="text-xs font-mono text-white/50 uppercase">Average Latency</div>
                      <div className="text-4xl font-black font-mono text-[var(--color-ares-teal)]">{avg}ms</div>
                    </div>
                    
                    <form onSubmit={handleLeadSubmit} className="space-y-2 text-left">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={leadData.sport}
                          onChange={(e) => setLeadData({ ...leadData, sport: e.target.value })}
                          className="bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Baseball">Baseball</option>
                          <option value="Softball">Softball</option>
                          <option value="Soccer">Soccer</option>
                          <option value="Basketball">Basketball</option>
                          <option value="Motorsport">Motorsport</option>
                          <option value="Hockey">Hockey</option>
                          <option value="Football">Football</option>
                          <option value="Other">Other</option>
                        </select>
                        <select
                          value={leadData.level}
                          onChange={(e) => setLeadData({ ...leadData, level: e.target.value })}
                          className="bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Youth">Youth</option>
                          <option value="High School">High School</option>
                          <option value="Collegiate">Collegiate</option>
                          <option value="Pro">Pro / Elite</option>
                        </select>
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Enter email to unlock report..."
                        value={leadData.email}
                        onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full py-3 rounded-xl bg-[var(--color-ares-teal)] text-[#0A0B14] font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#4FC3F7] transition-all"
                      >
                        {isSubmittingLead ? 'Processing...' : 'Unlock Benchmark Report'}
                      </button>
                    </form>
                  </div>
                );
              }

              return (
                <div className="space-y-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--color-ares-teal)] uppercase">AQ™ Benchmark Metric</span>
                    <div className="text-4xl font-black font-mono text-white mt-1">{avg}ms</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 text-left">
                    {avg <= 240 ? (
                      <span><strong>Elite Response:</strong> Your latency ranks in the top tier for {leadData.sport}. Schedule your Carmel Clinic evaluation for comprehensive 3D eye tracking.</span>
                    ) : (
                      <span><strong>Visual Bottleneck Detected:</strong> Your reaction is {avg - 220}ms slower than elite {leadData.sport} benchmarks.</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/book/evaluation"
                      className="flex-1 py-3 rounded-xl bg-[var(--color-ares-teal)] text-[#0A0B14] font-bold text-xs uppercase text-center cursor-pointer"
                    >
                      Book Carmel Clinic ($449)
                    </Link>
                    <button
                      onClick={startDrill}
                      className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs uppercase cursor-pointer"
                    >
                      Retest
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Pathway Quick Buttons */}
      <div className="grid grid-cols-2 border-t border-white/10 bg-black/50 divide-x divide-white/10">
        <Link
          to="/book/evaluation"
          className="p-4 text-left hover:bg-white/5 transition-all group flex flex-col justify-between"
        >
          <span className="text-[10px] font-mono text-white/50 uppercase">For Individuals</span>
          <span className="text-xs font-bold text-white uppercase group-hover:text-[var(--color-ares-teal)] transition-colors flex items-center mt-1">
            Athletes & Parents <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/teams-and-organizations"
          className="p-4 text-left hover:bg-white/5 transition-all group flex flex-col justify-between"
        >
          <span className="text-[10px] font-mono text-white/50 uppercase">For Facilities & Teams</span>
          <span className="text-xs font-bold text-white uppercase group-hover:text-[var(--color-ares-teal)] transition-colors flex items-center mt-1">
            Teams & Orgs <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export function Hero({ isReady = true }: HeroProps) {
  return (
    <SectionReveal 
      className="relative min-h-dvh flex items-center justify-center overflow-hidden pt-28 pb-28 lg:pt-32 lg:pb-32"
      animate={isReady ? "visible" : "hidden"}
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0A0B14]/85 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B14] via-[#0A0B14]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B14] via-[#0A0B14]/70 to-transparent z-10" />
        
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover object-center mix-blend-luminosity opacity-40"
          poster="/DSC_1736.jpg"
        >
          <source src="/cam-fl-6.mov" type="video/mp4" />
          <source src="/cam-fl-6.mov" type="video/quicktime" />
        </video>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Main Left Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="xl:col-span-7 text-center xl:text-left flex flex-col items-center xl:items-start"
          >
            {/* System Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] mb-6 uppercase shadow-[0_0_20px_rgba(41,182,246,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-ares-teal)] animate-ping" />
              THE OPERATING SYSTEM FOR VISUAL-NEUROCOGNITIVE PERFORMANCE
            </div>
            
            {/* High-Impact Headline */}
            <h1 className="text-[3rem] sm:text-[4.75rem] md:text-[5.5rem] lg:text-[6rem] xl:text-[5.25rem] font-black tracking-tighter text-white leading-[0.95] mb-6 uppercase drop-shadow-2xl">
              MILLISECONDS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] via-white to-[var(--color-ares-purple)] mt-2 block">
                MATTER™
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/80 font-normal mb-8 max-w-2xl leading-relaxed text-balance">
              Cut reaction latency, accelerate decision velocity under fatigue, and eliminate cognitive bottlenecks. Ares finds the hidden milliseconds that decide games.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center xl:justify-start max-w-md">
              <Link 
                to="/book/evaluation" 
                className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] rounded-2xl transition-all shadow-[0_0_30px_rgba(41,182,246,0.4)] hover:shadow-[0_0_40px_rgba(41,182,246,0.6)] font-black tracking-wider uppercase text-sm cursor-pointer"
              >
                BOOK CLINIC EVALUATION ($449)
              </Link>
              <Link 
                to="/assessment" 
                className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-2xl transition-all font-bold tracking-wider uppercase text-sm backdrop-blur-md cursor-pointer"
              >
                ONLINE DIAGNOSTIC
              </Link>
            </div>

            <p className="text-white/40 text-xs mt-3 font-mono">
              ★ 80-90 Minute In-Person Evaluation at Carmel Clinic | Gated Online Latency Diagnostic
            </p>
          </motion.div>

          {/* Right Interactive HUD Console */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={isReady ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="xl:col-span-5 w-full max-w-md mx-auto xl:max-w-none"
          >
            <HeroDrillWidget />
          </motion.div>

        </div>
      </div>

      {/* Bottom Proof Bar */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-[#0A0B14]/90 backdrop-blur-xl py-4 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[var(--color-ares-teal)]" />
            <p className="text-[11px] text-white/70 font-mono uppercase tracking-widest">
              OBJECTIVE DATA FOR ELITE VISUAL-MOTOR PERFORMANCE
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono font-bold text-white/60 uppercase tracking-widest">
            <span>INDYCAR</span>
            <span className="text-[var(--color-ares-teal)]">·</span>
            <span>NHL</span>
            <span className="text-[var(--color-ares-teal)]">·</span>
            <span>NCAA</span>
            <span className="text-[var(--color-ares-teal)]">·</span>
            <span>MOTORSPORTS</span>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
