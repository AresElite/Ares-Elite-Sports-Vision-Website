import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Brain, Target, Timer, ChevronRight, CheckCircle2, 
  AlertCircle, ArrowRight, Loader2, Award, Eye, Activity
} from 'lucide-react';
import { Button } from './Button';

type ModalStep = 
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
  { id: 1, text: "Do you experience eye strain, dryness, or headaches after looking at screens?", category: 'fatigue' },
  { id: 2, text: "How often do you average more than 4 hours of digital screen time daily?", category: 'fatigue' },
  { id: 3, text: "Do you find yourself squinting or tilting your head to see distant objects clearly?", category: 'fatigue' },
  { id: 4, text: "How often do you lose track of the ball/puck in high-speed plays?", category: 'tracking' },
  { id: 5, text: "Do you struggle to maintain focus in your peripheral field?", category: 'tracking' },
  { id: 6, text: "Do you feel like you react late to sudden movements or changes of direction?", category: 'tracking' },
  { id: 7, text: "Do you experience double vision or blurriness under physical fatigue?", category: 'fatigue' },
  { id: 8, text: "How often do you misjudge distance or the speed of an incoming object?", category: 'tracking' },
  { id: 9, text: "Do you hesitate before making a critical pass, shot, or split-second decision?", category: 'cognitive' },
  { id: 10, text: "Do you make more cognitive mistakes in the final minutes of a game?", category: 'cognitive' },
  { id: 11, text: "How often do you feel mentally drained or overwhelmed during high-pressure plays?", category: 'cognitive' },
  { id: 12, text: "Do you struggle to transition focus quickly between near and far distances?", category: 'fatigue' },
  { id: 13, text: "How often do you find yourself reacting physically before your brain has fully processed the play?", category: 'cognitive' },
  { id: 14, text: "Do you experience poor timing or coordination when executing fast movements?", category: 'coordination' },
  { id: 15, text: "Do you find it difficult to track multiple moving targets at the same time?", category: 'tracking' },
  { id: 16, text: "How often do you get caught off guard by plays coming from your blind spots?", category: 'tracking' },
  { id: 17, text: "Does bright glare or poor stadium lighting significantly affect your performance?", category: 'fatigue' },
  { id: 18, text: "Do you experience slow visual recovery or sluggish focus after high impact?", category: 'cognitive' },
  { id: 19, text: "Do you feel your eye movements are sluggish when tracking rapid motion?", category: 'coordination' },
  { id: 20, text: "Do you experience mild motion sickness or coordination drop during fast-paced drills?", category: 'coordination' }
];

const RECOGNITION_SYMBOLS = [
  ['←', '↑', '→'],
  ['→', '→', '↑'],
  ['↓', '←', '↓'],
  ['↑', '→', '←'],
  ['←', '↓', '→']
];

const RECOGNITION_OPTIONS = [
  [['←', '↑', '→'], ['←', '↓', '→'], ['→', '↑', '←'], ['←', '↑', '←']],
  [['→', '→', '↑'], ['→', '↑', '↑'], ['←', '→', '↑'], ['→', '→', '↓']],
  [['↓', '←', '↓'], ['↓', '→', '↓'], ['↑', '←', '↑'], ['↓', '←', '↑']],
  [['↑', '→', '←'], ['↑', '←', '←'], ['↓', '→', '←'], ['↑', '→', '→']],
  [['←', '↓', '→'], ['←', '↑', '→'], ['→', '↓', '←'], ['←', '↓', '↓']]
];

