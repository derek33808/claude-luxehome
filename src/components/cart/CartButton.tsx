'use client'

import { useCartContext } from './CartProvider'

export function CartButton() {
  const { toggleCart, itemCount, isLoaded } = useCartContext()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-cream rounded-full transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {isLoaded && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  )
}
