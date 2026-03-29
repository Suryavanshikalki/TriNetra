// ==========================================
// TRINETRA SUPER APP - REAL-TIME SOCKET (File 35)
// Point 5: Real WhatsApp 2.0 Engine
// ==========================================
import { io } from 'socket.io-client';

// 100% REAL: Direct Connection to Render WebSocket
const SOCKET_URL = 'https://trinetra-umys.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Security check
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ['websocket'], // Faster & Stable
});

// Helper for Chat Rooms (Point 5 Rule)
export const joinChatRoom = (userId, friendId) => {
  const roomId = [userId, friendId].sort().join('_');
  socket.emit('join_room', roomId);
  return roomId;
};

// Real-time Listeners
export const onMessageReceived = (callback) => {
  socket.on('receive_message', (data) => {
    callback(data);
  });
};

export default socket;
