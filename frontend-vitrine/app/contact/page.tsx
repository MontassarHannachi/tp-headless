import type { Metadata } from "next";
import StaticPage from "../static-page";
import ContactForm from "./form";

export const metadata: Metadata = { title: "Contact - Boutique d'Accessoires" };

export default function ContactPage() {
  return (
    <StaticPage title="Contact" intro="Une question sur un produit ou une commande ? Écrivez-nous.">
      <div className="mt-8">
        <ContactForm />
      </div>
    </StaticPage>
  );
}