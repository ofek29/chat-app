import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_SERVER_HOST || 'localhost',
    port: parseInt(process.env.VITE_PORT || '5173'),
  }
})
