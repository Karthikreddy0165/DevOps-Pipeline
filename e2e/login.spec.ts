import { test, expect } from '@playwright/test';

test('validates the authentication page components', async ({ page }) => {
  await page.goto('/');

  // Ensure main headings and title are present
  await expect(page.locator('h1 >> text=TaskFlow')).toBeVisible();
  await expect(page.locator('text=Welcome back')).toBeVisible();

  // Ensure the primary authentication options exist
  await expect(page.locator('button', { hasText: 'Continue with Google' })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();

  // Test toggle to Sign Up
  await page.click('button:has-text("Sign Up")');
  await expect(page.locator('text=Create account')).toBeVisible();
});
