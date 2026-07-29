import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { getReceptionAppointments } from "@/lib/staff-server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/payments")({
  head: () => ({ meta: [{ title: "Payments — Dr. Amanuel Hospital" }] }),
  component: PaymentsPage,
});

const PAY_STYLE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  paid:    "bg-green-500/10 text-green-700 border-green-500/20",
  failed:  "bg-destructive/10 text-destructive border-destructive/20",
};

function PaymentsPage() {
  const [appts, setAppts]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]   = useState("");

  useEffect(() => {
    getReceptionAppointments({ data: {} })
      .then(d => { setAppts(d as any[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = appts.filter(a =>
    a.fullName.toLowerCase().includes(query.toLowerCase()) ||
    a.phone?.includes(query)
  );

  const totalPaid    = appts.filter(a => a.paymentStatus === "paid").reduce((s, a) => s + a.amount, 0);
  const totalPending = appts.filter(a => a.paymentStatus === "pending").reduce((s, a) => s + a.amount, 0);

  return (
    <StaffGuard>
      <StaffLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" /> Payment Records
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">All appointment payments</p>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border border-border/60 rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total Collected</p>
              <p className="text-3xl font-extrabold text-green-600 font-display">{totalPaid} ETB</p>
            </CardContent>
          </Card>
          <Card className="border border-border/60 rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-extrabold text-amber-500 font-display">{totalPending} ETB</p>
            </CardContent>
          </Card>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by patient name or phone..." className="pl-10 rounded-xl h-11 border-input/60" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading...
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border/60 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Visit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.map(a => (
                    <tr key={a.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{a.fullName}</p>
                        <p className="text-xs text-muted-foreground">{a.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.appointmentDate}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{a.paymentMethod}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{a.amount} ETB</td>
                      <td className="px-4 py-3">
                        <Badge className={cn("rounded-full border text-xs font-semibold px-2.5", PAY_STYLE[a.paymentStatus] ?? PAY_STYLE.pending)}>
                          {a.paymentStatus ?? "pending"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 capitalize text-muted-foreground text-xs">{a.visitStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </StaffLayout>
    </StaffGuard>
  );
}
