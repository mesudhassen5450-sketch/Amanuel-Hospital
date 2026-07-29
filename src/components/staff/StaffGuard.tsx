import { type ReactNode, useEffect } from "react";
import { useStaffAuth } from "@/lib/staff-auth";

export function StaffGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useStaffAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/staff/login";
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
