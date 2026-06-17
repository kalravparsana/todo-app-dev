import { test, expect } from '@playwright/test';
import { BASE_URL, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('LandingPage — Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('page has a single level-1 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole('heading', { level: 1, name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('primary CTAs are keyboard reachable', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(focusedTag ?? '');
  });

  test('Start your day link has accessible name', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Start your day' })).toBeVisible();
  });

  test('decorative images are hidden from assistive tech', async ({ page }) => {
    const hiddenImages = page.locator('img[aria-hidden="true"]');
    await expect(hiddenImages.first()).toBeVisible();
    const alt = await hiddenImages.first().getAttribute('alt');
    expect(alt).toBe('');
  });

  test('section headings use proper hierarchy', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Built for mornings, not meetings' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: "Commit, don't collect" })).toBeVisible();
  });
});
