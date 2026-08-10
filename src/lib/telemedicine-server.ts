import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env["VITE_SUPABASE_URL"]
    ?? (typeof import.meta !== "undefined" ? (import.meta as any).env?.["VITE_SUPABASE_URL"] : undefined)
    ?? process.env["SUPABASE_URL"];
  const key = process.env["VITE_SUPABASE_ANON_KEY"]
    ?? (typeof import.meta !== "undefined" ? (import.meta as any).env?.["VITE_SUPABASE_ANON_KEY"] : undefined)
    ?? process.env["SUPABASE_ANON_KEY"];
  return createClient(url || "", key || "");
}

export const requestVideoConsultation = createServerFn({ method: "POST" })
  .validator((d: {
    doctorId: string;
    patientName: string;
    phoneNumber: string;
    consultationFee: number;
  }) => d)
  .handler(async ({ data }: { data: any }) => {
    const { doctorId, patientName, phoneNumber, consultationFee } = data;
    const sb = getSupabase();

    // Insert appointment into Supabase
    // For video consultations, always set amount to 100 ETB
    const { data: appointment, error } = await sb
      .from("appointments")
      .insert({
        doctor_id: doctorId,
        patient_name: patientName,
        phone_number: phoneNumber,
        consultation_type: "ONLINE",
        consultation_fee: 100, // Fixed fee for video consultations
        amount: 100, // Payment amount for gateway
        call_status: "WAITING_FOR_DOCTOR",
        payment_status: "UNPAID",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }

    return {
      appointmentId: appointment.id,
      message: "Consultation request sent successfully",
    };
  });

export const acceptConsultationRequest = createServerFn({ method: "POST" })
  .validator((d: { appointmentId: string }) => d)
  .handler(async ({ data }: { data: any }) => {
    const { appointmentId } = data;
    const sb = getSupabase();

    const { data: updatedData, error } = await sb
      .from("appointments")
      .update({
        call_status: "IN_CALL",
        booking_status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select();

    if (error) {
      console.error("Accept Call Supabase Error:", error);
      throw new Error(`Failed to accept consultation: ${error.message}`);
    }

    return { success: true, data: updatedData };
  });

export const declineConsultationRequest = createServerFn({ method: "POST" })
  .validator((d: { appointmentId: string }) => d)
  .handler(async ({ data }: { data: any }) => {
    const { appointmentId } = data;
    const sb = getSupabase();

    const { error } = await sb
      .from("appointments")
      .update({
        call_status: "DECLINED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (error) {
      throw new Error(`Failed to decline consultation: ${error.message}`);
    }

    return { success: true };
  });

export const processConsultationPayment = createServerFn({ method: "POST" })
  .validator((d: { appointmentId: string; amount: number }) => d)
  .handler(async ({ data }: { data: any }) => {
    const { appointmentId, amount } = data;
    const sb = getSupabase();

    // In production, this would integrate with Telebirr/Chapa
    // For now, we'll mock the payment processing

    const { error } = await sb
      .from("appointments")
      .update({
        payment_status: "PAID",
        call_status: "IN_PROGRESS",
        payment_amount: amount,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (error) {
      throw new Error(`Failed to process payment: ${error.message}`);
    }

    return { success: true };
  });

export const saveClinicalNotes = createServerFn({ method: "POST" })
  .validator((d: {
    appointmentId: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    prescriptions: Array<{
      medication: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
  }) => d)
  .handler(async ({ data }: { data: any }) => {
    const { appointmentId, subjective, objective, assessment, plan, prescriptions } = data;
    const sb = getSupabase();

    // Save clinical notes to consultation_notes table
    const { error: notesError } = await sb
      .from("consultation_notes")
      .insert({
        appointment_id: appointmentId,
        subjective,
        objective,
        assessment,
        plan,
        created_at: new Date().toISOString(),
      });

    if (notesError) {
      throw new Error(`Failed to save clinical notes: ${notesError.message}`);
    }

    // Save prescriptions if any
    if (prescriptions && prescriptions.length > 0) {
      const prescriptionsData = prescriptions.map((prescription: any) => ({
        appointment_id: appointmentId,
        medication: prescription.medication,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        created_at: new Date().toISOString(),
      }));

      const { error: prescriptionsError } = await sb
        .from("prescriptions")
        .insert(prescriptionsData);

      if (prescriptionsError) {
        throw new Error(`Failed to save prescriptions: ${prescriptionsError.message}`);
      }
    }

    return { success: true };
  });
