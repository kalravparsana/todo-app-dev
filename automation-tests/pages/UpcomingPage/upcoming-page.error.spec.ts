import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('UpcomingPage — Error Tests', () => {
  test('empty upcoming shows horizon clear message', async ({ page }) => {
    await page.addInitScript((key) => {
      const state = {
        tasks: [],
        projects: [],
      };
      localStorage.setItem(key, JSON.stringify(state));
    }, STORAGE_KEY);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.upcoming}`);
    await expect(page.getByText(meridianTodoData.copy.upcomingEmptyTitle)).toBeVisible();
  });

  test('corrupted storage still renders upcoming heading', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, '{bad');
    }, STORAGE_KEY);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.upcoming}`);
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.upcomingHeading })).toBeVisible();
  });

  test('tasks API 500 does not crash page shell', async ({ page }) => {
    await mockMeridianApi(page, { tasksGetStatus: 500 });
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.upcomingHeading })).toBeVisible();
  });

  test('delete upcoming task removes from list', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    const title = meridianTodoData.tasks.introParagraph.title;
    const row = page.getByText(title).locator('..').locator('..');
    await row.hover();
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(title)).not.toBeVisible();
  });

  test('network abort on projects mock fails fetch', async ({ page }) => {
    await mockMeridianApi(page, { abortProjects: true });
    const response = await page.request.get(`${BASE_URL}/api/projects`).catch(() => null);
    expect(response).toBeNull();
  });
});
