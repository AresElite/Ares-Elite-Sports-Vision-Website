import type { ReactNode } from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Pill, Glasses, Target, BookOpen, ArrowRight, Check, Package } from 'lucide-react';
import {
  PRODUCTS,
  CATEGORY_LABELS,
  productsByCategory,
  type Product,
  type ProductCategory,
} from '../data/products';

const CATEGORY_ICON: Record<ProductCategory, ReactNode> = {
  bundles: <Package className="w-5 h-5" />,
  supplements: <Pill className="w-5 h-5" />,
  eyewear: <Glasses className="w-5 h-5" />,
  tools: <Target className="w-5 h-5" />,
  digital: <BookOpen className="w-5 h-5" />,
};

const CATEGORY_ORDER: ProductCategory[] = ['bundles', 'supplements', 'eyewear', 'tools', 'digital'];

function priceLabel(p: Product) {
  if (p.purchase === 'free') return 'Free';
  if (p.purchase === 'external') return 'Shop Dispensary';
  if (p.subscribePrice) return `$${p.price}`;
  return `$${p.price.toFixed(p.price % 1 ? 2 : 0)}`;
}

function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      to={`/shop/${p.slug}`}
      className="group flex flex-col rounded-2xl border border-[var(--color-ares-border)] bg-[var(--color-ares-charcoal)] overflow-hidden hover:border-[var(--color-ares-teal)] transition-colors"
    >
      <div className="relative h-44 overflow-hidden bg-[var(--color-ares-charcoal)]">
        <img
          src={`/images/shop/${p.id}.png`}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {p.badges?.[0] && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)]">
            {p.badges[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-white leading-snug">{p.name}</h3>
        <p className="text-sm text-[var(--color-ares-muted)] mt-1 flex-1">{p.tagline}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-extrabold text-white">
            {priceLabel(p)}
            {p.compareAt && <span className="ml-2 text-sm font-normal text-[var(--color-ares-muted)] line-through">${p.compareAt}</span>}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[var(--color-ares-teal)] group-hover:gap-2 transition-all">
            View <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ShopPage() {
  return (
    <>
      <SEO
        title="Performance Shop | Ares Elite Sports Vision"
        description="Vision-training programs for youth and developing athletes, plus supplements, eyewear, and training tools — curated by Ares Elite Sports Vision."
        path="/shop"
      />
      <div className="bg-[var(--color-ares-bg)] min-h-screen">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-28 pb-10 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ares-teal)]">
            Performance Shop
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
            Gear up your vision
          </h1>
          <p className="text-[var(--color-ares-muted)] max-w-2xl mx-auto mt-4">
            Vision training built for youth and developing athletes — plus the supplements,
            eyewear, and tools we trust. Curated and stocked by Ares Elite Sports Vision.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-sm text-[var(--color-ares-muted)]">
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--color-ares-teal)]" /> NSF-certified options</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--color-ares-teal)]" /> Secure Stripe checkout</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--color-ares-teal)]" /> Practitioner-curated</span>
          </div>
        </section>

        {/* Category nav */}
        <div className="sticky top-0 z-20 bg-[var(--color-ares-bg)]/90 backdrop-blur border-y border-[var(--color-ares-border)]">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-2 py-3 justify-center">
            {CATEGORY_ORDER.map((c) => (
              <a
                key={c}
                href={`#${c}`}
                className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full border border-[var(--color-ares-border)] text-[var(--color-ares-muted)] hover:text-white hover:border-[var(--color-ares-teal)] transition-colors"
              >
                {CATEGORY_ICON[c]} {CATEGORY_LABELS[c]}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
          {CATEGORY_ORDER.map((c) => {
            const items = productsByCategory(c);
            if (!items.length) return null;
            return (
              <section key={c} id={c} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[var(--color-ares-teal)]">{CATEGORY_ICON[c]}</span>
                  <h2 className="text-2xl font-bold text-white">{CATEGORY_LABELS[c]}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="text-center text-xs text-[var(--color-ares-muted)] max-w-3xl mx-auto px-4 pb-16">
          Supplement statements have not been evaluated by the FDA and are not intended to diagnose,
          treat, cure, or prevent any disease. {PRODUCTS.length} products · sold by Ares Elite Sports
          Vision, LLC.
        </p>
      </div>
    </>
  );
}
