import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Target, Brain, Activity, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Maximize2, Minimize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionReveal } from '../ui/SectionReveal';

interface HeroProps {
  isReady?: boolean;
}

function HeroDrillWidget() {
  const [drillState, setDrillState] = useState<'idle' | 'setup' | 'running' | 'completed'>('idle');
  const [countdown, setCountdown] = useState<number | string | null>(null);
  const [trialProgress, setTrialProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const ASSESSMENT_TRIALS = 10;
  const MIN_RT_MS = 120;
  const DEBOUNCE_MS = 10;
  const PURPLE_HEX = '#8B5CF6';

  const containerRef = useRef<HTMLDivElement>(null);
  const stimRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const stimTimeRef = useRef<number>(0);
  const lastInteractionRef = useRef<number>(0);

  const gameState = useRef({
    running: false,
    waitingForStim: false,
    stimVisible: false,
    trialCount: 0,
    rts: [] as number[],
    hits: 0,
    misses: 0,
    falseTaps: 0
  });

  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadData, setLeadData] = useState({ sport: 'Baseball', level: 'High School', email: '', phone: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

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
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const triggerVisualFeedback = (type: 'hit' | 'early') => {
    if (!flashOverlayRef.current) return;
    const el = flashOverlayRef.current;
    el.style.backgroundColor = type === 'hit' ? 'rgba(41, 152, 170, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    el.style.opacity = '1';
    setTimeout(() => { if (el) el.style.opacity = '0'; }, 150);
  };

  const finishSession = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    gameState.current.running = false;
    gameState.current.waitingForStim = false;
    gameState.current.stimVisible = false;
    if (stimRef.current) stimRef.current.style.opacity = '0';
    setDrillState('completed');
  }, []);

  const showStimulus = useCallback(() => {
    if (!gameState.current.running || !stimRef.current || !containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    
    // Level 1 Config: size 120px, phase: central
    const size = 120;
    const left = (w - size) / 2;
    const top = (h - size) / 2;

    const el = stimRef.current;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    el.style.opacity = '1';
    
    gameState.current.waitingForStim = false;
    gameState.current.stimVisible = true;
    stimTimeRef.current = performance.now();
    
    // Level 1 display duration: 1500ms
    timerRef.current = window.setTimeout(() => { 
      if (gameState.current.stimVisible) handleResult('miss', 0); 
    }, 1500);
  }, []);

  const scheduleNext = useCallback(() => {
    if (gameState.current.trialCount >= ASSESSMENT_TRIALS) { 
      finishSession(); 
      return; 
    }
    gameState.current.trialCount++;
    setTrialProgress(gameState.current.trialCount);
    gameState.current.waitingForStim = true;
    gameState.current.stimVisible = false;
    if (stimRef.current) stimRef.current.style.opacity = '0';
    
    // Level 1 Delay: random between 2000ms and 3000ms
    const delay = Math.floor(Math.random() * (3000 - 2000) + 2000);
    timerRef.current = window.setTimeout(() => showStimulus(), delay);
  }, [finishSession, showStimulus]);

  const handleResult = (type: 'hit' | 'miss' | 'false', rt: number) => {
    gameState.current.stimVisible = false;
    if (stimRef.current) stimRef.current.style.opacity = '0';
    
    if (type === 'hit') { 
      gameState.current.hits++; 
      gameState.current.rts.push(rt); 
      triggerVisualFeedback('hit');
    } else if (type === 'false') { 
      gameState.current.falseTaps++; 
      triggerVisualFeedback('early');
    } else { 
      gameState.current.misses++; 
    }

    scheduleNext();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (typeof countdown === 'number' && countdown > 0) return;
    const now = performance.now();
    if (now - lastInteractionRef.current < DEBOUNCE_MS) return;
    lastInteractionRef.current = now;
    e.preventDefault();
    if (!gameState.current.running) return;
    
    if (gameState.current.stimVisible) {
      const rt = now - stimTimeRef.current;
      if (rt < MIN_RT_MS) {
        // Ignore physically impossible reaction guesses (<120ms).
        return;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      handleResult('hit', Math.round(rt));
      return;
    }
    if (gameState.current.waitingForStim) {
      if (timerRef.current) clearTimeout(timerRef.current);
      handleResult('false', 0);
      return;
    }
  };

  const startDrill = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    requestFullscreenMode();
    setDrillState('running');
    setTrialProgress(0);
    setCountdown(3);
    
    gameState.current = { 
      running: true, 
      waitingForStim: false, 
      stimVisible: false, 
      trialCount: 0, 
      rts: [], 
      hits: 0, 
      misses: 0, 
      falseTaps: 0 
    };

    let c = 3;
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = window.setInterval(() => {
      c--;
      if (c > 0) {
        setCountdown(c);
      } else if (c === 0) {
        setCountdown("GO!");
        startTimeRef.current = performance.now(); 
        lastInteractionRef.current = 0; 
        scheduleNext(); 
      } else {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setCountdown(null);
      }
    }, 1000);
  }, [scheduleNext]);

  const resetDrill = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    gameState.current.running = false;
    setDrillState('idle');
    setCountdown(null);
    setTrialProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

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
    const rts = gameState.current.rts;
    const avg = rts.length ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : 0;
    const fast = rts.length ? Math.round(Math.min(...rts)) : 0;
    const slow = rts.length ? Math.round(Math.max(...rts)) : 0;

    return (
      <div className="w-full flex-1 flex flex-col justify-center">
        {drillState === 'idle' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(41,182,246,0.2)]">
              <Zap className="w-8 h-8 text-[var(--color-ares-teal)]" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Test Your Raw Reaction Time</h3>
              <p className="text-xs md:text-sm text-white/60 mt-1 max-w-sm mx-auto leading-relaxed">
                Tap the purple target onset across 10 trials to benchmark your raw reaction speed against elite benchmarks (200-330ms).
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

        {drillState === 'running' && (
          <div 
            ref={containerRef}
            onPointerDown={handlePointerDown}
            className={`w-full ${inModal ? 'h-[65vh] max-h-[600px]' : 'min-h-[260px]'} relative rounded-3xl border border-white/10 bg-black overflow-hidden touch-none select-none cursor-pointer flex flex-col items-center justify-center`}
          >
            {/* Flash Feedback Overlay */}
            <div ref={flashOverlayRef} className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-150 z-20" />

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none">
                <div className="text-7xl md:text-9xl font-black font-mono text-[var(--color-ares-teal)] animate-pulse mb-2">
                  {countdown}
                </div>
                <p className="text-xs font-mono text-white/70 uppercase tracking-widest">Focus on center of screen</p>
              </div>
            )}

            {/* Top Stats HUD */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-center z-30 pointer-events-none">
              <div className="bg-black/70 backdrop-blur px-4 py-2 rounded-full border border-[var(--color-ares-teal)]/40 text-white font-mono flex items-center gap-2 shadow-glow text-xs sm:text-sm">
                <Zap className="w-4 h-4 text-[var(--color-ares-teal)]" />
                <span className="font-bold">Trial {trialProgress} / {ASSESSMENT_TRIALS}</span>
              </div>
              <button 
                onClick={resetDrill}
                className="pointer-events-auto p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Stimulus (Purple Central Target) */}
            <div 
              ref={stimRef} 
              className="absolute rounded-full pointer-events-none opacity-0 transition-none z-10" 
              style={{ 
                top: 0,
                left: 0,
                backgroundColor: PURPLE_HEX, 
                boxShadow: `0 0 40px ${PURPLE_HEX}, inset 0 0 20px rgba(255,255,255,0.4)`, 
                willChange: 'transform' 
              }} 
            />

            {/* Bottom Prompt */}
            <div className="absolute bottom-6 w-full text-center text-white/40 text-[10px] sm:text-xs font-mono pointer-events-none uppercase tracking-[0.2em]">
              Tap anywhere the moment the target appears
            </div>
          </div>
        )}

        {drillState === 'completed' && (() => {
          if (!leadSubmitted) {
            return (
              <div className="space-y-5 text-center max-w-md mx-auto py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" /> 10-Tap Reaction Benchmark Completed
                </div>
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest">Average Raw Reaction Time</div>
                  <div className="text-5xl font-black font-mono text-[var(--color-ares-teal)]">{avg}ms</div>
                  <div className="flex justify-center gap-4 text-xs font-mono text-white/60 mt-1">
                    <span>Fastest: <strong className="text-white">{fast}ms</strong></span>
                    <span>Slowest: <strong className="text-white">{slow}ms</strong></span>
                  </div>
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
                <div className="flex justify-center gap-6 text-xs font-mono text-white/60 mt-2">
                  <span>Fastest: <strong className="text-white">{fast}ms</strong></span>
                  <span>Slowest: <strong className="text-white">{slow}ms</strong></span>
                  {gameState.current.falseTaps > 0 && <span className="text-red-400">Early Taps: <strong>{gameState.current.falseTaps}</strong></span>}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                {rts.map((t, idx) => (
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
          {isFullscreen ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-ares-teal)]/20 border border-[var(--color-ares-teal)]/40 flex items-center justify-center mx-auto animate-pulse">
                <Maximize2 className="w-6 h-6 text-[var(--color-ares-teal)]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">Fullscreen Arena Active</h4>
                <p className="text-xs font-mono text-white/50 mt-1">Drill is currently running in Fullscreen overlay</p>
              </div>
              <button
                onClick={exitFullscreenMode}
                className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer"
              >
                Close Arena Overlay
              </button>
            </div>
          ) : (
            renderDrillContent(false)
          )}
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
      animate="visible"
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
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 filter grayscale"
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
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
