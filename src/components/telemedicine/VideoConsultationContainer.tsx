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

  // Check if current user is doctor or staff to bypass payment gate completely
  const effectiveIsPaid = isPaid || isDoctor;
  
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
    if (!effectiveIsPaid) {
      alert("Payment required to join video consultation.");
      return;
    }

    const appId = import.meta.env.VITE_AGORA_APP_ID || "db0b41794c224e549c92102892b75081";

    try {
      setIsConnecting(true);

      // Role-based distinct UID so Doctor and Patient don't share the same ID
      const uid = isDoctor ? 1001 : 2002;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      const channelName = `apt_${String(appointmentId).replace(/^apt_/i, "")}`;

      // Fetch token
      const response = await fetch(`/api/agora-token?channelName=${channelName}&uid=${uid}`);
      const data = await response.json();
      if (!response.ok || !data.token) {
        throw new Error(data.error || "Failed to retrieve valid Agora RTC token");
      }

      await client.join(data.appId || appId, channelName, data.token, uid);

      // Local tracks
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);
      audioTrackRef.current = audioTrack;
      videoTrackRef.current = videoTrack;
      await client.publish([audioTrack, videoTrack]);

      // Play local video in the 25% PIP container (string ID)
      videoTrack.play(LOCAL_VIDEO_ID);

      // ── Subscribe to remote participant tracks ──────────────────────────
      client.on("user-published", async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === "video") {
          // Wait for DOM element to exist before playing
          setTimeout(() => {
            remoteUser.videoTrack?.play(REMOTE_VIDEO_ID);
          }, 100);
          setRemoteConnected(true);
        }
        if (mediaType === "audio") {
          remoteUser.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (remoteUser, mediaType) => {
        if (mediaType === "video") {
          remoteUser.videoTrack?.stop();
          setRemoteConnected(false);
        }
      });

      client.on("user-left", () => {
        setRemoteConnected(false);
      });

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
      <Card className="flex-1 border border-border bg-slate-900 rounded-2xl overflow-hidden relative">
        <CardContent className="p-0 h-full">
          
          {/* Payment Gate Overlay */}
          {!effectiveIsPaid && (
            <PaymentGate 
              onPayment={onPayment} 
              isProcessingPayment={isProcessingPayment}
              amount={appointment.consultation_fee || 100}
            />
          )}

          {/* Video Grid — 75% dominant remote / 25% local PIP */}
          <div className="flex flex-col h-full gap-2 p-2">

            {/* Remote participant — 75% — Doctor sees patient, Patient sees doctor */}
            <div
              id={REMOTE_VIDEO_ID}
              className="relative bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ flex: "3" }}
            >
              {!remoteConnected && (
                <div className="text-center pointer-events-none">
                  <Loader2 className="h-8 w-8 text-slate-400 animate-spin mb-2 mx-auto" />
                  <p className="text-slate-400 text-sm">
                    {isConnecting ? "Connecting..." : isConnected ? "Waiting for remote participant..." : "Waiting for participant..."}
                  </p>
                  {!isPaid && (
                    <p className="text-slate-500 text-xs mt-1">Payment required to join</p>
                  )}
                </div>
              )}
            </div>

            {/* Local participant — 25% — PIP self-preview */}
            <div
              id={LOCAL_VIDEO_ID}
              className="relative bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ flex: "1" }}
            >
              {isCameraOff && (
                <div className="text-center pointer-events-none">
                  <VideoOff className="h-8 w-8 text-slate-500 mx-auto mb-1" />
                  <p className="text-slate-400 text-xs">Camera Off</p>
                </div>
              )}
              {!isConnected && !isCameraOff && (
                <div className="text-center pointer-events-none">
                  <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <span className="text-base font-bold text-white">
                      {isDoctor ? "Dr" : "Me"}
                    </span>
                  </div>
                  <p className="text-white text-xs font-medium">
                    {isDoctor ? "You (Doctor)" : "You (Patient)"}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Control Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3">
            
            {/* Mute Button */}
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={handleToggleMute}
              disabled={!isPaid}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Camera Button */}
            <Button
              variant={isCameraOff ? "destructive" : "secondary"}
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={handleToggleCamera}
              disabled={!isPaid}
            >
              {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            {/* Connect/End Call Button */}
            {!isConnected ? (
              <Button
                variant="default"
                size="icon"
                className="rounded-full h-10 w-10 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleConnect}
                disabled={!isPaid || isConnecting}
              >
                {isConnecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Video className="h-5 w-5" />}
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            )}

          </div>

        </CardContent>
      </Card>

    </div>
  );
}
