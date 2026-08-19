# Socket.IO Real-Time Call & Queue System Documentation

## Overview

This document describes the Socket.IO-based real-time communication system for the Dr. Amanuel Hospital telemedicine platform. The system handles doctor-patient video consultation queue management, active call notifications, and call status synchronization.

## Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Authentication](#authentication)
6. [Events Reference](#events-reference)
7. [Usage Examples](#usage-examples)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Architecture

### System Components

```
┌─────────────┐          WebSocket/JWT          ┌─────────────┐
│   Frontend  │ ◄──────────────────────────────► │   Backend   │
│   (React)   │                                   │  (Express)  │
└─────────────┘                                   └─────────────┘
      │                                                  │
      │  useCallSocket Hook                             │  setupCallSockets
      │  socket-client.ts                               │  call.socket.ts
      │                                                  │
      └──────────────────┐                    ┌─────────┘
                         │                    │
                         ▼                    ▼
                    Socket.IO Server (Port 3001)
                              │
                              ▼
                    ┌──────────────────┐
                    │  PostgreSQL DB   │
                    │  call_sessions   │
                    └──────────────────┘
```

### Room Architecture

- **Personal Rooms**: `user:{userId}` - Direct notifications to specific users
- **Queue Rooms**: `queue:doctor:{doctorId}` - Queue updates for doctors and watchers

---

## Database Schema

### CallStatus Enum

```prisma
enum CallStatus {
  WAITING       // Call initiated, waiting for patient response
  IN_PROGRESS   // Call accepted and ongoing
  COMPLETED     // Call ended successfully
  MISSED        // Patient didn't respond
  CANCELLED     // Call cancelled by either party
}
```

### CallSession Model

```prisma
model CallSession {
  id          BigInt      @id @default(autoincrement())
  patientId   BigInt      @map("patient_id")
  doctorId    BigInt      @map("doctor_id")
  channelName String      @unique @map("channel_name")
  status      CallStatus  @default(WAITING)
  startedAt   DateTime?   @map("started_at")
  endedAt     DateTime?   @map("ended_at")
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  @@index([doctorId, status])
  @@index([patientId, status])
  @@map("call_sessions")
}
```

**Indexes**:
- `(doctorId, status)` - Optimizes queries for doctor's active calls
- `(patientId, status)` - Optimizes queries for patient's call history

---

## Backend Implementation

### File Structure

```
server/
├── src/
│   ├── sockets/
│   │   └── call.socket.ts          # Socket.IO event handlers
│   ├── server.ts                    # Socket.IO server initialization
│   └── prisma/
│       └── schema.prisma            # Database schema
└── test-socket.js                   # Test suite
```

### JWT Authentication Middleware

The Socket.IO server requires JWT authentication for all connections:

```typescript
io.use((socket: AuthenticatedSocket, next) => {
  const token = socket.handshake.auth.token || 
                socket.handshake.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  socket.user = decoded;
  next();
});
```

### Event Handlers

#### `join_doctor_queue`
Join a doctor's queue room to receive queue updates.

**Payload**:
```typescript
{ doctorId: string }
```

**Response**: `queue_joined`
```typescript
{
  doctorId: string;
  roomName: string;
  message: string;
}
```

#### `initiate_call`
Doctor initiates a call to a patient. Creates a CallSession record in the database.

**Payload**:
```typescript
{
  doctorId: string;
  patientId: string;
}
```

**Response**: `call_initiated`
```typescript
{
  success: boolean;
  sessionId: string;
  doctorId: string;
  patientId: string;
  channelName: string;
  status: 'WAITING';
  createdAt: string;
  message: string;
}
```

**Broadcasts**:
- `incoming_call` to `user:{patientId}` - Notifies patient
- `queue_updated` to `queue:doctor:{doctorId}` - Updates queue watchers

#### `update_call_status`
Update the status of an ongoing call.

**Payload**:
```typescript
{
  sessionId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'MISSED' | 'CANCELLED';
}
```

**Response**: `status_updated`
```typescript
{
  success: boolean;
  message: string;
  sessionId: string;
  doctorId: string;
  patientId: string;
  channelName: string;
  status: CallStatus;
  startedAt?: string;
  endedAt?: string;
}
```

**Broadcasts**:
- `call_status_changed` to both `user:{patientId}` and `user:{doctorId}`
- `queue_updated` to `queue:doctor:{doctorId}`

**Timestamps**:
- `IN_PROGRESS` → Sets `startedAt`
- `COMPLETED`, `MISSED`, `CANCELLED` → Sets `endedAt`

#### `get_active_calls`
Retrieve all active calls for a doctor (WAITING or IN_PROGRESS).

**Payload**:
```typescript
{ doctorId: string }
```

**Response**: `active_calls`
```typescript
{
  doctorId: string;
  count: number;
  calls: Array<{
    sessionId: string;
    patientId: string;
    doctorId: string;
    channelName: string;
    status: 'WAITING' | 'IN_PROGRESS';
    startedAt?: string;
    createdAt: string;
  }>;
}
```

#### `leave_doctor_queue`
Leave a doctor's queue room.

**Payload**:
```typescript
{ doctorId: string }
```

**Response**: `queue_left`
```typescript
{
  doctorId: string;
  message: string;
}
```

#### `ping`
Test connection and monitor latency.

**Response**: `pong`
```typescript
{ timestamp: string }
```

---

## Frontend Implementation

### File Structure

```
src/
├── lib/
│   ├── api/
│   │   └── socket-client.ts        # Socket.IO client service
│   └── hooks/
│       └── useCallSocket.ts        # React hook for Socket.IO
```

### Socket Client Service

**Initialize Connection**:
```typescript
import { initializeSocket } from '@/lib/api/socket-client';

const socket = initializeSocket(jwtToken);
```

**Emit Events**:
```typescript
import { initiateCall, updateCallStatus, getActiveCalls } from '@/lib/api/socket-client';

// Initiate a call
initiateCall({ doctorId: '1', patientId: '100' });

// Update call status
updateCallStatus({ sessionId: '1', status: 'IN_PROGRESS' });

// Get active calls
getActiveCalls('1');
```

**Listen to Events**:
```typescript
import { onIncomingCall, onCallStatusChanged } from '@/lib/api/socket-client';

onIncomingCall((data) => {
  console.log('Incoming call:', data);
  // Show notification to patient
});

onCallStatusChanged((data) => {
  console.log('Call status changed:', data);
  // Update UI
});
```

**Cleanup**:
```typescript
import { disconnectSocket, removeListener } from '@/lib/api/socket-client';

// Remove specific listener
removeListener('incoming_call', callbackFunction);

// Disconnect
disconnectSocket();
```

### React Hook Usage

```typescript
import { useCallSocket } from '@/lib/hooks/useCallSocket';

function DoctorQueue() {
  const token = getAuthToken(); // Your JWT token
  const doctorId = getCurrentDoctorId();
  
  const {
    connected,
    incomingCall,
    callStatus,
    activeCalls,
    error,
    joinQueue,
    startCall,
    updateStatus,
    fetchActiveCalls,
    clearError
  } = useCallSocket({ token, autoConnect: true });

  useEffect(() => {
    if (connected && doctorId) {
      joinQueue(doctorId);
      fetchActiveCalls(doctorId);
    }
  }, [connected, doctorId]);

  const handleInitiateCall = (patientId: string) => {
    startCall({ doctorId, patientId });
  };

  const handleAcceptCall = (sessionId: string) => {
    updateStatus({ sessionId, status: 'IN_PROGRESS' });
  };

  return (
    <div>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      {incomingCall && <IncomingCallNotification call={incomingCall} />}
      {error && <ErrorAlert message={error} onClose={clearError} />}
      {activeCalls && <ActiveCallsList calls={activeCalls.calls} />}
    </div>
  );
}
```

---

## Authentication

### Connection Authentication

All Socket.IO connections require a valid JWT token. The token can be provided in two ways:

1. **Auth object** (recommended):
```typescript
const socket = io('http://localhost:3001', {
  auth: { token: 'your-jwt-token' }
});
```

2. **Authorization header**:
```typescript
const socket = io('http://localhost:3001', {
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token'
  }
});
```

### Token Requirements

- **Algorithm**: HS256
- **Secret**: `process.env.JWT_SECRET`
- **Payload**:
  ```json
  {
    "id": "6",
    "username": "admin",
    "role": "ADMIN",
    "iat": 1787167525,
    "exp": 1787253925
  }
  ```

### Obtaining a Token

Login via REST API:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6",
    "username": "admin",
    "role": "ADMIN"
  }
}
```

---

## Events Reference

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_doctor_queue` | `{ doctorId: string }` | Join doctor's queue room |
| `leave_doctor_queue` | `{ doctorId: string }` | Leave doctor's queue room |
| `initiate_call` | `{ doctorId: string, patientId: string }` | Start a new call session |
| `update_call_status` | `{ sessionId: string, status: CallStatus }` | Update call status |
| `get_active_calls` | `{ doctorId: string }` | Get doctor's active calls |
| `ping` | - | Connection health check |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `queue_joined` | `{ doctorId, roomName, message }` | Confirmation of queue join |
| `queue_left` | `{ doctorId, message }` | Confirmation of queue leave |
| `incoming_call` | `CallSession` | Notifies patient of incoming call |
| `call_initiated` | `{ success, sessionId, ... }` | Confirmation of call initiation |
| `call_status_changed` | `CallSession` | Notifies status change |
| `status_updated` | `{ success, message, ... }` | Confirmation of status update |
| `queue_updated` | `{ type, payload }` | Queue change notification |
| `active_calls` | `{ doctorId, count, calls }` | Active calls list |
| `call_error` | `{ message, error }` | Error notification |
| `pong` | `{ timestamp }` | Ping response |

