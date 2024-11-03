import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'editor': ['@monaco-editor/react'],
          'ui': [
            '@radix-ui/react-slot',
            '@radix-ui/react-dialog',
            // ... other UI libraries
          ]
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
