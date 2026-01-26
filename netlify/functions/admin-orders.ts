import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Initialize Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }
  return new Resend(apiKey)
}

// Format currency for display
function formatCurrency(amountInCents: number, currency: string): string {
  const amount = amountInCents / 100
  const currencyMap: Record<string, string> = {
    'aud': 'AUD $',
    'nzd': 'NZD $',
    'usd': 'USD $'
  }
  const symbol = currencyMap[currency.toLowerCase()] || '$'
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

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

      // Get full order details for email
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order || !order.stripe_payment_intent) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Order not found or no payment intent' }),
        }
      }

      // Get order items for email
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

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

      // Send refund confirmation email
      try {
        const resend = getResendClient()

        // Build items HTML
        const itemsHtml = (items || []).map(item => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
              ${item.product_name}
              ${item.color_variant ? `<br><span style="color: #888; font-size: 12px;">Color: ${item.color_variant}</span>` : ''}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total_price, order.currency)}</td>
          </tr>
        `).join('')

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Refund Confirmation - LuxeHome</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #d4af37; margin: 0; font-size: 28px;">LuxeHome</h1>
              <p style="color: #ffffff; margin-top: 10px;">Refund Confirmation</p>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 10px;">💰</div>
                <h2 style="color: #1a1a1a; margin: 0;">Refund Processed</h2>
                <p style="color: #6b7280; margin-top: 10px;">Hi ${order.customer_name}, your refund has been processed successfully.</p>
              </div>

              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                  <div>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Order Number</p>
                    <p style="margin: 5px 0 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">${order.order_number}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Refund Amount</p>
                    <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #059669;">${formatCurrency(refundAmount, order.currency)}</p>
                  </div>
                </div>
                <div>
                  <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Refund ID</p>
                  <p style="margin: 5px 0 0; font-size: 14px; font-weight: bold; color: #6b7280;">${refund.id}</p>
                </div>
              </div>

              <h3 style="color: #1a1a1a; margin-bottom: 15px;">Refunded Items</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                <h3 style="color: #1a1a1a; margin-bottom: 10px;">What Happens Next?</h3>
                <ul style="color: #6b7280; padding-left: 20px; line-height: 1.8;">
                  <li>The refund will be credited to your original payment method</li>
                  <li>Please allow 5-10 business days for the refund to appear</li>
                  <li>Processing time may vary depending on your bank</li>
                </ul>
              </div>

              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Note:</strong> If you have any questions about this refund, please don't hesitate to contact us.
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  We're sorry to see this order returned.<br>
                  We hope to serve you again soon!<br><br>
                  Contact us at <a href="mailto:support@luxehome.com" style="color: #d4af37;">support@luxehome.com</a>
                </p>
              </div>
            </div>

            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>&copy; 2026 LuxeHome. All rights reserved.</p>
            </div>
          </body>
          </html>
        `

        await resend.emails.send({
          from: 'LuxeHome <orders@resend.dev>',
          to: [order.customer_email],
          replyTo: process.env.ADMIN_EMAIL,
          subject: `Refund Processed - Order ${order.order_number}`,
          html: emailHtml,
        })

        console.log('Refund email sent to:', order.customer_email)
      } catch (emailError) {
        // Log email error but don't fail the refund
        console.error('Failed to send refund email:', emailError)
      }

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
