import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { getPatientByMRN } from "@/lib/staff-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  User, Phone, Calendar, MapPin, Heart, AlertTriangle,
  Activity, ChevronLeft, Loader2, ClipboardList, Pencil
} from "lucide-react";

export const Route = createFileRoute("/staff/patients/$mrn")({
  head: () => ({ meta: [{ title: "Patient Profile — Dr. Amanuel Hospital" }] }),
  component: PatientProfilePage,
});

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 p-2 rounded-xl text-primary mt-0.5 shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || <span className="text-muted-foreground italic">Not recorded</span>}</p>
      </div>
    </div>
  );
}

function PatientProfilePage() {
  const { mrn } = Route.useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getPatientByMRN({ data: { mrn } })
      .then(p => { setPatient(p); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [mrn]);

  if (loading) return (
    <StaffGuard><StaffLayout>
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading patient...
      </div>
    </StaffLayout></StaffGuard>
  );

  if (error || !patient) return (
    <StaffGuard><StaffLayout>
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-semibold">Patient not found</p>
        <Link to="/staff/patients"><Button variant="outline" className="mt-4 rounded-xl">Back to Patients</Button></Link>
      </div>
    </StaffLayout></StaffGuard>
  );

  return (
    <StaffGuard>
      <StaffLayout>
        {/* Back + header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/staff/patients" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-foreground font-display">{patient.full_name}</h1>
                <Badge className="font-mono text-xs bg-primary/10 text-primary border-primary/20 border">
                  {patient.mrn}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Registered {new Date(patient.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" disabled>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
          {/* Personal info */}
          <Card className="lg:col-span-2 border border-border/60 rounded-2xl shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow icon={User}     label="Full Name"    value={patient.full_name} />
              <InfoRow icon={Phone}    label="Phone"        value={patient.phone} />
              <InfoRow icon={Calendar} label="Date of Birth" value={patient.date_of_birth} />
              <InfoRow icon={User}     label="Gender"       value={patient.gender} />
              <InfoRow icon={MapPin}   label="Address"      value={patient.address} />
            </CardContent>
          </Card>

          {/* Emergency contact */}
          <Card className="border border-border/60 rounded-2xl shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <InfoRow icon={User}  label="Name"  value={patient.emergency_contact_name} />
              <InfoRow icon={Phone} label="Phone" value={patient.emergency_contact_phone} />
            </CardContent>
          </Card>

          {/* Medical info */}
          <Card className="lg:col-span-2 border border-border/60 rounded-2xl shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow icon={Heart}         label="Blood Group"         value={patient.blood_group} />
              <InfoRow icon={AlertTriangle} label="Allergies"           value={patient.allergies} />
              <div className="sm:col-span-2">
                <InfoRow icon={Activity} label="Chronic Conditions" value={patient.chronic_conditions} />
              </div>
              <div className="sm:col-span-2">
                <InfoRow icon={ClipboardList} label="Notes" value={patient.notes} />
              </div>
            </CardContent>
          </Card>

          {/* Medical history placeholder */}
          <Card className="border border-dashed border-border/60 rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground" /> Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="py-10 text-center text-muted-foreground">
              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No medical history recorded yet.</p>
              <p className="text-xs mt-1">Will be available in a future phase.</p>
            </CardContent>
          </Card>
        </div>
      </StaffLayout>
    </StaffGuard>
  );
}
