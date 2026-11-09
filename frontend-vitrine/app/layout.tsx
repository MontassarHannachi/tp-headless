import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider, CartButton } from "./cart";

export const metadata: Metadata = {
  title: "Boutique d'Accessoires",
  description: "Boutique en ligne d'accessoires : Strapi, Next.js et Docker.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
              <a
                href="/"
                className="text-lg font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400"
              >
                Boutique d&apos;Accessoires
              </a>
              <CartButton />
            </div>
          </header>
          {children}
          <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-slate-500 dark:text-slate-400">
              <nav aria-label="Pied de page" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <a href="/a-propos" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">À propos</a>
                <a href="/livraison-retours" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Livraison et retours</a>
                <a href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</a>
                <a href="/mentions-legales" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Mentions légales</a>
              </nav>
              <p>© {new Date().getFullYear()} Boutique d&apos;Accessoires · Projet pédagogique</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}