import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, HeartHandshake, Award, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { galleryImages } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations } from "@/lib/translations";
import aboutLobby from "@/assets/cash.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Dr. Amanuel Hospital" },
      { name: "description", content: "Learn about Dr. Amanuel Hospital's mission, vision, values and journey serving Bishoftu, Ethiopia." },
      { property: "og:title", content: "About Us — Dr. Amanuel Hospital" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useLanguage();
  const tr = translations.about;

  const values = [
    { icon: HeartHandshake, title: t(tr.values.compassionTitle, lang), text: t(tr.values.compassionText, lang) },
    { icon: Award,          title: t(tr.values.excellenceTitle, lang), text: t(tr.values.excellenceText, lang) },
    { icon: Target,         title: t(tr.values.integrityTitle,  lang), text: t(tr.values.integrityText,  lang) },
    { icon: Eye,            title: t(tr.values.innovationTitle, lang), text: t(tr.values.innovationText, lang) },
  ];

  const timeline = [
    { year: "2010", event: { en: "Hospital founded as a small clinic serving the Bishoftu community.",    am: "ሆስፒታሉ ቢሾፍቱ ማህበረሰቡን እያገለገለ እንደ ትንሽ ክሊኒክ ተቋቋመ።",         or: "Hospitaalli hawaasa Bishooftuu tajaajilu akka kilinika xiqqaatti hundaa'e." } },
    { year: "2014", event: { en: "Expanded to a full general hospital with inpatient wards.",            am: "ወደ ሙሉ ጠቅላላ ሆስፒታል ተስፋፍቶ ታካሚ ወርዶች ተጨመሩ።",               or: "Hospitaala waliigalaa guutuu kutaalee dhukkubsataa waliin babal'ate." } },
    { year: "2017", event: { en: "Opened modern operating theaters and maternity wing.",                 am: "ዘመናዊ የቀዶ ጥገና ቤቶችና የወሊድ ክፍል ተከፈቱ።",                       or: "Kutaalee qoricha fi kutaa da'umsaa ammayyaa banaman." } },
    { year: "2020", event: { en: "Added CT imaging and upgraded the diagnostic laboratory.",             am: "CT ምስፍፍ ተጨምሮ ምርምር ላቦራቶሪ ተዘምኗል።",                         or: "Fakkii CT dabalatee laboratoori qorannoo fooyya'e." } },
    { year: "2023", event: { en: "Launched 24/7 emergency department with ambulance service.",          am: "24/7 የአደጋ ክፍል ከአምቡላንስ አገልግሎት ጋር ተጀምሯል።",                or: "Kutaan ariifachiisaa 24/7 tajaajila ambulaansii waliin eegale." } },
    { year: "2025", event: { en: "Serving tens of thousands of patients every year.",                   am: "በዓመት ብዙ ሺ ታካሚዎችን እያገለገሉ ነው።",                             or: "Dhukkubsattoota kuma hedduuf tajaajila yeroo hunda kennaa jira." } },
  ];

  const achievements = [
    { en: "24/7 emergency and ambulance coordination",                    am: "24/7 አደጋ እና አምቡላንስ ቅንጅት",                              or: "Koordineeshiinii ariifachiisaa fi ambulaansii 24/7" },
    { en: "Modern surgical theaters with international safety protocols", am: "ዓለም አቀፍ የደህንነት ፕሮቶኮሎች ያሉ ዘመናዊ ቀዶ ቤቶች",               or: "Kutaalee qoricha ammayyaa protokolii nageenya idil-addunyaa qaban" },
    { en: "Comprehensive maternal and child health services",             am: "ሁሉን አቀፍ የእናቶችና ሕፃናት ጤና አገልግሎቶች",                     or: "Tajaajila fayyaa haadha fi daa'imaa guutuu" },
    { en: "Advanced imaging: digital X-ray, ultrasound and CT",          am: "የላቀ ምስፍፍ ቴክኖሎጂ፡ ዲጂታል ኤክስሬይ፣ ኡልትራሳውንድ እና CT",         or: "Fakkii olaanaa: X-ray dijitaalaa, ultrasound fi CT" },
    { en: "Automated laboratory with strict quality control",            am: "ጥብቅ ጥራት ቁጥጥር ያለው አውቶማቲክ ላቦራቶሪ",                     or: "Laboratoori awtomeetii qabiyyee qulqulluu cimaaan to'atame" },
    { en: "Trusted by thousands of families across Oromia",              am: "በኦሮሚያ ብዙ ሺ ቤተሰቦች የሚያምኑበት",                             or: "Maatii kuma hedduun Oromiyaa keessatti amanamaa ta'e" },
  ];

  return (
    <SiteLayout>
      <PageHero
        breadcrumb={t(tr.breadcrumb, lang)}
        title={t(tr.heroTitle, lang)}
        subtitle={t(tr.heroSub, lang)}
      />

      {/* Intro */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="img-zoom rounded-3xl card-shadow">
              <img src={aboutLobby} alt="Reception lobby of Dr. Amanuel Hospital"
                width={1200} height={900} loading="lazy"
                className="h-full w-full rounded-3xl object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading align="left" eyebrow={t(tr.whoWeAre, lang)} title={t(tr.caring, lang)} />
            <p className="mt-5 text-muted-foreground">{t(tr.introPara, lang)}</p>
            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-border bg-card p-5 hover-lift">
                <h3 className="flex items-center gap-2 font-display font-semibold">
                  <Target className="h-5 w-5 text-primary" aria-hidden="true" /> {t(tr.ourMission, lang)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(tr.missionText, lang)}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 hover-lift">
                <h3 className="flex items-center gap-2 font-display font-semibold">
                  <Eye className="h-5 w-5 text-primary" aria-hidden="true" /> {t(tr.ourVision, lang)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(tr.visionText, lang)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={t(tr.coreValues, lang)} title={t(tr.guidesUs, lang)} />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 text-center hover-lift">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110">
                    <v.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={t(tr.ourJourney, lang)} title={t(tr.milestones, lang)} />
          </Reveal>
          <ol className="relative mt-12 space-y-8 border-l-2 border-primary/20 pl-8">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 60}>
                <li className="relative">
                  <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full bg-primary ring-4 ring-background" aria-hidden="true" />
                  <span className="font-display text-lg font-bold text-primary">{item.year}</span>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">{t(item.event, lang)}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Achievements */}
      <section className="gradient-soft py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <SectionHeading align="left" eyebrow={t(tr.achievements, lang)} title={t(tr.whyChooseUs, lang)} />
            <ul className="mt-6 space-y-3">
              {achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground md:text-base">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {t(a, lang)}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 rounded-xl">
              <Link to="/gallery">
                {t(tr.exploreGallery, lang)} <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.slice(0, 4).map((img) => (
                <div key={img.src} className="img-zoom rounded-2xl">
                  <img src={img.src} alt={img.alt} width={img.width} height={img.height}
                    loading="lazy" className="aspect-square h-full w-full rounded-2xl object-cover" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
