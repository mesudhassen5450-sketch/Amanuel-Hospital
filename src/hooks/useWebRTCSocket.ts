import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'failed';

const formatRoomId = (rawId: string | number): string => {
  const cleanId = String(rawId).replace(/^apt_/, '');
  return `apt_${cleanId}`;
};

interface WebRTCConfig {
  signalingServerUrl: string;
  appointmentId: string;
  userId: string;
  userRole: 'doctor' | 'patient' | 'staff' | string;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
}

interface UseWebRTCSocketReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: ConnectionState;
  error: string | null;
  isAudioOnly: boolean;
  mediaError: string | null;
  retryCameraAccess: () => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  endCall: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

export function useWebRTCSocket({
  signalingServerUrl,
  appointmentId,
  userId,
  userRole,
  localVideoRef,
  remoteVideoRef,
  enabled = true,
}: WebRTCConfig): UseWebRTCSocketReturn {
  const normalizedRoomId = formatRoomId(appointmentId);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioOnly, setIsAudioOnly] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const [iceServers, setIceServers] = useState<RTCIceServer[]>([
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const pendingRemoteCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSetRef = useRef(false);
  const isNegotiatingRef = useRef(false);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    const fetchIceServers = async () => {
      try {
        const response = await fetch(`${signalingServerUrl}/api/webrtc/ice-servers`);
        const data = await response.json();
        if (data.iceServers && data.iceServers.length > 0) {
          setIceServers(data.iceServers);
        }
      } catch (err) {
        console.warn('Using default STUN servers:', err);
      }
    };
    fetchIceServers();
  }, [signalingServerUrl]);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId: normalizedRoomId });
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    pendingRemoteCandidatesRef.current = [];
    remoteDescriptionSetRef.current = false;
    isNegotiatingRef.current = false;

    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('disconnected');
    setError(null);
  }, [normalizedRoomId]);

  const createFallbackStream = (label: string): MediaStream => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    const draw = () => {
      if (!ctx) return;
      frame++;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Audio-Only Mode (Frame ${frame})`, canvas.width / 2, canvas.height / 2 + 20);
      requestAnimationFrame(draw);
    };
    draw();

    return canvas.captureStream(15);
  };

  const initializeLocalStream = useCallback(async () => {
    if (isInitializingRef.current || localStreamRef.current) {
      return localStreamRef.current;
    }
    isInitializingRef.current = true;

    let stream: MediaStream | null = null;
    try {
      setMediaError(null);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        setIsAudioOnly(false);
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          setIsAudioOnly(true);
          setMediaError('Camera unavailable. Audio-only mode enabled.');
        } catch {
          stream = createFallbackStream(userRole === 'doctor' ? 'Doctor Stream' : 'Patient Stream');
          setIsAudioOnly(true);
          setMediaError('Camera and Microphone unavailable.');
        }
      }

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }

      return stream;
    } finally {
      isInitializingRef.current = false;
    }
  }, [localVideoRef, userRole]);

  const processBufferedCandidates = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (!pc || !remoteDescriptionSetRef.current) return;

    while (pendingRemoteCandidatesRef.current.length > 0) {
      const candidate = pendingRemoteCandidatesRef.current.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('[WebRTC] Error processing queued candidate:', e);
        }
      }
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    remoteDescriptionSetRef.current = false;
    pendingRemoteCandidatesRef.current = [];

    const pc = new RTCPeerConnection({ iceServers });
    peerConnectionRef.current = pc;

    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      const videoTracks = localStreamRef.current.getVideoTracks();

      // Add audio tracks first (M-line 0)
      audioTracks.forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      // Add video tracks second (M-line 1)
      videoTracks.forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.ontrack = (event) => {
      console.log('[WebRTC] Received remote track:', event.track.kind, 'enabled:', event.track.enabled);
      event.track.enabled = true;

      if (event.streams && event.streams[0]) {
        remoteStreamRef.current = event.streams[0];
        setRemoteStream(event.streams[0]);
      } else {
        const newStream = remoteStreamRef.current || new MediaStream();
        if (!newStream.getTracks().some((t) => t.id === event.track.id)) {
          newStream.addTrack(event.track);
        }
        remoteStreamRef.current = newStream;
        setRemoteStream(newStream);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          roomId: normalizedRoomId,
          candidate: event.candidate,
          senderId: socketRef.current.id,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionState('connected');
      } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        setConnectionState('failed');
      } else if (pc.iceConnectionState === 'checking') {
        setConnectionState('connecting');
      }
    };

    return pc;
  }, [iceServers, normalizedRoomId]);

  const createOffer = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (!pc || !socketRef.current || isNegotiatingRef.current) return;

    try {
      isNegotiatingRef.current = true;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current.emit('sdp-offer', {
        roomId: normalizedRoomId,
        offer: pc.localDescription,
        senderId: socketRef.current.id,
      });
    } catch (err) {
      console.error('[WebRTC] Offer error:', err);
      setError('Connection offer failed.');
      setConnectionState('failed');
    } finally {
      isNegotiatingRef.current = false;
    }
  }, [normalizedRoomId]);

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    const pc = peerConnectionRef.current;
    if (!pc || !socketRef.current || isNegotiatingRef.current) return;

    // WebRTC Spec: Remote offers can ONLY be processed when signalingState is strictly 'stable'
    if (pc.signalingState !== 'stable') {
      console.warn('[WebRTC] Ignoring duplicate/stale offer. Current state:', pc.signalingState);
      return;
    }

    try {
      isNegotiatingRef.current = true;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Guard: Ensure PeerConnection was not reset or closed during async setRemoteDescription
      if (peerConnectionRef.current !== pc || (pc.signalingState as string) !== 'have-remote-offer') {
        console.warn('[WebRTC] Connection state changed during setRemoteDescription. Aborting answer.');
        return;
      }

      remoteDescriptionSetRef.current = true;
      const answer = await pc.createAnswer();

      // Guard: Ensure signalingState is still 'have-remote-offer' before setLocalDescription
      if (peerConnectionRef.current !== pc || (pc.signalingState as string) !== 'have-remote-offer') {
        console.warn('[WebRTC] Connection state changed before setLocalDescription. Aborting answer.');
        return;
      }

      await pc.setLocalDescription(answer);

      socketRef.current.emit('sdp-answer', {
        roomId: normalizedRoomId,
        answer: pc.localDescription,
        senderId: socketRef.current.id,
      });

      await processBufferedCandidates();
    } catch (err) {
      console.error('[WebRTC] Answer error:', err);
      setError('Failed to answer incoming connection.');
      setConnectionState('failed');
    } finally {
      isNegotiatingRef.current = false;
    }
  }, [normalizedRoomId, processBufferedCandidates]);

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    // Guard against applying answers when not expecting one
    if (pc.signalingState !== 'have-local-offer') {
      console.warn('[WebRTC] Ignored answer because signaling state is:', pc.signalingState);
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      remoteDescriptionSetRef.current = true;
      await processBufferedCandidates();
    } catch (err) {
      console.error('[WebRTC] Set remote answer error:', err);
      setError('Connection answer negotiation failed.');
      setConnectionState('failed');
    }
  }, [processBufferedCandidates]);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (remoteDescriptionSetRef.current && pc.remoteDescription) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('[WebRTC] ICE candidate error:', err);
      }
    } else {
      pendingRemoteCandidatesRef.current.push(candidate);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  const retryCameraAccess = useCallback(async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = videoStream.getVideoTracks()[0];

      if (videoTrack) {
        if (localStreamRef.current) {
          localStreamRef.current.getVideoTracks().forEach((track) => {
            track.stop();
            localStreamRef.current?.removeTrack(track);
          });
          localStreamRef.current.addTrack(videoTrack);
          setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
        }

        setIsAudioOnly(false);
        setMediaError(null);

        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          } else {
            peerConnectionRef.current.addTrack(videoTrack, localStreamRef.current!);
          }
        }
      }
    } catch {
      setMediaError('Camera remains locked or unavailable.');
    }
  }, []);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.muted = true;
          remoteVideoRef.current.play().catch(() => {});
        }
      });
    }
  }, [remoteStream, remoteVideoRef]);

  useEffect(() => {
    if (!appointmentId || !userId || !userRole || !enabled) return;

    const isDoctorRole = userRole === 'doctor' || userRole === 'staff';

    const initialize = async () => {
      setConnectionState('connecting');
      setError(null);

      try {
        await initializeLocalStream();
        createPeerConnection();

        const socket = io(signalingServerUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 3,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          socket.emit('join-room', { roomId: normalizedRoomId, userId, userRole });
        });

        socket.on('room-participants', (data: any[]) => {
          const otherParticipants = data.filter((p) => p.socketId !== socket.id);
          // Only the doctor initiates the connection offer
          if (isDoctorRole && otherParticipants.length > 0 && peerConnectionRef.current) {
            setTimeout(() => createOffer(), 300);
          }
        });

        socket.on('user-joined', () => {
          if (isDoctorRole && peerConnectionRef.current) {
            setTimeout(() => createOffer(), 300);
          }
        });

        socket.on('sdp-offer', async (data: any) => {
          if (data.senderId === socket.id) return;
          // Patient accepts offer from Doctor
          if (!isDoctorRole) {
            await handleOffer(data.offer || data);
          }
        });

        socket.on('sdp-answer', async (data: any) => {
          if (data.senderId === socket.id) return;
          if (isDoctorRole) {
            await handleAnswer(data.answer || data);
          }
        });

        socket.on('ice-candidate', async (data: any) => {
          if (data.senderId === socket.id) return;
          await handleIceCandidate(data.candidate || data);
        });

        socket.on('user-left', () => {
          setRemoteStream(null);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          setConnectionState('disconnected');
        });
      } catch (err: any) {
        setError(err.message || 'Initialization error');
        setConnectionState('failed');
      }
    };

    initialize();

    return () => {
      cleanup();
    };
  }, [
    appointmentId,
    userId,
    userRole,
    signalingServerUrl,
    enabled,
    initializeLocalStream,
    createPeerConnection,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    cleanup,
    normalizedRoomId,
  ]);

  return {
    localStream,
    remoteStream,
    connectionState,
    error,
    isAudioOnly,
    mediaError,
    retryCameraAccess,
    toggleAudio,
    toggleVideo,
    endCall: cleanup,
    isAudioEnabled,
    isVideoEnabled,
  };
}