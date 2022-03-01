import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': `${pathSrc}/`,
      '@c': `${pathSrc}/components`
    },
  },
  server: {
    host: '127.0.0.1',
    open: true, // 是否自动打开浏览器
    port: '8080'
  },
})