import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      <div className="mt-3 space-y-3 text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  );
}

export default function StaticPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <nav className="text-sm text-slate-500 dark:text-slate-400">
          <a href="/" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Boutique
          </a>
          {" / "}
          <span className="text-slate-700 dark:text-slate-200">{title}</span>
        </nav>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {intro && <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">{intro}</p>}
        {children}
      </div>
    </main>
  );
}