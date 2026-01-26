import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Initialize Supabase client with service role
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
    throw new Error('RESEND_API_KEY not configured')
  }
  return new Resend(apiKey)
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

// Get tracking URL based on carrier
function getTrackingUrl(carrier: string, trackingNumber: string): string {
  const carrierUrls: Record<string, string> = {
    'NZ Post': `https://www.nzpost.co.nz/tools/tracking?trackingReference=${trackingNumber}`,
    'CourierPost': `https://www.courierpost.co.nz/track/${trackingNumber}`,
    'Australia Post': `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`,
    'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
  }
  return carrierUrls[carrier] || '#'
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
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

  try {
    const body = JSON.parse(event.body || '{}')
    const { orderId, trackingNumber, shippingCarrier } = body

    if (!orderId || !trackingNumber || !shippingCarrier) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields: orderId, trackingNumber, shippingCarrier' }),
      }
    }

    const supabase = getSupabaseClient()
    const resend = getResendClient()

    // Fetch order details
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

    // Update order with tracking info and set status to shipped
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        shipping_carrier: shippingCarrier,
        fulfillment_status: 'shipped',
        shipped_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update order:', updateError)
    }

    // Generate tracking URL
    const trackingUrl = getTrackingUrl(shippingCarrier, trackingNumber)

    // Build items HTML
    const itemsHtml = (items || []).map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.product_name}
          ${item.color_variant ? `<br><span style="color: #888; font-size: 12px;">Color: ${item.color_variant}</span>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      </tr>
    `).join('')

    // Send shipping notification email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Order Has Shipped - LuxeHome</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #d4af37; margin: 0; font-size: 28px;">LuxeHome</h1>
          <p style="color: #ffffff; margin-top: 10px;">Your order is on its way!</p>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 10px;">📦</div>
            <h2 style="color: #1a1a1a; margin: 0;">Great news, ${order.customer_name}!</h2>
            <p style="color: #6b7280; margin-top: 10px;">Your order has been shipped and is on its way to you.</p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <div>
                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Order Number</p>
                <p style="margin: 5px 0 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">${order.order_number}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Carrier</p>
                <p style="margin: 5px 0 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">${shippingCarrier}</p>
              </div>
            </div>
            <div>
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Tracking Number</p>
              <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #d4af37;">${trackingNumber}</p>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${trackingUrl}"
               style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Track Your Package
            </a>
          </div>

          <h3 style="color: #1a1a1a; margin-bottom: 15px;">Items Shipped</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <h3 style="color: #1a1a1a; margin-bottom: 15px;">Shipping To</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; line-height: 1.6;">
              ${order.shipping_address.firstName} ${order.shipping_address.lastName}<br>
              ${order.shipping_address.address}<br>
              ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postalCode}<br>
              ${order.shipping_address.country}
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
            <h3 style="color: #1a1a1a; margin-bottom: 10px;">Delivery Information</h3>
            <ul style="color: #6b7280; padding-left: 20px; line-height: 1.8;">
              <li>Estimated delivery: 5-10 business days</li>
              <li>You'll receive an email when your package is delivered</li>
              <li>Someone should be available to receive the package</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Questions about your delivery?<br>
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

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'LuxeHome <orders@resend.dev>',
      to: [order.customer_email],
      replyTo: process.env.ADMIN_EMAIL || 'derek.yuqiang@gmail.com',
      subject: `Your LuxeHome Order Has Shipped! - ${order.order_number}`,
      html: emailHtml,
    })

    if (emailError) {
      console.error('Failed to send email:', emailError)
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to send notification email', details: emailError }),
      }
    }

    console.log('Shipping notification sent:', emailData)

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Shipping notification sent successfully',
        emailId: emailData?.id,
      }),
    }

  } catch (error) {
    console.error('Error sending shipping notification:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    }
  }
}
