# Real-Time Chat Messaging Setup

## Overview
Real-time text messaging has been implemented in the video consultation room using Socket.IO and Supabase for persistence.

## Architecture

### Frontend (`consultation.room.$id.tsx`)
- **Socket.IO Client**: Real-time bidirectional communication
- **Supabase**: Message persistence and historical data
- **React State**: Local message management with auto-scroll

### Backend (`chat-server.js`)
- **Socket.IO Server**: Handles real-time message routing
- **Room Management**: Tracks active users in consultation rooms
- **Event Handling**: join-room, leave-room, send-message, receive-message

### Database (`consultation_messages` table)
```sql
- id (UUID, primary key)
- appointment_id (TEXT, indexed)
- room_id (TEXT, indexed)
- sender_id (TEXT)
- sender_name (TEXT)
- sender_role ('doctor' | 'patient')
- message (TEXT)
- message_type ('text' | 'system')
- is_read (BOOLEAN)
- created_at (TIMESTAMPTZ, indexed)
- updated_at (TIMESTAMPTZ)
```

## Setup Instructions

### 1. Install Socket.IO Server Dependency
```bash
npm install socket.io
```

### 2. Run Database Migration
Execute the SQL schema in your Supabase project:
```bash
# Copy contents of supabase-consultation-chat.sql
# Paste into Supabase SQL Editor
# Run the migration
```

### 3. Start the Chat Server
```bash
node chat-server.js
```
The server will start on `http://localhost:3001`

### 4. Start the Frontend
```bash
npm run dev
```

## Features Implemented

### ✅ Real-Time Messaging
- Instant message delivery via Socket.IO
- Automatic room joining based on appointment ID
- Bidirectional communication between doctor and patient

### ✅ Message Persistence
- All messages saved to Supabase
- Historical messages loaded on room entry
- Message metadata tracked (sender, role, timestamp)

### ✅ UI/UX Enhancements
- **User Messages**: Right-aligned, blue background
- **Other Messages**: Left-aligned, gray background
- **Auto-scroll**: Chat scrolls to bottom on new message
- **Enter to Send**: Press Enter key to send message
- **Sender Name Display**: Shows who sent each message
- **Timestamp**: Shows message time in local format

### ✅ Connection Management
- Auto-connect on room load
- Clean disconnect on component unmount
- Room-based message isolation
- User presence tracking

## Message Flow

### Sending a Message:
1. User types message and clicks Send or presses Enter
2. Message saved to Supabase `consultation_messages` table
3. Socket.IO emits `send-message` event to room
4. Message added to local state
5. Input field cleared
6. Chat auto-scrolls to bottom

### Receiving a Message:
1. Socket.IO server broadcasts `receive-message` to room participants
2. Client receives message via Socket.IO listener
3. Message appended to local state
4. Chat auto-scrolls to bottom
5. UI updates to show new message

## Room ID Format
```
Room ID: apt_<appointmentId>
Example: apt_123e4567-e89b-12d3-a456-426614174000
```

## Environment Variables
No additional environment variables needed. The chat server uses:
- **Port**: 3001 (configurable via `CHAT_PORT`)
- **CORS**: Allows all origins (update in production)

## Security Considerations

### Implemented:
- Row Level Security (RLS) on Supabase table
- Authenticated user policies
- Room-based message isolation

### Production Recommendations:
1. Update CORS settings in `chat-server.js` to specific frontend URL
2. Add JWT authentication to Socket.IO connections
3. Implement rate limiting for message sending
4. Add profanity/content filtering
5. Enable SSL/TLS for Socket.IO in production
6. Set up proper environment variables

## Testing

### Test the Chat:
1. Open two browser windows/tabs
2. Navigate to the same consultation room in both
3. Log in as doctor in one, patient in the other
4. Send messages from each side
5. Verify messages appear in real-time on both sides
6. Refresh page and verify historical messages load

### Verify Database:
```sql
-- Check messages for an appointment
SELECT * FROM consultation_messages 
WHERE appointment_id = 'your_appointment_id'
ORDER BY created_at DESC;
```

## Troubleshooting

### Messages not appearing in real-time:
- Check if chat server is running on port 3001
- Verify Socket.IO connection in browser console
- Check for CORS errors in network tab

### Messages not persisting:
- Verify Supabase connection
- Check RLS policies are configured
- Review browser console for Supabase errors

### Socket.IO connection errors:
- Ensure chat server is running
- Check firewall settings for port 3001
- Verify WebSocket support in browser

## Future Enhancements
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File/image attachments
- [ ] Message reactions
- [ ] Message editing/deletion
- [ ] Push notifications for new messages
- [ ] Message search functionality
- [ ] Export chat transcript

## API Events Reference

### Client → Server:
- `join-room`: Join a consultation room
- `leave-room`: Leave a consultation room
- `send-message`: Send a new message
- `typing-start`: User started typing
- `typing-stop`: User stopped typing

### Server → Client:
- `receive-message`: New message received
- `user-joined`: Another user joined the room
- `user-left`: Another user left the room
- `room-info`: Current room information
- `user-typing`: Typing indicator update
