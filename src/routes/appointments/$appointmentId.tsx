import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { VideoConsultationContainer } from "@/components/telemedicine/VideoConsultationContainer";
import { ClinicalWorkflow } from "@/components/telemedicine/ClinicalWorkflow";
import { PaymentGate } from "@/components/telemedicine/PaymentGate";
import { processConsultationPayment } from "@/lib/telemedicine-server";
import { supabase } from "@/lib/supabase";
import { getStaffRole } from "@/lib/staff-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/appointments/$appointmentId")({
  head: () => ({ meta: [{ title: "Video Consultation — Dr. Amanuel Hospital" }] }),
  component: VideoConsultationPage,
});

function VideoConsultationPage() {
  const { appointmentId } = Route.useParams();

  // Detect doctor / staff session to bypass payment modal completely
  const staffRole = getStaffRole();
  const isDoctor = staffRole === "doctor" || staffRole === "staff" || staffRole === "admin" || (typeof window !== "undefined" && !!sessionStorage.getItem("staff_session"));
  
  // Mock appointment data - in production, fetch from Supabase
  const [appointment, setAppointment] = useState({
    id: appointmentId,
    patient_name: "John Doe",
    patient_age: 35,
    patient_gender: "Male",
    primary_complaints: "Fever and headache",
    payment_status: isDoctor ? "paid" : "unpaid",
    status: "SCHEDULED",
    consultation_fee: 100,
    vitals: {
      temperature: "38.5°C",
      blood_pressure: "120/80",
      heart_rate: "85 bpm",
      weight: "70 kg",
    },
  });

  const [isPaid, setIsPaid] = useState(isDoctor || appointment.payment_status === "paid" || appointment.payment_status === "PAID");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      
      const { data, error } = await supabase
        .from("appointments")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          booking_status: "confirmed"
        })
        .eq("id", appointmentId);

      if (error) {
        console.error("Payment update failed:", error);
        toast.error(`Payment status update failed: ${error.message}`);
        return;
      }

      setAppointment((prev) => ({ ...prev, payment_status: "paid", booking_status: "confirmed" }));
      setIsPaid(true);
      toast.success("Payment completed successfully!");
    } catch (error: any) {
      console.error("Payment update failed:", error);
      toast.error(`Payment status update failed: ${error?.message || "Payment failed. Please try again."}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Listen for real-time payment status updates
  useEffect(() => {
    // In production, use Supabase Realtime to listen for payment_status changes
    const interval = setInterval(() => {
      // Mock: check if payment was made by doctor
      if (appointment.payment_status === "PAID" && !isPaid) {
        setIsPaid(true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [appointment.payment_status, isPaid]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Split View Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Panel - Video Consultation (60-70% on desktop) */}
        <div className="flex-1 lg:w-[65%] p-4 lg:p-6 bg-slate-50 dark:bg-slate-900/50">
          <VideoConsultationContainer
            appointmentId={appointmentId}
            appointment={appointment}
            isPaid={isPaid}
            onPayment={handlePayment}
            isProcessingPayment={isProcessingPayment}
          />
        </div>

        {/* Right Panel - Clinical Workflow (30-40% on desktop) */}
        <div className="lg:w-[35%] p-4 lg:p-6 bg-card border-l border-border">
          <ClinicalWorkflow appointment={appointment} />
        </div>

      </div>
    </div>
  );
}
