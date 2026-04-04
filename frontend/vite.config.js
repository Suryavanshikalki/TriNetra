// ==========================================
// TRINETRA SUPER APP - MASTER BUILD ENGINE
// Exact Path: vite.config.js
// Blueprint Point: 1 (6-Platform Deployment) & 12H (Security)
// Status: 100% ASLI (Firebase Logic Deleted 🗑️)
// ==========================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 🔥 ASLI PRODUCTION OPTIMIZATION (For Super App Scale)
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    open: true,
    // Point 12H: AWS WAF can be tested via proxy if needed
    host: true, 
  },

  build: {
    // 🛰️ Point 1: AWS Amplify/S3 Build Output
    outDir: 'dist', 
    emptyOutDir: true,
    
    // 🧠 Point 11: Master AI & Heavy Components Chunking Logic
    // बड़ी ऐप को छोटे टुकड़ों में बांटना ताकि 'Home Feed' तुरंत खुले
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('aws-amplify')) return 'aws-mesh';
            if (id.includes('lucide-react')) return 'icons-engine';
            if (id.includes('@zegocloud')) return 'calling-engine';
            return 'vendor'; // Baki sab external libraries
          }
          if (id.includes('src/Screens/AI')) return 'master-ai-hub';
          if (id.includes('src/Screens/Economy')) return 'economy-wallet';
        },
      },
    },
    
    // Super App size management (No Error during AWS Deployment)
    chunkSizeWarningLimit: 3500, 
    
    // 🛡️ Point 12H: Security - Removing Console Logs in Production Build
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // ✅ CSS Logic for OLED Dark Mode (Point 12E)
  css: {
    devSourcemap: true,
  },
});
