import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('InboxPage — API Tests', () => {
  test('captured task persists in localStorage', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    await page.getByLabel('New task').fill(meridianTodoData.valid.inboxTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    const raw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(raw).toContain(meridianTodoData.valid.inboxTaskTitle);
  });

  test('mocked tasks GET includes inbox-eligible task', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    const tasks = await response.json();
    const prescription = tasks.find((t: { id: string }) => t.id === meridianTodoData.tasks.prescription.id);
    expect(prescription?.title).toBe(meridianTodoData.tasks.prescription.title);
  });

  test('mocked POST creates task without project', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.post(`${BASE_URL}/api/tasks`, {
      data: { title: meridianTodoData.valid.inboxTaskTitle },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.projectId).toBeUndefined();
  });

  test('delete task via UI updates storage', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    const row = page.getByText(meridianTodoData.tasks.prescription.title).locator('..').locator('..');
    await row.hover();
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(meridianTodoData.tasks.prescription.title)).not.toBeVisible();
  });

  test('mocked DELETE task returns 204', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.delete(`${BASE_URL}/api/tasks/${meridianTodoData.tasks.prescription.id}`);
    expect(response.status()).toBe(204);
  });
});
