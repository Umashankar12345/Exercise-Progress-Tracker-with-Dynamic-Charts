import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@mediapipe/pose': path.resolve(__dirname, 'src/lib/mock-mediapipe-pose.js'),
    },
  },
  server: {
    host: true,
    allowedHosts: true
  }
})