export function AssessmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>('welcome');
  
  // Questionnaire States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<(number | null)[]>(new Array(20).fill(null));
  
  // Single click lock refs
  const rawHasClickedRef = useRef(false);
  const choiceHasClickedRef = useRef(false);
  const recHasClickedRef = useRef(false);
  
  // Drill 1: Raw RT States
  const [rawTrial, setRawTrial] = useState(0);
  const [rawState, setRawState] = useState<'idle' | 'waiting' | 'flash' | 'feedback'>('idle');
  const [rawTimes, setRawTimes] = useState<number[]>([]);
  const [rawFalsePositives, setRawFalsePositives] = useState(0);
  const rawTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rawFlashTimeRef = useRef<number>(0);

  // Drill 2: Choice RT States
  const [choiceTrial, setChoiceTrial] = useState(0);
  const [choiceState, setChoiceState] = useState<'idle' | 'waiting' | 'target' | 'feedback'>('idle');
  const [choiceTargetColor, setChoiceTargetColor] = useState<'purple' | 'teal' | null>(null);
  const [choiceTimes, setChoiceTimes] = useState<{ color: 'purple' | 'teal'; time: number; correct: boolean }[]>([]);
  const [choiceWasError, setChoiceWasError] = useState(false); // tracking for PES
  const choiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const choiceFlashTimeRef = useRef<number>(0);

  // Drill 3: Recognition Speed States
  const [recTrial, setRecTrial] = useState(0);
  const [recState, setRecState] = useState<'idle' | 'countdown' | 'flash' | 'select' | 'feedback'>('idle');
  const [recTimes, setRecTimes] = useState<{ time: number; correct: boolean }[]>([]);
  const [recCountdown, setRecCountdown] = useState(3);
  const recTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recStartTimeRef = useRef<number>(0);

  // Lead Capture States
  const [leadForm, setLeadForm] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    age: '', 
    athleteName: '', 
    parentGuardianName: '', 
    sport: '',
    isParentOrCoach: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // First time visitor check
  useEffect(() => {
    const isCompleted = localStorage.getItem('assessmentCompleted');
    if (isCompleted !== 'true') {
      // Trigger modal 3 seconds after load (Cinematic Intro completes)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Set cookie/localStorage so they aren't bugged again in this session
    localStorage.setItem('assessmentCompleted', 'true');
  };

  const nextStep = (next: ModalStep) => {
    setStep(next);
  };

  const handleAnswerSurvey = (value: number) => {
    const newAnswers = [...surveyAnswers];
    newAnswers[currentQuestionIndex] = value;
    setSurveyAnswers(newAnswers);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      nextStep('transition_drills');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // DRILL 1: RAW REACTION TIME LOGIC
  const startRawDrill = () => {
    setRawTrial(0);
    setRawTimes([]);
    setRawFalsePositives(0);
    triggerRawNextTrial();
  };

  const triggerRawNextTrial = () => {
    setRawState('waiting');
    rawHasClickedRef.current = false;
    const delay = 1500 + Math.random() * 2500; // 1.5s to 4s random delay
    if (rawTimerRef.current) clearTimeout(rawTimerRef.current);
    
    rawTimerRef.current = setTimeout(() => {
      setRawState('flash');
      rawFlashTimeRef.current = performance.now();
    }, delay);
  };

  const handleRawClick = () => {
    if (rawState === 'waiting') {
      if (rawHasClickedRef.current) return;
      rawHasClickedRef.current = true;
      // False positive
      if (rawTimerRef.current) clearTimeout(rawTimerRef.current);
      setRawFalsePositives(prev => prev + 1);
      setRawState('feedback');
      // Show penalty briefly
      setTimeout(() => {
        advanceRawTrial();
      }, 1000);
    } else if (rawState === 'flash') {
      if (rawHasClickedRef.current) return;
      rawHasClickedRef.current = true;
      const clickTime = performance.now();
      const rt = clickTime - rawFlashTimeRef.current;
      setRawTimes(prev => [...prev, rt]);
      setRawState('feedback');
      setTimeout(() => {
        advanceRawTrial();
      }, 1000);
    }
  };

  const advanceRawTrial = () => {
    if (rawTrial < 4) {
      setRawTrial(prev => prev + 1);
      triggerRawNextTrial();
    } else {
      // Transition to choice reaction
      nextStep('drill_choice');
      startChoiceDrill();
    }
  };

  // DRILL 2: CHOICE REACTION TIME LOGIC
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
    const delay = 1200 + Math.random() * 1800; // 1.2s to 3s delay
    if (choiceTimerRef.current) clearTimeout(choiceTimerRef.current);
    
    choiceTimerRef.current = setTimeout(() => {
      const color = Math.random() > 0.5 ? 'purple' : 'teal';
      setChoiceTargetColor(color);
      setChoiceState('target');
      choiceFlashTimeRef.current = performance.now();
    }, delay);
  };

  const handleChoiceInput = (inputColor: 'purple' | 'teal') => {
    if (choiceState !== 'target' || !choiceTargetColor || choiceHasClickedRef.current) return;
    choiceHasClickedRef.current = true;
    
    const clickTime = performance.now();
    const rt = clickTime - choiceFlashTimeRef.current;
    const isCorrect = inputColor === choiceTargetColor;

    setChoiceTimes(prev => [...prev, { color: choiceTargetColor, time: rt, correct: isCorrect }]);
    setChoiceWasError(!isCorrect);
    setChoiceState('feedback');

    setTimeout(() => {
      if (choiceTrial < 7) {
        setChoiceTrial(prev => prev + 1);
        triggerChoiceNextTrial();
      } else {
        nextStep('drill_recognition');
        startRecDrill();
      }
    }, 1000);
  };

  // Keyboard navigation for Choice RT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step !== 'drill_choice' || choiceState !== 'target') return;
      if (e.key === 'ArrowLeft' || e.key === 't' || e.key === 'T') {
        handleChoiceInput('teal');
      } else if (e.key === 'ArrowRight' || e.key === 'p' || e.key === 'P') {
        handleChoiceInput('purple');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, choiceState, choiceTargetColor]);

  // DRILL 3: RECOGNITION SPEED LOGIC
  const startRecDrill = () => {
    setRecTrial(0);
    setRecTimes([]);
    runRecCountdown();
  };

  const runRecCountdown = () => {
    setRecState('countdown');
    setRecCountdown(3);
    recHasClickedRef.current = false;
    
    let currentCount = 3;
    if (recTimerRef.current) clearInterval(recTimerRef.current);

    recTimerRef.current = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setRecCountdown(currentCount);
      } else {
        clearInterval(recTimerRef.current!);
        flashRecPattern();
      }
    }, 1000) as any;
  };

  const flashRecPattern = () => {
    setRecState('flash');
    recHasClickedRef.current = false;
    
    // Flash target for 800ms
    setTimeout(() => {
      setRecState('select');
      recStartTimeRef.current = performance.now();
    }, 800);
  };

  const handleRecSelect = (option: string[]) => {
    if (recState !== 'select' || recHasClickedRef.current) return;
    recHasClickedRef.current = true;
    
    const clickTime = performance.now();
    const rt = clickTime - recStartTimeRef.current;
    
    const targetPattern = RECOGNITION_SYMBOLS[recTrial];
    const isCorrect = option.join('') === targetPattern.join('');

    setRecTimes(prev => [...prev, { time: rt, correct: isCorrect }]);
    setRecState('feedback');

    setTimeout(() => {
      if (recTrial < 4) {
        setRecTrial(prev => prev + 1);
        runRecCountdown();
      } else {
        nextStep('lead_capture');
      }
    }, 1000);
  };

  // CALCULATE TELEMETRY METRICS
  const getCalculatedMetrics = () => {
    // 1. Survey Score
    const surveyScore = surveyAnswers.reduce((sum, val) => sum + val, 0);
    
    // 2. Raw RT
    const rawAvg = rawTimes.length > 0 ? Math.round(rawTimes.reduce((s, v) => s + v, 0) / rawTimes.length) : 0;
    const rawFastest = rawTimes.length > 0 ? Math.round(Math.min(...rawTimes)) : 0;
    const rawSlowest = rawTimes.length > 0 ? Math.round(Math.max(...rawTimes)) : 0;

    // 3. Choice RT
    const purpleTrials = choiceTimes.filter(t => t.color === 'purple');
    const tealTrials = choiceTimes.filter(t => t.color === 'teal');
    
    const purpleAvg = purpleTrials.length > 0 ? Math.round(purpleTrials.reduce((s, v) => s + v.time, 0) / purpleTrials.length) : 0;
    const tealAvg = tealTrials.length > 0 ? Math.round(tealTrials.reduce((s, v) => s + v.time, 0) / tealTrials.length) : 0;
    
    const purpleCorrect = purpleTrials.filter(t => t.correct).length;
    const purpleAcc = purpleTrials.length > 0 ? Math.round((purpleCorrect / purpleTrials.length) * 100) : 0;
    
    const tealCorrect = tealTrials.filter(t => t.correct).length;
    const tealAcc = tealTrials.length > 0 ? Math.round((tealCorrect / tealTrials.length) * 100) : 0;

    // Post-Error Slowing (PES)
    // Find trials that occurred immediately after an error
    let pesSum = 0;
    let pesCount = 0;
    for (let i = 1; i < choiceTimes.length; i++) {
      if (!choiceTimes[i - 1].correct) {
        pesSum += choiceTimes[i].time;
        pesCount++;
      }
    }
    const choiceAvg = choiceTimes.length > 0 ? choiceTimes.reduce((s, v) => s + v.time, 0) / choiceTimes.length : 0;
    const postErrorAvg = pesCount > 0 ? pesSum / pesCount : choiceAvg;
    const pesDiff = Math.round(postErrorAvg - choiceAvg);

    // 4. Recognition Speed
    const recAvg = recTimes.length > 0 ? Math.round(recTimes.reduce((s, v) => s + v.time, 0) / recTimes.length) : 0;
    const recCorrect = recTimes.filter(t => t.correct).length;
    const recAcc = recTimes.length > 0 ? Math.round((recCorrect / recTimes.length) * 100) : 0;

    return {
      surveyScore,
      rawAvg,
      rawFastest,
      rawSlowest,
      rawFalsePositives,
      purpleAvg,
      purpleAcc,
      tealAvg,
      tealAcc,
      pesDiff,
      recAvg,
      recAcc
    };
  };

  // SUBMIT LEAD & RESULTS TO BACKEND
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.firstName || !leadForm.email) {
      setSubmitError("First name and Email are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const utmSource = sessionStorage.getItem('utm_source') || null;
    const utmMedium = sessionStorage.getItem('utm_medium') || null;
    const utmCampaign = sessionStorage.getItem('utm_campaign') || null;
    const landingPage = sessionStorage.getItem('landing_page') || '/';

    const metrics = getCalculatedMetrics();
    const payload = {
      firstName: leadForm.firstName,
      lastName: leadForm.lastName,
      email: leadForm.email,
      phone: leadForm.phone || null,
      athleteName: leadForm.isParentOrCoach ? leadForm.athleteName : null,
      parentGuardianName: (Number(leadForm.age) > 0 && Number(leadForm.age) < 18) ? leadForm.parentGuardianName : null,
      age: leadForm.age ? parseInt(leadForm.age, 10) : null,
      sport: leadForm.sport,
      leadSource: 'Website',
      utmSource,
      utmMedium,
      utmCampaign,
      landingPage,
      questionnaireScore: metrics.surveyScore,
      questionnaireData: JSON.stringify(surveyAnswers),
      rawRtAvg: metrics.rawAvg,
      rawRtFastest: metrics.rawFastest,
      rawRtSlowest: metrics.rawSlowest,
      rawRtFalsePositives: metrics.rawFalsePositives,
      choiceRtPurpleAvg: metrics.purpleAvg,
      choiceRtPurpleAcc: metrics.purpleAcc,
      choiceRtTealAvg: metrics.tealAvg,
      choiceRtTealAcc: metrics.tealAcc,
      choiceRtPostErrorSlowing: metrics.pesDiff,
      recSpeedAvg: metrics.recAvg,
      recSpeedAcc: metrics.recAcc
    };

    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data: any;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON API error response received:", text);
        throw new Error("The server is currently waking up. Please wait 15 seconds and try again, or contact us at drl@areselitesportsvision.com.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit assessment");
      }

      localStorage.setItem('assessmentCompleted', 'true');
      nextStep('success');
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const metrics = getCalculatedMetrics();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/90 backdrop-blur-md">
        
        {/* Main Card Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-[#0e111a] border border-[var(--color-ares-border)] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col min-h-[500px]"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-ares-purple)]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-ares-teal)]/5 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Bezel details */}
          <div className="h-1 bg-gradient-to-r from-[var(--color-ares-purple)] via-[var(--color-ares-teal)] to-[var(--color-ares-purple)] w-full" />

          {/* Close button (only visible on welcome/survey/success, not drills) */}
          {(step === 'welcome' || step === 'survey' || step === 'success') && (
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all z-[110]"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Modal Inner Screens */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            
            {/* 1. WELCOME SCREEN */}
            {step === 'welcome' && (
              <div className="text-center max-w-2xl mx-auto py-6">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/5">
                  <Brain className="w-10 h-10 text-[var(--color-ares-teal)] animate-pulse" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
                  UNLEASH YOUR <br/> DECISION SPEED.
                </h2>
                <p className="text-white/60 text-lg mb-10 leading-relaxed font-light">
                  Elite performance is measured in milliseconds. Take our 2-part sensory cognitive assessment (visual questionnaire + 3 neurocognitive drills) to track your latency and see if you are a candidate for A.R.E.S. training.
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="primary" 
                    onClick={() => nextStep('survey')}
                    className="font-bold tracking-wider uppercase shadow-glow px-8"
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* 2. SURVEY SCREEN */}
            {step === 'survey' && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="text-[var(--color-ares-teal)] text-xs font-mono font-bold tracking-widest uppercase">
                    PART 1: VISUAL & COGNITIVE SIGNS
                  </span>
                  <span className="text-white/40 text-sm font-mono">
                    {currentQuestionIndex + 1} / {QUESTIONS.length}
                  </span>
                </div>

                <div className="mb-12 min-h-[140px] flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-snug">
                    {QUESTIONS[currentQuestionIndex].text}
                  </h3>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
                    Category: {QUESTIONS[currentQuestionIndex].category}
                  </span>
                </div>

                {/* Range Options */}
                <div className="space-y-8">
                  <div className="flex justify-between text-xs font-mono text-white/50 tracking-wider">
                    <span>1 - NEVER / EXCELLENT</span>
                    <span>10 - CONSTANT / SEVERE</span>
                  </div>
                  <div className="grid grid-cols-10 gap-2 sm:gap-3">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const val = i + 1;
                      const isSelected = surveyAnswers[currentQuestionIndex] === val;
                      return (
                        <button
                          key={`${currentQuestionIndex}-${val}`}
                          onClick={() => handleAnswerSurvey(val)}
                          className={`py-4 rounded-xl font-mono text-lg font-bold transition-all border ${
                            isSelected 
                              ? 'bg-[var(--color-ares-teal)] border-[var(--color-ares-teal)] text-[#0e111a] shadow-[0_0_15px_rgba(41,182,246,0.4)] font-black' 
                              : 'bg-transparent border-white/10 hover:border-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/10 text-white/70 hover:text-white'
                          } focus:outline-none`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="text-white/40 hover:text-white disabled:opacity-30 disabled:hover:text-white/40 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider font-bold"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" /> Prev Question
                    </button>
                    <button 
                      onClick={() => handleAnswerSurvey(5)} // Default middle
                      className="text-[var(--color-ares-teal)]/60 hover:text-[var(--color-ares-teal)] transition-colors text-sm uppercase tracking-wider font-bold"
                    >
                      Skip / Neutral (5)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TRANSITION TO DRILLS */}
            {step === 'transition_drills' && (
              <div className="text-center max-w-xl mx-auto py-6">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                  <Activity className="w-10 h-10 text-[var(--color-ares-purple)]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 uppercase tracking-tight">
                  PART 2: SENSORY COGNITIVE DRILLS
                </h2>
                <p className="text-white/60 text-lg mb-10 leading-relaxed font-light text-balance">
                  Great job. We are ready to run 3 rapid trials to measure your raw decision speed, choice processing latency, and recognition time under millisecond constraints.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    nextStep('drill_raw');
                    startRawDrill();
                  }}
                  className="font-bold tracking-wider uppercase shadow-glow px-10"
                >
                  Start Sensory Drills
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* 4. DRILL 1: RAW REACTION TIME */}
            {step === 'drill_raw' && (
              <div className="w-full text-center">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="text-[var(--color-ares-teal)] text-xs font-mono font-bold tracking-widest uppercase">
                    DRILL 1: RAW REACTION SPEED
                  </span>
                  <span className="text-white/40 text-sm font-mono">
                    Trial {rawTrial + 1} / 5
                  </span>
                </div>

                <p className="text-white/50 text-sm mb-12 max-w-md mx-auto">
                  Click/tap the screen target immediately when the center circle turns <span className="text-[var(--color-ares-teal)] font-bold">NEON TEAL</span>. Clicks before the flash trigger a false positive penalty.
                </p>

                {/* Drill Trigger Box */}
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
                    <div className="w-32 h-32 rounded-full bg-[var(--color-ares-teal)] shadow-[0_0_50px_rgba(41,182,246,0.6)] flex items-center justify-center">
                      <span className="text-black font-black uppercase tracking-widest text-base">CLICK NOW!</span>
                    </div>
                  )}
                  {rawState === 'feedback' && (
                    <div className="text-white">
                      {rawTimes.length > rawTrial ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-white/50 text-xs font-mono uppercase tracking-widest">Reaction Speed</span>
                          <span className="text-4xl font-mono font-bold text-[var(--color-ares-teal)]">
                            {Math.round(rawTimes[rawTimes.length - 1])}ms
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-red-500">
                          <span className="text-red-500 font-black uppercase tracking-widest text-sm">False Positive!</span>
                          <span className="text-white/40 text-xs">Wait for color shift.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. DRILL 2: CHOICE REACTION TIME */}
            {step === 'drill_choice' && (
              <div className="w-full text-center">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="text-[var(--color-ares-purple)] text-xs font-mono font-bold tracking-widest uppercase">
                    DRILL 2: CHOICE REACTION (TEAL VS PURPLE)
                  </span>
                  <span className="text-white/40 text-sm font-mono">
                    Trial {choiceTrial + 1} / 8
                  </span>
                </div>

                <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
                  Tapping the left/right buttons below or keyboard keys: <br/>
                  <span className="text-[var(--color-ares-teal)] font-bold">Left Arrow / T</span> for TEAL, <span className="text-[var(--color-ares-purple)] font-bold">Right Arrow / P</span> for PURPLE.
                </p>

                {/* Target Flash Box */}
                <div 
                  className="w-full min-h-[200px] rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center justify-center select-none mb-6 relative overflow-hidden"
                >
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
                          {choiceTimes[choiceTimes.length - 1].correct ? (
                            <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Correct</span>
                          ) : (
                            <span className="text-red-500 font-bold text-sm tracking-widest uppercase">Incorrect Target</span>
                          )}
                          <span className="text-3xl font-mono font-bold text-white">
                            {Math.round(choiceTimes[choiceTimes.length - 1].time)}ms
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Input Buttons */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <button
                    onPointerDown={() => handleChoiceInput('teal')}
                    disabled={choiceState !== 'target'}
                    className="py-5 rounded-2xl bg-[var(--color-ares-teal)]/10 hover:bg-[var(--color-ares-teal)]/20 border border-[var(--color-ares-teal)]/30 text-[var(--color-ares-teal)] font-bold text-lg transition-all focus:outline-none disabled:opacity-20"
                  >
                    TEAL (Left)
                  </button>
                  <button
                    onPointerDown={() => handleChoiceInput('purple')}
                    disabled={choiceState !== 'target'}
                    className="py-5 rounded-2xl bg-[var(--color-ares-purple)]/10 hover:bg-[var(--color-ares-purple)]/20 border border-[var(--color-ares-purple)]/30 text-[var(--color-ares-purple)] font-bold text-lg transition-all focus:outline-none disabled:opacity-20"
                  >
                    PURPLE (Right)
                  </button>
                </div>
              </div>
            )}

            {/* 6. DRILL 3: RECOGNITION SPEED */}
            {step === 'drill_recognition' && (
              <div className="w-full text-center">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="text-[var(--color-ares-teal)] text-xs font-mono font-bold tracking-widest uppercase">
                    DRILL 3: RECOGNITION SPEED (VISUAL PROCESSING)
                  </span>
                  <span className="text-white/40 text-sm font-mono">
                    Trial {recTrial + 1} / 5
                  </span>
                </div>

                <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
                  A pattern of 3 arrows will flash for <strong>800ms</strong>. Memorize it and select the correct option.
                </p>

                {/* Target Flash Box */}
                <div 
                  className="w-full min-h-[160px] rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center justify-center select-none mb-8 relative overflow-hidden"
                >
                  {recState === 'countdown' && (
                    <div className="text-4xl font-bold font-mono text-[var(--color-ares-teal)]">
                      {recCountdown}
                    </div>
                  )}
                  {recState === 'flash' && (
                    <div className="flex items-center justify-center gap-6">
                      {RECOGNITION_SYMBOLS[recTrial].map((sym, idx) => (
                        <span key={idx} className="text-5xl font-bold text-white">{sym}</span>
                      ))}
                    </div>
                  )}
                  {recState === 'select' && (
                    <div className="text-white/20 font-bold uppercase tracking-widest text-xs">
                      Select the correct pattern below...
                    </div>
                  )}
                  {recState === 'feedback' && (
                    <div className="text-white">
                      {recTimes.length > recTrial ? (
                        <div className="flex flex-col items-center gap-2">
                          {recTimes[recTimes.length - 1].correct ? (
                            <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Pattern Matched</span>
                          ) : (
                            <span className="text-red-500 font-bold text-sm tracking-widest uppercase">Incorrect Pattern</span>
                          )}
                          <span className="text-3xl font-mono font-bold text-white">
                            {Math.round(recTimes[recTimes.length - 1].time)}ms
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Multiple Choice Options */}
                {recState === 'select' && (
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {RECOGNITION_OPTIONS[recTrial].map((option, idx) => (
                      <button
                        key={idx}
                        onPointerDown={() => handleRecSelect(option)}
                        className="py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xl font-bold flex items-center justify-center gap-4 transition-all text-white"
                      >
                        {option.map((s, i) => <span key={i}>{s}</span>)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 7. LEAD CAPTURE GATE */}
            {step === 'lead_capture' && (
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 uppercase">ASSESSMENT COMPLETE</h2>
                  <p className="text-white/60 text-sm">
                    Enter your email to calculate your scores and receive your detailed A.R.E.S. visual telemetry report immediately.
                  </p>
                </div>

                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="first_name" className="text-xs font-mono text-white/50 uppercase">First Name *</label>
                      <input
                        type="text"
                        required
                        id="first_name"
                        value={leadForm.firstName}
                        onChange={e => setLeadForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        placeholder="Marcus"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="last_name" className="text-xs font-mono text-white/50 uppercase">Last Name</label>
                      <input
                        type="text"
                        id="last_name"
                        value={leadForm.lastName}
                        onChange={e => setLeadForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        placeholder="Julian"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email_addr" className="text-xs font-mono text-white/50 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      id="email_addr"
                      value={leadForm.email}
                      onChange={e => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                      placeholder="marcus@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="phone_num" className="text-xs font-mono text-white/50 uppercase">Phone Number</label>
                      <input
                        type="tel"
                        id="phone_num"
                        value={leadForm.phone}
                        onChange={e => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        placeholder="(317) 555-0199"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="athlete_age" className="text-xs font-mono text-white/50 uppercase">Age</label>
                      <input
                        type="number"
                        id="athlete_age"
                        value={leadForm.age}
                        onChange={e => setLeadForm(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        placeholder="16"
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="sport_discipline" className="text-xs font-mono text-white/50 uppercase">Primary Sport</label>
                    <input
                      type="text"
                      id="sport_discipline"
                      value={leadForm.sport}
                      onChange={e => setLeadForm(prev => ({ ...prev, sport: e.target.value }))}
                      className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                      placeholder="e.g. IndyCar, Baseball, Hockey"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1 select-none">
                    <input
                      type="checkbox"
                      id="parent_coach_toggle"
                      checked={leadForm.isParentOrCoach}
                      onChange={e => setLeadForm(prev => ({ ...prev, isParentOrCoach: e.target.checked }))}
                      className="rounded border-[var(--color-ares-border)] bg-black/40 text-[var(--color-ares-teal)] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="parent_coach_toggle" className="text-xs font-mono text-white/70 cursor-pointer uppercase">
                      I am a parent or coach filling this out on behalf of the athlete
                    </label>
                  </div>

                  {leadForm.isParentOrCoach && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      <label htmlFor="athlete_name" className="text-xs font-mono text-white/50 uppercase">Athlete Name *</label>
                      <input
                        type="text"
                        required={leadForm.isParentOrCoach}
                        id="athlete_name"
                        value={leadForm.athleteName}
                        onChange={e => setLeadForm(prev => ({ ...prev, athleteName: e.target.value }))}
                        className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        placeholder="Athlete's Full Name"
                      />
                    </motion.div>
                  )}

                  {Number(leadForm.age) > 0 && Number(leadForm.age) < 18 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      <label htmlFor="parent_name" className="text-xs font-mono text-white/50 uppercase">Parent/Guardian Name *</label>
                      <input
                        type="text"
                        required={Number(leadForm.age) > 0 && Number(leadForm.age) < 18}
                        id="parent_name"
                        value={leadForm.parentGuardianName}
                        onChange={e => setLeadForm(prev => ({ ...prev, parentGuardianName: e.target.value }))}
                        className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                        placeholder="Parent/Guardian Full Name"
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
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-glow mt-6 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <>Get Performance Report <ChevronRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* 8. SUCCESS REPORT RESULTS DASHBOARD */}
            {step === 'success' && (
              <div className="w-full max-w-2xl mx-auto py-4">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <Award className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Assessment Telemetry Summary
                  </h2>
                  <p className="text-white/50 text-sm mt-2">
                    A copy of your full data dashboard has been sent to <strong>{leadForm.email}</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  
                  {/* Score 1 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Visual Symptoms</span>
                    <span className="text-3xl font-bold text-white block mb-1">{metrics.surveyScore}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      metrics.surveyScore >= 120 ? 'text-red-400' : metrics.surveyScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {metrics.surveyScore >= 120 ? 'High Latency Risk' : metrics.surveyScore >= 60 ? 'Moderate Imbalance' : 'Optimal Baseline'}
                    </span>
                  </div>

                  {/* Score 2 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Raw Reaction Time</span>
                    <span className="text-3xl font-bold text-[var(--color-ares-teal)] block mb-1">{metrics.rawAvg}ms</span>
                    <span className="text-[10px] font-mono text-white/40 block">Fastest: {metrics.rawFastest}ms</span>
                  </div>

                  {/* Score 3 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Choice Processing</span>
                    <span className="text-3xl font-bold text-[var(--color-ares-purple)] block mb-1">{Math.round((metrics.tealAcc + metrics.purpleAcc) / 2)}%</span>
                    <span className="text-[10px] font-mono text-white/40 block">Post-Error slowing: {metrics.pesDiff}ms</span>
                  </div>

                </div>

                <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-6 mb-8 text-center sm:text-left">
                  <h4 className="text-white font-bold text-lg mb-2">Dr. Joe's Initial Fit Candidate Score</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {metrics.surveyScore >= 120 ? (
                      <>
                        <strong>High Priority Candidate:</strong> Your results show significant visual-cognitive fatigue, peripheral tracking latency, and post-error cognitive delays. A.R.E.S. neurocognitive training will lock in significant latency gains. We suggest securing an in-office baseline evaluation immediately.
                      </>
                    ) : (
                      <>
                        <strong>Candidate Approved:</strong> Your processing speed and accuracy profiles show a strong baseline, but with room to optimize. A.R.E.S. sensory training will refine your decision times, eliminating crucial milliseconds of decision latency. We recommend booking a baseline evaluation.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    variant="primary" 
                    href="/book/evaluation"
                    className="w-full sm:w-auto text-center justify-center font-bold tracking-wide shadow-glow"
                  >
                    Book In-Office Baseline Evaluation ($449)
                  </Button>
                  <button 
                    onClick={handleClose}
                    className="w-full sm:w-auto py-3.5 px-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wider uppercase transition-all"
                  >
                    Explore Website
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
