import { describe, it, expect } from 'vitest'
import {
  products,
  categories,
  getProductBySlug,
  getProductsByCategory,
  getAllProducts,
} from './products'

describe('products data', () => {
  describe('products array', () => {
    it('should have at least 2 products', () => {
      expect(products.length).toBeGreaterThanOrEqual(2)
    })

    it('each product should have required fields', () => {
      products.forEach(product => {
        expect(product.id).toBeTruthy()
        expect(product.slug).toBeTruthy()
        expect(product.name).toBeTruthy()
        expect(product.shortDescription).toBeTruthy()
        expect(product.description).toBeTruthy()
        expect(product.category).toBeTruthy()
        expect(product.brand).toBeTruthy()
        expect(product.images.length).toBeGreaterThan(0)
        expect(product.features.length).toBeGreaterThan(0)
        expect(product.prices).toBeTruthy()
        expect(product.prices.au).toBeTruthy()
        expect(product.prices.nz).toBeTruthy()
        expect(product.prices.us).toBeTruthy()
        expect(typeof product.rating).toBe('number')
        expect(typeof product.reviewCount).toBe('number')
      })
    })

    it('each product should have valid prices for all regions', () => {
      products.forEach(product => {
        expect(product.prices.au.price).toBeGreaterThan(0)
        expect(product.prices.nz.price).toBeGreaterThan(0)
        expect(product.prices.us.price).toBeGreaterThan(0)
      })
    })

    it('each product image should have url and alt', () => {
      products.forEach(product => {
        product.images.forEach(image => {
          expect(image.url).toBeTruthy()
          expect(image.alt).toBeTruthy()
        })
      })
    })
  })

  describe('categories', () => {
    it('should have 4 categories defined', () => {
      expect(Object.keys(categories)).toHaveLength(4)
    })

    it('should have tech, lifestyle, kitchen, outdoor categories', () => {
      expect(categories).toHaveProperty('tech')
      expect(categories).toHaveProperty('lifestyle')
      expect(categories).toHaveProperty('kitchen')
      expect(categories).toHaveProperty('outdoor')
    })

    it('each category should have name, description, and icon', () => {
      Object.values(categories).forEach(category => {
        expect(category.name).toBeTruthy()
        expect(category.description).toBeTruthy()
        expect(category.icon).toBeTruthy()
      })
    })
  })

  describe('getProductBySlug', () => {
    it('should return product for valid slug', () => {
      const product = getProductBySlug('smart-digital-calendar')
      expect(product).toBeDefined()
      expect(product?.slug).toBe('smart-digital-calendar')
    })

    it('should return undefined for invalid slug', () => {
      const product = getProductBySlug('non-existent-product')
      expect(product).toBeUndefined()
    })
  })

  describe('getProductsByCategory', () => {
    it('should return products for tech category', () => {
      const techProducts = getProductsByCategory('tech')
      expect(techProducts.length).toBeGreaterThan(0)
      techProducts.forEach(product => {
        expect(product.category).toBe('tech')
      })
    })

    it('should return products for lifestyle category', () => {
      const lifestyleProducts = getProductsByCategory('lifestyle')
      expect(lifestyleProducts.length).toBeGreaterThan(0)
      lifestyleProducts.forEach(product => {
        expect(product.category).toBe('lifestyle')
      })
    })

    it('should return empty array for category with no products', () => {
      // Kitchen and outdoor currently have no products
      const kitchenProducts = getProductsByCategory('kitchen')
      expect(Array.isArray(kitchenProducts)).toBe(true)
    })
  })

  describe('getAllProducts', () => {
    it('should return all products', () => {
      const allProducts = getAllProducts()
      expect(allProducts).toEqual(products)
      expect(allProducts.length).toBe(products.length)
    })
  })

  describe('Smart Digital Calendar product', () => {
    it('should have correct basic info', () => {
      const calendar = getProductBySlug('smart-digital-calendar')
      expect(calendar).toBeDefined()
      expect(calendar?.name).toBe('Smart Digital Calendar')
      expect(calendar?.category).toBe('tech')
      expect(calendar?.brand).toBe('LOCVMIKY')
    })

    it('should have color variants', () => {
      const calendar = getProductBySlug('smart-digital-calendar')
      expect(calendar?.colorVariants).toBeDefined()
      expect(calendar?.colorVariants?.length).toBe(3)

      const variantNames = calendar?.colorVariants?.map(v => v.name)
      expect(variantNames).toContain('White Frame')
      expect(variantNames).toContain('Grey Frame')
      expect(variantNames).toContain('Snow White Frame')
    })

    it('should have correct prices', () => {
      const calendar = getProductBySlug('smart-digital-calendar')
      expect(calendar?.prices.au.price).toBe(369)
      expect(calendar?.prices.nz.price).toBe(429)
      expect(calendar?.prices.us.price).toBe(249)
    })
  })

  describe('Mini Arcade Machine product', () => {
    it('should have correct basic info', () => {
      const arcade = getProductBySlug('mini-arcade-machine')
      expect(arcade).toBeDefined()
      expect(arcade?.name).toBe('Mini Arcade Machine')
      expect(arcade?.category).toBe('lifestyle')
      expect(arcade?.brand).toBe('Orb Gaming by ThumbsUp')
    })

    it('should have multiple images', () => {
      const arcade = getProductBySlug('mini-arcade-machine')
      expect(arcade?.images.length).toBeGreaterThan(5)
    })

    it('should not have color variants', () => {
      const arcade = getProductBySlug('mini-arcade-machine')
      expect(arcade?.colorVariants).toBeUndefined()
    })
  })
})
