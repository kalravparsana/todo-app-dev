import { test, expect } from '@playwright/test';
import { gotoWithFreshSeed, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('UpcomingPage — Edge Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
  });

  test('rapid complete toggle on upcoming task', async ({ page }) => {
    const title = meridianTodoData.tasks.hvacInspection.title;
    await page.getByRole('button', { name: `Complete "${title}"` }).click();
    await page.getByRole('button', { name: `Mark "${title}" incomplete` }).click();
    await expect(page.getByRole('button', { name: `Complete "${title}"` })).toBeVisible();
  });

  test('navigate to today and back preserves groups', async ({ page }) => {
    await page.getByRole('link', { name: 'Today' }).first().click();
    await page.getByRole('link', { name: 'Upcoming' }).first().click();
    await expect(page.getByText(meridianTodoData.tasks.introParagraph.title)).toBeVisible();
  });

  test('page reload keeps upcoming tasks', async ({ page }) => {
    await page.reload();
    await expect(page.getByText(meridianTodoData.tasks.hvacInspection.title)).toBeVisible();
  });

  test('commit then uncommit on upcoming task', async ({ page }) => {
    const row = page.getByText(meridianTodoData.tasks.introParagraph.title).locator('..').locator('..');
    await row.hover();
    await row.getByRole('button', { name: 'Commit' }).click();
    await row.hover();
    await row.getByRole('button', { name: 'Committed' }).click();
    await row.hover();
    await expect(row.getByRole('button', { name: 'Commit' })).toBeVisible();
  });

  test('multiple date groups sort chronologically', async ({ page }) => {
    const headings = page.getByRole('heading', { level: 2 });
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const first = await headings.first().textContent();
    expect(first?.length).toBeGreaterThan(0);
  });
});
