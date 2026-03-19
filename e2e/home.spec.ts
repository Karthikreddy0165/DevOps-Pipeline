import { test, expect } from '@playwright/test';

test('Should display login prompt', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('TaskFlow');
  await expect(page.locator('button', { hasText: /Sign In/i })).toBeVisible();
});
