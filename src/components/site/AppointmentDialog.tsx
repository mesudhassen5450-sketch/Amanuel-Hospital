import { useState, type ReactNode } from "react";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { services } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import { t, translations } from "@/lib/translations";

export function AppointmentDialog({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const tr = translations.appt;

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", phone: "", department: "", date: "", note: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2)               errs.name       = t(tr.errName,  lang);
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) errs.phone  = t(tr.errPhone, lang);
    if (!form.department)                           errs.department = t(tr.errDept,  lang);
    if (!form.date)                                 errs.date       = t(tr.errDate,  lang);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      const subject = encodeURIComponent(`Appointment Request - ${form.name}`);
      const body = encodeURIComponent(
        `Appointment Details:\nName: ${form.name}\nPhone: ${form.phone}\nDepartment: ${form.department}\nPreferred Date: ${form.date}\n\nNote:\n${form.note || "No notes provided"}`
      );
      window.location.href = `mailto:dramanuelhospital@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  const reset = (o: boolean) => {
    setOpen(o);
    if (!o) { setSubmitted(false); setErrors({}); }
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl font-semibold">{t(tr.received, lang)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(tr.receivedDesc, lang)}</p>
            <Button className="mt-6 rounded-xl" onClick={() => reset(false)}>
              {t(tr.done, lang)}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display">
                <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                {t(tr.title, lang)}
              </DialogTitle>
              <DialogDescription>{t(tr.description, lang)}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="apt-name">{t(tr.fullName, lang)}</Label>
                <Input id="apt-name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t(tr.fullNamePh, lang)} aria-invalid={!!errors.name} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apt-phone">{t(tr.phone, lang)}</Label>
                <Input id="apt-phone" type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+251 9X XXX XXXX" aria-invalid={!!errors.phone} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="apt-dept">{t(tr.department, lang)}</Label>
                  <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                    <SelectTrigger id="apt-dept" aria-invalid={!!errors.department}>
                      <SelectValue placeholder={t(tr.deptPh, lang)} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="apt-date">{t(tr.preferredDate, lang)}</Label>
                  <Input id="apt-date" type="date" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    aria-invalid={!!errors.date} />
                  {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apt-note">{t(tr.note, lang)}</Label>
                <Textarea id="apt-note" value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder={t(tr.notePh, lang)} rows={3} />
              </div>
              <Button type="submit" className="w-full rounded-xl">{t(tr.submit, lang)}</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
