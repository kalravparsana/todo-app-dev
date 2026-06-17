import { test, expect } from '@playwright/test';
import {
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

const projectDetailPath = meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId);

test.describe('ProjectDetailPage — UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await mockMeridianApi(page);
    await gotoWithFreshSeed(page, projectDetailPath);
  });

  test('project name heading shows Northwind rebrand', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.studioProjectName, level: 1 }),
    ).toBeVisible();
  });

  test('active task count is displayed', async ({ page }) => {
    await expect(page.getByText(/\d+ active tasks/i)).toBeVisible();
  });

  test('seed studio tasks are listed', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.logoLockups.title)).toBeVisible();
    await expect(page.getByText(meridianTodoData.tasks.competitorResearch.title)).toBeVisible();
  });

  test('quick add placeholder references project name', async ({ page }) => {
    await expect(page.getByLabel('New task')).toHaveAttribute(
      'placeholder',
      meridianTodoData.valid.projectQuickAddPlaceholder,
    );
  });

  test('Delete project button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Delete project' })).toBeVisible();
  });

  test('tasks from other projects are hidden', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.hvacInspection.title)).not.toBeVisible();
  });
});
