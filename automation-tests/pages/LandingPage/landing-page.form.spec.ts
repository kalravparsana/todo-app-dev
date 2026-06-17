import { test, expect } from '@playwright/test';
import { BASE_URL, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('LandingPage — Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('Start your day navigates to Today page', async ({ page }) => {
    await page.getByRole('link', { name: 'Start your day' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.today}$`));
    await expect(page.getByRole('heading', { name: meridianTodoData.copy.todayHeading })).toBeVisible();
  });

  test('Open Meridian navigates to Today page', async ({ page }) => {
    await page.getByRole('link', { name: 'Open Meridian' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.today}$`));
  });

  test('header Open app navigates to Today page', async ({ page }) => {
    await page.getByRole('link', { name: 'Open app' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.today}$`));
  });

  test('See how it works scrolls to workflow section', async ({ page }) => {
    await page.getByRole('link', { name: 'See how it works' }).click();
    await expect(page.locator('#how-it-works')).toBeInViewport();
    await expect(page.getByRole('heading', { name: 'Four moves, every day' })).toBeVisible();
  });

  test('Sign in link navigates to app', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.today}$`));
  });
});
