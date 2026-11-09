import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider, CartButton } from "./cart";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

export const metadata: Metadata = {
  title: {
    default: "ACCESS. | Boutique d'accessoires",
    template: "%s | ACCESS.",
  },
  description:
    "Découvrez notre sélection d'accessoires électroniques et mobiles.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <CartProvider>
            <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
                <a href="/" className="text-xl font-black tracking-[-0.06em] text-[var(--foreground)]">
                  ACCESS<span className="text-[var(--accent)]">.</span>
                </a>

                <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] md:flex">
                  <a href="/" className="hover:text-[var(--accent)]">Boutique</a>
                  <a href="/a-propos" className="hover:text-[var(--accent)]">À propos</a>
                  <a href="/contact" className="hover:text-[var(--accent)]">Contact</a>
                </nav>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <CartButton />
                </div>
              </div>
            </header>

            {children}

            <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
              <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
                <div className="grid gap-10 md:grid-cols-2">
                  <div>
                    <a href="/" className="text-2xl font-black tracking-[-0.06em]">
                      ACCESS<span className="text-[var(--accent)]">.</span>
                    </a>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
                      Des accessoires électroniques sélectionnés pour allier
                      fonctionnalité, simplicité et élégance.
                    </p>
                  </div>

                  <nav aria-label="Pied de page" className="grid grid-cols-2 gap-4 text-sm text-[var(--muted)]">
                    <a href="/a-propos" className="hover:text-[var(--accent)]">À propos</a>
                    <a href="/contact" className="hover:text-[var(--accent)]">Contact</a>
                    <a href="/livraison-retours" className="hover:text-[var(--accent)]">Livraison et retours</a>
                    <a href="/mentions-legales" className="hover:text-[var(--accent)]">Mentions légales</a>
                  </nav>
                </div>

                <div className="mt-10 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)]">
                  © {new Date().getFullYear()} ACCESS. · Projet pédagogique
                </div>
              </div>
            </footer>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
