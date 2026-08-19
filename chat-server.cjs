/**
 * Real-Time Chat Server for Video Consultation
 * Socket.IO server for handling real-time messaging during consultations
 * 
 * To run: node chat-server.js
 * Server runs on http://localhost:3001
 */

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*', // Update this to your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.CHAT_PORT || 3001;

// Store active rooms and users
const activeRooms = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Handle user joining a consultation room
  socket.on('join-room', ({ roomId, userId, userRole }) => {
    socket.join(roomId);
    
    console.log(`[Socket.IO] ===== USER JOINING ROOM =====`);
    console.log(`[Socket.IO] Room ID: ${roomId}`);
    console.log(`[Socket.IO] User ID: ${userId}`);
    console.log(`[Socket.IO] User Role: ${userRole}`);
    console.log(`[Socket.IO] Socket ID: ${socket.id}`);
    
    // Track user in room
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
      console.log(`[Socket.IO] Created new room: ${roomId}`);
    }
    activeRooms.get(roomId).add({ socketId: socket.id, userId, userRole });

    const roomSize = activeRooms.get(roomId).size;
    console.log(`[Socket.IO] Room ${roomId} now has ${roomSize} user(s)`);
    console.log(`[Socket.IO] ==============================`);
    
    // Notify other users in the room
    socket.to(roomId).emit('user-joined', { userId, userRole });
    
    // Send current room info back to the user
    const roomUsers = Array.from(activeRooms.get(roomId));
    socket.emit('room-info', { roomId, users: roomUsers });
  });

  // Handle user leaving a consultation room
  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    
    // Remove user from room tracking
    if (activeRooms.has(roomId)) {
      const roomUsers = activeRooms.get(roomId);
      roomUsers.forEach(user => {
        if (user.socketId === socket.id) {
          roomUsers.delete(user);
        }
      });
      
      // Clean up empty rooms
      if (roomUsers.size === 0) {
        activeRooms.delete(roomId);
      }
    }

    console.log(`[Socket.IO] User ${userId} left room: ${roomId}`);
    socket.to(roomId).emit('user-left', { userId });
  });

  // Handle sending messages
  socket.on('send-message', (messageData) => {
    const { roomId, room_id } = messageData;
    const actualRoomId = roomId || room_id; // Support both formats
    
    console.log(`[Socket.IO] ===== MESSAGE RECEIVED =====`);
    console.log(`[Socket.IO] Room ID: ${actualRoomId}`);
    console.log(`[Socket.IO] Message: ${messageData.message}`);
    console.log(`[Socket.IO] Sender: ${messageData.sender_name} (${messageData.sender_id})`);
    console.log(`[Socket.IO] Broadcasting to room...`);
    
    // Broadcast message to all users in the room EXCEPT sender
    socket.to(actualRoomId).emit('receive-message', messageData);
    
    console.log(`[Socket.IO] Message broadcasted to room: ${actualRoomId}`);
    console.log(`[Socket.IO] ===========================`);
  });

  // Handle typing indicators
  socket.on('typing-start', ({ roomId, userId, userName }) => {
    socket.to(roomId).emit('user-typing', { userId, userName, isTyping: true });
  });

  socket.on('typing-stop', ({ roomId, userId }) => {
    socket.to(roomId).emit('user-typing', { userId, isTyping: false });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    
    // Clean up user from all rooms
    activeRooms.forEach((users, roomId) => {
      users.forEach(user => {
        if (user.socketId === socket.id) {
          users.delete(user);
          socket.to(roomId).emit('user-left', { userId: user.userId });
        }
      });
      
      // Clean up empty rooms
      if (users.size === 0) {
        activeRooms.delete(roomId);
      }
    });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`[Socket.IO] Socket error:`, error);
  });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Real-Time Chat Server for Video Consultation            ║
║  Running on: http://localhost:${PORT}                      ║
║  Ready to handle real-time messaging                     ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Socket.IO] SIGTERM received, closing server...');
  server.close(() => {
    console.log('[Socket.IO] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Socket.IO] SIGINT received, closing server...');
  server.close(() => {
    console.log('[Socket.IO] Server closed');
    process.exit(0);
  });
});
