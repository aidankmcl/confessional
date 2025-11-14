import { defineConfig } from 'vite';
import path from 'path';

import react from '@vitejs/plugin-react';


// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react(),
  ],
  html: {
    cspNonce: 'VITE_NONCE'
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    exclude: ['@trpc/server/unstable-core-do-not-import'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
