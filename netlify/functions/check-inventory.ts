import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with anon key for read access
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}

interface CartItem {
  productId: string
  quantity: number
  colorVariant?: string
}

interface InventoryCheckResult {
  productId: string
  requestedQuantity: number
  availableQuantity: number
  isAvailable: boolean
  isTracked: boolean
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

  // GET: Check single product
  // POST: Check multiple products (cart)
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const supabase = getSupabaseClient()

    // GET: Single product check
    if (event.httpMethod === 'GET') {
      const productId = event.queryStringParameters?.productId
      const quantity = parseInt(event.queryStringParameters?.quantity || '1')

      if (!productId) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing productId parameter' }),
        }
      }

      const { data: inventory, error } = await supabase
        .from('inventory')
        .select('product_id, product_name, stock_quantity, reserved_quantity, low_stock_threshold')
        .eq('product_id', productId)
        .single()

      if (error || !inventory) {
        // Product not tracked - assume available
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            productId,
            isTracked: false,
            isAvailable: true,
            availableQuantity: -1,
            message: 'Product not in inventory system',
          }),
        }
      }

      const availableQuantity = inventory.stock_quantity - (inventory.reserved_quantity || 0)
      const isAvailable = availableQuantity >= quantity
      const isLowStock = availableQuantity <= inventory.low_stock_threshold

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          productId,
          productName: inventory.product_name,
          isTracked: true,
          isAvailable,
          availableQuantity,
          requestedQuantity: quantity,
          isLowStock,
          lowStockThreshold: inventory.low_stock_threshold,
        }),
      }
    }

    // POST: Multiple products (cart) check
    const body = JSON.parse(event.body || '{}')
    const items: CartItem[] = body.items || []

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing or invalid items array' }),
      }
    }

    // Get all product IDs
    const productIds = items.map(item => item.productId)

    // Fetch inventory for all products
    const { data: inventoryData, error } = await supabase
      .from('inventory')
      .select('product_id, product_name, stock_quantity, reserved_quantity, low_stock_threshold')
      .in('product_id', productIds)

    if (error) {
      throw error
    }

    // Create a map for quick lookup
    const inventoryMap = new Map(
      (inventoryData || []).map(inv => [inv.product_id, inv])
    )

    // Check each item
    const results: InventoryCheckResult[] = items.map(item => {
      const inventory = inventoryMap.get(item.productId)

      if (!inventory) {
        // Product not tracked - assume available
        return {
          productId: item.productId,
          requestedQuantity: item.quantity,
          availableQuantity: -1,
          isAvailable: true,
          isTracked: false,
        }
      }

      const availableQuantity = inventory.stock_quantity - (inventory.reserved_quantity || 0)
      return {
        productId: item.productId,
        requestedQuantity: item.quantity,
        availableQuantity,
        isAvailable: availableQuantity >= item.quantity,
        isTracked: true,
      }
    })

    // Check if all items are available
    const allAvailable = results.every(r => r.isAvailable)
    const unavailableItems = results.filter(r => !r.isAvailable)

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        allAvailable,
        results,
        unavailableItems,
        message: allAvailable
          ? 'All items are available'
          : `${unavailableItems.length} item(s) have insufficient stock`,
      }),
    }

  } catch (error) {
    console.error('Inventory check error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    }
  }
}
