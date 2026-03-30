// ==========================================
// TRINETRA FRONTEND - vite.config.js
// Blueprint: Point 1 (Real App Build Engine for Firebase)
// ==========================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist', // 🚨 Firebase live karte waqt 'dist' folder ko uthayega
    emptyOutDir: true,
    chunkSizeWarningLimit: 3000, // Super App size (No Error)
  }
});
