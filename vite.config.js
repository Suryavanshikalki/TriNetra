import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 👁️ TriNetra Fix: Vite ko batana ki frontend folder me dhundhe
  resolve: {
    alias: {
      '@': '/frontend/src',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
