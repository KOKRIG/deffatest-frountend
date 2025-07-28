import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Allow any host ending with .deffatest.netlify.app
    allowedHosts: [/\.deffatest\.netlify\.app$/],
    hmr: {
      overlay: false
    }
  }
});
