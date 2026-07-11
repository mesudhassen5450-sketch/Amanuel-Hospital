import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Send, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contactInfo, services } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations } from "@/lib/translations";
import logoImg from "@/assets/logo.jpg";

export function Footer() {
  const { lang } = useLanguage();
  const tr = translations.footer;
  const nav = translations.nav;

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const quickLinks = [
    { to: "/about",       label: t(nav.about,       lang) },
    { to: "/doctors",     label: t(tr.ourDoctors,   lang) },
    { to: "/departments", label: t(nav.departments, lang) },
    { to: "/gallery",     label: t(nav.gallery,     lang) },
    { to: "/contact",     label: t(nav.contact,     lang) },
  ] as const;

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Dr. Amanuel Hospital logo" className="h-9 w-9 rounded-xl object-cover" />
              <span className="font-display text-lg font-bold">Dr. Amanuel Hospital</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t(tr.tagline, lang)}</p>
            <div className="mt-4 flex gap-2">
              <a
                href="https://web.facebook.com/Amanuelhtufa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <Button variant="secondary" size="icon" className="rounded-xl">
                  <Facebook className="h-4 w-4" />
                </Button>
              </a>
              <a
                href="https://t.me/amanuelbishoftu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our Telegram channel"
              >
                <Button variant="secondary" size="icon" className="rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                aria-label="Send us an email"
              >
                <Button variant="secondary" size="icon" className="rounded-xl">
                  <Mail className="h-4 w-4" />
                </Button>
              </a>
              <a
                href="https://www.google.com/maps?q=Bishoftu,Ethiopia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Google Maps"
              >
                <Button variant="secondary" size="icon" className="rounded-xl">
                  <MapPin className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
              {t(tr.quickLinks, lang)}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-muted-foreground transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
              {t(tr.servicesLabel, lang)}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <Link to="/services" className="text-muted-foreground transition-colors hover:text-primary">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency & Newsletter */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
              {t(tr.emergency, lang)}
            </h3>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <Phone className="h-4 w-4" aria-hidden="true" /> {contactInfo.emergency}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t(tr.emergencyHotline, lang)}</p>
            {subscribed ? (
              <p className="mt-5 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">
                {t(tr.subscribed, lang)}
              </p>
            ) : (
              <form className="mt-5 flex gap-2"
                onSubmit={(e) => { e.preventDefault(); if (/.+@.+\..+/.test(email)) setSubscribed(true); }}>
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <Input id="newsletter-email" type="email" required
                  placeholder={t(tr.emailPh, lang)} value={email}
                  onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
                <Button type="submit" className="rounded-xl">{t(tr.join, lang)}</Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {t(tr.copyright, lang)}</p>
        </div>
      </div>
    </footer>
  );
}
