import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { useStaffAuth } from "@/lib/staff-auth";
import { getPharmacyStats } from "@/lib/staff-server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, CheckCircle2, Package, Clock, Loader2, RefreshCcw, XCircle } from "lucide-react";

export const Route = createFileRoute("/staff/pharmacy/dashboard")({
  head: () => ({ meta: [{ title: "Pharmacy Dashboard — Dr. Amanuel Hospital" }] }),
  component: PharmacyDashboardPage,
});

function PharmacyDashboardPage() {
  const { user } = useStaffAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setStats(await getPharmacyStats()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const CARDS = stats ? [
    { label: "Pending",   value: stats.pending,   icon: Clock,         color: "text-amber-500",  bg: "bg-amber-500/10" },
    { label: "Ready",     value: stats.ready,     icon: Pill,          color: "text-blue-500",   bg: "bg-blue-500/10" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2,  color: "text-green-600",  bg: "bg-green-500/10" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle,       color: "text-destructive", bg: "bg-destructive/10" },
  ] : [];

  return (
    <StaffGuard allowedRoles={["pharmacy", "staff"]}>
      <StaffLayout>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display flex items-center gap-2">
              <Pill className="h-7 w-7 text-primary" /> Pharmacy Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome, <span className="font-semibold capitalize text-primary">{user?.username}</span>
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
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {CARDS.map(({ label, value, icon: Icon, color, bg }) => (
                <Card key={label} className="border border-border/60 rounded-2xl shadow-sm">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                      <p className={`text-3xl font-extrabold font-display ${color}`}>{value}</p>
                    </div>
                    <div className={`${bg} ${color} p-3 rounded-xl`}><Icon className="h-5 w-5" /></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <Link to="/staff/pharmacy/prescriptions">
                <Card className="border border-border/60 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer rounded-2xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="bg-amber-500/15 p-3 rounded-xl text-amber-500"><Pill className="h-6 w-6" /></div>
                    <div>
                      <p className="font-semibold text-foreground">Prescriptions</p>
                      <p className="text-xs text-muted-foreground">Pending & dispense</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/staff/pharmacy/dispensed">
                <Card className="border border-border/60 bg-green-500/5 hover:bg-green-500/10 transition-colors cursor-pointer rounded-2xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="bg-green-500/15 p-3 rounded-xl text-green-600"><CheckCircle2 className="h-6 w-6" /></div>
                    <div>
                      <p className="font-semibold text-foreground">Dispensed</p>
                      <p className="text-xs text-muted-foreground">History</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/staff/pharmacy/inventory">
                <Card className="border border-border/60 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer rounded-2xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="bg-primary/15 p-3 rounded-xl text-primary"><Package className="h-6 w-6" /></div>
                    <div>
                      <p className="font-semibold text-foreground">Inventory</p>
                      <p className="text-xs text-muted-foreground">Medicine stock</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        )}
      </StaffLayout>
    </StaffGuard>
  );
}
