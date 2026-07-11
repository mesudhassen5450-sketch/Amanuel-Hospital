import { createContext, useContext, useState, type ReactNode } from "react";
import { type Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("lang") as Lang | null;
      if (stored === "en" || stored === "am" || stored === "or") return stored;
    } catch {
      /* ignore */
    }
    return "en";
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
