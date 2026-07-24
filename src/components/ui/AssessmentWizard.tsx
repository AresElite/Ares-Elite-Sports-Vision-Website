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
  | 'intro_raw'
  | 'drill_raw'
  | 'intro_choice'
  | 'drill_choice'
  | 'intro_mot'
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

// ---------------------------------------------------------------------------
// A.R.E.S. scoring engine — turns raw drill data + the subjective survey into a
// full, self-contained report (overall quotient, three pillar scores, detailed
// per-drill metrics, and a subjective symptom profile).
// ---------------------------------------------------------------------------
function lerp(x: number, x0: number, x1: number, y0: number, y1: number) {
  if (x <= x0) return y0;
  if (x >= x1) return y1;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}
const clampScore = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const meanOf = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

function scoreBand(score: number) {
  if (score >= 90) return { label: 'Elite', color: '#34d399' };
  if (score >= 75) return { label: 'Advanced', color: '#2dd4bf' };
  if (score >= 60) return { label: 'Proficient', color: '#29b6f6' };
  if (score >= 45) return { label: 'Developing', color: '#fbbf24' };
  return { label: 'Building', color: '#f59e0b' };
}

// Map an average reaction time (ms) onto a 0-100 speed score.
function rawSpeedScore(avg: number) {
  if (avg <= 0) return 0;
  if (avg <= 200) return 99;
  if (avg <= 240) return Math.round(lerp(avg, 200, 240, 98, 88));
  if (avg <= 280) return Math.round(lerp(avg, 240, 280, 88, 74));
  if (avg <= 320) return Math.round(lerp(avg, 280, 320, 74, 60));
  if (avg <= 380) return Math.round(lerp(avg, 320, 380, 60, 42));
  if (avg <= 460) return Math.round(lerp(avg, 380, 460, 42, 25));
  return 18;
}
function choiceSpeedScore(avg: number) {
  if (avg <= 0) return 0;
  if (avg <= 360) return 97;
  if (avg <= 440) return Math.round(lerp(avg, 360, 440, 95, 82));
  if (avg <= 520) return Math.round(lerp(avg, 440, 520, 82, 68));
  if (avg <= 620) return Math.round(lerp(avg, 520, 620, 68, 52));
  if (avg <= 760) return Math.round(lerp(avg, 620, 760, 52, 32));
  return 22;
}

interface ReportInput {
  surveyAnswers: (number | null)[];
  rawTimes: number[];
  rawFalsePositives: number;
  choiceTimes: { color: 'purple' | 'teal'; time: number; correct: boolean }[];
  motResults: { trial: number; correct: number; totalTargets: number; latency: number }[];
}

