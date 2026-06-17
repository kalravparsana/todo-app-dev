import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('UpcomingPage — API Tests', () => {
  test('mocked tasks include future scheduled items', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    const tasks = await response.json();
    const intro = tasks.find((t: { id: string }) => t.id === meridianTodoData.tasks.introParagraph.id);
    expect(intro?.scheduledDate).toBeTruthy();
  });

  test('toggle complete on upcoming task updates UI', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    const title = meridianTodoData.tasks.hvacInspection.title;
    await page.getByRole('button', { name: `Complete "${title}"` }).click();
    await expect(page.getByRole('button', { name: `Mark "${title}" incomplete` })).toBeVisible();
  });

  test('mocked PATCH updates committed flag', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.patch(
      `${BASE_URL}/api/tasks/${meridianTodoData.tasks.introParagraph.id}`,
      { data: { committedToToday: true } },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.committedToToday).toBe(true);
  });

  test('mocked GET projects returns seed list', async ({ page }) => {
    await mockMeridianApi(page);
    const response = await page.request.get(`${BASE_URL}/api/projects`);
    expect(response.status()).toBe(200);
    const projects = await response.json();
    expect(projects).toHaveLength(meridianTodoData.api.projectsSuccess.length);
  });

  test('upcoming page loads with API mocks registered', async ({ page }) => {
    await mockMeridianApi(page);
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await expect(page.getByText(meridianTodoData.tasks.introParagraph.title)).toBeVisible();
  });
});
