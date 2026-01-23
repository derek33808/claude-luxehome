import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart, CartItem, Cart } from './cart'
import { Product } from '@/data/products'

// Mock product for testing
const mockProduct: Product = {
  id: 'test-product',
  slug: 'test-product',
  name: 'Test Product',
  shortDescription: 'A test product',
  description: 'Full description',
  category: 'tech',
  brand: 'Test Brand',
  images: [{ url: '/test.jpg', alt: 'Test' }],
  features: [],
  specifications: {},
  prices: {
    au: { price: 100, comparePrice: 120 },
    nz: { price: 110, comparePrice: 130 },
    us: { price: 80, comparePrice: 100 },
  },
  inStock: true,
  rating: 4.5,
  reviewCount: 10,
  tags: [],
}

const mockPriceInfo = {
  price: 100,
  originalPrice: 120,
  currency: 'NZD',
}

describe('useCart', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
    vi.mocked(window.localStorage.setItem).mockClear()
  })

  describe('initialization', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCart('nz'))

      expect(result.current.cart.items).toEqual([])
      expect(result.current.cart.region).toBe('nz')
      expect(result.current.itemCount).toBe(0)
      expect(result.current.subtotal).toBe(0)
    })

    it('should load cart from localStorage', () => {
      const storedCart: Cart = {
        items: [{
          cartItemId: 'test-product',
          productId: 'test-product',
          productName: 'Test Product',
          productSlug: 'test-product',
          quantity: 2,
          price: 100,
          originalPrice: 120,
          currency: 'NZD',
          image: '/test.jpg',
        }],
        region: 'nz',
      }
      vi.mocked(window.localStorage.getItem).mockReturnValue(JSON.stringify(storedCart))

      const { result } = renderHook(() => useCart('nz'))

      // After the effect runs
      expect(result.current.cart.items).toHaveLength(1)
    })
  })

  describe('addItem', () => {
    it('should add new item to cart', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
      })

      expect(result.current.cart.items).toHaveLength(1)
      expect(result.current.cart.items[0]).toMatchObject({
        productId: 'test-product',
        productName: 'Test Product',
        quantity: 1,
        price: 100,
        originalPrice: 120,
      })
    })

    it('should increment quantity for existing item', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
      })

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
      })

      expect(result.current.cart.items).toHaveLength(1)
      expect(result.current.cart.items[0].quantity).toBe(2)
    })

    it('should add color variants as separate items', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, { ...mockPriceInfo, colorVariant: 'White' })
      })

      act(() => {
        result.current.addItem(mockProduct, { ...mockPriceInfo, colorVariant: 'Grey' })
      })

      expect(result.current.cart.items).toHaveLength(2)
      expect(result.current.cart.items[0].colorVariant).toBe('White')
      expect(result.current.cart.items[1].colorVariant).toBe('Grey')
    })

    it('should include color variant in product name', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, { ...mockPriceInfo, colorVariant: 'White Frame' })
      })

      expect(result.current.cart.items[0].productName).toBe('Test Product - White Frame')
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
      })

      expect(result.current.cart.items).toHaveLength(1)

      act(() => {
        result.current.removeItem('test-product')
      })

      expect(result.current.cart.items).toHaveLength(0)
    })

    it('should not affect other items when removing one', () => {
      const { result } = renderHook(() => useCart('nz'))

      const product2 = { ...mockProduct, id: 'product-2', name: 'Product 2' }

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
        result.current.addItem(product2, mockPriceInfo)
      })

      expect(result.current.cart.items).toHaveLength(2)

      act(() => {
        result.current.removeItem('test-product')
      })

      expect(result.current.cart.items).toHaveLength(1)
      expect(result.current.cart.items[0].productId).toBe('product-2')
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
      })

      act(() => {
        result.current.updateQuantity('test-product', 5)
      })

      expect(result.current.cart.items[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
      })

      act(() => {
        result.current.updateQuantity('test-product', 0)
      })

      expect(result.current.cart.items).toHaveLength(0)
    })

    it('should remove item when quantity is negative', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
      })

      act(() => {
        result.current.updateQuantity('test-product', -1)
      })

      expect(result.current.cart.items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
        result.current.addItem({ ...mockProduct, id: 'product-2' }, mockPriceInfo)
      })

      expect(result.current.cart.items).toHaveLength(2)

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.cart.items).toHaveLength(0)
    })
  })

  describe('calculated values', () => {
    it('should calculate itemCount correctly', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, mockPriceInfo)
        result.current.addItem(mockProduct, mockPriceInfo)
        result.current.addItem({ ...mockProduct, id: 'product-2' }, mockPriceInfo)
      })

      expect(result.current.itemCount).toBe(3)
    })

    it('should calculate subtotal correctly', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, { price: 100, originalPrice: 120, currency: 'NZD' })
        result.current.addItem(mockProduct, { price: 100, originalPrice: 120, currency: 'NZD' })
      })

      expect(result.current.subtotal).toBe(200) // 100 * 2
    })

    it('should calculate savings correctly', () => {
      const { result } = renderHook(() => useCart('nz'))

      act(() => {
        result.current.addItem(mockProduct, { price: 100, originalPrice: 120, currency: 'NZD' })
        result.current.addItem(mockProduct, { price: 100, originalPrice: 120, currency: 'NZD' })
      })

      expect(result.current.savings).toBe(40) // (120-100) * 2
    })
  })
})
