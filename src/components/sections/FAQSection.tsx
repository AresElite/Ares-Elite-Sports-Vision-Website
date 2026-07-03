import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionReveal } from '../ui/SectionReveal';

const faqs = [
  {
    q: "What is sports vision training and how does it differ from a regular eye exam?",
    a: "A regular eye exam measures static visual acuity (how clearly you see letters on a stationary wall chart from 20 feet away). It is a passive test. Sports vision training evaluates and trains the dynamic visual-cognitive loop—how fast your eyes capture moving targets (Acquire), how quickly your brain filters noise and prioritizes options (Route), how rapidly your body responds (Execute), and how precisely your timing aligns with game-speed reality (Synchronize). We do not train your eyes to see letters; we train your brain to route visual data faster under athletic load."
  },
  {
    q: "Can reaction time actually be trained, or is it genetic?",
    a: "Raw physical reflex is largely genetic, but sport-specific reaction time is highly trainable. In competition, athletes rarely react to simple lights; they react to complex choices. This is called Choice Reaction Time (CRT). Ares decomposes your reaction speed into three distinct processing phases: sensory latency (visual input delay), routing latency (cognitive decision-making speed), and motor latency (physical output execution). By isolating and training the specific bottleneck in this processing chain, athletes frequently achieve a 20% to 30% reduction in response lag."
  },
  {
    q: "What is cognitive training for athletes, and does it transfer to the field?",
    a: "Cognitive training is the optimization of the brain’s executive functions, including spatial awareness, peripheral attention, pattern recognition, and go/no-go inhibitory control. Generic brain-training apps fail to transfer to sports because they lack physical movement. Ares Elite training ensures performance transfer by coupling cognitive load (target tracking, distraction filtering) with sport-relevant motor outputs (footwork, hand-eye coordination, balance). We train the visual and cognitive demands of sport in real-time, high-pressure environments."
  },
  {
    q: "Why is 20/20 vision not enough for elite athletes?",
    a: "20/20 vision only tells you that your optical hardware is clear. In sport, clear eyesight is useless if the routing to the brain is congested. Elite athletic performance requires dynamic visual processing: the ability to track multiple objects simultaneously in your periphery, judge depth at high speeds, and maintain focus through physical fatigue. Having 20/20 static vision does not guarantee you can process a 95 mph fastball or read a split-second gap in traffic at 200 mph."
  },
  {
    q: "How does sensory training help with concussion baseline testing and safety?",
    a: "Standard concussion testing relies on basic memory and balance checks. Ares provides an objective, millisecond-accurate visual-cognitive baseline. Because the visual system utilizes over 50% of the brain's pathways, post-concussion deficits show up immediately as routing delays, tracking errors, or reaction lag. Our baseline data allows coaches and medical professionals to compare pre-injury baseline metrics to post-injury metrics, removing subjective guesswork from return-to-play decisions."
  },
  {
    q: "What does A.R.E.S. stand for?",
    a: "A.R.E.S. stands for Acquire, Route, Execute, and Synchronize. It is the performance framework Ares Elite Sports Vision uses to evaluate how athletes collect visual information, process it through the brain, respond through the body, and coordinate the full system under pressure."
  },
  {
    q: "Who should book a Sports Vision Performance Evaluation?",
    a: "Athletes should book an evaluation if they want to understand how their eyes, brain, and body perform together during sport. It is especially useful for athletes who rely on reaction time, decision speed, tracking, depth perception, peripheral awareness, and hand-eye coordination."
  },
  {
    q: "What makes Ares Elite Sports Vision different?",
    a: "Ares uses a structured performance framework, objective data, and Human Operating System training progressions instead of generic drills or basic vision therapy. The goal is to evaluate and train the full system athletes use under pressure: eyes, brain, body, timing, and execution."
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

export function FAQSection() {
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
    <SectionReveal className="py-24 sm:py-32 bg-[var(--color-ares-bg)] relative overflow-hidden">
      {/* We inject the schema into the DOM directly for SEO since we are not using the SEO component at the page level for this specific block */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-4 uppercase">
            Clarity & Context
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-lg mb-6">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] to-[var(--color-ares-white)]">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl overflow-hidden hover:border-white/20 transition-colors"
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white pr-8">{faq.q}</h3>
                  <ChevronDown className={`w-6 h-6 text-[var(--color-ares-teal)] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 sm:p-8 pt-0 text-white/70 leading-relaxed border-t border-white/5 text-base sm:text-lg">
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
    </SectionReveal>
  );
}
