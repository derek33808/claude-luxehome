-- LuxeHome Inventory Management Schema
-- Run this SQL in Supabase SQL Editor to add inventory tracking

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(100) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  color_variant VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0, -- For items in checkout
  low_stock_threshold INTEGER DEFAULT 5,
  sku VARCHAR(100),
  location VARCHAR(100) DEFAULT 'warehouse',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory history table for tracking changes
CREATE TABLE IF NOT EXISTS inventory_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL,
  change_type VARCHAR(50) NOT NULL, -- 'sale', 'restock', 'adjustment', 'reserve', 'release'
  quantity_change INTEGER NOT NULL, -- positive for additions, negative for reductions
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory(stock_quantity) WHERE stock_quantity <= low_stock_threshold;
CREATE INDEX IF NOT EXISTS idx_inventory_history_product ON inventory_history(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_created ON inventory_history(created_at DESC);

-- Update trigger for updated_at
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check and update inventory (for webhook)
CREATE OR REPLACE FUNCTION check_and_deduct_inventory(
  p_product_id VARCHAR(100),
  p_quantity INTEGER,
  p_order_id UUID DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  available_quantity INTEGER,
  message TEXT
) AS $$
DECLARE
  v_current_qty INTEGER;
  v_inventory_id UUID;
BEGIN
  -- Get current inventory with lock
  SELECT id, stock_quantity INTO v_inventory_id, v_current_qty
  FROM inventory
  WHERE product_id = p_product_id
  FOR UPDATE;

  -- If product not in inventory, allow (no inventory tracking for this product)
  IF v_inventory_id IS NULL THEN
    RETURN QUERY SELECT TRUE, -1, 'Product not in inventory system'::TEXT;
    RETURN;
  END IF;

  -- Check if enough stock
  IF v_current_qty < p_quantity THEN
    RETURN QUERY SELECT FALSE, v_current_qty, 'Insufficient stock'::TEXT;
    RETURN;
  END IF;

  -- Deduct inventory
  UPDATE inventory
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = v_inventory_id;

  -- Record history
  INSERT INTO inventory_history (
    inventory_id, product_id, change_type, quantity_change,
    previous_quantity, new_quantity, order_id, notes
  ) VALUES (
    v_inventory_id, p_product_id, 'sale', -p_quantity,
    v_current_qty, v_current_qty - p_quantity, p_order_id,
    'Deducted for order'
  );

  RETURN QUERY SELECT TRUE, v_current_qty - p_quantity, 'Stock deducted successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to get available stock
CREATE OR REPLACE FUNCTION get_available_stock(p_product_id VARCHAR(100))
RETURNS INTEGER AS $$
DECLARE
  v_stock INTEGER;
BEGIN
  SELECT stock_quantity - reserved_quantity INTO v_stock
  FROM inventory
  WHERE product_id = p_product_id;

  -- Return -1 if product not tracked
  IF v_stock IS NULL THEN
    RETURN -1;
  END IF;

  RETURN v_stock;
END;
$$ LANGUAGE plpgsql;

-- Function to restore inventory (for refunds/cancellations)
CREATE OR REPLACE FUNCTION restore_inventory(
  p_product_id VARCHAR(100),
  p_quantity INTEGER,
  p_order_id UUID DEFAULT NULL,
  p_reason TEXT DEFAULT 'Order cancelled/refunded'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_qty INTEGER;
  v_inventory_id UUID;
BEGIN
  SELECT id, stock_quantity INTO v_inventory_id, v_current_qty
  FROM inventory
  WHERE product_id = p_product_id
  FOR UPDATE;

  IF v_inventory_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Restore inventory
  UPDATE inventory
  SET stock_quantity = stock_quantity + p_quantity
  WHERE id = v_inventory_id;

  -- Record history
  INSERT INTO inventory_history (
    inventory_id, product_id, change_type, quantity_change,
    previous_quantity, new_quantity, order_id, notes
  ) VALUES (
    v_inventory_id, p_product_id, 'adjustment', p_quantity,
    v_current_qty, v_current_qty + p_quantity, p_order_id, p_reason
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

-- Policies for inventory
CREATE POLICY "Service role full access on inventory" ON inventory
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Anon can read inventory" ON inventory
  FOR SELECT
  USING (true);

-- Policies for inventory_history
CREATE POLICY "Service role full access on inventory_history" ON inventory_history
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT ON inventory TO anon;
GRANT ALL ON inventory TO service_role;
GRANT ALL ON inventory_history TO service_role;

-- Initial inventory data for existing products
-- Run this after creating the table to set up initial stock
INSERT INTO inventory (product_id, product_name, stock_quantity, low_stock_threshold)
VALUES
  ('smart-digital-calendar', 'Smart Digital Calendar', 50, 10),
  ('mini-arcade-machine', 'Mini Arcade Machine', 100, 15)
ON CONFLICT (product_id) DO NOTHING;

-- Comments
COMMENT ON TABLE inventory IS 'Product inventory tracking for LuxeHome';
COMMENT ON TABLE inventory_history IS 'History of inventory changes';
COMMENT ON FUNCTION check_and_deduct_inventory IS 'Atomically check and deduct inventory for orders';
COMMENT ON FUNCTION restore_inventory IS 'Restore inventory for refunds/cancellations';
