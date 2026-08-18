import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAudioNotification } from "@/lib/audio-utils";
import { supabase } from "@/lib/supabase";

interface DoctorAvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: {
    id: string;
    patientName: string;
    doctorUsername: string;
    callStatus: string;
  } | null;
  currentDoctorUsername: string;
}

export function DoctorAvailabilityModal({
  open,
  onOpenChange,
  appointment,
  currentDoctorUsername,
}: DoctorAvailabilityModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const audioNotification = getAudioNotification();

  useEffect(() => {
    // Play notification ping when modal opens
    if (open && appointment) {
      audioNotification.playNotificationPing();
    }

    // Cleanup audio when modal closes
    return () => {
      if (!open) {
        audioNotification.stop();
      }
    };
  }, [open, appointment, audioNotification]);

  const handleConfirmAvailability = async () => {
    if (!appointment) return;

    try {
      setIsConfirming(true);

      console.log("Confirming availability for appointment ID:", appointment.id);

      // Update appointment call_status to DOCTOR_READY
      const { error } = await supabase
        .from("appointments")
        .update({ call_status: "DOCTOR_READY" })
        .eq("id", String(appointment.id));

      if (error) {
        console.error("Error confirming availability:", error);
        throw error;
      }

      // Close modal after successful update
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to confirm availability:", error);
      // You might want to show an error toast here
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDecline = async () => {
    if (!appointment) return;

    try {
      // Update appointment call_status to indicate doctor declined
      const { error } = await supabase
        .from("appointments")
        .update({ call_status: "DOCTOR_DECLINED" })
        .eq("id", String(appointment.id));

      if (error) {
        console.error("Error declining availability:", error);
        throw error;
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to decline availability:", error);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Video Consultation Request
            </DialogTitle>
            <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              Live Request
            </Badge>
          </div>
          <DialogDescription className="text-base">
            A patient is requesting an immediate video consultation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                {appointment.patientName || "Patient"}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Wants to consult now
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <span>Instant video consultation (100 ETB)</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={isConfirming}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button
            onClick={handleConfirmAvailability}
            disabled={isConfirming}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isConfirming ? (
              "Confirming..."
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                I'm Available & Ready
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
