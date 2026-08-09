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
}

export function VideoConsultationContainer({
  appointmentId,
  appointment,
  isPaid,
  onPayment,
  isProcessingPayment = false,
}: VideoConsultationContainerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Agora refs
  const clientRef = useRef<any>(null);
  const audioTrackRef = useRef<any>(null);
  const videoTrackRef = useRef<any>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);

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
          call_status: "ENDED",
          status: "COMPLETED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleConnect = async () => {
    // Payment verification check
    if (!isPaid) {
      alert("Payment required to join video consultation. Please complete payment first.");
      return;
    }

    const appId = import.meta.env.VITE_AGORA_APP_ID;
    if (!appId) {
      alert("Agora App ID not configured. Please check environment variables.");
      return;
    }

    try {
      setIsConnecting(true);

      // Initialize Agora client
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // Generate user ID (mock: doctor_123 or patient_456)
      const userId = `user_${Date.now()}`;
      const channelName = `apt_${appointmentId}`;

      // Join channel
      await client.join(appId, channelName, null, userId);

      // Create and publish audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      audioTrackRef.current = audioTrack;

      // Create and publish video track
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      videoTrackRef.current = videoTrack;

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);

      // Play local video
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      // Handle remote user published
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === "video" && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      // Handle remote user unpublished
      client.on("user-unpublished", (user) => {
        if (remoteVideoRef.current) {
          user.videoTrack?.stop();
        }
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
        {!isPaid && (
          <Badge variant="destructive" className="text-xs font-medium">
            Unpaid (100 ETB Required)
          </Badge>
        )}
      </div>

      {/* Video Screen */}
      <Card className="flex-1 border border-border bg-slate-900 rounded-2xl overflow-hidden relative">
        <CardContent className="p-0 h-full">
          
          {/* Payment Gate Overlay */}
          {!isPaid && (
            <PaymentGate 
              onPayment={onPayment} 
              isProcessingPayment={isProcessingPayment}
              amount={appointment.consultation_fee || 100}
            />
          )}

          {/* Video Grid */}
          <div className="grid grid-rows-2 h-full gap-2 p-2">
            
            {/* Remote Participant (Patient) */}
            <div 
              ref={remoteVideoRef}
              className="relative bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center"
            >
              {isConnected ? (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-slate-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{appointment.patient_name.charAt(0)}</span>
                    </div>
                    <p className="text-white font-medium">{appointment.patient_name}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Loader2 className="h-8 w-8 text-slate-400 animate-spin mb-2" />
                  <p className="text-slate-400 text-sm">
                    {isConnecting ? "Connecting..." : "Waiting for participant..."}
                  </p>
                  {!isPaid && (
                    <p className="text-slate-500 text-xs mt-1">Payment required to join</p>
                  )}
                </div>
              )}
            </div>

            {/* Local Participant (You) */}
            <div 
              ref={localVideoRef}
              className="relative bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center"
            >
              {isCameraOff ? (
                <div className="text-center">
                  <VideoOff className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Camera Off</p>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-slate-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">You</span>
                    </div>
                    <p className="text-white font-medium text-sm">You</p>
                  </div>
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
