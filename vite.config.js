import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // 👁️ TRINETRA FIX: Ye setting khud hi file dhoondh legi
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
