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

  // Prevent browser from caching this page so back-button shows login instead
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "Cache-Control");
    meta.setAttribute("content", "no-store, no-cache, must-revalidate");
    document.head.appendChild(meta);

    const pragma = document.createElement("meta");
    pragma.setAttribute("http-equiv", "Pragma");
    pragma.setAttribute("content", "no-cache");
    document.head.appendChild(pragma);

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(pragma);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      window.location.replace("/staff/login");
      return;
    }

    // Role check — redirect to their own portal/dashboard
    const userRole = user?.role ? (user.role as string).toLowerCase() : null;
    const normalizedAllowed = allowedRoles?.map(r => r.toLowerCase());

    if (normalizedAllowed && userRole && !normalizedAllowed.includes(userRole)) {
      if (userRole === "admin") window.location.replace("/staff/admin");
      else if (userRole === "cashier") window.location.replace("/staff/payments");
      else if (userRole === "doctor") window.location.replace("/staff/doctor/dashboard");
      else if (userRole === "laboratory") window.location.replace("/staff/laboratory/dashboard");
      else if (userRole === "pharmacy") window.location.replace("/staff/pharmacy/dashboard");
      else if (userRole === "reception" || userRole === "staff") {
        if (window.location.pathname !== "/staff/dashboard") {
          window.location.replace("/staff/dashboard");
        }
      } else {
        window.location.replace("/staff/login");
      }
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
  const activeRole = user?.role ? (user.role as string).toLowerCase() : null;
  const allowedNorm = allowedRoles?.map(r => r.toLowerCase());
  if (allowedNorm && activeRole && !allowedNorm.includes(activeRole)) return null;

  return <>{children}</>;
}