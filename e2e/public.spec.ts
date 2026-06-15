import { expect, test } from '@playwright/test';

test.describe('public content', () => {
  test('Spanish home renders the key sections', async ({ page }) => {
    await page.goto('/es/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('h1.hero__name')).toContainText('Sebastián');
    await expect(page.locator('.hero__role')).toHaveText('IA-Driven Engineer');
    await expect(page.locator('[data-nav-link]')).toHaveCount(4);
    await expect(page.locator('#path')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'BastianGR' })).toBeVisible();
    await expect(page.locator('.footer__brand')).toHaveText('SebasGRios');
  });

  test('English home uses the English role and lang', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.hero__role')).toHaveText('AI-Driven Engineer');
  });

  test('private-repo project hides the code button', async ({ page }) => {
    await page.goto('/es/');
    // Three projects, all have a demo link; only one exposes a code link
    // (BastianGR is marked privateRepo, Clara Romero has no repo).
    // `exact` avoids matching the project thumbnail's "{name} — Ver página" label.
    await expect(page.getByRole('link', { name: 'Ver página', exact: true })).toHaveCount(3);
    await expect(page.getByRole('link', { name: 'Código', exact: true })).toHaveCount(1);
  });

  test('root redirects to a locale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(es|en)\/$/);
  });
});
