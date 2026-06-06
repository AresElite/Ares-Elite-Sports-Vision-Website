import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down a bit
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optionally hide on certain pages
  const hideOnPages = ['/book', '/login'];
  if (hideOnPages.includes(location.pathname)) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 pointer-events-none"
        >
          <div className="bg-[var(--color-ares-charcoal)]/90 backdrop-blur-md border border-[var(--color-ares-border)] rounded-xl shadow-2xl p-2 pointer-events-auto flex items-center justify-between">
            <div className="pl-3 py-1 flex-1">
              <div className="text-white font-bold text-sm tracking-tight leading-none mb-1">Take the Baseline.</div>
              <div className="text-[var(--color-ares-teal)] text-[10px] font-mono tracking-widest uppercase">Quantify Performance</div>
            </div>
            <Link 
              to="/book" 
              className="bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white px-5 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center group shadow-[0_0_15px_rgba(41,152,170,0.3)] hover:shadow-[0_0_25px_rgba(41,152,170,0.5)] shrink-0"
            >
              Book Now
              <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
