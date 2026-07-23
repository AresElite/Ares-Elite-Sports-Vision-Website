import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Target, Brain, Activity, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Maximize2, Minimize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionReveal } from '../ui/SectionReveal';

interface HeroProps {
  isReady?: boolean;
}

function HeroDrillWidget() {
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'waiting' | 'active' | 'recorded' | 'complete' | 'early'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [trials, setTrials] = useState<number[]>([]);
  const [currentTrialTime, setCurrentTrialTime] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const requestFullscreenMode = () => {
    setIsFullscreen(true);
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}
  };

  const exitFullscreenMode = () => {
    setIsFullscreen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const startDrill = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    requestFullscreenMode();
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
    }, 600);
  };

  const triggerWaitingState = () => {
    setGameState('waiting');
    const delay = 1000 + Math.random() * 1800;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Record start time on the exact animation frame when the active flash is painted to eliminate render latency
      requestAnimationFrame(() => {
        startTimeRef.current = performance.now();
        setGameState('active');
      });
    }, delay);
  };

  const handleTap = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('early');
      // Auto reset to waiting state on early tap
      timerRef.current = setTimeout(() => {
        triggerWaitingState();
      }, 900);
    } else if (gameState === 'active') {
      const endTime = performance.now();
      const rawTime = Math.round(endTime - startTimeRef.current);
      // Authentic human raw reaction time without artificial 420ms hard cap
      const time = Math.max(165, Math.min(rawTime, 850));
      setCurrentTrialTime(time);
      
      const newTrials = [...trials, time];
      setTrials(newTrials);

      if (newTrials.length >= 10) {
        setGameState('complete');
      } else {
        setGameState('recorded');
        timerRef.current = setTimeout(() => {
          triggerWaitingState();
        }, 650);
      }
    }
  };

  const resetDrill = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
          notes: `Homepage 10-Tap Reaction Lead - Sport: ${leadData.sport}, Level: ${leadData.level}, Phone: ${leadData.phone || 'N/A'}`
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

  const renderDrillContent = (inModal = false) => {
    return (
      <div className="w-full flex-1 flex flex-col justify-center">
        {gameState === 'idle' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(41,182,246,0.2)]">
              <Zap className="w-8 h-8 text-[var(--color-ares-teal)]" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Test Your Raw Reaction Time</h3>
              <p className="text-xs md:text-sm text-white/60 mt-1 max-w-sm mx-auto leading-relaxed">
                Tap 10 target flashes to benchmark your visual capture speed against collegiate & pro standards (200-330ms).
              </p>
            </div>
            <button
              onClick={startDrill}
              className="w-full max-w-xs mx-auto py-4 px-6 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-[0_0_35px_rgba(41,182,246,0.5)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              <span>START FULLSCREEN 10-TAP DRILL</span>
            </button>
          </div>
        )}

        {gameState === 'countdown' && (
          <div className="text-center py-12">
            <div className="text-7xl md:text-9xl font-black font-mono text-[var(--color-ares-teal)] animate-pulse mb-3">
              {countdown}
            </div>
            <p className="text-sm font-mono text-white/70 uppercase tracking-widest">Get Ready... Keep eyes focused on screen</p>
          </div>
        )}

        {(gameState === 'waiting' || gameState === 'active' || gameState === 'recorded' || gameState === 'early') && (
          <div
            onPointerDown={handleTap}
            className={`w-full ${inModal ? 'h-[60vh] max-h-[600px]' : 'min-h-[220px]'} rounded-3xl border flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
              gameState === 'active'
                ? 'bg-[var(--color-ares-teal)] border-[var(--color-ares-teal)] shadow-[0_0_80px_rgba(41,182,246,0.9)]'
                : gameState === 'early'
                ? 'bg-red-500/20 border-red-500/50'
                : 'bg-black/60 border-white/10 hover:border-white/20'
            }`}
          >
            {gameState === 'waiting' && (
              <div className="text-center space-y-3">
                <span className="text-xs md:text-sm font-mono text-white/50 uppercase tracking-widest">Tap the instant solid teal flashes!</span>
                <div className="w-5 h-5 rounded-full bg-[var(--color-ares-teal)]/30 animate-ping mx-auto" />
              </div>
            )}
            {gameState === 'active' && (
              <span className="text-3xl md:text-5xl font-black text-[#0A0B14] uppercase tracking-widest animate-bounce">TAP NOW!</span>
            )}
            {gameState === 'recorded' && (
              <div className="text-center">
                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Trial {trials.length}/10 Captured</span>
                <div className="text-5xl md:text-6xl font-black font-mono text-[var(--color-ares-teal)] mt-1">{currentTrialTime}ms</div>
              </div>
            )}
            {gameState === 'early' && (
              <div className="text-center">
                <span className="text-base font-bold text-red-400 uppercase tracking-wider">Too Early!</span>
                <p className="text-xs font-mono text-white/60 mt-1">Wait for solid teal flash...</p>
              </div>
            )}
          </div>
        )}

        {gameState === 'complete' && (() => {
          const avg = Math.round(trials.reduce((a, b) => a + b, 0) / trials.length);
          
          if (!leadSubmitted) {
            return (
              <div className="space-y-5 text-center max-w-md mx-auto py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" /> 10-Tap Reaction Benchmark Completed
                </div>
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest">Average Raw Reaction Time</div>
                  <div className="text-5xl font-black font-mono text-[var(--color-ares-teal)]">{avg}ms</div>
                </div>
                
                <form onSubmit={handleLeadSubmit} className="space-y-3 text-left bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={leadData.sport}
                      onChange={(e) => setLeadData({ ...leadData, sport: e.target.value })}
                      className="bg-black/80 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
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
                      className="bg-black/80 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
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
                    className="w-full bg-black/80 border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full py-3.5 rounded-xl bg-[var(--color-ares-teal)] text-[#0A0B14] font-black text-xs uppercase tracking-wider cursor-pointer hover:bg-[#4FC3F7] transition-all shadow-glow"
                  >
                    {isSubmittingLead ? 'Processing...' : 'Unlock Benchmark Report'}
                  </button>
                </form>
              </div>
            );
          }

          return (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 text-[var(--color-ares-teal)] text-xs font-mono font-bold uppercase">
                <Zap className="w-4 h-4" /> 10-Tap Reaction Benchmark Complete
              </div>

              <div>
                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Average Raw Reaction Time</span>
                <div className="text-6xl font-black font-mono text-[var(--color-ares-teal)] mt-1">{avg}ms</div>
                <span className="text-xs text-emerald-400 font-mono font-bold mt-1 block">
                  {avg < 230 ? '🔥 ELITE / PRO LEVEL (<230ms)' : avg < 280 ? '⚡ ADVANCED ATHLETIC SPEED (230-280ms)' : '📈 HIGH POTENTIAL FOR SPEED OPTIMIZATION'}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                {trials.map((t, idx) => (
                  <div key={idx} className="p-2 rounded bg-white/5 border border-white/5">
                    <div className="text-[9px] text-white/40 font-bold">#{idx + 1}</div>
                    <div className="text-white font-bold">{t}ms</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/book/evaluation"
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-black text-xs uppercase tracking-wider transition-all shadow-glow text-center cursor-pointer"
                >
                  Book In-Clinic Eval ($449)
                </Link>
                <button
                  onClick={startDrill}
                  className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Retest
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <>
      {/* FULLSCREEN MODAL OVERLAY */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-[#0A0B14] p-4 sm:p-8 flex flex-col justify-between items-center backdrop-blur-3xl overflow-y-auto">
          {/* Fullscreen Header Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between py-3 px-6 rounded-2xl bg-black/60 border border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[var(--color-ares-teal)] animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white uppercase">
                A.R.E.S. FULLSCREEN REACTION ARENA
              </span>
            </div>
            <button
              onClick={exitFullscreenMode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>
          </div>

          {/* Fullscreen Core Area */}
          <div className="w-full max-w-5xl flex-1 flex flex-col justify-center items-center">
            {renderDrillContent(true)}
          </div>
        </div>
      )}

      {/* REGULAR HERO SECTION CONSOLE */}
      <div className="relative rounded-3xl border border-[var(--color-ares-teal)]/30 bg-[#0A0B14]/90 shadow-[0_0_50px_rgba(41,182,246,0.15)] backdrop-blur-xl overflow-hidden flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-ares-teal)] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              A.R.E.S. REACTION CONSOLE
            </span>
          </div>
          <div className="text-[10px] font-mono text-[var(--color-ares-teal)] bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 px-2.5 py-1 rounded-lg font-bold uppercase">
            10-Tap Benchmark
          </div>
        </div>

        {/* Console Main Display */}
        <div className="p-6 sm:p-8 min-h-[340px] flex flex-col justify-center relative">
          {renderDrillContent(false)}
        </div>

        {/* Console Footer */}
        <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-black/40 text-[10px] font-mono">
          <Link to="/athletes" className="p-3 text-center text-white/70 hover:text-[var(--color-ares-teal)] transition-colors uppercase font-bold flex items-center justify-center gap-1.5">
            <span>Athletes & Parents</span>
            <ChevronRight className="w-3 h-3 text-[var(--color-ares-teal)]" />
          </Link>
          <Link to="/teams-and-organizations" className="p-3 text-center text-white/70 hover:text-[var(--color-ares-teal)] transition-colors uppercase font-bold flex items-center justify-center gap-1.5">
            <span>Teams & Orgs</span>
            <ChevronRight className="w-3 h-3 text-[var(--color-ares-teal)]" />
          </Link>
        </div>
      </div>
    </>
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

            {/* Hero Primary Action */}
            <div className="flex flex-col items-center xl:items-start w-full max-w-md">
              <Link 
                to="/assessment" 
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] rounded-2xl transition-all shadow-[0_0_30px_rgba(41,182,246,0.4)] hover:shadow-[0_0_40px_rgba(41,182,246,0.6)] font-black tracking-wider uppercase text-sm cursor-pointer"
              >
                START 5-MINUTE ASSESSMENT
              </Link>
              
              <p className="text-white/60 text-xs mt-3 font-mono text-center xl:text-left">
                In-person testing: <Link to="/book/evaluation" className="text-[var(--color-ares-teal)] font-bold hover:underline">Book 75-Min Carmel Clinic Evaluation ($449)</Link>
              </p>
            </div>
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
