import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('TodayPage — Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.today);
  });

  test('empty quick add does not create a task', async ({ page }) => {
    const input = page.getByLabel('New task');
    await input.fill(meridianTodoData.invalid.emptyTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).not.toBeVisible();
  });

  test('whitespace-only quick add is blocked', async ({ page }) => {
    const input = page.getByLabel('New task');
    await input.fill(meridianTodoData.invalid.whitespaceTitle);
    await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  test('valid quick add creates committed task', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toBeVisible();
    await expect(page.getByLabel('New task')).toHaveValue('');
  });

  test('Enter key submits quick add', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByLabel('New task').press('Enter');
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toBeVisible();
  });

  test('Escape clears quick add input', async ({ page }) => {
    const input = page.getByLabel('New task');
    await input.fill(meridianTodoData.valid.taskTitle);
    await input.press('Escape');
    await expect(input).toHaveValue('');
  });

  test('long task title is accepted', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.longTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.longTaskTitle)).toBeVisible();
  });
});
