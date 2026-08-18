import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { doctors } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations, translatedDoctors } from "@/lib/translations";
import { Video, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvailableDoctorsModal } from "@/components/telemedicine/AvailableDoctorsModal";
import { useState } from "react";

export const Route = createFileRoute("/video-consultation")({
  head: () => ({
    meta: [
      { title: "Video Consultation — Dr. Amanuel Hospital" },
      { name: "description", content: "Connect instantly with our online doctors for video consultations." },
      { property: "og:title", content: "Video Consultation — Dr. Amanuel Hospital" },
      { property: "og:url", content: "/video-consultation" },
    ],
    links: [{ rel: "canonical", href: "/video-consultation" }],
  }),
  component: VideoConsultationPage,
});

function VideoConsultationPage() {
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
    isOnline:       doctors[i].isOnline,
  }));

  // STRICT FILTER: Only include doctors who are currently logged in / online
  const onlineDoctors = translatedList.filter((doc) => doc.isOnline === true);

  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Video Consultation"
        title="Available Doctors for Instant Video Consultation"
        subtitle="Select an online doctor below to start an immediate video consultation"
      />
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Reveal>
            <div className="space-y-4">
              {onlineDoctors.length > 0 ? (
                onlineDoctors.map((doctor, i) => (
                  <Reveal key={doctor.id} delay={i * 50}>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={doctor.photo}
                            alt={doctor.name}
                            className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            onError={(e) => {
                              e.currentTarget.src = "/fallback-doctor.png";
                            }}
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Dr. {doctor.name}</h2>
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold rounded-full">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Online
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{doctor.specialty}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Video Call (100 ETB)
                            </span>
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="h-3 w-3 fill-amber-500" />
                              4.9
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setVideoModalOpen(true)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors shrink-0"
                      >
                        Check Availability & Call
                      </Button>
                    </div>
                  </Reveal>
                ))
              ) : (
                /* Empty State if no doctors are logged in */
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <div className="text-4xl mb-4">📵</div>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-1">
                    No doctors are currently online for instant video consultation
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
                    You can browse all doctors to schedule an appointment for later
                  </p>
                  <Button asChild variant="outline" className="mx-auto">
                    <Link to="/doctors">
                      View All Doctors Directory
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
      
      <AvailableDoctorsModal open={videoModalOpen} onOpenChange={setVideoModalOpen} />
    </SiteLayout>
  );
}
