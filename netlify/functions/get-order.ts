import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with anon key for read-only access
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Allow GET and POST (for flexibility)
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  // Get session_id from query params or body
  let sessionId: string | null = null

  if (event.httpMethod === 'GET') {
    sessionId = event.queryStringParameters?.session_id || null
  } else {
    const body = JSON.parse(event.body || '{}')
    sessionId = body.session_id || null
  }

  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing session_id parameter' }),
    }
  }

  try {
    const supabase = getSupabaseClient()

    // Fetch order by stripe_session_id
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_email,
        customer_name,
        shipping_address,
        region,
        currency,
        subtotal,
        shipping,
        tax,
        total,
        status,
        payment_status,
        fulfillment_status,
        tracking_number,
        shipping_carrier,
        created_at
      `)
      .eq('stripe_session_id', sessionId)
      .single()

    if (orderError || !order) {
      console.log('Order not found for session:', sessionId)
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Order not found' }),
      }
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        product_name,
        product_slug,
        color_variant,
        quantity,
        unit_price,
        total_price,
        image_url
      `)
      .eq('order_id', order.id)

    if (itemsError) {
      console.error('Error fetching order items:', itemsError)
    }

    // Format response
    const response = {
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      shippingAddress: order.shipping_address,
      region: order.region,
      currency: order.currency,
      subtotal: order.subtotal / 100, // Convert from cents
      shipping: order.shipping / 100,
      tax: order.tax / 100,
      total: order.total / 100,
      status: order.status,
      paymentStatus: order.payment_status,
      fulfillmentStatus: order.fulfillment_status,
      trackingNumber: order.tracking_number,
      shippingCarrier: order.shipping_carrier,
      createdAt: order.created_at,
      items: (items || []).map(item => ({
        name: item.product_name,
        slug: item.product_slug,
        colorVariant: item.color_variant,
        quantity: item.quantity,
        unitPrice: item.unit_price / 100,
        totalPrice: item.total_price / 100,
        imageUrl: item.image_url,
      })),
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    }

  } catch (error) {
    console.error('Error fetching order:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
    }
  }
}
