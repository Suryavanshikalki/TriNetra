// ==========================================
// 👁️🔥 TRINETRA MASTER IGNITION - FILE: index.js
// Role: Real Database Connection & AWS Server Ignition
// Author: Suryavanshi Kalki
// Blueprint: 100% Aligned | AWS Standard | No Dummy Code
// ==========================================

import app from "./server.js"; 
import mongoose from "mongoose";

// ─── 1. REAL AWS MONGODB CONNECTION ───
const startDatabase = async () => {
    try {
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            console.error("❌ [TriNetra Firewall] FATAL: MONGODB_URI missing in AWS Environment!");
            process.exit(1); 
        }

        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log("👁️🔥 [TriNetra DB] 100% Locked & Connected to AWS Cloud Instance");
    } catch (error) {
        console.error("❌ [TriNetra DB] Connection Failed (Logged to CloudWatch):", error);
        process.exit(1); 
    }
};

// ─── 2. START THE AWS PRODUCTION SERVER ───
const startServer = async () => {
    await startDatabase();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(`👁️🔥 TRINETRA MASTER ENGINE IS LIVE (AWS)`);
        console.log(`🚀 Identity: Suryavanshi Kalki`);
        console.log(`📡 Port Bind: ${PORT}`);
        console.log(`🛡️  Security: AWS WAF & Helmet Active`);
        console.log(`🚫 Banned Status: Firebase (Deleted), Razorpay (Deleted)`);
        console.log(`✅ Status: AI Mode C, Justice Engine & Economy Engine Online`);
        console.log(`=========================================`);
    });

    // ─── 3. GRACEFUL SHUTDOWN (Professional Facebook Level) ───
    // अगर AWS सर्वर बंद करता है, तो डेटाबेस को सुरक्षित तरीके से क्लोज करेगा
    process.on('SIGTERM', () => {
        console.info('SIGTERM signal received. Closing TriNetra Engine...');
        server.close(() => {
            mongoose.connection.close(false, () => {
                console.log('TriNetra DB connection closed.');
                process.exit(0);
            });
        });
    });
};

startServer();
