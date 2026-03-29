// ==========================================
// TRINETRA BACKEND - MAIN ENGINE (File 2)
// Exact Path: server.js
// Blueprint: Point 1 to 12 Core Router
// ==========================================
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load all 20 Asli Keys from .env
dotenv.config();

// Connect to Permanent Memory (MongoDB)
connectDB();

const app = express();

// Security: Allow all 6 Platforms (Web, Android, iOS, Windows, Mac, Linux)
app.use(cors({ origin: '*', credentials: true }));
// Support for large Media (PDF, Video, Audio)
app.use(express.json({ limit: '500mb' })); 
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Base Route Verification
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "TriNetra Master Backend is LIVE! 👁️🔥",
    gateways: "PayU, Braintree, Paddle, Adyen, PayPal Active. (Razorpay Blocked)"
  });
});

// ==========================================
// 💬 POINT 5: REAL-TIME ENGINE (WhatsApp 2.0)
// ==========================================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log(`[MATRIX] User Connected: ${socket.id}`);

  // Join 1-on-1 or Group Chat
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  // Real-time Message transfer (Text, Mic, Media)
  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`[MATRIX] User Disconnected`);
  });
});

// ==========================================
// 🚀 SERVER BOOT
// ==========================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`👁️🔥 TriNetra Server LIVE on Port ${PORT}`);
  console.log(`🔗 Permanent Database & Socket Engine Active`);
  console.log(`=================================`);
});
