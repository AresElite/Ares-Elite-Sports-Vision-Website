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

const ARROWS = ['←', '↑', '→', '↓'];

function generateRandomSequence(length: number): string[] {
  const seq: string[] = [];
  for (let i = 0; i < length; i++) {
    seq.push(ARROWS[Math.floor(Math.random() * ARROWS.length)]);
  }
  return seq;
}

function generateOptions(correctSeq: string[], length: number): string[][] {
  const optionsSet = new Set<string>();
  optionsSet.add(correctSeq.join(''));

  while (optionsSet.size < 4) {
    const distractor: string[] = [];
    for (let i = 0; i < length; i++) {
      distractor.push(ARROWS[Math.floor(Math.random() * ARROWS.length)]);
    }
    optionsSet.add(distractor.join(''));
  }

  const options = Array.from(optionsSet).map(s => Array.from(s));

  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = options[i];
    options[i] = options[j];
    options[j] = temp;
  }

  return options;
}

function calculatePercentile(rawAvg: number, choiceAcc: number, recAcc: number): number {
  let rawPct = 50;
  if (rawAvg <= 220) {
    rawPct = 95 + Math.max(0, 220 - rawAvg) * 0.1;
  } else if (rawAvg <= 350) {
    rawPct = 95 - ((rawAvg - 220) / (350 - 220)) * 45;
  } else {
    rawPct = 50 - ((rawAvg - 350) / (500 - 350)) * 45;
  }
  
  const avgAcc = (choiceAcc + recAcc) / 2;
  const finalPct = Math.round((rawPct * 0.6) + (avgAcc * 0.4));
  return Math.max(5, Math.min(99, finalPct));
}

interface AssessmentWizardProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export function AssessmentWizard({ onClose, isEmbedded = false }: AssessmentWizardProps) {
  const [step, setStep] = useState<WizardStep>('welcome');
  
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
  const rawWaitingStateStartRef = useRef<number>(0);

  // Drill 2: Choice RT States
  const [choiceTrial, setChoiceTrial] = useState(0);
  const [choiceState, setChoiceState] = useState<'idle' | 'waiting' | 'target' | 'feedback'>('idle');
  const [choiceTargetColor, setChoiceTargetColor] = useState<'purple' | 'teal' | null>(null);
  const [choiceTimes, setChoiceTimes] = useState<{ color: 'purple' | 'teal'; time: number; correct: boolean }[]>([]);
  const [choiceWasError, setChoiceWasError] = useState(false);
  const choiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const choiceFlashTimeRef = useRef<number>(0);

