import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // use relative paths so GitHub Pages / custom domains find assets
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});