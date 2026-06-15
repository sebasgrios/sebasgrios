import { expect, test } from '@playwright/test';

test.describe('i18n', () => {
  test('canonical and hreflang are present per locale', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://sebasgrios.es/en/',
    );
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
      'href',
      'https://sebasgrios.es/es/',
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://sebasgrios.es/',
    );
  });
});
