import { SEO } from '../components/SEO';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Loader2, ArrowRight, Eye, Trophy, CalendarCheck } from 'lucide-react';

// 7-Day Vision Challenge: email capture -> lead + nurture sequence -> instant access.
// Completing all 7 days unlocks 10% off a Sports Vision Performance Evaluation.
export default function VisionChallengePage() {
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
          resourceName: '7-Day Vision Challenge',
          landingPage: '/vision-challenge',
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
            The 7-Day Vision Challenge
          </span>
          <span className="text-sm text-[var(--color-ares-teal)]">Unlocked</span>
        </div>
        <iframe
          title="The 7-Day Vision Challenge"
          src={`/api/vision-challenge?email=${encodeURIComponent(unlockedEmail)}`}
          className="w-full"
          style={{ height: 'calc(100vh - 120px)', border: 0, background: '#0B0F2A' }}
        />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="The 7-Day Vision Challenge | Ares Elite Sports Vision"
        description="Take the free 7-Day Vision Challenge — two drills a day from the training system we use with real athletes. Finish all 7 days and earn 10% off a Sports Vision Performance Evaluation."
        path="/vision-challenge"
      />
      <div className="bg-[var(--color-ares-bg)] min-h-screen px-4 pt-28 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Pitch */}
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-[var(--color-ares-teal)]/10 text-[var(--color-ares-teal)] text-xs font-bold tracking-widest rounded-full uppercase mb-6">
              Free · 7 Days · Real Reward
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
              Take the 7-Day Vision Challenge.
            </h1>
            <p className="text-[var(--color-ares-muted)] text-lg mb-8">
              Two drills a day for seven days, straight from the training system we
              use with real athletes at our Carmel clinic. Finish every day and you
              earn <strong className="text-white">10% off a Sports Vision
              Performance Evaluation</strong> — the full visual, cognitive, and
              reaction assessment we run for competitive athletes.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[var(--color-ares-text)]">
                <Eye className="w-5 h-5 text-[var(--color-ares-teal)] mt-1 shrink-0" />
                <span>
                  <strong className="text-white">Three real drills</strong> — focus,
                  tracking, and eye-teaming, with full instructions
                </span>
              </li>
              <li className="flex items-start gap-3 text-[var(--color-ares-text)]">
                <Trophy className="w-5 h-5 text-[var(--color-ares-teal)] mt-1 shrink-0" />
                <span>
                  <strong className="text-white">A challenge board</strong> that tracks
                  your 7 days — finish it and your reward code unlocks on the page
                </span>
              </li>
              <li className="flex items-start gap-3 text-[var(--color-ares-text)]">
                <CalendarCheck className="w-5 h-5 text-[var(--color-ares-teal)] mt-1 shrink-0" />
                <span>
                  <strong className="text-white">10% off your evaluation</strong> when
                  you complete the challenge — no equipment needed, just a pencil and
                  a window
                </span>
              </li>
            </ul>
          </div>

          {/* Capture form */}
          <div className="bg-[var(--color-ares-charcoal)] border border-[var(--color-ares-border)] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Start the challenge</h2>
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
                    <span className="mr-2">Start my 7 days</span>
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
