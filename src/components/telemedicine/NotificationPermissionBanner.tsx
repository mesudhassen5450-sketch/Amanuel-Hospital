import { useState, useEffect } from 'react';
import { BellRing, ShieldAlert } from 'lucide-react';

interface NotificationPermissionBannerProps {
  userId?: string;
  userRole?: string;
  compact?: boolean;
  className?: string;
}

export const NotificationPermissionBanner = ({ userId, userRole, compact = false, className = '' }: NotificationPermissionBannerProps) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  if (!('Notification' in window) || permission === 'granted') {
    return null;
  }

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  if (compact) {
    return (
      <button
        onClick={requestPermission}
        className={`flex items-center gap-1.5 px-2 py-1.5 bg-amber-100 dark:bg-amber-950/40 hover:bg-amber-200 dark:hover:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-lg shadow-sm transition-colors text-xs font-medium ${className}`}
      >
        <BellRing className="w-3.5 h-3.5" />
        Enable Alerts
      </button>
    );
  }

  return (
    <div className={`bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
          Enable browser notifications to receive sound and call alerts for incoming patient calls.
        </p>
      </div>
      <button
        onClick={requestPermission}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors whitespace-nowrap"
      >
        <BellRing className="w-3.5 h-3.5" />
        Enable Alerts
      </button>
    </div>
  );
};