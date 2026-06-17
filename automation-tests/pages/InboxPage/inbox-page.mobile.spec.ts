import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
] as const;

test.describe('InboxPage — Mobile Tests', () => {
  for (const viewport of mobileViewports) {
    test(`Inbox heading at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
      await expect(page.getByRole('heading', { name: meridianTodoData.copy.inboxHeading, level: 1 })).toBeVisible();
    });
  }

  test('capture form works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    await page.getByLabel('New task').fill(meridianTodoData.valid.inboxTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.valid.inboxTaskTitle)).toBeVisible();
  });

  test('mobile nav reaches Projects', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.projects}$`));
  });
});
