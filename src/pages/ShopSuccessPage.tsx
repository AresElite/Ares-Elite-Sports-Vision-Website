import { SEO } from '../components/SEO';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, Download, Loader2, ArrowRight } from 'lucide-react';
import { getProduct } from '../data/products';

export default function ShopSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const productSlug = params.get('product') || '';
  const product = getProduct(productSlug);
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending'>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('pending');
      return;
    }
    fetch(`/api/checkout-session/${sessionId}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.status === 'paid' ? 'paid' : 'pending'))
      .catch(() => setStatus('pending'));
  }, [sessionId]);

  return (
    <>
      <SEO title="Order Confirmed | Ares Elite Sports Vision" description="Thank you for your order." path="/shop/success" />
      <div className="bg-[var(--color-ares-bg)] min-h-screen flex items-center justify-center px-4 py-28">
        <div className="max-w-lg w-full text-center rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] p-10">
          {status === 'loading' ? (
            <Loader2 className="w-12 h-12 text-[var(--color-ares-teal)] animate-spin mx-auto" />
          ) : (
            <CheckCircle2 className="w-16 h-16 text-[var(--color-ares-teal)] mx-auto" />
          )}

          <h1 className="text-2xl font-extrabold text-white mt-6">
            {status === 'loading' ? 'Confirming your order…' : 'Thank you — order confirmed!'}
          </h1>
          <p className="text-[var(--color-ares-muted)] mt-3">
            {product
              ? `Your ${product.name} order is in. A receipt is on its way to your email.`
              : 'Your order is in. A receipt is on its way to your email.'}
          </p>

          {/* Gated in-browser reader (e.g. ACQUIRE book) */}
          {product?.gated && product.readerPath && status === 'paid' && sessionId && (
            <Link
              to={`${product.readerPath}?session_id=${encodeURIComponent(sessionId)}`}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" /> Read {product.name.split('—')[0].trim()} now
            </Link>
          )}

          {/* Digital download */}
          {product?.digitalFile && status !== 'loading' && (
            <a
              href={product.digitalFile}
              download
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-dark)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" /> Download your {product.name.split('(')[0].trim()}
            </a>
          )}

          {product?.note && (
            <p className="text-xs text-[var(--color-ares-muted)] mt-6 leading-relaxed">{product.note}</p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 border border-[var(--color-ares-border)] text-white px-5 py-2.5 rounded-xl hover:border-[var(--color-ares-teal)] transition-colors"
            >
              Continue shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-[var(--color-ares-muted)] px-5 py-2.5 hover:text-white transition-colors"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
