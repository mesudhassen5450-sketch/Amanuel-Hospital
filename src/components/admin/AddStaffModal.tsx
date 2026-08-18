import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createStaffAccount } from "@/lib/staff-server";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  callerRole?: string;
}

export function AddStaffModal({ isOpen, onClose, onSuccess, callerRole }: AddStaffModalProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "staff",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.displayName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await createStaffAccount({
        data: {
          username: formData.username.trim(),
          password: formData.password,
          role: formData.role,
          displayName: formData.displayName.trim(),
          isActive: formData.isActive,
          callerRole: callerRole,
        },
      });
      toast.success("Staff account created successfully");
      // Reset form
      setFormData({
        displayName: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "staff",
        isActive: true,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create staff account");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        displayName: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "staff",
        isActive: true,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <UserPlus className="h-5 w-5 text-primary" />
            Create Staff Account
          </DialogTitle>
          <DialogDescription className="text-xs">
            Add a new staff member to the hospital system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="text-xs font-semibold">
              Full Name *
            </Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Enter staff member's full name"
              className="rounded-xl"
              disabled={loading}
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-semibold">
              Username *
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
              placeholder="Enter username (lowercase)"
              className="rounded-xl font-mono text-sm"
              disabled={loading}
            />
            <p className="text-[11px] text-muted-foreground">
              Username must be at least 3 characters and will be stored in lowercase.
            </p>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold">
              Role *
            </Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold outline-none"
              disabled={loading}
            >
              <option value="staff">Staff</option>
              <option value="reception">Reception</option>
              <option value="cashier">Cashier</option>
              <option value="doctor">Doctor</option>
              <option value="laboratory">Laboratory</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password (min 6 characters)"
              className="rounded-xl"
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">
              Confirm Password *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
              className="rounded-xl"
              disabled={loading}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              disabled={loading}
            />
            <Label htmlFor="isActive" className="text-xs cursor-pointer font-medium">
              Active Account (Allowed to sign in)
            </Label>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl text-xs"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl text-xs font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
