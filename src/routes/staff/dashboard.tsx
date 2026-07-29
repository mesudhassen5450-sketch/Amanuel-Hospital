import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { useStaffAuth } from "@/lib/staff-auth";
import { getDashboardStats } from "@/lib/staff-server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Clock, CheckCircle2, CreditCard, BadgeCheck, Loader2, RefreshCcw, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/dashboard")({
  head: () => ({ meta: [{ title: "Reception Dashboard — Dr. Amanuel Hospital" }] }),
  component: DashboardPage,
});

interface Stats {
  todayAppointments: number;
  todayRegistered: number;
  waiting: number;
  checkedIn: number;
  completed: number;
  pendingPayment: number;
  paidPayment: number;
}

function DashboardPage() {
  const { user } = useStaffAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const s = await getDashboardStats();
      setStats(s as Stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const STAT_CARDS = stats ? [
    { label: "Today's Appointments", value: stats.todayAppointments, icon: CalendarDays,  color: "text-primary",    bg: "bg-primary/10" },
    { label: "Registered Today",     value: stats.todayRegistered,   icon: UserPlus,     color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Waiting",              value: stats.waiting,           icon: Clock,        color: "text-amber-500",   bg: "bg-amber-500/10" },
    { label: "Checked In",           value: stats.checkedIn,         icon: BadgeCheck,   color: "text-blue-500",    bg: "bg-blue-500/10" },
    { label: "Completed",            value: stats.completed,         icon: CheckCircle2, color: "text-green-600",   bg: "bg-green-500/10" },
    { label: "Pending Payment",      value: stats.pendingPayment,    icon: CreditCard,   color: "text-orange-500",  bg: "bg-orange-500/10" },
    { label: "Paid",                 value: stats.paidPayment,       icon: BadgeCheck,   color: "text-teal-500",    bg: "bg-teal-500/10" },
  ] : [];

  return (
    <StaffGuard>
      <StaffLayout>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
              Reception Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, <span className="font-semibold capitalize text-primary">{user?.username}</span> ·{" "}
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2 rounded-xl">
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading stats...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="border border-border/60 bg-card shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                    <p className={`text-3xl font-extrabold font-display ${color}`}>{value}</p>
                  </div>
                  <div className={`${bg} p-3 rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/staff/patients/new">
            <Card className="border border-border/60 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="bg-primary/15 p-3 rounded-xl text-primary">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Register Patient</p>
                  <p className="text-xs text-muted-foreground">New patient + MRN</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/staff/appointments">
            <Card className="border border-border/60 bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="bg-blue-500/15 p-3 rounded-xl text-blue-500">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Today's Appointments</p>
                  <p className="text-xs text-muted-foreground">Check in & manage</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/staff/patients">
            <Card className="border border-border/60 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="bg-emerald-500/15 p-3 rounded-xl text-emerald-500">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Patient List</p>
                  <p className="text-xs text-muted-foreground">Search & view records</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </StaffLayout>
    </StaffGuard>
  );
}