  // Drill 3: Recognition Speed States
  const [recTrial, setRecTrial] = useState(0);
  const [recState, setRecState] = useState<'idle' | 'countdown' | 'flash' | 'select' | 'feedback'>('idle');
  const [recTimes, setRecTimes] = useState<{ time: number; correct: boolean }[]>([]);
  const [recCountdown, setRecCountdown] = useState(3);
  const recTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recStartTimeRef = useRef<number>(0);
  const [currentRecPattern, setCurrentRecPattern] = useState<string[]>([]);
  const [currentRecOptions, setCurrentRecOptions] = useState<string[][]>([]);

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
    role: '',
    competitiveLevel: '',
    location: '',
    primaryConcern: '',
    urgency: '',
    desiredNextStep: '',
    consent: true,
    isParentOrCoach: false,
    howHeard: '',
    howHeardOther: '',
    referralCode: sessionStorage.getItem('referral_code') || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bottleneckResult, setBottleneckResult] = useState<string | null>(null);

  const nextStep = (next: WizardStep) => {
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
    rawWaitingStateStartRef.current = performance.now();
    rawHasClickedRef.current = false;
    const delay = 1500 + Math.random() * 2500;
    if (rawTimerRef.current) clearTimeout(rawTimerRef.current);
    
    rawTimerRef.current = setTimeout(() => {
      setRawState('flash');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rawFlashTimeRef.current = performance.now();
        });
      });
    }, delay);
  };

  const handleRawClick = () => {
    if (rawState === 'waiting') {
      const now = performance.now();
      if (now - rawWaitingStateStartRef.current < 500) {
        return; // Early click lockout (first 500ms of waiting state)
      }
      if (rawHasClickedRef.current) return;
      rawHasClickedRef.current = true;
      if (rawTimerRef.current) clearTimeout(rawTimerRef.current);
      setRawFalsePositives(prev => prev + 1);
      setRawState('feedback');
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
    if (rawTrial < 14) {
      setRawTrial(prev => prev + 1);
      triggerRawNextTrial();
    } else {
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
    const delay = 1200 + Math.random() * 1800;
    if (choiceTimerRef.current) clearTimeout(choiceTimerRef.current);
    
    choiceTimerRef.current = setTimeout(() => {
      const color = Math.random() > 0.5 ? 'purple' : 'teal';
      setChoiceTargetColor(color);
      setChoiceState('target');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          choiceFlashTimeRef.current = performance.now();
        });
      });
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
      if (choiceTrial < 14) {
        setChoiceTrial(prev => prev + 1);
        triggerChoiceNextTrial();
      } else {
        nextStep('drill_recognition');
        startRecDrill();
      }
    }, 1000);
  };

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
    runRecCountdown(0);
  };

  const runRecCountdown = (trialIndex: number) => {
    setRecState('countdown');
    setRecCountdown(3);
    recHasClickedRef.current = false;
    
    let length = 3;
    if (trialIndex >= 5 && trialIndex < 10) {
      length = 4;
    } else if (trialIndex >= 10) {
      length = 5;
    }

    const pattern = generateRandomSequence(length);
    const options = generateOptions(pattern, length);

    setCurrentRecPattern(pattern);
    setCurrentRecOptions(options);

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
    
    const isCorrect = option.join('') === currentRecPattern.join('');

    setRecTimes(prev => [...prev, { time: rt, correct: isCorrect }]);
    setRecState('feedback');

    setTimeout(() => {
      if (recTrial < 14) {
        const nextTrial = recTrial + 1;
        setRecTrial(nextTrial);
        runRecCountdown(nextTrial);
      } else {
        nextStep('lead_capture');
      }
    }, 1000);
  };

  // CALCULATE TELEMETRY METRICS
  const getCalculatedMetrics = () => {
    const surveyScore = surveyAnswers.reduce((sum, val) => sum + (val || 0), 0);
    
    const rawAvg = rawTimes.length > 0 ? Math.round(rawTimes.reduce((s, v) => s + v, 0) / rawTimes.length) : 0;
    const rawFastest = rawTimes.length > 0 ? Math.round(Math.min(...rawTimes)) : 0;
    const rawSlowest = rawTimes.length > 0 ? Math.round(Math.max(...rawTimes)) : 0;

    const purpleTrials = choiceTimes.filter(t => t.color === 'purple');
    const tealTrials = choiceTimes.filter(t => t.color === 'teal');
    
    const purpleAvg = purpleTrials.length > 0 ? Math.round(purpleTrials.reduce((s, v) => s + v.time, 0) / purpleTrials.length) : 0;
    const tealAvg = tealTrials.length > 0 ? Math.round(tealTrials.reduce((s, v) => s + v.time, 0) / tealTrials.length) : 0;
    
    const purpleCorrect = purpleTrials.filter(t => t.correct).length;
    const purpleAcc = purpleTrials.length > 0 ? Math.round((purpleCorrect / purpleTrials.length) * 100) : 0;
    
    const tealCorrect = tealTrials.filter(t => t.correct).length;
    const tealAcc = tealTrials.length > 0 ? Math.round((tealCorrect / tealTrials.length) * 100) : 0;

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

  // Determine primary A.R.E.S. Bottleneck Profile on frontend
  const determineBottleneck = (metrics: any) => {
    // Categorize survey category scores
    let trackingScore = 0;
    let fatigueScore = 0;
    let cognitiveScore = 0;
    let coordinationScore = 0;

    QUESTIONS.forEach((q, idx) => {
      const ans = surveyAnswers[idx] || 5;
      if (q.category === 'tracking') trackingScore += ans;
      if (q.category === 'fatigue') fatigueScore += ans;
      if (q.category === 'cognitive') cognitiveScore += ans;
      if (q.category === 'coordination') coordinationScore += ans;
    });

    // Normalize category scores to percentage values (0-100)
    const trackingPct = (trackingScore / 60) * 100;
    const fatiguePct = (fatigueScore / 60) * 100;
    const cognitivePct = (cognitiveScore / 50) * 100;
    const coordinationPct = (coordinationScore / 20) * 100;

    // Standard latency markers
    const acquireLatency = trackingPct + (metrics.rawAvg >= 280 ? 30 : 0);
    const routeLatency = fatiguePct + (100 - (metrics.tealAcc + metrics.purpleAcc) / 2);
    const executeLatency = cognitivePct + (metrics.recAvg >= 1500 ? 20 : 0);
    const synchronizeLatency = coordinationPct + (metrics.pesDiff >= 40 ? 30 : 0);

    const maxVal = Math.max(acquireLatency, routeLatency, executeLatency, synchronizeLatency);

    if (maxVal === acquireLatency) return 'Acquire Bottleneck';
    if (maxVal === routeLatency) return 'Route Bottleneck';
    if (maxVal === executeLatency) return 'Execute Bottleneck';
    return 'Synchronize Bottleneck';
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.firstName || !leadForm.email || !leadForm.role || !leadForm.howHeard) {
      setSubmitError("First name, email, role, and 'how did you hear about us' are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const utmSource = sessionStorage.getItem('utm_source') || null;
    const utmMedium = sessionStorage.getItem('utm_medium') || null;
    const utmCampaign = sessionStorage.getItem('utm_campaign') || null;
    const utmContent = sessionStorage.getItem('utm_content') || null;
    const utmTerm = sessionStorage.getItem('utm_term') || null;
    const landingPage = sessionStorage.getItem('landing_page') || '/';

    const metrics = getCalculatedMetrics();
    const calculatedBottleneck = determineBottleneck(metrics);
    setBottleneckResult(calculatedBottleneck);

    const payload = {
      firstName: leadForm.firstName,
      lastName: leadForm.lastName,
      email: leadForm.email,
      phone: leadForm.phone || null,
      athleteName: leadForm.isParentOrCoach ? leadForm.athleteName : null,
      parentGuardianName: (Number(leadForm.age) > 0 && Number(leadForm.age) < 18) ? leadForm.parentGuardianName : null,
      age: leadForm.age ? parseInt(leadForm.age, 10) : null,
      sport: leadForm.sport,
      role: leadForm.role,
      competitiveLevel: leadForm.competitiveLevel || null,
      location: leadForm.location || null,
      primaryConcern: leadForm.primaryConcern || null,
      urgency: leadForm.urgency || null,
      desiredNextStep: leadForm.desiredNextStep || null,
      consent: leadForm.consent ? 1 : 0,
      leadSource: 'Website',
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
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
      recSpeedAcc: metrics.recAcc,
      howHeard: leadForm.howHeard || null,
      howHeardOther: leadForm.howHeard === 'Other (Please specify)' ? leadForm.howHeardOther : null,
      referralCode: leadForm.referralCode || null,
      bottleneckProfile: calculatedBottleneck
    };

    try {
      // 1. Save to Firebase Firestore (Non-blocking background promise)
      (async () => {
        try {
          const leadDocRef = doc(db, 'leads', leadForm.email);
          await setDoc(leadDocRef, {
            firstName: leadForm.firstName,
            lastName: leadForm.lastName || null,
            email: leadForm.email,
            phone: leadForm.phone || null,
            athleteName: leadForm.isParentOrCoach ? leadForm.athleteName : null,
            parentGuardianName: (Number(leadForm.age) > 0 && Number(leadForm.age) < 18) ? leadForm.parentGuardianName : null,
            age: leadForm.age ? parseInt(leadForm.age, 10) : null,
            sport: leadForm.sport,
            role: leadForm.role,
            competitiveLevel: leadForm.competitiveLevel || null,
            location: leadForm.location || null,
            primaryConcern: leadForm.primaryConcern || null,
            urgency: leadForm.urgency || null,
            desiredNextStep: leadForm.desiredNextStep || null,
            consent: leadForm.consent ? 1 : 0,
            leadSource: 'Website',
            utmSource,
            utmMedium,
            utmCampaign,
            utmContent,
            utmTerm,
            landingPage,
            questionnaireScore: metrics.surveyScore,
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
            recSpeedAcc: metrics.recAcc,
            howHeard: leadForm.howHeard || null,
            howHeardOther: leadForm.howHeard === 'Other (Please specify)' ? leadForm.howHeardOther : null,
            referralCode: leadForm.referralCode || null,
            bottleneckProfile: calculatedBottleneck,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          }, { merge: true });

          await addDoc(collection(db, 'assessments'), {
            email: leadForm.email,
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
            recSpeedAcc: metrics.recAcc,
            createdAt: serverTimestamp()
          });
          console.log("Firebase Firestore write completed successfully.");
        } catch (fsError) {
          console.error("Firebase Firestore write failed:", fsError);
        }
      })();

      // 2. Submit to express server SQLite
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
        throw new Error("The server is currently waking up. Please wait 15 seconds and try again.");
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

  const metrics = getCalculatedMetrics();

  // Bell curve calculations
  const userPct = calculatePercentile(
    metrics.rawAvg,
    (metrics.tealAcc + metrics.purpleAcc) / 2,
    metrics.recAcc
  );
  const userX = 50 + (userPct / 100) * 500;
  const userY = 220 - 150 * Math.exp(-Math.pow((userPct - 50) / 28, 2));
  const tooltipX = Math.max(10, Math.min(490, userX - 50));
  const tooltipY = userY - 45;

  const curvePoints: string[] = [];
  for (let p = 0; p <= 100; p += 1) {
    const x = 50 + (p / 100) * 500;
    const y = 220 - 150 * Math.exp(-Math.pow((p - 50) / 28, 2));
    curvePoints.push(`${x},${y}`);
  }
  const curvePath = `M 50,220 L ` + curvePoints.join(' L ') + ` L 550,220 Z`;
  const strokePath = `M ` + curvePoints.join(' L ');

  return (
    <div className={`relative w-full ${isEmbedded ? 'max-w-4xl p-6 md:p-10 bg-[#0e111a]/85 border border-[var(--color-ares-border)] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.5)]' : 'h-full flex flex-col justify-center'}`}>
      
      {/* Welcome Screen */}
      {step === 'welcome' && (
        <div className="text-center max-w-2xl mx-auto py-8">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/5">
            <Brain className="w-10 h-10 text-[var(--color-ares-teal)] animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
            UNLEASH YOUR <br/> DECISION SPEED.
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed font-light">
            Elite performance is measured in milliseconds. Take our 2-part sensory cognitive assessment (visual questionnaire + 3 neurocognitive drills) to track your latency and see if you are a candidate for A.R.E.S. training.
          </p>
          <div className="flex justify-center">
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

      {/* Survey Questions Screen */}
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
                <ChevronRight className="w-4 h-4 rotate-180" /> Prev
              </button>
              <button 
                onClick={() => handleAnswerSurvey(5)}
                className="text-[var(--color-ares-teal)]/60 hover:text-[var(--color-ares-teal)] transition-colors text-sm uppercase tracking-wider font-bold"
              >
                Skip / Neutral (5)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transition Screen to Drills */}
      {step === 'transition_drills' && (
        <div className="text-center max-w-xl mx-auto py-8">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Activity className="w-10 h-10 text-[var(--color-ares-purple)]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 uppercase tracking-tight">
            PART 2: SENSORY COGNITIVE DRILLS
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed font-light">
            We are ready to run 3 rapid trials to measure your raw decision speed, choice processing latency, and recognition time under millisecond constraints.
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

      {/* Drill 1: Raw Reaction Time */}
      {step === 'drill_raw' && (
        <div className="w-full text-center">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <span className="text-[var(--color-ares-teal)] text-xs font-mono font-bold tracking-widest uppercase">
              DRILL 1: RAW REACTION SPEED
            </span>
            <span className="text-white/40 text-sm font-mono">
              Trial {rawTrial + 1} / 15
            </span>
          </div>

          <p className="text-white/50 text-sm mb-12 max-w-md mx-auto">
            Click/tap the screen target immediately when the center circle turns <span className="text-[var(--color-ares-teal)] font-bold">NEON TEAL</span>. Clicks before the flash trigger a false positive penalty.
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
              <div className="w-32 h-32 rounded-full bg-[var(--color-ares-teal)] shadow-[0_0_50px_rgba(41,182,246,0.6)] flex items-center justify-center">
                <span className="text-[#0A0B14] font-black uppercase tracking-widest text-sm">CLICK NOW!</span>
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
              Trial {choiceTrial + 1} / 15
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

      {/* Drill 3: Recognition Speed */}
      {step === 'drill_recognition' && (
        <div className="w-full text-center">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <span className="text-[var(--color-ares-teal)] text-xs font-mono font-bold tracking-widest uppercase">
              DRILL 3: RECOGNITION SPEED (VISUAL PATTERNS)
            </span>
            <span className="text-white/40 text-sm font-mono">
              Trial {recTrial + 1} / 15
            </span>
          </div>

          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            A sequence of arrows will flash for <strong>800ms</strong>. Memorize it and select the correct pattern.
          </p>

          <div className="w-full min-h-[160px] rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center justify-center select-none mb-8 relative overflow-hidden">
            {recState === 'countdown' && (
              <div className="text-4xl font-bold font-mono text-[var(--color-ares-teal)]">
                {recCountdown}
              </div>
            )}
            {recState === 'flash' && (
              <div className="flex items-center justify-center gap-6">
                {currentRecPattern.map((sym, idx) => (
                  <span key={idx} className="text-5xl font-bold text-white">{sym}</span>
                ))}
              </div>
            )}
            {recState === 'select' && (
              <div className="text-white/20 font-bold uppercase tracking-widest text-xs">
                Select matching pattern...
              </div>
            )}
            {recState === 'feedback' && (
              <div className="text-white">
                {recTimes.length > recTrial ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-white/50 text-xs font-mono uppercase tracking-widest">Pattern Registered</span>
                    <span className="text-3xl font-mono font-bold text-white">
                      {Math.round(recTimes[recTimes.length - 1].time)}ms
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {recState === 'select' && (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentRecOptions.map((option, idx) => (
                <button
                  key={idx}
                  onPointerDown={() => handleRecSelect(option)}
                  className="py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xl font-bold flex items-center justify-center gap-4 transition-all text-white cursor-pointer"
                >
                  {option.map((s, i) => <span key={i}>{s}</span>)}
                </button>
              ))}
            </div>
          )}
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
              <label htmlFor="concern_input" className="text-[10px] font-mono text-white/50 uppercase">Primary Performance Concern</label>
              <input
                type="text" id="concern_input"
                value={leadForm.primaryConcern}
                onChange={e => setLeadForm(prev => ({ ...prev, primaryConcern: e.target.value }))}
                className="w-full bg-black/40 border border-[var(--color-ares-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[var(--color-ares-teal)]"
                placeholder="e.g. tracking ball at night, split-second hesitation, peripheral awareness"
              />
            </div>

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
        <div className="w-full max-w-2xl mx-auto py-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              A.R.E.S. Diagnostics Results
            </h2>
            <p className="text-white/50 text-sm mt-2">
              Your telemetry baseline reports have been logged and emailed to <strong>{leadForm.email}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Visual Symptoms</span>
              <span className="text-3xl font-bold text-white block mb-1">{metrics.surveyScore}</span>
              <span className="text-[10px] font-mono text-white/40 block">Max Score: 200</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Raw Reaction Speed</span>
              <span className="text-3xl font-bold text-[var(--color-ares-teal)] block mb-1">{metrics.rawAvg}ms</span>
              <span className="text-[10px] font-mono text-white/40 block">Fastest: {metrics.rawFastest}ms</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Choice Processing</span>
              <span className="text-3xl font-bold text-[var(--color-ares-purple)] block mb-1">{Math.round((metrics.tealAcc + metrics.purpleAcc) / 2)}%</span>
              <span className="text-[10px] font-mono text-white/40 block">PES Delay: {metrics.pesDiff}ms</span>
            </div>
          </div>

          {/* Bell Curve Percentile Rank Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <h4 className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-6 flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-[var(--color-ares-teal)]" />
              SENSORY PERCENTILE STANDING
            </h4>
            
            <div className="w-full h-auto">
              <svg viewBox="0 0 600 270" className="w-full h-auto overflow-visible select-none">
                <defs>
                  {/* Curve Gradient */}
                  <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-ares-teal)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-ares-teal)" stopOpacity="0" />
                  </linearGradient>
                  {/* Tooltip glow filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* X Axis grid lines */}
                <line x1="50" y1="220" x2="550" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="50" x2="50" y2="220" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="300" y1="50" x2="300" y2="220" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="550" y1="50" x2="550" y2="220" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                {/* Shaded Area under Bell Curve */}
                <path d={curvePath} fill="url(#curveGrad)" />

                {/* Bell Curve Stroke */}
                <path d={strokePath} fill="none" stroke="var(--color-ares-teal)" strokeWidth="3" />

                {/* Vertical position indicator */}
                <line 
                  x1={userX} 
                  y1="220" 
                  x2={userX} 
                  y2={userY} 
                  stroke="var(--color-ares-teal)" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  opacity="0.8"
                />

                {/* Pulsing indicator dot */}
                <circle cx={userX} cy={userY} r="8" fill="var(--color-ares-teal)" opacity="0.3" className="animate-ping" style={{ transformOrigin: `${userX}px ${userY}px` }} />
                <circle cx={userX} cy={userY} r="5" fill="var(--color-ares-teal)" filter="url(#glow)" />

                {/* Tooltip Badge */}
                <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                  {/* Tooltip box background */}
                  <rect x="0" y="0" width="100" height="32" rx="6" fill="#0e111a" stroke="var(--color-ares-teal)" strokeWidth="1" filter="url(#glow)" />
                  {/* Tooltip text */}
                  <text x="50" y="20" fill="var(--color-ares-teal)" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    YOU: TOP {100 - userPct}%
                  </text>
                </g>

                {/* X Axis Labels */}
                <text x="120" y="245" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  BELOW AVERAGE
                </text>
                <text x="300" y="245" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  AVERAGE ATHLETE
                </text>
                <text x="480" y="245" fill="var(--color-ares-teal)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ELITE TIER
                </text>

                {/* Percentile ticks */}
                <text x="50" y="232" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">5th%</text>
                <text x="300" y="232" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">50th%</text>
                <text x="550" y="232" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">99th%</text>
              </svg>
            </div>
            
            <p className="text-white/50 text-[11px] font-mono mt-4 leading-relaxed text-center">
              * Compares your reaction speed and accuracy to our database of collegiate and professional athletes.
            </p>
          </div>


          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-6 mb-8">
            <h4 className="text-[var(--color-ares-teal)] font-bold text-lg mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--color-ares-teal)]" />
              Primary Bottleneck: {bottleneckResult}
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              {bottleneckResult === 'Acquire Bottleneck' && (
                <>
                  <strong>Acquire Profile:</strong> Your primary latency bottleneck lies at the visual capture stage. You are losing crucial milliseconds in tracking high-speed objects, maintaining fixation under fatigue, and recognizing target motions. In-office training with our high-contrast tactile systems will help you capture cues faster.
                </>
              )}
              {bottleneckResult === 'Route Bottleneck' && (
                <>
                  <strong>Route Profile:</strong> Your visual-cognitive routing is experiencing congestion. Your raw sensory hardware is clear, but your brain takes too long filtering and prioritizing visual coordinates under fatigue. A.R.E.S. strobe-occlusion protocols will accelerate your neural routing.
                </>
              )}
              {bottleneckResult === 'Execute Bottleneck' && (
                <>
                  <strong>Execute Profile:</strong> Your bottleneck is at the motor execution stage. You recognize targets and route information correctly, but hesitate when turning recognition into physical choices. Calibrating your decision threshold will reduce split-second hesitations.
                </>
              )}
              {bottleneckResult === 'Synchronize Bottleneck' && (
                <>
                  <strong>Synchronize Profile:</strong> Your visual-cognitive loop breaks down under pressure and physical fatigue. While you perform well in isolation, you lose spatial timing, rhythm, and accuracy under chaotic conditions. Standardized performance loading will synchronize your systems.
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
              Book 75-Min Baseline Evaluation ($449)
            </Button>
            {onClose ? (
              <button 
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wider uppercase transition-all cursor-pointer"
              >
                Close Report
              </button>
            ) : (
              <Button
                variant="outline"
                href="/"
                className="w-full sm:w-auto text-center justify-center font-bold tracking-wide cursor-pointer"
              >
                Explore Homepage
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
