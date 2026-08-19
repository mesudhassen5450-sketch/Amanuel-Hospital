# Test Guide - Consultation Room Fixes

## 🎯 What Was Fixed

1. **Audio Cleanup** - Ringtone stops immediately when entering room
2. **Message Send Handler** - Input clears instantly for better UX
3. **Socket.IO Listener** - Real-time messages work correctly

---

## 🧪 Test Scenarios

### Test 1: Audio Cleanup (Ringtone Fix)

**Setup:**
1. Have a pending video call/consultation
2. Let the ringtone/notification sound play
3. Click to join the consultation room

**Expected Result:**
✅ Ringtone/audio stops **immediately** when room loads  
✅ No lingering sounds continue playing  
✅ Console shows: `[Audio Cleanup] Stopping all audio elements on room mount`

**How to Verify:**
- Open browser developer console (F12)
- Look for the audio cleanup log message
- Listen for immediate silence on room entry

---

### Test 2: Message Sending (Instant Input Clear)

**Setup:**
1. Start chat server: `npm run chat:server`
2. Start frontend: `npm run dev`
3. Open consultation room
4. Type a message in the chat input

**Test 2A: Send with Enter Key**
1. Type: "Hello doctor"
2. Press Enter
3. ✅ Input field clears **immediately**
4. ✅ Message appears in chat (right-aligned, blue)
5. ✅ Timestamp shows below message

**Test 2B: Send with Button Click**
1. Type: "I have a headache"
2. Click the Send button (blue circle with arrow)
3. ✅ Input field clears **immediately**
4. ✅ Message appears in chat
5. ✅ Chat auto-scrolls to bottom

**Test 2C: Error Handling**
1. Disconnect internet/network
2. Type: "Test message"
3. Press Enter
4. ✅ Message fails to send (check console)
5. ✅ Message text is **restored** to input field
6. ✅ User can edit and retry

---

### Test 3: Real-Time Message Receiving

**Setup:**
1. Open consultation room in **two browser windows**
   - Window 1: Regular browser (as Doctor)
   - Window 2: Incognito/Private (as Patient)
2. Navigate to **same consultation room** in both

**Test 3A: Doctor → Patient**
1. In Window 1 (Doctor): Type "Hello patient"
2. Press Enter
3. ✅ Message appears in Window 1 (right-aligned, blue)
4. ✅ Message appears **instantly** in Window 2 (left-aligned, gray)
5. ✅ Sender name shows "Dr. [username]"

**Test 3B: Patient → Doctor**
1. In Window 2 (Patient): Type "Hello doctor"
2. Press Enter
3. ✅ Message appears in Window 2 (right-aligned, blue)
4. ✅ Message appears **instantly** in Window 1 (left-aligned, gray)
5. ✅ Sender name shows patient name

**Test 3C: Multiple Messages**
1. Send 5 messages rapidly from Window 1
2. ✅ All messages appear in correct order in Window 2
3. ✅ No messages lost or duplicated
4. ✅ Timestamps are sequential
5. ✅ Chat auto-scrolls to bottom

---

### Test 4: Message Persistence

**Setup:**
1. Have an active consultation with messages
2. Refresh the page (F5)

**Expected Result:**
✅ Page reloads successfully  
✅ All historical messages load from database  
✅ Messages appear in chronological order  
✅ Sender names and timestamps display correctly  
✅ Can send new messages after refresh  

---

### Test 5: Socket.IO Connection

**Test 5A: Successful Connection**
1. Start chat server first
2. Start frontend
3. Open consultation room
4. ✅ Check browser console for Socket.IO logs
5. ✅ Should see: `[Chat] Received message:` for incoming messages

**Test 5B: Server Not Running**
1. Stop chat server
2. Open consultation room
3. ✅ Console shows: `[Chat] Socket connection error:`
4. ✅ Can still view historical messages
5. ✅ New messages won't send (expected)

**Test 5C: Reconnection**
1. Start with server running
2. Stop server
3. Wait 5 seconds
4. Restart server
5. ✅ Socket.IO should attempt reconnection
6. ✅ New messages work again

---

## 🎨 Visual Verification Guide

### Message Bubble Appearance

