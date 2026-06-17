import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('LandingPage — Error Tests', () => {
  test('landing still renders when tasks API returns 500', async ({ page }) => {
    await mockMeridianApi(page, { tasksGetStatus: 500 });
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('landing still renders when projects API returns 500', async ({ page }) => {
    await mockMeridianApi(page, { projectsGetStatus: 500 });
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('tasks API mock returns error body on 500', async ({ page }) => {
    await mockMeridianApi(page, { tasksGetStatus: 500 });
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    expect(response.status()).toBe(500);
    const body = await response.json();
    expect(body.error.message).toBe(meridianTodoData.api.errorMessage);
  });

  test('unknown app route redirects to landing', async ({ page }) => {
    await page.goto(`${BASE_URL}/does-not-exist-route`);
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.landing}$`));
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('network abort on tasks mock returns failed request', async ({ page }) => {
    await mockMeridianApi(page, { abortTasks: true });
    const response = await page.request.get(`${BASE_URL}/api/tasks`).catch(() => null);
    expect(response).toBeNull();
  });
});
