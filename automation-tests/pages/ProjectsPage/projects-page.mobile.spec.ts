import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
] as const;

test.describe('ProjectsPage — Mobile Tests', () => {
  for (const viewport of mobileViewports) {
    test(`Projects heading at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
      await expect(page.getByRole('heading', { name: meridianTodoData.copy.projectsHeading, level: 1 })).toBeVisible();
    });
  }

  test('create project form usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project name').fill(meridianTodoData.valid.projectName);
    await page.getByRole('button', { name: 'Create project' }).click();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.valid.projectName) })).toBeVisible();
  });

  test('project grid fits narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
