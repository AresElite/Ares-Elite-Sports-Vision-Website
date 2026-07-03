import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct } from '../data/products';

type CartItems = Record<string, number>; // productId -> quantity

interface CartContextValue {
  items: CartItems;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'ares_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? (JSON.parse(raw) as CartItems) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = (productId: string, qty = 1) =>
    setItems((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + qty }));

  const setQty = (productId: string, qty: number) =>
    setItems((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[productId];
      else next[productId] = qty;
      return next;
    });

  const remove = (productId: string) =>
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

  const clear = () => setItems({});

  const count = useMemo(
    () => Object.values(items).reduce((a, b) => a + b, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      Object.entries(items).reduce((sum, [id, qty]) => {
        const p = getProduct(id);
        return sum + (p ? p.price * qty : 0);
      }, 0),
    [items]
  );

  const value: CartContextValue = { items, add, setQty, remove, clear, count, subtotal };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
