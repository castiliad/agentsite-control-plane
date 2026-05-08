import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: { command: 'npx serve dist -l 4178', url: 'http://localhost:4178', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:4178' },
  timeout: 30000
});
