// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'https://localhost:7145',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    css: {
      devSourcemap: false,
    },
  };
});