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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
      const { data, error } = await supabase
        .from("appointments")
        .update({ 
          call_status: "IN_CALL", 
          booking_status: "confirmed" 
        })
        .eq("id", request.id)
        .select();

      if (error) {
        console.error("Accept Call Supabase Error:", error);
        toast.error(`Failed to accept consultation: ${error.message}`);
        setStatus("idle");
        return;
      }

      setStatus("idle");
      onOpenChange(false);
      // Redirect to video room
      window.location.href = `/appointments/${request.id}`;
    } catch (error: any) {
      console.error("Accept Call Supabase Error:", error);
      toast.error(`Failed to accept consultation: ${error?.message || "Failed to accept consultation."}`);
      setStatus("idle");
    }
  };

  const handleDecline = async () => {
    if (!request) return;

    try {
      setStatus("declining");
      const { data, error } = await supabase
        .from("appointments")
        .update({
          call_status: "DECLINED",
          booking_status: "cancelled"
        })
        .eq("id", request.id)
        .select();

      if (error) {
        console.error("Decline Call Supabase Error:", error);
        toast.error(`Failed to decline consultation: ${error.message}`);
        setStatus("idle");
        return;
      }

      setStatus("idle");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Decline Call Supabase Error:", error);
      toast.error(`Failed to decline consultation: ${error?.message || "Failed to decline consultation."}`);
      setStatus("idle");
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
    const activeDoctorId = doctorId || "doctor";

    // Supabase Realtime subscription for incoming consultation requests
    const channel = supabase
      .channel(`doctor-appointments-${activeDoctorId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `doctor_id=eq.${activeDoctorId}`,
        },
        async (payload) => {
          const newAppointment = payload.new as any;
          
          // Only show notification for video consultations with waiting status
          if (newAppointment.consultation_type === 'ONLINE' && newAppointment.call_status === 'WAITING_FOR_DOCTOR') {
            // Play alert sound
            const audio = new Audio('/notification-sound.wav');
            audio.play().catch(console.error);
            
            // Show toast notification
            toast.success('New Video Consultation Request', {
              description: `${newAppointment.patient_name || newAppointment.full_name || 'Patient'} is requesting a video call`,
              duration: 5000,
            });
            
            setIncomingRequest({
              id: newAppointment.id,
              patientName: newAppointment.patient_name || newAppointment.full_name || 'Patient',
              phoneNumber: newAppointment.phone_number || newAppointment.phone || '',
              consultationFee: newAppointment.consultation_fee || newAppointment.amount || 100,
              createdAt: newAppointment.created_at,
            });
            setModalOpen(true);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `doctor_id=eq.${activeDoctorId}`,
        },
        (payload) => {
          const updatedAppointment = payload.new as any;
          
          // Handle call status changes for video consultations
          if (updatedAppointment.consultation_type === 'ONLINE') {
            if (updatedAppointment.call_status === 'RINGING' || updatedAppointment.call_status === 'CALLING') {
              // Play incoming call sound
              const audio = new Audio('/ringtone.wav');
              audio.play().catch(console.error);
              
              toast.info('Incoming Video Call', {
                description: `${updatedAppointment.patient_name || updatedAppointment.full_name || 'Patient'} is calling`,
                duration: 10000,
              });
              
              setIncomingRequest({
                id: updatedAppointment.id,
                patientName: updatedAppointment.patient_name || updatedAppointment.full_name || 'Patient',
                phoneNumber: updatedAppointment.phone_number || updatedAppointment.phone || '',
                consultationFee: updatedAppointment.consultation_fee || updatedAppointment.amount || 100,
                createdAt: updatedAppointment.created_at,
              });
              setModalOpen(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId]);

  return {
    incomingRequest,
    modalOpen,
    setModalOpen,
  };
}
