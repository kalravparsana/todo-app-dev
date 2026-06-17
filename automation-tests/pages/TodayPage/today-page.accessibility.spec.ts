import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('TodayPage — Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
  });

  test('page has single h1 Today heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: meridianTodoData.copy.todayHeading })).toBeVisible();
  });

  test('quick add input has accessible label', async ({ page }) => {
    await expect(page.getByLabel('New task')).toBeVisible();
  });

  test('commit rail has aria label', async ({ page }) => {
    await expect(page.getByRole('region', { name: meridianTodoData.copy.commitRailLabel })).toBeVisible();
  });

  test('task complete buttons have descriptive labels', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: `Complete "${meridianTodoData.tasks.logoLockups.title}"` }),
    ).toBeVisible();
  });

  test('main navigation is keyboard reachable', async ({ page }) => {
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(tag ?? '');
  });

  test('committed section has labelled heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Committed/i })).toBeVisible();
  });
});
