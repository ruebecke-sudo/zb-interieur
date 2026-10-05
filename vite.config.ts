import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 43127,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:43128',
        changeOrigin: true,
      },
      '/.well-known/ai-plugin.json': {
        target: 'http://127.0.0.1:43128',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 43127,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:43128',
        changeOrigin: true,
      },
    },
  },
})
