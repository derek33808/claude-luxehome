import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Initialize Supabase client with service role for admin operations
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Simple password authentication
function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not configured')
    return false
  }
  return password === adminPassword
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Content-Type': 'application/json',
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    }
  }

  // Authenticate request
  const authHeader = event.headers.authorization || event.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized' }),
    }
  }

  const password = authHeader.substring(7)
  if (!validateAdminPassword(password)) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid credentials' }),
    }
  }

  const supabase = getSupabaseClient()
  const path = event.path.replace('/.netlify/functions/admin-orders', '')
  const method = event.httpMethod

  try {
    // GET /admin-orders - List all orders with filtering and pagination
    if (method === 'GET' && !path) {
      const params = event.queryStringParameters || {}
      const page = parseInt(params.page || '1')
      const limit = parseInt(params.limit || '20')
      const status = params.status
      const search = params.search
      const sortBy = params.sortBy || 'created_at'
      const sortOrder = params.sortOrder || 'desc'

      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_email,
          customer_name,
          region,
          currency,
          total,
          status,
          payment_status,
          fulfillment_status,
          tracking_number,
          shipping_carrier,
          created_at
        `, { count: 'exact' })

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`)
      }

      // Apply sorting
      const ascending = sortOrder === 'asc'
      query = query.order(sortBy, { ascending })

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data: orders, error, count } = await query

      if (error) {
        throw error
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          orders: orders?.map(order => ({
            ...order,
            total: order.total / 100, // Convert from cents
          })),
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          },
        }),
      }
    }

    // GET /admin-orders/:id - Get single order details
    if (method === 'GET' && path.startsWith('/')) {
      const orderId = path.substring(1)

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Order not found' }),
        }
      }

      // Fetch order items
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          ...order,
          subtotal: order.subtotal / 100,
          shipping: order.shipping / 100,
          tax: order.tax / 100,
          total: order.total / 100,
          items: (items || []).map(item => ({
            ...item,
            unit_price: item.unit_price / 100,
            total_price: item.total_price / 100,
          })),
        }),
      }
    }

    // PUT /admin-orders/:id - Update order (status, tracking, etc.)
    if (method === 'PUT' && path.startsWith('/')) {
      const orderId = path.substring(1)
      const body = JSON.parse(event.body || '{}')

      // Allowed update fields
      const allowedFields = [
        'status',
        'fulfillment_status',
        'tracking_number',
        'shipping_carrier',
        'shipped_at',
        'delivered_at',
        'notes',
      ]

      const updateData: Record<string, unknown> = {}
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field]
        }
      }

      // Auto-set shipped_at when fulfillment_status changes to 'shipped'
      if (body.fulfillment_status === 'shipped' && !body.shipped_at) {
        updateData.shipped_at = new Date().toISOString()
      }

      // Auto-set delivered_at when fulfillment_status changes to 'delivered'
      if (body.fulfillment_status === 'delivered' && !body.delivered_at) {
        updateData.delivered_at = new Date().toISOString()
      }

      const { data: order, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          order: {
            ...order,
            subtotal: order.subtotal / 100,
            shipping: order.shipping / 100,
            tax: order.tax / 100,
            total: order.total / 100,
          },
        }),
      }
    }

    // POST /admin-orders/:id/refund - Process refund
    if (method === 'POST' && path.endsWith('/refund')) {
      const orderId = path.replace('/refund', '').substring(1)
      const body = JSON.parse(event.body || '{}')
      const amount = body.amount // in dollars
      const reason = body.reason || 'requested_by_customer'

      // Get order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('stripe_payment_intent, total, currency')
        .eq('id', orderId)
        .single()

      if (orderError || !order || !order.stripe_payment_intent) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Order not found or no payment intent' }),
        }
      }

      // Process refund through Stripe
      const refundAmount = amount ? Math.round(amount * 100) : order.total
      const refund = await stripe.refunds.create({
        payment_intent: order.stripe_payment_intent,
        amount: refundAmount,
        reason: reason as Stripe.RefundCreateParams.Reason,
      })

      // Update order status
      await supabase
        .from('orders')
        .update({
          status: 'refunded',
          notes: `Refund processed: ${refund.id}`,
        })
        .eq('id', orderId)

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          refundId: refund.id,
          amount: refundAmount / 100,
        }),
      }
    }

    // Endpoint not found
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    }

  } catch (error) {
    console.error('Admin API error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    }
  }
}
