import React from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NeuralBackground } from '../components/ui/NeuralBackground';
import { AssessmentWizard } from '../components/ui/AssessmentWizard';

export function AssessmentPage() {
  return (
    <>
      <SEO 
        title="Interactive Cognitive Sensory Assessment | Ares Elite Sports Vision"
        description="Test your reaction time, choice processing speed, and pattern recognition. Discover your visual-cognitive bottlenecks and get baseline recommendations."
        path="/assessment"
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
        {/* Animated neural pathways backdrop */}
        <div className="absolute inset-0 z-0 opacity-40">
          <NeuralBackground />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-ares-teal)]/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--color-ares-purple)]/5 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="w-full max-w-4xl relative z-10 my-auto">
          {/* Header Link */}
          <div className="mb-6 flex justify-start">
            <Link to="/" className="inline-flex items-center text-white/50 hover:text-white transition-colors group text-sm font-mono uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
          
          <AssessmentWizard isEmbedded={true} />
        </div>
      </div>
    </>
  );
}
