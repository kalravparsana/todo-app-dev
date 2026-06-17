import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const projectDetailPath = meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId);

test.describe('ProjectDetailPage — Edge Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, projectDetailPath);
  });

  test('double add does not duplicate project task', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    const add = page.getByRole('button', { name: 'Add' });
    await add.click();
    await add.click();
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toHaveCount(1);
  });

  test('xss-like project task title renders safely', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.xssLikeTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.xssLikeTitle)).toBeVisible();
  });

  test('delete project cancels on dismiss confirm', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.getByRole('button', { name: 'Delete project' }).click();
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.studioProjectName, level: 1 }),
    ).toBeVisible();
  });

  test('delete project confirms and navigates away', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Delete project' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.projects}$`));
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.studio.name) })).toHaveCount(0);
  });

  test('navigate back link returns to projects grid', async ({ page }) => {
    await page.getByRole('link', { name: '← Projects' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.projects}$`));
  });
});
