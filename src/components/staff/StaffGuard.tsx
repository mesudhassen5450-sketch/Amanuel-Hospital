import { type ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useStaffAuth } from "@/lib/staff-auth";
import {
  getStaffDashboardPath,
  isRoleAllowed,
  normalizeStaffRole,
} from "@/lib/staff-roles";
import { Loader2 } from "lucide-react";

interface StaffGuardProps {
  children: ReactNode;
  /** Restrict to specific roles. If omitted, any authenticated user can access. */
  allowedRoles?: string[];
}

export function StaffGuard({ children, allowedRoles }: StaffGuardProps) {
  const { isAuthenticated, hydrated, user } = useStaffAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
      if (pathname !== "/staff/login") {
        navigate({ to: "/staff/login", replace: true });
      }
      return;
    }

    const userRole = normalizeStaffRole(user?.role ?? null);
    if (!userRole) {
      if (pathname !== "/staff/login") {
        navigate({ to: "/staff/login", replace: true });
      }
      return;
    }

    if (!isRoleAllowed(userRole, allowedRoles)) {
      const target = getStaffDashboardPath(userRole);
      // Prevent redirect loop: only redirect if not already on the target
      if (pathname !== target && pathname !== "/staff/login") {
        navigate({ to: target, replace: true });
      }
    }
  }, [hydrated, isAuthenticated, user, allowedRoles, pathname, navigate]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading session...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const userRole = normalizeStaffRole(user?.role ?? null);
  if (!isRoleAllowed(userRole, allowedRoles)) return null;

  return <>{children}</>;
}
