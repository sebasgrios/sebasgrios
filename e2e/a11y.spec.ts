import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const scan = (url: string) =>
  test(`no critical/serious a11y violations on ${url}`, async ({ page }) => {
    // Reduced motion reveals all content at full opacity (the accessible
    // baseline), avoiding false contrast hits on not-yet-revealed elements.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

test.describe('accessibility', () => {
  scan('/es/');
  scan('/en/');
});
