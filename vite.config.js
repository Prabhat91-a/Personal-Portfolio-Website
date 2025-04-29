import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/', // Changed to root path for Netlify
  root: '.', // Explicitly set the root directory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap']
        }
      }
    }
  },
  resolve: {
    alias: {
      'three': resolve(__dirname, 'node_modules/three'),
      'gsap': resolve(__dirname, 'node_modules/gsap')
    }
  },
  server: {
    port: 3000,
    open: true
  }
}); 
