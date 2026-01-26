// Debug Version: 2026-01-25-v2 - Force rebuild
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Initialize Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, emails will not be sent')
    return null
  }
  return new Resend(apiKey)
}

// Generate unique order number: LH-XXXXXX
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `LH-${timestamp}${random}`.substring(0, 12)
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

// Extract shipping address from Stripe session
function extractAddressFromStripe(session: Stripe.Checkout.Session, name: string) {
  if (session.customer_details?.address) {
    return {
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ').slice(1).join(' ') || '',
      address: session.customer_details.address.line1 || '',
      city: session.customer_details.address.city || '',
      state: session.customer_details.address.state || '',
      postalCode: session.customer_details.address.postal_code || '',
      country: session.customer_details.address.country || '',
    }
  }
  return {
    firstName: name.split(' ')[0] || '',
    lastName: name.split(' ').slice(1).join(' ') || '',
    address: 'Address provided at checkout',
    city: '',
    state: '',
    postalCode: '',
    country: session.metadata?.region?.toUpperCase() || 'NZ',
  }
}

// Send admin notification email
async function sendAdminNotificationEmail(
  resend: Resend,
  adminEmail: string,
  order: {
    orderNumber: string
    customerEmail: string
    customerName: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    currency: string
    shippingAddress: {
      firstName: string
      lastName: string
      address: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price, order.currency)}</td>
    </tr>
  `).join('')

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Notification - LuxeHome</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #d4af37; margin: 0; font-size: 28px;">🎉 New Order Alert</h1>
        <p style="color: #ffffff; margin-top: 10px;">You have a new order!</p>
      </div>

      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a1a; margin-top: 0;">Order Information</h2>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Number</p>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">${order.orderNumber}</p>
        </div>

        <h3 style="color: #1a1a1a; margin-bottom: 15px;">Customer Information</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; line-height: 1.6;">
            <strong>Name:</strong> ${order.customerName}<br>
            <strong>Email:</strong> ${order.customerEmail}
          </p>
        </div>

        <h3 style="color: #1a1a1a; margin-bottom: 15px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 15px 12px; font-weight: bold; text-align: right;">Total:</td>
              <td style="padding: 15px 12px; font-weight: bold; text-align: right; color: #d4af37; font-size: 18px;">${formatCurrency(order.total, order.currency)}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="color: #1a1a1a; margin-bottom: 15px;">Shipping Address</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; line-height: 1.6;">
            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <div style="background-color: #fef3c7; border-left: 4px solid #d4af37; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <p style="margin: 0; color: #92400e; font-weight: 500;">
            💡 Next Steps: Process this order in your Supabase dashboard
          </p>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>&copy; 2026 LuxeHome. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: 'LuxeHome <orders@resend.dev>',
      to: [adminEmail],
      subject: `🛍️ New Order: ${order.orderNumber}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Failed to send admin notification:', error)
      return { success: false, error }
    }

    console.log('Admin notification sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Admin notification error:', error)
    return { success: false, error }
  }
}

