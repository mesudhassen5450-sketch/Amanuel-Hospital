import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctors } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations, translatedDoctors } from "@/lib/translations";
import { Video, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvailableDoctorsModal } from "@/components/telemedicine/AvailableDoctorsModal";

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
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Merge translated specialty/experience with photo from site-data
  const translatedList = translatedDoctors[lang].map((d, i) => ({
    ...d,
    id: (i + 1).toString(),
    name:          doctors[i].name,
    photo:         doctors[i].photo,
    availableToday: doctors[i].availableToday,
    isOnline: true, // Mock online status - in production, this would come from real-time data
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
                    <Badge
                      className={cn(
                        "shrink-0 rounded-full",
                        doc.isOnline
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                      )}
                    >
                      {doc.isOnline ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Online
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Offline
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{doc.experience}</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="outline"
                      className="w-full sm:w-1/2 py-2.5 px-3 text-xs sm:text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center gap-2"
                      onClick={() => setVideoModalOpen(true)}
                      disabled={!doc.isOnline}
                    >
                      <Video className="h-4 w-4" />
                      Check Availability
                    </Button>
                    <Button asChild className="w-full sm:w-1/2 py-2.5 px-3 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all text-center">
                      <Link to="/booking">
                        {t(tr.bookAppt, lang)}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      
      <AvailableDoctorsModal open={videoModalOpen} onOpenChange={setVideoModalOpen} />
    </SiteLayout>
  );
}
