import { supabase } from "./supabase";

export const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  process.env.VAPID_PUBLIC_KEY ||
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BJmIqjg7gYIMO9w2Nxe8P8IixCy-TeW2__ke8gr_jePXim4q4U7DV_f7fxlUWrrAeTZEeLAr7wtqKGdQjUw0Eq4";

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("Service workers are not supported in this browser.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    console.log("Service Worker registered successfully:", registration);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

export async function subscribeUserToPush(
  userId?: string,
  userRole: string = "patient"
): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    alert("Desktop notifications are not supported by your browser.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission denied. Please allow notifications in browser settings.");
      return null;
    }

    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = (await registerServiceWorker()) || undefined;
    }

    if (!registration) {
      throw new Error("Unable to obtain Service Worker registration.");
    }

    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as any,
      });
    }

    const subJson = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = subJson.keys?.p256dh || "";
    const auth = subJson.keys?.auth || "";

    // Save to Supabase push_subscriptions table
    try {
      const activeUserId = userId || localStorage.getItem("patient_mrn") || localStorage.getItem("staff_session") || "guest";
      
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: activeUserId,
          endpoint: endpoint,
          p256dh: p256dh,
          auth: auth,
          role: userRole,
          subscription_json: JSON.stringify(subJson),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "endpoint" }
      );

      if (error) {
        console.warn("Could not save push subscription to Supabase:", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase push_subscriptions insert error:", dbErr);
    }

    localStorage.setItem("push_subscribed", "true");
    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    alert("Failed to enable desktop notifications. Please check browser settings.");
    return null;
  }
}

export async function unsubscribeUserFromPush(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        localStorage.removeItem("push_subscribed");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    return false;
  }
}

export async function getSubscriptionStatus(): Promise<{
  isSupported: boolean;
  permission: NotificationPermission | "unsupported";
  isSubscribed: boolean;
}> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return { isSupported: false, permission: "unsupported", isSubscribed: false };
  }

  const permission = Notification.permission;
  let isSubscribed = false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      isSubscribed = !!subscription;
    }
  } catch (err) {
    console.error("Error checking push status:", err);
  }

  return { isSupported: true, permission, isSubscribed };
}
