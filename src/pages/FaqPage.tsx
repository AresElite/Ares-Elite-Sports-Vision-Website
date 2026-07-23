import { SEO } from '../components/SEO';
import { ArrowLeft, ChevronDown, Search, HelpCircle, Activity, Brain, ShieldAlert, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  category: 'athletes' | 'parents' | 'coaches' | 'teams' | 'optometrists' | 'location';
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  // Athletes Category
  {
    category: 'athletes',
    q: "How does sports vision training transfer to actual game-day performance?",
    a: "Sports vision training bridges the gap between raw physical capability and execution. While strength and speed allow you to move faster, vision training allows you to react faster. By reducing Choice Reaction Time (CRT), expanding your peripheral awareness, and training your gaze control, you read plays earlier, track high-speed objects (like a baseball, puck, or opponent) accurately, and make precise decisions under physical fatigue. In elite sports, visual routing delays are often what makes an athlete feel 'half a step slow.'"
  },
  {
    category: 'athletes',
    q: "What is a typical training session like, and what is the weekly time commitment?",
    a: "A typical in-office training session lasts 45 minutes and is highly focused. You will run through dynamic drills that couple visual tracking with physical motor responses—such as tracking multiple moving targets on a screen while balancing, reacting to peripheral cues on tactile boards (Senaptec/SVT), or executing sport-specific movements while wearing strobe-occlusion eyewear. To see optimal gains, we recommend 1 to 2 sessions per week for a 12-week cycle, combined with 10 minutes of daily home neuro-visual work."
  },
  {
    category: 'athletes',
    q: "I already have 20/20 vision. Why do I need sports vision training?",
    a: "Having 20/20 vision only checks your static visual acuity—how clearly you can read stationary letters on a wall chart in a dark room. It tells us nothing about how well your visual system operates in motion. Elite sports require dynamic visual processing: tracking moving targets, estimating depth and speed, maintaining peripheral awareness, and routing visual coordinate data to your muscles under extreme fatigue. Standard eye exams ignore over 80% of the visual skills required for athletic dominance."
  },
  
  // Parents Category
  {
    category: 'parents',
    q: "Is sports vision training safe for youth athletes, and at what age should they start?",
    a: "Yes, sports vision training is entirely safe, non-invasive, and drug-free. It uses physical exercises, eye-tracking systems, and specialized lighting equipment to train neurological pathways. We recommend starting around age 9 or 10. At this developmental stage, the visual-cognitive system is highly adaptable, allowing young athletes to build superior visual tracking habits, hand-eye coordination, and spatial awareness that serve as a strong foundation for their athletic career."
  },
  {
    category: 'parents',
    q: "How does vision training help prevent injuries and concussions on the field?",
    a: "Safety is one of the most significant benefits of vision training. A major cause of concussions and impact injuries is the 'blind-spot hit'—an opponent or object the athlete never saw coming. By training and expanding an athlete's peripheral field of view, they can detect peripheral threats and react to avoid or brace for impacts. Faster visual capture means extra milliseconds to get out of the way or prepare, significantly reducing injury risks."
  },
  {
    category: 'parents',
    q: "Will sports vision training benefit my child's academic performance or reading?",
    a: "Yes. Many of the visual skills trained at Ares—such as saccades (rapid eye movements from one point to another), eye teaming (how well the eyes work together), and sustained visual focus—are directly tied to reading, classroom focus, and cognitive endurance. Parents frequently report that their children experience less eye strain, improved reading speed, and better concentration in school after training."
  },

  // Coaches Category
  {
    category: 'coaches',
    q: "How do coaches integrate Ares visual metrics and data into team training?",
    a: "We provide coaches with objective visual-cognitive profiles for their roster. By identifying each player's primary bottleneck (visual capture delay, cognitive routing lag, or motor execution delay), coaches can tailor skill training and position assignments. For example, a quarterback with a routing bottleneck may benefit from simplified visual reads, while a receiver with an acquisition bottleneck requires tracking drills."
  },
  {
    category: 'coaches',
    q: "Can visual baseline data predict how an athlete will perform under pressure or fatigue?",
    a: "Yes. We test reaction time and decision accuracy both at rest and under athletic load (elevated heart rate and physical fatigue). Athletes with high static processing speed but poor visual stamina will show a major drop-off in decision speed and a spike in error rates late in the game. Knowing this baseline telemetry allows coaches to make informed choices about rotations and identify which players can maintain execution in the final minutes."
  },

  // Teams & Organizations Category
  {
    category: 'teams',
    q: "How does Ares run visual screenings for entire teams or organizations?",
    a: "Ares offers mobile on-site visual screening services for clubs, high schools, universities, and professional teams. We bring portable eye-tracking systems and tactile response arrays to your facility to benchmark your entire roster in a single day. Each player receives a millisecond-accurate visual scorecard, and the coaching staff receives a group dashboard summarizing roster-wide strengths and bottlenecks."
  },
  {
    category: 'teams',
    q: "What space and logistics are required for an on-site team baseline evaluation?",
    a: "We require a standard indoor room (such as a classroom, conference room, or section of a gym) with access to power outlets and stable Wi-Fi. Our team handles the entire setup, and we coordinate with your coaching staff to rotate players through the 15-minute screening stations in small groups, ensuring minimal disruption to your practice or meeting schedules."
  },

  // Optometrists Category
  {
    category: 'optometrists',
    q: "What is the clinical and neuroscientific foundation of the A.R.E.S. protocols?",
    a: "Our training is grounded in the principles of neuroplasticity and visual-motor integration. We target visual processing at the cortical level—focusing on saccadic accuracy, smooth pursuits, stereopsis under load, contrast sensitivity, and multiple object tracking. We utilize peer-reviewed visual-cognitive training methods that strengthen synaptic pathways between the visual cortex, frontoparietal attention networks, and the motor cortex. We address temporal processing delays, helping athletes capture and route spatial coordinate data more efficiently."
  },
  {
    category: 'optometrists',
    q: "How does sports vision performance training differ from traditional vision therapy?",
    a: "Traditional clinical vision therapy focuses on rehabilitating visual deficits and pathologies (such as amblyopia, strabismus, convergence insufficiency, or brain injury rehabilitation) to return a patient to normal baseline function. Sports vision training takes healthy, 20/20 visual systems and optimizes them for superior, hyper-efficient performance. It is performance-tuning for the visual engine, pushing visual-motor integration beyond normal parameters."
  },
  {
    category: 'optometrists',
    q: "What specialized equipment is utilized during the evaluation and training phases?",
    a: "We use a curated suite of elite sensory technologies, including eye-tracking systems, strobe-occlusion eyewear (to force reliance on predictive spatial awareness), tactile coordinate reaction boards (Senaptec / SVT) for Choice Reaction Time and peripheral response, and 3D multiple object tracking (MOT) systems to train spatial attention mapping under high cognitive load."
  },

  // Location & Pricing Category
  {
    category: 'location',
    q: "How much does the Sports Vision Performance Evaluation cost and how do I book?",
    a: "The comprehensive 75-minute Sports Vision Performance Evaluation costs $449. This diagnostic session includes static/dynamic vision audits, eye-tracking calibration, Choice Reaction Time (CRT) mapping, post-error slowing telemetry, and a complete, printed/dispatched Millisecond Scorecard. You can review availability and reserve a slot directly at areselitesports.vision/book/evaluation."
  },
  {
    category: 'location',
    q: "Where is Ares Elite Sports Vision located, and are there remote training options?",
    a: "Our facility is located on the second floor of Elemental Fitness at 510 W. Carmel Dr., Carmel, IN 46032. For athletes outside Central Indiana, we offer virtual Tele-Training packages. After completing an online or in-office baseline, we ship customized training gear (including strobe-occlusion eyewear) and host live, one-on-one virtual training sessions with our performance staff."
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'athletes', label: 'For Athletes', icon: <Activity className="w-4 h-4" /> },
  { id: 'parents', label: 'For Parents', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'coaches', label: 'For Coaches', icon: <Award className="w-4 h-4" /> },
  { id: 'teams', label: 'For Teams', icon: <Brain className="w-4 h-4" /> },
  { id: 'optometrists', label: 'For Optometrists', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'location', label: 'Pricing & Location', icon: <MapPin className="w-4 h-4" /> }
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
              placeholder="Search questions or keywords (e.g. 'parents', 'coaches', 'clinical', 'evaluation')..."
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
                    ? 'bg-[var(--color-ares-teal)] text-white shadow-lg shadow-[var(--color-ares-teal)]/15 scale-[1.02]'
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
                  No matching questions found. Try search terms like 'visual', 'reaction', or 'optometrist'.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* End-Cap Banner */}
          <div className="mt-16 rounded-2xl border border-[var(--color-ares-teal)]/40 bg-[var(--color-ares-charcoal)] p-8 sm:p-10 text-center">
            <span className="text-xs font-mono text-[var(--color-ares-teal)] uppercase tracking-widest font-bold block mb-2">Expose Visual Latency</span>
            <h3 className="text-2xl font-bold text-white mb-3">Map Your Visual Processing Speed</h3>
            <p className="text-white/70 max-w-xl mx-auto mb-6 text-sm">
              Run our 3-drill interactive diagnostic right in your browser to benchmark your decision speed, or schedule a 75-minute evaluation at our Carmel facility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment" className="inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[#0A0B14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity uppercase text-xs tracking-wider">
                Start Online Assessment →
              </Link>
              <Link to="/book/evaluation" className="inline-flex items-center justify-center gap-2 border border-[var(--color-ares-purple)] text-white font-bold px-6 py-3 rounded-xl hover:bg-[var(--color-ares-purple)]/20 transition-all uppercase text-xs tracking-wider">
                Book Clinic Evaluation ($449)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
