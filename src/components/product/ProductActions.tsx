'use client'

import { useState } from 'react'
import { useCartContext } from '@/components/cart'
import { Product } from '@/data/products'

interface ProductActionsProps {
  product: Product
  price: number
  comparePrice?: number
  currencySymbol: string
  variant?: 'primary' | 'final-cta'
}

export function ProductActions({
  product,
  price,
  comparePrice,
  currencySymbol,
  variant = 'primary',
}: ProductActionsProps) {
  const { addItem } = useCartContext()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product, {
      price,
      originalPrice: comparePrice || price,
      currency: currencySymbol,
    })

    setTimeout(() => setIsAdding(false), 300)
  }

  if (variant === 'final-cta') {
    return (
      <button
        onClick={handleAddToCart}
        className={`bg-accent text-white px-8 py-4 text-lg font-semibold hover:bg-accent/90 transition-all ${
          isAdding ? 'scale-95' : ''
        }`}
      >
        {isAdding ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added!
          </span>
        ) : (
          `Add to Cart - ${currencySymbol}${price}`
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <button
        onClick={handleAddToCart}
        className={`btn-primary flex-1 min-w-[200px] py-4 text-lg transition-all ${
          isAdding ? 'scale-95' : ''
        }`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added to Cart!
          </span>
        ) : (
          `Add to Cart - ${currencySymbol}${price}`
        )}
      </button>
      <button className="btn-secondary p-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  )
}
