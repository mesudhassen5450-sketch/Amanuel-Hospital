import { type ReactNode, useEffect } from "react";
import { useStaffAuth } from "@/lib/staff-auth";
import { Loader2 } from "lucide-react";

interface StaffGuardProps {
  children: ReactNode;
  /** Restrict to specific roles. If omitted, any authenticated user can access. */
  allowedRoles?: string[];
}

export function StaffGuard({ children, allowedRoles }: StaffGuardProps) {
  const { isAuthenticated, hydrated, user } = useStaffAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      window.location.href = "/staff/login";
      return;
    }
    // Role check
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
      // Redirect to their home dashboard
      if (user.role === "doctor")          window.location.href = "/staff/doctor/dashboard";
      else if (user.role === "laboratory") window.location.href = "/staff/laboratory/dashboard";
      else if (user.role === "pharmacy")   window.location.href = "/staff/pharmacy/dashboard";
      else                                 window.location.href = "/staff/dashboard";
    }
  }, [hydrated, isAuthenticated, user, allowedRoles]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
