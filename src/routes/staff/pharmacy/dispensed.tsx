import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { getPrescriptionsForPharmacy } from "@/lib/staff-server";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search, RefreshCcw, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/pharmacy/dispensed")({
  head: () => ({ meta: [{ title: "Dispensed — Dr. Amanuel Hospital" }] }),
  component: PharmacyDispensedPage,
});

function PharmacyDispensedPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [query, setQuery]                 = useState("");
  const [refreshKey, setRefreshKey]       = useState(0);
  const [expanded, setExpanded]           = useState<Set<number>>(new Set());

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getPrescriptionsForPharmacy({ data: { status: "Completed" } });
        setPrescriptions(data as any[]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [refreshKey]);

  const filtered = prescriptions.filter(p => {
    const q = query.toLowerCase();
    return (
      p.patients?.full_name?.toLowerCase().includes(q) ||
      p.patients?.mrn?.toLowerCase().includes(q)
    );
  });

  const toggle = (id: number) => {
    setExpanded(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  return (
    <StaffGuard allowedRoles={["pharmacy", "staff"]}>
      <StaffLayout>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" /> Dispensed Prescriptions
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} completed</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)} disabled={loading} className="gap-2 rounded-xl">
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by patient name or MRN..." className="pl-10 rounded-xl h-11 border-input/60" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading...
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border border-dashed border-border/60 rounded-2xl">
            <CardContent className="py-16 text-center text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No dispensed prescriptions yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => (
              <Card key={p.id} className="border border-border/60 rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-foreground">{p.patients?.full_name ?? "Unknown"}</p>
                        <Badge variant="outline" className="font-mono text-xs bg-primary/5 border-primary/20 text-primary">
                          {p.patients?.mrn ?? "—"}
                        </Badge>
                        <Badge className="rounded-full border text-xs font-semibold px-2.5 bg-green-600/10 text-green-700 border-green-600/20">
                          Completed
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Dr. {p.doctor_username} · {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg gap-1 px-3"
                      onClick={() => toggle(p.id)}>
                      {expanded.has(p.id) ? <><ChevronUp className="h-3.5 w-3.5" /> Hide</> : <><ChevronDown className="h-3.5 w-3.5" /> Details</>}
                    </Button>
                  </div>
                </CardHeader>
                {expanded.has(p.id) && (
                  <CardContent className="pt-0 pb-4 space-y-2">
                    {(p.prescription_items ?? []).map((item: any) => (
                      <div key={item.id} className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-secondary/20 rounded-xl px-4 py-3">
                        <div><p className="text-muted-foreground mb-0.5">Medicine</p><p className="font-semibold">{item.medicine_name_snapshot}</p></div>
                        <div><p className="text-muted-foreground mb-0.5">Dosage</p><p className="font-medium">{item.dosage}</p></div>
                        <div><p className="text-muted-foreground mb-0.5">Frequency · Duration</p><p className="font-medium">{item.frequency} · {item.duration}</p></div>
                        <div><p className="text-muted-foreground mb-0.5">Qty Dispensed</p><p className="font-medium text-green-700">{item.dispensed_quantity}</p></div>
                      </div>
                    ))}
                    {p.notes && <p className="text-xs text-muted-foreground italic px-1">Note: {p.notes}</p>}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </StaffLayout>
    </StaffGuard>
  );
}
