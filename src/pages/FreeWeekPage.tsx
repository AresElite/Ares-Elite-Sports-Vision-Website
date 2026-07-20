import { SEO } from '../components/SEO';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Loader2, ArrowRight, Eye, Target, Pencil } from 'lucide-react';

// Free Week lead magnet: email capture -> lead + nurture sequence -> instant access.
export default function FreeWeekPage() {
  const [form, setForm] = useState({ firstName: '', email: '', sport: '' });
  const [submitting, setSubmitting] = useState(false);
  const [unlockedEmail, setUnlockedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/resource-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          sport: form.sport || undefined,
          resourceName: 'Free Week — Beginner Sports Performance Drills',
          landingPage: '/free-week',
        }),
      });
      if (!res.ok) throw new Error('Signup failed');
      setUnlockedEmail(form.email.trim().toLowerCase());
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (unlockedEmail) {
    return (
      <div className="bg-[var(--color-ares-bg)] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-4 flex items-center justify-between">
          <span className="text-sm text-[var(--color-ares-muted)]">
            Your Free Week of Vision Training
          </span>
          <span className="text-sm text-[var(--color-ares-teal)]">Unlocked</span>
        </div>
        <iframe
          title="Free Week — Vision Training"
          src={`/api/free-week?email=${encodeURIComponent(unlockedEmail)}`}
          className="w-full"
          style={{ height: 'calc(100vh - 120px)', border: 0, background: '#0B0F2A' }}
        />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Free Week of Vision Training | Ares Elite Sports Vision"
        description="Get Week 1 of the Beginner Sports Performance Drills program free — three core vision drills, a 7-day schedule, and your baseline test. Train your eyes like you train your body."
        path="/free-week"
      />
      <div className="bg-[var(--color-ares-bg)] min-h-screen px-4 pt-28 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Pitch */}
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-xs font-bold tracking-widest rounded-full uppercase mb-6">
              Free · No purchase required
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
              A free week of the drills we use with real athletes.
            </h1>
            <p className="text-[var(--color-ares-muted)] text-lg mb-8">
              Week 1 of our Beginner Sports Performance Drills program — the same
              training system we run in our Carmel clinic, built for home. Three core
              drills, a 7-day schedule, and a baseline test so you can measure the change.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[var(--color-ares-text)]">
                <Eye className="w-5 h-5 text-[var(--color-ares-teal)] mt-1 shrink-0" />
                <span>
                  <strong className="text-white">Three core drills</strong> — focus
                  switching, tracking, and convergence, with full instructions
                </span>
              </li>
              <li className="flex items-start gap-3 text-[var(--color-ares-text)]">
                <Target className="w-5 h-5 text-[var(--color-ares-teal)] mt-1 shrink-0" />
                <span>
                  <strong className="text-white">A real 7-day schedule</strong> — two
                  drills a day, 10-15 minutes, with a tap-to-complete tracker
                </span>
              </li>
              <li className="flex items-start gap-3 text-[var(--color-ares-text)]">
                <Pencil className="w-5 h-5 text-[var(--color-ares-teal)] mt-1 shrink-0" />
                <span>
                  <strong className="text-white">Zero equipment</strong> — a pencil and
                  a window. That's it.
                </span>
              </li>
            </ul>
          </div>

          {/* Capture form */}
          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Unlock your free week</h2>
            <p className="text-sm text-[var(--color-ares-muted)] mb-6">
              Instant access in your browser — nothing to download.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                  First name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-[var(--color-ares-border)] rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-[var(--color-ares-border)] rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                  Sport (optional)
                </label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-[var(--color-ares-border)] rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
                  value={form.sport}
                  onChange={(e) => setForm({ ...form, sport: e.target.value })}
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex justify-center items-center px-6 py-4 bg-[var(--color-ares-teal)] hover:opacity-90 disabled:opacity-50 text-[var(--color-ares-bg)] rounded-xl transition-all font-bold tracking-wide uppercase text-sm"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="mr-2">Start my free week</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-white/40">
                We'll also send you training tips. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
