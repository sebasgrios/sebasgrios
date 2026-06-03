import { expect, test } from '@playwright/test';

test.describe('admin guards', () => {
  test('redirects /admin to login without session', async ({ request }) => {
    const res = await request.get('/admin', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers().location).toContain('/admin/login');
  });

  test('login page renders', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: 'Acceso privado' })).toBeVisible();
  });

  test('mutation api returns 401 without session', async ({ request }) => {
    const res = await request.post('/api/technologies', {
      form: { _action: 'create', key: 'x', label: 'X', sortOrder: '0' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(401);
  });

  test('public auth endpoint is open (302 to provider or login)', async ({ request }) => {
    const res = await request.get('/api/auth/signin', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
  });
});
