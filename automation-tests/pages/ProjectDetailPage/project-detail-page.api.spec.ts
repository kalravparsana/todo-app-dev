import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

const projectDetailPath = meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId);

test.describe('ProjectDetailPage — API Tests', () => {
  test('added task persists with projectId in storage', async ({ page }) => {
    await gotoWithFreshSeed(page, projectDetailPath);
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    const raw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(raw).toContain(meridianTodoData.routes.seedProjectId);
    expect(raw).toContain(meridianTodoData.valid.taskTitle);
  });

  test('mocked GET tasks includes studio tasks', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    const tasks = await response.json();
    const studioTasks = tasks.filter((t: { projectId?: string }) => t.projectId === meridianTodoData.routes.seedProjectId);
    expect(studioTasks.length).toBeGreaterThanOrEqual(2);
  });

  test('mocked POST task with projectId', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.post(`${BASE_URL}/api/tasks`, {
      data: { title: meridianTodoData.valid.taskTitle, projectId: meridianTodoData.routes.seedProjectId },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.projectId).toBe(meridianTodoData.routes.seedProjectId);
  });

  test('mocked DELETE project returns 204', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.delete(`${BASE_URL}/api/projects/${meridianTodoData.routes.seedProjectId}`);
    expect(response.status()).toBe(204);
  });

  test('complete task updates UI state', async ({ page }) => {
    await gotoWithFreshSeed(page, projectDetailPath);
    const title = meridianTodoData.tasks.logoLockups.title;
    await page.getByRole('button', { name: `Complete "${title}"` }).click();
    await expect(page.getByRole('button', { name: `Mark "${title}" incomplete` })).toBeVisible();
  });
});
