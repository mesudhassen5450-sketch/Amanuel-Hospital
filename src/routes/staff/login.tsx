import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useStaffAuth } from "@/lib/staff-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/staff/login")({
  head: () => ({
    meta: [{ title: "Staff Login — Dr. Amanuel Hospital" }],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const { login, isAuthenticated, hydrated } = useStaffAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Wait for hydration before checking auth
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      window.location.href = "/staff/dashboard";
    }
  }, [hydrated, isAuthenticated]);

  // Show spinner while hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError("Please enter both username and password."); return; }
    setLoading(true);
    const ok = login(username.trim().toLowerCase(), password);
    setLoading(false);
    if (ok) {
      window.location.href = "/staff/dashboard";
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Branding */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="bg-primary/15 border border-primary/20 p-4 rounded-2xl">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display">Dr. Amanuel Hospital</h1>
            <p className="text-sm text-muted-foreground mt-1">Staff Portal — Reception & Administration</p>
          </div>
        </div>

        {/* Login card */}
        <Card className="border border-border bg-card shadow-xl rounded-3xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-primary" />
          <CardHeader className="pt-7 pb-3 text-center">
            <CardTitle className="text-xl font-bold font-display flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Secure Staff Access
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Authorized hospital staff only
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6">
              {error && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="font-semibold flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" /> Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. reception"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="rounded-xl h-11 border-input/60 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-primary" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-xl h-11 border-input/60 focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-7 pt-2">
              <Button type="submit" disabled={loading} className="w-full rounded-xl h-11 font-semibold shadow-md">
                {loading ? "Authenticating..." : "Sign In to Portal"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          <a href="/" className="hover:text-primary underline underline-offset-4">← Back to hospital website</a>
        </p>
      </div>
    </div>
  );
}
