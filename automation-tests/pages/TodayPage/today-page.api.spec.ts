import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('TodayPage — API Tests', () => {
  test('quick add persists task to localStorage', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(stored).toContain(meridianTodoData.valid.taskTitle);
  });

  test('mocked GET tasks returns seed data', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    expect(response.status()).toBe(200);
    const tasks = await response.json();
    expect(tasks.map((t: { id: string }) => t.id)).toContain(meridianTodoData.tasks.logoLockups.id);
  });

  test('mocked PATCH task completes successfully', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.patch(`${BASE_URL}/api/tasks/${meridianTodoData.tasks.logoLockups.id}`, {
      data: { completed: true },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.completed).toBe(true);
  });

  test('toggle complete updates local state', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
    const completeBtn = page.getByRole('button', {
      name: `Complete "${meridianTodoData.tasks.logoLockups.title}"`,
    });
    await completeBtn.click();
    await expect(
      page.getByRole('button', {
        name: `Mark "${meridianTodoData.tasks.logoLockups.title}" incomplete`,
      }),
    ).toBeVisible();
  });

  test('mocked POST task with 500 returns error body', async ({ page }) => {
    await mockMeridianApi(page, { tasksPostStatus: 500 });
    const response = await page.request.post(`${BASE_URL}/api/tasks`, {
      data: { title: meridianTodoData.valid.taskTitle },
    });
    expect(response.status()).toBe(500);
    const body = await response.json();
    expect(body.error.message).toBe(meridianTodoData.api.errorMessage);
  });
});
