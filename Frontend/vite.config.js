import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the plugin here
  ],
  server:{
    proxy:{
      '/api':{
        target:'import.meta.env.VITE_BACKEND_URL',
        secure:false
      }
    }
  }
});
