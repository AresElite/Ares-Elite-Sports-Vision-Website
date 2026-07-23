import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Reusable end-cap for content pages (blog posts, FAQ, research).
// Turns reading traffic into lead-magnet signups via the Sensory Assessment.
export function AssessmentEndCap() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="rounded-2xl border border-[var(--color-ares-teal)]/40 bg-[var(--color-ares-charcoal)] p-8 text-center">
        <div className="inline-flex items-center px-3 py-1 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-xs font-bold tracking-widest rounded-full uppercase mb-4">
          Free 5-Minute Assessment
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Curious where your vision actually stands?
        </h3>
        <p className="text-[var(--color-ares-muted)] max-w-xl mx-auto mb-6">
          Take our free online Sensory Assessment — three quick interactive drills
          that measure your reaction speed, tracking, and focus. Get your numbers in
          five minutes.
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide text-sm"
        >
          Start the Assessment <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
