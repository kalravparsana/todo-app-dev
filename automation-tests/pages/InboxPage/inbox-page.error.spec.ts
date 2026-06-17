import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('InboxPage — Error Tests', () => {
  test('empty inbox state after removing all inbox tasks', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    const row = page.getByText(meridianTodoData.tasks.prescription.title).locator('..').locator('..');
    await row.hover();
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.inboxEmptyTitle })).toBeVisible();
  });

  test('corrupted storage recovers with seed inbox task', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, 'not-json');
    }, STORAGE_KEY);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.inbox}`);
    await expect(page.getByText(meridianTodoData.tasks.prescription.title)).toBeVisible();
  });

  test('tasks GET 500 mock returns error', async ({ page }) => {
    await mockMeridianApi(page, { tasksGetStatus: 500 });
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    expect(response.status()).toBe(500);
  });

  test('tasks POST 500 mock returns error body', async ({ page }) => {
    await mockMeridianApi(page, { tasksPostStatus: 500 });
    const response = await page.request.post(`${BASE_URL}/api/tasks`, {
      data: { title: meridianTodoData.valid.inboxTaskTitle },
    });
    expect(response.status()).toBe(500);
  });

  test('slow API mock still allows local inbox UI', async ({ page }) => {
    await mockMeridianApi(page, { delayMs: 300 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    await expect(page.getByText(meridianTodoData.tasks.prescription.title)).toBeVisible();
  });
});
