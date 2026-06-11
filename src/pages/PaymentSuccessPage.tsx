import { motion } from 'framer-motion';
import { CheckCircle, CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function PaymentSuccessPage() {
  return (
    <>
      <SEO 
        title="Payment Successful | Ares Elite Sports Vision"
        description="Your reservation is fully confirmed. We look forward to analyzing your neurocognitive baseline."
        path="/payment-success"
      />
      <div className="min-h-dvh bg-[var(--color-ares-bg)] pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto bg-[var(--color-ares-charcoal)]/80 backdrop-blur-xl border border-[var(--color-ares-border)] p-8 sm:p-12 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)]"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30"
        >
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">Payment Successful</h1>
        
        <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
          Your reservation is fully confirmed. We look forward to analyzing your neurocognitive baseline.
        </p>

        <div className="bg-black/30 border border-white/10 p-6 rounded-xl flex flex-col items-center gap-4 text-center mb-10">
          <CalendarDays className="w-8 h-8 text-[var(--color-ares-teal)] opacity-80" />
          <div>
            <h3 className="font-bold text-white mb-2 text-lg">Calendar Invitation Sent</h3>
            <p className="text-white/60 text-sm max-w-sm mx-auto">
              Your official Microsoft Bookings calendar invitation, a receipt from Stripe, and intake forms have been sent to your email.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/blog"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white font-bold transition-all shadow-glow group"
          >
            Review Performance Research
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
    </>
  );
}
