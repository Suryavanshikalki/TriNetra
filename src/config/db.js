// ==========================================
// TRINETRA BACKEND - DATABASE (File 3)
// Exact Path: config/db.js
// Blueprint Point: 11 - Permanent Human-Brain Memory
// ==========================================
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Requires process.env.MONGODB_URI from your Keys
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🟢 TriNetra MongoDB Connected: ${conn.connection.host}`);
    console.log(`🛡️ Strict Rule: Permanent Memory Lock Engaged (No User Deletion)`);
  } catch (error) {
    console.error(`🔴 TriNetra MongoDB Crash: ${error.message}`);
    process.exit(1); // Kill server if DB fails to protect data
  }
};

export default connectDB;
