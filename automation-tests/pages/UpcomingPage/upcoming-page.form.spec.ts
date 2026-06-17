import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  STORAGE_KEY,
  gotoWithFreshSeed,
  meridianTodoData,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('UpcomingPage — Form Tests', () => {
  test('empty state when all future tasks removed', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await page.evaluate((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const state = JSON.parse(raw) as { tasks: { id: string }[] };
      state.tasks = state.tasks.filter((t) => !['task-3', 'task-5'].includes(t.id));
      localStorage.setItem(key, JSON.stringify(state));
    }, STORAGE_KEY);
    await page.reload();
    await expect(page.getByText(meridianTodoData.copy.upcomingEmptyTitle)).toBeVisible();
  });

  test('commit toggle on upcoming task is interactive', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    const row = page.getByText(meridianTodoData.tasks.introParagraph.title).locator('..').locator('..');
    await row.hover();
    await row.getByRole('button', { name: 'Commit' }).click();
    await row.hover();
    await expect(row.getByRole('button', { name: 'Committed' })).toBeVisible();
  });

  test('complete upcoming task moves to completed section', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await page
      .getByRole('button', { name: `Complete "${meridianTodoData.tasks.introParagraph.title}"` })
      .click();
    await expect(page.getByText(/Completed \(1\)/i)).toBeVisible();
  });

  test('navigation to inbox allows adding scheduled task', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await page.getByRole('link', { name: 'Inbox' }).first().click();
    await page.getByLabel('New task').fill(meridianTodoData.valid.inboxTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('link', { name: 'Upcoming' }).first().click();
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.upcomingHeading })).toBeVisible();
  });

  test('page has no quick-add form on upcoming view', async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
    await expect(page.getByLabel('New task')).toHaveCount(0);
  });
});
