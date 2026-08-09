import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Phone, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { acceptConsultationRequest, declineConsultationRequest } from "@/lib/telemedicine-server";

interface IncomingRequest {
  id: string;
  patientName: string;
  phoneNumber: string;
  consultationFee: number;
  createdAt: string;
}

interface DoctorNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IncomingRequest | null;
}

type ProcessingStatus = "idle" | "accepting" | "declining";

export function DoctorNotificationModal({ open, onOpenChange, request }: DoctorNotificationModalProps) {
  const [status, setStatus] = useState<ProcessingStatus>("idle");

  const handleAccept = async () => {
    if (!request) return;

    try {
      setStatus("accepting");
      await acceptConsultationRequest({
        data: { appointmentId: request.id },
      });
      setStatus("idle");
      onOpenChange(false);
      // Redirect to video room
      window.location.href = `/appointments/${request.id}`;
    } catch (error: any) {
      console.error("Failed to accept consultation:", error);
      setStatus("idle");
      alert("Failed to accept consultation. Please try again.");
    }
  };

  const handleDecline = async () => {
    if (!request) return;

    try {
      setStatus("declining");
      await declineConsultationRequest({
        data: { appointmentId: request.id },
      });
      setStatus("idle");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to decline consultation:", error);
      setStatus("idle");
      alert("Failed to decline consultation. Please try again.");
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Incoming Consultation Request
          </DialogTitle>
          <DialogDescription>
            A patient is requesting an instant video consultation
          </DialogDescription>
        </DialogHeader>

        <CardContent className="pt-4 space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{request.patientName}</p>
                    <p className="text-xs text-muted-foreground">{request.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Requested {new Date(request.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Consultation Fee: {request.consultationFee} ETB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={status !== "idle"}
              className="flex-1 gap-2"
            >
              {status === "declining" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={status !== "idle"}
              className="flex-1 gap-2"
            >
              {status === "accepting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Accept & Join Call
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Accepting will mark you as available and redirect to the video consultation room
          </p>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}

// Hook to listen for incoming consultation requests
export function useDoctorNotifications(doctorId: string) {
  const [incomingRequest, setIncomingRequest] = useState<IncomingRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // In production, this would use Supabase Realtime to listen for new appointments
    // with call_status = 'WAITING_FOR_DOCTOR' and doctor_id matching
    
    // Mock implementation for demonstration
    const mockListen = () => {
      // Simulate receiving a request after 10 seconds
      setTimeout(() => {
        setIncomingRequest({
          id: "mock-appointment-" + Date.now(),
          patientName: "John Doe",
          phoneNumber: "+251 911 123 456",
          consultationFee: 100,
          createdAt: new Date().toISOString(),
        });
        setModalOpen(true);
      }, 10000);
    };

    mockListen();

    return () => {
      // Cleanup subscription
    };
  }, [doctorId]);

  return {
    incomingRequest,
    modalOpen,
    setModalOpen,
  };
}
