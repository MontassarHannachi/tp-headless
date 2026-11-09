import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}?populate=*`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erreur lors de la récupération du produit");
  return (await res.json()).data;
}

async function getAll(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products?populate=*`, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()).data;
}

function blocksToText(d?: Block[] | null): string {
  if (!Array.isArray(d)) return "";
  return d.map((b) => (b.children ?? []).map((c) => c.text ?? "").join("")).join("\n").trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  return { title: p ? `${p.title} - Boutique d'Accessoires` : "Produit introuvable" };
}

const PERKS = [
  { icon: "🚚", text: "Livraison rapide" },
  { icon: "↩️", text: "Retours sous 14 jours" },
  { icon: "🔒", text: "Paiement sécurisé" },
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
        .filter((x) => x.documentId !== p.documentId && x.category?.name === p.category?.name)
        .slice(0, 3)
    : [];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm text-slate-500 dark:text-slate-400">
          <a href="/" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Boutique
          </a>
          {p.category && (
            <>
              {" / "}
              <a
                href={`/?cat=${encodeURIComponent(p.category.name)}`}
                className="hover:underline"
              >
                {p.category.name}
              </a>
            </>
          )}
          {" / "}
          <span className="text-slate-700 dark:text-slate-200">{p.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            {p.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${PUBLIC_API}${p.image.url}`}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center text-slate-400">
                Pas d&apos;image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {p.category && (
              <span className="mb-3 w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {p.category.name}
              </span>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {p.title}
            </h1>
            <p className="mt-4 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {eur.format(p.price)}
            </p>
            <p className="mt-6 whitespace-pre-line text-slate-600 dark:text-slate-300">
              {description || "Aucune description disponible pour ce produit."}
            </p>
            <ul className="mt-8 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {PERKS.map((x) => (
                <li key={x.text} className="flex items-center gap-3">
                  <span className="text-lg">{x.icon}</span>
                  {x.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
              Dans la même catégorie
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <a
                  key={r.id}
                  href={`/produit/${r.documentId}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:ring-slate-800"
                >
                  <div className="h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {r.image?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${PUBLIC_API}${r.image.url}`}
                        alt={r.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {r.title}
                    </span>
                    <span className="whitespace-nowrap text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      {eur.format(r.price)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}