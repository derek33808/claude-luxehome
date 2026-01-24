import { Handler, HandlerEvent } from '@netlify/functions'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  colorVariant?: string
  slug?: string
}

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface CheckoutRequestBody {
  items: CartItem[]
  region: string
  currency: string
  shippingAddress?: ShippingAddress
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { items, region, currency, shippingAddress }: CheckoutRequestBody = JSON.parse(event.body || '{}')

    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No items in cart' }),
      }
    }

    // Get site URL from environment or use default
    const siteUrl = process.env.SITE_URL || process.env.URL || 'http://localhost:3000'

    console.log('Environment variables:', {
      SITE_URL: process.env.SITE_URL,
      URL: process.env.URL,
      using: siteUrl
    })

    // Convert cart items to Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      // Convert relative image paths to absolute URLs
      let imageUrl = item.image
      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${siteUrl}${imageUrl}`
      }

      return {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }
    })

    // Prepare session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/${region}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${region}/checkout/cancel`,
      // Store item details in metadata for webhook processing
      metadata: {
        region,
        items_json: JSON.stringify(items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          colorVariant: item.colorVariant || null,
          slug: item.slug || null,
          image: item.image
        }))),
        shipping_address_json: shippingAddress ? JSON.stringify(shippingAddress) : '',
      },
    }

    // If shipping address is provided, pre-fill customer details
    if (shippingAddress) {
      sessionOptions.customer_email = shippingAddress.email
      sessionOptions.shipping_address_collection = {
        allowed_countries: ['AU', 'NZ', 'US']
      }
    } else {
      // Collect shipping address during checkout
      sessionOptions.shipping_address_collection = {
        allowed_countries: ['AU', 'NZ', 'US']
      }
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionOptions)

    console.log('Created Stripe session:', {
      id: session.id,
      url: session.url,
      success_url: session.success_url,
      cancel_url: session.cancel_url
    })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        sessionUrl: session.url
      }),
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    }
  }
}
