import { test, expect } from '@playwright/test';
import {
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('ProjectsPage — UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await mockMeridianApi(page);
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
  });

  test('projects heading visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.projectsHeading, level: 1 })).toBeVisible();
  });

  test('all seed project cards render', async ({ page }) => {
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.studio.name) })).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.home.name) })).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.writing.name) })).toBeVisible();
  });

  test('studio project shows active task count', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Northwind rebrand.*active/i })).toBeVisible();
  });

  test('New project toggles create form', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await expect(page.getByLabel('Project name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create project' })).toBeVisible();
  });

  test('color swatches render in create form', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await expect(page.getByRole('button', { name: /Select color #2D6A4F/i })).toBeVisible();
  });

  test('project card links to detail route', async ({ page }) => {
    const link = page.getByRole('link', { name: new RegExp(meridianTodoData.projects.studio.name) });
    await expect(link).toHaveAttribute('href', meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId));
  });
});
