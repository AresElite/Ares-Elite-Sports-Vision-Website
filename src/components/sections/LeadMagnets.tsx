import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Trophy, CalendarCheck, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

// The 7-Day Vision Challenge — the site's single lead magnet.
// Complete all 7 days -> unlock 10% off a Sports Vision Performance Evaluation.
export function LeadMagnets() {
  return (
    <section className="py-24 bg-[var(--color-ares-bg)] relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-ares-border)] to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={30} speed={0.8}>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] p-8 sm:p-12">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-gradient-to-br from-purple-900 to-slate-900 rounded-full blur-3xl opacity-30" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-xs font-bold tracking-widest rounded-full uppercase mb-5">
                  Free · 7 Days · Real Reward
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  Take the 7-Day Vision Challenge
                </h2>
                <p className="text-[var(--color-ares-muted)] text-lg mb-6">
                  Two drills a day from the same system we use with real athletes.
                  Finish all seven days and earn{' '}
                  <strong className="text-white">
                    10% off a Sports Vision Performance Evaluation
                  </strong>{' '}
                  at our Carmel clinic.
                </p>
                <Link
                  to="/vision-challenge"
                  className="inline-flex items-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide text-sm"
                >
                  Start the challenge <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-5"
              >
                <li className="flex items-start gap-4">
                  <span className="p-2.5 rounded-xl bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] shrink-0">
                    <Eye className="w-5 h-5" />
                  </span>
                  <span className="text-[var(--color-ares-muted)]">
                    <strong className="text-white block">Three real drills</strong>
                    Focus, tracking, and eye-teaming — 10-15 minutes a day
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="p-2.5 rounded-xl bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] shrink-0">
                    <Trophy className="w-5 h-5" />
                  </span>
                  <span className="text-[var(--color-ares-muted)]">
                    <strong className="text-white block">A challenge board</strong>
                    Check off each day — your reward unlocks when you finish
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="p-2.5 rounded-xl bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] shrink-0">
                    <CalendarCheck className="w-5 h-5" />
                  </span>
                  <span className="text-[var(--color-ares-muted)]">
                    <strong className="text-white block">10% off your evaluation</strong>
                    The full assessment we run for competitive athletes
                  </span>
                </li>
              </motion.ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
