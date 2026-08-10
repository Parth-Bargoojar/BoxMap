import { test, expect } from '@playwright/test';

test('landing page or root route handles navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(sign-in|$)/);
});