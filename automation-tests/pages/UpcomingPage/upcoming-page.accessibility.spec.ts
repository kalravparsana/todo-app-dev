import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('UpcomingPage — Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
  });

  test('single h1 Upcoming heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: meridianTodoData.copy.upcomingHeading })).toBeVisible();
  });

  test('date sections have h2 headings', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  });

  test('task complete buttons labelled with task title', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: `Complete "${meridianTodoData.tasks.introParagraph.title}"` }),
    ).toBeVisible();
  });

  test('empty state uses readable heading text', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('meridian-todo-state-v1', JSON.stringify({ tasks: [], projects: [] }));
    });
    await page.reload();
    await expect(page.getByText(meridianTodoData.copy.upcomingEmptyTitle)).toBeVisible();
  });

  test('main nav links keyboard reachable', async ({ page }) => {
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(tag ?? '');
  });
});
