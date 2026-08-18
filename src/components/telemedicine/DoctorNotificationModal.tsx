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
import { useNavigate } from "@tanstack/react-router";

interface IncomingRequest {
  id: string;
  patientName: string;
  phoneNumber: string;
  consultationFee: number;
  createdAt: string;
  roomId?: string;
  appointment_id?: string;
}

interface DoctorNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IncomingRequest | null;
}

type ProcessingStatus = "idle" | "accepting" | "declining";

// Helper to play synthesized ringtone without needing static mp3 files
const playRingtone = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // 440Hz tone
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, 1500);
  } catch (err) {
    console.warn('Audio play blocked or unsupported:', err);
  }
};

export function DoctorNotificationModal({ open, onOpenChange, request }: DoctorNotificationModalProps) {
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds timeout
  const [autoDecline, setAutoDecline] = useState(false);
  const navigate = useNavigate();

  // Play ringtone when modal opens and start countdown
  useEffect(() => {
    if (open && request) {
      playRingtone();
      setTimeRemaining(30); // Reset timer
      setAutoDecline(false);

      // Countdown timer
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAutoDecline(true); // Trigger auto-decline when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [open, request]);

  // Auto-decline when timer expires
  useEffect(() => {
    if (autoDecline && request) {
      handleDecline();
    }
  }, [autoDecline, request]);

  const getAppointmentId = (call: any): string => {
    if (call.appointment_id && call.appointment_id !== 'undefined') return String(call.appointment_id);
    if (call.room_id && call.room_id.includes('room_')) return call.room_id.replace('room_', '');
    if (call.id) return String(call.id);
    return '';
  };

  const handleAccept = async () => {
    if (!request) return;

    const targetAptId = getAppointmentId(request);
    if (!targetAptId) {
      console.error('Cannot accept call: invalid appointment ID');
      return;
    }

    setStatus("accepting");

    try {
      // Step A: Update calls table status
      await supabase
        .from('calls')
        .update({ status: 'accepted' })
        .or(`appointment_id.eq.${targetAptId},room_id.eq.room_${targetAptId},id.eq.${request.id}`);

      // Step B: Update appointments table status
      await supabase
        .from('appointments')
        .update({ call_status: 'ACCEPTED', status: 'IN_PROGRESS' })
        .eq('id', targetAptId);

      // Step C: Redirect doctor to video consultation room
      navigate({ to: `/appointments/${targetAptId}` });
      onOpenChange(false);
    } catch (err) {
      console.error('Accept Call Error:', err);
      toast.error('Failed to accept call. Please try again.');
    } finally {
      setStatus("idle");
    }
  };

  const handleDecline = async () => {
    if (!request) return;

    const targetAptId = getAppointmentId(request);
    if (!targetAptId) {
      console.error('Cannot decline call: invalid appointment ID');
      return;
    }

    setStatus("declining");

    try {
      // Update calls table status
      await supabase
        .from('calls')
        .update({ status: 'declined' })
        .or(`appointment_id.eq.${targetAptId},room_id.eq.room_${targetAptId}`);

      // Update appointments table status
      await supabase
        .from('appointments')
        .update({ call_status: 'DECLINED' })
        .eq('id', targetAptId);

      onOpenChange(false);
    } catch (err) {
      console.error('Decline Call Error:', err);
      toast.error('Failed to decline call. Please try again.');
    } finally {
      setStatus("idle");
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-display font-bold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Incoming Consultation Request
          </DialogTitle>
          <DialogDescription className="text-sm flex items-center gap-2">
            A patient is requesting an instant video consultation
            <span className={`ml-auto font-mono font-bold ${timeRemaining <= 10 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
              {timeRemaining}s
            </span>
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{request.patientName}</p>
                    <p className="text-xs text-muted-foreground truncate">{request.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Requested {new Date(request.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Consultation Fee: {request.consultationFee} ETB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={status !== "idle"}
              className="flex-1 gap-2 h-12 sm:h-10"
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
              className="flex-1 gap-2 h-12 sm:h-10"
            >
              {status === "accepting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Accept & Join Call
            </Button>
          </div>

          <p className="text-[11px] sm:text-xs text-center text-muted-foreground">
            Accepting will mark you as available and redirect to the video consultation room
          </p>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}

// Hook to listen for incoming consultation requests
export function useDoctorNotifications(doctorUsername: string) {
  const [incomingRequest, setIncomingRequest] = useState<IncomingRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Guard clause: don't run subscription if doctorUsername is null/undefined
    if (!doctorUsername) {
      console.warn('useDoctorNotifications: doctorUsername is missing or undefined. Skipping subscription.');
      return;
    }

    const doctorKey = doctorUsername.toLowerCase().trim();

    // Supabase Realtime subscription for incoming calls from the calls table
    const callsChannel = supabase
      .channel('doctor_incoming_calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
        },
        async (payload) => {
          const newCall = payload.new as any;
          const assignedDoctor = (newCall.doctor_username || '').toLowerCase().trim();

          if (assignedDoctor === doctorKey && newCall.status === 'calling') {
            console.log('Incoming call received for doctor:', newCall);

            // Play incoming ringtone sound
            const ringtone = new Audio('/sounds/ringtone.mp3');
            ringtone.play().catch((err) => console.log('Audio autoplay blocked:', err));

            toast.info('Incoming Video Call', {
              description: `${newCall.patient_name} is calling`,
              duration: 10000,
            });

            setIncomingRequest({
              id: newCall.appointment_id,
              patientName: newCall.patient_name,
              phoneNumber: newCall.patient_id || '',
              consultationFee: 100, // Default fee, can be fetched from appointment
              createdAt: newCall.created_at,
              roomId: newCall.room_id,
            });
            setModalOpen(true);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(callsChannel);
    };
  }, [doctorUsername]);

  return {
    incomingRequest,
    modalOpen,
    setModalOpen,
  };
}
