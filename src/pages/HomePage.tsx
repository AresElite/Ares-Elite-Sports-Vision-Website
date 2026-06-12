import { useState, Suspense, lazy } from 'react';
import { Hero } from '../components/sections/Hero';
import { ProblemSection } from '../components/sections/Problem';
import { SystemSection } from '../components/sections/System';
import { MeasurementSection } from '../components/sections/Measurement';
import { ICPSection } from '../components/sections/ICP';
import { PerformanceResults } from '../components/sections/PerformanceResults';
import { TrainingShowcase } from '../components/sections/TrainingShowcase';
import { TestimonialsSection } from '../components/sections/Testimonials';
import { FAQSection } from '../components/sections/FAQSection';
import { CTASection } from '../components/sections/CTA';
import { SEO } from '../components/SEO';
import { AssessmentModal } from '../components/ui/AssessmentModal';

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

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Ares Elite Sports Vision",
    "url": "https://areselitesports.vision",
    "description": "Premium neurocognitive sports training and sports vision evaluations in Carmel, IN (Indianapolis area).",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "510 W. Carmel Dr., Inside Elemental Fitness, 2nd Floor",
      "addressLocality": "Carmel",
      "addressRegion": "IN",
      "postalCode": "46032",
      "addressCountry": "US"
    },
    "telephone": "+1 (773) 981-1447",
    "email": "drl@areselitesportsvision.com",
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Carmel, IN"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Indianapolis, IN"
      }
    ],
    "sameAs": [
      "https://www.youtube.com/@AresEliteSportsVision",
      "https://www.facebook.com/areselitesv/"
    ]
  };

  return (
    <>
      <SEO 
        title="Neurocognitive Sports Training & Vision Coaching | Ares Elite Sports Vision"
        description="Elite neurocognitive sports training and sports vision evaluations in Carmel, IN. Optimize visual-cognitive skills, reaction time, and tracking speed."
        path="/"
        schema={homeSchema}
      />

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
        {/* Athlete/Parent/Coach Pathways */}
        <ICPSection />
        {/* Proof / Results */}
        <PerformanceResults />
        {/* Training Progression */}
        <TrainingShowcase />
        {/* Trust */}
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <AssessmentModal />
    </>
  );
}
