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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const products = await getProducts();
  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean))
  ) as string[];
  const shown = cat ? products.filter((p) => p.category?.name === cat) : products;

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-indigo-600 text-white shadow"
        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
    }`;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Boutique d&apos;Accessoires
        </h1>
        <p className="mt-3 text-indigo-100">
          Coques, chargeurs et écouteurs pour votre téléphone
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          <a href="/" className={pill(!cat)}>Tous</a>
          {categories.map((c) => (
            <a key={c} href={`/?cat=${encodeURIComponent(c)}`} className={pill(cat === c)}>
              {c}
            </a>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <article
              key={p.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100">
                {p.image?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${PUBLIC_API}${p.image.url}`}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                )}
                {p.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur">
                    {p.category.name}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <h2 className="font-semibold text-slate-800">{p.title}</h2>
                <span className="whitespace-nowrap rounded-lg bg-indigo-50 px-3 py-1 font-bold text-indigo-700">
                  {eur.format(p.price)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="pb-10 text-center text-sm text-slate-400">
        TP Headless · Strapi + Next.js + Docker
      </footer>
    </main>
  );
}