import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('TodayPage — Edge Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
  });

  test('double submit does not duplicate task', async ({ page }) => {
    const input = page.getByLabel('New task');
    await input.fill(meridianTodoData.valid.taskTitle);
    const addBtn = page.getByRole('button', { name: 'Add' });
    await addBtn.click();
    await addBtn.click();
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toHaveCount(1);
  });

  test('unicode task title renders correctly', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.unicodeTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.unicodeTaskTitle)).toBeVisible();
  });

  test('xss-like title is rendered as plain text', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.xssLikeTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.xssLikeTitle)).toBeVisible();
    await expect(page.locator('script')).toHaveCount(0);
  });

  test('navigating to inbox and back preserves today tasks', async ({ page }) => {
    await page.getByRole('link', { name: 'Inbox' }).first().click();
    await page.getByRole('link', { name: 'Today' }).first().click();
    await expect(page.getByText(meridianTodoData.tasks.logoLockups.title)).toBeVisible();
  });

  test('rapid complete toggle restores task', async ({ page }) => {
    const title = meridianTodoData.tasks.contentCalendar.title;
    await page.getByRole('button', { name: `Complete "${title}"` }).click();
    await page.getByRole('button', { name: `Mark "${title}" incomplete` }).click();
    await expect(page.getByRole('button', { name: `Complete "${title}"` })).toBeVisible();
  });
});
