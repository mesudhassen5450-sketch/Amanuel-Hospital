import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { t, translations } from "@/lib/translations";

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
}

export function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  const { lang } = useLanguage();

  return (
    <section className="gradient-soft border-b border-border pb-14 pt-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            {t(translations.common.home, lang)}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium text-foreground">{breadcrumb}</span>
        </nav>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-5xl animate-fade-up">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{subtitle}</p>
      </div>
    </section>
  );
}
