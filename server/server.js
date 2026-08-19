import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// REST endpoint for ICE/STUN/TURN server configuration
app.get('/api/webrtc/ice-servers', (req, res) => {
  // Standard STUN servers (free, public)
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ];

  // TURN server configuration (for production, use a service like Twilio, coturn, or metered.ca)
  // For local development, we'll use a free public TURN server or omit it
  // Uncomment and configure for production:
  /*
  iceServers.push({
    urls: 'turn:your-turn-server.com:3478',
    username: 'your-username',
    credential: 'your-credential',
    credentialType: 'password'
  });
  */

  res.json({
    iceServers,
    iceTransportPolicy: 'all'
  });
});

// CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store room participants
const rooms = new Map();

// Helper function to normalize room ID
const normalizeRoomId = (roomId) => {
  if (!roomId) return roomId;
  const cleanId = String(roomId).replace(/^apt_/, '');
  return `apt_${cleanId}`;
};

// Validate appointment access (in production, this would check against your database)
const validateRoomAccess = async (socket, roomId, userId, userRole) => {
  // For now, we'll allow basic validation
  // In production, verify that userId has access to this appointment
  console.log(`Validating access: Room ${roomId}, User ${userId}, Role ${userRole}`);
  return true;
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle doctor channel registration
  socket.on('register-doctor', ({ doctorId, doctorUsername }) => {
    const docKey = (doctorUsername || doctorId || '').toLowerCase().trim();
    if (!docKey) return;
    const roomName = `doctor_${docKey}`;
    socket.join(roomName);
    console.log(`[SocketServer] Doctor registered: socket ${socket.id} -> channel ${roomName}`);
    socket.emit('doctor-registered', { success: true, channel: roomName });
  });

  // Handle incoming call dispatch (post-payment)
  socket.on('incoming-call', (data) => {
    const { doctorUsername, doctorId, appointmentId, patientName, primaryComplaint, roomUrl } = data || {};
    const docKey = (doctorUsername || doctorId || '').toLowerCase().trim();
    console.log(`[SocketServer] Received incoming-call for doctor: "${docKey}", appointment: ${appointmentId}`);

    const payload = {
      appointmentId: String(appointmentId),
      id: String(appointmentId),
      patientName: patientName || 'Patient',
      primaryComplaint: primaryComplaint || 'Video Consultation',
      doctorUsername: docKey,
      roomUrl: roomUrl || `/consultation/room/${appointmentId}`,
      roomId: `room_${appointmentId}`,
      createdAt: new Date().toISOString()
    };

    if (docKey) {
      io.to(`doctor_${docKey}`).emit('incoming-call', payload);
      console.log(`[SocketServer] Emitted incoming-call to room doctor_${docKey}`);
    }
    // Also emit broadcast so any listening doctor interface receives notification
    socket.broadcast.emit('incoming-call', payload);
  });

  // Handle call accept
  socket.on('accept-call', ({ appointmentId, doctorUsername }) => {
    console.log(`[SocketServer] Call accepted for appointment ${appointmentId} by doctor ${doctorUsername}`);
    const normalizedRoomId = normalizeRoomId(appointmentId);
    io.to(normalizedRoomId).emit('call-accepted', { appointmentId, doctorUsername });
  });

  // Handle call decline
  socket.on('decline-call', ({ appointmentId, doctorUsername }) => {
    console.log(`[SocketServer] Call declined for appointment ${appointmentId} by doctor ${doctorUsername}`);
    const normalizedRoomId = normalizeRoomId(appointmentId);
    io.to(normalizedRoomId).emit('call-declined', { appointmentId, doctorUsername });
  });

  // Handle patient payment completion
  socket.on('patient-paid', ({ appointmentId }) => {
    console.log(`[SocketServer] Patient paid for appointment ${appointmentId}`);
    io.emit('patient-paid', { appointmentId });
  });

  // Handle room join
  socket.on('join-room', async ({ roomId, userId, userRole }) => {
    try {
      // Normalize room ID
      const normalizedRoomId = normalizeRoomId(roomId);
      console.log(`Normalized room ID: ${roomId} -> ${normalizedRoomId}`);

      // Leave previous rooms to prevent ghost socket accumulation
      Array.from(socket.rooms).forEach((room) => {
        if (room !== socket.id) socket.leave(room);
      });

      // Validate room access
      const hasAccess = await validateRoomAccess(socket, normalizedRoomId, userId, userRole);
      if (!hasAccess) {
        socket.emit('error', { message: 'Unauthorized access to this room' });
        return;
      }

      // Join the room
      socket.join(normalizedRoomId);
      socket.data.userId = userId;
      socket.data.role = userRole;

      // Initialize room if it doesn't exist
      if (!rooms.has(normalizedRoomId)) {
        rooms.set(normalizedRoomId, new Map());
      }
      
      const room = rooms.get(normalizedRoomId);
      room.set(socket.id, { userId, userRole, socket });
      
      console.log(`User ${userId} (${userRole}) joined room ${normalizedRoomId}, size: ${room.size}`);
      
      // Notify others in the room
      socket.to(normalizedRoomId).emit('user-joined', {
        socketId: socket.id,
        userId,
        userRole,
        role: userRole,
        participantsCount: room.size
      });
      
      // Send room metadata back to caller
      socket.emit('room-info', {
        mySocketId: socket.id,
        participantsCount: room.size
      });

      // Send current room participants to the new joiner
      const participants = Array.from(room.entries()).map(([id, data]) => ({
        socketId: id,
        userId: data.userId,
        userRole: data.userRole
      }));
      
      socket.emit('room-participants', participants);
      
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle SDP offer
  socket.on('sdp-offer', ({ roomId, offer }) => {
    const normalizedRoomId = normalizeRoomId(roomId);
    // Broadcast offer to all other clients in room
    socket.to(normalizedRoomId).emit('sdp-offer', {
      offer,
      senderId: socket.id
    });
    console.log(`SDP offer sent from ${socket.id} to room ${normalizedRoomId}`);
  });

  // Handle SDP answer
  socket.on('sdp-answer', ({ roomId, answer }) => {
    const normalizedRoomId = normalizeRoomId(roomId);
    // Broadcast answer to all other clients in room
    socket.to(normalizedRoomId).emit('sdp-answer', {
      answer,
      senderId: socket.id
    });
    console.log(`SDP answer sent from ${socket.id} to room ${normalizedRoomId}`);
  });

  // Handle ICE candidates
  socket.on('ice-candidate', ({ roomId, candidate }) => {
    const normalizedRoomId = normalizeRoomId(roomId);
    // Broadcast candidate to all other clients in room
    socket.to(normalizedRoomId).emit('ice-candidate', {
      candidate,
      senderId: socket.id
    });
    console.log(`ICE candidate sent from ${socket.id} to room ${normalizedRoomId}`);
  });

  // Handle room leave
  socket.on('leave-room', ({ roomId }) => {
    const normalizedRoomId = normalizeRoomId(roomId);
    const room = rooms.get(normalizedRoomId);
    if (room) {
      room.delete(socket.id);
      socket.leave(normalizedRoomId);
      
      // Notify others
      socket.to(normalizedRoomId).emit('user-left', {
        socketId: socket.id
      });
      
      // Clean up empty rooms
      if (room.size === 0) {
        rooms.delete(normalizedRoomId);
      }
      
      console.log(`User ${socket.id} left room ${normalizedRoomId}`);
    }
  });

  // ========== CHAT MESSAGE HANDLER ==========
  // Handle real-time chat messages
  socket.on('send-message', (data) => {
    console.log('[Socket.IO] ===== MESSAGE RECEIVED =====');
    console.log('[Socket.IO] Message content:', data.message);
    console.log('[Socket.IO] Sender:', data.sender_name, `(${data.sender_id})`);
    console.log('[Socket.IO] Room ID:', data.room_id || data.roomId);
    
    // Support both roomId and room_id formats
    const normalizedRoomId = normalizeRoomId(data.room_id || data.roomId);
    console.log('[Socket.IO] Normalized Room ID:', normalizedRoomId);
    
    // Broadcast to everyone in the room INCLUDING sender (for multi-device support)
    io.to(normalizedRoomId).emit('receive-message', data);
    
    console.log('[Socket.IO] Message broadcasted to room:', normalizedRoomId);
    console.log('[Socket.IO] ===========================');
  });
  // ==========================================

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Remove from all rooms and notify others
    for (const [roomId, room] of rooms.entries()) {
      if (room.has(socket.id)) {
        room.delete(socket.id);
        socket.to(roomId).emit('user-left', {
          socketId: socket.id
        });
        
        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        }
      }
    }
  });

  // Handle disconnecting (fires before disconnect, while socket is still in rooms)
  socket.on('disconnecting', () => {
    console.log(`Client disconnecting: ${socket.id}`);
    
    // Notify all rooms the socket is leaving
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) { // Skip the default room
        socket.to(roomId).emit('user-left', {
          socketId: socket.id
        });
      }
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${PORT}`);
  console.log(`CORS enabled for: http://localhost:8080, http://localhost:3000, http://localhost:5173`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
