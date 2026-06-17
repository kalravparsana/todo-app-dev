import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
] as const;

test.describe('UpcomingPage — Mobile Tests', () => {
  for (const viewport of mobileViewports) {
    test(`Upcoming heading at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
      await expect(page.getByRole('heading', { name: meridianTodoData.copy.upcomingHeading, level: 1 })).toBeVisible();
    });
  }

  test('date groups readable on narrow screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await expect(page.getByText(meridianTodoData.tasks.introParagraph.title)).toBeVisible();
  });

  test('mobile nav to Projects works from Upcoming', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.projects}$`));
  });
});
