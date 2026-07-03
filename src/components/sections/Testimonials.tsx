import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionReveal } from '../ui/SectionReveal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "I think what has helped me the most is putting myself in an uncomfortable environment where I must make decisions fast, but also accurately... <span class='text-white font-medium'>In the real deal you have to be able to make good decisions while driving at 240 mph wheel to wheel.</span> I feel like I've been able to enter that same realm of discomfort training with Ares Elite.",
    author: "Felix Rosenqvist",
    role: "Meyer Shank Racing (IndyCar)",
    aq: "152 / 200",
    score: 5
  },
  {
    quote: "<span class='text-white font-medium'>Ares Elite Sports Vision in its simplest form is a personal trainer for your eyes and brain.</span> Through my training and our work on expanding my peripheral vision I was able to correctly call the foul. My processing is faster and my sequencing is faster due to my training because 'Milliseconds Matter'.",
    author: "James Williams",
    role: "NBA Official",
    aq: "145 / 200",
    score: 5
  },
  {
    quote: "<span class='text-white font-medium'>I feel like the biggest gain in performance for me is just decision-making time.</span> Both on simple decisions and complex decisions while driving. The next biggest gain has been how it's helped me focus on more things at one time while reacting to what was going on on-track.",
    author: "Alex Palou",
    role: "Chip Ganassi Racing (IndyCar)",
    aq: "161 / 200",
    score: 5
  },
  {
    quote: "As a professional soccer goalie, fast reaction times and quick decision making are crucial. When I have an attacker driving at me, I have to make a split second decision... <span class='text-white font-medium'>Ever since I started this training, I've noticed I've been making way more of these saves.</span>",
    author: "Yannik Oettl",
    role: "Indy XI (USL Championship)",
    aq: "134 / 200",
    score: 5
  },
  {
    quote: "<span class='text-white font-medium'>Ares has had an impact on a number of things on the bike, but the biggest is confidence.</span> I can see, decide, and react to all the variables involved with riding in a tight peloton of 150 riders going 30+ mph on technical courses so much quicker and better.",
    author: "Chloe Dygert",
    role: "Professional Cyclist",
    aq: "128 / 200",
    score: 5
  },
  {
    quote: "The connection between visual input and physical movement is a key part that directly relates to performance. <span class='text-white font-medium'>Reaction times and mental processing have become quicker from when I first started this training.</span> It helps me be able to perform at a high/effective level.",
    author: "Marcus J.",
    role: "Chip Ganassi Racing Pit Crew",
    aq: "119 / 200",
    score: 5
  }
];

