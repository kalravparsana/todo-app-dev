import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

const projectDetailPath = meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId);

test.describe('ProjectDetailPage — Error Tests', () => {
  test('unknown project id shows not found', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projectDetail('proj-does-not-exist'));
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.projectNotFound })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to projects' })).toBeVisible();
  });

  test('back to projects link on not found page', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projectDetail('missing-id'));
    await page.getByRole('link', { name: 'Back to projects' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.projects}$`));
  });

  test('tasks GET 500 mock returns error', async ({ page }) => {
    await mockMeridianApi(page, { tasksGetStatus: 500 });
    const response = await page.request.get(`${BASE_URL}/api/tasks`);
    expect(response.status()).toBe(500);
  });

  test('delete project mock 500 returns error body', async ({ page }) => {
    await mockMeridianApi(page, { projectsDeleteStatus: 500 });
    const response = await page.request.delete(`${BASE_URL}/api/projects/${meridianTodoData.routes.seedProjectId}`);
    expect(response.status()).toBe(500);
  });

  test('corrupted storage still resolves known project', async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, 'invalid-json');
    }, 'meridian-todo-state-v1');
    await page.goto(`${BASE_URL}${projectDetailPath}`);
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.studioProjectName, level: 1 }),
    ).toBeVisible();
  });
});
