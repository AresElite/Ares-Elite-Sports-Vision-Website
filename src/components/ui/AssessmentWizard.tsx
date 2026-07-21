import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Brain, Target, Timer, ChevronRight, CheckCircle2, 
  AlertCircle, ArrowRight, Loader2, Award, Eye, Activity
} from 'lucide-react';
import { Button } from './Button';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

type WizardStep = 
  | 'welcome' 
  | 'survey' 
  | 'transition_drills' 
  | 'drill_raw' 
  | 'drill_choice' 
  | 'drill_recognition' 
  | 'lead_capture' 
  | 'success';

interface Question {
  id: number;
  text: string;
  category: 'fatigue' | 'tracking' | 'cognitive' | 'coordination';
}

const QUESTIONS: Question[] = [
  { id: 1, text: "Do you experience eye strain, dryness, or headaches after intense screen time or training?", category: 'fatigue' },
  { id: 2, text: "Do you struggle to transition focus quickly between near and far distances?", category: 'fatigue' },
  { id: 3, text: "Do you experience double vision or blurriness under physical fatigue?", category: 'fatigue' },
  { id: 4, text: "How often do you lose track of the ball or target in high-speed plays?", category: 'tracking' },
  { id: 5, text: "Do you struggle to maintain focus and reaction speed in your peripheral field?", category: 'tracking' },
  { id: 6, text: "Do you misjudge distance or the speed of an incoming object or opponent?", category: 'tracking' },
  { id: 7, text: "Do you hesitate before making a critical pass, shot, or split-second decision?", category: 'cognitive' },
  { id: 8, text: "Do you make more mental or tactical mistakes in the final minutes of a game?", category: 'cognitive' },
  { id: 9, text: "Do you feel your brain processes plays faster than your hands or feet can execute?", category: 'cognitive' },
  { id: 10, text: "Do you feel you react late to sudden changes of direction or blind-spot movements?", category: 'coordination' },
  { id: 11, text: "Do you experience poor timing or coordination when executing fast physical movements?", category: 'coordination' },
  { id: 12, text: "Do you find it difficult to track multiple moving targets under pressure?", category: 'coordination' }
];

interface MOTBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isTarget: boolean;
  isSelected: boolean;
}

function calculatePercentile(rawAvg: number, choiceAcc: number, motAcc: number, motLatency: number): number {
  let rawPct = 50;
  if (rawAvg <= 210) {
    rawPct = 96 + Math.max(0, 210 - rawAvg) * 0.1;
  } else if (rawAvg <= 320) {
    rawPct = 95 - ((rawAvg - 210) / (320 - 210)) * 45;
  } else {
    rawPct = 50 - ((rawAvg - 320) / (480 - 320)) * 45;
  }
  
  let motLatencyScore = 50;
  if (motLatency <= 900) {
    motLatencyScore = 95;
  } else if (motLatency <= 2000) {
    motLatencyScore = 95 - ((motLatency - 900) / 1100) * 45;
  } else {
    motLatencyScore = Math.max(10, 50 - ((motLatency - 2000) / 2000) * 40);
  }

  const physicalScore = (rawPct * 0.35) + (choiceAcc * 0.30) + ((motAcc * 0.7 + motLatencyScore * 0.3) * 0.35);
  return Math.max(5, Math.min(99, Math.round(physicalScore)));
}

interface AssessmentWizardProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export function AssessmentWizard({ onClose, isEmbedded = false }: AssessmentWizardProps) {
  const [step, setStep] = useState<WizardStep>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<(number | null)[]>(new Array(12).fill(null));
  
  const rawHasClickedRef = useRef(false);
  const choiceHasClickedRef = useRef(false);
  
  const [rawTrial, setRawTrial] = useState(0);
  const [rawState, setRawState] = useState<'idle' | 'waiting' | 'flash' | 'feedback'>('idle');
  const [rawTimes, setRawTimes] = useState<number[]>([]);
  const [rawFalsePositives, setRawFalsePositives] = useState(0);
  const rawTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rawFlashTimeRef = useRef<number>(0);
  const rawWaitingStateStartRef = useRef<number>(0);

  const [choiceTrial, setChoiceTrial] = useState(0);
  const [choiceState, setChoiceState] = useState<'idle' | 'waiting' | 'target' | 'feedback'>('idle');
  const [choiceTargetColor, setChoiceTargetColor] = useState<'purple' | 'teal' | null>(null);
  const [choiceTimes, setChoiceTimes] = useState<{ color: 'purple' | 'teal'; time: number; correct: boolean }[]>([]);
  const [choiceWasError, setChoiceWasError] = useState(false);
  const choiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const choiceFlashTimeRef = useRef<number>(0);

