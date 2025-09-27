import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Added for path alias
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Added alias so Vite resolves `@/` like TS path mapping
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
