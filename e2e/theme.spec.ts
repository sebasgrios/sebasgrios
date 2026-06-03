import { expect, test } from '@playwright/test';

test.describe('theme toggle', () => {
  test('toggles between light and dark and persists', async ({ page }) => {
    await page.goto('/');
    const initial = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.locator('.theme-toggle').first().click();
    const after = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(after).not.toBe(initial);

    await page.reload();
    const persisted = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(persisted).toBe(after);
  });
});
