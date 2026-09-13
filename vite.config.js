import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { target: 'es2020', outDir: 'dist', sourcemap: false },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
