/**
 * Test script for Socket.IO Call & Queue System
 * Tests JWT authentication and basic event flow
 */

import { io } from 'socket.io-client';

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzg3MTY3NTI1LCJleHAiOjE3ODcyNTM5MjV9.W-qda0GVHK_ZYa_dOSb85w1kgEjg7luX8w7GMQW1tUw';

console.log('🧪 Socket.IO Call & Queue System Test\n');
console.log('Backend URL:', BACKEND_URL);
console.log('Testing JWT authentication and event flow...\n');

// Test 1: Connection without token (should fail)
console.log('📋 Test 1: Connection without token (expected to fail)');
const socketNoAuth = io(BACKEND_URL, {
  transports: ['websocket', 'polling'],
});

socketNoAuth.on('connect_error', (error) => {
  console.log('✅ Test 1 PASSED: Connection rejected without token');
  console.log('   Error message:', error.message, '\n');
  socketNoAuth.disconnect();
  
  // Proceed to Test 2
  runTest2();
});

socketNoAuth.on('connect', () => {
  console.log('❌ Test 1 FAILED: Connection should have been rejected\n');
  socketNoAuth.disconnect();
  process.exit(1);
});

// Test 2: Connection with valid token (should succeed)
function runTest2() {
  console.log('📋 Test 2: Connection with JWT token');
  
  const socket = io(BACKEND_URL, {
    auth: {
      token: TEST_TOKEN
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Test 2 PASSED: Connected successfully with JWT token');
    console.log('   Socket ID:', socket.id, '\n');
    
    // Run Test 3
    runTest3(socket);
  });

  socket.on('connect_error', (error) => {
    console.log('❌ Test 2 FAILED: Connection error:', error.message);
    console.log('   Make sure JWT_SECRET matches between test and server');
    console.log('   Or generate a valid token by logging in first\n');
    process.exit(1);
  });
}

// Test 3: Join doctor queue
function runTest3(socket) {
  console.log('📋 Test 3: Join doctor queue');
  
  const testDoctorId = '1';
  
  socket.on('queue_joined', (data) => {
    console.log('✅ Test 3 PASSED: Successfully joined doctor queue');
    console.log('   Response:', JSON.stringify(data, null, 2), '\n');
    
    // Run Test 4
    runTest4(socket, testDoctorId);
  });

  socket.emit('join_doctor_queue', { doctorId: testDoctorId });
}

// Test 4: Initiate a call
function runTest4(socket, doctorId) {
  console.log('📋 Test 4: Initiate a call from doctor to patient');
  
  const callData = {
    doctorId: doctorId,
    patientId: '100'
  };
  
  socket.on('call_initiated', (data) => {
    console.log('✅ Test 4 PASSED: Call initiated successfully');
    console.log('   Call Session ID:', data.sessionId);
    console.log('   Channel Name:', data.channelName);
    console.log('   Status:', data.status, '\n');
    
    // Run Test 5
    runTest5(socket, data.sessionId);
  });

  socket.on('call_error', (error) => {
    console.log('❌ Test 4 FAILED: Call initiation error');
    console.log('   Error:', error.message);
    console.log('   Details:', error.error, '\n');
    socket.disconnect();
    process.exit(1);
  });

  socket.emit('initiate_call', callData);
}

// Test 5: Update call status
function runTest5(socket, sessionId) {
  console.log('📋 Test 5: Update call status to IN_PROGRESS');
  
  const statusUpdate = {
    sessionId: sessionId,
    status: 'IN_PROGRESS'
  };
  
  socket.on('status_updated', (data) => {
    console.log('✅ Test 5 PASSED: Call status updated successfully');
    console.log('   Session ID:', data.sessionId);
    console.log('   New Status:', data.status);
    console.log('   Started At:', data.startedAt, '\n');
    
    // Run Test 6
    runTest6(socket, sessionId);
  });

  socket.emit('update_call_status', statusUpdate);
}

// Test 6: Get active calls
function runTest6(socket, sessionId) {
  console.log('📋 Test 6: Get active calls for doctor');
  
  const doctorId = '1';
  
  socket.on('active_calls', (data) => {
    console.log('✅ Test 6 PASSED: Retrieved active calls');
    console.log('   Doctor ID:', data.doctorId);
    console.log('   Active Calls Count:', data.count);
    console.log('   Calls:', JSON.stringify(data.calls, null, 2), '\n');
    
    // Run Test 7
    runTest7(socket, sessionId);
  });

  socket.emit('get_active_calls', { doctorId: doctorId });
}

// Test 7: Complete the call
function runTest7(socket, sessionId) {
  console.log('📋 Test 7: Complete the call');
  
  const statusUpdate = {
    sessionId: sessionId,
    status: 'COMPLETED'
  };
  
  socket.on('status_updated', (data) => {
    console.log('✅ Test 7 PASSED: Call completed successfully');
    console.log('   Session ID:', data.sessionId);
    console.log('   Final Status:', data.status);
    console.log('   Ended At:', data.endedAt, '\n');
    
    // Run Test 8
    runTest8(socket);
  });

  socket.emit('update_call_status', statusUpdate);
}

// Test 8: Ping/Pong
function runTest8(socket) {
  console.log('📋 Test 8: Test ping/pong');
  
  socket.on('pong', (data) => {
    console.log('✅ Test 8 PASSED: Ping/pong working');
    console.log('   Server Timestamp:', data.timestamp, '\n');
    
    // All tests passed
    console.log('🎉 ALL TESTS PASSED! Socket.IO Call & Queue System is working correctly.\n');
    socket.disconnect();
    process.exit(0);
  });

  socket.emit('ping');
}

// Error handler
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});
