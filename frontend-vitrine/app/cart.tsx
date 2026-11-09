"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { mediaUrl } from "./media-url";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé dans CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((item) => ({
              ...item,
              image: typeof item.image === "string"
                ? mediaUrl(item.image)
                : null,
            }))
          );
        }
      }
    } catch {
      localStorage.removeItem(KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // Le panier reste utilisable même si le stockage est indisponible.
    }
  }, [items, ready]);

  const add = (item: NewItem) =>
    setItems((current) => {
      const found = current.find((i) => i.id === item.id);

      return found
        ? current.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...current, { ...item, qty: 1 }];
    });

  const setQty = (id: string, qty: number) =>
    setItems((current) =>
      qty <= 0
        ? current.filter((i) => i.id !== id)
        : current.map((i) => (i.id === id ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, count, total, open, setOpen, add, setQty, clear }}
    >
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
      className="mt-6 w-full rounded-full bg-foreground px-6 py-3.5 font-semibold text-background transition hover:opacity-80 active:scale-[0.98]"
    >
      Ajouter au panier
    </button>
  );
}

export function CartButton() {
  const { items, count, total, open, setOpen, setQty, clear } = useCart();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ouvrir le panier, ${count} articles`}
        aria-expanded={open}
        className="relative flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-[var(--surface-hover)]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M5 8h14l1 12H4L5 8Z" strokeLinejoin="round" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" strokeLinecap="round" />
        </svg>
        <span>Panier</span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] text-background">
          {count}
        </span>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex justify-end"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Fermer le panier"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="relative flex h-full w-full max-w-[480px] flex-col border-l border-[var(--border)] bg-background text-foreground shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-6 sm:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  ACCESS · Votre sélection
                </p>
                <h2
                  id="cart-title"
                  className="mt-1 text-2xl font-semibold tracking-tight"
                >
                  Votre panier
                  <span className="ml-2 text-base font-normal text-[var(--muted)]">
                    ({count})
                  </span>
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* ITEMS */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {items.length === 0 ? (
                <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      className="h-9 w-9"
                      aria-hidden="true"
                    >
                      <path d="M5 8h14l1 12H4L5 8Z" strokeLinejoin="round" />
                      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                    </svg>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    Votre panier est vide
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted)]">
                    Découvrez notre sélection d'accessoires et trouvez ce
                    qu'il vous faut.
                  </p>

                  <Link
                    href="/#collection"
                    onClick={() => setOpen(false)}
                    className="mt-7 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition hover:opacity-80"
                  >
                    Découvrir la collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 border-b border-[var(--border)] pb-6"
                    >
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 sm:h-28 sm:w-28">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mediaUrl(item.image)}
                            alt={item.title}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-[var(--muted)]">
                            ACCESS
                          </span>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <div>
                          <h3 className="text-sm font-semibold leading-5">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-[var(--muted)]">
                            {eur.format(item.price)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
                            <button
                              type="button"
                              aria-label={`Diminuer la quantité de ${item.title}`}
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-base transition hover:bg-[var(--surface-hover)]"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-semibold tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Augmenter la quantité de ${item.title}`}
                              onClick={() => setQty(item.id, item.qty + 1)}
                              disabled={item.qty >= 99}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-base transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setQty(item.id, 0)}
                            className="text-xs text-[var(--muted)] underline-offset-4 transition hover:text-red-500 hover:underline"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div className="border-t border-[var(--border)] bg-[var(--surface)] px-6 pb-7 pt-5 sm:px-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Sous-total
                  </span>
                  <span className="text-xl font-semibold tracking-tight tabular-nums">
                    {eur.format(total)}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                  Les frais de livraison éventuels seront précisés lors de la
                  commande.
                </p>

                <Link
                  href="/commande"
                  onClick={() => setOpen(false)}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background transition hover:opacity-80"
                >
                  Passer la commande
                  <span aria-hidden="true">↗</span>
                </Link>

                <button
                  type="button"
                  onClick={clear}
                  className="mt-4 w-full text-center text-xs text-[var(--muted)] transition hover:text-red-500"
                >
                  Vider le panier
                </button>
              </div>
            )}
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
