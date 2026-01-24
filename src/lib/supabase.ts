import { createClient } from '@supabase/supabase-js'

// Types for database tables
export interface Order {
  id: string
  order_number: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null

  // Customer info
  customer_email: string
  customer_name: string
  customer_phone: string | null

  // Shipping address
  shipping_address: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }

  // Order details
  region: string
  currency: string
  subtotal: number // in cents
  shipping: number
  tax: number
  total: number

  // Status tracking
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  fulfillment_status: 'unfulfilled' | 'fulfilled' | 'partially_fulfilled'

  // Shipping info
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  delivered_at: string | null

  // Metadata
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string

  product_id: string
  product_name: string
  product_slug: string | null
  color_variant: string | null

  quantity: number
  unit_price: number // in cents
  total_price: number

  image_url: string | null

  created_at: string
}

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id' | 'created_at'>
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>
      }
    }
  }
}

// Create Supabase client for server-side use (Netlify Functions)
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Create Supabase client for client-side use (with anon key)
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Generate unique order number: LH-XXXXXX
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `LH-${timestamp}${random}`.substring(0, 12)
}
