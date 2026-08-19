# Real-Time Chat Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VIDEO CONSULTATION ROOM                          │
│                  (consultation.room.$id.tsx)                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Socket.IO Client
                              │ (Real-time)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CHAT SERVER                                    │
│                    (chat-server.js)                                 │
│                    Port: 3001                                       │
│                                                                     │
│  Features:                                                          │
│  • Room-based message routing                                      │
│  • User presence tracking                                          │
│  • Event broadcasting                                              │
│  • Connection management                                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Supabase Client
                              │ (Persistence)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUPABASE DATABASE                              │
│              Table: consultation_messages                           │
│                                                                     │
│  Stores:                                                            │
│  • Message history                                                 │
│  • Sender metadata                                                 │
│  • Timestamps                                                      │
│  • Read status                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Message Flow - Sending

```
┌──────────────┐
│   User A     │  1. Types message & presses Enter
│   (Doctor)   │  
└──────┬───────┘
       │
       │ 2. handleSendMessage()
       ▼
┌────────────────────────────────────────────────────┐
│  Frontend (consultation.room.$id.tsx)              │
│                                                    │
│  Step 1: Validate input                           │
│  Step 2: Save to Supabase ─────────────────┐      │
│  Step 3: Emit via Socket.IO                │      │
│  Step 4: Update local state                │      │
│  Step 5: Clear input                       │      │
└────────┬───────────────────────────────────┼──────┘
         │                                   │
         │ 3. emit('send-message')           │ 2. INSERT query
         ▼                                   ▼
┌──────────────────────────┐    ┌─────────────────────────┐
│   Chat Server            │    │   Supabase              │
│   (chat-server.js)       │    │   consultation_messages │
│                          │    │                         │
│  • Receives message      │    │  • Saves message        │
│  • Validates room        │    │  • Returns data         │
│  • Broadcasts to room    │    │  • Triggers updated_at  │
└────────┬─────────────────┘    └─────────────────────────┘
         │
         │ 4. broadcast to room participants
         │    (emit 'receive-message')
         ▼
┌──────────────────────────────────────────┐
│  User B's Browser                        │
│  (Patient)                               │
│                                          │
│  5. Socket listener receives message     │
│  6. Appends to local messages state      │
│  7. UI re-renders with new message       │
│  8. Auto-scrolls to bottom               │
└──────────────────────────────────────────┘
```

## Message Flow - Receiving

```
User A sends message
        │
        ▼
   Chat Server
        │
        ├─────────────┬─────────────┬─────────────┐
        │             │             │             │
        ▼             ▼             ▼             ▼
   User A       User B (same   User C (same   User D (different
   (sender)      room)          room)          room)
        │             │             │             │
        │             ▼             ▼             │
        │      Receives msg   Receives msg       │
        │      (real-time)    (real-time)        │
        │                                         │
        │◄────────────────────────────────────────┘
        Does NOT receive                  Does NOT receive
        (own message)                     (different room)
```

## Room Isolation

```
┌─────────────────────────────────────────────────────────────┐
│                    Chat Server Rooms                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Room: apt_123                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  • Doctor_Smith (socket_abc123)                       │ │
│  │  • Patient_John (socket_def456)                       │ │
│  │                                                        │ │
│  │  Messages isolated to this room only                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Room: apt_456                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  • Doctor_Jane (socket_ghi789)                        │ │
│  │  • Patient_Mary (socket_jkl012)                       │ │
│  │                                                        │ │
│  │  Separate conversation, no cross-talk                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│  User Opens Consultation Room                                │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  Component Mount (useEffect)                                 │
│                                                              │
│  1. Fetch appointment details                               │
│  2. Initialize Socket.IO connection                         │
│  3. Emit 'join-room' event                                  │
│  4. Set up message listeners                                │
│  5. Fetch historical messages from Supabase                 │
│  6. Initialize WebRTC for video                             │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  Active Consultation                                         │
│                                                              │
│  • Video call running (WebRTC)                              │
│  • Chat active (Socket.IO)                                  │
│  • Messages displayed in sidebar                            │
│  • Real-time message sync                                   │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  User Sends Message                                          │
│                                                              │
│  1. User types and presses Enter                            │
│  2. handleSendMessage() executes                            │
│  3. Save to Supabase                                        │
│  4. Emit via Socket.IO                                      │
│  5. Update local state                                      │
│  6. Clear input                                             │
│  7. Auto-scroll                                             │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  Other User Receives Message                                 │
│                                                              │
│  1. Socket listener fires                                   │
│  2. New message appended to state                           │
│  3. UI re-renders                                           │
│  4. Auto-scroll to bottom                                   │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  Component Unmount (Cleanup)                                 │
│                                                              │
│  1. Emit 'leave-room' event                                 │
│  2. Disconnect Socket.IO                                    │
│  3. Stop WebRTC streams                                     │
│  4. Clean up refs                                           │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐                           ┌─────────────┐
│   Doctor    │                           │   Patient   │
│   Browser   │                           │   Browser   │
└──────┬──────┘                           └──────┬──────┘
       │                                         │
       │ Socket.IO                Socket.IO     │
       │ Connection                Connection   │
       │                                         │
       └──────────┬──────────────┬──────────────┘
                  │              │
                  ▼              ▼
       ┌───────────────────────────────┐
       │     Chat Server (Port 3001)   │
       │                               │
       │  • io.on('connection')        │
       │  • socket.on('join-room')     │
       │  • socket.on('send-message')  │
       │  • socket.to(room).emit()     │
       └───────────┬───────────────────┘
                   │
                   │ Supabase Client
                   │
                   ▼
       ┌───────────────────────────────┐
       │   Supabase PostgreSQL         │
       │                               │
       │   consultation_messages       │
       │   ├─ id (UUID)                │
       │   ├─ appointment_id (TEXT)    │
       │   ├─ room_id (TEXT)           │
       │   ├─ sender_id (TEXT)         │
       │   ├─ sender_name (TEXT)       │
       │   ├─ sender_role (TEXT)       │
       │   ├─ message (TEXT)           │
       │   ├─ created_at (TIMESTAMPTZ) │
       │   └─ updated_at (TIMESTAMPTZ) │
       └───────────────────────────────┘
```

