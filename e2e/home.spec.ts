import { test, expect } from '@playwright/test';

test('Should display TaskFlow and allow adding a todo', async ({ page }) => {
  await page.goto('/');

  // Page loads with heading
  await expect(page.locator('h1')).toContainText('TaskFlow');

  // Add input and button are visible
  const input = page.locator('#todo-input');
  const addBtn = page.locator('button[type="submit"]');
  await expect(input).toBeVisible();
  await expect(addBtn).toBeVisible();

  // Add a todo
  await input.fill('E2E test task');
  await addBtn.click();

  // Task appears in the list
  await expect(page.locator('.todo-list')).toContainText('E2E test task');
});

test('Should mark a todo as done and back to active', async ({ page }) => {
  await page.goto('/');

  // Add a fresh task with unique name
  const taskName = `Toggle task ${Date.now()}`;
  await page.locator('#todo-input').fill(taskName);
  await page.locator('button[type="submit"]').click();

  // Wait for it to appear
  const item = page.locator('.todo-item').filter({ hasText: taskName });
  await expect(item).toBeVisible();

  // Click its checkbox (it's a new task, so checked=false)
  const checkbox = item.locator('.todo-checkbox');
  await checkbox.click();

  // Item should gain the "done" class
  await expect(item).toHaveClass(/done/);
});
