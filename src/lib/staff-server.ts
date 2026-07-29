import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env["VITE_SUPABASE_URL"] ?? import.meta.env?.["VITE_SUPABASE_URL"];
  const key = process.env["VITE_SUPABASE_ANON_KEY"] ?? import.meta.env?.["VITE_SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("Supabase env vars not set on server.");
  return createClient(url, key);
}

// ── MRN generation ────────────────────────────────────────────────────────────
export const generateMRN = createServerFn({ method: "POST" })
  .handler(async () => {
    const sb = getSupabase();
    const { data, error } = await sb.rpc("generate_mrn");
    if (error) throw new Error(error.message);
    return data as string;
  });

// ── Register patient ──────────────────────────────────────────────────────────
export const registerPatient = createServerFn({ method: "POST" })
  .validator((d: {
    full_name: string; phone: string; date_of_birth?: string; gender?: string;
    address?: string; emergency_contact_name?: string; emergency_contact_phone?: string;
    blood_group?: string; allergies?: string; chronic_conditions?: string; notes?: string;
  }) => d)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    // Generate MRN first
    const { data: mrn, error: mrnErr } = await sb.rpc("generate_mrn");
    if (mrnErr) throw new Error(mrnErr.message);

    const now = new Date().toISOString();
    const { data: patient, error } = await sb
      .from("patients")
      .insert({ ...data, mrn, created_at: now, updated_at: now })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return patient;
  });

// ── Update patient ────────────────────────────────────────────────────────────
export const updatePatient = createServerFn({ method: "POST" })
  .validator((d: { id: number; [key: string]: any }) => d)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { id, ...rest } = data;
    const { error } = await sb
      .from("patients")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  });

// ── Get all patients ──────────────────────────────────────────────────────────
export const getPatients = createServerFn({ method: "POST" })
  .handler(async () => {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("patients")
      .select("id,mrn,full_name,phone,gender,date_of_birth,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ── Get single patient by MRN ─────────────────────────────────────────────────
export const getPatientByMRN = createServerFn({ method: "POST" })
  .validator((d: { mrn: string }) => d)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { data: patient, error } = await sb
      .from("patients")
      .select("*")
      .eq("mrn", data.mrn)
      .single();
    if (error) throw new Error(error.message);
    return patient;
  });

// ── Get appointments for reception ───────────────────────────────────────────
export const getReceptionAppointments = createServerFn({ method: "POST" })
  .validator((d: { date?: string }) => d)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    let q = sb
      .from("appointments")
      .select("*, patients(id,mrn,full_name)")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: true });
    if (data.date) q = q.eq("appointment_date", data.date);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: any) => ({
      id:              String(r.id),
      fullName:        r.full_name,
      phone:           r.phone,
      appointmentDate: r.appointment_date,
      appointmentTime: r.appointment_time,
      paymentMethod:   r.payment_method,
      amount:          r.amount,
      bookingStatus:   r.booking_status,
      paymentStatus:   r.payment_status,
      visitStatus:     r.visit_status ?? "booked",
      patientId:       r.patient_id ?? null,
      patientMRN:      r.patients?.mrn ?? null,
      createdAt:       r.created_at,
    }));
  });

// ── Update visit status ───────────────────────────────────────────────────────
export const updateVisitStatus = createServerFn({ method: "POST" })
  .validator((d: { id: string; visitStatus: string }) => d)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { error } = await sb
      .from("appointments")
      .update({ visit_status: data.visitStatus, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

// ── Link appointment to patient ───────────────────────────────────────────────
export const linkAppointmentToPatient = createServerFn({ method: "POST" })
  .validator((d: { appointmentId: string; patientId: number }) => d)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { error } = await sb
      .from("appointments")
      .update({ patient_id: data.patientId, updated_at: new Date().toISOString() })
      .eq("id", data.appointmentId);
    if (error) throw new Error(error.message);
    return true;
  });

// ── Dashboard stats ───────────────────────────────────────────────────────────
export const getDashboardStats = createServerFn({ method: "POST" })
  .handler(async () => {
    const sb = getSupabase();
    const today = new Date().toISOString().split("T")[0];

    const [apptRes, patientsRes] = await Promise.all([
      sb.from("appointments").select("id,visit_status,payment_status,booking_status,patient_id,created_at")
        .eq("appointment_date", today),
      sb.from("patients").select("id,created_at").gte("created_at", today + "T00:00:00Z"),
    ]);

    const appts = apptRes.data ?? [];
    const patients = patientsRes.data ?? [];

    return {
      todayAppointments: appts.length,
      todayRegistered:   patients.length,
      waiting:           appts.filter((a: any) => a.visit_status === "waiting").length,
      checkedIn:         appts.filter((a: any) => a.visit_status === "checked_in").length,
      completed:         appts.filter((a: any) => a.visit_status === "completed").length,
      pendingPayment:    appts.filter((a: any) => a.payment_status === "pending").length,
      paidPayment:       appts.filter((a: any) => a.payment_status === "paid").length,
    };
  });
