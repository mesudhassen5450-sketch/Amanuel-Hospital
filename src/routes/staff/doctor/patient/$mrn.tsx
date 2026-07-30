import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { useStaffAuth } from "@/lib/staff-auth";
import {
  getPatientWithAppointment,
  getPatientConsultations,
  saveConsultation,
} from "@/lib/staff-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User, Phone, Calendar, MapPin, Heart, AlertTriangle, Activity,
  ChevronLeft, Loader2, ClipboardList, Stethoscope, CheckCircle2,
  Clock, CreditCard, BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/doctor/patient/$mrn")({
  validateSearch: (s: Record<string, unknown>) => ({
    appointmentId: s.appointmentId ? String(s.appointmentId) : undefined,
  }),
  head: () => ({ meta: [{ title: "Clinical Profile — Dr. Amanuel Hospital" }] }),
  component: DoctorPatientPage,
});

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 p-2 rounded-xl text-primary mt-0.5 shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {value || <span className="text-muted-foreground italic">Not recorded</span>}
        </p>
      </div>
    </div>
  );
}

const VISIT_STYLE: Record<string, string> = {
  booked:     "bg-blue-500/10 text-blue-600 border-blue-500/20",
  checked_in: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  waiting:    "bg-amber-500/10 text-amber-600 border-amber-500/20",
  completed:  "bg-green-600/10 text-green-700 border-green-600/20",
  cancelled:  "bg-destructive/10 text-destructive border-destructive/20",
};

const METHOD_LABEL: Record<string, string> = {
  telebirr: "Telebirr", cbe_birr: "CBE Birr", card: "Card", cash: "Cash",
};

