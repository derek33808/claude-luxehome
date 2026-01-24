'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCartContext } from '@/components/cart/CartProvider'
import { getRegion, RegionCode } from '@/lib/regions'

interface OrderItem {
  name: string
  slug: string | null
  colorVariant: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  imageUrl: string | null
}

interface OrderDetails {
  orderNumber: string
  customerEmail: string
  customerName: string
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  region: string
  currency: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  createdAt: string
  items: OrderItem[]
}

interface SuccessContentProps {
  regionCode: string
}

export function SuccessContent({ regionCode }: SuccessContentProps) {
  const searchParams = useSearchParams()
  const { clearCart } = useCartContext()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCleared, setCartCleared] = useState(false)

  const region = getRegion(regionCode as RegionCode)

  // Format currency for display
  const formatPrice = useCallback((amount: number) => {
    const currencyMap: Record<string, string> = {
      'AUD': 'AUD $',
      'NZD': 'NZD $',
      'USD': 'USD $'
    }
    const symbol = currencyMap[order?.currency || region.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }, [order?.currency, region.currency])

  // Get session ID from URL
  const sid = searchParams.get('session_id')

  useEffect(() => {
    // Only update if session ID changed
    if (sid !== sessionId) {
      setSessionId(sid)
    }
  }, [sid, sessionId])

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    // Fetch order details from API
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/.netlify/functions/get-order?session_id=${sessionId}`)
        if (!res.ok) {
          throw new Error('Order not found')
        }
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Unable to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [sessionId])

  // Clear cart on mount (only once)
  useEffect(() => {
    if (!cartCleared) {
      clearCart()
      setCartCleared(true)
    }
  }, [clearCart, cartCleared])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-green-600"
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
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-primary mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-text-light">
              Thank you for your order. We&apos;ve received your payment and will process your order shortly.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="mt-4 text-text-light">Loading order details...</p>
            </div>
          )}

          {/* Order Details */}
          {order && !loading && (
            <div className="space-y-6">
              {/* Order Number */}
              <div className="bg-cream rounded-lg p-6 text-center">
                <p className="text-sm text-text-muted mb-1">Order Number</p>
                <p className="text-2xl font-bold text-accent">{order.orderNumber}</p>
                <p className="text-sm text-text-light mt-2">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Order Items</h2>
                <div className="border rounded-lg divide-y">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.colorVariant && (
                          <p className="text-sm text-text-light">Color: {item.colorVariant}</p>
                        )}
                        <p className="text-sm text-text-light">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-text-light">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-light">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-text-light">
                      <span>Tax</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-text-light">{order.shippingAddress.address}</p>
                  <p className="text-text-light">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-text-light">{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Confirmation Email */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="font-medium text-blue-800">Confirmation email sent</p>
                  <p className="text-sm text-blue-700">
                    We&apos;ve sent a confirmation email to <span className="font-medium">{order.customerEmail}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for no order data */}
          {!order && !loading && !error && (
            <div className="bg-cream rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-lg mb-4">What&apos;s Next?</h2>
              <ul className="space-y-3 text-text-light">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>You&apos;ll receive an order confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span>Your order will be prepared and shipped within 1-2 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Track your order status with the tracking number in your email</span>
                </li>
              </ul>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-yellow-800">{error}</p>
              <p className="text-sm text-yellow-700 mt-2">
                Don&apos;t worry - your payment was successful. Please check your email for order confirmation.
              </p>
            </div>
          )}

          {/* Session ID (fallback reference) */}
          {sessionId && !order && (
            <div className="text-sm text-text-muted mb-8 text-center">
              Order Reference: <span className="font-mono">{sessionId.slice(-12)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href={`/${regionCode}`}
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-semibold rounded transition-colors hover:bg-accent/90"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/${regionCode}/contact`}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded transition-colors hover:bg-primary hover:text-white"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-8 text-center text-text-muted">
          <p className="mb-2">Questions about your order?</p>
          <a href="mailto:support@luxehome.com" className="text-accent hover:underline">
            support@luxehome.com
          </a>
        </div>
      </div>
    </div>
  )
}