  const [motTrial, setMotTrial] = useState(0);
  const [motState, setMotState] = useState<'idle' | 'highlight' | 'motion' | 'select' | 'feedback'>('idle');
  const [motResults, setMotResults] = useState<{ trial: number; correct: number; totalTargets: number; latency: number }[]>([]);
  const [motSelectedCount, setMotSelectedCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const motBallsRef = useRef<MOTBall[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const motSelectStartTimeRef = useRef<number>(0);

  const [leadForm, setLeadForm] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', sport: '', role: '', competitiveLevel: '', location: '', consent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bottleneckResult, setBottleneckResult] = useState<string | null>(null);

  const nextStep = (next: WizardStep) => setStep(next);

  const handleAnswerSurvey = (value: number) => {
    const newAnswers = [...surveyAnswers];
    newAnswers[currentQuestionIndex] = value;
    setSurveyAnswers(newAnswers);
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      nextStep('transition_drills');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const startRawDrill = () => {
    setRawTrial(0);
    setRawTimes([]);
    setRawFalsePositives(0);
    triggerRawNextTrial();
  };

  const triggerRawNextTrial = () => {
    setRawState('waiting');
    rawWaitingStateStartRef.current = performance.now();
    rawHasClickedRef.current = false;
    const delay = 1500 + Math.random() * 2500;
    if (rawTimerRef.current) clearTimeout(rawTimerRef.current);
    rawTimerRef.current = setTimeout(() => {
      setRawState('flash');
      rawFlashTimeRef.current = performance.now();
    }, delay);
  };

  const handleRawClick = () => {
    if (rawState === 'waiting') {
      if (performance.now() - rawWaitingStateStartRef.current < 500 || rawHasClickedRef.current) return;
      rawHasClickedRef.current = true;
      if (rawTimerRef.current) clearTimeout(rawTimerRef.current);
      setRawFalsePositives(prev => prev + 1);
      setRawState('feedback');
      setTimeout(() => advanceRawTrial(), 1000);
    } else if (rawState === 'flash') {
      if (rawHasClickedRef.current) return;
      rawHasClickedRef.current = true;
      const rt = Math.max(190, Math.round(performance.now() - rawFlashTimeRef.current - 75));
      setRawTimes(prev => [...prev, rt]);
      setRawState('feedback');
      setTimeout(() => advanceRawTrial(), 1000);
    }
  };

  const advanceRawTrial = () => {
    if (rawTrial < 5) {
      setRawTrial(prev => prev + 1);
      triggerRawNextTrial();
    } else {
      nextStep('drill_choice');
      startChoiceDrill();
    }
  };

  const startChoiceDrill = () => {
    setChoiceTrial(0);
    setChoiceTimes([]);
    setChoiceWasError(false);
    triggerChoiceNextTrial();
  };

  const triggerChoiceNextTrial = () => {
    setChoiceState('waiting');
    setChoiceTargetColor(null);
    choiceHasClickedRef.current = false;
    const delay = 1200 + Math.random() * 1800;
    if (choiceTimerRef.current) clearTimeout(choiceTimerRef.current);
    choiceTimerRef.current = setTimeout(() => {
      setChoiceTargetColor(Math.random() > 0.5 ? 'purple' : 'teal');
      setChoiceState('target');
      choiceFlashTimeRef.current = performance.now();
    }, delay);
  };

  const handleChoiceInput = (inputColor: 'purple' | 'teal') => {
    if (choiceState !== 'target' || !choiceTargetColor || choiceHasClickedRef.current) return;
    choiceHasClickedRef.current = true;
    const rt = Math.max(300, Math.round(performance.now() - choiceFlashTimeRef.current - 95));
    const isCorrect = inputColor === choiceTargetColor;
    setChoiceTimes(prev => [...prev, { color: choiceTargetColor, time: rt, correct: isCorrect }]);
    setChoiceWasError(!isCorrect);
    setChoiceState('feedback');
    setTimeout(() => {
      if (choiceTrial < 5) {
        setChoiceTrial(prev => prev + 1);
        triggerChoiceNextTrial();
      } else {
        nextStep('drill_recognition');
        startMotDrill();
      }
    }, 1000);
  };

  const startMotDrill = () => {
    setMotTrial(0);
    setMotResults([]);
    initMotTrial(0);
  };

  const initMotTrial = (trialIdx: number) => {
    const ballCount = trialIdx === 2 ? 6 : 5;
    const targetCount = trialIdx === 2 ? 3 : 2;
    const width = 560;
    const height = 340;
    const radius = 24;
    const speed = 3.2;

    const balls: MOTBall[] = [];
    const targetIndices = new Set<number>();
    while (targetIndices.size < targetCount) targetIndices.add(Math.floor(Math.random() * ballCount));

    for (let i = 0; i < ballCount; i++) {
      let x = radius + 20 + Math.random() * (width - 2 * radius - 40);
      let y = radius + 20 + Math.random() * (height - 2 * radius - 40);
      const angle = Math.random() * Math.PI * 2;
      balls.push({ id: i, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, radius, isTarget: targetIndices.has(i), isSelected: false });
    }
    motBallsRef.current = balls;
    setMotSelectedCount(0);
    setMotState('highlight');
    setTimeout(() => {
      setMotState('motion');
      setTimeout(() => {
        setMotState('select');
        motSelectStartTimeRef.current = performance.now();
      }, 4500);
    }, 2200);
  };

  useEffect(() => {
    if (step !== 'drill_recognition') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    const render = () => {
      if (!running) return;
      if (motState === 'motion') {
        motBallsRef.current.forEach(b => {
          b.x += b.vx; b.y += b.vy;
          if (b.x - b.radius < 0 || b.x + b.radius > canvas.width) b.vx *= -1;
          if (b.y - b.radius < 0 || b.y + b.radius > canvas.height) b.vy *= -1;
        });
        for (let i = 0; i < motBallsRef.current.length; i++) {
          for (let j = i + 1; j < motBallsRef.current.length; j++) {
            const b1 = motBallsRef.current[i];
            const b2 = motBallsRef.current[j];
            const dx = b2.x - b1.x, dy = b2.y - b1.y;
            if (Math.hypot(dx, dy) < b1.radius + b2.radius) {
              const nx = dx / Math.hypot(dx, dy), ny = dy / Math.hypot(dx, dy);
              const p = 2 * (nx * (b1.vx - b2.vx) + ny * (b1.vy - b2.vy)) / 2;
              b1.vx -= p * nx; b1.vy -= p * ny;
              b2.vx += p * nx; b2.vy += p * ny;
            }
          }
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      motBallsRef.current.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = (motState === 'highlight' && b.isTarget) ? '#00f2fe' : '#8b5cf6';
        ctx.fill();
        if ((motState === 'select' || motState === 'feedback') && b.isSelected) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#00f2fe';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      });
      animFrameRef.current = requestAnimationFrame(render);
    };
    render();
    return () => { running = false; if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [step, motState]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (motState !== 'select') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);
    const targetCount = motTrial === 2 ? 3 : 2;
    const clickedBall = motBallsRef.current.find(b => Math.hypot(b.x - clickX, b.y - clickY) <= b.radius + 12);
    if (clickedBall) {
      clickedBall.isSelected = !clickedBall.isSelected;
      const newSelected = motBallsRef.current.filter(b => b.isSelected).length;
      setMotSelectedCount(newSelected);
      if (newSelected === targetCount) {
        const latency = Math.round(performance.now() - motSelectStartTimeRef.current);
        const correctCount = motBallsRef.current.filter(b => b.isTarget && b.isSelected).length;
        setMotResults(prev => [...prev, { trial: motTrial + 1, correct: correctCount, totalTargets: targetCount, latency }]);
        setMotState('feedback');
        setTimeout(() => {
          if (motTrial < 2) { setMotTrial(prev => prev + 1); initMotTrial(motTrial + 1); }
          else nextStep('lead_capture');
        }, 1200);
      }
    }
  };

  const getCalculatedMetrics = () => {
    const rawAvg = rawTimes.length > 0 ? Math.round(rawTimes.reduce((s, v) => s + v, 0) / rawTimes.length) : 0;
    const purpleTrials = choiceTimes.filter(t => t.color === 'purple');
    const tealTrials = choiceTimes.filter(t => t.color === 'teal');
    const purpleAcc = purpleTrials.length > 0 ? Math.round((purpleTrials.filter(t => t.correct).length / purpleTrials.length) * 100) : 0;
    const tealAcc = tealTrials.length > 0 ? Math.round((tealTrials.filter(t => t.correct).length / tealTrials.length) * 100) : 0;
    const recAcc = motResults.length > 0 ? Math.round((motResults.reduce((s, r) => s + r.correct, 0) / motResults.reduce((s, r) => s + r.totalTargets, 0)) * 100) : 0;
    const recAvg = motResults.length > 0 ? Math.round(motResults.reduce((s, r) => s + r.latency, 0) / motResults.length) : 0;
    return { surveyScore: surveyAnswers.reduce((s, v) => s + (v || 0), 0), rawAvg, rawFalsePositives, purpleAcc, tealAcc, pesDiff: 0, recAvg, recAcc };
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const m = getCalculatedMetrics();
    const bottleneck = m.rawAvg > 260 ? 'Acquire Bottleneck' : (m.recAcc < 80 ? 'Route Bottleneck' : 'Execute Bottleneck');
    setBottleneckResult(bottleneck);
    const payload = { ...leadForm, ...m, bottleneckProfile: bottleneck };
    try {
      await fetch('/api/submit-assessment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      nextStep('success');
    } catch (err) { setSubmitError("Submission failed."); }
    setIsSubmitting(false);
  };

  const metrics = getCalculatedMetrics();
  const userPct = calculatePercentile(metrics.rawAvg, (metrics.tealAcc + metrics.purpleAcc) / 2, metrics.recAcc, metrics.recAvg);

  return (
    <div className={`relative w-full ${isEmbedded ? 'max-w-4xl p-6 md:p-10 bg-[var(--color-ares-charcoal)]/90 backdrop-blur-xl border border-[var(--color-ares-border)] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.5)]' : 'h-full flex flex-col justify-center'}`}>
      {(step === 'drill_raw' || step === 'drill_choice' || step === 'drill_recognition') && (
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
          <div className="flex-1 flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full ${step === 'drill_raw' ? 'bg-[var(--color-ares-purple)]' : 'bg-emerald-500'}`} />
            <span className="text-[10px] uppercase font-mono">1. Raw Speed</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full ${step === 'drill_choice' ? 'bg-[var(--color-ares-teal)]' : (step === 'drill_recognition' ? 'bg-emerald-500' : 'bg-white/10')}`} />
            <span className="text-[10px] uppercase font-mono">2. Choice</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full ${step === 'drill_recognition' ? 'bg-[var(--color-ares-purple)]' : 'bg-white/10'}`} />
            <span className="text-[10px] uppercase font-mono">3. Tracking</span>
          </div>
        </div>
      )}

      {step === 'welcome' && (
        <div className="text-center max-w-2xl mx-auto">
          <Brain className="w-20 h-20 text-[var(--color-ares-teal)] mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-6 uppercase">UNLEASH YOUR DECISION SPEED</h2>
          <p className="text-white/60 mb-10">Take our 12-question profile and 3 neuro-motor drills to map your visual latency.</p>
          <Button variant="primary" onClick={() => nextStep('survey')}>Start Assessment <ArrowRight className="ml-2 w-4 h-4" /></Button>
        </div>
      )}

      {step === 'survey' && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-8">{QUESTIONS[currentQuestionIndex].text}</h3>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(v => (
              <button key={v} onClick={() => handleAnswerSurvey(v)} className="p-4 rounded-xl bg-white/5 hover:bg-[var(--color-ares-teal)]/20 border border-white/10 text-white font-bold transition-all">{v}</button>
            ))}
          </div>
        </div>
      )}

      {step === 'transition_drills' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">NEURO-MOTOR DRILLS</h2>
          <Button variant="primary" onClick={() => { nextStep('drill_raw'); startRawDrill(); }}>Begin Drills</Button>
        </div>
      )}

      {/* Drill 1: Raw Reaction Speed (Purple Target) */}
      {step === 'drill_raw' && (
        <div className="w-full text-center">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <span className="text-[var(--color-ares-purple)] text-xs font-mono font-bold tracking-widest uppercase">
              DRILL 1: RAW REACTION SPEED
            </span>
            <span className="text-white/40 text-sm font-mono">
              Trial {rawTrial + 1} / 6
            </span>
          </div>

          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            Click/tap the target immediately when the circle turns <span className="text-[var(--color-ares-purple)] font-bold">PURPLE</span>.
          </p>

          <div 
            onPointerDown={handleRawClick}
            className="w-full min-h-[250px] rounded-2xl border border-white/5 bg-black/40 hover:bg-black/50 transition-colors flex flex-col items-center justify-center cursor-pointer select-none relative overflow-hidden"
          >
            {rawState === 'waiting' && (
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-white/20 font-bold uppercase tracking-widest text-xs">Ready</span>
              </div>
            )}
            {rawState === 'flash' && (
              <div className="w-32 h-32 rounded-full bg-[#8b5cf6] shadow-[0_0_50px_rgba(139,92,246,0.8)] flex items-center justify-center">
                <span className="text-white font-black uppercase tracking-widest text-sm">TAP NOW!</span>
              </div>
            )}
            {rawState === 'feedback' && (
              <div className="text-white">
                {rawTimes.length > rawTrial ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-white/50 text-xs font-mono uppercase tracking-widest">Reaction Speed</span>
                    <span className="text-4xl font-mono font-bold text-emerald-400">
                      {Math.round(rawTimes[rawTimes.length - 1])}ms
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <span className="text-red-500 font-black uppercase tracking-widest text-sm">False Positive!</span>
                    <span className="text-white/40 text-xs font-mono">WAIT FOR FLASH</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drill 2: Choice Reaction Time */}
      {step === 'drill_choice' && (
        <div className="w-full text-center">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <span className="text-[var(--color-ares-purple)] text-xs font-mono font-bold tracking-widest uppercase">
              DRILL 2: CHOICE REACTION (TEAL VS PURPLE)
            </span>
            <span className="text-white/40 text-sm font-mono">
              Trial {choiceTrial + 1} / 6
            </span>
          </div>

          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            Tap the matching color below or use keyboard keys:<br/>
            <span className="text-[var(--color-ares-teal)] font-bold">Left Arrow / T</span> for TEAL, <span className="text-[var(--color-ares-purple)] font-bold">Right Arrow / P</span> for PURPLE.
          </p>

          <div className="w-full min-h-[200px] rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center justify-center select-none mb-6 relative overflow-hidden">
            {choiceState === 'waiting' && (
              <div className="text-white/20 font-bold uppercase tracking-widest text-xs">
                Focus Center...
              </div>
            )}
            {choiceState === 'target' && choiceTargetColor && (
              <div 
                className={`w-24 h-24 rounded-full ${
                  choiceTargetColor === 'teal' 
                    ? 'bg-[var(--color-ares-teal)] shadow-[0_0_40px_rgba(41,182,246,0.5)]' 
                    : 'bg-[var(--color-ares-purple)] shadow-[0_0_40px_rgba(139,92,246,0.5)]'
                }`}
              />
            )}
            {choiceState === 'feedback' && (
              <div className="text-white">
                {choiceTimes.length > choiceTrial ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-white/50 text-xs font-mono uppercase tracking-widest">Response Captured</span>
                    <span className="text-3xl font-mono font-bold text-white">
                      {Math.round(choiceTimes[choiceTimes.length - 1].time)}ms
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onPointerDown={() => handleChoiceInput('teal')}
              disabled={choiceState !== 'target'}
              className="py-5 rounded-2xl bg-[var(--color-ares-teal)]/10 hover:bg-[var(--color-ares-teal)]/20 border border-[var(--color-ares-teal)]/30 text-[var(--color-ares-teal)] font-bold text-lg transition-all focus:outline-none disabled:opacity-20 cursor-pointer"
            >
              TEAL (Left)
            </button>
            <button
              onPointerDown={() => handleChoiceInput('purple')}
              disabled={choiceState !== 'target'}
              className="py-5 rounded-2xl bg-[var(--color-ares-purple)]/10 hover:bg-[var(--color-ares-purple)]/20 border border-[var(--color-ares-purple)]/30 text-[var(--color-ares-purple)] font-bold text-lg transition-all focus:outline-none disabled:opacity-20 cursor-pointer"
            >
              PURPLE (Right)
            </button>
          </div>
        </div>
      )}

      {/* Drill 3: Multiple Object Tracking (MOT) - 2D Physics Canvas */}
      {step === 'drill_recognition' && (
        <div className="w-full text-center py-2 select-none">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
            <span className="text-[var(--color-ares-purple)] text-xs font-mono font-bold tracking-widest uppercase">
              DRILL 3: MULTIPLE OBJECT TRACKING
            </span>
            <span className="text-white/40 text-sm font-mono">
              Trial {motTrial + 1} / 3 ({motTrial === 2 ? '6 Balls, 3 Targets' : '5 Balls, 2 Targets'})
            </span>
          </div>

          <div className="mb-4 text-sm font-bold text-white/90 uppercase tracking-wide">
            {motState === 'highlight' && (
              <span className="text-[var(--color-ares-teal)] animate-pulse">
                MEMORIZE THE {motTrial === 2 ? '3' : '2'} TEAL HIGHLIGHTED TARGETS!
              </span>
            )}
            {motState === 'motion' && (
              <span className="text-[var(--color-ares-purple)]">
                TRACK TARGETS AS ALL BALLS TURN PURPLE!
              </span>
            )}
            {motState === 'select' && (
              <span className="text-emerald-400">
                TAP THE {motTrial === 2 ? '3' : '2'} BALLS YOU TRACKED AS TARGETS ({motSelectedCount}/{motTrial === 2 ? 3 : 2})
              </span>
            )}
            {motState === 'feedback' && (
              <span className="text-emerald-400 font-mono">
                TRIAL {motTrial + 1} COMPLETE!
              </span>
            )}
          </div>

          <div className="relative max-w-xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-[var(--color-ares-charcoal)] shadow-2xl">
            <canvas
              ref={canvasRef}
              width={560}
              height={340}
              onClick={handleCanvasClick}
              className="w-full h-[340px] block cursor-pointer"
            />
          </div>
        </div>
      )}


      {/* Lead Capture Gate (with expanded CRM fields) */}
      {step === 'lead_capture' && (
        <div className="max-w-lg mx-auto w-full py-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase">ASSESSMENT COMPLETE</h2>
            <p className="text-white/60 text-sm">
              Enter details below to calculate your lead score, identify visual bottlenecks, and unlock baseline recommendations.
            </p>
          </div>

          {/* Blurred Scorecard Preview */}
          <div className="relative mb-8 rounded-2xl border border-white/5 bg-white/5 p-5 overflow-hidden select-none">
            {/* The actual content that is blurred */}
            <div className="filter blur-[5px] opacity-35 space-y-4 pointer-events-none">
              <div className="flex justify-between items-center text-xs font-mono text-white">
                <span>REACTION TIME: 242ms</span>
                <span>PERCENTILE: 84th</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[84%] bg-[var(--color-ares-teal)]" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <div className="text-[9px] text-white/40 font-mono">ACQUISITION</div>
                  <div className="text-xs font-bold text-white uppercase">Fast (230ms)</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <div className="text-[9px] text-white/40 font-mono">ROUTING</div>
                  <div className="text-xs font-bold text-white uppercase">Latent (350ms)</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <div className="text-[9px] text-white/40 font-mono">EXECUTION</div>
                  <div className="text-xs font-bold text-white uppercase">Optimal</div>
                </div>
              </div>

              {/* A mock svg path representing a bell curve */}
              <div className="h-16 w-full flex items-end">
                <svg className="w-full h-12 stroke-white/20 fill-white/5" viewBox="0 0 100 50">
                  <path d="M 0 45 Q 25 45 50 10 T 75 45 Q 100 45 100 45" strokeWidth="2" fill="none" />
                  <circle cx="65" cy="22" r="3" className="fill-[var(--color-ares-teal)]" />
                </svg>
              </div>
            </div>

            {/* Glowing lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[var(--color-ares-teal)]/20 border border-[var(--color-ares-teal)]/40 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(41,182,246,0.3)]">
                <Eye className="w-5 h-5 text-[var(--color-ares-teal)]" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">Sensory Profile Generated</span>
              <span className="text-[10px] text-white/50 mt-1 uppercase tracking-wider font-mono">Submit email below to unlock your custom breakdown</span>
            </div>
          </div>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="first_name" className="text-[10px] font-mono text-white/50 uppercase">First Name *</label>
                <input
                  type="text" required id="first_name"
                  value={leadForm.firstName}
                  onChange={e => setLeadForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="last_name" className="text-[10px] font-mono text-white/50 uppercase">Last Name</label>
                <input
                  type="text" id="last_name"
                  value={leadForm.lastName}
                  onChange={e => setLeadForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="email_addr" className="text-[10px] font-mono text-white/50 uppercase">Email Address *</label>
                <input
                  type="email" required id="email_addr"
                  value={leadForm.email}
                  onChange={e => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="phone_num" className="text-[10px] font-mono text-white/50 uppercase">Phone Number</label>
                <input
                  type="tel" id="phone_num"
                  value={leadForm.phone}
                  onChange={e => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  placeholder="(317) 555-0199"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="role_select" className="text-[10px] font-mono text-white/50 uppercase">Role / ICP Segment *</label>
                <select
                  required id="role_select"
                  value={leadForm.role}
                  onChange={e => setLeadForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#0a0b14]/90 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Elite Athlete">Elite Athlete</option>
                  <option value="Parent of Athlete">Parent of Athlete</option>
                  <option value="Coach">Coach</option>
                  <option value="Team / Org Representative">Team / Org Representative</option>
                  <option value="Motorsports Athlete/Team">Motorsports Athlete/Team</option>
                  <option value="Official / Referee">Official / Referee</option>
                  <option value="Facility Owner / Director">Facility Owner / Director</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="level_select" className="text-[10px] font-mono text-white/50 uppercase">Competitive Level</label>
                <select
                  id="level_select"
                  value={leadForm.competitiveLevel}
                  onChange={e => setLeadForm(prev => ({ ...prev, competitiveLevel: e.target.value }))}
                  className="w-full bg-[#0a0b14]/90 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                >
                  <option value="" disabled>Select Level</option>
                  <option value="Youth">Youth / Middle School</option>
                  <option value="High School">High School</option>
                  <option value="College">College (NCAA/Club)</option>
                  <option value="Professional">Professional</option>
                  <option value="Elite / Olympic">Elite / Olympic</option>
                  <option value="Adult Recreational">Adult Recreational</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="sport_discipline" className="text-[10px] font-mono text-white/50 uppercase">Primary Sport</label>
                <input
                  type="text" id="sport_discipline"
                  value={leadForm.sport}
                  onChange={e => setLeadForm(prev => ({ ...prev, sport: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                  placeholder="e.g. IndyCar, Baseball, Hockey"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="location_input" className="text-[10px] font-mono text-white/50 uppercase">Location (City, State) *</label>
                <input
                  type="text" required id="location_input"
                  value={leadForm.location}
                  onChange={e => setLeadForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                  placeholder="Carmel, IN"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="concern_select" className="text-[10px] font-mono text-white/50 uppercase">Primary Performance Concern *</label>
              <select
                required id="concern_select"
                value={leadForm.primaryConcern}
                onChange={e => setLeadForm(prev => ({ ...prev, primaryConcern: e.target.value }))}
                className="w-full bg-[#0a0b14]/90 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
              >
                <option value="" disabled>Select Primary Concern</option>
                <option value="Split-Second Hesitation / Decision Delay">Split-Second Hesitation / Decision Delay</option>
                <option value="Tracking High-Speed Objects (Ball, Puck, Car)">Tracking High-Speed Objects (Ball, Puck, Car)</option>
                <option value="Peripheral Awareness / Blind Spot Hits">Peripheral Awareness / Blind Spot Hits</option>
                <option value="Eye Strain / Visual Fatigue during Play">Eye Strain / Visual Fatigue during Play</option>
                <option value="Focus Transition (Near-to-Far Recovery)">Focus Transition (Near-to-Far Recovery)</option>
                <option value="Difficulty under Bright Lights / Glare">Difficulty under Bright Lights / Glare</option>
                <option value="Inconsistent Timing / Poor Coordination">Inconsistent Timing / Poor Coordination</option>
                <option value="Losing Track of Play in Crowded Areas">Losing Track of Play in Crowded Areas</option>
                <option value="Poor Depth Perception / Misjudging Distance">Poor Depth Perception / Misjudging Distance</option>
                <option value="Slow Reaction to Sudden Changes of Direction">Slow Reaction to Sudden Changes of Direction</option>
                <option value="Making Mental Errors Late in the Game">Making Mental Errors Late in the Game</option>
                <option value="Double Vision or Blurring when Tired">Double Vision or Blurring when Tired</option>
                <option value="Difficulty Reading the Spin on a Ball">Difficulty Reading the Spin on a Ball</option>
                <option value="Slow Visual Search / Finding Open Teammates">Slow Visual Search / Finding Open Teammates</option>
                <option value="Post-Impact Visual Disorientation">Post-Impact Visual Disorientation</option>
                <option value="Slow Recovery of Focus after Blinking">Slow Recovery of Focus after Blinking</option>
                <option value="Difficulty Tracking Multiple Moving Targets">Difficulty Tracking Multiple Moving Targets</option>
                <option value="Spatial Awareness / Misjudging Field Boundaries">Spatial Awareness / Misjudging Field Boundaries</option>
                <option value="General Reaction Speed Improvement">General Reaction Speed Improvement</option>
                <option value="Other (Please specify)">Other (Please specify)</option>
              </select>
            </div>

            {leadForm.primaryConcern === 'Other (Please specify)' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 mt-3">
                <label htmlFor="concern_other" className="text-[10px] font-mono text-white/50 uppercase">Please specify concern *</label>
                <input
                  type="text" required id="concern_other"
                  value={leadForm.primaryConcernOther}
                  onChange={e => setLeadForm(prev => ({ ...prev, primaryConcernOther: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                  placeholder="Describe your primary visual concern"
                />
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="urgency_select" className="text-[10px] font-mono text-white/50 uppercase">Timeline / Urgency *</label>
                <select
                  required id="urgency_select"
                  value={leadForm.urgency}
                  onChange={e => setLeadForm(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full bg-[#0a0b14]/90 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                >
                  <option value="" disabled>Select Timeline</option>
                  <option value="Immediate">Immediate (Ready to start now)</option>
                  <option value="Next 30 Days">Next 30 Days</option>
                  <option value="Information Only">Information Only / Researching</option>
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="next_step_select" className="text-[10px] font-mono text-white/50 uppercase">Desired Next Step *</label>
                <select
                  required id="next_step_select"
                  value={leadForm.desiredNextStep}
                  onChange={e => setLeadForm(prev => ({ ...prev, desiredNextStep: e.target.value }))}
                  className="w-full bg-[#0a0b14]/90 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                >
                  <option value="" disabled>Select Action</option>
                  <option value="Book Evaluation">Book Performance Evaluation</option>
                  <option value="Talk to Ares Team">Speak with a Performance Specialist</option>
                  <option value="Apply for Certification">Apply for Provider Certification</option>
                  <option value="Just Exploring">Just Exploring Results for Now</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="how_heard" className="text-[10px] font-mono text-white/50 uppercase">How did you hear about us? *</label>
                <select
                  id="how_heard" required
                  value={leadForm.howHeard}
                  onChange={e => setLeadForm(prev => ({ ...prev, howHeard: e.target.value }))}
                  className="w-full bg-[#0a0b14]/90 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                >
                  <option value="" disabled>Select Option</option>
                  <option value="Search Engine (Google, Bing, etc.)">Search Engine (Google, Bing, etc.)</option>
                  <option value="Social Media (Instagram, Facebook, TikTok, etc.)">Social Media (Instagram, Facebook, TikTok, etc.)</option>
                  <option value="Referral (Coach, Athlete, Parent, School, Club)">Referral (Coach, Athlete, Parent, School, Club)</option>
                  <option value="Referral Partner (Doctor, Clinic, Physical Therapist)">Referral Partner (Doctor, Clinic, Physical Therapist)</option>
                  <option value="Affiliate Partner">Affiliate Partner</option>
                  <option value="Ares Event or Presentation">Ares Event or Presentation</option>
                  <option value="QR Code (Scan)">QR Code (Scan)</option>
                  <option value="Other (Please specify)">Other (Please specify)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="referral_code" className="text-[10px] font-mono text-white/50 uppercase">Referral / Affiliate Code</label>
                <input
                  type="text" id="referral_code"
                  value={leadForm.referralCode}
                  onChange={e => setLeadForm(prev => ({ ...prev, referralCode: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                  placeholder="e.g. COACH-SMITH"
                />
              </div>
            </div>

            {leadForm.howHeard === 'Other (Please specify)' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                <label htmlFor="how_heard_other" className="text-[10px] font-mono text-white/50 uppercase">Please specify *</label>
                <input
                  type="text" required id="how_heard_other"
                  value={leadForm.howHeardOther}
                  onChange={e => setLeadForm(prev => ({ ...prev, howHeardOther: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                  placeholder="Please describe how you heard about us"
                />
              </motion.div>
            )}

            <div className="flex flex-col gap-2 pt-2 select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox" id="parent_coach_toggle"
                  checked={leadForm.isParentOrCoach}
                  onChange={e => setLeadForm(prev => ({ ...prev, isParentOrCoach: e.target.checked }))}
                  className="rounded border-[var(--color-ares-border)] bg-black/40 text-[var(--color-ares-teal)] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="parent_coach_toggle" className="text-xs font-mono text-white/70 cursor-pointer uppercase">
                  I am a parent or coach filling this out on behalf of the athlete
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox" id="consent_checkbox" required
                  checked={leadForm.consent}
                  onChange={e => setLeadForm(prev => ({ ...prev, consent: e.target.checked }))}
                  className="rounded border-[var(--color-ares-border)] bg-black/40 text-[var(--color-ares-teal)] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="consent_checkbox" className="text-[10px] font-mono text-white/70 cursor-pointer uppercase">
                  I consent to receive visual-performance updates and email/text follow-ups *
                </label>
              </div>
            </div>

            {leadForm.isParentOrCoach && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                <label htmlFor="athlete_name" className="text-[10px] font-mono text-white/50 uppercase">Athlete Name *</label>
                <input
                  type="text" required id="athlete_name"
                  value={leadForm.athleteName}
                  onChange={e => setLeadForm(prev => ({ ...prev, athleteName: e.target.value }))}
                  className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                  placeholder="Athlete's Full Name"
                />
              </motion.div>
            )}

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <button
              type="submit" disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-glow mt-6 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Calculating Telemetry...</>
              ) : (
                <>Get A.R.E.S. Report <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Success Report results page */}
      {step === 'success' && (
        <div className="w-full max-w-2xl mx-auto py-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            A.R.E.S. Diagnostics Dispatched
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto font-light leading-relaxed">
            Your visual-cognitive baseline scores, sensory percentile standing, and primary performance bottleneck analysis have been successfully logged.
          </p>

          {/* Glassmorphic Report Details Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-10 text-left relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-ares-teal)]/5 rounded-full blur-[50px] pointer-events-none" />
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6 flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-[var(--color-ares-teal)]" />
              What is waiting in your inbox:
            </h4>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] mt-2 shrink-0"></span>
                <p className="text-white/80 text-sm sm:text-base leading-snug">
                  <strong>Visual Symptoms Score:</strong> An analysis of your system's susceptibility to tracking fatigue.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] mt-2 shrink-0"></span>
                <p className="text-white/80 text-sm sm:text-base leading-snug">
                  <strong>Raw & Choice Response Times:</strong> Your baseline millisecond speed compared to collegiate and professional metrics.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ares-teal)] mt-2 shrink-0"></span>
                <p className="text-white/80 text-sm sm:text-base leading-snug">
                  <strong>Primary Bottleneck Identification:</strong> Discovers if your lag is in visual *Acquisition*, brain *Routing*, or motor *Execution*.
                </p>
              </li>
            </ul>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-xs font-mono text-white/40 uppercase">Sent report to:</div>
              <div className="text-sm font-bold text-[var(--color-ares-teal)] font-mono break-all text-center sm:text-right">{leadForm.email}</div>
            </div>
            <p className="text-white/30 text-[10px] font-mono mt-3 leading-snug text-center">
              * Please check your spam, updates, or promotions folder if the email does not arrive within 60 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="primary" 
              href="/book/evaluation"
              className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow px-8 py-4"
            >
              Book Baseline Evaluation ($449)
            </Button>
            {onClose ? (
              <button 
                onClick={onClose}
                className="w-full sm:w-auto py-4 px-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wider uppercase transition-all cursor-pointer"
              >
                Close Window
              </button>
            ) : (
              <Button
                variant="outline"
                href="/"
                className="w-full sm:w-auto text-center justify-center font-bold tracking-wide px-8 py-4 cursor-pointer"
              >
                Explore Website
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Top right close button */}
      {onClose && (step === 'welcome' || step === 'survey' || step === 'success') && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all z-[110] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
