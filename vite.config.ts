import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const rawUrl = req.url ? req.url.split('?')[0] : '';
          const cleanUrl = rawUrl.replace(/\/+$/, '') || '/';
          if (['/student', '/organizer', '/login', '/onboarding'].includes(cleanUrl)) {
            req.url = '/index.html';
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          const rawUrl = req.url ? req.url.split('?')[0] : '';
          const cleanUrl = rawUrl.replace(/\/+$/, '') || '/';
          if (['/student', '/organizer', '/login', '/onboarding'].includes(cleanUrl)) {
            req.url = '/index.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
});
