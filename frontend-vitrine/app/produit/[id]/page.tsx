import { notFound } from "next/navigation";

type Block = { children?: { text?: string }[] };

type Product = {
  documentId: string;
  title: string;
  price: number;
  description?: Block[] | null;
  image?: { url: string } | null;
  category?: { name: string } | null;
};

const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL;
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

async function getProduct(id: string): Promise<Product | null> {
  const base = process.env.API_INTERNAL_URL ?? PUBLIC_API;
  const res = await fetch(`${base}/api/products/${encodeURIComponent(id)}?populate=*`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erreur lors de la récupération du produit");
  const json = await res.json();
  return json.data;
}

function blocksToText(d?: Block[] | null): string {
  if (!Array.isArray(d)) return "";
  return d.map((b) => (b.children ?? []).map((c) => c.text ?? "").join("")).join("\n").trim();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const description = blocksToText(p.description);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <a
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Retour à la boutique
        </a>

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
          </div>
        </div>
      </div>
    </main>
  );
}