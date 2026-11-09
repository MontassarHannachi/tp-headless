"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string | null;
  qty: number;
};
type NewItem = Omit<CartItem, "qty">;

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: NewItem) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartCtx | null>(null);
const KEY = "tp-cart";
const API = process.env.NEXT_PUBLIC_API_URL;
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = (item: NewItem) =>
    setItems((cur) => {
      const found = cur.find((i) => i.id === item.id);
      return found
        ? cur.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...cur, { ...item, qty: 1 }];
    });

  const setQty = (id: string, qty: number) =>
    setItems((cur) =>
      qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, count, total, open, setOpen, add, setQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function AddToCart({ item }: { item: NewItem }) {
  const { add, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        add(item);
        setOpen(true);
      }}
      className="mt-6 w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
    >
      Ajouter au panier
    </button>
  );
}

export function CartButton() {
  const { items, count, total, open, setOpen, setQty, clear } = useCart();
  const [ordered, setOrdered] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOrdered(false);
          setOpen(true);
        }}
        aria-label="Ouvrir le panier"
        className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 font-semibold text-indigo-700 shadow-lg ring-1 ring-slate-200 backdrop-blur transition hover:scale-105 dark:bg-slate-900/95 dark:text-indigo-300 dark:ring-slate-700"
      >
        🛒
        <span className="min-w-6 rounded-full bg-indigo-600 px-2 py-0.5 text-center text-xs text-white">
          {count}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Votre panier</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {ordered ? (
                <p className="py-16 text-center text-slate-600 dark:text-slate-300">
                  ✅ Merci ! Votre commande (simulée) a bien été enregistrée.
                </p>
              ) : items.length === 0 ? (
                <p className="py-16 text-center text-slate-500 dark:text-slate-400">
                  Votre panier est vide.
                </p>
              ) : (
                items.map((i) => (
                  <div key={i.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      {i.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`${API}${i.image}`} alt={i.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {i.title}
                      </p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-300">{eur.format(i.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(i.id, i.qty - 1)}
                        className="h-8 w-8 rounded-full ring-1 ring-slate-300 hover:bg-slate-100 dark:text-slate-100 dark:ring-slate-600 dark:hover:bg-slate-800"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm dark:text-slate-100">{i.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(i.id, i.qty + 1)}
                        className="h-8 w-8 rounded-full ring-1 ring-slate-300 hover:bg-slate-100 dark:text-slate-100 dark:ring-slate-600 dark:hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!ordered && items.length > 0 && (
              <div className="space-y-3 border-t border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-slate-100">
                  <span>Total</span>
                  <span>{eur.format(total)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setOrdered(true);
                  }}
                  className="w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Commander
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="w-full text-sm text-slate-500 hover:underline dark:text-slate-400"
                >
                  Vider le panier
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}