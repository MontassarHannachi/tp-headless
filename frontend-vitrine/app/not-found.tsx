export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
      <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
        Produit introuvable
      </h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Ce produit n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <a
        href="/"
        className="mt-8 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Retour à la boutique
      </a>
    </main>
  );
}