## Technology Stack

```
┌────────────────────────────────────────────────────────┐
│  Frontend Layer                                        │
├────────────────────────────────────────────────────────┤
│  • React 19                                            │
│  • TanStack Router                                     │
│  • Socket.IO Client                                    │
│  • Supabase JS Client                                  │
│  • TypeScript                                          │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│  Real-Time Layer                                       │
├────────────────────────────────────────────────────────┤
│  • Socket.IO Server (Node.js)                          │
│  • WebSocket Protocol                                  │
│  • Room-based Broadcasting                             │
│  • Event-driven Architecture                           │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│  Persistence Layer                                     │
├────────────────────────────────────────────────────────┤
│  • Supabase (PostgreSQL)                               │
│  • Row Level Security (RLS)                            │
│  • Real-time Subscriptions                             │
│  • Automatic Timestamps                                │
└────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Client (Browser)                                       │
│  • Authenticated user session                           │
│  • JWT token from Supabase                              │
└────────────┬────────────────────────────────────────────┘
             │
             │ Socket.IO Connection
             │ (Can add JWT verification)
             ▼
┌─────────────────────────────────────────────────────────┐
│  Chat Server                                            │
│  • CORS validation                                      │
│  • Room isolation                                       │
│  • Event validation                                     │
└────────────┬────────────────────────────────────────────┘
             │
             │ Supabase Client + API Key
             ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase                                               │
│  • Row Level Security (RLS)                             │
│  • Authenticated user policies                          │
│  • SQL injection prevention                             │
│  • Encrypted connections                                │
└─────────────────────────────────────────────────────────┘
```

## Event Flow Summary

| Event | Source | Destination | Purpose |
|-------|--------|-------------|---------|
| `join-room` | Client | Server | Join consultation room |
| `leave-room` | Client | Server | Leave consultation room |
| `send-message` | Client | Server | Send new message |
| `receive-message` | Server | Client(s) | Broadcast message to room |
| `user-joined` | Server | Client(s) | Notify of new user |
| `user-left` | Server | Client(s) | Notify of user leaving |
| `room-info` | Server | Client | Send room metadata |

## Performance Considerations

```
┌─────────────────────────────────────────────────────┐
│  Optimization Strategy                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Database Indexing                               │
│     • appointment_id (messages by consultation)     │
│     • created_at DESC (chronological order)         │
│     • room_id (fast room lookups)                   │
│                                                     │
│  2. Message Pagination                              │
│     • Load recent 50 messages initially             │
│     • Lazy load older messages on scroll            │
│                                                     │
│  3. Connection Pooling                              │
│     • Reuse Socket.IO connections                   │
│     • Automatic reconnection on disconnect          │
│                                                     │
│  4. Memory Management                               │
│     • Clean up closed rooms                         │
│     • Remove disconnected sockets                   │
│                                                     │
│  5. Network Optimization                            │
│     • WebSocket for low latency                     │
│     • Fallback to polling if needed                 │
│     • Compress large messages                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Visual Message Bubble Design

```
┌─────────────────────────────────────────────────┐
│  Chat Interface                                 │
│                                                 │
│  ┌──────────────────────────────┐              │
│  │ Dr. Smith                    │  ← Sender    │
│  │ Hello, how are you feeling?  │              │
│  │ 10:45 AM                     │  ← Time      │
│  └──────────────────────────────┘              │
│                                                 │
│               ┌──────────────────────────────┐ │
│     Sender → │                   Patient_123 │ │
│               │ I have a headache, doctor    │ │
│     Time → │                        10:46 AM │ │
│               └──────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Left-aligned (gray)**: Other user's messages  
**Right-aligned (blue)**: Current user's messages

---

**Architecture Complete** ✅
