import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
] as const;

test.describe('TodayPage — Mobile Tests', () => {
  for (const viewport of mobileViewports) {
    test(`Today heading visible at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await gotoWithFreshSeed(page, meridianTodoData.routes.today);
      await expect(page.getByRole('heading', { name: meridianTodoData.copy.todayHeading, level: 1 })).toBeVisible();
    });
  }

  test('mobile bottom nav switches to Inbox', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
    await page.getByRole('link', { name: 'Inbox' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.inbox}$`));
  });

  test('quick add works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toBeVisible();
  });
});
