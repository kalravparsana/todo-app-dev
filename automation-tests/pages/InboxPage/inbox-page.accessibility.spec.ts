import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('InboxPage — Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
  });

  test('single h1 Inbox heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: meridianTodoData.copy.inboxHeading })).toBeVisible();
  });

  test('new task input labelled', async ({ page }) => {
    await expect(page.getByLabel('New task')).toBeVisible();
  });

  test('complete button has task-specific label', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: `Complete "${meridianTodoData.tasks.prescription.title}"` }),
    ).toBeVisible();
  });

  test('Add button has accessible name', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  });

  test('keyboard can focus quick add', async ({ page }) => {
    await page.getByLabel('New task').focus();
    await expect(page.getByLabel('New task')).toBeFocused();
  });
});
