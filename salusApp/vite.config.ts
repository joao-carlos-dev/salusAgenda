import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Captura qualquer chamada começando com /auth
      '/auth': {
        target: 'https://sallusagenda.onrender.com', // Seu backend
        changeOrigin: true,
        secure: false,
      },
      // Captura qualquer chamada começando com /professional
      '/professional': {
        target: 'https://sallusagenda.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }

});

