import { motion } from 'framer-motion';
import { Mail, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function BookingHoldPage() {
  return (
    <>
      <SEO 
        title="Processing Reservation | Ares Elite Sports Vision"
        description="Your sports vision slot is tentatively held. Please complete payment to finalize your booking."
        path="/booking-hold"
      />
      <div className="min-h-dvh bg-[var(--color-ares-bg)] pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] bg-[var(--color-ares-teal)]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto bg-[var(--color-ares-charcoal)]/80 backdrop-blur-xl border border-[var(--color-ares-border)] p-8 sm:p-12 rounded-3xl shadow-[0_0_50px_rgba(41,152,170,0.15)]"
      >
        <div className="w-20 h-20 bg-[var(--color-ares-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--color-ares-teal)]/30">
          <Clock className="w-10 h-10 text-[var(--color-ares-teal)] animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">Processing Reservation...</h1>
        
        <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
          Your slot is tentatively held. Please check your email or SMS right now for your secure Stripe payment link to finalize this reservation.
        </p>

        <div className="bg-black/30 border border-white/10 p-6 rounded-xl flex items-start gap-4 text-left mb-10">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-white mb-2 text-lg">Action Required</h3>
            <p className="text-white/60 text-sm">
              In order to secure this slot on our calendar, payment must be completed. 
              <strong className="text-white block mt-2">Unpaid slots are automatically released after 15 minutes.</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="mailto:"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white font-bold transition-all shadow-glow group"
          >
            Check Email Inbox
            <Mail className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </a>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
          >
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
    </>
  );
}
