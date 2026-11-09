import type { Metadata } from "next";
import StaticPage, { Section } from "../static-page";

export const metadata: Metadata = { title: "Mentions légales - Boutique d'Accessoires" };

export default function MentionsPage() {
  return (
    <StaticPage title="Mentions légales">
      <Section title="Nature du site">
        <p>
          Ce site est un projet pédagogique réalisé dans le cadre du Master Cloud Computing et
          DevOps de l&apos;ISET Tozeur. Il s&apos;agit d&apos;une démonstration : aucune vente
          réelle n&apos;est effectuée et aucun paiement n&apos;est collecté.
        </p>
      </Section>
      <Section title="Éditeur">
        <p>Montassar Hannachi, étudiant, ISET Tozeur (Tunisie).</p>
      </Section>
      <Section title="Hébergement">
        <p>Le site est hébergé sur une machine virtuelle personnelle, à des fins de test.</p>
      </Section>
      <Section title="Données personnelles">
        <p>
          Les informations saisies dans les formulaires ne sont pas conservées. Le panier est
          enregistré uniquement dans votre navigateur (localStorage) et peut être vidé à tout moment.
        </p>
      </Section>
      <Section title="Technologies">
        <p>Strapi 5, Next.js, React, Tailwind CSS et Docker.</p>
      </Section>
    </StaticPage>
  );
}