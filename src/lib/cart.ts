'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/data/products'
import { RegionCode } from '@/lib/regions'

export interface CartItem {
  productId: string
  productName: string
  productSlug: string
  quantity: number
  price: number
  originalPrice: number
  currency: string
  image: string
}

export interface Cart {
  items: CartItem[]
  region: RegionCode
}

const CART_STORAGE_KEY = 'luxehome_cart'

// Get cart from localStorage
function getStoredCart(region: RegionCode): Cart {
  if (typeof window === 'undefined') return { items: [], region }
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Cart
      // Update region if it changed
      return { ...parsed, region }
    }
    return { items: [], region }
  } catch {
    return { items: [], region }
  }
}

// Save cart to localStorage
function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    console.error('Failed to save cart to localStorage')
  }
}

// Custom hook for cart management
export function useCart(region: RegionCode) {
  // Use lazy initialization to avoid effect-based setState
  const [cart, setCart] = useState<Cart>(() => ({ items: [], region }))
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = getStoredCart(region)
    setCart(stored)
    setIsLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Update region when it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      setCart(prev => ({ ...prev, region }))
    }
  }, [region, isLoaded])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveCart(cart)
    }
  }, [cart, isLoaded])

  // Add item to cart
  const addItem = useCallback((product: Product, priceInfo: { price: number; originalPrice: number; currency: string }) => {
    setCart(prev => {
      const existingIndex = prev.items.findIndex(item => item.productId === product.id)

      if (existingIndex >= 0) {
        // Update quantity
        const newItems = [...prev.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        }
        return { ...prev, items: newItems }
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          quantity: 1,
          price: priceInfo.price,
          originalPrice: priceInfo.originalPrice,
          currency: priceInfo.currency,
          image: product.images[0].url,
        }
        return { ...prev, items: [...prev.items, newItem] }
      }
    })
  }, [])

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId),
    }))
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }))
  }, [removeItem])

  // Clear cart
  const clearCart = useCallback(() => {
    setCart({ items: [], region })
  }, [region])

  // Calculate totals
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cart.items.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  )

  return {
    cart,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    savings,
  }
}
