import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .flatMap((v) =>
      v.nodes.map((n) => ({ id: v.id, target: n.target, summary: n.failureSummary }))
    );
}

for (const path of ['/', '/en/']) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`a11y ${scheme} · ${path}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.goto(path);
      expect(await seriousViolations(page)).toEqual([]);
    });
  }
}
