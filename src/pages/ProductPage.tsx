import { SEO } from '../components/SEO';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Check, Loader2, ExternalLink, Download, ShoppingCart, Plus } from 'lucide-react';
import { getProduct } from '../data/products';
import { useCart } from '../lib/cart';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProduct(slug) : undefined;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'payment' | 'subscription'>('payment');
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  if (!product) return <Navigate to="/shop" replace />;

  const addToCart = () => {
    add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/create-shop-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, mode }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout.');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={`${product.name} | Ares Elite Sports Vision Shop`}
        description={product.tagline}
        path={`/shop/${product.slug}`}
      />
      <div className="bg-[var(--color-ares-bg)] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ares-muted)] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Visual */}
            <div className="relative rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] overflow-hidden self-start">
              <img
                src={`/images/shop/${product.id}.png`}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
              {product.badges?.[0] && (
                <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)]">
                  {product.badges[0]}
                </span>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-extrabold text-white">{product.name}</h1>
              <p className="text-[var(--color-ares-teal)] font-medium mt-1">{product.tagline}</p>
              <p className="text-[var(--color-ares-muted)] mt-4 leading-relaxed">{product.description}</p>

              <ul className="mt-6 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-4 h-4 text-[var(--color-ares-teal)] mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              {/* Purchase area */}
              <div className="mt-8 rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] p-6">
                {product.purchase === 'free' && (
                  <a
                    href={product.digitalFile}
                    download
                    className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-5 h-5" /> Download Free Guide
                  </a>
                )}

                {product.purchase === 'external' && (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {product.externalLabel || 'Shop Now'} <ExternalLink className="w-5 h-5" />
                  </a>
                )}

                {(product.purchase === 'stripe' || product.purchase === 'stripe-both') && (
                  <>
                    {product.purchase === 'stripe-both' && product.subscribePrice && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                          onClick={() => setMode('payment')}
                          className={`rounded-xl border p-3 text-left transition-colors ${mode === 'payment' ? 'border-[var(--color-ares-teal)] bg-[var(--color-ares-bg)]' : 'border-[var(--color-ares-border)]'}`}
                        >
                          <div className="text-xs text-[var(--color-ares-muted)]">One-time</div>
                          <div className="text-lg font-extrabold text-white">${product.price}</div>
                        </button>
                        <button
                          onClick={() => setMode('subscription')}
                          className={`rounded-xl border p-3 text-left transition-colors ${mode === 'subscription' ? 'border-[var(--color-ares-teal)] bg-[var(--color-ares-bg)]' : 'border-[var(--color-ares-border)]'}`}
                        >
                          <div className="text-xs text-[var(--color-ares-muted)]">Subscribe &amp; save</div>
                          <div className="text-lg font-extrabold text-white">
                            ${product.subscribePrice}
                            <span className="text-xs font-normal text-[var(--color-ares-muted)]"> /reorder</span>
                          </div>
                        </button>
                      </div>
                    )}

                    {(product.purchase !== 'stripe-both' || !product.subscribePrice) && (
                      <div className="text-2xl font-extrabold text-white mb-4">
                        ${product.price.toFixed(product.price % 1 ? 2 : 0)}
                        {product.compareAt && (
                          <span className="ml-2 text-base font-normal text-[var(--color-ares-muted)] line-through">${product.compareAt}</span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={startCheckout}
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Redirecting…
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          {mode === 'subscription' ? 'Subscribe' : 'Buy Now'}
                        </>
                      )}
                    </button>
                    {mode === 'payment' && (
                      <button
                        onClick={addToCart}
                        className="w-full mt-3 inline-flex items-center justify-center gap-2 border border-[var(--color-ares-border)] text-white font-semibold py-2.5 rounded-xl hover:border-[var(--color-ares-teal)] transition-colors"
                      >
                        {added ? <><Check className="w-4 h-4 text-[var(--color-ares-teal)]" /> Added to cart</> : <><Plus className="w-4 h-4" /> Add to Cart</>}
                      </button>
                    )}
                    <p className="text-center text-xs text-[var(--color-ares-muted)] mt-3">
                      Secure checkout via Stripe · cancel subscriptions anytime
                    </p>
                  </>
                )}

                {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
              </div>

              {product.note && (
                <p className="text-xs text-[var(--color-ares-muted)] mt-4 leading-relaxed">{product.note}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
