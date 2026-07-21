import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

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
                  Neuro-Cognitive Latency Diagnostic
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  Map Your Visual Processing Speed
                </h2>
                <p className="text-[var(--color-ares-muted)] text-lg mb-6 leading-relaxed">
                  Most training programs guess. We measure. Run 3 interactive online drills right now to benchmark your Choice Reaction Time, Target Capture, and Focus Latency.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/assessment"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide text-sm"
                  >
                    Start Assessment <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/book/evaluation"
                    className="inline-flex items-center justify-center gap-2 border border-[var(--color-ares-purple)] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[var(--color-ares-purple)]/20 transition-all uppercase tracking-wide text-xs"
                  >
                    Book Clinic Evaluation ($449)
                  </Link>
                </div>
              </div>

              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-5"
              >
                <li className="flex items-start gap-4">
                  <span className="p-2.5 rounded-xl bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] shrink-0">
                    <Target className="w-5 h-5" />
                  </span>
                  <span className="text-[var(--color-ares-muted)]">
                    <strong className="text-white block">Choice Latency Telemetry</strong>
                    Measure motor reaction lag under split-second visual decision stress.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="p-2.5 rounded-xl bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] shrink-0">
                    <Activity className="w-5 h-5" />
                  </span>
                  <span className="text-[var(--color-ares-muted)]">
                    <strong className="text-white block">Gaze Pursuit & Tracking</strong>
                    Benchmark target acquisition accuracy against elite athletic percentiles.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="p-2.5 rounded-xl bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <span className="text-[var(--color-ares-muted)]">
                    <strong className="text-white block">Custom Bottleneck Profile</strong>
                    Get an immediate empirical profile mapping your exact visual bottlenecks.
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
