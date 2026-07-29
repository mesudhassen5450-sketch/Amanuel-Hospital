import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { getPatients } from "@/lib/staff-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Search, UserPlus, Loader2, Users, Eye } from "lucide-react";

export const Route = createFileRoute("/staff/patients/")({
  head: () => ({ meta: [{ title: "Patients — Dr. Amanuel Hospital" }] }),
  component: PatientsPage,
});

function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState("");

  useEffect(() => {
    getPatients().then(data => { setPatients(data as any[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(query.toLowerCase()) ||
    p.mrn.toLowerCase().includes(query.toLowerCase()) ||
    p.phone.includes(query)
  );

  return (
    <StaffGuard>
      <StaffLayout>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> Patient List
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{patients.length} patients registered</p>
          </div>
          <Link to="/staff/patients/new">
            <Button className="gap-2 rounded-xl shadow-sm">
              <UserPlus className="h-4 w-4" /> Register Patient
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, MRN, or phone..."
            className="pl-10 rounded-xl h-11 border-input/60"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading patients...
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border border-dashed border-border/60 rounded-2xl">
            <CardContent className="py-16 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No patients found</p>
              <p className="text-xs mt-1">Try a different search or register a new patient</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border/60 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">MRN</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">Date of Birth</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-mono text-xs bg-primary/5 border-primary/20 text-primary">
                          {p.mrn}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">{p.full_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.phone}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.gender ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.date_of_birth ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to="/staff/patients/$mrn" params={{ mrn: p.mrn }}>
                          <Button size="sm" variant="outline" className="gap-1.5 rounded-lg h-8 text-xs border-primary/30 text-primary hover:bg-primary/5">
                            <Eye className="h-3.5 w-3.5" /> View
                          </Button>
                        </Link>
                      </td>
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
