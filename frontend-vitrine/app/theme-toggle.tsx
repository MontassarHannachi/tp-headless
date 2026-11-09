"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light"
          ? "Activer le thème sombre"
          : "Activer le thème clair"
      }
      title={theme === "light" ? "Mode sombre" : "Mode clair"}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--surface-hover)]"
    >
      <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
      <span>{theme === "light" ? "Sombre" : "Clair"}</span>
    </button>
  );
}
