"use client";

import { useState, type FormEvent } from "react";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) return;

    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();

    const err: Record<string, string> = {};

    if (v("nom").length < 2) err.nom = "Indiquez votre nom.";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) {
      err.email = "Adresse email invalide.";
    }
    if (v("message").length < 10) {
      err.message = "Votre message doit faire au moins 10 caractères.";
    }

    setErrors(err);
    setSubmitError("");

    if (Object.keys(err).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v("nom"),
          email: v("email"),
          message: v("message"),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error?.message ||
          result?.message ||
          "Votre message n'a pas pu être envoyé. Réessayez."
        );
      }

      if (!result?.data) {
        throw new Error("Réponse invalide du serveur.");
      }

      setSent(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <p
        role="status"
        className="rounded-2xl bg-white p-6 text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
      >
        ✅ Merci, votre message a bien été enregistré. Nous vous répondrons dès que possible.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {[
        { name: "nom", label: "Nom", type: "text" },
        { name: "email", label: "Email", type: "email" },
      ].map((x) => (
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
            aria-invalid={errors[x.name] ? true : undefined}
            aria-describedby={errors[x.name] ? `${x.name}-err` : undefined}
            className={input}
          />
          {errors[x.name] && (
            <p id={`${x.name}-err`} className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors[x.name]}
            </p>
          )}
        </div>
      ))}

      <div>
        <label
          htmlFor="message"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-err" : undefined}
          className={input}
        />
        {errors.message && (
          <p id="message-err" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>
  );
}
