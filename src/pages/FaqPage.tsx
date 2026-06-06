import { SEO } from '../components/SEO';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "What is sports vision training?",
    a: "Sports vision training is a structured process for improving the visual and cognitive skills athletes use during competition, including reaction time, eye-hand coordination, depth perception, peripheral awareness, visual processing speed, and decision-making under pressure."
  },
  {
    q: "Is sports vision training the same as a regular eye exam?",
    a: "No. A regular eye exam checks eye health and visual clarity. A sports vision evaluation measures how an athlete’s visual system performs under sport-specific demands, including tracking, reaction time, visual processing, decision speed, and coordination."
  },
  {
    q: "Why is 20/20 vision not enough for athletes?",
    a: "20/20 vision only measures how clearly someone sees a stationary target at a distance. Athletes need much more than clarity. They need to track motion, process peripheral information, make fast decisions, coordinate the eyes and body, and perform under pressure."
  },
  {
    q: "Can reaction time be trained?",
    a: "Reaction time can be evaluated and trained when the process is broken into measurable parts, including visual detection, cognitive processing, decision selection, and motor response."
  },
  {
    q: "What is choice reaction time?",
    a: "Choice reaction time measures how quickly an athlete can see information, choose the correct response, and execute that response. It is more sport-relevant than simple reaction time because athletes rarely react without making a decision."
  },
  {
    q: "What does A.R.E.S. stand for?",
    a: "A.R.E.S. stands for Acquire, Route, Execute, and Synchronize. It is the framework Ares Elite Sports Vision uses to evaluate how athletes collect visual information, process it through the brain, respond through the body, and coordinate the full system under pressure."
  },
  {
    q: "Who should book a Sports Vision Performance Evaluation?",
    a: "Athletes should book an evaluation if they want to understand how their eyes, brain, and body perform together during sport. It is especially useful for athletes who rely on reaction time, decision speed, tracking, depth perception, peripheral awareness, and eye-hand coordination."
  },
  {
    q: "What makes Ares Elite Sports Vision different?",
    a: "Ares uses a structured performance framework, objective data, and Human Operating System training progressions instead of generic drills. The goal is to evaluate and train the full system athletes use under pressure: eyes, brain, body, timing, and execution."
  },
  {
    q: "Do teams and organizations use Ares?",
    a: "Yes. Ares works with athletes, teams, coaches, and performance organizations that want objective Human Operating System testing, baseline data, and structured training programs."
  },
  {
    q: "How do athletes get started?",
    a: "Most athletes start with a Sports Vision Performance Evaluation. The evaluation identifies strengths, weaknesses, and performance bottlenecks, then helps determine whether a structured training plan is recommended."
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO 
        title="Sports Vision Training FAQ | Ares Elite Sports Vision"
        description="Answers to common questions about sports vision training, athlete reaction time, visual processing, A.R.E.S., and sports vision evaluations."
        path="/faq"
        schema={schema}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-6 sm:px-8 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-12 tracking-tight leading-tight">
            Sports Vision <br className="hidden md:block"/> Training FAQ
          </h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl overflow-hidden"
                >
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <h3 className="text-lg font-bold text-white pr-8">{faq.q}</h3>
                    <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-6 pt-0 text-white/70 leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
