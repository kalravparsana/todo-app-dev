import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('ProjectsPage — API Tests', () => {
  test('create project persists to localStorage', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project name').fill(meridianTodoData.valid.projectName);
    await page.getByRole('button', { name: 'Create project' }).click();
    const raw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(raw).toContain(meridianTodoData.valid.projectName);
  });

  test('mocked GET projects returns three seed projects', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/projects`);
    expect(response.status()).toBe(200);
    const projects = await response.json();
    expect(projects).toHaveLength(3);
  });

  test('mocked POST project returns 201', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.post(`${BASE_URL}/api/projects`, {
      data: { name: meridianTodoData.valid.projectName, color: meridianTodoData.valid.projectColor },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(meridianTodoData.valid.projectName);
  });

  test('clicking project card navigates to detail', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projects);
    await page.getByRole('link', { name: new RegExp(meridianTodoData.projects.studio.name) }).click();
    await expect(page).toHaveURL(
      new RegExp(`${meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId)}$`),
    );
  });

  test('mocked POST project 500 returns error', async ({ page }) => {
    await mockMeridianApi(page, { projectsPostStatus: 500 });
    const response = await page.request.post(`${BASE_URL}/api/projects`, {
      data: { name: meridianTodoData.valid.projectName, color: meridianTodoData.valid.projectColor },
    });
    expect(response.status()).toBe(500);
  });
});
