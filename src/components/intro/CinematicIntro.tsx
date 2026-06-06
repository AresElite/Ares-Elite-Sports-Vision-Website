import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { motionConfig } from '../../config/motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence timing - Shortened for better UX
    const timers = [
      setTimeout(() => setStep(1), 600),  // Scene 1 -> 2
      setTimeout(() => setStep(2), 1400), // Scene 2 -> 3
      setTimeout(() => setStep(3), 2200), // Scene 3 -> 4
      setTimeout(() => {
        setStep(4);
        onComplete();
      }, 3000), // Scene 4 -> Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 4 && (
        <motion.div
          className="fixed inset-0 z-50 bg-[var(--color-ares-bg)] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 1, ease: motionConfig.easing.mechanical } }}
        >
          <button 
            onClick={onComplete}
            className="absolute top-8 right-8 z-[60] text-white/40 hover:text-white text-xs uppercase tracking-widest font-mono border border-[var(--color-ares-border)] hover:border-white/40 px-4 py-2 rounded-full transition-colors"
          >
            Skip Intro
          </button>

          {/* Scene 1: Initialization */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[var(--color-ares-teal)] font-mono text-sm tracking-widest"
            >
              INITIALIZING PERFORMANCE INTELLIGENCE...
            </motion.div>
          )}

          {/* Scene 2: Neural Activation Telemetry */}
          {step === 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <TelemetryOverlay />
            </div>
          )}

          {/* Scene 3: "Here..." */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: motionConfig.easing.precision }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-medium text-white/80 tracking-wide">
                Here...
              </h2>
            </motion.div>
          )}

          {/* Scene 4: Brand Lock-In */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: motionConfig.easing.precision }}
              className="text-center"
            >
              <h1 className="text-[2.5rem] sm:text-4xl md:text-6xl font-bold text-white tracking-tighter leading-tight px-4">
                MILLISECONDS<br className="sm:hidden" /> MATTER<span className="text-[var(--color-ares-teal)]">.</span>
              </h1>
            </motion.div>
          )}
          
          {/* Persistent Grid/Scanlines */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,19,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TelemetryOverlay() {
  const [val, setVal] = useState(120);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVal(Math.floor(Math.random() * (200 - 100) + 100));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          className="text-6xl font-mono text-[var(--color-ares-teal)]/20 font-bold"
        >
          {val}ms
        </motion.div>
      </div>
    </div>
  );
}
