"use client";

import { useState, type FormEvent } from "react";
import { useCart } from "../cart";

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const API = process.env.NEXT_PUBLIC_API_URL;

const FIELDS = [
  { name: "nom", label: "Nom complet", type: "text", auto: "name" },
  { name: "email", label: "Email", type: "email", auto: "email" },
  { name: "adresse", label: "Adresse", type: "text", auto: "street-address" },
  { name: "ville", label: "Ville", type: "text", auto: "address-level2" },
  { name: "cp", label: "Code postal", type: "text", auto: "postal-code" },
];

export default function Commande() {
  const { items, total, clear } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const err: Record<string, string> = {};
    if (v("nom").length < 2) err.nom = "Indiquez votre nom.";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) err.email = "Adresse email invalide.";
    if (v("adresse").length < 5) err.adresse = "Indiquez votre adresse.";
    if (v("ville").length < 2) err.ville = "Indiquez votre ville.";
    if (!/^\d{4,5}$/.test(v("cp"))) err.cp = "Code postal invalide (4 ou 5 chiffres).";
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    setOrder("CMD-" + Date.now().toString(36).toUpperCase());
    clear();
  }

  if (order) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
        <p className="text-5xl">✅</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Merci pour votre commande !
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Numéro de commande : <strong>{order}</strong> (commande simulée).
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

  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Votre panier est vide
        </h1>
        <a
          href="/"
          className="mt-6 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Voir les produits
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Finaliser la commande
        </h1>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <form onSubmit={submit} noValidate className="space-y-4">
            {FIELDS.map((x) => (
              <div key={x.name}>
                <label
                  htmlFor={x.name}
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {x.label}
                </label>
                <input
                  id={x.name}
                  name={x.name}
                  type={x.type}
                  autoComplete={x.auto}
                  aria-invalid={errors[x.name] ? true : undefined}
                  aria-describedby={errors[x.name] ? `${x.name}-err` : undefined}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {errors[x.name] && (
                  <p id={`${x.name}-err`} className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors[x.name]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
            >
              Confirmer la commande · {eur.format(total)}
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Récapitulatif</h2>
            <ul className="mt-4 space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    {i.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`${API}${i.image}`} alt={i.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {i.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Quantité : {i.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    {eur.format(i.price * i.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
              <span>Total</span>
              <span>{eur.format(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}