function DoctorPatientPage() {
  const { mrn } = Route.useParams();
  const { appointmentId } = Route.useSearch();
  const { user } = useStaffAuth();
  const navigate = useNavigate();

  const [patient, setPatient]         = useState<any>(null);
  const [appointment, setAppointment] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [activeTab, setActiveTab]     = useState<"profile" | "history" | "new">("profile");

  // Consultation form state
  const [form, setForm] = useState({
    chief_complaint: "",
    history_of_present_illness: "",
    blood_pressure: "",
    temperature: "",
    pulse_rate: "",
    weight: "",
    height: "",
    physical_examination: "",
    diagnosis: "",
    treatment_plan: "",
    additional_notes: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { patient: p, appointment: a } = await getPatientWithAppointment({
          data: { mrn, appointmentId },
        }) as any;
        setPatient(p);
        setAppointment(a);
        if (p?.id) {
          const c = await getPatientConsultations({ data: { patientId: p.id } });
          setConsultations(c as any[]);
        }
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [mrn, appointmentId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.chief_complaint.trim()) { toast.error("Chief complaint is required."); return; }
    if (!form.diagnosis.trim())       { toast.error("Diagnosis is required."); return; }
    if (saved) { toast.error("Consultation already saved for this session."); return; }

    setSaving(true);
    try {
      await saveConsultation({
        data: {
          patient_id:                patient.id,
          appointment_id:            appointment?.id ?? null,
          doctor_username:           user?.username ?? "doctor",
          chief_complaint:           form.chief_complaint.trim(),
          history_of_present_illness: form.history_of_present_illness || undefined,
          blood_pressure:            form.blood_pressure || undefined,
          temperature:               form.temperature || undefined,
          pulse_rate:                form.pulse_rate || undefined,
          weight:                    form.weight || undefined,
          height:                    form.height || undefined,
          physical_examination:      form.physical_examination || undefined,
          diagnosis:                 form.diagnosis.trim(),
          treatment_plan:            form.treatment_plan || undefined,
          additional_notes:          form.additional_notes || undefined,
        },
      });
      toast.success("Consultation saved. Appointment marked as Completed.");
      setSaved(true);
      // Refresh consultations
      const c = await getPatientConsultations({ data: { patientId: patient.id } });
      setConsultations(c as any[]);
      setActiveTab("history");
      if (appointment) setAppointment({ ...appointment, visit_status: "completed" });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save consultation.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <StaffGuard><StaffLayout>
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading patient...
      </div>
    </StaffLayout></StaffGuard>
  );

  if (!patient) return (
    <StaffGuard><StaffLayout>
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-semibold">Patient not found</p>
        <Link to="/staff/doctor/queue">
          <Button variant="outline" className="mt-4 rounded-xl">Back to Queue</Button>
        </Link>
      </div>
    </StaffLayout></StaffGuard>
  );

  return (
    <StaffGuard>
      <StaffLayout>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/staff/doctor/queue" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-foreground font-display">{patient.full_name}</h1>
                <Badge className="font-mono text-xs bg-primary/10 text-primary border-primary/20 border">{patient.mrn}</Badge>
                {appointment && (
                  <Badge className={cn("rounded-full border text-xs font-semibold px-2.5",
                    VISIT_STYLE[appointment.visit_status] ?? VISIT_STYLE.booked)}>
                    {appointment.visit_status?.replace("_", " ")}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {patient.gender ?? "—"} · {patient.date_of_birth ?? "—"} · {patient.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/40 rounded-2xl p-1 mb-6 w-fit">
          {([
            { key: "profile", label: "Patient Info",    icon: User },
            { key: "history", label: `History (${consultations.length})`, icon: ClipboardList },
            { key: "new",     label: "New Consultation", icon: Stethoscope },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === key
                  ? "bg-card shadow-sm text-foreground border border-border/40"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ─────────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
            <Card className="lg:col-span-2 border border-border/60 rounded-2xl shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoRow icon={User}     label="Full Name"     value={patient.full_name} />
                <InfoRow icon={Phone}    label="Phone"         value={patient.phone} />
                <InfoRow icon={Calendar} label="Date of Birth" value={patient.date_of_birth} />
                <InfoRow icon={User}     label="Gender"        value={patient.gender} />
                <div className="sm:col-span-2">
                  <InfoRow icon={MapPin} label="Address" value={patient.address} />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 rounded-2xl shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Medical Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <InfoRow icon={Heart}         label="Blood Group"        value={patient.blood_group} />
                <InfoRow icon={AlertTriangle} label="Allergies"          value={patient.allergies} />
                <InfoRow icon={Activity}      label="Chronic Conditions" value={patient.chronic_conditions} />
              </CardContent>
            </Card>

            {appointment && (
              <Card className="lg:col-span-3 border border-border/60 rounded-2xl shadow-sm">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Appointment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
                  <InfoRow icon={Calendar}  label="Date"           value={appointment.appointment_date} />
                  <InfoRow icon={Clock}     label="Time"           value={appointment.appointment_time} />
                  <InfoRow icon={CreditCard} label="Payment Method" value={METHOD_LABEL[appointment.payment_method] ?? appointment.payment_method} />
                  <InfoRow icon={BadgeCheck} label="Payment Status" value={appointment.payment_status} />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ─────────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <div className="max-w-4xl space-y-4">
            {consultations.length === 0 ? (
              <Card className="border border-dashed border-border/60 rounded-2xl">
                <CardContent className="py-16 text-center text-muted-foreground">
                  <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No previous consultation records.</p>
                  <p className="text-xs mt-1">Create a new consultation from the tab above.</p>
                </CardContent>
              </Card>
            ) : consultations.map(c => (
              <Card key={c.id} className="border border-border/60 rounded-2xl shadow-sm">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      {new Date(c.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground capitalize">Dr. {c.doctor_username}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Chief Complaint</p>
                    <p className="text-foreground">{c.chief_complaint}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Diagnosis</p>
                    <p className="text-foreground font-medium">{c.diagnosis}</p>
                  </div>
                  {c.history_of_present_illness && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">History of Present Illness</p>
                      <p className="text-foreground">{c.history_of_present_illness}</p>
                    </div>
                  )}
                  {(c.blood_pressure || c.temperature || c.pulse_rate || c.weight || c.height) && (
                    <div className="sm:col-span-2 bg-secondary/20 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        ["BP", c.blood_pressure], ["Temp", c.temperature],
                        ["Pulse", c.pulse_rate], ["Weight", c.weight], ["Height", c.height],
                      ].filter(([, v]) => v).map(([label, val]) => (
                        <div key={label as string}>
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="text-sm font-semibold">{val}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {c.treatment_plan && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Treatment Plan</p>
                      <p className="text-foreground">{c.treatment_plan}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── NEW CONSULTATION TAB ─────────────────────────────────────────── */}
        {activeTab === "new" && (
          <form onSubmit={handleSave} className="max-w-3xl space-y-5">
            {saved && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded-xl text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Consultation saved successfully. Appointment marked as Completed.
              </div>
            )}

            {/* Chief Complaint + HPI */}
            <Card className="border border-border/60 rounded-2xl shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-semibold">Presenting Complaint</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">
                    Chief Complaint <span className="text-destructive">*</span>
                  </Label>
                  <Input value={form.chief_complaint} onChange={e => set("chief_complaint", e.target.value)}
                    placeholder="e.g. Chest pain for 2 days" className="rounded-xl h-11" disabled={saved} />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">History of Present Illness / Symptoms</Label>
                  <Textarea value={form.history_of_present_illness}
                    onChange={e => set("history_of_present_illness", e.target.value)}
                    placeholder="Detailed description of symptoms, onset, duration, aggravating/relieving factors..."
                    rows={3} className="rounded-xl resize-none" disabled={saved} />
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card className="border border-border/60 rounded-2xl shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-semibold">Vital Signs</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: "blood_pressure", label: "Blood Pressure", placeholder: "e.g. 120/80 mmHg" },
                  { key: "temperature",    label: "Temperature",    placeholder: "e.g. 37.2 °C" },
                  { key: "pulse_rate",     label: "Pulse Rate",     placeholder: "e.g. 72 bpm" },
                  { key: "weight",         label: "Weight",         placeholder: "e.g. 68 kg" },
                  { key: "height",         label: "Height",         placeholder: "e.g. 170 cm" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label className="font-semibold text-sm">{label}</Label>
                    <Input value={(form as any)[key]} onChange={e => set(key, e.target.value)}
                      placeholder={placeholder} className="rounded-xl h-11" disabled={saved} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Examination + Diagnosis */}
            <Card className="border border-border/60 rounded-2xl shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-semibold">Examination & Diagnosis</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Physical Examination</Label>
                  <Textarea value={form.physical_examination}
                    onChange={e => set("physical_examination", e.target.value)}
                    placeholder="Findings from physical examination..." rows={3}
                    className="rounded-xl resize-none" disabled={saved} />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">
                    Diagnosis <span className="text-destructive">*</span>
                  </Label>
                  <Textarea value={form.diagnosis} onChange={e => set("diagnosis", e.target.value)}
                    placeholder="Clinical diagnosis..." rows={2}
                    className="rounded-xl resize-none" disabled={saved} />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Treatment Plan</Label>
                  <Textarea value={form.treatment_plan} onChange={e => set("treatment_plan", e.target.value)}
                    placeholder="Medications, follow-up, referrals..." rows={3}
                    className="rounded-xl resize-none" disabled={saved} />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Additional Clinical Notes</Label>
                  <Textarea value={form.additional_notes} onChange={e => set("additional_notes", e.target.value)}
                    placeholder="Any other clinical observations..." rows={2}
                    className="rounded-xl resize-none" disabled={saved} />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pb-6">
              <Button type="button" variant="outline" className="rounded-xl px-6"
                onClick={() => navigate({ to: "/staff/doctor/queue" })}>
                Back to Queue
              </Button>
              <Button type="submit" disabled={saving || saved} className="rounded-xl px-8 gap-2 shadow-md">
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  : saved
                    ? <><CheckCircle2 className="h-4 w-4" /> Saved</>
                    : <><Stethoscope className="h-4 w-4" /> Save Consultation</>
                }
              </Button>
            </div>
          </form>
        )}
      </StaffLayout>
    </StaffGuard>
  );
}