// Average reading speed: ~200 words per minute -> ~3.3 words per second
// We add a base delay of 2 seconds for transitions/context switching
const calculateReadingTime = (text: string) => {
  const wordCount = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  return Math.max((wordCount / 3.3) * 1000 + 2000, 5000); // Minimum 5 seconds
};

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentReadingTime = calculateReadingTime(testimonials[currentIndex].quote);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const startTime = Date.now();
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / currentReadingTime) * 100, 100);
      setProgress(newProgress);
    }, 50);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, currentReadingTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, currentReadingTime]);

  // Calculate visible items (previous, current, next)
  const getVisibleItems = () => {
    const items = [];
    for (let i = -1; i <= 1; i++) {
      let index = (currentIndex + i) % testimonials.length;
      if (index < 0) index += testimonials.length;
      items.push({ item: testimonials[index], offset: i, index });
    }
    return items;
  };

  return (
    <SectionReveal id="testimonials" className="py-20 sm:py-32 relative border-t border-[var(--color-ares-border)]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[var(--color-ares-bg)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[var(--color-ares-teal)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" distance={30} speed={0.8}>
          <div className="mb-12 sm:mb-20 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-6 uppercase">
              Athlete Success
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight text-balance">
              PROVEN AT THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] to-[var(--color-ares-white)]">HIGHEST LEVEL</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed text-balance">
              Hear from the athletes who have transformed their performance, reaction time, and cognitive processing with the A.R.E.S. System.
            </p>
          </div>
        </ScrollReveal>

        <div 
          className="relative h-[500px] sm:h-[400px] w-full flex items-center justify-center perspective-1000"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="popLayout">
            {getVisibleItems().map(({ item, offset, index }) => {
              const isCenter = offset === 0;
              return (
                <motion.div
                  key={`${index}-${offset}`}
                  initial={{ 
                    opacity: 0, 
                    x: offset * 100 + '%', 
                    scale: 0.8,
                    rotateY: offset * -15,
                    zIndex: 0
                  }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.4, 
                    x: `${offset * 105}%`, 
                    scale: isCenter ? 1 : 0.85,
                    rotateY: offset * -10,
                    zIndex: isCenter ? 10 : 5
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: offset * -100 + '%', 
                    scale: 0.8,
                    rotateY: offset * 15,
                    zIndex: 0
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute w-full max-w-lg ${isCenter ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={() => {
                    if (offset === -1) handlePrev();
                    if (offset === 1) handleNext();
                  }}
                >
                  <div className={`h-full bg-[var(--color-ares-charcoal)] rounded-xl border ${isCenter ? 'border-[var(--color-ares-teal)]/40 shadow-[0_0_40px_rgba(41,152,170,0.15)]' : 'border-[var(--color-ares-border)]'} p-6 sm:p-10 flex flex-col relative transition-all duration-500`}>
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent ${isCenter ? 'via-[var(--color-ares-teal)]/50' : 'via-[var(--color-ares-teal)]/0'} to-transparent transition-all duration-500`} />
                    
                    <Quote className={`w-8 h-8 sm:w-10 sm:h-10 mb-6 transition-colors duration-500 ${isCenter ? 'text-[var(--color-ares-teal)]' : 'text-[var(--color-ares-teal)]/20'}`} />
                    
                    <p 
                      className={`text-white/80 text-sm sm:text-lg leading-relaxed mb-8 flex-grow font-light transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-40 line-clamp-4'}`}
                      dangerouslySetInnerHTML={{ __html: `&ldquo;${item.quote}&rdquo;` }}
                    />
                    
                    <div className="mt-auto pt-6 border-t border-[var(--color-ares-border)]">
                      <div className={`flex items-center gap-1 mb-4 transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-40'}`}>
                        {[...Array(item.score)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[var(--color-ares-teal)] text-[var(--color-ares-teal)]" />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-white font-bold text-base sm:text-lg tracking-tight transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-60'}`}>{item.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest mb-1">A.R.E.S. AQ™</div>
                          <div className={`text-white font-mono font-bold text-xs sm:text-sm bg-white/5 px-2 py-1 rounded transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-60'}`}>{item.aq}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] text-white/50 hover:text-white hover:border-[var(--color-ares-teal)]/50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setProgress(0);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[var(--color-ares-teal)] w-4' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="p-2 rounded-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] text-white/50 hover:text-white hover:border-[var(--color-ares-teal)]/50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Team Logos Strip */}
        <div className="mt-32 pt-16 border-t border-[var(--color-ares-border)] w-full">
          <p className="text-center text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[var(--color-ares-teal)] uppercase mb-8">Trusted by Athletes From</p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
             <img src="https://logo.clearbit.com/meyershankracing.com" alt="Meyer Shank Racing" className="h-10 sm:h-12 w-auto object-contain rounded-sm" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
             <img src="https://logo.clearbit.com/chipganassiracing.com" alt="Chip Ganassi Racing" className="h-10 sm:h-12 w-auto object-contain rounded-sm" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
             <img src="https://logo.clearbit.com/indyeleven.com" alt="Indy Eleven" className="h-10 sm:h-12 w-auto object-contain rounded-sm" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
             <img src="https://logo.clearbit.com/nba.com" alt="NBA" className="h-10 sm:h-12 w-auto object-contain rounded-sm" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}