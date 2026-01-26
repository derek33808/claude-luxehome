// Netlify Edge Function for Stripe Webhook
// Uses Web Crypto API for signature verification - no SDK dependencies

import type { Context } from "https://edge.netlify.com";

// Verify Stripe webhook signature using Web Crypto API
async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Parse signature header: t=timestamp,v1=signature
    const elements = signatureHeader.split(',');
    const timestamp = elements.find(e => e.startsWith('t='))?.slice(2);
    const signature = elements.find(e => e.startsWith('v1='))?.slice(3);

    if (!timestamp || !signature) {
      return { valid: false, error: 'Missing timestamp or signature in header' };
    }

    // Check timestamp tolerance (5 minutes)
    const timestampNum = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestampNum) > 300) {
      return { valid: false, error: 'Timestamp outside tolerance' };
    }

    // Build signed payload: timestamp.payload
    const signedPayload = `${timestamp}.${payload}`;

    // Compute expected signature using Web Crypto API
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    );

    // Convert to hex
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = expectedSignature === signature;
    console.log('Signature verification:', isValid ? '✅ PASSED' : '❌ FAILED');
    console.log('Expected:', expectedSignature.slice(0, 20) + '...');
    console.log('Received:', signature.slice(0, 20) + '...');

    return { valid: isValid };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `LH-${timestamp}${random}`.substring(0, 12);
}

