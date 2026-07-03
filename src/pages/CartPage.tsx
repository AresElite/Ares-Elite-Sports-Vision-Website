import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '../lib/cart';
import { getProduct } from '../data/products';

export default function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = Object.entries(items)
    .map(([id, qty]) => ({ product: getProduct(id), qty }))
    .filter((l) => l.product);

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/create-cart-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines.map((l) => ({ productId: l.product!.id, qty: l.qty })) }),
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
      <SEO title="Your Cart | Ares Elite Sports Vision" description="Review your cart and check out." path="/cart" />
      <div className="bg-[var(--color-ares-bg)] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[var(--color-ares-muted)] hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Continue shopping
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-6">Your Cart</h1>

          {count === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)]">
              <ShoppingCart className="w-12 h-12 text-[var(--color-ares-muted)] mx-auto" />
              <p className="text-[var(--color-ares-muted)] mt-4">Your cart is empty.</p>
              <Link to="/shop" className="inline-block mt-6 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                Browse the Shop
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {lines.map(({ product, qty }) => (
                  <div key={product!.id} className="flex items-center gap-4 rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] p-4">
                    <img src={`/images/shop/${product!.id}.png`} alt={product!.name} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/shop/${product!.slug}`} className="font-bold text-white hover:text-[var(--color-ares-teal)] transition-colors line-clamp-1">
                        {product!.name}
                      </Link>
                      <div className="text-sm text-[var(--color-ares-muted)]">${product!.price.toFixed(product!.price % 1 ? 2 : 0)} each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(product!.id, qty - 1)} className="w-8 h-8 rounded-lg border border-[var(--color-ares-border)] text-white flex items-center justify-center hover:border-[var(--color-ares-teal)]"><Minus className="w-4 h-4" /></button>
                      <span className="w-6 text-center text-white">{qty}</span>
                      <button onClick={() => setQty(product!.id, qty + 1)} className="w-8 h-8 rounded-lg border border-[var(--color-ares-border)] text-white flex items-center justify-center hover:border-[var(--color-ares-teal)]"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="w-20 text-right font-bold text-white">${(product!.price * qty).toFixed(product!.price % 1 ? 2 : 0)}</div>
                    <button onClick={() => remove(product!.id)} className="text-[var(--color-ares-muted)] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] p-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-[var(--color-ares-muted)]">Subtotal</span>
                  <span className="font-extrabold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[var(--color-ares-muted)] mt-1">Shipping &amp; tax calculated at checkout.</p>
                <button
                  onClick={checkout}
                  disabled={loading}
                  className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting…</> : <><ShoppingCart className="w-5 h-5" /> Checkout</>}
                </button>
                {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
                <p className="text-center text-xs text-[var(--color-ares-muted)] mt-3">Secure checkout via Stripe</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
