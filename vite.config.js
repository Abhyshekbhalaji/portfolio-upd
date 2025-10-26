// vite.config.ts - Vite configuration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // Line 3: Your existing React plugin (if not, add: npm i -D @vitejs/plugin-react)
import tailwindcss from '@tailwindcss/vite';  // Line 4: Import Tailwind plugin.

export default defineConfig({
  root: 'src', // Set src as the root directory
  build: {
    outDir: '../dist', // Output to dist outside src
  },
  plugins: [
    react(),  // Line 7: Existing React plugin.
    tailwindcss(),  // Line 8: Add Tailwind plugin (handles CSS processing).
  ],
});