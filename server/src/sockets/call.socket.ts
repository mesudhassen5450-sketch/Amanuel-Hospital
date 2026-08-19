import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

// Extended Socket interface with user authentication data
interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

// Event payload interfaces
interface InitiateCallData {
  patientId: string;
  doctorId: string;
}

interface UpdateCallStatusData {
  sessionId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'MISSED' | 'CANCELLED';
}

interface JoinQueueData {
  doctorId: string;
}

/**
 * Setup Socket.IO handlers for real-time call and queue management
 * Handles doctor-patient video call sessions with authentication
 */
export const setupCallSockets = (io: Server) => {
  console.log('[Socket.IO] Setting up call socket handlers...');

  // JWT Authentication Middleware for WebSocket connections
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      // Extract token from auth object or authorization header
      const token = 
        socket.handshake.auth.token || 
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        console.error('[Socket.IO] Authentication failed: No token provided');
        return next(new Error('Authentication error: Token missing'));
      }

      // Verify JWT token
      const jwtSecret = process.env.JWT_SECRET || 'amanuel_hospital_secure_jwt_secret_2026_key';
      const decoded = jwt.verify(token, jwtSecret) as { 
        id: string; 
        username: string;
        role: string 
      };

      // Attach user data to socket
      socket.user = decoded;
      console.log(`[Socket.IO] User authenticated: ${decoded.username} (${decoded.role})`);
      next();
    } catch (err: any) {
      console.error('[Socket.IO] Authentication error:', err.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection event handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id;
    const username = socket.user?.username;
    const userRole = socket.user?.role;

    console.log(`[Socket.IO] Client connected: ${username} (${userRole}) - Socket ID: ${socket.id}`);

    // Join personal notification room for direct messages
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] User ${username} joined room: user:${userId}`);
    }

    // Event: Join doctor-specific queue room
    socket.on('join_doctor_queue', ({ doctorId }: JoinQueueData) => {
      const roomName = `queue:doctor:${doctorId}`;
      socket.join(roomName);
      console.log(`[Socket.IO] ${username} joined queue room: ${roomName}`);
      
      socket.emit('queue_joined', { 
        doctorId, 
        roomName,
        message: 'Successfully joined doctor queue' 
      });
    });

    // Event: Doctor initiates call to patient
    socket.on('initiate_call', async (data: InitiateCallData) => {
      try {
        const { patientId, doctorId } = data;
        
        console.log(`[Socket.IO] Initiating call: Doctor ${doctorId} -> Patient ${patientId}`);

        // Generate unique channel name for this call session
        const channelName = `call_${doctorId}_${patientId}_${Date.now()}`;

        // Create call session in database
        const session = await prisma.callSession.create({
          data: {
            doctorId: BigInt(doctorId),
            patientId: BigInt(patientId),
            channelName,
            status: 'WAITING'
          }
        });

        const payload = {
          sessionId: session.id.toString(),
          doctorId: doctorId,
          patientId: patientId,
          channelName,
          status: 'WAITING',
          createdAt: session.createdAt.toISOString()
        };

        // Notify the specific patient about incoming call
        io.to(`user:${patientId}`).emit('incoming_call', payload);
        console.log(`[Socket.IO] Incoming call notification sent to patient ${patientId}`);

        // Notify doctor queue about call initiation
        io.to(`queue:doctor:${doctorId}`).emit('queue_updated', {
          type: 'CALL_INITIATED',
          payload
        });

        // Send confirmation to the caller
        socket.emit('call_initiated', {
          success: true,
          message: 'Call initiated successfully',
          ...payload
        });

        console.log(`[Socket.IO] Call session created: ${session.id}`);
      } catch (error: any) {
        console.error('[Socket.IO] Error initiating call:', error);
        socket.emit('call_error', { 
          message: 'Failed to initiate call session',
          error: error.message 
        });
      }
    });

    // Event: Update call status (accept, reject, complete, etc.)
    socket.on('update_call_status', async (data: UpdateCallStatusData) => {
      try {
        const { sessionId, status } = data;

        console.log(`[Socket.IO] Updating call ${sessionId} status to: ${status}`);

        // Update call session in database
        const session = await prisma.callSession.update({
          where: { id: BigInt(sessionId) },
          data: {
            status: status,
            startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
            endedAt: ['COMPLETED', 'MISSED', 'CANCELLED'].includes(status) ? new Date() : undefined
          }
        });

        const payload = {
          sessionId: session.id.toString(),
          doctorId: session.doctorId.toString(),
          patientId: session.patientId.toString(),
          channelName: session.channelName,
          status: session.status,
          startedAt: session.startedAt?.toISOString(),
          endedAt: session.endedAt?.toISOString()
        };

        // Broadcast status change to both doctor and patient
        io.to(`user:${session.patientId}`).emit('call_status_changed', payload);
        io.to(`user:${session.doctorId}`).emit('call_status_changed', payload);

        // Update doctor's queue
        io.to(`queue:doctor:${session.doctorId}`).emit('queue_updated', {
          type: 'STATUS_CHANGED',
          payload
        });

        // Confirm to the requester
        socket.emit('status_updated', {
          success: true,
          message: `Call status updated to ${status}`,
          ...payload
        });

        console.log(`[Socket.IO] Call ${sessionId} status updated to ${status}`);
      } catch (error: any) {
        console.error('[Socket.IO] Error updating call status:', error);
        socket.emit('call_error', {
          message: 'Failed to update call status',
          error: error.message
        });
      }
    });

    // Event: Get active calls for a doctor
    socket.on('get_active_calls', async ({ doctorId }: { doctorId: string }) => {
      try {
        const activeCalls = await prisma.callSession.findMany({
          where: {
            doctorId: BigInt(doctorId),
            status: {
              in: ['WAITING', 'IN_PROGRESS']
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        });

        const calls = activeCalls.map(call => ({
          sessionId: call.id.toString(),
          patientId: call.patientId.toString(),
          doctorId: call.doctorId.toString(),
          channelName: call.channelName,
          status: call.status,
          startedAt: call.startedAt?.toISOString(),
          createdAt: call.createdAt.toISOString()
        }));

        socket.emit('active_calls', {
          doctorId,
          calls,
          count: calls.length
        });

        console.log(`[Socket.IO] Retrieved ${calls.length} active calls for doctor ${doctorId}`);
      } catch (error: any) {
        console.error('[Socket.IO] Error getting active calls:', error);
        socket.emit('call_error', {
          message: 'Failed to retrieve active calls',
          error: error.message
        });
      }
    });

    // Event: Leave doctor queue
    socket.on('leave_doctor_queue', ({ doctorId }: JoinQueueData) => {
      const roomName = `queue:doctor:${doctorId}`;
      socket.leave(roomName);
      console.log(`[Socket.IO] ${username} left queue room: ${roomName}`);
      
      socket.emit('queue_left', {
        doctorId,
        message: 'Left doctor queue'
      });
    });

    // Event: Disconnect cleanup
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${username} (${userRole}) - Socket ID: ${socket.id}`);
      // Additional cleanup logic can be added here if needed
    });

    // Event: Heartbeat/ping for connection monitoring
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });
  });

  console.log('[Socket.IO] Call socket handlers initialized successfully');
};
