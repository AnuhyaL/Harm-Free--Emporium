import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks so app changes don't bust library caches.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          motion: ['framer-motion'],
          radix: ['@radix-ui/react-dialog', '@radix-ui/react-navigation-menu', '@radix-ui/react-tabs', '@radix-ui/react-accordion'],
          forms: ['react-hook-form', 'zod', '@hookform/resolvers/zod'],
        },
      },
    },
  },
});
