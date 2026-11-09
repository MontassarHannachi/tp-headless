import { AddToCart } from "../../cart";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { mediaUrl } from "../../media-url";

type Block = { children?: { text?: string }[] };

type Product = {
  id: number;
  documentId: string;
  title: string;
  price: number;
  description?: Block[] | null;
  image?: { url: string } | null;
  category?: { name: string } | null;
};

const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL;
const BASE = process.env.API_INTERNAL_URL ?? PUBLIC_API;

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(
    `${BASE}/api/products/${encodeURIComponent(id)}?populate=*`,
    { cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erreur lors de la récupération du produit");

  return (await res.json()).data;
}

async function getAll(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return (await res.json()).data;
}

function blocksToText(d?: Block[] | null): string {
  if (!Array.isArray(d)) return "";

  return d
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);

  return {
    title: p ? `${p.title} - ACCESS` : "Produit introuvable",
    description: p
      ? `Découvrez ${p.title} chez ACCESS.`
      : "Produit introuvable",
  };
}

const PERKS = [
  {
    icon: "01",
    title: "Livraison",
    description: "Livraison rapide",
  },
  {
    icon: "02",
    title: "Retours",
    description: "Retours sous 14 jours",
  },
  {
    icon: "03",
    title: "Paiement",
    description: "Commande sécurisée",
  },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProduct(id);

  if (!p) notFound();

  const description = blocksToText(p.description);

  const related = p.category
    ? (await getAll())
        .filter(
          (x) =>
            x.documentId !== p.documentId &&
            x.category?.name === p.category?.name
        )
        .slice(0, 3)
    : [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">

        {/* BREADCRUMB */}
        <nav
          aria-label="Fil d'Ariane"
          className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)] sm:text-sm"
        >
          <Link href="/" className="transition hover:text-foreground">
            Boutique
          </Link>

          <span>/</span>

          {p.category && (
            <>
              <Link
                href={`/?cat=${encodeURIComponent(p.category.name)}`}
                className="transition hover:text-foreground"
              >
                {p.category.name}
              </Link>
              <span>/</span>
            </>
          )}

          <span className="font-medium text-foreground">{p.title}</span>
        </nav>

        {/* PRODUCT */}
        <section className="grid items-start gap-9 lg:grid-cols-2 lg:gap-16">

          {/* IMAGE */}
          <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex aspect-square items-center justify-center p-6 sm:p-10">
              {p.image?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(p.image.url)}
                  alt={p.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-sm text-[var(--muted)]">
                  Image indisponible
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col py-2 lg:py-8">

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">
                ACCESS COLLECTION
              </span>
              <span className="h-px w-8 bg-[var(--border)]" />
            </div>

            {p.category && (
              <Link
                href={`/?cat=${encodeURIComponent(p.category.name)}`}
                className="mt-7 w-fit rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--surface-hover)]"
              >
                {p.category.name}
              </Link>
            )}

            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {p.title}
            </h1>

            <p className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              {eur.format(p.price)}
            </p>

            <div className="my-8 h-px w-full bg-[var(--border)]" />

            <div>
              <h2 className="text-sm font-semibold">À propos de ce produit</h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">
                {description ||
                  "Aucune description disponible pour ce produit."}
              </p>
            </div>

            <AddToCart
              item={{
                id: p.documentId,
                title: p.title,
                price: p.price,
                image: p.image?.url ?? null,
              }}
            />

            {/* PERKS */}
            <div className="mt-9 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="flex items-center gap-4 py-4"
                >
                  <span className="text-xs font-semibold text-[var(--muted)]">
                    {perk.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{perk.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-[var(--border)] pt-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  À découvrir
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Dans la même collection.
                </h2>
              </div>

              <Link
                href={`/?cat=${encodeURIComponent(p.category?.name ?? "")}`}
                className="text-xs font-medium text-[var(--muted)] transition hover:text-foreground"
              >
                Voir la collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.documentId}
                  href={`/produit/${r.documentId}`}
                  className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[var(--surface-hover)] p-5">
                    {r.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaUrl(r.image.url)}
                        alt={r.title}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-xs text-[var(--muted)]">
                        ACCESS
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 p-5">
                    <span className="text-sm font-semibold">
                      {r.title}
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {eur.format(r.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
