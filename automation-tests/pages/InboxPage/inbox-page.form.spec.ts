import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('InboxPage — Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.inbox);
  });

  test('empty submit does not add task', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click({ force: true });
    await expect(page.getByText(meridianTodoData.valid.inboxTaskTitle)).not.toBeVisible();
  });

  test('whitespace-only title keeps Add disabled', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.invalid.whitespaceTitle);
    await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  test('valid capture adds inbox task', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.inboxTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.valid.inboxTaskTitle)).toBeVisible();
  });

  test('Enter submits capture form', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.inboxTaskTitle);
    await page.getByLabel('New task').press('Enter');
    await expect(page.getByText(meridianTodoData.valid.inboxTaskTitle)).toBeVisible();
  });

  test('Escape clears capture input', async ({ page }) => {
    const input = page.getByLabel('New task');
    await input.fill(meridianTodoData.valid.inboxTaskTitle);
    await input.press('Escape');
    await expect(input).toHaveValue('');
  });

  test('special characters in title are accepted', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.searchLikeTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.searchLikeTitle)).toBeVisible();
  });
});
