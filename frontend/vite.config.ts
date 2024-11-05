import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/together': {
        target: 'https://api.together.xyz',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/together/, ''),
        headers: {
          'Authorization': `Bearer ${process.env.VITE_TOGETHER_API_KEY}`
        }
      }
    }
  }
})
