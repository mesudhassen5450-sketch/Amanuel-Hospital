import { getAudioNotification } from "@/lib/audio-utils";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentGate } from "@/components/telemedicine/PaymentGate";
import { supabase } from "@/lib/supabase";
import { useWebRTCSocket } from "@/hooks/useWebRTCSocket";
import { useStaffAuth } from "@/lib/staff-auth";

interface VideoConsultationContainerProps {
  appointmentId: string;
  appointment: {
    id: string;
    patient_name: string;
    payment_status: string;
    status: string;
    consultation_fee?: number;
  };
  isPaid: boolean;
  onPayment?: () => void;
  onPaymentSuccess?: () => void;
  isProcessingPayment?: boolean;
  /** Pass true when the logged-in user is a doctor/staff — controls video layout */
  isDoctor?: boolean;
}

export function VideoConsultationContainer({
  appointmentId,
  appointment,
  isPaid,
  onPayment,
  onPaymentSuccess,
  isProcessingPayment = false,
  isDoctor = false,
}: VideoConsultationContainerProps) {
  const [hasJoinedCall, setHasJoinedCall] = useState(false);

  // Audio notification instance to stop ringtones when connecting
  const audioNotification = getAudioNotification();

  // Navigation for role-based routing after call ends
  const navigate = useNavigate();
  const { user: staffUser, hydrated } = useStaffAuth();

  // Derive paid status from appointment data
  const appointmentIsPaid = appointment?.payment_status === 'paid' || (appointment as any)?.is_paid === true;
  
  // Check if current user is doctor or staff to bypass payment gate completely
  const effectiveIsPaid = appointmentIsPaid || isDoctor;

  // Video refs for WebRTC
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const userRole = staffUser?.username ? 'doctor' : 'patient';
  
  useEffect(() => {
    console.log('[VideoConsultationContainer] Role determination:', { 
      hasStaffUser: !!staffUser, 
      username: staffUser?.username, 
      determinedRole: userRole 
    });
  }, [appointmentId, userRole, staffUser]);
  const userId = staffUser?.username || `patient_${appointmentId}`;

  // WebRTC hook for peer-to-peer video connection
  // ALWAYS call hook at top level, use enabled flag to control initialization
  const {
    localStream,
    remoteStream,
    connectionState,
    error: webrtcError,
    isAudioOnly,
    retryCameraAccess,
    toggleAudio,
    toggleVideo,
    endCall: disconnectWebRTC,
    isAudioEnabled,
    isVideoEnabled,
  } = useWebRTCSocket({
    signalingServerUrl: 'http://localhost:3001',
    appointmentId,
    userId,
    userRole: userRole as 'doctor' | 'patient',
    localVideoRef,
    remoteVideoRef,
    enabled: hydrated && hasJoinedCall, // Only enable when auth is hydrated and user has joined
  });

  const hasLocalVideo = localStream && localStream.getVideoTracks().length > 0;

  // Assign remote stream to video element when it becomes available
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log('Remote stream assigned to remote video element');
    }
  }, [remoteStream]);

  // Cleanup on unmount - stop ringtones and disconnect
  useEffect(() => {
    return () => {
      audioNotification.stop(); // Stop any playing ringtones on unmount
      disconnectWebRTC();
    };
  }, [disconnectWebRTC]);

  // Wait for auth to hydrate before rendering UI
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Derive connection states from hook's connectionState
  const isConnecting = connectionState === 'connecting';
  const isConnected = connectionState === 'connected';
  const isFailed = connectionState === 'failed';

  const handleConnect = () => {
    // Strict payment check - do not allow connection if unpaid (unless doctor)
    if (!effectiveIsPaid) {
      alert("Payment required to join video consultation.");
      return;
    }

    // CRITICAL: Stop any playing ringtones when user joins call
    audioNotification.stop();
    
    // Set joined call state - WebRTC hook will handle the actual connection
    setHasJoinedCall(true);
  };

  const handleEndCall = async () => {
    try {
      // Disconnect WebRTC
      disconnectWebRTC();

      // Update Supabase with proper call end status
      await supabase
        .from("appointments")
        .update({
          visit_status: "completed",
          call_status: "ended",
          status: "COMPLETED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      // Role-based navigation redirect
      if (isDoctor) {
        // Doctor returns to clinical dashboard
        navigate({ to: '/staff/doctor/dashboard' });
      } else {
        // Patient returns to home page
        navigate({ to: '/' });
      }
    } catch (error) {
      console.error("Error ending call:", error);
      // Even if there's an error, still redirect the user
      if (isDoctor) {
        navigate({ to: '/staff/doctor/dashboard' });
      } else {
        navigate({ to: '/' });
      }
    }
  };

  const STATUS_COLORS: Record<string, string> = {
    SCHEDULED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    COMPLETED: "bg-green-600/10 text-green-700 border-green-600/20",
  };

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
        <div className="flex  items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground font-display mono-technical">
            Room: apt_{appointmentId}
          </h2>
          <Badge className={cn("text-xs font-medium mono-technical", STATUS_COLORS[appointment.status] || "bg-muted")}>
            {appointment.status}
          </Badge>
        </div>
        {!effectiveIsPaid && (
          <Badge variant="destructive" className="text-xs font-medium mono-technical">
            Unpaid (100 ETB Required)
          </Badge>
        )}
      </div>

      {/* Video Screen */}
      <Card className="flex-1 border border-border bg-slate-900 rounded-2xl overflow-hidden relative h-[75vh] min-h-[480px] lg:h-[calc(100vh-140px)]">
        <CardContent className="p-0 h-full">
          
          {/* Payment Gate Overlay - Show ONLY when unpaid */}
          {!effectiveIsPaid && (
            <PaymentGate
              onPayment={onPayment}
              onPaymentSuccess={onPaymentSuccess}
              isProcessingPayment={isProcessingPayment}
              amount={appointment.consultation_fee || 100}
              appointmentId={appointmentId}
            />
          )}

          {/* Pre-Call Screen - Show green button before joining */}
          {effectiveIsPaid && !hasJoinedCall && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-950 p-6">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-24 h-24 rounded-full bg-emerald-600/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Video className="w-12 h-12 text-emerald-400"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isDoctor ? "Start Doctor Call" : "Join Video Call"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {isDoctor 
                      ? "You're about to start a video consultation with the patient. Click below to begin."
                      : "You're about to join a video consultation with your doctor. Click below to begin."}
                  </p>
                </div>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2 precise-button"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5" />
                      {isDoctor ? "Start Doctor Call" : "Join Video Call"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Full-Screen Video Layout with PIP Self-View - Show ONLY when joined */}
          {effectiveIsPaid && hasJoinedCall && (
            <div className="fixed inset-0 lg:relative lg:h-full lg:p-2 bg-black lg:bg-transparent z-40 lg:z-auto">
              
              {/* Media Error / Camera Retry Banner */}
              {webrtcError && (
                <div className="absolute top-4 left-4 z-50 bg-amber-600/90 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 backdrop-blur-md shadow-lg border border-amber-500/50">
                  <span>{webrtcError}</span>
                  <Button
                    className="h-6 text-[10px] px-2 bg-white text-slate-900 hover:bg-slate-100 font-medium"
                    onClick={retryCameraAccess}
                    size="sm"
                    variant="outline"
                  >
                    Retry Camera
                  </Button>
                </div>
              )}

              {/* Unified Remote Video Container - Responsive for both desktop and mobile */}
              <div className="relative w-full h-full bg-slate-950 overflow-hidden lg:rounded-xl flex items-center justify-center">
                {/* WebRTC Remote Video */}
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Fallback Overlay when Remote User is NOT connected */
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-10">
                    <div className="animate-pulse flex flex-col items-center gap-3 lg:gap-4">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                        <Video className="w-8 h-8 lg:w-10 lg:h-10 text-blue-400"/>
                      </div>
                      <p className="text-lg lg:text-xl font-medium text-slate-300">
                        {connectionState === 'connecting' ? 'Connecting to peer...' : 'Waiting for participant to join...'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Unified Self-View (PIP) - Responsive positioning */}
                <div className="absolute top-4 right-4 w-[100px] h-[140px] lg:bottom-4 lg:top-auto lg:w-48 lg:h-36 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 z-20 transition-all lg:hover:scale-105 flex items-center justify-center">
                  <span className="absolute top-1 left-1 lg:top-2 lg:left-2 px-1 lg:px-2 py-0.5 bg-black/60 lg:bg-black/70 rounded text-[8px] lg:text-[10px] text-white/80 lg:text-white/90 z-30 font-medium backdrop-blur-sm">
                    You
                  </span>
                  
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn("w-full h-full object-cover", (!isVideoEnabled || isAudioOnly || !hasLocalVideo) && "hidden")}
                  />

                  {(!isVideoEnabled || isAudioOnly || !hasLocalVideo) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-slate-400 p-2 text-center">
                      <VideoOff className="h-6 w-6 mb-1 text-slate-500"/>
                      <span className="text-[10px] text-slate-300 font-medium">
                        {isAudioOnly ? "Camera Locked" : "Video Off"}
                      </span>
                      {isAudioOnly && (
                        <button
                          onClick={retryCameraAccess}
                          className="text-[9px] text-blue-400 underline mt-1 hover:text-blue-300 transition font-medium"
                        >
                          Enable Camera
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Control Bar - Show ONLY when joined */}
          {effectiveIsPaid && hasJoinedCall && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 flex items-center gap-3 sm:gap-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/10 z-50">

              {/* Mute Button */}
              <Button
                variant={!isAudioEnabled ? "destructive" : "secondary"}
                size="icon"
                className="rounded-full h-10 w-10 sm:h-10 sm:w-10 precise-button"
                onClick={toggleAudio}
              >
                {!isAudioEnabled ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              {/* Camera Button */}
              <Button
                variant={!isVideoEnabled ? "destructive" : "secondary"}
                size="icon"
                className="rounded-full h-10 w-10 sm:h-10 sm:w-10 precise-button"
                onClick={toggleVideo}
              >
                {!isVideoEnabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>

              {/* End Call Button */}
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-10 w-10 sm:h-10 sm:w-10 precise-button"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>

          </div>
          )}

        </CardContent>
      </Card>

    </div>
  );
}
