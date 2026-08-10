import { test, expect } from '@playwright/test'

test.describe('BoxMap Core Flow E2E', () => {
  test('redirects unauthenticated user from protected routes to /sign-in', async ({ page }) => {
    await page.goto('/boxes')
    await expect(page).toHaveURL(/\/sign-in/)

    await page.goto('/search')
    await expect(page).toHaveURL(/\/sign-in/)
  })

  test('renders sign-in page elements correctly', async ({ page }) => {
    await page.goto('/sign-in')
    await expect(page.getByText(/sign in to your account/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('navigates from sign-in to sign-up', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL(/\/sign-up/)
    await expect(page.getByText(/create an account/i)).toBeVisible()
  })
})
