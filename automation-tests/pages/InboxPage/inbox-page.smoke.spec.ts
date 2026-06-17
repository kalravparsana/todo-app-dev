import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('InboxPage — Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
  });

  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    expect(errors).toHaveLength(0);
  });

  test('page has correct document title', async ({ page }) => {
    await expect(page).toHaveTitle(/Meridian/i);
  });

  test('primary heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.inboxHeading, level: 1 })).toBeVisible();
  });

  test('page renders within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('quick add field is visible', async ({ page }) => {
    await expect(page.getByLabel('New task')).toBeVisible();
  });
});