function buildAssessmentReport(input: ReportInput) {
  const { surveyAnswers, rawTimes, rawFalsePositives, choiceTimes, motResults } = input;

  // ---- Pillar 1: Raw reaction (Acquisition) ----
  const rawAvg = Math.round(meanOf(rawTimes));
  const rawFastest = rawTimes.length ? Math.min(...rawTimes) : 0;
  const rawSlowest = rawTimes.length ? Math.max(...rawTimes) : 0;
  const rawSpread = rawTimes.length ? rawSlowest - rawFastest : 0;
  const consistencyLabel =
    rawSpread <= 90 ? 'Very consistent' : rawSpread <= 160 ? 'Consistent' : rawSpread <= 250 ? 'Variable' : 'Inconsistent';
  let acquire = rawSpeedScore(rawAvg);
  acquire -= Math.min(9, rawFalsePositives * 3); // impulse control penalty
  if (rawSpread > 260) acquire -= 8;
  else if (rawSpread > 180) acquire -= 4;
  acquire = clampScore(Math.round(acquire), 5, 99);

  // ---- Pillar 2: Choice reaction (Routing). Teal = Left cue, Purple = Right cue ----
  const left = choiceTimes.filter(c => c.color === 'teal');
  const right = choiceTimes.filter(c => c.color === 'purple');
  const choiceAvg = Math.round(meanOf(choiceTimes.map(c => c.time)));
  const leftAvg = Math.round(meanOf(left.map(c => c.time)));
  const rightAvg = Math.round(meanOf(right.map(c => c.time)));
  const overallAcc = choiceTimes.length ? Math.round((choiceTimes.filter(c => c.correct).length / choiceTimes.length) * 100) : 0;
  const leftAcc = left.length ? Math.round((left.filter(c => c.correct).length / left.length) * 100) : 0;
  const rightAcc = right.length ? Math.round((right.filter(c => c.correct).length / right.length) * 100) : 0;
  const balanceDiff = leftAvg && rightAvg ? Math.abs(leftAvg - rightAvg) : 0;
  const balanceLabel = balanceDiff <= 35 ? 'Well balanced' : balanceDiff <= 70 ? 'Slight asymmetry' : 'Notable asymmetry';
  const fasterSide = leftAvg && rightAvg ? (leftAvg < rightAvg ? 'Left' : 'Right') : '—';
  const decisionCost = choiceAvg && rawAvg ? choiceAvg - rawAvg : 0;
  let route = Math.round(0.55 * overallAcc + 0.45 * choiceSpeedScore(choiceAvg));
  if (balanceDiff > 90) route -= 5;
  else if (balanceDiff > 60) route -= 2;
  route = clampScore(route, 5, 99);

  // ---- Pillar 3: Multiple Object Tracking (Execution) ----
  const motTotalTargets = motResults.reduce((s, r) => s + r.totalTargets, 0);
  const motCorrect = motResults.reduce((s, r) => s + r.correct, 0);
  const motAcc = motTotalTargets ? Math.round((motCorrect / motTotalTargets) * 100) : 0;
  const motAvgLatency = motResults.length ? Math.round(meanOf(motResults.map(r => r.latency))) : 0;
  let execute = motAcc;
  if (motAvgLatency > 0) {
    if (motAvgLatency <= 1200) execute += 4;
    else if (motAvgLatency > 2600) execute -= 8;
    else if (motAvgLatency > 2000) execute -= 4;
  }
  execute = clampScore(Math.round(execute), 5, 99);

  // ---- Overall A.R.E.S. Quotient ----
  const quotient = clampScore(Math.round(0.3 * acquire + 0.35 * route + 0.35 * execute), 5, 99);

  // ---- Subjective symptom profile (0 = never, 10 = always; higher = more symptoms) ----
  const catDefs = [
    { key: 'fatigue', name: 'Visual Stamina & Focus', idx: [0, 1, 2] },
    { key: 'tracking', name: 'Dynamic Tracking & Depth', idx: [3, 4, 5] },
    { key: 'cognitive', name: 'Decision Processing', idx: [6, 7, 8] },
    { key: 'coordination', name: 'Timing & Coordination', idx: [9, 10, 11] },
  ];
  const symptoms = catDefs.map(c => {
    const sum = c.idx.reduce((s, i) => s + (surveyAnswers[i] ?? 0), 0);
    const load = Math.round((sum / (c.idx.length * 10)) * 100);
    const severity = load >= 60 ? 'High' : load >= 35 ? 'Moderate' : 'Low';
    const color = load >= 60 ? '#f87171' : load >= 35 ? '#fbbf24' : '#34d399';
    return { key: c.key, name: c.name, load, wellness: 100 - load, severity, color };
  });
  const topSymptom = symptoms.reduce((m, s) => (s.load > m.load ? s : m), symptoms[0]);
  const symptomSum = surveyAnswers.reduce((s: number, v) => s + (v || 0), 0);

  // ---- Pillars ----
  const pillars = [
    { key: 'ACQUIRE', name: 'Visual Acquisition', desc: 'Detecting and reacting to what appears', score: acquire, band: scoreBand(acquire) },
    { key: 'ROUTE', name: 'Decision Routing', desc: 'Choosing the right response under pressure', score: route, band: scoreBand(route) },
    { key: 'EXECUTE', name: 'Tracking & Execution', desc: 'Holding multiple moving targets and acting', score: execute, band: scoreBand(execute) },
  ];
  const focusPillar = pillars.reduce((min, p) => (p.score < min.score ? p : min), pillars[0]);
  const topPillar = [...pillars].sort((a, b) => b.score - a.score)[0];
  const focusMap: Record<string, string> = {
    ACQUIRE: 'sharpening raw reaction speed and impulse control so you start moving sooner — without false starts',
    ROUTE: 'speeding up decisions and cutting wrong choices when more than one option is on the field',
    EXECUTE: 'expanding how many moving objects you can hold at once so you lose the play less often',
  };
  const summary = `Your strongest edge is ${topPillar.name.toLowerCase()}. Your biggest opportunity is ${focusPillar.name.toLowerCase()} — the priority is ${focusMap[focusPillar.key]}. On the subjective side, your most-reported area is "${topSymptom.name}" (${topSymptom.severity.toLowerCase()} symptom load).`;

  return {
    quotient,
    quotientBand: scoreBand(quotient),
    pillars,
    focusPillar,
    topPillar,
    summary,
    raw: { avg: rawAvg, fastest: rawFastest, slowest: rawSlowest, spread: rawSpread, falseStarts: rawFalsePositives, consistencyLabel, score: acquire, band: scoreBand(acquire) },
    choice: { avg: choiceAvg, accuracy: overallAcc, leftAvg, leftAcc, rightAvg, rightAcc, balanceDiff, balanceLabel, fasterSide, decisionCost, score: route, band: scoreBand(route) },
    mot: { accuracy: motAcc, avgLatency: motAvgLatency, trials: motResults, score: execute, band: scoreBand(execute) },
    symptoms,
    topSymptom,
    symptomSum,
  };
}

