import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { getMedicinesWithStock } from "@/lib/staff-server";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Search, RefreshCcw, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/pharmacy/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Dr. Amanuel Hospital" }] }),
  component: PharmacyInventoryPage,
});

function PharmacyInventoryPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getMedicinesWithStock();
        setMedicines(data as any[]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [refreshKey]);

  const filtered = medicines.filter(m => {
    const q = query.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.generic_name?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q)
    );
  });

  const stockLevel = (qty: number) => {
    if (qty === 0)   return { label: "Out of Stock", style: "bg-destructive/10 text-destructive border-destructive/20" };
    if (qty <= 10)   return { label: "Low Stock",    style: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    return               { label: "In Stock",     style: "bg-green-500/10 text-green-700 border-green-500/20" };
  };

  const outOfStock = medicines.filter(m => m.stock_quantity === 0).length;
  const lowStock   = medicines.filter(m => m.stock_quantity > 0 && m.stock_quantity <= 10).length;

  return (
    <StaffGuard allowedRoles={["pharmacy", "staff"]}>
      <StaffLayout>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" /> Medicine Inventory
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} medicines · {outOfStock > 0 && (
                <span className="text-destructive font-semibold">{outOfStock} out of stock</span>
              )}{outOfStock > 0 && lowStock > 0 && " · "}{lowStock > 0 && (
                <span className="text-amber-600 font-semibold">{lowStock} low stock</span>
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)} disabled={loading} className="gap-2 rounded-xl">
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Alert banners */}
        {outOfStock > 0 && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl mb-4">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {outOfStock} medicine(s) are completely out of stock.
          </div>
        )}

        <div className="relative mb-5">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, generic name, or category..."
            className="pl-10 rounded-xl h-11 border-input/60" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading inventory...
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border/60 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3">Generic Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.map(m => {
                    const { label, style } = stockLevel(m.stock_quantity ?? 0);
                    return (
                      <tr key={m.id} className={cn(
                        "hover:bg-secondary/10 transition-colors",
                        m.stock_quantity === 0 && "bg-destructive/5"
                      )}>
                        <td className="px-4 py-3 font-semibold text-foreground">{m.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.generic_name ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.category ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">{m.unit}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "font-bold text-base",
                            m.stock_quantity === 0 ? "text-destructive" :
                            m.stock_quantity <= 10 ? "text-amber-600" : "text-green-700"
                          )}>
                            {m.stock_quantity ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn("rounded-full border text-xs font-semibold px-2.5", style)}>
                            {label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">No medicines found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </StaffLayout>
    </StaffGuard>
  );
}
