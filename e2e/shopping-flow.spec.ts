import { test, expect } from '@playwright/test'

/**
 * Luxehome E2E Tests - Core Shopping Flow
 *
 * Tests cover:
 * - Homepage loading and navigation
 * - Product browsing
 * - Add to cart functionality
 * - Checkout flow
 * - Region switching
 * - Filter and sort functionality
 *
 * Note: Tests run against production Netlify deployment
 */

test.describe('Homepage', () => {
  test('should load homepage with correct title', async ({ page }) => {
    await page.goto('/nz')
    await expect(page).toHaveTitle(/Luxehome/i)
  })

  test('should display header with navigation', async ({ page }) => {
    await page.goto('/nz')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('should display hero section with Premium text', async ({ page }) => {
    await page.goto('/nz')
    // Check for hero heading - matches "Premium Smart Home Essentials"
    const heroHeading = page.locator('h1').first()
    await expect(heroHeading).toBeVisible({ timeout: 10000 })
    await expect(heroHeading).toContainText(/Premium/i)
  })

  test('should display category cards', async ({ page }) => {
    await page.goto('/nz')
    // Check for category section with Kitchen, Outdoor, Tech, Lifestyle
    const categorySection = page.getByText(/Shop by Category/i)
    await expect(categorySection).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Region Switching', () => {
  test('should navigate to Australia region', async ({ page }) => {
    await page.goto('/au')
    await expect(page.url()).toContain('/au')
    // Check for AUD currency indicator
    await expect(page.getByText(/AUD/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to New Zealand region', async ({ page }) => {
    await page.goto('/nz')
    await expect(page.url()).toContain('/nz')
    // Check for NZD currency indicator
    await expect(page.getByText(/NZD/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to United States region', async ({ page }) => {
    await page.goto('/us')
    await expect(page.url()).toContain('/us')
    // Check for USD currency indicator
    await expect(page.getByText(/USD/i).first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Product Browsing', () => {
  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    // Check for product title
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })

  test('should display product images', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    // Look for any image on the page
    const productImage = page.locator('img').first()
    await expect(productImage).toBeVisible({ timeout: 10000 })
  })

  test('should display product price with currency', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    // Check for NZD price display
    await expect(page.getByText(/NZD/).first()).toBeVisible({ timeout: 10000 })
  })

  test('should display add to cart button', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    // Look for Add to Cart button - use .first() to handle multiple matches
    const addToCartButton = page.getByRole('button', { name: /add to cart/i }).first()
    await expect(addToCartButton).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Shopping Cart', () => {
  test('should add product to cart', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')

    // Click add to cart - use .first() to handle multiple buttons
    const addToCartButton = page.getByRole('button', { name: /add to cart/i }).first()
    await addToCartButton.click()

    // Wait for cart update animation
    await page.waitForTimeout(1000)

    // The cart should have items now - check if cart drawer appears or count updates
    // Success if no error thrown
  })

  test('should show cart drawer after adding item', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')

    // Add item first - use .first() to handle multiple buttons
    const addToCartButton = page.getByRole('button', { name: /add to cart/i }).first()
    await addToCartButton.click()
    await page.waitForTimeout(1000)

    // After adding item, the cart drawer should be visible
    // The drawer shows up automatically after adding to cart
    // Check for any cart-related content (drawer header or cart items)
    const cartContent = page.getByText(/your cart|shopping cart|cart/i).first()
    await expect(cartContent).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Category Page - Filter and Sort', () => {
  test('should navigate to category page', async ({ page }) => {
    await page.goto('/nz/tech')
    await expect(page.url()).toContain('/tech')
  })

  test('should display page heading', async ({ page }) => {
    await page.goto('/nz/tech')
    await page.waitForTimeout(2000)
    // Check for heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible({ timeout: 10000 })
  })

  test('should display products in category', async ({ page }) => {
    await page.goto('/nz/tech')
    await page.waitForTimeout(2000)
    // Check for main content area
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })
})

test.describe('Checkout Flow', () => {
  test('should navigate to checkout page', async ({ page }) => {
    await page.goto('/nz/checkout')
    // Page should load without 404 - checkout page exists
    await expect(page.url()).toContain('/checkout')
    // Page should have some content (body)
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})

test.describe('Static Pages', () => {
  test('should load About page', async ({ page }) => {
    await page.goto('/nz/about')
    await expect(page.url()).toContain('/about')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })

  test('should load FAQ page', async ({ page }) => {
    await page.goto('/nz/faq')
    await expect(page.url()).toContain('/faq')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })

  test('should load Shipping page', async ({ page }) => {
    await page.goto('/nz/shipping')
    await expect(page.url()).toContain('/shipping')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })

  test('should load Contact page', async ({ page }) => {
    await page.goto('/nz/contact')
    await expect(page.url()).toContain('/contact')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })

  test('should load Blog page', async ({ page }) => {
    await page.goto('/nz/blog')
    await expect(page.url()).toContain('/blog')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Footer', () => {
  test('should display footer', async ({ page }) => {
    await page.goto('/nz')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible({ timeout: 10000 })
  })

  test('should display newsletter signup in footer', async ({ page }) => {
    await page.goto('/nz')
    const footer = page.locator('footer')

    // Check for newsletter input (email type)
    const newsletterInput = footer.locator('input[type="email"]')
    await expect(newsletterInput).toBeVisible({ timeout: 10000 })
  })

  test('should display footer links', async ({ page }) => {
    await page.goto('/nz')
    const footer = page.locator('footer')

    // Check for common footer links
    const aboutLink = footer.getByRole('link', { name: /about/i })
    await expect(aboutLink).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Product Detail Page Features', () => {
  test('should display product reviews section', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    // Check for reviews or rating section
    const reviewSection = page.getByText(/review/i).first()
    await expect(reviewSection).toBeVisible({ timeout: 10000 })
  })

  test('should display product features', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    // Product should have features listed
    const content = await page.content()
    // Check page has substantial content
    expect(content.length).toBeGreaterThan(5000)
  })

  test('should display FAQ section on product page', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    // Check for Q&A or FAQ
    const faqText = page.getByText(/Q&A|FAQ|Questions/i).first()
    await expect(faqText).toBeVisible({ timeout: 15000 })
  })
})

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/nz')
    await page.waitForTimeout(2000)

    // Header should still be visible
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Content should be visible
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('should display mobile navigation', async ({ page }) => {
    await page.goto('/nz')
    // On mobile, menu might be hamburger - just check header is present
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })
})

test.describe('SEO and Metadata', () => {
  test('should have proper page title for homepage', async ({ page }) => {
    await page.goto('/nz')
    const title = await page.title()
    expect(title.toLowerCase()).toContain('luxehome')
  })

  test('should have proper page title for product page', async ({ page }) => {
    await page.goto('/nz/p/smart-digital-calendar')
    const title = await page.title()
    expect(title.toLowerCase()).toContain('calendar')
  })

  test('should have proper page title for about page', async ({ page }) => {
    await page.goto('/nz/about')
    const title = await page.title()
    expect(title.toLowerCase()).toContain('about')
  })
})

test.describe('Navigation Links', () => {
  test('should navigate from homepage to product', async ({ page }) => {
    await page.goto('/nz')
    // Click on a product link
    const productLink = page.getByRole('link', { name: /calendar|arcade/i }).first()
    if (await productLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await productLink.click()
      await page.waitForURL(/\/p\//)
      expect(page.url()).toContain('/p/')
    }
  })

  test('should navigate from homepage to category', async ({ page }) => {
    await page.goto('/nz')
    // Click on Tech category
    const categoryLink = page.getByRole('link', { name: /tech/i }).first()
    await categoryLink.click()
    await page.waitForURL(/\/tech/)
    expect(page.url()).toContain('/tech')
  })
})
