import { useEffect, useState, useCallback } from 'react';
import {
  initializeSocket,
  disconnectSocket,
  joinDoctorQueue,
  leaveDoctorQueue,
  initiateCall,
  updateCallStatus,
  getActiveCalls,
  onIncomingCall,
  onCallStatusChanged,
  onQueueUpdated,
  onActiveCalls,
  onCallInitiated,
  onCallError,
  onQueueJoined,
  removeListener,
  isConnected,
  type CallSession,
  type ActiveCallsResponse,
  type InitiateCallData,
  type UpdateCallStatusData,
} from '../api/socket-client';

interface UseCallSocketOptions {
  token: string | null;
  autoConnect?: boolean;
}

/**
 * Custom React hook for Socket.IO call & queue management
 * Handles connection, event listeners, and provides helper functions
 */
export const useCallSocket = ({ token, autoConnect = true }: UseCallSocketOptions) => {
  const [connected, setConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallSession | null>(null);
  const [callStatus, setCallStatus] = useState<CallSession | null>(null);
  const [activeCalls, setActiveCalls] = useState<ActiveCallsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!token || !autoConnect) return;

    console.log('[useCallSocket] Initializing socket connection with token');
    const socket = initializeSocket(token);

    // Update connection status
    const updateConnectionStatus = () => {
      setConnected(isConnected());
    };

    socket.on('connect', updateConnectionStatus);
    socket.on('disconnect', updateConnectionStatus);
    updateConnectionStatus();

    return () => {
      socket.off('connect', updateConnectionStatus);
      socket.off('disconnect', updateConnectionStatus);
    };
  }, [token, autoConnect]);

  // Setup event listeners
  useEffect(() => {
    if (!connected) return;

    console.log('[useCallSocket] Setting up event listeners');

    // Handle incoming call notifications
    const handleIncomingCall = (data: CallSession) => {
      console.log('[useCallSocket] Incoming call received:', data);
      setIncomingCall(data);
    };

    // Handle call status changes
    const handleCallStatusChanged = (data: CallSession) => {
      console.log('[useCallSocket] Call status changed:', data);
      setCallStatus(data);
    };

    // Handle active calls response
    const handleActiveCalls = (data: ActiveCallsResponse) => {
      console.log('[useCallSocket] Active calls received:', data);
      setActiveCalls(data);
    };

    // Handle call errors
    const handleCallError = (data: { message: string; error?: string }) => {
      console.error('[useCallSocket] Call error:', data);
      setError(data.message);
    };

    // Register listeners
    onIncomingCall(handleIncomingCall);
    onCallStatusChanged(handleCallStatusChanged);
    onActiveCalls(handleActiveCalls);
    onCallError(handleCallError);

    // Cleanup listeners on unmount
    return () => {
      removeListener('incoming_call', handleIncomingCall);
      removeListener('call_status_changed', handleCallStatusChanged);
      removeListener('active_calls', handleActiveCalls);
      removeListener('call_error', handleCallError);
    };
  }, [connected]);

  // Helper functions
  const connect = useCallback(
    (authToken: string) => {
      if (!authToken) {
        console.error('[useCallSocket] No token provided for connection');
        return;
      }
      initializeSocket(authToken);
      setConnected(isConnected());
    },
    []
  );

  const disconnect = useCallback(() => {
    disconnectSocket();
    setConnected(false);
    setIncomingCall(null);
    setCallStatus(null);
    setActiveCalls(null);
    setError(null);
  }, []);

  const joinQueue = useCallback((doctorId: string) => {
    try {
      joinDoctorQueue(doctorId);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const leaveQueue = useCallback((doctorId: string) => {
    try {
      leaveDoctorQueue(doctorId);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const startCall = useCallback((data: InitiateCallData) => {
    try {
      initiateCall(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const updateStatus = useCallback((data: UpdateCallStatusData) => {
    try {
      updateCallStatus(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchActiveCalls = useCallback((doctorId: string) => {
    try {
      getActiveCalls(doctorId);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const clearIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Connection state
    connected,
    
    // Call data
    incomingCall,
    callStatus,
    activeCalls,
    error,

    // Actions
    connect,
    disconnect,
    joinQueue,
    leaveQueue,
    startCall,
    updateStatus,
    fetchActiveCalls,
    clearIncomingCall,
    clearError,
  };
};
