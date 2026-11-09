export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="h-56 animate-pulse bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 opacity-60" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </main>
  );
}