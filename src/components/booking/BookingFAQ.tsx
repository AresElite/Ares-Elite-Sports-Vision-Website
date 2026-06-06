import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { BOOKING_CONFIG } from '../../config/booking';

export function BookingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-tight">Frequently Asked Questions</h2>
        <p className="text-white/60 text-sm sm:text-base px-4">Everything you need to know before booking your session.</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {BOOKING_CONFIG.faq.map((item, index) => (
          <div 
            key={index}
            className="bg-[var(--color-ares-charcoal)]/60 border border-[var(--color-ares-border)] rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-medium text-white pr-4 sm:pr-8 text-sm sm:text-base">{item.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`} 
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
