import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('InboxPage — Edge Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
  });

  test('double add does not duplicate capture', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.inboxTaskTitle);
    const add = page.getByRole('button', { name: 'Add' });
    await add.click();
    await add.click();
    await expect(page.getByText(meridianTodoData.valid.inboxTaskTitle)).toHaveCount(1);
  });

  test('unicode inbox title renders', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.unicodeTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.unicodeTaskTitle)).toBeVisible();
  });

  test('xss-like inbox title stays text', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.xssLikeTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.xssLikeTitle)).toBeVisible();
  });

  test('commit button moves task off inbox', async ({ page }) => {
    const row = page.getByText(meridianTodoData.tasks.prescription.title).locator('..').locator('..');
    await row.hover();
    await row.getByRole('button', { name: 'Commit' }).click();
    await expect(page.getByText(meridianTodoData.tasks.prescription.title)).not.toBeVisible();
  });

  test('navigate away mid-typing clears on return', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.inboxTaskTitle);
    await page.getByRole('link', { name: 'Today' }).first().click();
    await page.getByRole('link', { name: 'Inbox' }).first().click();
    await expect(page.getByLabel('New task')).toHaveValue('');
  });
});
