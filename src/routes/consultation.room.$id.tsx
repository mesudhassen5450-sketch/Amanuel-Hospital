import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Phone, X, Loader2, AlertCircle, Mic, MicOff, Camera, CameraOff, LayoutDashboard, Calendar, MessageSquare, Video as VideoIcon, Settings, LogOut, Send, Paperclip, User, Stethoscope, Clock, PhoneCall } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useWebRTCSocket } from "@/hooks/useWebRTCSocket";
import { useStaffAuth } from "@/lib/staff-auth";

export const Route = createFileRoute("/consultation/room/$id")({
  head: () => ({
    meta: [
      { title: "Video Consultation Room — Dr. Amanuel Hospital" },
      { name: "description", content: "Secure video consultation room" },
    ],
  }),
  component: ConsultationRoomPage,
});

function ConsultationRoomPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user: staffUser, hydrated } = useStaffAuth();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'attachments'>('messages');

  const [attachments, setAttachments] = useState<Array<{ name: string; size: string; date: string }>>([
    { name: 'Patient_Medical_History.pdf', size: '2.4 MB', date: 'Today' },
    { name: 'Lab_Report_Vitals.pdf', size: '1.1 MB', date: 'Today' },
  ]);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'me' | 'other'; timestamp: Date }>>([
    { id: '1', text: 'Hello, I\'m ready for the consultation.', sender: 'other', timestamp: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const userRole = staffUser?.username ? 'doctor' : 'patient';
  
  useEffect(() => {
    console.log('[ConsultationRoom] Room Info:', { 
      appointmentId: id,
      hasStaffUser: !!staffUser, 
      username: staffUser?.username, 
      determinedRole: userRole 
    });
  }, [id, userRole, staffUser]);
  const userId = staffUser?.username || `patient_${id}`;

  // WebRTC hook for peer-to-peer video connection
  // ALWAYS call at top level with consistent enabled value
  const {
    connectionState,
    error: webrtcError,
    localStream,
    remoteStream,
    isAudioOnly,
    mediaError,
    retryCameraAccess,
    toggleAudio,
    toggleVideo,
    endCall: disconnectWebRTC,
    isAudioEnabled,
    isVideoEnabled,
  } = useWebRTCSocket({
    signalingServerUrl: 'http://localhost:3001',
    appointmentId: id,
    userId,
    userRole: userRole as 'doctor' | 'patient',
    localVideoRef,
    remoteVideoRef,
    enabled: true, // Always enabled to ensure consistent hook count
  });

  const hasLocalVideo = localStream && localStream.getVideoTracks().length > 0;

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setError("Failed to load appointment details");
          console.error("Error fetching appointment:", error);
          return;
        }

        if (!data) {
          setError("Appointment not found");
          return;
        }

        setAppointment(data);
      } catch (err) {
        setError("An error occurred while loading the consultation");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Bind localStream to localVideoRef
  useEffect(() => {
    const videoEl = localVideoRef.current;
    if (!videoEl || !localStream) return;

    if (videoEl.srcObject !== localStream) {
      videoEl.srcObject = localStream;
      videoEl.muted = true; // Crucial for browser autoplay compliance
      videoEl.play().catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Local video play error:', err);
        }
      });
    }
  }, [localStream, localVideoRef.current]);

  // Bind remoteStream to remoteVideoRef
  useEffect(() => {
    const videoEl = remoteVideoRef.current;
    if (!videoEl || !remoteStream) return;

    if (videoEl.srcObject !== remoteStream) {
      videoEl.srcObject = remoteStream;
      videoEl.play().catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Remote video play error:', err);
        }
      });
    }
  }, [remoteStream, remoteVideoRef.current]);

  const handleEndCall = async () => {
    try {
      // Disconnect WebRTC
      disconnectWebRTC();

      // Update appointment status to completed
      const { error } = await supabase
        .from("appointments")
        .update({ call_status: "COMPLETED" })
        .eq("id", id);

      if (error) {
        console.error("Error ending call:", error);
      }

      // Redirect based on user role
      if (userRole === 'doctor') {
        navigate({ to: "/staff/doctor/dashboard" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err) {
      console.error("Error ending call:", err);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date()
      }]);
      setNewMessage('');
    }
  };

  // Conditional returns AFTER all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading consultation room...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Consultation Error
            </h2>
            <p className="text-slate-600 mb-4">
              {error || "Unable to load consultation details"}
            </p>
            <Button onClick={() => navigate({ to: "/" })}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-950">
      {/* Center Main Stage - Full Width */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header */}
        {/* Full-Bleed Video Stage */}
        <div className="relative flex-1 h-full w-full bg-slate-950 overflow-hidden flex flex-col">
          {webrtcError ? (
            <div className="flex items-center justify-center h-full">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
                  <p className="text-slate-600 mb-6">{webrtcError}</p>
                  <Button onClick={() => window.location.reload()}>Retry Connection</Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Media Error / Retry Notification Banner */}
              {mediaError && (
                <div className="absolute top-4 left-4 z-50 bg-amber-600/90 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-3 backdrop-blur-md shadow-lg border border-amber-500/50">
                  <span>{mediaError}</span>
                  <button
                    onClick={retryCameraAccess}
                    className="bg-white text-amber-900 px-2.5 py-1 rounded font-semibold text-[11px] hover:bg-amber-100 transition shadow-sm"
                  >
                    Retry Camera
                  </button>
                </div>
              )}

              {/* Remote Video */}
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => console.log('Remote video metadata loaded')}
                  onPlay={() => console.log('Remote video playing')}
                  onError={(e) => console.error('Remote video error:', e)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center">
                    <VideoIcon className="h-16 w-16 text-slate-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-400">
                      {connectionState === 'connecting' ? 'Connecting to peer...' : 
                       connectionState === 'connected' ? 'Waiting for video stream...' : 
                       'Waiting for participant to join...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Top Floating Header Overlay */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                {/* Left Group */}
                <div className="pointer-events-auto flex items-center gap-2">
                  {/* Connection Status Badge */}
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border flex items-center gap-2 ${
                    connectionState === 'connected' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                    connectionState === 'connecting' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                    'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      connectionState === 'connected' ? 'bg-emerald-400' : 
                      connectionState === 'connecting' ? 'bg-amber-400 animate-pulse' : 
                      'bg-red-400'
                    }`} />
                    {connectionState === 'connecting' ? 'Connecting...' : 
                     connectionState === 'connected' ? 'Connected' : 
                     connectionState === 'failed' ? 'Failed' : 'Disconnected'}
                  </span>
                  {/* Dynamic User Badge */}
                  <span className="px-3 py-1.5 rounded-full bg-slate-900/60 text-white text-xs font-medium backdrop-blur-md border border-slate-700/50 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {userRole === 'doctor' ? `Patient: ${appointment?.patient_name || "Patient"}` : `Doctor: ${appointment?.doctor_username || "Doctor"}`}
                  </span>
                </div>
                {/* Right Group */}
                <div className="pointer-events-auto">
                  <button
                    onClick={handleEndCall}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-lg transition-colors flex items-center gap-2"
                  >
                    <PhoneCall className="h-4 w-4" />
                    End Call
                  </button>
                </div>
              </div>

              {/* Floating Local Self-View (Picture-in-Picture) */}
              <div className="absolute top-16 right-4 w-48 h-32 rounded-xl border-2 border-white/80 shadow-xl overflow-hidden z-20 bg-slate-900 flex items-center justify-center">
                {hasLocalVideo ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Fallback view when camera is locked or audio-only */
                  <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center space-y-1">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200">
                      👤
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Camera Unavailable</span>
                    <button
                      onClick={retryCameraAccess}
                      className="text-[10px] text-blue-400 font-semibold underline hover:text-blue-300 transition"
                    >
                      Retry Camera
                    </button>
                  </div>
                )}
                {!isVideoEnabled && hasLocalVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <CameraOff className="h-8 w-8 text-slate-600" />
                  </div>
                )}
              </div>

              {/* Floating Dock Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700/50 flex items-center gap-3 shadow-2xl">
                <Button
                  variant={isAudioEnabled ? "default" : "destructive"}
                  size="icon"
                  onClick={toggleAudio}
                  className={`rounded-full ${isAudioEnabled ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                    variant={isVideoEnabled ? "default" : "destructive"}
                    size="icon"
                    onClick={toggleVideo}
                    className={`rounded-full ${isVideoEnabled ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  >
                    {isVideoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                  </Button>
                  <div className="w-px h-8 bg-slate-600" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <VideoIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </div>
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Doctor Profile & Chat */}
      <div className="w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col">
        {/* Doctor Profile Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-bold text-lg">
                {userRole === 'doctor' ? 'Dr. ' + staffUser?.username : appointment?.doctor_username || 'Doctor'}
              </h2>
              <p className="text-blue-100 text-sm">General Practitioner</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-blue-100">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'messages' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Recent Messages
            </button>
            <button
              onClick={() => setActiveTab('attachments')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'attachments' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Attachments
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {activeTab === 'messages' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                Consultation started
              </span>
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Attachments Area */}
        {activeTab === 'attachments' && (
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
                <span>Shared Files & Documents</span>
                <span className="text-xs text-blue-600 font-normal">{attachments.length} files</span>
              </h3>
              <div className="space-y-2">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs font-medium text-slate-800">{file.name}</p>
                        <p className="text-[10px] text-slate-400">{file.size} · {file.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">Download</Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
              <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">Drag & drop files or click to upload</p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG up to 10MB</p>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-600"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
