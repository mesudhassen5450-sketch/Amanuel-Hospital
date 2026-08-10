import webpush from "web-push";
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const vapidPublicKey =
  process.env.VAPID_PUBLIC_KEY ||
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  process.env.VITE_VAPID_PUBLIC_KEY ||
  "BJmIqjg7gYIMO9w2Nxe8P8IixCy-TeW2__ke8gr_jePXim4q4U7DV_f7fxlUWrrAeTZEeLAr7wtqKGdQjUw0Eq4";
const vapidPrivateKey =
  process.env.VAPID_PRIVATE_KEY || "Cona5jgP20YmhzGxONmshDgsrh0rQt34tR04THPBQWI";
const vapidSubject =
  process.env.VAPID_SUBJECT || "mailto:support@amanuelhospital.com";

if (vapidPublicKey && vapidPrivateKey) {
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  } catch (err) {
    console.error("VAPID config error:", err);
  }
}

export async function sendPushToUser(
  subscription: any,
  payload: { title: string; body: string; url?: string; icon?: string }
) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error("Web Push delivery error:", error);
    return false;
  }
}

export async function sendPushToUserIdOrRole(
  userId?: string,
  role?: string,
  payload?: { title: string; body: string; url?: string; icon?: string }
) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing for sendPushToUserIdOrRole");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    let query = supabase.from("push_subscriptions").select("*");
    if (userId && userId !== "all") {
      query = query.eq("user_id", userId);
    } else if (role && role !== "all") {
      query = query.eq("role", role);
    }

    const { data: subs, error } = await query;
    if (error || !subs || subs.length === 0) {
      console.log(`No active push subscriptions found for user_id=${userId}, role=${role}`);
      return;
    }

    const defaultPayload = payload || {
      title: "Amanuel Hospital Alert",
      body: "You have a new update in Amanuel Hospital Portal.",
      url: "/",
    };

    for (const subRecord of subs) {
      let subObj = null;
      if (subRecord.subscription_json) {
        try {
          subObj =
            typeof subRecord.subscription_json === "string"
              ? JSON.parse(subRecord.subscription_json)
              : subRecord.subscription_json;
        } catch {}
      }
      if (!subObj && subRecord.endpoint && subRecord.p256dh && subRecord.auth) {
        subObj = {
          endpoint: subRecord.endpoint,
          keys: {
            p256dh: subRecord.p256dh,
            auth: subRecord.auth,
          },
        };
      }

      if (subObj) {
        await sendPushToUser(subObj, defaultPayload);
      }
    }
  } catch (err) {
    console.error("Error sending push notifications:", err);
  }
}

export const Route = createFileRoute("/api/send-push")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const { subscription, userId, role, title, body: msgBody, url, icon } = body;

          const payload = {
            title: title || "Amanuel Hospital Notification",
            body: msgBody || "You have a new alert in your portal.",
            url: url || "/",
            icon: icon || "/favicon.ico",
          };

          if (subscription) {
            await sendPushToUser(subscription, payload);
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          await sendPushToUserIdOrRole(userId, role, payload);
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("send-push handler error:", error);
          return new Response(
            JSON.stringify({ error: error?.message || "Failed to send push notification" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
