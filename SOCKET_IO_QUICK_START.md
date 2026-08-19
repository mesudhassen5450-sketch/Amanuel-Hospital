# Socket.IO Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- ✅ Server running on port 3001
- ✅ Valid JWT token from login
- ✅ PostgreSQL database with call_sessions table

---

## Backend Setup

### 1. Database Migration
```bash
cd server
npx prisma db push
```

### 2. Start Server
```bash
npm run dev
```

You should see:
```
[Socket.IO] Call socket handlers initialized successfully
[Socket.IO] Real-time call & queue system initialized
```

---

## Frontend Integration

### Quick Example - React Component

```typescript
import { useEffect } from 'react';
import { useCallSocket } from '@/lib/hooks/useCallSocket';

function MyComponent() {
  const token = localStorage.getItem('auth_token');
  const doctorId = '1';
  
  const {
    connected,
    incomingCall,
    activeCalls,
    startCall,
    updateStatus,
    joinQueue,
    fetchActiveCalls
  } = useCallSocket({ token, autoConnect: true });

  // Join queue when connected
  useEffect(() => {
    if (connected && doctorId) {
      joinQueue(doctorId);
      fetchActiveCalls(doctorId);
    }
  }, [connected, doctorId]);

  // Handle incoming call
  useEffect(() => {
    if (incomingCall) {
      alert(`Incoming call from doctor ${incomingCall.doctorId}`);
    }
  }, [incomingCall]);

  // Initiate a call
  const makeCall = () => {
    startCall({ doctorId: '1', patientId: '100' });
  };

  // Accept call
  const acceptCall = (sessionId: string) => {
    updateStatus({ sessionId, status: 'IN_PROGRESS' });
  };

  return (
    <div>
      <p>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      <button onClick={makeCall}>Call Patient 100</button>
      {activeCalls && <p>Active Calls: {activeCalls.count}</p>}
    </div>
  );
}
```

---

## Essential Events

### Doctor Workflow

```typescript
// 1. Join queue
socket.emit('join_doctor_queue', { doctorId: '1' });

// 2. Initiate call
socket.emit('initiate_call', { 
  doctorId: '1', 
  patientId: '100' 
});

// 3. Get active calls
socket.emit('get_active_calls', { doctorId: '1' });

// 4. Listen for responses
socket.on('call_initiated', (data) => {
  console.log('Call started:', data.sessionId);
});
```

### Patient Workflow

```typescript
// 1. Listen for incoming calls
socket.on('incoming_call', (call) => {
  console.log('Incoming call:', call);
  showNotification(call);
});

// 2. Accept call
socket.emit('update_call_status', {
  sessionId: call.sessionId,
  status: 'IN_PROGRESS'
});

// 3. End call
socket.emit('update_call_status', {
  sessionId: call.sessionId,
  status: 'COMPLETED'
});
```

---

## Testing

### Get JWT Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Run Test Suite
```bash
cd server
node test-socket.js
```

Expected output:
```
🎉 ALL TESTS PASSED! Socket.IO Call & Queue System is working correctly.
```

---

## Common Patterns

### Pattern 1: Auto-reconnect with Token Refresh
```typescript
const [token, setToken] = useState(getStoredToken());

useEffect(() => {
  const refreshToken = async () => {
    const newToken = await refreshAuthToken();
    setToken(newToken);
  };
  
  socket.on('connect_error', (error) => {
    if (error.message.includes('token')) {
      refreshToken();
    }
  });
}, []);
```

### Pattern 2: Queue Position Tracking
```typescript
const [queuePosition, setQueuePosition] = useState(0);

socket.on('queue_updated', (data) => {
  if (data.type === 'CALL_INITIATED') {
    // Recalculate position
    fetchActiveCalls(doctorId);
  }
});
```

### Pattern 3: Call Timer
```typescript
const [callDuration, setCallDuration] = useState(0);

socket.on('call_status_changed', (call) => {
  if (call.status === 'IN_PROGRESS') {
    const interval = setInterval(() => {
      const start = new Date(call.startedAt);
      const duration = Math.floor((Date.now() - start.getTime()) / 1000);
      setCallDuration(duration);
    }, 1000);
    
    return () => clearInterval(interval);
  }
});
```

---

## Event Flow Diagram

### Doctor Initiates Call
```
Doctor                   Server                   Patient
  |                        |                         |
  |-- initiate_call ------>|                         |
  |                        |--- incoming_call ------>|
  |<--- call_initiated ----|                         |
  |                        |                         |
```

### Patient Accepts Call
```
Patient                  Server                   Doctor
  |                        |                         |
  |-- update_call_status ->|                         |
  |   (IN_PROGRESS)        |                         |
  |<--- status_updated ----|                         |
  |                        |-- call_status_changed ->|
  |                        |                         |
```

---

## Troubleshooting Checklist

- [ ] Server is running on port 3001
- [ ] JWT_SECRET is set in server/.env
- [ ] Database is accessible and migrated
- [ ] Token is valid and not expired
- [ ] CORS_ORIGIN includes your frontend URL
- [ ] Socket.IO client version matches server (4.8.3)

---

## API Reference

| Event | Direction | Payload | Response |
|-------|-----------|---------|----------|
| `join_doctor_queue` | C→S | `{doctorId}` | `queue_joined` |
| `initiate_call` | C→S | `{doctorId, patientId}` | `call_initiated` |
| `update_call_status` | C→S | `{sessionId, status}` | `status_updated` |
| `get_active_calls` | C→S | `{doctorId}` | `active_calls` |
| `incoming_call` | S→C | `CallSession` | - |
| `call_status_changed` | S→C | `CallSession` | - |

C→S = Client to Server  
S→C = Server to Client

---

## Next Steps

1. ✅ Read full documentation: `SOCKET_IO_DOCUMENTATION.md`
2. ✅ Run test suite: `node server/test-socket.js`
3. ✅ Integrate with your components using `useCallSocket` hook
4. ✅ Add error handling and loading states
5. ✅ Test with real doctor-patient scenarios

---

## Support

- 📖 Full Documentation: `SOCKET_IO_DOCUMENTATION.md`
- 🧪 Test Suite: `server/test-socket.js`
- 🔧 Backend Code: `server/src/sockets/call.socket.ts`
- ⚛️ Frontend Hook: `src/lib/hooks/useCallSocket.ts`
