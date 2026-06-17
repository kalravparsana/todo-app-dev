import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('ProjectsPage — Edge Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
  });

  test('double submit does not duplicate project', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project name').fill(meridianTodoData.valid.projectName);
    const create = page.getByRole('button', { name: 'Create project' });
    await create.click();
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project name').fill(meridianTodoData.valid.projectName);
    await create.click();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.valid.projectName) })).toHaveCount(1);
  });

  test('special characters in project name', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project name').fill(meridianTodoData.edge.specialProjectName);
    await page.getByRole('button', { name: 'Create project' }).click();
    await expect(page.getByRole('link', { name: new RegExp('Client / Q3') })).toBeVisible();
  });

  test('toggle new project form twice returns to list', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByLabel('Project name')).toHaveCount(0);
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.writing.name) })).toBeVisible();
  });

  test('navigate to detail and back preserves grid', async ({ page }) => {
    await page.getByRole('link', { name: new RegExp(meridianTodoData.projects.studio.name) }).click();
    await page.getByRole('link', { name: '← Projects' }).click();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.home.name) })).toBeVisible();
  });

  test('selecting different colors before create', async ({ page }) => {
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByRole('button', { name: 'Select color #5B6EAE' }).click();
    await page.getByLabel('Project name').fill(meridianTodoData.valid.projectName);
    await page.getByRole('button', { name: 'Create project' }).click();
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.valid.projectName) })).toBeVisible();
  });
});
