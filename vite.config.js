import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 👁️ TRINETRA FIX: Ye setting double src ke chakkar ko khatam kar degi
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
