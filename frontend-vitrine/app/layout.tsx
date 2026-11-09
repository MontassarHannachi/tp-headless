import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider, CartButton } from "./cart";

export const metadata: Metadata = {
  title: "Boutique d'Accessoires",
  description: "TP Headless : Strapi + Next.js + Docker",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <CartButton />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}