function DrillIntro({
  index, Icon, title, measures, why, steps, trials, accent, onStart,
}: {
  index: number;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  measures: string;
  why: string;
  steps: string[];
  trials: string;
  accent: string;
  onStart: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto w-full text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5" style={{ color: accent }}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Drill {index} of 3 · {trials}</span>
      <h2 className="text-2xl md:text-3xl font-black text-white uppercase mt-2 mb-4">{title}</h2>

      <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: accent }}>What it measures</p>
        <p className="text-white/80 text-sm leading-relaxed mb-4">{measures}</p>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: accent }}>Why it matters</p>
        <p className="text-white/80 text-sm leading-relaxed">{why}</p>
      </div>

      <div className="text-left bg-black/30 border border-white/5 rounded-2xl p-5 mb-6">
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3">How to do it</p>
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-white/80 text-sm leading-snug">
              <span className="shrink-0 w-5 h-5 rounded-full bg-white/10 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <Button variant="primary" onClick={onStart} className="px-10 py-4 font-bold tracking-wide">
        I'm Ready — Start <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
      <p className="text-white/30 text-[11px] font-mono mt-4 uppercase tracking-wider">The drill begins as soon as you tap Start</p>
    </div>
  );
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
  const choiceInputRef = useRef<(c: 'purple' | 'teal') => void>(() => {});

  const [motTrial, setMotTrial] = useState(0);
  const [motState, setMotState] = useState<'idle' | 'highlight' | 'motion' | 'select' | 'feedback'>('idle');
  const [motResults, setMotResults] = useState<{ trial: number; correct: number; totalTargets: number; latency: number }[]>([]);
  const [motSelectedCount, setMotSelectedCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const motBallsRef = useRef<MOTBall[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const motSelectStartTimeRef = useRef<number>(0);

  const [leadForm, setLeadForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', sport: '', role: '', competitiveLevel: '', location: '',
    primaryConcern: '', primaryConcernOther: '', urgency: '', desiredNextStep: '',
    howHeard: '', howHeardOther: '', referralCode: '', isParentOrCoach: false, athleteName: '', consent: true
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
    rawFlashTimeRef.current = 0;
    const delay = 1500 + Math.random() * 2500;
    if (rawTimerRef.current) clearTimeout(rawTimerRef.current);
    rawTimerRef.current = setTimeout(() => {
      setRawState('flash');
      // Stamp stimulus onset at ACTUAL paint (double rAF) so the flash's render/paint
      // cost is never counted as reaction time. Same technique for the choice drill,
      // so raw and choice are measured on an identical basis.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        rawFlashTimeRef.current = performance.now();
      }));
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
      if (rawHasClickedRef.current || rawFlashTimeRef.current === 0) return; // ignore clicks before onset is stamped
      rawHasClickedRef.current = true;
      const rt = Math.max(130, Math.round(performance.now() - rawFlashTimeRef.current));
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
      setRawState('idle');
      nextStep('intro_choice');
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
    choiceFlashTimeRef.current = 0;
    const delay = 1200 + Math.random() * 1800;
    if (choiceTimerRef.current) clearTimeout(choiceTimerRef.current);
    choiceTimerRef.current = setTimeout(() => {
      setChoiceTargetColor(Math.random() > 0.5 ? 'purple' : 'teal');
      setChoiceState('target');
      // Stamp onset at actual paint — identical basis to the raw drill.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        choiceFlashTimeRef.current = performance.now();
      }));
    }, delay);
  };

  const handleChoiceInput = (inputColor: 'purple' | 'teal') => {
    if (choiceState !== 'target' || !choiceTargetColor || choiceHasClickedRef.current || choiceFlashTimeRef.current === 0) return;
    choiceHasClickedRef.current = true;
    const rt = Math.max(160, Math.round(performance.now() - choiceFlashTimeRef.current));
    const isCorrect = inputColor === choiceTargetColor;
    setChoiceTimes(prev => [...prev, { color: choiceTargetColor, time: rt, correct: isCorrect }]);
    setChoiceWasError(!isCorrect);
    setChoiceState('feedback');
    setTimeout(() => {
      if (choiceTrial < 5) {
        setChoiceTrial(prev => prev + 1);
        triggerChoiceNextTrial();
      } else {
        setChoiceState('idle');
        nextStep('intro_mot');
      }
    }, 1000);
  };

  // Keep a ref pointing at the freshest handler so the keyboard listener never fires stale state.
  choiceInputRef.current = handleChoiceInput;

  // Keyboard support for the Choice Reaction drill: T / Left = teal, P / Right = purple.
  useEffect(() => {
    if (step !== 'drill_choice') return;
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 't' || e.key === 'ArrowLeft') {
        e.preventDefault();
        choiceInputRef.current('teal');
      } else if (key === 'p' || e.key === 'ArrowRight') {
        e.preventDefault();
        choiceInputRef.current('purple');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [step]);

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

    // Spawn each ball in a spot that does NOT overlap any already-placed ball.
    // Without this, balls (especially in the 6-ball trial) can start fused together.
    const minSeparation = radius * 2 + 10;
    for (let i = 0; i < ballCount; i++) {
      let x = 0, y = 0, placed = false, tries = 0;
      while (!placed && tries < 300) {
        x = radius + 20 + Math.random() * (width - 2 * radius - 40);
        y = radius + 20 + Math.random() * (height - 2 * radius - 40);
        placed = balls.every(b => Math.hypot(b.x - x, b.y - y) >= minSeparation);
        tries++;
      }
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
            const dist = Math.hypot(dx, dy) || 0.0001;
            const minDist = b1.radius + b2.radius;
            if (dist < minDist) {
              const nx = dx / dist, ny = dy / dist;
              // 1. Positional correction: push the two balls apart so they never fuse/overlap.
              const overlap = (minDist - dist) / 2;
              b1.x -= nx * overlap; b1.y -= ny * overlap;
              b2.x += nx * overlap; b2.y += ny * overlap;
              // 2. Velocity exchange ONLY if they are actually moving toward each other.
              //    (Skipping this guard is what let overlapping balls lock together and spin.)
              const relVel = (b1.vx - b2.vx) * nx + (b1.vy - b2.vy) * ny;
              if (relVel > 0) {
                b1.vx -= relVel * nx; b1.vy -= relVel * ny;
                b2.vx += relVel * nx; b2.vy += relVel * ny;
              }
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
    const purpleAvg = purpleTrials.length > 0 ? Math.round(purpleTrials.reduce((s, t) => s + t.time, 0) / purpleTrials.length) : 0;
    const tealAvg = tealTrials.length > 0 ? Math.round(tealTrials.reduce((s, t) => s + t.time, 0) / tealTrials.length) : 0;
    const rawFastest = rawTimes.length > 0 ? Math.min(...rawTimes) : 0;
    const rawSlowest = rawTimes.length > 0 ? Math.max(...rawTimes) : 0;
    const recAcc = motResults.length > 0 ? Math.round((motResults.reduce((s, r) => s + r.correct, 0) / motResults.reduce((s, r) => s + r.totalTargets, 0)) * 100) : 0;
    const recAvg = motResults.length > 0 ? Math.round(motResults.reduce((s, r) => s + r.latency, 0) / motResults.length) : 0;
    return { surveyScore: surveyAnswers.reduce((s, v) => s + (v || 0), 0), rawAvg, rawFastest, rawSlowest, rawFalsePositives, purpleAcc, tealAcc, purpleAvg, tealAvg, pesDiff: 0, recAvg, recAcc };
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const m = getCalculatedMetrics();
    const quotient = calculatePercentile(m.rawAvg, (m.tealAcc + m.purpleAcc) / 2, m.recAcc, m.recAvg);
    const bottleneck = m.rawAvg > 260 ? 'Acquire Bottleneck' : (m.recAcc < 80 ? 'Route Bottleneck' : 'Execute Bottleneck');
    setBottleneckResult(bottleneck);

    const ss = (k: string) => { try { return sessionStorage.getItem(k) || undefined; } catch { return undefined; } };

    // Map front-end metric names to the exact fields the /api/submit-assessment endpoint expects,
    // so the stored record and the emailed telemetry report are populated (not blank).
    const payload = {
      ...leadForm,
      leadSource: 'Assessment',
      landingPage: ss('landing_page') || '/',
      utmSource: ss('utm_source'),
      utmMedium: ss('utm_medium'),
      utmCampaign: ss('utm_campaign'),
      utmContent: ss('utm_content'),
      utmTerm: ss('utm_term'),
      questionnaireScore: m.surveyScore,
      questionnaireData: JSON.stringify(surveyAnswers),
      rawRtAvg: m.rawAvg,
      rawRtFastest: m.rawFastest,
      rawRtSlowest: m.rawSlowest,
      rawRtFalsePositives: m.rawFalsePositives,
      choiceRtPurpleAvg: m.purpleAvg,
      choiceRtPurpleAcc: m.purpleAcc,
      choiceRtTealAvg: m.tealAvg,
      choiceRtTealAcc: m.tealAcc,
      choiceRtPostErrorSlowing: 0,
      recSpeedAvg: m.recAvg,
      recSpeedAcc: m.recAcc,
      aresQuotient: quotient,
      bottleneckProfile: bottleneck,
    };
    try {
      const resp = await fetch('/api/submit-assessment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!resp.ok) throw new Error('bad status');
      nextStep('success');
    } catch (err) {
      setSubmitError("Submission failed. Please check your connection and try again.");
    }
    setIsSubmitting(false);
  };

  const report = buildAssessmentReport({ surveyAnswers, rawTimes, rawFalsePositives, choiceTimes, motResults });

  return (
    <div className={`relative w-full ${isEmbedded ? 'max-w-4xl p-6 md:p-10 bg-[var(--color-ares-charcoal)]/90 backdrop-blur-xl border border-[var(--color-ares-border)] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.5)]' : 'h-full flex flex-col justify-center'}`}>
      {(step === 'intro_raw' || step === 'drill_raw' || step === 'intro_choice' || step === 'drill_choice' || step === 'intro_mot' || step === 'drill_recognition') && (() => {
        const order = ['intro_raw', 'drill_raw', 'intro_choice', 'drill_choice', 'intro_mot', 'drill_recognition'];
        const pos = order.indexOf(step);
        const doneOr = (drillStart: number) => pos > drillStart + 1;
        const activeOr = (drillStart: number) => pos === drillStart || pos === drillStart + 1;
        return (
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
            <div className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${activeOr(0) ? 'bg-[var(--color-ares-purple)]' : (doneOr(0) ? 'bg-emerald-500' : 'bg-white/10')}`} />
              <span className="text-[10px] uppercase font-mono">1. Raw Speed</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${activeOr(2) ? 'bg-[var(--color-ares-teal)]' : (doneOr(2) ? 'bg-emerald-500' : 'bg-white/10')}`} />
              <span className="text-[10px] uppercase font-mono">2. Choice</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${activeOr(4) ? 'bg-[var(--color-ares-purple)]' : 'bg-white/10'}`} />
              <span className="text-[10px] uppercase font-mono">3. Tracking</span>
            </div>
          </div>
        );
      })()}

      {step === 'welcome' && (
        <div className="text-center max-w-2xl mx-auto">
          <Brain className="w-20 h-20 text-[var(--color-ares-teal)] mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-6 uppercase">UNLEASH YOUR DECISION SPEED</h2>
          <p className="text-white/60 mb-10">Take our 12-question profile and 3 neuro-motor drills to map your visual latency.</p>
          <Button variant="primary" onClick={() => nextStep('survey')}>Start Assessment <ArrowRight className="ml-2 w-4 h-4" /></Button>
        </div>
      )}

      {step === 'survey' && (
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Question {currentQuestionIndex + 1} / {QUESTIONS.length}
            </span>
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevQuestion} className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                ← Back
              </button>
            )}
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-[var(--color-ares-teal)] transition-all" style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }} />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug">{QUESTIONS[currentQuestionIndex].text}</h3>

          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3 px-1">
            <span>0 — Never</span>
            <span>10 — Always</span>
          </div>
          <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => {
              const selected = surveyAnswers[currentQuestionIndex] === v;
              return (
                <button
                  key={v}
                  onClick={() => handleAnswerSurvey(v)}
                  className={`py-3 sm:py-4 rounded-lg border text-sm sm:text-base font-bold transition-all ${
                    selected
                      ? 'bg-[var(--color-ares-teal)] border-[var(--color-ares-teal)] text-[var(--color-ares-bg)]'
                      : 'bg-white/5 hover:bg-[var(--color-ares-teal)]/20 border-white/10 text-white'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
          <p className="text-white/30 text-[11px] font-mono mt-4 text-center uppercase tracking-wider">Tap a number to continue</p>
        </div>
      )}

      {step === 'transition_drills' && (
        <div className="max-w-xl mx-auto text-center">
          <Target className="w-16 h-16 text-[var(--color-ares-teal)] mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-4 uppercase">3 Quick Performance Drills</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Next you'll run three short, interactive drills that measure how fast you see, decide, and track. Each one starts with a quick explanation and a Start button, so you can begin when you're ready. Use a mouse or your finger, and give it your best effort — it takes about 3 minutes.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Timer className="w-5 h-5 text-[var(--color-ares-purple)] mb-2" />
              <p className="text-white text-xs font-bold uppercase leading-tight">Raw Reaction Speed</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Brain className="w-5 h-5 text-[var(--color-ares-teal)] mb-2" />
              <p className="text-white text-xs font-bold uppercase leading-tight">Choice Reaction</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Eye className="w-5 h-5 text-[var(--color-ares-purple)] mb-2" />
              <p className="text-white text-xs font-bold uppercase leading-tight">Object Tracking</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => nextStep('intro_raw')} className="px-10 py-4">Continue <ArrowRight className="ml-2 w-4 h-4" /></Button>
        </div>
      )}

      {step === 'intro_raw' && (
        <DrillIntro
          index={1}
          Icon={Timer}
          title="Raw Reaction Speed"
          trials="6 trials"
          accent="var(--color-ares-purple)"
          measures="Your simplest visual-motor reflex — how quickly your hand fires the instant a target appears. This is the pure, no-decision baseline of your reaction time."
          why="Every play starts with the first flicker of motion. A faster raw reaction means you begin moving milliseconds sooner than your opponent — the edge that decides 50/50 balls, jumps, and starts."
          steps={[
            'Watch the empty circle in the box and stay focused.',
            'The moment it flashes PURPLE and says “TAP NOW”, click or tap as fast as you can.',
            'Don’t jump early — tapping before the flash counts as a false start.',
          ]}
          onStart={() => { nextStep('drill_raw'); startRawDrill(); }}
        />
      )}

      {step === 'intro_choice' && (
        <DrillIntro
          index={2}
          Icon={Brain}
          title="Choice Reaction"
          trials="6 trials"
          accent="var(--color-ares-teal)"
          measures="Decision speed under time pressure. Your brain has to identify WHICH target appeared and pick the matching response — so this captures both how fast and how accurately you choose."
          why="Real competition is rarely one option. Reading a defender, a pitch, or a car ahead and choosing the right response a split-second faster — without guessing wrong — is what separates elite decision-makers."
          steps={[
            'A circle will flash either TEAL or PURPLE in the box.',
            'Tap the matching button below (or press T / Left for teal, P / Right for purple).',
            'Be fast, but accuracy counts — a wrong color is scored as an error.',
          ]}
          onStart={() => { nextStep('drill_choice'); startChoiceDrill(); }}
        />
      )}

      {step === 'intro_mot' && (
        <DrillIntro
          index={3}
          Icon={Eye}
          title="Multiple Object Tracking"
          trials="3 trials, increasing difficulty"
          accent="var(--color-ares-purple)"
          measures="Your ability to hold and track several moving objects at once — a core measure of dynamic visual attention and spatial memory."
          why="Following the ball while tracking players, lanes, or opponents is constant in sport. Athletes who track more objects at once read the whole field, anticipate earlier, and lose the play far less often."
          steps={[
            'A few balls will briefly highlight TEAL — memorize which ones.',
            'All balls turn purple and move around; keep your eyes on your targets.',
            'When they stop, tap the balls you tracked. Trial 3 adds one more target.',
          ]}
          onStart={() => { nextStep('drill_recognition'); startMotDrill(); }}
        />
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
        <div className="w-full max-w-3xl mx-auto py-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Your Complete A.R.E.S. Report
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-lg mx-auto font-light leading-relaxed">
            Your full visual-cognitive breakdown — every drill scored, plus your symptom profile — laid out below.
          </p>

          {/* Overall quotient */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-ares-teal)]/5 rounded-full blur-[50px] pointer-events-none" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Overall A.R.E.S. Quotient</span>
              <div className="text-6xl sm:text-7xl font-black leading-none" style={{ color: report.quotientBand.color }}>
                {report.quotient}<span className="text-2xl text-white/30 font-bold">/100</span>
              </div>
              <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: `${report.quotientBand.color}22`, color: report.quotientBand.color }}>
                {report.quotientBand.label} · ~{report.quotient}th percentile
              </span>
              <p className="text-white/50 text-sm mt-4 max-w-md leading-relaxed">{report.summary}</p>
            </div>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {report.pillars.map(p => (
              <div key={p.key} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">{p.key}</div>
                <div className="text-[9px] text-white/30 uppercase mb-2 leading-tight min-h-[1.75rem]">{p.name}</div>
                <div className="text-3xl font-black" style={{ color: p.band.color }}>{p.score}</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.score}%`, backgroundColor: p.band.color }} />
                </div>
                <div className="text-[10px] font-bold uppercase mt-1.5" style={{ color: p.band.color }}>{p.band.label}</div>
              </div>
            ))}
          </div>

          {/* Raw Reaction detail */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-4 text-left">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Timer className="w-4 h-4 text-[var(--color-ares-purple)]" /> Raw Reaction Speed</h4>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase" style={{ backgroundColor: `${report.raw.band.color}22`, color: report.raw.band.color }}>{report.raw.band.label} · {report.raw.score}</span>
            </div>
            <div className="grid sm:grid-cols-2 sm:gap-x-6">
              {[
                ['Average reaction', `${report.raw.avg} ms`],
                ['Fastest trial', `${report.raw.fastest} ms`],
                ['Slowest trial', `${report.raw.slowest} ms`],
                ['Consistency', `${report.raw.spread} ms · ${report.raw.consistencyLabel}`],
                ['False starts', `${report.raw.falseStarts}`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/50 text-xs sm:text-sm">{l}</span>
                  <span className="text-white font-mono font-bold text-xs sm:text-sm">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Choice Reaction detail incl. Right vs Left */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-4 text-left">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Brain className="w-4 h-4 text-[var(--color-ares-teal)]" /> Choice Reaction</h4>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase" style={{ backgroundColor: `${report.choice.band.color}22`, color: report.choice.band.color }}>{report.choice.band.label} · {report.choice.score}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-black/30 border border-[var(--color-ares-teal)]/20 rounded-xl p-3 text-center">
                <div className="text-[10px] font-mono uppercase text-[var(--color-ares-teal)]">Left (Teal)</div>
                <div className="text-lg font-black text-white font-mono">{report.choice.leftAvg} ms</div>
                <div className="text-[11px] text-white/50">{report.choice.leftAcc}% accurate</div>
              </div>
              <div className="bg-black/30 border border-[var(--color-ares-purple)]/20 rounded-xl p-3 text-center">
                <div className="text-[10px] font-mono uppercase text-[var(--color-ares-purple)]">Right (Purple)</div>
                <div className="text-lg font-black text-white font-mono">{report.choice.rightAvg} ms</div>
                <div className="text-[11px] text-white/50">{report.choice.rightAcc}% accurate</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 sm:gap-x-6">
              {[
                ['Overall average', `${report.choice.avg} ms`],
                ['Overall accuracy', `${report.choice.accuracy}%`],
                ['L / R balance', `${report.choice.balanceDiff} ms · ${report.choice.balanceLabel}`],
                ['Faster side', report.choice.fasterSide],
                ['Decision cost vs. raw', `${report.choice.decisionCost >= 0 ? '+' : ''}${report.choice.decisionCost} ms`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/50 text-xs sm:text-sm">{l}</span>
                  <span className="text-white font-mono font-bold text-xs sm:text-sm">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MOT detail */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-4 text-left">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Eye className="w-4 h-4 text-[var(--color-ares-purple)]" /> Multiple Object Tracking</h4>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase" style={{ backgroundColor: `${report.mot.band.color}22`, color: report.mot.band.color }}>{report.mot.band.label} · {report.mot.score}</span>
            </div>
            <div className="grid grid-cols-2 sm:gap-x-6 mb-3">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50 text-xs sm:text-sm">Overall accuracy</span>
                <span className="text-white font-mono font-bold text-xs sm:text-sm">{report.mot.accuracy}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50 text-xs sm:text-sm">Avg select time</span>
                <span className="text-white font-mono font-bold text-xs sm:text-sm">{report.mot.avgLatency} ms</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {report.mot.trials.map(t => (
                <div key={t.trial} className="bg-black/30 border border-white/5 rounded-xl p-2 text-center">
                  <div className="text-[10px] font-mono uppercase text-white/40">Trial {t.trial}</div>
                  <div className="text-sm font-black text-white">{t.correct}/{t.totalTargets}</div>
                  <div className="text-[10px] text-white/40 font-mono">{t.latency} ms</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjective symptom profile */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-4 text-left">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-3"><Activity className="w-4 h-4 text-[var(--color-ares-teal)]" /> Your Symptom Profile</h4>
            <p className="text-white/50 text-xs mb-4 leading-snug">From your 12 answers. Longer bars = symptoms you reported more often in that area.</p>
            <div className="space-y-3">
              {report.symptoms.map(s => (
                <div key={s.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">{s.name}</span>
                    <span className="font-mono font-bold" style={{ color: s.color }}>{s.severity} · {s.load}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.load}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focus / recommendation */}
          <div className="bg-[var(--color-ares-teal)]/5 border border-[var(--color-ares-teal)]/20 rounded-2xl p-5 sm:p-6 mb-6 text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ares-teal)]">Your #1 focus</span>
            <p className="text-white text-lg font-bold mt-1">{report.focusPillar.name} <span className="text-white/40 text-sm font-mono">({report.focusPillar.score}/100)</span></p>
            <p className="text-white/60 text-sm mt-2 leading-relaxed">
              This pillar scored lowest, so it's where focused training pays off fastest. A full in-office evaluation measures it precisely and builds a plan to close the gap — most athletes see measurable gains within a few weeks.
            </p>
            <p className="text-white/30 text-[10px] font-mono mt-4 leading-snug">
              Screening for orientation, not a clinical diagnosis. Your in-office evaluation adds eye-tracking depth and a calibrated baseline.
            </p>
          </div>

          <p className="text-white/40 text-xs font-mono mb-8 text-center leading-relaxed">
            Results saved for {leadForm.email}. Screenshot this page to keep your baseline, then book an evaluation to lock it in.
          </p>

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
