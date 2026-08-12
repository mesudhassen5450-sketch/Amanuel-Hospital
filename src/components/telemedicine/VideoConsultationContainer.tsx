import { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentGate } from "@/components/telemedicine/PaymentGate";
import { createClient } from "@supabase/supabase-js";

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
  onPayment: () => void;
  isProcessingPayment?: boolean;
  /** Pass true when the logged-in user is a doctor/staff — controls video layout */
  isDoctor?: boolean;
}

export function VideoConsultationContainer({
  appointmentId,
  appointment,
  isPaid,
  onPayment,
  isProcessingPayment = false,
  isDoctor = false,
}: VideoConsultationContainerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasJoinedCall, setHasJoinedCall] = useState(false);

  // Derive paid status from appointment data
  const appointmentIsPaid = appointment?.payment_status === 'paid' || appointment?.is_paid === true;
  
  // Check if current user is doctor or staff to bypass payment gate completely
  const effectiveIsPaid = appointmentIsPaid || isDoctor;
  
  // Agora refs
  const clientRef = useRef<any>(null);
  const audioTrackRef = useRef<any>(null);
  const videoTrackRef = useRef<any>(null);
  const [remoteConnected, setRemoteConnected] = useState(false);

  // Stable DOM IDs for Agora to attach video tracks
  const LOCAL_VIDEO_ID  = `local-video-${appointmentId}`;
  const REMOTE_VIDEO_ID = `remote-video-${appointmentId}`;

  // Supabase client
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || "",
    import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  );

  const handleToggleMute = async () => {
    if (audioTrackRef.current) {
      const newState = !isMuted;
      await audioTrackRef.current.setEnabled(newState);
      setIsMuted(newState);
    }
  };

  const handleToggleCamera = async () => {
    if (videoTrackRef.current) {
      const newState = !isCameraOff;
      await videoTrackRef.current.setEnabled(newState);
      setIsCameraOff(newState);
    }
  };

  const handleEndCall = async () => {
    try {
      // Unpublish and close local tracks
      if (audioTrackRef.current) {
        await audioTrackRef.current.close();
        audioTrackRef.current = null;
      }
      if (videoTrackRef.current) {
        await videoTrackRef.current.close();
        videoTrackRef.current = null;
      }

      if (clientRef.current) {
        await clientRef.current.leave();
        setIsConnected(false);
      }
      
      // Update Supabase with proper call end status
      const sb = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      
      await sb
        .from("appointments")
        .update({
          visit_status: "completed",
          call_status: "ended",
          status: "COMPLETED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleConnect = async () => {
    // Strict payment check - do not allow connection if unpaid (unless doctor)
    if (!effectiveIsPaid) {
      alert("Payment required to join video consultation.");
      return;
    }

    // Set joined call state before initializing
    setHasJoinedCall(true);

    const appId = import.meta.env.VITE_AGORA_APP_ID || "db0b41794c224e549c92102892b75081";

    try {
      setIsConnecting(true);

      // Role-based distinct UID so Doctor and Patient don't share the same ID
      const uid = isDoctor ? 1001 : 2002;

      // Normalize channel name - both Doctor and Patient must join the EXACT same channel
      const channelName = String(appointmentId).trim();

      console.log('Agora: Connecting to channel:', channelName, 'with UID:', uid, 'as Doctor:', isDoctor);

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // ── Set up event listeners BEFORE calling join() ──────────────────────────
      client.on("user-published", async (remoteUser, mediaType) => {
        console.log('Agora: Remote user published:', remoteUser.uid, mediaType);
        await client.subscribe(remoteUser, mediaType);
        
        if (mediaType === "video") {
          // Wait brief moment for remote container DOM element
          setTimeout(() => {
            const container = document.getElementById(REMOTE_VIDEO_ID);
            if (container) {
              remoteUser.videoTrack?.play(REMOTE_VIDEO_ID);
            }
          }, 100);
          setRemoteConnected(true);
        }
        
        if (mediaType === "audio") {
          remoteUser.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (remoteUser, mediaType) => {
        console.log('Agora: Remote user unpublished:', remoteUser.uid);
        if (mediaType === "video") {
          remoteUser.videoTrack?.stop();
          setRemoteConnected(false);
        }
      });

      client.on("user-left", (remoteUser) => {
        console.log('Agora: Remote user left:', remoteUser.uid);
        setRemoteConnected(false);
      });

      // Fetch token
      const response = await fetch(`/api/agora-token?channelName=${channelName}&uid=${uid}`);
      const data = await response.json();
      if (!response.ok || !data.token) {
        throw new Error(data.error || "Failed to retrieve valid Agora RTC token");
      }

      // Join channel
      await client.join(data.appId || appId, channelName, data.token, uid);
      console.log('Agora: Successfully joined channel:', channelName);

      // Create local tracks
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);
      audioTrackRef.current = audioTrack;
      videoTrackRef.current = videoTrack;

      // Play local self-view
      videoTrack.play(LOCAL_VIDEO_ID);

      // Publish local tracks to channel
      await client.publish([audioTrack, videoTrack]);
      console.log('Agora: Published local tracks');

      setIsConnecting(false);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to video call:", error);
      setIsConnecting(false);
      alert("Failed to connect to video call. Please try again.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioTrackRef.current) {
        audioTrackRef.current.close();
      }
      if (videoTrackRef.current) {
        videoTrackRef.current.close();
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    SCHEDULED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    COMPLETED: "bg-green-600/10 text-green-700 border-green-600/20",
  };

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex  items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground font-display">
            Room: apt_{appointmentId}
          </h2>
          <Badge className={cn("text-xs font-medium", STATUS_COLORS[appointment.status] || "bg-muted")}>
            {appointment.status}
          </Badge>
        </div>
        {!effectiveIsPaid && (
          <Badge variant="destructive" className="text-xs font-medium">
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
              isProcessingPayment={isProcessingPayment}
              amount={appointment.consultation_fee || 100}
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
                  className="w-full h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg gap-2"
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
            <div className="h-full p-2">
              
              {/* Remote Video Container - Full Screen */}
              <div 
                id={REMOTE_VIDEO_ID}
                className="relative w-full h-full bg-slate-950 overflow-hidden rounded-xl"
              >
                {/* Fallback Overlay when Remote User is NOT connected */}
                {!remoteConnected && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-10">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                        <Video className="w-8 h-8 text-blue-400"/>
                      </div>
                      <p className="text-lg font-medium text-slate-300">Waiting for participant to join...</p>
                    </div>
                  </div>
                )}

                {/* SELF-VIEW (SMALL PICTURE-IN-PICTURE THUMBNAIL) */}
                <div 
                  id={LOCAL_VIDEO_ID}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-28 h-24 sm:w-48 sm:h-36 bg-slate-900 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border sm:border-2 border-white/20 z-20 transition-all hover:scale-105"
                >
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white/80 z-30 font-medium backdrop-blur-sm">
                    You
                  </span>
                  {isCameraOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
                      <VideoOff className="h-8 w-8 text-slate-500" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Control Bar - Show ONLY when joined */}
          {effectiveIsPaid && hasJoinedCall && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/10 z-30">
              
              {/* Mute Button */}
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
                onClick={handleToggleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              {/* Camera Button */}
              <Button
                variant={isCameraOff ? "destructive" : "secondary"}
                size="icon"
                className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
                onClick={handleToggleCamera}
              >
              {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            {/* End Call Button */}
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
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
