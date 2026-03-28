import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 👁️ TRINETRA FIX: Ye setting double 'src' ke chakkar ko bypass karegi
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