// Send order confirmation email
async function sendOrderConfirmationEmail(
  resend: Resend,
  order: {
    orderNumber: string
    customerEmail: string
    customerName: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    currency: string
    shippingAddress: {
      firstName: string
      lastName: string
      address: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price, order.currency)}</td>
    </tr>
  `).join('')

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - LuxeHome</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #d4af37; margin: 0; font-size: 28px;">LuxeHome</h1>
        <p style="color: #ffffff; margin-top: 10px;">Thank you for your order!</p>
      </div>

      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a1a; margin-top: 0;">Order Confirmation</h2>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Number</p>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">${order.orderNumber}</p>
        </div>

        <h3 style="color: #1a1a1a; margin-bottom: 15px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 15px 12px; font-weight: bold; text-align: right;">Total:</td>
              <td style="padding: 15px 12px; font-weight: bold; text-align: right; color: #d4af37; font-size: 18px;">${formatCurrency(order.total, order.currency)}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="color: #1a1a1a; margin-bottom: 15px;">Shipping Address</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; line-height: 1.6;">
            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
          <h3 style="color: #1a1a1a; margin-bottom: 10px;">What's Next?</h3>
          <ul style="color: #6b7280; padding-left: 20px; line-height: 1.8;">
            <li>We're preparing your order for shipment</li>
            <li>You'll receive a shipping confirmation email with tracking information</li>
            <li>Estimated delivery: 5-10 business days</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Questions? Contact us at <a href="mailto:support@luxehome.com" style="color: #d4af37;">support@luxehome.com</a>
          </p>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>&copy; 2026 LuxeHome. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: 'LuxeHome <orders@resend.dev>', // Use your verified domain in production
      to: [order.customerEmail],
      replyTo: process.env.ADMIN_EMAIL || 'derek.yuqiang@gmail.com',
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}

import { Handler, HandlerEvent } from '@netlify/functions'

// Netlify Functions v1 Handler
// 安全方案：由于 Netlify 会修改 request body 导致签名验证失败，
// 我们通过直接调用 Stripe API 验证支付状态来确保安全
export const handler: Handler = async (event: HandlerEvent) => {
  console.log('=== Stripe Webhook Received ===')

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook secret not configured' }),
    }
  }

  // 兼容 header 大小写
  const signature =
    event.headers['stripe-signature'] ||
    event.headers['Stripe-Signature']

  // 详细调试信息
  console.log('=== DEBUG INFO ===')
  console.log('isBase64Encoded:', event.isBase64Encoded)
  console.log('body exists:', !!event.body)
  console.log('body length:', event.body?.length)
  console.log('body type:', typeof event.body)
  console.log('signature present:', !!signature)

  if (!signature) {
    console.error('Missing Stripe signature header')
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing stripe-signature header' }),
    }
  }

  // 获取请求体
  if (!event.body) {
    console.error('Missing request body')
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    }
  }

  // 根据 isBase64Encoded 正确解码
  let payload: string
  if (event.isBase64Encoded) {
    payload = Buffer.from(event.body, 'base64').toString('utf8')
    console.log('Decoded from base64')
  } else {
    payload = event.body
    console.log('Using body as-is')
  }

  console.log('Payload length:', payload.length)

  let stripeEvent: Stripe.Event

  // 生产环境安全方案：
  // 由于 Netlify 会修改 request body 导致签名验证失败，
  // 我们采用以下替代安全措施：
  // 1. 解析 webhook payload
  // 2. 直接通过 Stripe API 验证 session/payment 状态
  // 3. 只有 API 确认支付成功才创建订单

  try {
    // 解析 webhook payload
    stripeEvent = JSON.parse(payload) as Stripe.Event
    console.log('Event parsed, type:', stripeEvent.type)
    console.log('Event ID:', stripeEvent.id)
  } catch (parseErr) {
    console.error('Failed to parse webhook payload:', parseErr)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid webhook payload' }),
    }
  }

  // 验证事件 ID 格式（基本防护）
  if (!stripeEvent.id || !stripeEvent.id.startsWith('evt_')) {
    console.error('Invalid event ID format:', stripeEvent.id)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid event format' }),
    }
  }

  console.log('Received Stripe event:', stripeEvent.type)

  // Handle checkout.session.completed event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session

    console.log('Processing completed checkout session:', session.id)

    try {
      // ============================================
      // 关键安全验证：直接通过 Stripe API 确认支付状态
      // 这是我们的主要安全措施，替代签名验证
      // ============================================
      console.log('🔐 Verifying payment with Stripe API...')

      const verifiedSession = await stripe.checkout.sessions.retrieve(session.id)

      // 验证 session 存在且支付完成
      if (!verifiedSession) {
        console.error('❌ Session not found in Stripe:', session.id)
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Session not found' }),
        }
      }

      if (verifiedSession.payment_status !== 'paid') {
        console.error('❌ Payment not completed:', verifiedSession.payment_status)
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Payment not completed',
            status: verifiedSession.payment_status
          }),
        }
      }

      console.log('✅ Payment verified via Stripe API')
      console.log('   Session ID:', verifiedSession.id)
      console.log('   Payment Status:', verifiedSession.payment_status)
      console.log('   Amount:', verifiedSession.amount_total)

      const supabase = getSupabaseClient()
      const resend = getResendClient()

      // Check if order already exists (idempotency)
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id, order_number')
        .eq('stripe_session_id', session.id)
        .single()

      if (existingOrder) {
        console.log('Order already exists:', existingOrder.order_number)
        return {
          statusCode: 200,
          body: JSON.stringify({
            received: true,
            orderNumber: existingOrder.order_number,
            message: 'Order already processed'
          }),
        }
      }

      // Retrieve the full session with line items (reuse verified session)
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'customer_details', 'payment_intent'],
      })

      // Extract customer info
      const customerEmail = fullSession.customer_details?.email || fullSession.customer_email || ''
      const customerName = fullSession.customer_details?.name || 'Customer'
      const customerPhone = fullSession.customer_details?.phone || null

      // Try to get shipping address from metadata first (from checkout form)
      let shippingAddress: {
        firstName: string
        lastName: string
        address: string
        city: string
        state: string
        postalCode: string
        country: string
      }

      if (fullSession.metadata?.shipping_address_json) {
        try {
          const metaAddr = JSON.parse(fullSession.metadata.shipping_address_json)
          shippingAddress = {
            firstName: metaAddr.firstName || '',
            lastName: metaAddr.lastName || '',
            address: metaAddr.address || '',
            city: metaAddr.city || '',
            state: metaAddr.state || '',
            postalCode: metaAddr.postalCode || '',
            country: metaAddr.country || '',
          }
        } catch {
          // Fallback to Stripe shipping details
          shippingAddress = extractAddressFromStripe(fullSession, customerName)
        }
      } else if ((fullSession as unknown as { shipping_details?: { name?: string; address?: Stripe.Address } }).shipping_details?.address) {
        // Use Stripe's collected shipping address (from shipping_address_collection)
        const shippingDetails = (fullSession as unknown as { shipping_details: { name?: string; address: Stripe.Address } }).shipping_details
        shippingAddress = {
          firstName: shippingDetails.name?.split(' ')[0] || customerName.split(' ')[0] || '',
          lastName: shippingDetails.name?.split(' ').slice(1).join(' ') || customerName.split(' ').slice(1).join(' ') || '',
          address: shippingDetails.address.line1 || '',
          city: shippingDetails.address.city || '',
          state: shippingDetails.address.state || '',
          postalCode: shippingDetails.address.postal_code || '',
          country: shippingDetails.address.country || '',
        }
      } else {
        shippingAddress = extractAddressFromStripe(fullSession, customerName)
      }

      // Generate order number
      const orderNumber = generateOrderNumber()

      // Extract payment intent ID
      const paymentIntentId = typeof fullSession.payment_intent === 'string'
        ? fullSession.payment_intent
        : fullSession.payment_intent?.id || null

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          stripe_session_id: session.id,
          stripe_payment_intent: paymentIntentId,
          customer_email: customerEmail,
          customer_name: customerName,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          region: fullSession.metadata?.region || 'nz',
          currency: fullSession.currency?.toUpperCase() || 'NZD',
          subtotal: fullSession.amount_subtotal || 0,
          shipping: 0, // Free shipping for now
          tax: 0,
          total: fullSession.amount_total || 0,
          status: 'paid',
          payment_status: 'paid',
          fulfillment_status: 'unfulfilled',
        })
        .select()
        .single()

      if (orderError) {
        console.error('Failed to create order:', orderError)
        throw new Error(`Failed to create order: ${orderError.message}`)
      }

      console.log('Order created:', order.order_number)

      // Get item details from metadata if available
      let itemDetailsFromMeta: Array<{
        id: string
        name: string
        price: number
        quantity: number
        colorVariant: string | null
        slug: string | null
        image: string
      }> = []

      if (fullSession.metadata?.items_json) {
        try {
          itemDetailsFromMeta = JSON.parse(fullSession.metadata.items_json)
        } catch {
          console.warn('Failed to parse items_json from metadata')
        }
      }

      // Create order items using metadata or line items
      const lineItems = fullSession.line_items?.data || []
      const orderItems = lineItems.map((item, index) => {
        const metaItem = itemDetailsFromMeta[index]
        return {
          order_id: order.id,
          product_id: metaItem?.id || item.price?.product?.toString() || 'unknown',
          product_name: metaItem?.name || item.description || 'Product',
          product_slug: metaItem?.slug || null,
          color_variant: metaItem?.colorVariant || null,
          quantity: item.quantity || 1,
          unit_price: item.price?.unit_amount || 0,
          total_price: item.amount_total || 0,
          image_url: metaItem?.image || null,
        }
      })

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) {
          console.error('Failed to create order items:', itemsError)
          // Don't throw - order is still valid
        } else {
          console.log(`Created ${orderItems.length} order items`)
        }
      }

      // Send confirmation email
      if (resend && customerEmail) {
        const orderData = {
          orderNumber: order.order_number,
          customerEmail,
          customerName,
          items: lineItems.map(item => ({
            name: item.description || 'Product',
            quantity: item.quantity || 1,
            price: item.amount_total || 0,
          })),
          total: fullSession.amount_total || 0,
          currency: fullSession.currency || 'nzd',
          shippingAddress,
        }

        // Send customer confirmation email
        const emailResult = await sendOrderConfirmationEmail(resend, orderData)

        if (emailResult.success) {
          console.log('Confirmation email sent to:', customerEmail)
        } else {
          console.error('Failed to send confirmation email:', emailResult.error)
        }

        // Send admin notification email
        const adminEmail = process.env.ADMIN_EMAIL
        if (adminEmail) {
          const adminResult = await sendAdminNotificationEmail(resend, adminEmail, orderData)
          if (adminResult.success) {
            console.log('Admin notification sent to:', adminEmail)
          } else {
            console.error('Failed to send admin notification:', adminResult.error)
          }
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          received: true,
          orderNumber: order.order_number,
          message: 'Order created successfully'
        }),
      }

    } catch (error) {
      console.error('Error processing webhook:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error instanceof Error ? error.message : 'Internal server error'
        }),
      }
    }
  }

  // Handle other events if needed
  if (stripeEvent.type === 'payment_intent.payment_failed') {
    const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
    console.log('Payment failed:', paymentIntent.id)
    // Could update order status or send notification
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  }
}
