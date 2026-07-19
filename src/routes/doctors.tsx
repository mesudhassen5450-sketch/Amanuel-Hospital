import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctors } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations, translatedDoctors } from "@/lib/translations";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Our Doctors — Dr. Amanuel Hospital" },
      { name: "description", content: "Meet the experienced physicians and specialists of Dr. Amanuel Hospital, Bishoftu." },
      { property: "og:title", content: "Our Doctors — Dr. Amanuel Hospital" },
      { property: "og:url", content: "/doctors" },
    ],
    links: [{ rel: "canonical", href: "/doctors" }],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const { lang } = useLanguage();
  const tr = translations.doctors;

  // Merge translated specialty/experience with photo from site-data
  const translatedList = translatedDoctors[lang].map((d, i) => ({
    ...d,
    name:          doctors[i].name,
    photo:         doctors[i].photo,
    availableToday: doctors[i].availableToday,
  }));

  return (
    <SiteLayout>
      <PageHero
        breadcrumb={t(tr.breadcrumb, lang)}
        title={t(tr.heroTitle, lang)}
        subtitle={t(tr.heroSub, lang)}
      />
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {translatedList.map((doc, i) => (
            <Reveal key={doc.name} delay={(i % 3) * 70}>
              <div className="group h-full overflow-hidden rounded-2xl border border-border bg-card hover-lift">
                <div className="img-zoom aspect-[4/3]">
                  <img src={doc.photo} alt={`Portrait of ${doc.name}`}
                    width={640} height={800} loading="lazy"
                    className="h-full w-full object-cover object-top" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-lg font-semibold">{doc.name}</h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">{doc.specialty}</p>
                    </div>
                    {doc.availableToday && (
                      <Badge className="shrink-0 rounded-full bg-success/15 text-success hover:bg-success/15">
                        {t(tr.available, lang)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{doc.experience}</p>
                  <Button asChild className="mt-5 w-full rounded-xl">
                    <Link to="/booking">
                      {t(tr.bookAppt, lang)}
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
