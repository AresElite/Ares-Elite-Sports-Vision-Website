import { SEO } from '../components/SEO';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import { GATED_BOOKS, GATED_DOWNLOADS, getProduct } from '../data/products';

export default function ReaderPage() {
  const { bookId = '' } = useParams<{ bookId: string }>();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';

  const book = GATED_BOOKS[bookId.toLowerCase()];
  const product = book ? getProduct(book.productId) : undefined;
  const title = product ? product.name.split('—')[0].trim() : 'this book';

  const [state, setState] = useState<'loading' | 'granted' | 'denied'>(
    book && sessionId ? 'loading' : 'denied'
  );

  useEffect(() => {
    if (!book || !sessionId) return;
    fetch(`/api/checkout-session/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        const ids = (d.productIds || '').split(',');
        const ok =
          d.status === 'paid' &&
          (d.productId === book.productId || ids.includes(book.productId));
        setState(ok ? 'granted' : 'denied');
      })
      .catch(() => setState('denied'));
  }, [book, sessionId]);

  if (state === 'granted') {
    return (
      <div className="bg-[var(--color-ares-bg)] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-4 flex items-center justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ares-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Shop
          </Link>
          <div className="flex items-center gap-4">
            {book && GATED_DOWNLOADS[book.productId] && (
              <a
                href={`/api/download/${book.productId}?session_id=${encodeURIComponent(sessionId)}`}
                className="text-sm font-bold text-[var(--color-ares-teal)] hover:opacity-80 transition-opacity"
              >
                Download PDF
              </a>
            )}
            <span className="text-sm text-[var(--color-ares-muted)]">{product?.name}</span>
          </div>
        </div>
        <iframe
          title={product?.name || 'A.R.E.S. Book'}
          src={`/api/read/${encodeURIComponent(bookId)}?session_id=${encodeURIComponent(sessionId)}`}
          className="w-full"
          style={{ height: 'calc(100vh - 120px)', border: 0, background: '#fff' }}
        />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Read ${title} | Ares Elite Sports Vision`}
        description="Your purchase-protected A.R.E.S. book reader."
        path={`/read/${bookId}`}
      />
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
              : !book
              ? "We couldn't find that book."
              : `${title} is a purchase-protected reader. Buy it to unlock instant in-browser access.`}
          </p>
          <Link
            to={product ? `/shop/${product.slug}` : '/shop'}
            className="inline-block mt-6 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            {product ? `Get ${title}` : 'Browse the shop'}
          </Link>
        </div>
      </div>
    </>
  );
}
