import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { VideoConsultationContainer } from "@/components/telemedicine/VideoConsultationContainer";
import { ClinicalWorkflow } from "@/components/telemedicine/ClinicalWorkflow";
import { supabase } from "@/lib/supabase";
import { getStaffRole } from "@/lib/staff-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/appointments/$appointmentId")({
  head: () => ({ meta: [{ title: "Video Consultation — Dr. Amanuel Hospital" }] }),
  component: VideoConsultationPage,
});

// ── helpers ───────────────────────────────────────────────────────────────────
function calcAge(dob?: string | null): number | null {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function VideoConsultationPage() {
  const { appointmentId } = Route.useParams();

  // ── Auth: is this a doctor/staff session? ───────────────────────────────────
  const staffRole = getStaffRole();
  const isDoctor =
    staffRole === "doctor" ||
    staffRole === "staff" ||
    staffRole === "admin" ||
    (typeof window !== "undefined" && !!sessionStorage.getItem("staff_session"));

  // ── State ───────────────────────────────────────────────────────────────────
  const [loadingAppt, setLoadingAppt]   = useState(true);
  const [appointment, setAppointment]   = useState<any>(null);
  const [isPaid, setIsPaid]             = useState(isDoctor);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // ── Fetch appointment + patient from Supabase ───────────────────────────────
  useEffect(() => {
    (async () => {
      setLoadingAppt(true);
      try {
        // Parse appointment ID from room string (e.g. "apt_53" → "53") or use directly
        const cleanId = String(appointmentId).replace(/^apt_/i, "");

        console.log('Fetching appointment with ID:', cleanId);

        const { data, error } = await supabase
          .from("appointments")
          .select("*, patient:patients(*)")
          .eq("id", cleanId)
          .maybeSingle();

        if (error) {
          console.error('Supabase Appointment Fetch Error:', error);
          throw error;
        }

        console.log('Supabase Appointment Data:', data);

        if (data) {
          const patient = data.patient;
          const age = calcAge(patient?.date_of_birth);

          // Flexible field mapping for patient data
          const patientName = data.patient_name || data.full_name || patient?.full_name || patient?.name || "Guest Patient";
          const phoneNumber = data.phone_number || data.phone || patient?.phone_number || patient?.phone || "";
          const reason = data.reason_for_visit || data.symptoms || data.reason || data.complaint || data.chief_complaint || "Online Video Consultation";
          const patientAge = age || data.age || null;
          const patientGender = patient?.gender || data.gender || null;

          setAppointment({
            id:              String(data.id),
            // Patient info — live from DB with flexible mapping
            patient_name:    patientName,
            phone:           phoneNumber,
            patient_age:     patientAge,
            patient_gender:  patientGender,
            primary_complaints: reason,
            // Payment / status
            payment_status:  data.payment_status,
            status:          data.status ?? "SCHEDULED",
            consultation_fee: data.amount ?? data.consultation_fee ?? 100,
            // Vitals — show "N/A" if not recorded
            vitals: {
              temperature:   patient?.temperature   ?? data.temperature   ?? "N/A",
              blood_pressure: patient?.blood_pressure ?? data.blood_pressure ?? "N/A",
              heart_rate:    patient?.heart_rate    ?? data.heart_rate    ?? "N/A",
              weight:        patient?.weight        ?? data.weight        ?? "N/A",
            },
            // Extra
            doctor_name:     data.doctor_name ?? "Dr. Amanuel Tesfaye",
          });
          // Doctor bypasses payment; patients need paid status
          setIsPaid(
            isDoctor ||
            data.payment_status === "paid" ||
            data.payment_status === "PAID"
          );
        } else {
          // Appointment not found — use safe fallbacks
          setAppointment({
            id:               appointmentId,
            patient_name:     "Guest Patient",
            phone:            "",
            patient_age:      null,
            patient_gender:   null,
            primary_complaints: "Online Video Consultation",
            payment_status:   isDoctor ? "paid" : "unpaid",
            status:           "SCHEDULED",
            consultation_fee: 100,
            vitals:           { temperature: "N/A", blood_pressure: "N/A", heart_rate: "N/A", weight: "N/A" },
            doctor_name:      "Dr. Amanuel Tesfaye",
          });
          setIsPaid(isDoctor);
        }
      } catch (err: any) {
        console.error("Failed to load appointment:", err);
        toast.error("Could not load appointment details.");
        // Safe fallback so the page still renders
        setAppointment({
          id:               appointmentId,
          patient_name:     "Guest Patient",
          phone:            "",
          patient_age:      null,
          patient_gender:   null,
          primary_complaints: "Online Video Consultation",
          payment_status:   isDoctor ? "paid" : "unpaid",
          status:           "SCHEDULED",
          consultation_fee: 100,
          vitals:           { temperature: "N/A", blood_pressure: "N/A", heart_rate: "N/A", weight: "N/A" },
          doctor_name:      "Dr. Amanuel Tesfaye",
        });
        setIsPaid(isDoctor);
      } finally {
        setLoadingAppt(false);
      }
    })();
  }, [appointmentId, isDoctor]);

  // ── Cash payment handler ─────────────────────────────────────────────────────
  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      const numericId = String(appointmentId).replace(/^apt_/i, "");
      const { error } = await supabase
        .from("appointments")
        .update({
          payment_status: "paid",
          paid_at:        new Date().toISOString(),
          booking_status: "confirmed",
          updated_at:     new Date().toISOString(),
        })
        .eq("id", numericId);

      if (error) { toast.error(`Payment failed: ${error.message}`); return; }

      setAppointment((prev: any) => ({ ...prev, payment_status: "paid" }));
      setIsPaid(true);
      toast.success("Payment completed successfully!");
    } catch (err: any) {
      toast.error(err?.message ?? "Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loadingAppt) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading appointment...</span>
      </div>
    );
  }

  // ── Main layout — 80% video / 20% sidebar ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left — Video area (80%) */}
        <div className="flex-1 lg:w-[80%] p-4 lg:p-5 bg-slate-50 dark:bg-slate-900/50 min-h-[60vh] lg:min-h-screen">
          <VideoConsultationContainer
            appointmentId={String(appointment.id)}
            appointment={appointment}
            isPaid={isPaid}
            onPayment={handlePayment}
            isProcessingPayment={isProcessingPayment}
            isDoctor={isDoctor}
          />
        </div>

        {/* Right — Sidebar (20%) */}
        <div className="lg:w-[20%] min-w-[240px] p-4 lg:p-4 bg-card border-l border-border overflow-y-auto">
          <ClinicalWorkflow appointment={appointment} isDoctor={isDoctor} />
        </div>

      </div>
    </div>
  );
}
