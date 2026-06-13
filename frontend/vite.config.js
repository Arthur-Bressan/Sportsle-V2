import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Força o Vite a capturar alterações no Windows/Docker
    },
    host: true, // Garante que o container exponha a porta corretamente
    port: 5173
  }
})