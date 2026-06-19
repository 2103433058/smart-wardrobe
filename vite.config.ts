import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/fashion-wardrobe/',
  resolve: {
    alias: {
      '@tensorflow/tfjs': path.resolve(__dirname, 'node_modules/@tensorflow/tfjs'),
    },
  },
})
