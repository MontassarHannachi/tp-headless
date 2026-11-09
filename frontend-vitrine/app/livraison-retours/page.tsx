import type { Metadata } from "next";
import StaticPage, { Section } from "../static-page";

export const metadata: Metadata = { title: "Livraison et retours - Boutique d'Accessoires" };

export default function LivraisonPage() {
  return (
    <StaticPage
      title="Livraison et retours"
      intro="Tout ce qu'il faut savoir sur l'expédition et les retours."
    >
      <Section title="Livraison">
        <p>Les commandes sont préparées sous 24 à 48 h ouvrées.</p>
        <p>Le délai de livraison est ensuite de 2 à 4 jours ouvrés.</p>
        <p>Un numéro de suivi est communiqué par email à l&apos;expédition.</p>
      </Section>
      <Section title="Retours">
        <p>
          Vous disposez de 14 jours après réception pour retourner un produit, dans son emballage
          d&apos;origine et en parfait état.
        </p>
        <p>Le remboursement est effectué après réception et contrôle du colis.</p>
      </Section>
      <Section title="Paiement">
        <p>Les paiements sont chiffrés et sécurisés.</p>
      </Section>
      <Section title="Une question ?">
        <p>
          Écrivez-nous depuis la page{" "}
          <a href="/contact" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Contact
          </a>
          .
        </p>
      </Section>
    </StaticPage>
  );
}