**Your Messages (Right-aligned, Blue):**
```
                    ┌─────────────────────┐
                    │ Your Name           │
                    │ Hello doctor        │
                    │ 10:30 AM            │
                    └─────────────────────┘
```

**Other User's Messages (Left-aligned, Gray):**
```
┌─────────────────────┐
│ Dr. Smith           │
│ Hello, how are you? │
│ 10:31 AM            │
└─────────────────────┘
```

### Input Field Behavior

**Before Send:**
```
┌────────────────────────────────────┐
│ 📎  Hello doctor                [↗]│
└────────────────────────────────────┘
```

**After Send (Immediate):**
```
┌────────────────────────────────────┐
│ 📎  Type a message...          [↗]│
└────────────────────────────────────┘
```

---

## 🐛 Known Issues to Watch For

### Issue: Messages Not Appearing
**Possible Causes:**
- Chat server not running
- Socket.IO connection failed
- Different room IDs in windows

**How to Fix:**
1. Verify chat server is running: `npm run chat:server`
2. Check browser console for errors
3. Confirm both windows use same URL

### Issue: Input Not Clearing
**Possible Causes:**
- JavaScript error in send handler
- Network error preventing message save

**How to Fix:**
1. Check browser console for errors
2. Verify Supabase connection
3. Check network tab for failed requests

### Issue: Audio Still Playing
**Possible Causes:**
- Audio element created after mount
- Different audio source

**How to Fix:**
1. Check if audio cleanup runs (console log)
2. Verify audio element is in DOM
3. May need to stop specific audio instance

---

## ✅ Success Criteria

### All Tests Pass When:

**Audio Cleanup:**
- [ ] Ringtone stops immediately on room entry
- [ ] Console shows cleanup log
- [ ] No audio continues playing

**Message Sending:**
- [ ] Input clears immediately on send
- [ ] Message appears in local chat
- [ ] Message saved to database
- [ ] Other user receives message in real-time

**Message Receiving:**
- [ ] Messages appear instantly
- [ ] Correct sender name displayed
- [ ] Correct timestamp displayed
- [ ] Proper alignment (left/right)
- [ ] Auto-scroll works

**Error Handling:**
- [ ] Message restored on send failure
- [ ] Console logs show errors
- [ ] User can retry sending

**Persistence:**
- [ ] Messages survive page refresh
- [ ] Historical messages load correctly
- [ ] Database contains all messages

---

## 📊 Performance Benchmarks

### Expected Timing:
- **Input Clear**: < 50ms (instant)
- **Message Appears Locally**: < 100ms
- **Real-Time Delivery**: < 200ms
- **Database Save**: < 500ms
- **Audio Stop**: < 50ms (on mount)

### Network Usage:
- **Per Message**: ~500 bytes (JSON)
- **Initial Load**: ~2KB (historical messages)
- **Socket.IO Overhead**: ~1KB (connection)

---

## 🚀 Quick Test Commands

### Start Everything:
```bash
# Terminal 1: Chat Server
npm run chat:server

# Terminal 2: Frontend
npm run dev
```

### Test URLs:
```
Frontend: http://localhost:5173
Chat Server: http://localhost:3001
Consultation Room: http://localhost:5173/consultation/room/<appointment-id>
```

### Check Database:
```sql
-- View recent messages
SELECT * FROM consultation_messages 
ORDER BY created_at DESC 
LIMIT 10;

-- Count messages for room
SELECT COUNT(*) FROM consultation_messages 
WHERE appointment_id = 'your_appointment_id';
```

---

## 📝 Test Report Template

```
Date: _______________
Tester: _______________

Test 1: Audio Cleanup
[ ] Pass  [ ] Fail  Notes: _______________________

Test 2: Message Sending
[ ] Pass  [ ] Fail  Notes: _______________________

Test 3: Real-Time Receiving
[ ] Pass  [ ] Fail  Notes: _______________________

Test 4: Message Persistence
[ ] Pass  [ ] Fail  Notes: _______________________

Test 5: Socket.IO Connection
[ ] Pass  [ ] Fail  Notes: _______________________

Overall Status: [ ] Pass  [ ] Fail

Issues Found:
1. _______________________
2. _______________________
3. _______________________
```

---

**Ready to Test!** 🧪✨

Run through each test scenario and check off the success criteria. If all tests pass, the fixes are working correctly!
