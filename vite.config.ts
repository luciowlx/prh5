import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base 设置为 GitHub Pages 仓库名，确保静态资源路径正确
export default defineConfig({
  plugins: [react()],
  base: '/prh5/',
})
