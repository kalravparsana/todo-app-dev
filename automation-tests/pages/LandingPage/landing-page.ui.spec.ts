import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  meridianTodoData,
  mockMeridianApi,
} from '../../fixtures/mock-data/meridian-todo.data';

test.describe('LandingPage — UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await mockMeridianApi(page);
    await page.goto(`${BASE_URL}${meridianTodoData.routes.landing}`);
    await page.waitForLoadState('domcontentloaded');
  });

  test('hero section headline is visible', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: meridianTodoData.copy.landingHeadline }),
    ).toBeVisible();
  });

  test('Start your day CTA navigates to today app', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'Start your day' });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', meridianTodoData.routes.today);
  });

  test('Open Meridian CTA is visible in footer section', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Open Meridian' })).toBeVisible();
  });

  test('See how it works anchor link is present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'See how it works' })).toBeVisible();
  });

  test('feature cards render all three pillars', async ({ page }) => {
    await expect(page.getByRole('heading', { name: "Commit, don't collect" })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Capture without friction' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Gentle accountability' })).toBeVisible();
  });

  test('workflow section shows four steps', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Four moves, every day' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Capture' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sort' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Commit' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Close' })).toBeVisible();
  });

  test('header Open app link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Open app' })).toBeVisible();
  });
});
