import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { StaffGuard } from "@/components/staff/StaffGuard";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Dr. Amanuel Hospital" },
      { name: "description", content: "Secure administration panel for Dr. Amanuel Hospital." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  useEffect(() => {
    window.location.replace("/staff/admin");
  }, []);

  return (
    <StaffGuard allowedRoles={["admin"]}>
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm font-medium">Loading Admin Dashboard...</span>
      </div>
    </StaffGuard>
  );
}
