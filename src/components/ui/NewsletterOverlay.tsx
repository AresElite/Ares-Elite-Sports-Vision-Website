import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export function NewsletterOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    // Simulate API call to email provider (e.g., Mailchimp/ActiveCampaign via Power Automate)
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setEmail('');
      }, 3000);
    }, 1200);
  };

  return (
    <>
      {/* Unobtrusive Trigger Button - Bottom Left */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-40 flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] shadow-glow text-white/50 hover:text-white transition-all duration-300 group ${isOpen ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <Terminal className="w-4 h-4 text-[var(--color-ares-teal)] group-hover:animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest uppercase">Tap Intel Feed</span>
      </motion.button>

      {/* Expanded Newsletter Terminal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-xl shadow-glow-strong overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-ares-border)] bg-black/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--color-ares-teal)]" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-[var(--color-ares-teal)] uppercase">A.R.E.S. Intelligence Brief</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Core */}
            <div className="p-6 relative">
              {/* Background gradient hint */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-ares-teal)]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  Stop training output until you measure the input.
                </h3>
                <p className="text-xs text-white/60 mb-6 leading-relaxed">
                  Join elite facilities, athletes, and coaches receiving our weekly brief. We decode neurocognitive bottlenecks, unpack advanced concussion baselining, and explore the A.R.E.S. loop.
                </p>

                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-6 text-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[var(--color-ares-teal)] mb-3" />
                    <span className="text-sm font-bold text-white tracking-widest uppercase">Signal Intercepted</span>
                    <span className="text-xs text-white/50 mt-2">Welcome to the network.</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Intercept the signal (Email)"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors font-mono"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 bg-[var(--color-ares-teal)]/20 hover:bg-[var(--color-ares-teal)] border border-[var(--color-ares-teal)]/50 text-white py-3 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 group"
                    >
                      {status === 'submitting' ? (
                        <Zap className="w-4 h-4 animate-pulse text-[var(--color-ares-teal)]" />
                      ) : (
                        <>
                          Establish Uplink
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-[9px] text-white/30 text-center uppercase tracking-wider mt-2">
                      Zero noise. Operational intelligence only.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
