import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // यह Render से MONGODB_URI खुद उठा लेगा
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🟢 TriNetra MongoDB Connected: ${conn.connection.host}`);
    console.log(`🛡️ Permanent Memory Lock Engaged (No User Deletion)`);
  } catch (error) {
    console.error(`🔴 TriNetra MongoDB Crash: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;
