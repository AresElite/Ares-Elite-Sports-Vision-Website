import { Transition, Variants } from 'framer-motion';

// Timing reference: Human reaction time = 150–250ms
export const motionConfig = {
  timing: {
    micro: 0.15, // 150ms
    fast: 0.25,  // 250ms
    base: 0.4,   // 400ms
    slow: 0.6,   // 600ms
    cinematic: 1.5, // 1.5s
  },
  easing: {
    // Mechanical and intentional cubic-bezier curves
    precision: [0.22, 1, 0.36, 1], // Custom easeOut
    mechanical: [0.85, 0, 0.15, 1], // Sharp easeInOut
    linear: [0, 0, 1, 1],
  },
  depth: {
    base: 0,
    hover: 12, // 12px vertical offset
    active: 4,
  }
} as const;

export const transitions: Record<string, Transition> = {
  micro: {
    duration: motionConfig.timing.micro,
    ease: motionConfig.easing.precision,
  },
  base: {
    duration: motionConfig.timing.base,
    ease: motionConfig.easing.precision,
  },
  slow: {
    duration: motionConfig.timing.slow,
    ease: motionConfig.easing.precision,
  },
  cinematic: {
    duration: motionConfig.timing.cinematic,
    ease: motionConfig.easing.mechanical,
  }
};

export const variants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: transitions.base 
    }
  },
  origamiReveal: {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.98
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  },
  glitchReveal: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.85, 0, 0.15, 1],
      }
    }
  },
  cyberPulse: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  },
  cardReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  },
  telemetryLine: {
    hidden: { scaleX: 0, originX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: motionConfig.easing.mechanical }
    }
  }
};
