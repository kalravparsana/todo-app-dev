import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

const projectDetailPath = meridianTodoData.routes.projectDetail(meridianTodoData.routes.seedProjectId);

test.describe('ProjectDetailPage — Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, projectDetailPath);
  });

  test('empty quick add does not create task', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click({ force: true });
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).not.toBeVisible();
  });

  test('whitespace title keeps Add disabled', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.invalid.whitespaceTitle);
    await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  test('valid quick add creates project-scoped task', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toBeVisible();
  });

  test('Enter submits project quick add', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.valid.taskTitle);
    await page.getByLabel('New task').press('Enter');
    await expect(page.getByText(meridianTodoData.valid.taskTitle)).toBeVisible();
  });

  test('Escape clears project quick add', async ({ page }) => {
    const input = page.getByLabel('New task');
    await input.fill(meridianTodoData.valid.taskTitle);
    await input.press('Escape');
    await expect(input).toHaveValue('');
  });

  test('unicode title accepted in project', async ({ page }) => {
    await page.getByLabel('New task').fill(meridianTodoData.edge.unicodeTaskTitle);
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(meridianTodoData.edge.unicodeTaskTitle)).toBeVisible();
  });
});
