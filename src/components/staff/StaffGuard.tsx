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
    // Instruct the browser not to cache this page
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
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
      if (user.role === "admin")           window.location.replace("/staff/admin");
      else if (user.role === "cashier")    window.location.replace("/staff/payments");
      else if (user.role === "doctor")     window.location.replace("/staff/doctor/dashboard");
      else if (user.role === "laboratory") window.location.replace("/staff/laboratory/dashboard");
      else if (user.role === "pharmacy")   window.location.replace("/staff/pharmacy/dashboard");
      else                                 window.location.replace("/staff/dashboard");
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
