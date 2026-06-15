import { expect, test } from '@playwright/test';

test.describe('theme toggle', () => {
  test('toggles and persists across reloads', async ({ page }) => {
    await page.goto('/es/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    const toggle = page.getByRole('button', { name: 'Cambiar tema' });
    // The toggle is a client:idle island — retry until hydration wires it up.
    await expect(async () => {
      await toggle.click();
      await expect(html).toHaveAttribute('data-theme', 'dark');
    }).toPass();

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});
