type Product = {
  id: number;
  title: string;
  price: number;
  image?: { url: string } | null;
  category?: { name: string } | null;
};

const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL;

async function getProducts(): Promise<Product[]> {
  const base = process.env.API_INTERNAL_URL ?? PUBLIC_API;
  const res = await fetch(`${base}/api/products?populate=*`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur lors de la récupération des données");
  const json = await res.json();
  return json.data;
}

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function href(cat?: string, q?: string) {
  const p = new URLSearchParams();
  if (cat) p.set("cat", cat);
  if (q) p.set("q", q);
  const s = p.toString();
  return s ? `/?${s}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;
  const products = await getProducts();
  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean))
  ) as string[];

  const needle = (q ?? "").trim().toLowerCase();
  const shown = products.filter(
    (p) =>
      (!cat || p.category?.name === cat) &&
      (!needle || p.title.toLowerCase().includes(needle))
  );

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-indigo-600 text-white shadow"
        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
    }`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white dark:from-indigo-900 dark:via-violet-900 dark:to-fuchsia-900">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Boutique d&apos;Accessoires
        </h1>
        <p className="mt-3 text-indigo-100">
          Coques, chargeurs et écouteurs pour votre téléphone
        </p>
        <form action="/" method="GET" className="mx-auto mt-8 flex max-w-md gap-2">
          {cat && <input type="hidden" name="cat" value={cat} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Rechercher un produit..."
            className="w-full rounded-full bg-white/95 px-5 py-3 text-slate-800 placeholder-slate-400 outline-none ring-1 ring-white/40 focus:ring-2 focus:ring-white dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:bg-slate-100 dark:text-indigo-800"
          >
            OK
          </button>
        </form>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          <a href={href(undefined, q)} className={pill(!cat)}>Tous</a>
          {categories.map((c) => (
            <a key={c} href={href(c, q)} className={pill(cat === c)}>
              {c}
            </a>
          ))}
        </nav>

        {shown.length === 0 ? (
          <p className="py-16 text-center text-slate-500 dark:text-slate-400">
            Aucun produit ne correspond à votre recherche.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <article
                key={p.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {p.image?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${PUBLIC_API}${p.image.url}`}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  )}
                  {p.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur dark:bg-slate-900/90 dark:text-indigo-300">
                      {p.category.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">{p.title}</h2>
                  <span className="whitespace-nowrap rounded-lg bg-indigo-50 px-3 py-1 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {eur.format(p.price)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="pb-10 text-center text-sm text-slate-400 dark:text-slate-500">
        TP Headless · Strapi + Next.js + Docker
      </footer>
    </main>
  );
}