import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useStaffAuth, getStaffRole } from "@/lib/staff-auth";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { StaffGuard } from "@/components/staff/StaffGuard";
import {
  getAllStaffAccounts,
  toggleStaffStatus,
} from "@/lib/staff-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  Key,
  Power,
  Loader2,
  Shield,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/staff-accounts")({
  head: () => ({
    meta: [{ title: "Staff Accounts — Dr. Amanuel Hospital" }],
  }),
  component: StaffAccountsPage,
});

function StaffAccountsPage() {
  const { user } = useStaffAuth();
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
  
  // Selected staff account
  const [selectedStaff, setSelectedStaff] = useState<StaffAccount | null>(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    username: "",
    displayName: "",
    role: "",
    isActive: true,
  });
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch staff accounts
  const fetchStaffAccounts = async () => {
    try {
      setLoading(true);
      const role = user?.role || getStaffRole();
      const res = await getAllStaffAccounts({ data: { callerRole: role as string | undefined } });
      let list: StaffAccount[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (res && typeof res === "object") {
        if (Array.isArray((res as any).result)) list = (res as any).result;
        else if (Array.isArray((res as any).data)) list = (res as any).data;
      }
      setStaffAccounts(list);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to fetch staff accounts";
      if (errorMessage.includes("permission") || errorMessage.includes("403") || errorMessage.includes("401")) {
        console.warn("Permission denied accessing staff accounts:", errorMessage);
        toast.error("You don't have permission to access staff accounts");
      } else {
        toast.error(errorMessage);
      }
      setStaffAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAccounts();
  }, [user]);

  // Filter staff accounts
  const filteredStaff = staffAccounts.filter(
    (staff) =>
      staff.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // View staff account
  const handleView = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setViewDialogOpen(true);
  };

  // Edit staff account
  const handleEdit = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setEditForm({
      username: staff.username,
      displayName: staff.display_name || "",
      role: staff.role,
      isActive: staff.is_active,
    });
    setEditDialogOpen(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!selectedStaff) return;

    try {
      setFormLoading(true);
      const { updateStaffAccount } = await import("@/lib/staff-server");
      await updateStaffAccount({
        data: {
          id: selectedStaff.id,
          username: editForm.username,
          role: editForm.role,
          displayName: editForm.displayName,
          isActive: editForm.isActive,
          callerRole: user?.role as string | undefined,
        },
      });
      toast.success("Staff account updated successfully");
      setEditDialogOpen(false);
      fetchStaffAccounts();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to update staff account";
      if (errorMessage.includes("permission") || errorMessage.includes("403") || errorMessage.includes("401")) {
        console.warn("Permission denied updating staff account:", errorMessage);
        toast.error("You don't have permission to update staff accounts");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setResetPasswordForm({ newPassword: "", confirmPassword: "" });
    setResetPasswordDialogOpen(true);
  };

  // Save password reset
  const handleSavePasswordReset = async () => {
    if (!selectedStaff) return;

    if (resetPasswordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setFormLoading(true);
      const { resetStaffPassword } = await import("@/lib/staff-server");
      await resetStaffPassword({
        data: {
          id: selectedStaff.id,
          newPassword: resetPasswordForm.newPassword,
          callerRole: user?.role as string | undefined,
        },
      });
      toast.success("Password reset successfully");
      setResetPasswordDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to reset password";
      if (errorMessage.includes("permission") || errorMessage.includes("403") || errorMessage.includes("401")) {
        console.warn("Permission denied resetting password:", errorMessage);
        toast.error("You don't have permission to reset passwords");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle status
  const handleToggleStatus = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setToggleStatusDialogOpen(true);
  };

  // Confirm toggle status
  const handleConfirmToggleStatus = async () => {
    if (!selectedStaff) return;

    try {
      setFormLoading(true);
      await toggleStaffStatus({
        data: { id: selectedStaff.id, callerRole: user?.role as string | undefined },
      });
      toast.success(
        `Staff account ${selectedStaff.is_active ? "deactivated" : "activated"} successfully`
      );
      setToggleStatusDialogOpen(false);
      fetchStaffAccounts();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to toggle status";
      if (errorMessage.includes("permission") || errorMessage.includes("403") || errorMessage.includes("401")) {
        console.warn("Permission denied toggling status:", errorMessage);
        toast.error("You don't have permission to toggle staff account status");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "doctor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "reception":
        return "bg-green-100 text-green-700 border-green-200";
      case "pharmacy":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "laboratory":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "cashier":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <StaffGuard allowedRoles={["admin"]}>
      <StaffLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Staff Accounts
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage hospital staff accounts and permissions
              </p>
            </div>
            <Link to="/staff/staff-accounts/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Staff Account
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, name, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Staff Account</TableHead>
                  <TableHead className="font-semibold">Username</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading staff accounts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No staff accounts found matching your search" : "No staff accounts found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{staff.display_name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{staff.username}</TableCell>
                      <TableCell>
                        <Badge className={cn("border", getRoleBadgeColor(staff.role))}>
                          {staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={staff.is_active ? "default" : "secondary"}
                          className={cn(
                            staff.is_active
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          )}
                        >
                          {staff.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(staff.created_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(staff.last_login)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(staff)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(staff)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleResetPassword(staff)}
                            className="h-8 w-8"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(staff)}
                            className={cn(
                              "h-8 w-8",
                              staff.is_active
                                ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                                : "text-green-600 hover:text-green-600 hover:bg-green-100"
                            )}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Staff Account Details
              </DialogTitle>
            </DialogHeader>
            {selectedStaff && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Full Name</Label>
                  <p className="font-medium">{selectedStaff.display_name || "—"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Username</Label>
                  <p className="font-medium">{selectedStaff.username}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Role</Label>
                  <Badge className={cn("border", getRoleBadgeColor(selectedStaff.role))}>
                    {selectedStaff.role}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Status</Label>
                  <Badge
                    variant={selectedStaff.is_active ? "default" : "secondary"}
                    className={cn(
                      "border",
                      selectedStaff.is_active
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    )}
                  >
                    {selectedStaff.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created
                  </Label>
                  <p className="font-medium">{formatDate(selectedStaff.created_at)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Last Login
                  </Label>
                  <p className="font-medium">{formatDate(selectedStaff.last_login)}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Staff Account
              </DialogTitle>
              <DialogDescription>
                Update staff account information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-displayName">Full Name</Label>
                <Input
                  id="edit-displayName"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="reception">Reception</option>
                  <option value="cashier">Cashier</option>
                  <option value="doctor">Doctor</option>
                  <option value="laboratory">Laboratory</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-isActive" className="cursor-pointer">
                  Active Account
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Reset Password
              </DialogTitle>
              <DialogDescription>
                Reset password for {selectedStaff?.display_name || selectedStaff?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={resetPasswordForm.newPassword}
                  onChange={(e) =>
                    setResetPasswordForm({ ...resetPasswordForm, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={resetPasswordForm.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordForm({ ...resetPasswordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePasswordReset} disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Toggle Status Dialog */}
        <AlertDialog open={toggleStatusDialogOpen} onOpenChange={setToggleStatusDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Power className="h-5 w-5 text-primary" />
                {selectedStaff?.is_active ? "Deactivate" : "Activate"} Account
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {selectedStaff?.is_active ? "deactivate" : "activate"} the account
                for {selectedStaff?.display_name || selectedStaff?.username}?
                {selectedStaff?.is_active &&
                  " This user will no longer be able to log in to the system."}
                {!selectedStaff?.is_active &&
                  " This user will be able to log in to the system again."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmToggleStatus} disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : selectedStaff?.is_active ? (
                  "Deactivate"
                ) : (
                  "Activate"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StaffLayout>
    </StaffGuard>
  );
}

type StaffAccount = {
  id: number;
  username: string;
  role: string;
  display_name: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};
