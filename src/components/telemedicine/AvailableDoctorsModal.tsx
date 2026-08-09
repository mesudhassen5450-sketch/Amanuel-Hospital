import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PatientRequestModal } from "./PatientRequestModal";

interface AvailableDoctorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock doctors data - in production, this would come from Supabase
const MOCK_DOCTORS = [
  {
    id: "1",
    name: "Dr. Amanuel Tesfaye",
    specialty: "General Medicine",
    isOnline: true,
    consultationFee: 100, // Video consultation fee
    rating: 4.8,
  },
  {
    id: "2",
    name: "Dr. Sara Ahmed",
    specialty: "Pediatrics",
    isOnline: true,
    consultationFee: 100, // Video consultation fee
    rating: 4.9,
  },
  {
    id: "3",
    name: "Dr. Bekele Gerba",
    specialty: "Cardiology",
    isOnline: false,
    consultationFee: 100, // Video consultation fee
    rating: 4.7,
  },
];

export function AvailableDoctorsModal({ open, onOpenChange }: AvailableDoctorsModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<typeof MOCK_DOCTORS[0] | null>(null);
  const [patientRequestOpen, setPatientRequestOpen] = useState(false);

  const handleCheckAvailability = (doctor: typeof MOCK_DOCTORS[0]) => {
    setSelectedDoctor(doctor);
    setPatientRequestOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Available Doctors for Instant Video Consultation
          </DialogTitle>
          <DialogDescription>
            Select a doctor below to check availability and start a video consultation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {MOCK_DOCTORS.map((doctor) => (
            <Card key={doctor.id} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                      <Badge
                        variant={doctor.isOnline ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          doctor.isOnline
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                        )}
                      >
                        {doctor.isOnline ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Online
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Offline
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{doctor.specialty}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Video Call ({doctor.consultationFee} ETB)
                      </span>
                      <span>⭐ {doctor.rating}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCheckAvailability(doctor)}
                    disabled={!doctor.isOnline}
                    className="rounded-xl"
                  >
                    Check Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Video consultations are available 24/7. Payment required before entering the call.
          </p>
        </div>
      </DialogContent>
      
      <PatientRequestModal 
        open={patientRequestOpen} 
        onOpenChange={setPatientRequestOpen}
        doctor={selectedDoctor}
      />
    </Dialog>
  );
}
