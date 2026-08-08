import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (uses env vars available at build/runtime)
function getSupabase() {
  const url = process.env["VITE_SUPABASE_URL"] ?? (typeof import.meta !== "undefined" ? (import.meta as any).env?.["VITE_SUPABASE_URL"] : undefined);
  const key = process.env["VITE_SUPABASE_ANON_KEY"] ?? (typeof import.meta !== "undefined" ? (import.meta as any).env?.["VITE_SUPABASE_ANON_KEY"] : undefined);
  if (!url || !key) throw new Error("Supabase env vars not set on server.");
  return createClient(url, key);
}

// ── Role Authorization Check ──────────────────────────────────────────────────
function checkRoleAuth(callerRole?: string) {
  if (!callerRole || !["admin", "reception", "cashier", "staff"].includes(callerRole)) {
    throw new Error("Unauthorized access: Administrative or Cashier privileges required.");
  }
}

// ── Get all appointments ──────────────────────────────────────────────────────
export const getAdminBookings = createServerFn({ method: "POST" })
  .validator((data: { callerRole?: string }) => data)
  .handler(async ({ data }) => {
    checkRoleAuth(data?.callerRole);
    const supabase = getSupabase();
    const { data: rows, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    // Normalise field names so admin.tsx UI works unchanged
    return (rows ?? []).map((r: any) => ({
      id: String(r.id),
      fullName: r.full_name,
      phoneNumber: r.phone,
      appointmentDate: r.appointment_date,
      appointmentTime: r.appointment_time,
      paymentMethod: normaliseMethod(r.payment_method),
      amount: r.amount,
      status: normaliseStatus(r.booking_status, r.payment_status),
      txRef: r.transaction_reference ?? undefined,
      paymentStatus: r.payment_status,
      createdAt: r.created_at,
    }));
  });

// ── Update booking status ─────────────────────────────────────────────────────
export const updateBookingStatusServer = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string; callerRole?: string }) => data)
  .handler(async ({ data }) => {
    checkRoleAuth(data?.callerRole);
    const supabase = getSupabase();
    const bookingStatus = data.status === "Paid & Confirmed" ? "confirmed" :
                          data.status === "Cancelled"        ? "cancelled"  : "pending";
    const paymentStatus = data.status === "Paid & Confirmed" ? "paid" :
                          data.status === "Cancelled"        ? "failed"      : "pending";
    const { error } = await supabase
      .from("appointments")
      .update({ booking_status: bookingStatus, payment_status: paymentStatus, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

// ── Delete booking ────────────────────────────────────────────────────────────
export const deleteBookingServer = createServerFn({ method: "POST" })
  .validator((data: { id: string; callerRole?: string }) => data)
  .handler(async ({ data }) => {
    checkRoleAuth(data?.callerRole);
    const supabase = getSupabase();
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

// ── addBookingServer kept for backwards compat ────────────────────────────────
export const addBookingServer = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async () => true);

// ── Helpers ───────────────────────────────────────────────────────────────────
function normaliseMethod(m: string): string {
  if (m === "telebirr")  return "Telebirr";
  if (m === "cbe_birr")  return "CBE Birr";
  if (m === "card")      return "Card / Other";
  return "Cash";
}

function normaliseStatus(bookingStatus: string, paymentStatus: string): string {
  if (bookingStatus === "confirmed" || paymentStatus === "paid") return "Paid & Confirmed";
  if (bookingStatus === "cancelled" || paymentStatus === "failed") return "Cancelled";
  return "Waiting for Payment";
}
