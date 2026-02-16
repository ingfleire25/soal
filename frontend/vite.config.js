import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), 
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/gadet/' : './',
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]", 
      },
    },
  },
  server: {
    strictPort: true,
    // Configuración para desarrollo
    proxy: {
      '/gadet': {
        target: 'http://localhost:5173',
        rewrite: path => path.replace(/^\/gadet/, '')
      }
    }
  },
  publicDir: 'public',
})
