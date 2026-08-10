import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, BellOff, X } from "lucide-react";
import {
  getSubscriptionStatus,
  subscribeUserToPush,
} from "@/lib/pushNotifications";
import { toast } from "sonner";

interface NotificationPermissionBannerProps {
  userId?: string;
  userRole?: string;
  className?: string;
  compact?: boolean;
}

export function NotificationPermissionBanner({
  userId,
  userRole = "patient",
  className = "",
  compact = false,
}: NotificationPermissionBannerProps) {
  const [status, setStatus] = useState<{
    isSupported: boolean;
    permission: NotificationPermission | "unsupported";
    isSubscribed: boolean;
  }>({
    isSupported: true,
    permission: "default",
    isSubscribed: false,
  });
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const checkStatus = async () => {
    const res = await getSubscriptionStatus();
    setStatus(res);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const sub = await subscribeUserToPush(userId, userRole);
      if (sub) {
        toast.success("Desktop Push Notifications enabled!");
        await checkStatus();
      }
    } catch (err) {
      console.error("Enable push error:", err);
      toast.error("Failed to enable push notifications.");
    } finally {
      setLoading(false);
    }
  };

  if (!status.isSupported || dismissed) return null;

  if (status.isSubscribed || status.permission === "granted") {
    if (compact) {
      return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 ${className}`}>
          <BellRing className="h-3.5 w-3.5" />
          <span>Desktop Alerts Active</span>
        </div>
      );
    }

    return (
      <div className={`bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between gap-4 text-emerald-700 text-xs ${className}`}>
        <div className="flex items-center gap-2.5">
          <BellRing className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Desktop push notifications are active for incoming consultation & appointment alerts.</span>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={handleEnable}
        className={`gap-2 text-xs border-primary/40 text-primary hover:bg-primary/10 rounded-full ${className}`}
      >
        <Bell className="h-3.5 w-3.5" />
        {loading ? "Enabling..." : "Enable Desktop Alerts"}
      </Button>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/15 rounded-lg text-primary shrink-0 mt-0.5 sm:mt-0">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Enable Desktop Push Notifications</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get instant native OS alerts for incoming video call requests, appointment updates, and doctor responses even when your browser tab is minimized.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button
          size="sm"
          disabled={loading}
          onClick={handleEnable}
          className="gap-2 text-xs rounded-xl shadow-xs"
        >
          <Bell className="h-4 w-4" />
          {loading ? "Enabling..." : "Enable Notifications"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDismissed(true)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
