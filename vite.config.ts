/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works from any static host or sub-path (e.g. GitHub Pages).
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // Most of the bundle is hand-written game content (~70 events, 34 guide entries, 48 drills),
    // which every screen needs, so a single ~340 kB gzipped chunk is expected.
    chunkSizeWarningLimit: 1200,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
