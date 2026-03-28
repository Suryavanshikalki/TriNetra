import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 👁️ TRINETRA MASTER FIX: Ye setting Vite ko batayegi ki 
  // agar kisi file me .jsx ya .js nahi likha hai, toh khud dhoondh lo!
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000
  }
});
