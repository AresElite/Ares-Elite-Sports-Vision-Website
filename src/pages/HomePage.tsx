import { useState, Suspense, lazy } from 'react';
import { Hero } from '../components/sections/Hero';
import { ProblemSection } from '../components/sections/Problem';
import { SystemSection } from '../components/sections/System';
import { MeasurementSection } from '../components/sections/Measurement';
import { RoadmapSection } from '../components/sections/Roadmap';
import { ICPSection } from '../components/sections/ICP';
import { PerformanceResults } from '../components/sections/PerformanceResults';
import { TrainingShowcase } from '../components/sections/TrainingShowcase';
import { TechSection } from '../components/sections/Tech';
import { TestimonialsSection } from '../components/sections/Testimonials';
import { FAQSection } from '../components/sections/FAQSection';
import { CTASection } from '../components/sections/CTA';

import { CinematicIntro } from '../components/intro/CinematicIntro';

import { AnimatePresence } from 'framer-motion';

// Lazy load the heavy 3D canvas
const NeuralBackgroundCanvas = lazy(() => 
  import('../components/canvas').then(module => ({ default: module.NeuralBackgroundCanvas }))
);

export function HomePage() {
  const [introComplete, setIntroComplete] = useState(() => {
    return sessionStorage.getItem('introComplete') === 'true';
  });

  const handleIntroComplete = () => {
    setIntroComplete(true);
    sessionStorage.setItem('introComplete', 'true');
  };

  return (
    <>
      <AnimatePresence>
        {!introComplete && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
      
      <Suspense fallback={null}>
        <NeuralBackgroundCanvas />
      </Suspense>
      
      <main className="relative z-10">
        <Hero isReady={introComplete} />
        {/* Why 20/20 Is Not Enough */}
        <ProblemSection />
        {/* The A.R.E.S. Performance Loop */}
        <SystemSection />
        {/* What We Measure */}
        <MeasurementSection />
        {/* Evaluation -> Training -> Re-Eval */}
        <RoadmapSection />
        {/* Athlete/Parent/Coach Pathways */}
        <ICPSection />
        {/* Proof / Results */}
        <PerformanceResults />
        {/* Training Progression */}
        <TrainingShowcase />
        {/* Technology platform */}
        <TechSection />
        {/* Trust */}
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}
