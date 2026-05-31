import { expect, test } from '@playwright/test';

test.describe('public portfolio', () => {
  test('renders home in es with all sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sebastián González Ríos/);
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.locator('#education')).toBeVisible();
    await expect(page.locator('#stack')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('h1').first()).toContainText('Sebastián');
  });

  test('renders home in en with all sections', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle(/Software Engineer/);
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('locale switch navigates between es and en', async ({ page }) => {
    await page.goto('/');
    await page.locator('.locale-switch').click();
    await expect(page).toHaveURL(/\/en\//);
    await page.locator('.locale-switch').click();
    await expect(page).toHaveURL(/^[^/]*\/$|^[^/]*$/);
  });

  test('exposes hreflang alternates in head', async ({ page }) => {
    await page.goto('/');
    const es = page.locator('link[rel="alternate"][hreflang="es"]');
    const en = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(es).toHaveAttribute('href', /sebasgrios\.es\/?$/);
    await expect(en).toHaveAttribute('href', /sebasgrios\.es\/en\/?$/);
  });

  test('exposes schema.org Person json-ld', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    const parsed = JSON.parse(jsonLd ?? '{}');
    expect(parsed['@type']).toBe('Person');
    expect(parsed.name).toContain('Sebastián');
  });
});
