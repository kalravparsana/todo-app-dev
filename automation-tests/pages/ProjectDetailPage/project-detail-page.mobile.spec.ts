import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const projectDetailPath = meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId);

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
] as const;

test.describe('ProjectDetailPage — Mobile Tests', () => {
  for (const viewport of mobileViewports) {
    test(`project heading at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await gotoWithFreshSeed(page, projectDetailPath);
      await expect(
        page.getByRole('heading', { name: meridianTodoData.copy.studioProjectName, level: 1 }),
      ).toBeVisible();
    });
  }

  test('quick add works on mobile for project', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoWithFreshSeed(page, projectDetailPath);
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toBeVisible();
  });

  test('back link reachable on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoWithFreshSeed(page, projectDetailPath);
    await page.getByRole('link', { name: '← Projects' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.projects}$`));
  });
});