### Connection Events

| Event | Description |
|-------|-------------|
| `connect` | Successfully connected to server |
| `disconnect` | Disconnected from server |
| `connect_error` | Connection failed (auth error, network) |
| `reconnect` | Successfully reconnected |
| `reconnect_error` | Reconnection attempt failed |
| `reconnect_failed` | All reconnection attempts failed |

---

## Usage Examples

### Example 1: Doctor Queue Dashboard

```typescript
import { useEffect } from 'react';
import { useCallSocket } from '@/lib/hooks/useCallSocket';

function DoctorQueueDashboard() {
  const token = localStorage.getItem('auth_token');
  const doctorId = '1';
  
  const {
    connected,
    activeCalls,
    callStatus,
    joinQueue,
    fetchActiveCalls,
    startCall,
    updateStatus
  } = useCallSocket({ token, autoConnect: true });

  useEffect(() => {
    if (connected) {
      joinQueue(doctorId);
      fetchActiveCalls(doctorId);
      
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchActiveCalls(doctorId);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [connected, doctorId]);

  const handleCallPatient = (patientId: string) => {
    startCall({ doctorId, patientId });
  };

  const handleEndCall = (sessionId: string) => {
    updateStatus({ sessionId, status: 'COMPLETED' });
  };

  return (
    <div>
      <h1>Doctor Queue Dashboard</h1>
      <p>Connection: {connected ? '🟢 Online' : '🔴 Offline'}</p>
      
      <h2>Active Calls ({activeCalls?.count || 0})</h2>
      {activeCalls?.calls.map(call => (
        <div key={call.sessionId}>
          <p>Patient: {call.patientId}</p>
          <p>Status: {call.status}</p>
          <button onClick={() => handleEndCall(call.sessionId)}>
            End Call
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Patient Incoming Call Notification

```typescript
import { useEffect, useState } from 'react';
import { useCallSocket } from '@/lib/hooks/useCallSocket';

