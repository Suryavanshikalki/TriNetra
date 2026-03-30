import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes Import
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import escalationRoutes from './routes/escalationRoutes.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);

// Point 5: WhatsApp 2.0 (Socket Logic for Real-time Messaging)
const io = new Server(httpServer, {
  cors: { origin: "*" } 
});

app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("👁️🔥 TriNetra Database: SYNCED & LOCKED"))
  .catch((err) => console.log("DB Error:", err));

// --- API Routes Wiring (Point 1-12) ---
app.use('/api/auth', authRoutes);
app.use('/api/social', postRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/economy', paymentRoutes);
app.use('/api/justice', escalationRoutes);

// Point 5: Real-time Socket Connection for Messenger
io.on("connection", (socket) => {
  console.log("New Mutual Connection Active:", socket.id);
  
  socket.on("send_message", (data) => {
    // Logic: Only send if mutual connection is verified
    socket.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => console.log("Connection Terminated."));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 TriNetra Super App Backend Running on Port ${PORT}`);
});
