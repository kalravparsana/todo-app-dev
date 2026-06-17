import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('TodayPage — Error Tests', () => {
  test('corrupted localStorage falls back to seed tasks', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, '{not-valid-json');
    }, STORAGE_KEY);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.today}`);
    await expect(page.getByText(meridianTodoData.tasks.logoLockups.title)).toBeVisible();
  });

  test('empty localStorage shows seed committed tasks', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
    await expect(page.getByText(meridianTodoData.tasks.logoLockups.title)).toBeVisible();
  });

  test('tasks API 500 mock returns error payload', async ({ page }) => {
    await mockMeridianApi(page, { tasksGetStatus: 500 });
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    expect(response.status()).toBe(500);
  });

  test('completing task moves it to completed section', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
    await page
      .getByRole('button', { name: `Complete "${meridianTodoData.tasks.logoLockups.title}"` })
      .click();
    await expect(page.getByText(/Completed \(\d+\)/i)).toBeVisible();
  });

  test('network abort on tasks GET fails request', async ({ page }) => {
    await mockMeridianApi(page, { abortTasks: true });
    const response = await page.request.get(`${BASE_URL}/api/tasks`).catch(() => null);
    expect(response).toBeNull();
  });
});
