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
          <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            © {new Date().getFullYear()} Boutique d&apos;Accessoires · Strapi, Next.js et Docker
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}