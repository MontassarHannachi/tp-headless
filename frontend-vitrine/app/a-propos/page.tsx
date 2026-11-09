import type { Metadata } from "next";
import StaticPage, { Section } from "../static-page";

export const metadata: Metadata = { title: "À propos - Boutique d'Accessoires" };

export default function AProposPage() {
  return (
    <StaticPage
      title="À propos"
      intro="Une boutique d'accessoires pour téléphones, pensée simple, rapide et fiable."
    >
      <Section title="Notre sélection">
        <p>
          Coques, chargeurs, câbles et accessoires : chaque produit est choisi pour sa qualité et
          son rapport qualité-prix.
        </p>
      </Section>
      <Section title="Notre engagement">
        <p>
          Des fiches produits claires, un paiement sécurisé, une livraison rapide et un retour
          possible sous 14 jours.
        </p>
      </Section>
      <Section title="Sous le capot">
        <p>
          Cette vitrine est une architecture « headless » : le contenu est géré dans Strapi, la
          vitrine est construite avec Next.js, et l&apos;ensemble tourne dans des conteneurs Docker.
        </p>
      </Section>
    </StaticPage>
  );
}