import { test, expect } from '@playwright/test';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];
for (const viewport of viewports) {
  test(`responsive sanity: ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('a[href], button').filter({ hasText: /inspect|checkout|view|start|get|contact|learn|join|claim/i }).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    expect(overflow).toBe(false);
    expect(consoleErrors).toEqual([]);
  });
}
