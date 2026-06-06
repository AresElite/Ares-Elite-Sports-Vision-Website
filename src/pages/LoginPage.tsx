import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="min-h-dvh bg-[var(--color-ares-bg)] text-white relative flex items-center justify-center pt-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full pb-24">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl text-white font-bold mb-4 tracking-tight">Client Portal Area</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">Access your custom training protocols, session packs, and scheduling tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Clients */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-purple)]/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_40px_rgba(139,92,246,0.1)] flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-full bg-[var(--color-ares-purple)]/20 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[var(--color-ares-purple)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Active Athletes</h2>
              <p className="text-white/70 mb-8 text-lg">
                Proceed to the secure portal to view your calendar, manage bookings, and access your training account.
              </p>
            </div>
            <a
              href="https://thankful-plant-05c009e0f.1.azurestaticapps.net/login"
              target="_blank" rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-[var(--color-ares-purple)] hover:bg-[var(--color-ares-purple)]/90 text-white font-bold transition-all flex items-center justify-center gap-2 text-lg shadow-glow shadow-[var(--color-ares-purple)]/20"
            >
              Continue to Login <ExternalLink className="w-5 h-5 mx-1" />
            </a>
          </motion.div>

          {/* New Clients */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-full bg-[var(--color-ares-teal)]/20 flex items-center justify-center mb-6">
                <UserPlus className="w-8 h-8 text-[var(--color-ares-teal)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">New to A.R.E.S.?</h2>
              <div className="bg-[var(--color-ares-teal)]/10 border border-[var(--color-ares-teal)]/30 p-4 rounded-xl mb-6">
                <p className="text-base text-white/90">
                  The Client Portal is only for active Ares athletes. If you have not yet completed an evaluation, please begin there.
                </p>
              </div>
            </div>
            <a
              href="/book/evaluation"
              target="_blank" rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-[var(--color-ares-teal)] hover:bg-[var(--color-ares-teal)]/90 text-white font-bold transition-all flex items-center justify-center gap-2 text-lg shadow-glow"
            >
              Book Evaluation <ArrowRight className="w-5 h-5 mx-1" />
            </a>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
