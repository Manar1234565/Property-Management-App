import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    // Send /api requests to the Spring Boot backend (Api/), which serves its endpoints under /api.
    proxy: { '/api': 'http://localhost:8080' },
  },
})
