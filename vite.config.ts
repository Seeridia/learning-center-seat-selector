import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/fzu-sso': {
        target: 'https://sso.fzu.edu.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fzu-sso/, ''),
        headers: {
          Referer: 'https://sso.fzu.edu.cn/',
        }
      }
    }
  }
})
