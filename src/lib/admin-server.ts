import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (uses env vars available at build/runtime)
function getSupabase() {
  const url = process.env["VITE_SUPABASE_URL"] ?? import.meta.env?.["VITE_SUPABASE_URL"];
  const key = process.env["VITE_SUPABASE_ANON_KEY"] ?? import.meta.env?.["VITE_SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("Supabase env vars not set on server.");
  return createClient(url, key);
}

// ── Auth check ────────────────────────────────────────────────────────────────
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "4321";

function checkAuth(username: string, password: string) {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error("Unauthorized access: Invalid username or password.");
  }
}

// ── Get all appointments ──────────────────────────────────────────────────────
export const getAdminBookings = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    checkAuth(data.username, data.password);
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
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
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
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

// ── addBookingServer kept for backwards compat (no-op now, booking.tsx uses supabase directly) ──
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
  // pending booking — differentiate cash vs online
  return "Waiting for Payment";
}
