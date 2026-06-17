import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('ProjectsPage — Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
    await page.getByRole('button', { name: 'New project' }).click();
  });

  test('empty project name blocks submit', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Create project' })).toBeDisabled();
  });

  test('whitespace project name blocks submit', async ({ page }) => {
    await page.getByLabel('Project name').fill(meridianTodoData.invalid.whitespaceProjectName);
    await expect(page.getByRole('button', { name: 'Create project' })).toBeDisabled();
  });

  test('valid project name creates card', async ({ page }) => {
    await page.getByLabel('Project name').fill(meridianTodoData.valid.projectName);
    await page.getByRole('button', { name: 'Create project' }).click();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.valid.projectName) })).toBeVisible();
    await expect(page.getByLabel('Project name')).toHaveCount(0);
  });

  test('color selection updates active swatch', async ({ page }) => {
    const colorBtn = page.getByRole('button', { name: 'Select color #C87941' });
    await colorBtn.click();
    await expect(colorBtn).toHaveClass(/ring-2/);
  });

  test('cancel closes create form', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByLabel('Project name')).toHaveCount(0);
  });

  test('long project name is accepted', async ({ page }) => {
    await page.getByLabel('Project name').fill(meridianTodoData.edge.longProjectName);
    await page.getByRole('button', { name: 'Create project' }).click();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.edge.longProjectName.slice(0, 20)) })).toBeVisible();
  });
});
