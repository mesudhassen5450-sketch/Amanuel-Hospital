import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  userRole?: string;
}

export function ThemeProvider({ children, userRole = "default" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      // Use role-specific localStorage key
      const storageKey = `theme_${userRole}`;
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored === "light" || stored === "dark") return stored;
      
      // Check system preference as fallback
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch {
      /* ignore */
    }
    return "light";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      const storageKey = `theme_${userRole}`;
      localStorage.setItem(storageKey, newTheme);
    } catch {
      /* ignore */
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
