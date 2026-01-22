'use client'

import { useState } from 'react'
import { useCartContext } from './CartProvider'
import { Product } from '@/data/products'

interface AddToCartButtonProps {
  product: Product
  price: number
  originalPrice: number
  currency: string
  className?: string
}

export function AddToCartButton({
  product,
  price,
  originalPrice,
  currency,
  className = '',
}: AddToCartButtonProps) {
  const { addItem } = useCartContext()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product, { price, originalPrice, currency })

    // Reset animation after a short delay
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`btn-primary relative overflow-hidden ${className} ${
        isAdding ? 'scale-95' : ''
      } transition-transform`}
    >
      <span className={`flex items-center justify-center gap-2 ${isAdding ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        ADD TO CART - {currency}{price}
      </span>
      {isAdding && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      )}
    </button>
  )
}
