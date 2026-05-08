import { test, expect } from '@playwright/test';
const viewports = [
  { name: 'small-mobile', width: 320, height: 568, requireCtaAboveFold: false },
  { name: 'mobile', width: 390, height: 844, requireCtaAboveFold: false },
  { name: 'tablet', width: 768, height: 1024, requireCtaAboveFold: false },
  { name: 'desktop', width: 1440, height: 900, requireCtaAboveFold: false }
];
for (const viewport of viewports) {
  test(`responsive sanity: ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const primary = page.locator('.hero-actions .primary').first();
    await expect(primary).toBeVisible();
    if (viewport.requireCtaAboveFold) {
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      expect((box!.y + box!.height)).toBeLessThanOrEqual(viewport.height);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    expect(overflow).toBe(false);
    await page.locator('.brand').click();
    await expect(page).toHaveURL(/\/agentsite-control-plane\/?$/);
    expect(consoleErrors).toEqual([]);
  });
}
