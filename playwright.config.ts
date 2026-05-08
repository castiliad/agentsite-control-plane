import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: { command: 'node scripts/serve-gh-pages-local.mjs', url: 'http://localhost:4178/agentsite-control-plane/', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:4178/agentsite-control-plane/' },
  timeout: 30000
});
