import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const projectDetailPath = meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId);

test.describe('ProjectDetailPage — Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, projectDetailPath);
  });

  test('single h1 with project name', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: meridianTodoData.copy.studioProjectName }),
    ).toBeVisible();
  });

  test('new task input labelled', async ({ page }) => {
    await expect(page.getByLabel('New task')).toBeVisible();
  });

  test('complete buttons include task titles', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: `Complete "${meridianTodoData.tasks.logoLockups.title}"` }),
    ).toBeVisible();
  });

  test('delete project button has accessible name', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Delete project' })).toBeVisible();
  });

  test('not found page exposes back link', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.projectDetail('unknown-proj'));
    await expect(page.getByRole('link', { name: 'Back to projects' })).toBeVisible();
  });
});