// Format currency
function formatCurrency(amountInCents: number, currency: string): string {
  const amount = amountInCents / 100;
  const currencyMap: Record<string, string> = { 'aud': 'AUD $', 'nzd': 'NZD $', 'usd': 'USD $' };
  return `${currencyMap[currency.toLowerCase()] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

// Stripe API helper
async function stripeRequest(endpoint: string, secretKey: string) {
  const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.json();
}

// Supabase helper
async function supabaseRequest(
  url: string,
  serviceKey: string,
  method: string,
  endpoint: string,
  body?: unknown
) {
  const response = await fetch(`${url}/rest/v1${endpoint}`, {
    method,
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
}

// Send email via Resend
async function sendEmail(apiKey: string, to: string, subject: string, html: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LuxeHome <orders@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });
    return { success: response.ok, data: await response.json() };
  } catch {
    return { success: false };
  }
}

export default async function handler(request: Request, context: Context) {
  console.log('=== Stripe Webhook (Edge Function) ===');

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get environment variables
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const adminEmail = Deno.env.get('ADMIN_EMAIL');

  if (!webhookSecret || !stripeSecretKey) {
    return new Response(JSON.stringify({ error: 'Missing Stripe configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get raw body - Edge Function 的关键优势
  const rawBody = await request.text();
  console.log('Raw body length:', rawBody.length);

  // Verify signature using Web Crypto API
  const verifyResult = await verifyStripeSignature(rawBody, signature, webhookSecret);
  if (!verifyResult.valid) {
    console.error('Signature verification failed:', verifyResult.error);
    return new Response(JSON.stringify({
      error: 'Webhook signature verification failed',
      details: verifyResult.error,
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('✅ Signature verified successfully');

  // Parse event
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('Event type:', event.type);

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Processing session:', session.id);

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Check if order exists
      const existingOrders = await supabaseRequest(
        supabaseUrl, supabaseKey, 'GET',
        `/orders?stripe_session_id=eq.${session.id}&select=id,order_number`
      );

      if (Array.isArray(existingOrders) && existingOrders.length > 0) {
        console.log('Order already exists:', existingOrders[0].order_number);
        return new Response(JSON.stringify({
          received: true,
          orderNumber: existingOrders[0].order_number,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Retrieve full session from Stripe
      const fullSession = await stripeRequest(
        `/checkout/sessions/${session.id}?expand[]=line_items&expand[]=customer_details`,
        stripeSecretKey
      );

      const customerEmail = fullSession.customer_details?.email || fullSession.customer_email || '';
      const customerName = fullSession.customer_details?.name || 'Customer';
      const orderNumber = generateOrderNumber();

      // Parse shipping address from metadata
      let shippingAddress = {
        firstName: customerName.split(' ')[0] || '',
        lastName: customerName.split(' ').slice(1).join(' ') || '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: fullSession.metadata?.region?.toUpperCase() || 'NZ',
      };

      if (fullSession.metadata?.shipping_address_json) {
        try {
          const addr = JSON.parse(fullSession.metadata.shipping_address_json);
          shippingAddress = { ...shippingAddress, ...addr };
        } catch { /* ignore */ }
      }

      // Create order
      const orderData = {
        order_number: orderNumber,
        stripe_session_id: session.id,
        stripe_payment_intent: fullSession.payment_intent,
        customer_email: customerEmail,
        customer_name: customerName,
        shipping_address: shippingAddress,
        region: fullSession.metadata?.region || 'nz',
        currency: fullSession.currency?.toUpperCase() || 'NZD',
        subtotal: fullSession.amount_subtotal || 0,
        shipping: 0,
        tax: 0,
        total: fullSession.amount_total || 0,
        status: 'paid',
        payment_status: 'paid',
        fulfillment_status: 'unfulfilled',
      };

      const createdOrders = await supabaseRequest(
        supabaseUrl, supabaseKey, 'POST', '/orders', orderData
      );

      if (!Array.isArray(createdOrders) || createdOrders.length === 0) {
        throw new Error('Failed to create order');
      }

      const order = createdOrders[0];
      console.log('Order created:', order.order_number);

      // Create order items
      const lineItems = fullSession.line_items?.data || [];
      if (lineItems.length > 0) {
        const items = lineItems.map((item: { description?: string; quantity?: number; price?: { unit_amount?: number }; amount_total?: number }) => ({
          order_id: order.id,
          product_id: 'unknown',
          product_name: item.description || 'Product',
          quantity: item.quantity || 1,
          unit_price: item.price?.unit_amount || 0,
          total_price: item.amount_total || 0,
        }));

        await supabaseRequest(supabaseUrl, supabaseKey, 'POST', '/order_items', items);
        console.log(`Created ${items.length} order items`);
      }

      // Send emails
      if (resendApiKey && customerEmail) {
        const itemsHtml = lineItems.map((item: { description?: string; quantity?: number; amount_total?: number }) => `
          <tr>
            <td style="padding:12px;border-bottom:1px solid #eee">${item.description || 'Product'}</td>
            <td style="padding:12px;border-bottom:1px solid #eee;text-align:center">${item.quantity || 1}</td>
            <td style="padding:12px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(item.amount_total || 0, fullSession.currency || 'nzd')}</td>
          </tr>
        `).join('');

        const emailHtml = `
          <!DOCTYPE html><html><body style="font-family:system-ui;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#1a1a1a;padding:30px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="color:#d4af37;margin:0">LuxeHome</h1>
            <p style="color:#fff;margin-top:10px">Thank you for your order!</p>
          </div>
          <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)">
            <h2 style="margin-top:0">Order Confirmation</h2>
            <div style="background:#f3f4f6;padding:15px;border-radius:6px;margin-bottom:20px">
              <p style="margin:0;font-size:14px;color:#6b7280">Order Number</p>
              <p style="margin:5px 0 0;font-size:18px;font-weight:bold">${orderNumber}</p>
            </div>
            <table style="width:100%;border-collapse:collapse">
              <thead><tr style="background:#f9fafb">
                <th style="padding:12px;text-align:left;border-bottom:2px solid #e5e7eb">Item</th>
                <th style="padding:12px;text-align:center;border-bottom:2px solid #e5e7eb">Qty</th>
                <th style="padding:12px;text-align:right;border-bottom:2px solid #e5e7eb">Price</th>
              </tr></thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot><tr>
                <td colspan="2" style="padding:15px 12px;font-weight:bold;text-align:right">Total:</td>
                <td style="padding:15px 12px;font-weight:bold;text-align:right;color:#d4af37;font-size:18px">${formatCurrency(fullSession.amount_total || 0, fullSession.currency || 'nzd')}</td>
              </tr></tfoot>
            </table>
          </div>
          </body></html>
        `;

        await sendEmail(resendApiKey, customerEmail, `Order Confirmation - ${orderNumber}`, emailHtml);
        console.log('Customer email sent');

        if (adminEmail) {
          await sendEmail(resendApiKey, adminEmail, `🛍️ New Order: ${orderNumber}`, emailHtml);
          console.log('Admin notification sent');
        }
      }

      return new Response(JSON.stringify({
        received: true,
        orderNumber: order.order_number,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (err) {
      console.error('Error:', err);
      return new Response(JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal error',
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config = {
  path: '/api/stripe-webhook-edge',
};
