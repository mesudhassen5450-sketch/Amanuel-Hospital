import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Users, DollarSign, Clock, CheckCircle2, Search, Filter, LogOut, Lock, 
  Trash2, XCircle, FileSpreadsheet, Key, Stethoscope, Landmark 
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAdminBookings, updateBookingStatusServer, deleteBookingServer } from "@/lib/admin-server";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Cashier Portal & Admin Dashboard — Dr. Amanuel Hospital" },
      { name: "description", content: "Secure administration panel for Dr. Amanuel Hospital cashiers and administrative staff." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Dashboard data states
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const loadData = async (pass: string) => {
    setRefreshing(true);
    try {
      const data = await getAdminBookings({ data: { passcode: pass } });
      // Sort bookings by creation date descending
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(sorted);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_passcode", pass);
    } catch (err: any) {
      toast.error(err.message || "Invalid passcode or connection failed.");
      sessionStorage.removeItem("admin_passcode");
    } finally {
      setRefreshing(false);
    }
  };

  // Check for stored passcode on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_passcode");
    if (stored) {
      setPassword(stored);
      loadData(stored);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter the cashier passcode.");
      return;
    }
    loadData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_passcode");
    setIsAuthenticated(false);
    setPassword("");
    setBookings([]);
    toast.info("Logged out successfully.");
  };

  // Action handlers
  const handleConfirmPayment = async (id: string) => {
    try {
      toast.loading("Confirming payment...", { id });
      const result = await updateBookingStatusServer({ data: { id, status: "Paid & Confirmed" } });
      if (result) {
        toast.success("Payment confirmed successfully!", { id });
        loadData(password);
      } else {
        toast.error("Failed to update status.", { id });
      }
    } catch (err) {
      toast.error("An error occurred.", { id });
      console.error(err);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      toast.loading("Canceling booking...", { id });
      const result = await updateBookingStatusServer({ data: { id, status: "Cancelled" } });
      if (result) {
        toast.success("Booking cancelled successfully.", { id });
        loadData(password);
      } else {
        toast.error("Failed to cancel booking.", { id });
      }
    } catch (err) {
      toast.error("An error occurred.", { id });
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking record?")) return;
    try {
      toast.loading("Deleting record...", { id });
      const result = await deleteBookingServer({ data: { id } });
      if (result) {
        toast.success("Booking record deleted.", { id });
        loadData(password);
      } else {
        toast.error("Failed to delete record.", { id });
      }
    } catch (err) {
      toast.error("An error occurred.", { id });
      console.error(err);
    }
  };

  // Calculations for stats
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(b => b.status === "Paid & Confirmed")
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingCashCount = bookings
    .filter(b => b.paymentMethod === "Cash" && b.status === "Waiting for Payment")
    .length;
  const confirmedCount = bookings
    .filter(b => b.status === "Paid & Confirmed")
    .length;

  // Filtered List
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phoneNumber.includes(searchQuery) ||
      (b.txRef && b.txRef.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesMethod = methodFilter === "all" || b.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <SiteLayout>
      {!isAuthenticated ? (
        // Login Screen
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border border-border bg-card/60 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
            <div className="h-2 bg-gradient-to-r from-primary via-indigo-500 to-primary-glow" />
            <CardHeader className="text-center pt-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Lock className="h-10 w-10" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold font-display">Cashier Portal Access</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-2">
                Enter the administration passcode to view and manage hospital appointments.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-passcode" className="font-semibold text-foreground flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-primary" />
                    Staff Passcode
                  </Label>
                  <Input 
                    id="admin-passcode" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin/cashier passcode"
                    className="rounded-xl h-11 border-input/60 focus-visible:ring-primary text-center tracking-widest text-lg"
                  />
                </div>
              </CardContent>
              <CardFooter className="pb-8 pt-4">
                <Button type="submit" className="w-full rounded-xl h-11 font-semibold shadow-md">
                  Authenticate Portal
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      ) : (
        // Dashboard
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display">Cashier & Reception Portal</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage local cash receipts and live Chapa online appointments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button onClick={() => loadData(password)} disabled={refreshing} variant="outline" className="rounded-xl flex-1 sm:flex-initial gap-1.5">
                <RefreshCw className={`h-4 w-4 ${refreshing && "animate-spin"}`} />
                Refresh
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="rounded-xl flex-1 sm:flex-initial gap-1.5">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Total Bookings */}
            <Card className="border border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden hover-lift">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-extrabold text-foreground font-display">{totalBookings}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Confirmed Revenue */}
            <Card className="border border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden hover-lift">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid Revenue</p>
                  <p className="text-3xl font-extrabold text-success font-display">{totalRevenue} ETB</p>
                </div>
                <div className="bg-success/10 p-3 rounded-xl text-success">
                  <DollarSign className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Cash Pending */}
            <Card className="border border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden hover-lift">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cash Pending</p>
                  <p className="text-3xl font-extrabold text-amber-500 font-display">{pendingCashCount}</p>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
                  <Clock className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Paid Appointments */}
            <Card className="border border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden hover-lift">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirmed Visits</p>
                  <p className="text-3xl font-extrabold text-indigo-500 font-display">{confirmedCount}</p>
                </div>
                <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter Bar */}
          <Card className="border border-border/60 bg-card shadow-sm rounded-2xl p-5">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by patient name, phone, or transaction reference..."
                  className="pl-10 rounded-xl h-11 border-input/60 focus-visible:ring-primary"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
                <div className="flex items-center gap-2 border border-input/60 rounded-xl px-3 py-2 bg-background min-w-[150px]">
                  <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs font-semibold bg-transparent border-none outline-none cursor-pointer text-foreground"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Paid & Confirmed">Paid & Confirmed</option>
                    <option value="Waiting for Payment">Waiting for Payment</option>
                    <option value="Pending Checkout">Pending Checkout</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 border border-input/60 rounded-xl px-3 py-2 bg-background min-w-[150px]">
                  <Landmark className="h-4 w-4 text-muted-foreground shrink-0" />
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="w-full text-xs font-semibold bg-transparent border-none outline-none cursor-pointer text-foreground"
                  >
                    <option value="all">All Payments</option>
                    <option value="Telebirr">Telebirr</option>
                    <option value="CBE Birr">CBE Birr</option>
                    <option value="Card / Other">Card / Cards</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

            </div>
          </Card>

          {/* Bookings Table */}
          <Card className="border border-border/60 bg-card shadow-md rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border/60 text-muted-foreground font-semibold">
                    <th className="p-4">Reference ID</th>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => {
                      const isCashWaiting = b.paymentMethod === "Cash" && b.status === "Waiting for Payment";
                      const canCancel = b.status !== "Cancelled" && b.status !== "Paid & Confirmed";
                      
                      return (
                        <tr key={b.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-mono text-xs text-muted-foreground max-w-[120px] truncate" title={b.id}>
                            {b.id}
                          </td>
                          <td className="p-4 font-semibold text-foreground">{b.fullName}</td>
                          <td className="p-4">{b.phoneNumber}</td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{b.appointmentDate}</span>
                              <span className="text-xs text-muted-foreground">{b.appointmentTime}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="flex items-center gap-1">
                              {b.paymentMethod === "Telebirr" && "📱 Telebirr"}
                              {b.paymentMethod === "CBE Birr" && "🏦 CBE Birr"}
                              {b.paymentMethod === "Card / Other" && "💳 Card/Other"}
                              {b.paymentMethod === "Cash" && "💵 Cash"}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-foreground">{b.amount} ETB</td>
                          <td className="p-4">
                            <Badge className={cn(
                              "rounded-full px-2.5 py-0.5 font-semibold text-xs border",
                              b.status === "Paid & Confirmed" && "bg-success/10 text-success border-success/20 hover:bg-success/15",
                              b.status === "Waiting for Payment" && "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15",
                              b.status === "Pending Checkout" && "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/15",
                              b.status === "Cancelled" && "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
                            )}>
                              {b.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isCashWaiting && (
                                <Button
                                  onClick={() => handleConfirmPayment(b.id)}
                                  size="sm"
                                  className="h-8 rounded-lg bg-success hover:bg-success/90 text-success-foreground text-xs font-semibold px-2.5"
                                  title="Confirm Cash Payment"
                                >
                                  Confirm Cash
                                </Button>
                              )}
                              {canCancel && (
                                <Button
                                  onClick={() => handleCancelBooking(b.id)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/5 hover:border-destructive text-xs px-2"
                                  title="Cancel Appointment"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                onClick={() => handleDeleteBooking(b.id)}
                                size="sm"
                                variant="ghost"
                                className="h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs px-2"
                                title="Delete Record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No appointments found matching the search/filter options.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      )}
    </SiteLayout>
  );
}

// Inline Loader component helper
function RefreshCw({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-refresh-cw", className)}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
