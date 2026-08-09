import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestVideoConsultation } from "@/lib/telemedicine-server";

interface PatientRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    consultationFee: number;
  } | null;
}

type RequestStatus = "idle" | "requesting" | "waiting" | "available" | "declined" | "error";

export function PatientRequestModal({ open, onOpenChange, doctor }: PatientRequestModalProps) {
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctor) return;

    try {
      setStatus("requesting");
      setError(null);

      const result = await requestVideoConsultation({
        data: {
          doctorId: doctor.id,
          patientName: patientName.trim(),
          phoneNumber: phoneNumber.trim(),
          consultationFee: doctor.consultationFee,
        },
      });

      setAppointmentId(result.appointmentId);
      setStatus("waiting");

      // Start listening for doctor response
      // In production, this would use Supabase Realtime
      listenForDoctorResponse(result.appointmentId);

    } catch (err: any) {
      setError(err?.message || "Failed to request consultation");
      setStatus("error");
    }
  };

  const listenForDoctorResponse = (aptId: string) => {
    // Mock real-time listener - in production, use Supabase Realtime
    setTimeout(() => {
      setStatus("available");
    }, 5000); // Simulate doctor accepting after 5 seconds
  };

  const handleProceedToPayment = () => {
    // Open payment modal instead of redirecting
    if (appointmentId) {
      // TODO: Open PaymentModal with appointmentId and fee
      window.location.href = `/appointments/${appointmentId}`;
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setPatientName("");
    setPhoneNumber("");
    setAppointmentId(null);
    setError(null);
    onOpenChange(false);
  };

  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-bold">
            Request Video Consultation
          </DialogTitle>
          <DialogDescription>
            {doctor.name} - {doctor.specialty}
          </DialogDescription>
        </DialogHeader>

        <CardContent className="pt-4">
          {status === "idle" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+251 9XX XXX XXX"
                  required
                />
              </div>

              <Card className="bg-slate-50 dark:bg-slate-800/50 border-border">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Video Consultation Fee</p>
                      <p className="text-lg font-bold text-foreground">{doctor.consultationFee} ETB</p>
                    </div>
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={!patientName || !phoneNumber}>
                  Request Consultation
                </Button>
              </div>
            </form>
          )}

          {status === "requesting" && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-foreground font-medium">Sending request...</p>
            </div>
          )}

          {status === "waiting" && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Notifying Dr. {doctor.name}...
              </p>
              <p className="text-sm text-muted-foreground">
                Please wait for confirmation
              </p>
            </div>
          )}

          {status === "available" && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <div>
                <p className="text-foreground font-bold text-lg mb-1">
                  Dr. {doctor.name} is ready!
                </p>
                <p className="text-sm text-muted-foreground">
                  Proceed to payment to enter the video consultation room
                </p>
              </div>
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    Consultation Fee: {doctor.consultationFee} ETB
                  </p>
                </CardContent>
              </Card>
              <Button onClick={handleProceedToPayment} className="w-full">
                Proceed to Payment
              </Button>
            </div>
          )}

          {status === "declined" && (
            <div className="text-center py-8">
              <p className="text-foreground font-medium mb-2">
                Dr. {doctor.name} is currently unavailable
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Please try again later or select another doctor
              </p>
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8 space-y-4">
              <p className="text-destructive font-medium">
                {error || "Failed to request consultation"}
              </p>
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
