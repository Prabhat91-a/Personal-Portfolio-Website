import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // This ensures assets are loaded correctly when deployed
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
    }
  },
  server: {
    port: 3000,
    open: true
  }
}); 
