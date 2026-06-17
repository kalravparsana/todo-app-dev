import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('ProjectsPage — Error Tests', () => {
  test('empty projects state shows empty illustration copy', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, JSON.stringify({ tasks: [], projects: [] }));
    }, STORAGE_KEY);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.projects}`);
    await expect(page.getByRole('heading', { name: 'No projects yet' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create your first project' })).toBeVisible();
  });

  test('corrupted storage falls back to seed projects', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, '}{');
    }, STORAGE_KEY);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.projects}`);
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.studio.name) })).toBeVisible();
  });

  test('projects GET 500 mock returns error body', async ({ page }) => {
    await mockMeridianApi(page, { projectsGetStatus: 500 });
    const response = await page.request.get(`${BASE_URL}/api/projects`);
    expect(response.status()).toBe(500);
    const body = await response.json();
    expect(body.error.message).toBe(meridianTodoData.api.errorMessage);
  });

  test('submitting empty name via Enter does not create project', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project name').press('Enter');
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.valid.projectName) })).toHaveCount(0);
  });

  test('slow projects mock still shows local grid', async ({ page }) => {
    await mockMeridianApi(page, { delayMs: 300 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
    await expect(page.getByRole('link', { name: new RegExp(meridianTodoData.projects.home.name) })).toBeVisible();
  });
});
