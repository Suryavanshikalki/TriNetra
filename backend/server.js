// --- 1. SOCKET.IO (WhatsApp 2.0 Engine) ---
// 🚀 NAYA: Aapke ASLI Render link ko allow kar diya gaya hai
const io = new Server(server, { 
    cors: { 
        origin: ["https://trinetra-umys.onrender.com", "http://localhost:3000", "http://localhost:5173", "*"], 
        methods: ["GET", "POST"] 
    } 
});
