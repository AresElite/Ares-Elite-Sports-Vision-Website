import { SEO } from '../components/SEO';
import { ArrowLeft, ChevronDown, Search, HelpCircle, Activity, Brain, ShieldAlert, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  category: 'frameworks' | 'reaction' | 'cognitive' | 'sports' | 'location';
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    category: 'frameworks',
    q: "What is sports vision training and how does it differ from a regular eye exam?",
    a: "A regular eye exam is passive and measures static visual acuity (how clearly you see stationary letters from 20 feet away on a wall chart). Sports vision training evaluates and trains the dynamic visual-cognitive loop—how fast your eyes capture moving targets (Acquire), how quickly your brain filters noise and prioritizes options (Route), how rapidly your body responds (Execute), and how precisely your timing aligns with game-speed reality (Synchronize). We do not train your eyes to see letters; we train your brain to route visual data faster under athletic load."
  },
  {
    category: 'frameworks',
    q: "Why is 20/20 vision not enough for elite athletic performance?",
    a: "20/20 vision only tells you that your optical hardware is clear. In sport, clear eyesight is useless if the routing to the brain is congested. Elite performance requires dynamic visual processing: peripheral object tracking, high-speed depth perception, and focus preservation under fatigue. Having 20/20 static vision does not guarantee you can process a 95 mph fastball or read a split-second gap in traffic at 200 mph."
  },
  {
    category: 'frameworks',
    q: "What is a visual bottleneck in sports performance?",
    a: "A visual bottleneck is a processing delay at any point in the visual-cognitive-motor loop. It occurs when an athlete's eyes capture information slowly (Acquire bottleneck), when the brain delays processing the choice (Route bottleneck), or when the motor response is laggy (Execute bottleneck). Even if an athlete is physically fast, a visual bottleneck will cause them to react late, make poor decisions under pressure, or struggle with spatial tracking."
  },
  {
    category: 'frameworks',
    q: "What does A.R.E.S. stand for?",
    a: "A.R.E.S. stands for Acquire, Route, Execute, and Synchronize. It is the proprietary framework Ares Elite Sports Vision uses to evaluate and train how athletes collect visual information, process it through the brain, respond through the body, and coordinate the full system under athletic load."
  },
  {
    category: 'reaction',
    q: "How does reaction time affect athletic performance, and can it be trained?",
    a: "Reaction time directly determines an athlete's spacing, timing, and execution. Raw reflex is genetic, but sport-specific reaction time—Choice Reaction Time (CRT)—is highly trainable. Ares decomposes reaction speed into sensory latency, routing latency, and motor latency. By isolating the bottleneck in this chain, athletes learn to filter distractions, anticipate plays, and respond faster, achieving a 20% to 30% reduction in response lag."
  },
  {
    category: 'reaction',
    q: "What reaction speed drills do NFL players and football athletes use?",
    a: "NFL and football athletes use neurocognitive drills that couple visual tracking with physical motor responses. Instead of reacting to simple lights, they practice Choice Reaction drills (reacting to visual patterns, changing target colors, or visual cues), spatial recall, and peripheral awareness drills while executing dropbacks, cuts, or catches. This trains the brain to maintain executive control and make split-second decisions in high-stimulus environments."
  },
  {
    category: 'cognitive',
    q: "What is sports cognitive training and how does it improve decision-making?",
    a: "Sports cognitive training is the optimization of the brain’s executive functions, including spatial awareness, peripheral attention, pattern recognition, and go/no-go inhibitory control. Ares couples cognitive load (such as target tracking and distraction filtering) with sport-relevant motor outputs (footwork, hand-eye coordination, balance) to ensure that the cognitive gains transfer directly to the field or court."
  },
  {
    category: 'cognitive',
    q: "Can sports vision training and objective baseline testing aid in concussion recovery?",
    a: "Yes. Since the visual system utilizes over 50% of the brain's pathways, post-concussion deficits show up immediately as tracking errors, routing delays, or reaction lag. Ares provides objective, millisecond-accurate visual-cognitive baselines. Comparing pre-injury baselines to post-injury metrics removes subjective guesswork, allowing coaches and medical professionals to make safe, data-driven return-to-play decisions and guide targeted concussion vision therapy."
  },
  {
    category: 'sports',
    q: "Is sports vision and neurocognitive training effective for youth/young athletes?",
    a: "Absolutely. The visual-cognitive system undergoes rapid development during adolescence. Early training helps young athletes establish superior tracking mechanics, depth perception, spatial awareness, and cognitive control. This not only accelerates athletic development and hand-eye coordination but also improves safety by expanding their peripheral field of view, helping them see and avoid unexpected impacts."
  },
  {
    category: 'sports',
    q: "How does sports vision training benefit motorsport and racing athletes?",
    a: "Motorsport athletes operate in high-speed, G-force environments where visual latency is critical. Ares trains racing drivers in high-speed visual acquisition, dynamic depth perception, and peripheral tracking. Drills simulate rapid visual shifts, helping drivers track visual gaps, anticipate braking points, and maintain split-second reaction times even under extreme physical fatigue and high heart rates."
  },
  {
    category: 'location',
    q: "Where can I get a professional sports vision evaluation in Carmel or Indianapolis, Indiana?",
    a: "Ares Elite Sports Vision is located at 510 W. Carmel Dr. Carmel, IN 46032, serving Carmel, Indianapolis, and the surrounding regional area. Our facility is equipped with state-of-the-art neurocognitive and sports vision technology. You can book a comprehensive 75-minute in-office evaluation directly through our website to audit your dynamic visual system."
  },
  {
    category: 'location',
    q: "What is included in the Ares Sports Vision Performance Evaluation?",
    a: "The evaluation is a comprehensive 75-minute assessment that measures: static and dynamic visual acuity, contrast sensitivity, depth perception, binocular coordination, peripheral tracking, choice reaction time, post-error slowing, and spatial recall. You receive a complete sensory telemetry report detailing your visual strengths, weaknesses, and a customized performance training recommendation."
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'frameworks', label: 'General & Frameworks', icon: <Award className="w-4 h-4" /> },
  { id: 'reaction', label: 'Reaction Speed', icon: <Activity className="w-4 h-4" /> },
  { id: 'cognitive', label: 'Cognitive & Concussions', icon: <Brain className="w-4 h-4" /> },
  { id: 'sports', label: 'Youth & Motorsports', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'location', label: 'Local Evaluations', icon: <MapPin className="w-4 h-4" /> }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const schema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": filteredFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
  }, [filteredFaqs]);

  return (
    <>
      <SEO 
        title="Sports Vision Training FAQ & Knowledge Base | Carmel, IN"
        description="Get answers about sports vision training, reaction speed drills, cognitive sports training, concussion baseline tests, motorsport visual performance, and evaluations in Carmel, Indiana."
        path="/faq"
        schema={schema}
      />
      
      <div className="min-h-screen bg-[var(--color-ares-bg)] pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient flares */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-gradient-to-br from-[var(--color-ares-teal)]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-gradient-to-br from-[var(--color-ares-purple)]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-12 group">
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Back to Home
          </Link>
          
          <div className="text-center md:text-left mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">
              Sports Vision <br /> Knowledge Base
            </h1>
            <p className="text-[var(--color-ares-muted)] text-lg max-w-2xl">
              Explore deep answers on visual-cognitive performance, neuro-motor reaction drills, concussion baselines, and specialized athletic sensory training.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text"
              placeholder="Search questions or keywords (e.g. 'Carmel', 'NFL', 'Motorsports')..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null);
              }}
              className="w-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl py-4 pl-12 pr-6 text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors text-base"
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[var(--color-ares-border)]">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] shadow-lg shadow-[var(--color-ares-teal)]/15 scale-[1.02]'
                    : 'bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] text-white/70 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredFaqs.length > 0 ? (
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {filteredFaqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <div 
                        key={index} 
                        className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl overflow-hidden hover:border-white/10 transition-colors"
                      >
                        <button 
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                        >
                          <h3 className="text-lg font-bold text-white pr-8">{faq.q}</h3>
                          <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <div className="p-6 pt-0 text-white/75 leading-relaxed border-t border-white/5 text-sm sm:text-base">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-white/50"
                >
                  No matching questions found. Try search terms like 'visual', 'reaction', or 'evaluation'.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
