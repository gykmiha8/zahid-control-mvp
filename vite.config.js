import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global APIs like `describe`, `it`, `expect`
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './src/setupTests.js', // Optional: for @testing-library/jest-dom setup
    css: false, // Disable CSS processing for tests if not needed
  },
})
