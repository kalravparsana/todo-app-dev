import { test, expect } from '@playwright/test';
import {
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('InboxPage — UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await mockMeridianApi(page);
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
  });

  test('inbox heading and description are visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.inboxHeading, level: 1 })).toBeVisible();
    await expect(page.getByText(/Capture first/i)).toBeVisible();
  });

  test('seed inbox task prescription is visible', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.prescription.title)).toBeVisible();
  });

  test('quick add has inbox placeholder', async ({ page }) => {
    await expect(page.getByLabel('New task')).toHaveAttribute(
      'placeholder',
      meridianTodoData.valid.inboxQuickAddPlaceholder,
    );
  });

  test('Add button disabled for empty input', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  test('project tasks do not appear in inbox list', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.logoLockups.title)).not.toBeVisible();
  });

  test('inbox nav link is present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Inbox' }).first()).toBeVisible();
  });
});
