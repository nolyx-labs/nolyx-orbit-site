import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // relative paths so the build works at user.github.io/<repo>/ and on a custom domain
  base: './',
  plugins: [react()],
})
