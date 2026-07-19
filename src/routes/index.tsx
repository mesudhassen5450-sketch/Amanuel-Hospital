import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Star, Search, HeartPulse, Stethoscope, Pill, Ambulance,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { StatCounter } from "@/components/site/StatCounter";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { services, doctors } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations, translatedFaqs, translatedTestimonials, translatedStats } from "@/lib/translations";
import heroHospital from "@/assets/building.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Amanuel Hospital — Quality Healthcare in Bishoftu" },
      { name: "description", content: "24/7 emergency, experienced doctors and modern equipment at Dr. Amanuel Hospital, Bishoftu, Ethiopia." },
      { property: "og:title", content: "Dr. Amanuel Hospital — Quality Healthcare in Bishoftu" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <ServicesPreview />
      <DoctorsPreview />
      <ObnTvSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBand />
    </SiteLayout>
  );
}

function Hero() {
  const { lang } = useLanguage();
  const tr = translations.hero;
  const stats = translatedStats[lang];

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <img src={heroHospital} alt="Dr. Amanuel Hospital modern building exterior"
        width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20 dark:from-background/90 dark:via-background/70 dark:to-background/30" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <span className="absolute right-[14%] top-[22%] grid h-14 w-14 place-items-center rounded-2xl glass text-primary-glow animate-float">
          <HeartPulse className="h-7 w-7" />
        </span>
        <span className="absolute right-[26%] top-[52%] grid h-12 w-12 place-items-center rounded-2xl glass text-primary-glow animate-float-slow">
          <Stethoscope className="h-6 w-6" />
        </span>
        <span className="absolute right-[10%] top-[66%] grid h-12 w-12 place-items-center rounded-2xl glass text-primary-glow animate-float">
          <Pill className="h-6 w-6" />
        </span>
        <span className="absolute right-[38%] top-[30%] grid h-11 w-11 place-items-center rounded-2xl glass text-primary-glow animate-float-slow">
          <Ambulance className="h-5 w-5" />
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-32 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl animate-fade-up">
            {t(tr.title1, lang)}
            <span className="block bg-gradient-to-r from-primary-glow to-primary-foreground bg-clip-text text-transparent">
              {t(tr.title2, lang)}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-primary-foreground/85 md:text-lg">
            {t(tr.subtitle, lang)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl px-8 shadow-lg transition-transform active:scale-95">
              <Link to="/booking">
                {t(translations.nav.bookAppt, lang)}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="rounded-xl border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/services">
                {t(tr.exploreServices, lang)} <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl glass p-6 md:grid-cols-4 md:p-8">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const { lang } = useLanguage();
  const tr = translations.sections;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={t(tr.ourServices, lang)}
            title={t(tr.comprehensiveCare, lang)}
            subtitle={t(tr.comprehensiveSub, lang)}
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 hover-lift">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <Link to="/services"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                  {t(tr.learnMore, lang)} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorsPreview() {
  const { lang } = useLanguage();
  const tr = translations.sections;
  const docTr = translations.doctors;

  return (
    <section className="gradient-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={t(tr.ourTeam, lang)}
            title={t(tr.meetDoctors, lang)}
            subtitle={t(tr.meetDoctorsSub, lang)}
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.slice(0, 3).map((doc, i) => (
            <Reveal key={doc.name} delay={i * 80}>
              <div className="group overflow-hidden rounded-2xl border border-border bg-card hover-lift">
                <div className="img-zoom aspect-[4/3]">
                  <img src={doc.photo} alt={`Portrait of ${doc.name}`}
                    width={640} height={800} loading="lazy"
                    className="h-full w-full object-cover object-top" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold">{doc.name}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{doc.specialty}</p>
                    </div>
                    {doc.availableToday && (
                      <Badge className="shrink-0 rounded-full bg-success/15 text-success hover:bg-success/15">
                        {t(tr.availableToday, lang)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{doc.experience}</p>
                  <Button asChild variant="outline" className="mt-4 w-full rounded-xl">
                    <Link to="/booking">
                      {t(docTr.bookAppt, lang)}
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="ghost" className="rounded-xl text-primary hover:text-primary">
            <Link to="/doctors">
              {t(tr.viewAllDoctors, lang)} <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ObnTvSection() {
  const { lang } = useLanguage();
  const tr = translations.sections;

  return (
    <section className="gradient-soft py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={t(tr.obnEyebrow, lang)}
            title={t(tr.obnTitle, lang)}
            subtitle={t(tr.obnSub, lang)}
          />
        </Reveal>
        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-border bg-card card-shadow">
            <video controls preload="metadata" className="w-full rounded-3xl"
              aria-label="Dr. Amanuel Hospital as featured on OBN Television">
              <source src="/amanvid.mp4" type="video/mp4" />
              {t(translations.common.videoNoSupport, lang)}
            </video>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t(tr.obnCaption, lang)} —{" "}
            <span className="font-semibold text-foreground">OBN Television</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { lang } = useLanguage();
  const tr = translations.sections;
  const testimonials = translatedTestimonials[lang];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={t(tr.testimonials, lang)}
            title={t(tr.whatPatientsSay, lang)}
            subtitle={t(tr.patientsSub, lang)}
          />
        </Reveal>
        <Reveal className="mt-12">
          <Carousel opts={{ loop: true }} className="mx-auto max-w-3xl">
            <CarouselContent>
              {testimonials.map((item) => (
                <CarouselItem key={item.name}>
                  <figure className="mx-2 rounded-2xl border border-border bg-card p-8 text-center card-shadow md:p-10">
                    <div className="flex justify-center gap-1" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="mt-5 text-base text-foreground md:text-lg">
                      "{item.quote}"
                    </blockquote>
                    <figcaption className="mt-5">
                      <p className="font-display font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}

function FaqSection() {
  const { lang } = useLanguage();
  const tr = translations.sections;
  const [query, setQuery] = useState("");
  const faqs = translatedFaqs[lang];
  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="gradient-soft py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={t(tr.faqEyebrow, lang)}
            title={t(tr.faqTitle, lang)}
            subtitle={t(tr.faqSub, lang)}
          />
        </Reveal>
        <Reveal className="mt-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="faq-search" className="sr-only">{t(tr.faqSearch, lang)}</label>
            <Input id="faq-search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={t(tr.faqSearch, lang)} className="rounded-xl pl-10" />
          </div>
          <Accordion type="single" collapsible className="mt-6">
            {filtered.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-display text-sm font-semibold md:text-base">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground md:text-base">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {filtered.length === 0 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t(tr.faqNoResults, lang)} "{query}". {t(tr.faqTry, lang)}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function CtaBand() {
  const { lang } = useLanguage();
  const tr = translations.sections;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal>
          <div className="gradient-hero relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-12 md:py-20">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10 blur-2xl" />
            <h2 className="font-display text-2xl font-bold text-primary-foreground md:text-4xl">
              {t(tr.ctaTitle, lang)}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85 md:text-lg">
              {t(tr.ctaSub, lang)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary"
                className="rounded-xl px-8 transition-transform active:scale-95">
                <Link to="/booking">
                  {t(translations.nav.bookAppt, lang)}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="rounded-xl border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/contact">{t(tr.contactUs, lang)}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
