import { test, expect } from '@playwright/test';
import { BASE_URL, meridianTodoData } from '../../fixtures/mock-data/meridian-todo.data';

test.describe('LandingPage — Edge Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('rapid double-click on Start your day still navigates once', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Start your day' });
    await link.dblclick();
    await expect(page).toHaveURL(new RegExp(`${meridianTodoData.routes.today}$`));
  });

  test('navigating away and back preserves landing content', async ({ page }) => {
    await page.getByRole('link', { name: 'Open app' }).click();
    await page.goBack();
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('hash anchor navigation does not break page', async ({ page }) => {
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}#how-it-works`);
    await expect(page.getByRole('heading', { name: 'Four moves, every day' })).toBeVisible();
  });

  test('page reload keeps primary heading', async ({ page }) => {
    await page.reload();
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('multiple CTA links all point to app today route', async ({ page }) => {
    const startLink = page.getByRole('link', { name: 'Start your day' });
    const openAppLink = page.getByRole('link', { name: 'Open app' });
    const openMeridianLink = page.getByRole('link', { name: 'Open Meridian' });
    await expect(startLink).toHaveAttribute('href', meridianTodoData.routes.today);
    await expect(openAppLink).toHaveAttribute('href', meridianTodoData.routes.today);
    await expect(openMeridianLink).toHaveAttribute('href', meridianTodoData.routes.today);
  });
});
