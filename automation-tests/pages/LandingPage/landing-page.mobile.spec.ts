import { test, expect } from '@playwright/test';
import { BASE_URL, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
] as const;

test.describe('LandingPage — Mobile Tests', () => {
  for (const viewport of mobileViewports) {
    test(`renders headline at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
      await expect(
        page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
      ).toBeVisible();
    });
  }

  test('CTA remains tappable on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.getByRole('link', { name: 'Start your day' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.today}$`));
  });

  test('feature grid stacks without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
