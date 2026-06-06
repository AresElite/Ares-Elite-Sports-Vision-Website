import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { BOOKING_CONFIG } from '../../config/booking';

interface BookingHeroProps {
  onSelectOffice: (officeId: string) => void;
}

export function BookingHero({ onSelectOffice }: BookingHeroProps) {
  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-ares-purple)]/5 transform skew-x-12 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-[var(--color-ares-teal)]/5 transform -skew-x-12 -translate-x-1/4 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--color-ares-teal)]/30 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-[10px] sm:text-xs font-medium tracking-[0.2em] mb-6 uppercase">
            SECURE YOUR SESSION
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 text-balance">
            BOOK YOUR <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-ares-teal)] to-white">
              PERFORMANCE TRAINING
            </span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-white/60 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed text-balance px-2">
            Select your preferred facility below to view availability and schedule your evaluation or training session directly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {BOOKING_CONFIG.offices.map((office) => (
              <button
                key={office.id}
                onClick={() => onSelectOffice(office.id)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white/5 border border-[var(--color-ares-border)] hover:bg-white/10 hover:border-[var(--color-ares-teal)]/50 transition-all duration-300 text-white font-medium tracking-wide flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                {office.name}
                <ArrowDown className="w-4 h-4 text-[var(--color-ares-teal)] group-hover:translate-y-1 transition-transform" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
