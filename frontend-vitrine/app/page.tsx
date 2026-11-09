import Link from "next/link";
import { mediaUrl } from "./media-url";

type Product = {
  id: number;
  documentId: string;
  title: string;
  price: number;
  image?: { url: string } | null;
  category?: { name: string } | null;
};

const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL;

async function getProducts(): Promise<Product[]> {
  const base = process.env.API_INTERNAL_URL ?? PUBLIC_API;

  if (!base) {
    throw new Error("URL de l'API Strapi non configurée.");
  }

  const res = await fetch(`${base}/api/products?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des produits.");
  }

  const json = await res.json();
  return json.data;
}

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

const SORTS = [
  { key: "", label: "Pertinence" },
  { key: "prix-asc", label: "Prix croissant" },
  { key: "prix-desc", label: "Prix décroissant" },
  { key: "nom", label: "Nom A-Z" },
];

function href(cat?: string, q?: string, sort?: string) {
  const params = new URLSearchParams();

  if (cat) params.set("cat", cat);
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; sort?: string }>;
}) {
  const { cat, q, sort } = await searchParams;
  const products = await getProducts();

  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean))
  ) as string[];

  const needle = (q ?? "").trim().toLowerCase();

  const shown = products
    .filter(
      (p) =>
        (!cat || p.category?.name === cat) &&
        (!needle || p.title.toLowerCase().includes(needle))
    )
    .sort((a, b) => {
      if (sort === "prix-asc") return a.price - b.price;
      if (sort === "prix-desc") return b.price - a.price;
      if (sort === "nom") return a.title.localeCompare(b.title, "fr");
      return 0;
    });

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-foreground text-background"
        : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-foreground hover:text-foreground"
    }`;

  const featured = products[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20 lg:px-12 lg:pb-24">
        <div className="grid items-center gap-12 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              ACCESS · Collection
            </span>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              La technologie,
              <br />
              <span className="text-[var(--muted)]">en mieux.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-[var(--muted)] sm:text-lg">
              Des accessoires soigneusement sélectionnés pour accompagner
              votre quotidien. Simplicité, qualité et fonctionnalité.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition hover:opacity-80"
              >
                Découvrir la collection
                <span className="ml-3" aria-hidden="true">↗</span>
              </a>
              <span className="text-sm text-[var(--muted)]">
                {products.length} produits disponibles
              </span>
            </div>
          </div>

          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--background)] p-6 sm:min-h-[380px]">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] sm:h-80 sm:w-80" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] sm:h-60 sm:w-60" />

            {featured?.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl(featured.image.url)}
                alt={featured.title}
                className="relative z-10 max-h-[300px] w-full max-w-[380px] object-contain drop-shadow-2xl sm:max-h-[340px]"
              />
            ) : (
              <div className="relative z-10 text-center">
                <span className="text-6xl">◈</span>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  ACCESS Collection
                </p>
              </div>
            )}

            <span className="absolute bottom-5 left-5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Design · Fonctionnalité · Qualité
            </span>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section
        id="collection"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 sm:px-8 lg:px-12"
      >
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Notre sélection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              La collection.
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Des essentiels pensés pour votre quotidien.
            </p>
          </div>

          <form action="/" method="GET" className="flex w-full gap-2 sm:max-w-sm">
            {cat && <input type="hidden" name="cat" value={cat} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Rechercher un produit..."
              aria-label="Rechercher un produit"
              className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm text-foreground outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-80"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* CATEGORY FILTERS */}
        <nav
          aria-label="Filtrer par catégorie"
          className="mb-8 flex flex-wrap gap-2"
        >
          <Link href={href(undefined, q, sort)} className={pill(!cat)}>
            Tous les produits
          </Link>

          {categories.map((category) => (
            <Link
              key={category}
              href={href(category, q, sort)}
              className={pill(cat === category)}
            >
              {category}
            </Link>
          ))}
        </nav>

        {/* RESULTS AND SORT */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            <span className="font-semibold text-foreground">{shown.length}</span>{" "}
            résultat{shown.length > 1 ? "s" : ""}
            {cat ? ` · ${cat}` : ""}
            {q ? ` · « ${q} »` : ""}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-[var(--muted)]">Trier par</span>
            {SORTS.map((option) => (
              <Link
                key={option.key}
                href={href(cat, q, option.key)}
                className={pill((sort ?? "") === option.key)}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        {shown.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-20 text-center">
            <p className="text-lg font-semibold">
              Aucun produit trouvé.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Essayez une autre recherche ou sélectionnez une autre catégorie.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-80"
            >
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((product, index) => (
              <Link
                key={product.documentId}
                href={`/produit/${product.documentId}`}
                className="group block"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6">
                  {product.image?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(product.image.url)}
                      alt={product.title}
                      loading={index > 2 ? "lazy" : "eager"}
                      className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-sm text-[var(--muted)]">
                      Image non disponible
                    </span>
                  )}

                  {product.category && (
                    <span className="absolute left-4 top-4 rounded-full border border-[var(--border)] bg-[var(--background)]/90 px-3 py-1.5 text-xs font-medium text-[var(--muted)] backdrop-blur">
                      {product.category.name}
                    </span>
                  )}

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-foreground text-lg text-background opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    ↗
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 px-1 pt-5">
                  <div>
                    <h3 className="font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Découvrir le produit
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-sm font-semibold tabular-nums">
                    {eur.format(product.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* BRAND FOOTER STRIP */}
      <section className="border-t border-[var(--border)] px-5 py-10 text-center">
        <p className="text-sm font-medium tracking-wide">
          ACCESS
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          L'essentiel, simplement.
        </p>
      </section>
    </main>
  );
}
