import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// यह लाइन Render/GitHub Secrets से आपकी चाबियाँ खुद खींच लेगी
dotenv.config();

// डेटाबेस (परमानेंट मेमोरी) कनेक्ट करें
connectDB();

const app = express();

// Point 1: 6-Platform Support
app.use(cors({ origin: '*', credentials: true }));

// Point 4: Heavy Media Support (Original Quality Uploads)
app.use(express.json({ limit: '500mb' })); 
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Base Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "TriNetra Master Backend is LIVE! 👁️🔥",
    gateways: "PayU, Braintree, Paddle, Adyen, PayPal Active. (Razorpay Blocked)"
  });
});

// ==========================================
// 💬 POINT 5: WhatsApp 2.0 (Socket Engine)
// ==========================================
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`[MATRIX] User Connected: ${socket.id}`);
  
  socket.on('join_room', (roomId) => socket.join(roomId));
  socket.on('send_message', (data) => socket.to(data.roomId).emit('receive_message', data));
  
  socket.on('disconnect', () => console.log(`[MATRIX] User Disconnected`));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`👁️🔥 TriNetra Server LIVE on Port ${PORT}`);
  console.log(`=================================================`);
});