function PatientCallHandler() {
  const token = localStorage.getItem('auth_token');
  const [showNotification, setShowNotification] = useState(false);
  
  const {
    connected,
    incomingCall,
    updateStatus,
    clearIncomingCall
  } = useCallSocket({ token, autoConnect: true });

  useEffect(() => {
    if (incomingCall) {
      setShowNotification(true);
      // Play notification sound
      new Audio('/notification.mp3').play();
    }
  }, [incomingCall]);

  const handleAccept = () => {
    if (incomingCall) {
      updateStatus({
        sessionId: incomingCall.sessionId,
        status: 'IN_PROGRESS'
      });
      // Navigate to video call page
      window.location.href = `/call/${incomingCall.channelName}`;
    }
    setShowNotification(false);
    clearIncomingCall();
  };

  const handleReject = () => {
    if (incomingCall) {
      updateStatus({
        sessionId: incomingCall.sessionId,
        status: 'CANCELLED'
      });
    }
    setShowNotification(false);
    clearIncomingCall();
  };

  if (!showNotification || !incomingCall) return null;

  return (
    <div className="incoming-call-notification">
      <h3>Incoming Call from Doctor</h3>
      <p>Doctor ID: {incomingCall.doctorId}</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
}
```

### Example 3: Call Status Monitoring

```typescript
import { useEffect, useState } from 'react';
import { useCallSocket } from '@/lib/hooks/useCallSocket';

function CallStatusMonitor({ sessionId }: { sessionId: string }) {
  const token = localStorage.getItem('auth_token');
  const [currentStatus, setCurrentStatus] = useState<string>('WAITING');
  
  const { connected, callStatus } = useCallSocket({ 
    token, 
    autoConnect: true 
  });

  useEffect(() => {
    if (callStatus && callStatus.sessionId === sessionId) {
      setCurrentStatus(callStatus.status);
      
      // Handle status changes
      switch (callStatus.status) {
        case 'IN_PROGRESS':
          console.log('Call started at:', callStatus.startedAt);
          break;
        case 'COMPLETED':
          console.log('Call ended at:', callStatus.endedAt);
          break;
        case 'MISSED':
          console.log('Call was missed');
          break;
        case 'CANCELLED':
          console.log('Call was cancelled');
          break;
      }
    }
  }, [callStatus, sessionId]);

  return (
    <div>
      <h3>Call Status</h3>
      <p>Current Status: {currentStatus}</p>
      <StatusIndicator status={currentStatus} />
    </div>
  );
}
```

---

## Testing

### Automated Test Suite

Run the automated test suite:

```bash
cd server
node test-socket.js
```

**Tests Included**:
1. ✅ Authentication - Reject unauthenticated connections
2. ✅ Authentication - Accept valid JWT tokens
3. ✅ Queue Management - Join doctor queue
4. ✅ Call Initiation - Create CallSession
5. ✅ Status Update - Update to IN_PROGRESS
6. ✅ Active Calls - Query active calls
7. ✅ Call Completion - Update to COMPLETED
8. ✅ Ping/Pong - Connection monitoring

### Manual Testing with Browser Console

```javascript
// Connect with token
const socket = io('http://localhost:3001', {
  auth: { token: 'YOUR_JWT_TOKEN_HERE' }
});

// Listen to all events
socket.onAny((eventName, ...args) => {
  console.log(`Event: ${eventName}`, args);
});

// Test events
socket.emit('join_doctor_queue', { doctorId: '1' });
socket.emit('initiate_call', { doctorId: '1', patientId: '100' });
socket.emit('get_active_calls', { doctorId: '1' });
```

### Testing with Postman or Thunder Client

1. Login to get JWT token:
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

2. Copy the token from response
3. Use Socket.IO client with the token

---

## Troubleshooting

### Common Issues

#### 1. Authentication Error: Token Missing

**Problem**: Connection fails with "Authentication error: Token missing"

**Solution**:
```typescript
// Make sure token is provided in auth object
const socket = io('http://localhost:3001', {
  auth: { token: yourToken }  // ✅ Correct
});

// Not like this:
const socket = io('http://localhost:3001'); // ❌ Wrong
```

#### 2. Authentication Error: Invalid Token

**Problem**: Connection fails with "Authentication error: Invalid token"

**Causes**:
- Expired token
- Wrong JWT_SECRET
- Malformed token

**Solution**:
- Get a fresh token by logging in again
- Verify `JWT_SECRET` in `server/.env` matches the secret used to sign tokens
- Check token format (should be three base64 parts separated by dots)

#### 3. Call Error: Session Not Found

**Problem**: `update_call_status` fails with session not found

**Solution**:
- Verify the sessionId exists in database
- Check that you're using the sessionId returned from `call_initiated` event
- Ensure BigInt IDs are converted to strings

#### 4. Not Receiving Events

**Problem**: Event listeners not triggering

**Solution**:
```typescript
// Register listeners AFTER connection
socket.on('connect', () => {
  socket.on('incoming_call', handleIncomingCall);
  socket.on('call_status_changed', handleStatusChange);
});
```

#### 5. Reconnection Issues

**Problem**: Socket not reconnecting after disconnect

**Solution**:
```typescript
const socket = io('http://localhost:3001', {
  auth: { token: yourToken },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});
```

### Debug Mode

Enable Socket.IO debug logging:

**Server**:
```bash
# Windows PowerShell
$env:DEBUG="socket.io:*"; npm run dev

# Linux/Mac
DEBUG=socket.io:* npm run dev
```

**Client**:
```typescript
localStorage.setItem('debug', 'socket.io-client:*');
```

### Health Check

Test server health:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-08-19T19:25:47.029Z"
}
```

---

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:8080

# JWT Secret for Socket.IO authentication
JWT_SECRET=amanuel_hospital_secure_jwt_secret_2026_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/amanuel_hospital
```

### Frontend (.env)

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001
```

---

## Performance Considerations

1. **Connection Pooling**: Each user maintains a single persistent WebSocket connection
2. **Room Efficiency**: Users only join rooms relevant to them (personal + subscribed queues)
3. **Database Indexes**: Optimized queries with indexes on `(doctorId, status)` and `(patientId, status)`
4. **Event Throttling**: Consider debouncing frequent events like `get_active_calls`
5. **Memory Management**: Clean up event listeners when components unmount

---

## Security Considerations

1. **JWT Authentication**: All connections require valid JWT tokens
2. **Authorization**: Verify user permissions before emitting sensitive events
3. **Rate Limiting**: Consider implementing rate limits for event emissions
4. **Input Validation**: All event payloads are validated on the server
5. **CORS**: Restrict origins in production environment

---

## Future Enhancements

- [ ] Add call recording metadata
- [ ] Implement call rating system
- [ ] Add queue position notifications
- [ ] Support multiple concurrent calls per doctor
- [ ] Add call transfer functionality
- [ ] Implement admin monitoring dashboard
- [ ] Add WebRTC signaling through Socket.IO
- [ ] Support scheduled calls

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review server logs: `server/logs/socket-io.log`
3. Run the test suite: `node server/test-socket.js`
4. Check database state: `npx prisma studio`

---

## License

Copyright © 2026 Dr. Amanuel Hospital. All rights reserved.
