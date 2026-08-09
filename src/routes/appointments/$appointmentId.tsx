import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VideoConsultationContainer } from "@/components/telemedicine/VideoConsultationContainer";
import { ClinicalWorkflow } from "@/components/telemedicine/ClinicalWorkflow";
import { PaymentGate } from "@/components/telemedicine/PaymentGate";

export const Route = createFileRoute("/appointments/$appointmentId")({
  head: () => ({ meta: [{ title: "Video Consultation — Dr. Amanuel Hospital" }] }),
  component: VideoConsultationPage,
});

function VideoConsultationPage() {
  const { appointmentId } = Route.useParams();
  
  // Mock appointment data
  const [appointment] = useState({
    id: appointmentId,
    patient_name: "John Doe",
    patient_age: 35,
    patient_gender: "Male",
    primary_complaints: "Fever and headache",
    payment_status: "UNPAID",
    status: "SCHEDULED",
    vitals: {
      temperature: "38.5°C",
      blood_pressure: "120/80",
      heart_rate: "85 bpm",
      weight: "70 kg",
    },
  });

  const [isPaid, setIsPaid] = useState(appointment.payment_status === "PAID");

  const handlePayment = () => {
    // Mock payment handler
    setIsPaid(true);
  };

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
