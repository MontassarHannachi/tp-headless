"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("boutique-theme");
    const initial: Theme = saved === "dark" ? "dark" : "light";

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.documentElement.style.colorScheme = initial;
    setReady(true);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";

    setTheme(next);
    localStorage.setItem("boutique-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={ready ? "theme-ready" : "theme-loading"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme doit être utilisé dans ThemeProvider");
  }

  return context;
}
