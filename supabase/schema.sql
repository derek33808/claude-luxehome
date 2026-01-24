-- LuxeHome Database Schema
-- Run this SQL in Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),

  -- Customer info (embedded for simplicity)
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),

  -- Shipping address (JSONB for flexibility)
  shipping_address JSONB NOT NULL,

  -- Order details
  region VARCHAR(5) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  subtotal INTEGER NOT NULL, -- in cents
  shipping INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER NOT NULL,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',

  -- Shipping info
  tracking_number VARCHAR(100),
  shipping_carrier VARCHAR(100),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_slug VARCHAR(255),
  color_variant VARCHAR(100),

  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL, -- in cents
  total_price INTEGER NOT NULL,

  image_url VARCHAR(500),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access on orders" ON orders
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on order_items" ON order_items
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Anon users can read their own orders by email (for success page)
-- Note: This is a simple approach. For production, consider using auth
CREATE POLICY "Anon can read orders by session_id" ON orders
  FOR SELECT
  USING (true); -- Allow reading for success page lookup

CREATE POLICY "Anon can read order_items" ON order_items
  FOR SELECT
  USING (true);

-- Grant permissions
GRANT SELECT ON orders TO anon;
GRANT SELECT ON order_items TO anon;
GRANT ALL ON orders TO service_role;
GRANT ALL ON order_items TO service_role;

-- Comments for documentation
COMMENT ON TABLE orders IS 'Customer orders from LuxeHome e-commerce';
COMMENT ON TABLE order_items IS 'Individual items within each order';
COMMENT ON COLUMN orders.subtotal IS 'Order subtotal in cents';
COMMENT ON COLUMN orders.total IS 'Order total in cents';
COMMENT ON COLUMN order_items.unit_price IS 'Unit price in cents';
COMMENT ON COLUMN order_items.total_price IS 'Line total in cents (unit_price * quantity)';
