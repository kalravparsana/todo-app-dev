import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('LandingPage — API Tests', () => {
  test('mocked tasks API returns seed payload', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(meridianTodoData.api.tasksSuccess.length);
    expect(body[0].id).toBe(meridianTodoData.tasks.logoLockups.id);
  });

  test('mocked projects API returns seed payload', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/projects`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(meridianTodoData.api.projectsSuccess.length);
    expect(body[0].id).toBe(meridianTodoData.projects.studio.id);
  });

  test('mocked POST tasks returns created task shape', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.post(`${BASE_URL}/api/tasks`, {
      data: { title: meridianTodoData.valid.taskTitle, committedToToday: true },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(meridianTodoData.valid.taskTitle);
    expect(body.completed).toBe(false);
  });

  test('mocked POST projects returns created project shape', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.post(`${BASE_URL}/api/projects`, {
      data: {
        name: meridianTodoData.valid.projectName,
        color: meridianTodoData.valid.projectColor,
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(meridianTodoData.valid.projectName);
  });

  test('landing page loads while API mocks are registered', async ({ page }) => {
    await mockMeridianApi(page);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });
});
