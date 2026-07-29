import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { getReceptionAppointments, updateVisitStatus, linkAppointmentToPatient, getPatients } from "@/lib/staff-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, RefreshCcw, Loader2, CalendarDays, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Dr. Amanuel Hospital" }] }),
  component: AppointmentsPage,
});

const VISIT_STATUSES = ["booked", "checked_in", "waiting", "completed", "cancelled"] as const;

const STATUS_STYLE: Record<string, string> = {
  booked:     "bg-blue-500/10 text-blue-600 border-blue-500/20",
  checked_in: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  waiting:    "bg-amber-500/10 text-amber-600 border-amber-500/20",
  completed:  "bg-green-600/10 text-green-700 border-green-600/20",
  cancelled:  "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_LABEL: Record<string, string> = {
  booked: "Booked", checked_in: "Checked In", waiting: "Waiting",
  completed: "Completed", cancelled: "Cancelled",
};

function AppointmentsPage() {
  const [appts, setAppts]         = useState<any[]>([]);
  const [patients, setPatients]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState("");
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
  const [linkModal, setLinkModal] = useState<{ apptId: string; search: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [a, p] = await Promise.all([
        getReceptionAppointments({ data: { date: dateFilter || undefined } }),
        getPatients(),
      ]);
      setAppts(a as any[]);
      setPatients(p as any[]);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [dateFilter]);

  const handleStatus = async (id: string, visitStatus: string) => {
    try {
      await updateVisitStatus({ data: { id, visitStatus } });
      toast.success(`Status updated to: ${STATUS_LABEL[visitStatus]}`);
      setAppts(prev => prev.map(a => a.id === id ? { ...a, visitStatus } : a));
    } catch (e: any) { toast.error(e.message); }
  };

  const handleLink = async (apptId: string, patientId: number) => {
    try {
      await linkAppointmentToPatient({ data: { appointmentId: apptId, patientId } });
      toast.success("Appointment linked to patient record.");
      setLinkModal(null);
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const filtered = appts.filter(a =>
    a.fullName.toLowerCase().includes(query.toLowerCase()) ||
    a.phone?.includes(query) ||
    (a.patientMRN && a.patientMRN.toLowerCase().includes(query.toLowerCase()))
  );

  const matchedPatients = linkModal
    ? patients.filter(p =>
        p.full_name.toLowerCase().includes(linkModal.search.toLowerCase()) ||
        p.mrn.toLowerCase().includes(linkModal.search.toLowerCase()) ||
        p.phone.includes(linkModal.search)
      ).slice(0, 8)
    : [];

  const METHOD_LABEL: Record<string, string> = {
    telebirr: "Telebirr", cbe_birr: "CBE Birr", card: "Card", cash: "Cash",
  };

  return (
    <StaffGuard>
      <StaffLayout>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" /> Appointments
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} appointment(s) shown</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2 rounded-xl">
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, phone, MRN..." className="pl-10 rounded-xl h-11 border-input/60" />
          </div>
          <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="rounded-xl h-11 border-input/60 sm:w-44" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border border-dashed border-border/60 rounded-2xl">
            <CardContent className="py-16 text-center text-muted-foreground">
              <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No appointments found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border/60 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Date / Time</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">MRN</th>
                    <th className="px-4 py-3">Visit Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.map(a => (
                    <tr key={a.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{a.fullName}</p>
                        <p className="text-xs text-muted-foreground">{a.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{a.appointmentDate}</p>
                        <p className="text-xs text-muted-foreground">{a.appointmentTime}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs">{METHOD_LABEL[a.paymentMethod] ?? a.paymentMethod}</p>
                        <p className="text-xs text-muted-foreground">{a.amount} ETB</p>
                      </td>
                      <td className="px-4 py-3">
                        {a.patientMRN ? (
                          <Badge variant="outline" className="font-mono text-xs bg-primary/5 border-primary/20 text-primary">
                            {a.patientMRN}
                          </Badge>
                        ) : (
                          <Button size="sm" variant="ghost"
                            className="h-7 text-xs text-muted-foreground hover:text-primary gap-1 px-2"
                            onClick={() => setLinkModal({ apptId: a.id, search: a.fullName })}>
                            <Link2 className="h-3.5 w-3.5" /> Link
                          </Button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("rounded-full border text-xs font-semibold px-2.5", STATUS_STYLE[a.visitStatus] ?? STATUS_STYLE.booked)}>
                          {STATUS_LABEL[a.visitStatus] ?? a.visitStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {a.visitStatus === "booked" && (
                            <Button size="sm" className="h-7 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                              onClick={() => handleStatus(a.id, "checked_in")}>Check In</Button>
                          )}
                          {a.visitStatus === "checked_in" && (
                            <Button size="sm" className="h-7 text-xs rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-2.5"
                              onClick={() => handleStatus(a.id, "waiting")}>Mark Waiting</Button>
                          )}
                          {(a.visitStatus === "waiting" || a.visitStatus === "checked_in") && (
                            <Button size="sm" className="h-7 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white px-2.5"
                              onClick={() => handleStatus(a.id, "completed")}>Complete</Button>
                          )}
                          {a.visitStatus !== "cancelled" && a.visitStatus !== "completed" && (
                            <Button size="sm" variant="outline"
                              className="h-7 text-xs rounded-lg border-destructive/30 text-destructive hover:bg-destructive/5 px-2.5"
                              onClick={() => handleStatus(a.id, "cancelled")}>Cancel</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Link Patient Modal */}
        {linkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <Card className="w-full max-w-md rounded-2xl shadow-2xl border border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-bold text-lg text-foreground">Link to Patient Record</h2>
                <Input
                  value={linkModal.search}
                  onChange={e => setLinkModal(m => m ? { ...m, search: e.target.value } : null)}
                  placeholder="Search by name, MRN, or phone"
                  className="rounded-xl h-11"
                />
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {matchedPatients.length === 0
                    ? <p className="text-sm text-muted-foreground text-center py-4">No patients found</p>
                    : matchedPatients.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-secondary/30 rounded-xl px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold">{p.full_name}</p>
                          <p className="text-xs text-muted-foreground">{p.mrn} · {p.phone}</p>
                        </div>
                        <Button size="sm" className="h-7 text-xs rounded-lg"
                          onClick={() => handleLink(linkModal.apptId, p.id)}>Link</Button>
                      </div>
                    ))
                  }
                </div>
                <Button variant="outline" className="w-full rounded-xl" onClick={() => setLinkModal(null)}>Cancel</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </StaffLayout>
    </StaffGuard>
  );
}
