'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OrderItem {
  id: string
  product_name: string
  product_slug: string | null
  color_variant: string | null
  quantity: number
  unit_price: number
  total_price: number
  image_url: string | null
}

interface Order {
  id: string
  order_number: string
  stripe_session_id: string
  stripe_payment_intent: string
  customer_email: string
  customer_name: string
  customer_phone: string | null
  shipping_address: {
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
  payment_status: string
  fulfillment_status: string
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  delivered_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

const fulfillmentOptions = [
  { value: 'unfulfilled', label: 'Unfulfilled' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
]

const carrierOptions = [
  { value: 'NZ Post', label: 'NZ Post' },
  { value: 'CourierPost', label: 'CourierPost' },
  { value: 'Australia Post', label: 'Australia Post' },
  { value: 'DHL', label: 'DHL' },
  { value: 'FedEx', label: 'FedEx' },
  { value: 'UPS', label: 'UPS' },
  { value: 'USPS', label: 'USPS' },
  { value: 'Other', label: 'Other' },
]

interface OrderDetailClientProps {
  orderId: string
}

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingNotification, setSendingNotification] = useState(false)
  const [processingRefund, setProcessingRefund] = useState(false)
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [status, setStatus] = useState('')
  const [fulfillmentStatus, setFulfillmentStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingCarrier, setShippingCarrier] = useState('')
  const [notes, setNotes] = useState('')

  const router = useRouter()

  const getAuthToken = useCallback(() => {
    return sessionStorage.getItem('admin_token')
  }, [])

  const fetchOrder = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      router.push('/admin')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/.netlify/functions/admin-orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        sessionStorage.removeItem('admin_token')
        router.push('/admin')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }

      const data = await response.json()
      setOrder(data)
      setStatus(data.status)
      setFulfillmentStatus(data.fulfillment_status)
      setTrackingNumber(data.tracking_number || '')
      setShippingCarrier(data.shipping_carrier || '')
      setNotes(data.notes || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [getAuthToken, router, orderId])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push('/admin')
      return
    }
    fetchOrder()
  }, [getAuthToken, router, fetchOrder])

  const handleSave = async () => {
    const token = getAuthToken()
    if (!token) {
      router.push('/admin')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/.netlify/functions/admin-orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          fulfillment_status: fulfillmentStatus,
          tracking_number: trackingNumber || null,
          shipping_carrier: shippingCarrier || null,
          notes: notes || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      const data = await response.json()
      setOrder(data.order)
      setSuccess('Order updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    } finally {
      setSaving(false)
    }
  }

  const handleSendShippingNotification = async () => {
    const token = getAuthToken()
    if (!token || !order) return

    if (!trackingNumber || !shippingCarrier) {
      setError('Please enter tracking number and carrier before sending notification')
      return
    }

    setSendingNotification(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/.netlify/functions/send-shipping-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          trackingNumber,
          shippingCarrier,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send notification')
      }

      setSuccess('Shipping notification sent successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification')
    } finally {
      setSendingNotification(false)
    }
  }

  const handleRefund = async () => {
    const token = getAuthToken()
    if (!token || !order) return

    setProcessingRefund(true)
    setError('')
    setSuccess('')
    setShowRefundConfirm(false)

    try {
      const response = await fetch(`/.netlify/functions/admin-orders/${orderId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: 'requested_by_customer',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process refund')
      }

      const data = await response.json()
      setSuccess(`Refund processed successfully! Refund ID: ${data.refundId}`)
      // Refresh order data
      fetchOrder()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process refund')
    } finally {
      setProcessingRefund(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      NZD: 'NZD $',
      AUD: 'AUD $',
      USD: 'USD $',
    }
    return `${currencySymbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading order...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Order not found</h2>
          <Link href="/admin/orders" className="text-amber-600 hover:underline mt-2 block">
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/orders" className="text-gray-500 hover:text-gray-700">
                &larr; Orders
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{order.order_number}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                order.status === 'paid' ? 'bg-green-100 text-green-800' :
                order.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                order.fulfillment_status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.fulfillment_status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.fulfillment_status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    {item.image_url && (
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.product_name}</div>
                      {item.color_variant && (
                        <div className="text-sm text-gray-500">Color: {item.color_variant}</div>
                      )}
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(item.total_price, order.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(item.unit_price, order.currency)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(order.subtotal, order.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping, order.currency)}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span>{formatCurrency(order.tax, order.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.total, order.currency)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                  <p className="text-gray-900">{order.customer_name}</p>
                  <p className="text-gray-600">{order.customer_email}</p>
                  {order.customer_phone && (
                    <p className="text-gray-600">{order.customer_phone}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                  <p className="text-gray-900">
                    {order.shipping_address.firstName} {order.shipping_address.lastName}
                  </p>
                  <p className="text-gray-600">{order.shipping_address.address}</p>
                  <p className="text-gray-600">
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
                  </p>
                  <p className="text-gray-600">{order.shipping_address.country}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                {order.shipped_at && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipped</p>
                      <p className="text-sm text-gray-500">{formatDate(order.shipped_at)}</p>
                      {order.tracking_number && (
                        <p className="text-sm text-gray-500">
                          {order.shipping_carrier}: {order.tracking_number}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {order.delivered_at && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivered</p>
                      <p className="text-sm text-gray-500">{formatDate(order.delivered_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Update Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Update Order</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {fulfillmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Internal notes..."
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Shipping / Tracking */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Carrier
                  </label>
                  <select
                    value={shippingCarrier}
                    onChange={(e) => setShippingCarrier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select carrier...</option>
                    {carrierOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter tracking number..."
                  />
                </div>

                <button
                  onClick={handleSendShippingNotification}
                  disabled={sendingNotification || !trackingNumber || !shippingCarrier}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-md font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {sendingNotification ? 'Sending...' : 'Send Shipping Notification'}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Sends email to customer with tracking info
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Order ID</dt>
                  <dd className="text-gray-900 font-mono text-xs">{order.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Region</dt>
                  <dd className="text-gray-900">{order.region.toUpperCase()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Currency</dt>
                  <dd className="text-gray-900">{order.currency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Payment Intent</dt>
                  <dd className="text-gray-900 font-mono text-xs truncate max-w-[150px]" title={order.stripe_payment_intent}>
                    {order.stripe_payment_intent}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">{formatDate(order.created_at)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Updated</dt>
                  <dd className="text-gray-900">{formatDate(order.updated_at)}</dd>
                </div>
              </dl>
            </div>

            {/* Refund Action */}
            {order.status !== 'refunded' && order.status !== 'cancelled' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
                <button
                  onClick={() => setShowRefundConfirm(true)}
                  disabled={processingRefund}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {processingRefund ? 'Processing...' : 'Process Refund'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Full refund via Stripe
                </p>
              </div>
            )}

            {order.status === 'refunded' && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">💸</div>
                  <h3 className="font-medium text-gray-900">Order Refunded</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    This order has been refunded
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Refund Confirmation Modal */}
      {showRefundConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Refund</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to refund this order? This will refund the full amount of{' '}
              <strong>{formatCurrency(order.total, order.currency)}</strong> to the customer.
            </p>
            <p className="text-sm text-red-600 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={processingRefund}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                {processingRefund ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
