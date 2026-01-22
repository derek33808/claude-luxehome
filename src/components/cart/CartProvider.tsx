'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useCart, Cart } from '@/lib/cart'
import { Product } from '@/data/products'
import { RegionCode } from '@/lib/regions'

interface CartContextType {
  cart: Cart
  isLoaded: boolean
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (product: Product, priceInfo: { price: number; originalPrice: number; currency: string }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  savings: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({
  children,
  region,
}: {
  children: ReactNode
  region: RegionCode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const cartHook = useCart(region)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(prev => !prev)

  // Wrap addItem to also open cart
  const addItemAndOpen = (
    product: Product,
    priceInfo: { price: number; originalPrice: number; currency: string }
  ) => {
    cartHook.addItem(product, priceInfo)
    openCart()
  }

  return (
    <CartContext.Provider
      value={{
        ...cartHook,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem: addItemAndOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}
