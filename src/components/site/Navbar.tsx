import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { t, translations, type Lang } from "@/lib/translations";
import logoImg from "@/assets/logo.jpg";

const langOptions: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English",      flag: "🇬🇧" },
  { code: "am", label: "አማርኛ",         flag: "🇪🇹" },
  { code: "or", label: "Afaan Oromoo", flag: "🇪🇹" },
];

interface NavbarProps {
  onOpenChat: () => void;
}

export function Navbar({ onOpenChat }: NavbarProps) {
  const { lang, setLang } = useLanguage();
  const tr = translations;

  const navLinks = [
    { to: "/",           label: t(tr.nav.home,        lang) },
    { to: "/about",      label: t(tr.nav.about,       lang) },
    { to: "/services",   label: t(tr.nav.services,    lang) },
    { to: "/doctors",    label: t(tr.nav.doctors,     lang) },
    { to: "/departments",label: t(tr.nav.departments, lang) },
    { to: "/gallery",    label: t(tr.nav.gallery,     lang) },
    { to: "/contact",    label: t(tr.nav.contact,     lang) },
  ] as const;

  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };

  const currentLangLabel = langOptions.find((l) => l.code === lang)?.label ?? "English";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Dr. Amanuel Hospital home">
          <img src={logoImg} alt="Dr. Amanuel Hospital logo" className="h-9 w-9 shrink-0 rounded-xl object-cover" />
          <span className="truncate font-display text-base font-bold leading-tight text-foreground sm:text-lg">
            Dr. Amanuel Hospital
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-primary font-semibold" }}
              inactiveProps={{ className: "text-foreground/75" }}
              className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Language: ${currentLangLabel}`}>
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langOptions.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                  <span className={cn("flex items-center gap-2", l.code === lang && "font-semibold text-primary")}>
                    <span>{l.flag}</span>
                    {l.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark / light */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* AI Assistant — desktop */}
          <Button variant="outline" size="sm" onClick={onOpenChat} aria-label="Open AI assistant"
            className="hidden items-center gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:border-primary md:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {t(tr.nav.aiAssistant, lang)}
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>

          {/* Book appointment — desktop */}
          <Button asChild className="hidden rounded-xl md:inline-flex">
            <Link to="/booking">
              {t(tr.nav.bookAppt, lang)}
            </Link>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display">{t(tr.nav.menu, lang)}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: link.to === "/" }}
                    activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                    className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Language picker — mobile */}
                <div className="mt-3 flex gap-1.5 px-1">
                  {langOptions.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={cn(
                        "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors",
                        l.code === lang
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {l.flag} {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* AI Assistant — mobile */}
                <button
                  onClick={() => { setOpen(false); onOpenChat(); }}
                  className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-primary font-medium transition-colors hover:bg-secondary text-left"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  {t(tr.nav.aiAssistant, lang)}
                  <MessageCircle className="h-4 w-4 ml-auto" />
                </button>

                <Button asChild className="mt-4 rounded-xl" onClick={() => setOpen(false)}>
                  <Link to="/booking">
                    {t(tr.nav.bookAppt, lang)}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
