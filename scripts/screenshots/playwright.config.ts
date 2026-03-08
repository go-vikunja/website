import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  timeout: 60000,
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3456',
    screenshot: 'off',
    trace: 'off',
    // Use a consistent viewport for reproducible screenshots
    viewport: {width: 1280, height: 900},
    // Reduce motion for cleaner screenshots
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'screenshots',
      use: {...devices['Desktop Chrome']},
    },
  ],
})
