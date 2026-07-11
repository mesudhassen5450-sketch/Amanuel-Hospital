import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Facebook, Send } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactInfo } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations } from "@/lib/translations";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Dr. Amanuel Hospital" },
      { name: "description", content: "Contact Dr. Amanuel Hospital in Bishoftu, Ethiopia — phone, email, location and working hours." },
      { property: "og:title", content: "Contact Us — Dr. Amanuel Hospital" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = useLanguage();
  const tr = translations.contact;

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const infoItems = [
    { icon: Phone, label: t(tr.phone,        lang), value: contactInfo.phone },
    { icon: Mail,  label: t(tr.email,        lang), value: contactInfo.email },
    { icon: MapPin,label: t(tr.location,     lang), value: contactInfo.location },
    { icon: Clock, label: t(tr.workingHours, lang), value: contactInfo.hours },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2)        errs.name    = t(tr.errName,    lang);
    if (!/.+@.+\..+/.test(form.email))      errs.email   = t(tr.errEmail,   lang);
    if (form.message.trim().length < 10)    errs.message = t(tr.errMessage, lang);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      const subject = encodeURIComponent(form.subject || "Hospital Contact/Feedback");
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
      window.location.href = `mailto:dramanuelhospital@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <SiteLayout>
      <PageHero
        breadcrumb={t(tr.breadcrumb, lang)}
        title={t(tr.heroTitle, lang)}
        subtitle={t(tr.heroSub, lang)}
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-5 lg:px-8">
          {/* Info cards */}
          <Reveal className="lg:col-span-2">
            <div className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover-lift">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold">{item.label}</p>
                    <p className="mt-0.5 break-words text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <a href="https://web.facebook.com/Amanuelhtufa" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
                  <Button variant="secondary" size="icon" className="rounded-xl">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </a>
                <a href="https://t.me/amanuelbishoftu" target="_blank" rel="noopener noreferrer" aria-label="Join our Telegram channel">
                  <Button variant="secondary" size="icon" className="rounded-xl">
                    <Send className="h-4 w-4" />
                  </Button>
                </a>
                <a href={`mailto:${contactInfo.email}`} aria-label="Send us an email">
                  <Button variant="secondary" size="icon" className="rounded-xl">
                    <Mail className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={100} className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-6 card-shadow md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-xl font-semibold">{t(tr.messageSent, lang)}</h2>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t(tr.thankYou, lang)}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="ct-name">{t(tr.formName, lang)}</Label>
                      <Input id="ct-name" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t(tr.formNamePh, lang)} aria-invalid={!!errors.name} />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ct-email">{t(tr.formEmail, lang)}</Label>
                      <Input id="ct-email" type="email" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com" aria-invalid={!!errors.email} />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ct-subject">{t(tr.formSubject, lang)}</Label>
                    <Input id="ct-subject" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t(tr.formSubjectPh, lang)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ct-message">{t(tr.formMessage, lang)}</Label>
                    <Textarea id="ct-message" rows={5} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t(tr.formMessagePh, lang)} aria-invalid={!!errors.message} />
                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-xl">
                    {t(tr.sendMessage, lang)}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal className="mx-auto mt-14 max-w-7xl px-4 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border card-shadow">
            <iframe
              title="Map of Bishoftu, Ethiopia (Dr. Amanuel Hospital area)"
              src="https://www.google.com/maps?q=Bishoftu,Ethiopia&output=embed"
              className="h-96 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
