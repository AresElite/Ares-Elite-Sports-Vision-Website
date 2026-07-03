import { SEO } from '../components/SEO';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';

export default function ReaderPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [state, setState] = useState<'loading' | 'granted' | 'denied'>(sessionId ? 'loading' : 'denied');

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/checkout-session/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        const ids = (d.productIds || '').split(',');
        const ok = d.status === 'paid' && (d.productId === 'acquire-book' || ids.includes('acquire-book'));
        setState(ok ? 'granted' : 'denied');
      })
      .catch(() => setState('denied'));
  }, [sessionId]);

  if (state === 'granted') {
    return (
      <div className="bg-[var(--color-ares-bg)] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-4 flex items-center justify-between">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[var(--color-ares-muted)] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Shop
          </Link>
          <span className="text-sm text-[var(--color-ares-muted)]">ACQUIRE — A.R.E.S. Loop, Book 1</span>
        </div>
        <iframe
          title="ACQUIRE — The A.R.E.S. Performance Loop"
          src={`/api/read/acquire?session_id=${encodeURIComponent(sessionId)}`}
          className="w-full"
          style={{ height: 'calc(100vh - 120px)', border: 0, background: '#fff' }}
        />
      </div>
    );
  }

  return (
    <>
      <SEO title="Read ACQUIRE | Ares Elite Sports Vision" description="Your purchase-protected ACQUIRE reader." path="/read/acquire" />
      <div className="bg-[var(--color-ares-bg)] min-h-screen flex items-center justify-center px-4 py-28">
        <div className="max-w-md w-full text-center rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] p-10">
          {state === 'loading' ? (
            <Loader2 className="w-12 h-12 text-[var(--color-ares-teal)] animate-spin mx-auto" />
          ) : (
            <Lock className="w-12 h-12 text-[var(--color-ares-muted)] mx-auto" />
          )}
          <h1 className="text-2xl font-extrabold text-white mt-6">
            {state === 'loading' ? 'Unlocking your book…' : 'Purchase required'}
          </h1>
          <p className="text-[var(--color-ares-muted)] mt-3">
            {state === 'loading'
              ? 'One moment while we verify your access.'
              : 'ACQUIRE is a purchase-protected reader. Buy it to unlock instant in-browser access.'}
          </p>
          {state === 'denied' && (
            <Link
              to="/shop/acquire-book"
              className="inline-block mt-6 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Get ACQUIRE
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
