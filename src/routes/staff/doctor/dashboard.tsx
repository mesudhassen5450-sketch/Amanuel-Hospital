import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { useStaffAuth } from "@/lib/staff-auth";
import { getDoctorStats } from "@/lib/staff-server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle2, BadgeCheck, Loader2, RefreshCcw, Stethoscope, ListChecks } from "lucide-react";
import { DoctorNotificationModal, useDoctorNotifications } from "@/components/telemedicine/DoctorNotificationModal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/doctor/dashboard")({
  head: () => ({ meta: [{ title: "Doctor Dashboard — Dr. Amanuel Hospital" }] }),
  component: DoctorDashboardPage,
});

function DoctorDashboardPage() {
  const { user } = useStaffAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Doctor notification system for incoming video consultation requests
  // Use username as doctor identifier since StaffUser doesn't have id field
  const doctorId = user?.username || "doctor";
  const { incomingRequest, modalOpen, setModalOpen } = useDoctorNotifications(doctorId);

  const load = async () => {
    setLoading(true);
    try { setStats(await getDoctorStats()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Supabase Realtime subscription for general appointments
  useEffect(() => {
    if (!user?.username) {
      console.warn("[DoctorDashboard] Realtime subscription aborted: user.username is missing or undefined");
      return;
    }

    const channel = supabase
      .channel(`doctor-dashboard-${user.username}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `doctor_id=eq.${user.username}`,
        },
        (payload) => {
          const newAppointment = payload.new as any;
          
          // Play notification sound
          const audio = new Audio('/notification-sound.wav');
          audio.play().catch(console.error);
          
          // Show toast notification
          toast.success('New Appointment', {
            description: `${newAppointment.full_name || 'Patient'} has booked an appointment`,
            duration: 5000,
          });
          
          // Refresh stats
          load();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `doctor_id=eq.${user.username}`,
        },
        (payload) => {
          // Refresh stats when appointments are updated
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.username]);

  const CARDS = stats ? [
    { label: "Today's Patients", value: stats.todayPatients, icon: Users,         color: "text-primary",    bg: "bg-primary/10" },
    { label: "Waiting",          value: stats.waiting,       icon: Clock,          color: "text-amber-500",  bg: "bg-amber-500/10" },
    { label: "Checked In",       value: stats.checkedIn,     icon: BadgeCheck,     color: "text-blue-500",   bg: "bg-blue-500/10" },
    { label: "Completed",        value: stats.completed,     icon: CheckCircle2,   color: "text-green-600",  bg: "bg-green-500/10" },
  ] : [];

  return (
    <StaffGuard allowedRoles={["doctor", "staff"]}>
      <StaffLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display flex items-center gap-2">
              <Stethoscope className="h-7 w-7 text-primary" /> Doctor Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome, <span className="font-semibold capitalize text-primary">{user?.username}</span> ·{" "}
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2 rounded-xl">
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {CARDS.map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="border border-border/60 bg-card shadow-sm rounded-2xl">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                    <p className={`text-3xl font-extrabold font-display ${color}`}>{value}</p>
                  </div>
                  <div className={`${bg} ${color} p-3 rounded-xl`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Link to="/staff/doctor/queue">
            <Card className="border border-border/60 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="bg-amber-500/15 p-3 rounded-xl text-amber-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Patient Queue</p>
                  <p className="text-xs text-muted-foreground">Waiting & checked-in patients</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/staff/patients">
            <Card className="border border-border/60 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="bg-primary/15 p-3 rounded-xl text-primary">
                  <ListChecks className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Patient Records</p>
                  <p className="text-xs text-muted-foreground">Search all patients by MRN</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <DoctorNotificationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          request={incomingRequest}
        />
      </StaffLayout>
    </StaffGuard>
  );
}
