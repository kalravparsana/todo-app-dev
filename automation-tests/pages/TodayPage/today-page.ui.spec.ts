import { test, expect } from '@playwright/test';
import {
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('TodayPage — UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await mockMeridianApi(page);
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
  });

  test('page header shows Today title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.todayHeading, level: 1 })).toBeVisible();
  });

  test('commit rail shows progress for committed tasks', async ({ page }) => {
    await expect(page.getByRole('region', { name: meridianTodoData.copy.commitRailLabel })).toBeVisible();
    await expect(page.getByText(/committed/i).first()).toBeVisible();
  });

  test('seed committed task is visible', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.logoLockups.title)).toBeVisible();
    await expect(page.getByText(meridianTodoData.tasks.contentCalendar.title)).toBeVisible();
  });

  test('quick add input is visible with correct placeholder', async ({ page }) => {
    const input = page.getByLabel('New task');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', meridianTodoData.valid.todayQuickAddPlaceholder);
  });

  test('Add button is disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  test('sidebar Today nav link is active', async ({ page }) => {
    const todayNav = page.getByRole('link', { name: 'Today' });
    await expect(todayNav.first()).toBeVisible();
  });

  test('committed section heading shows active count', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Committed \(\d+ active\)/i })).toBeVisible();
  });
});
