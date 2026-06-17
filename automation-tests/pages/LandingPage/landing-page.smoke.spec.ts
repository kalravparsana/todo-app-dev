import { test, expect } from '@playwright/test';
import { BASE_URL, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('LandingPage — Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.waitForLoadState('domcontentloaded');
    expect(errors).toHaveLength(0);
  });

  test('page has correct document title', async ({ page }) => {
    await expect(page).toHaveTitle(/Meridian/i);
  });

  test('primary heading is visible', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('page renders within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.waitForLoadState('domcontentloaded');
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('no broken images on page load', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate(
        (img: HTMLImageElement) => img.naturalWidth,
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});
