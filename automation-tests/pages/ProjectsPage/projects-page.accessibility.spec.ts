import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('ProjectsPage — Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
  });

  test('single h1 Projects heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: meridianTodoData.copy.projectsHeading })).toBeVisible();
  });

  test('project name field has label', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await expect(page.getByLabel('Project name')).toBeVisible();
  });

  test('color buttons have aria labels', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await expect(page.getByRole('button', { name: 'Select color #2D6A4F' })).toBeVisible();
  });

  test('project cards are links with readable names', async ({ page }) => {
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.studio.name) })).toBeVisible();
  });

  test('Create project button disabled state is exposed', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await expect(page.getByRole('button', { name: 'Create project' })).toBeDisabled();
  });
});
