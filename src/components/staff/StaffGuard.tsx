import { type ReactNode, useEffect } from "react";
import { useStaffAuth } from "@/lib/staff-auth";
import { Loader2 } from "lucide-react";

export function StaffGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, hydrated } = useStaffAuth();

  useEffect(() => {
    // Only redirect AFTER client hydration — never during SSR
    if (hydrated && !isAuthenticated) {
      window.location.href = "/staff/login";
    }
  }, [hydrated, isAuthenticated]);

  // Still hydrating from sessionStorage — show spinner, don't redirect yet
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  // Hydrated but not logged in — redirect is firing via useEffect
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
