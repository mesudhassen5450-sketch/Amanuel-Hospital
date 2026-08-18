import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Globe, MessageCircle, Video } from "lucide-react";
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
import { VideoCallBadge } from "@/components/telemedicine/VideoCallBadge";
import { AvailableDoctorsModal } from "@/components/telemedicine/AvailableDoctorsModal";

const langOptions: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English",      flag: "🇬🇧" },
  { code: "am", label: "አማርኛ",         flag: "🇪🇹" },
  { code: "or", label: "Afaan Oromoo", flag: "/images/oromia.png" },
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
  const [videoModalOpen, setVideoModalOpen] = useState(false);

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
        scrolled ? "bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-800" : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-fit" aria-label="Dr. Amanuel Hospital home">
          <img src={logoImg} alt="Dr. Amanuel Hospital logo" className="h-8 w-8 shrink-0 rounded-xl object-cover" />
          <span className="font-display text-base font-bold leading-tight text-slate-900 dark:text-white whitespace-nowrap">
            Dr. Amanuel Hospital
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950 rounded-lg" }}
              inactiveProps={{ className: "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400" }}
              className="rounded-lg px-1.5 py-1 text-xs xl:text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Language: ${currentLangLabel}`} className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white p-1.5">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langOptions.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                  <span className={cn("flex items-center gap-2", l.code === lang && "font-semibold text-primary")}>
                    {l.flag.startsWith('/') ? (
                      <img src={l.flag} alt={`${l.label} flag`} className="w-4 h-3 object-cover rounded-sm" />
                    ) : (
                      <span>{l.flag}</span>
                    )}
                    {l.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark / light */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white p-1.5">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* AI Assistant — desktop */}
          <Button variant="outline" size="sm" onClick={onOpenChat} aria-label="Open AI assistant"
            className="hidden md:flex items-center gap-1 rounded-xl border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 xl:inline-flex px-2 py-1 text-xs shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="hidden xl:inline">{t(tr.nav.aiAssistant, lang)}</span>
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>

          {/* Video Call Badge — desktop */}
          <button
            onClick={() => setVideoModalOpen(true)}
            className="hidden md:flex items-center gap-1 px-2 py-1 border border-blue-200 dark:border-blue-800 rounded-full text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 shrink-0"
          >
            <Video className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap hidden xl:inline">Video Call</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              Live
            </span>
          </button>

          {/* Book appointment — desktop */}
          <Button asChild className="hidden rounded-xl md:inline-flex flex-shrink-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs xl:text-sm font-semibold">
            <Link to="/booking">
              {t(tr.nav.bookAppt, lang)}
            </Link>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white" aria-label="Open menu">
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
                        "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1",
                        l.code === lang
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {l.flag.startsWith('/') ? (
                        <img src={l.flag} alt={`${l.label} flag`} className="w-3 h-2 object-cover rounded-sm" />
                      ) : (
                        <span className="text-xs">{l.flag}</span>
                      )}
                      {l.code.toUpperCase()}
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

                {/* Online Video Consultation — mobile */}
                <button
                  onClick={() => { setOpen(false); setVideoModalOpen(true); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-sm font-medium hover:bg-blue-600 hover:text-white transition-all mt-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Video Consultation</span>
                  <Video className="h-4 w-4 ml-auto" />
                </button>

                <Button asChild className="mt-4 rounded-xl" onClick={() => setOpen(false)}>
                  <Link to="/booking" search={{ type: 'video', mode: 'online' }}>
                    {t(tr.nav.bookAppt, lang)}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <AvailableDoctorsModal open={videoModalOpen} onOpenChange={setVideoModalOpen} />
    </header>
  );
}
