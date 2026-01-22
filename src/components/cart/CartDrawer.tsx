'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartContext } from './CartProvider'
import { RegionCode, getRegion } from '@/lib/regions'

interface CartDrawerProps {
  region: RegionCode
}

export function CartDrawer({ region }: CartDrawerProps) {
  const {
    cart,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    savings,
    isLoaded,
  } = useCartContext()

  const regionInfo = getRegion(region)

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Format price
  const formatPrice = (price: number) => {
    return `${regionInfo.currencySymbol}${price.toFixed(0)}`
  }

  if (!isLoaded) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl text-primary">
            Your Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-cream rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Contents */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          {cart.items.length === 0 ? (
            // Empty Cart
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <svg
                className="w-16 h-16 text-border mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-text-muted mb-4">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="btn-secondary text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3 bg-cream rounded-lg"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/${region}/p/${item.productSlug}`}
                      onClick={closeCart}
                      className="w-20 h-20 relative flex-shrink-0 bg-white rounded overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-contain p-1"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/${region}/p/${item.productSlug}`}
                        onClick={closeCart}
                        className="font-medium text-primary hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-primary">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-text-muted line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-auto p-1 text-text-muted hover:text-error transition-colors"
                          aria-label="Remove item"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 space-y-4 bg-white">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>You save</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-semibold text-primary">Total</span>
                  <span className="font-display text-xl text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full btn-primary"
                  onClick={() => {
                    // TODO: Implement checkout
                    alert('Checkout coming soon! This will integrate with payment processor.')
                  }}
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
