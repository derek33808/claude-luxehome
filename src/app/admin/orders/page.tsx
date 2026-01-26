'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import OrderDetailClient from '@/components/admin/OrderDetailClient'

interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_name: string
  region: string
  currency: string
  total: number
  status: string
  payment_status: string
  fulfillment_status: string
  tracking_number: string | null
  shipping_carrier: string | null
  created_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

const fulfillmentColors: Record<string, string> = {
  unfulfilled: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  )
}

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we're viewing a specific order
  const orderId = searchParams.get('id')

  const getAuthToken = useCallback(() => {
    return sessionStorage.getItem('admin_token')
  }, [])

  const fetchOrders = useCallback(async (page = 1) => {
    const token = getAuthToken()
    if (!token) {
      router.push('/admin')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) {
        params.append('search', search)
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/.netlify/functions/admin-orders?${params}`, {
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
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [getAuthToken, router, search, statusFilter, pagination.limit])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push('/admin')
      return
    }
    // Only fetch orders list if not viewing a specific order
    if (!orderId) {
      fetchOrders()
    }
  }, [getAuthToken, router, fetchOrders, orderId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders(1)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    router.push('/admin')
  }

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      NZD: 'NZD $',
      AUD: 'AUD $',
      USD: 'USD $',
    }
    return `${currencySymbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // If viewing a specific order, show the detail view
  if (orderId) {
    return <OrderDetailClient orderId={orderId} />
  }

  // Otherwise show the orders list
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">LuxeHome Admin</h1>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                Orders
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by order #, email, or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fulfillment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.order_number}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.region.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total, order.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${fulfillmentColors[order.fulfillment_status] || 'bg-gray-100 text-gray-800'}`}>
                          {order.fulfillment_status}
                        </span>
                        {order.tracking_number && (
                          <div className="text-xs text-gray-500 mt-1">
                            {order.shipping_carrier}: {order.tracking_number}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/admin/orders?id=${order.id}`}
                          className="text-amber-600 hover:text-amber-800 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchOrders(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchOrders(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">Pending Fulfillment</div>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.fulfillment_status === 'unfulfilled').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">Shipped</div>
            <div className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.fulfillment_status === 'shipped').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">Delivered</div>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.fulfillment_status === 'delivered').length}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Main export with Suspense boundary for useSearchParams
export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminOrdersContent />
    </Suspense>
  )
}
