import { test, expect } from '@playwright/test';
import {
  gotoWithFreshSeed,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('UpcomingPage — UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await mockMeridianApi(page);
    await gotoWithFreshSeed(page, meridianTodoData.routes.upcoming);
  });

  test('upcoming heading and subtitle visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.upcomingHeading, level: 1 })).toBeVisible();
    await expect(page.getByText(/on the horizon/i)).toBeVisible();
  });

  test('tomorrow scheduled task is grouped', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.introParagraph.title)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tomorrow' })).toBeVisible();
  });

  test('future due task appears in upcoming', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.hvacInspection.title)).toBeVisible();
  });

  test('today committed tasks do not appear', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.logoLockups.title)).not.toBeVisible();
  });

  test('completed tasks do not appear in upcoming', async ({ page }) => {
    await expect(page.getByText(meridianTodoData.tasks.contractorQuote.title)).not.toBeVisible();
  });

  test('date group headings are visible', async ({ page }) => {
    const dateHeadings = page.getByRole('heading', { level: 2 });
    await expect(dateHeadings.first()).toBeVisible();
  });
});
