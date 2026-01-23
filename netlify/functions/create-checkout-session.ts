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
}

interface CheckoutRequestBody {
  items: CartItem[]
  region: string
  currency: string
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
    const { items, region, currency }: CheckoutRequestBody = JSON.parse(event.body || '{}')

    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No items in cart' }),
      }
    }

    // Get site URL from environment or use default
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Convert cart items to Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/${region}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${region}/checkout/cancel`,
      metadata: {
        region,
      },
    })

    return {
      statusCode: 200,
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
