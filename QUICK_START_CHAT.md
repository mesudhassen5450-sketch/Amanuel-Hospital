# 🚀 Quick Start Guide - Real-Time Chat

## Prerequisites
- Node.js installed
- npm or yarn package manager
- Supabase project set up
- Socket.IO dependency installed

## Step 1: Install Dependencies (if not done)
```bash
npm install socket.io
```

## Step 2: Run Database Migration
1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase-consultation-chat.sql`
4. Paste and execute in SQL Editor
5. Verify table created: `consultation_messages`

## Step 3: Start the Chat Server
Open a terminal and run:
```bash
npm run chat:server
```

Or directly:
```bash
node chat-server.js
```

You should see:
```
╔══════════════════════════════════════════════════════════╗
║  Real-Time Chat Server for Video Consultation            ║
║  Running on: http://localhost:3001                       ║
║  Ready to handle real-time messaging                     ║
╚══════════════════════════════════════════════════════════╝
```

## Step 4: Start the Frontend
Open a **second terminal** and run:
```bash
npm run dev
```

## Step 5: Test the Chat
1. Open browser window 1: Navigate to a consultation room
   ```
   http://localhost:5173/consultation/room/<appointment-id>
   ```

2. Open browser window 2 (or incognito): Navigate to the SAME room
   ```
   http://localhost:5173/consultation/room/<same-appointment-id>
   ```

3. Send a message from window 1
   - Type message in input field
   - Press Enter or click Send button
   - Message should appear in window 1 (right-aligned, blue)

4. Check window 2
   - Message should instantly appear (left-aligned, gray)

5. Send a message from window 2
   - Should appear in both windows

## 🎉 Success Indicators

### Chat Server Running:
- Console shows server startup banner
- No error messages
- Port 3001 is listening

### Frontend Running:
- Vite dev server on port 5173 (or configured port)
- No console errors about Socket.IO connection

### Chat Working:
- Messages appear instantly in both windows
- User's messages are blue (right-aligned)
- Other's messages are gray (left-aligned)
- Sender name displayed above message
- Timestamp shown below message
- Input field clears after sending
- Chat auto-scrolls to bottom

## 🐛 Troubleshooting

### "Cannot connect to server" Error
**Problem**: Chat server not running
**Solution**: Run `npm run chat:server` in a separate terminal

### Messages Not Appearing in Real-Time
**Problem**: Socket.IO connection failed
**Solution**: 
1. Check chat server is running
2. Check console for Socket.IO errors
3. Verify port 3001 is not blocked by firewall

### Messages Not Persisting
**Problem**: Database not configured
**Solution**: Run the migration from `supabase-consultation-chat.sql`

### "Module not found: socket.io"
**Problem**: Dependency not installed
**Solution**: Run `npm install socket.io`

## 📝 Quick Test Commands

### Check if Chat Server Port is Open:
```bash
# Windows PowerShell
Test-NetConnection -ComputerName localhost -Port 3001
```

### View Chat Server Logs:
The chat server logs connections and messages in real-time:
```
[Socket.IO] Client connected: <socket-id>
[Socket.IO] User <user-id> (doctor) joined room: apt_123
[Socket.IO] Message in room apt_123: Hello doctor
```

### Check Supabase Messages:
In Supabase SQL Editor:
```sql
SELECT * FROM consultation_messages 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔥 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run chat:server` | Start chat server only |
| `npm run dev` | Start frontend only |
| `node chat-server.js` | Start chat server (alternative) |
| `npm install socket.io` | Install Socket.IO server |

## 💡 Pro Tips

1. **Keep Both Terminals Open**: 
   - Terminal 1: Chat server (port 3001)
   - Terminal 2: Frontend dev server (port 5173)

2. **Test with Different Users**:
   - Use regular browser for doctor
   - Use incognito/private window for patient

3. **Monitor Chat Server**:
   - Watch the chat server terminal for connection logs
   - Helps debug connection issues

4. **Check Browser Console**:
   - Look for Socket.IO connection status
   - Check for any JavaScript errors

## ✅ Verification Checklist

- [ ] Socket.IO dependency installed
- [ ] Database migration executed successfully
- [ ] Chat server running on port 3001
- [ ] Frontend running on port 5173 (or configured port)
- [ ] Two browser windows open to same room
- [ ] Messages send successfully
- [ ] Messages appear in real-time
- [ ] Historical messages load on page refresh
- [ ] Auto-scroll works
- [ ] Sender names display correctly
- [ ] Timestamps display correctly

## 🎯 Next Steps

Once basic chat is working:
1. Test with actual doctor and patient accounts
2. Verify RLS policies in production
3. Update Socket.IO URL for production deployment
4. Configure CORS for production frontend URL
5. Add SSL/TLS for secure WebSocket connections

## 📚 Additional Resources

- **Full Documentation**: See `CHAT_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Database Schema**: See `supabase-consultation-chat.sql`
- **Server Code**: See `chat-server.js`
- **Frontend Code**: See `src/routes/consultation.room.$id.tsx`

---

**Ready to chat! 💬**
