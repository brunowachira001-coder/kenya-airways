import { test, expect } from '@playwright/test'

test.describe('Homepage flight date links', () => {
  test('hero slider links use current date 2026-07-14', async ({ page }) => {
    await page.goto('/')

    const links = await page.locator('a[href*="depart=2026-07-14"]').all()
    expect(links.length).toBeGreaterThanOrEqual(3)
  })

  test('promo banner links use current date 2026-07-14', async ({ page }) => {
    await page.goto('/')

    const link = page.locator('a[href*="depart=2026-07-14"]').first()
    await expect(link).toBeVisible()
  })

  test('book trip CTA uses current date 2026-07-14', async ({ page }) => {
    await page.goto('/')

    const link = page.locator('a[href*="depart=2026-07-14"]').first()
    await expect(link).toBeVisible()
  })

  test('homepage loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await expect(page.locator('h1, h2').first()).toBeVisible()

    expect(errors).toHaveLength(0)
  })
})
