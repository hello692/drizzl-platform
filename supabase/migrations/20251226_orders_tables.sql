-- Add Stripe-related columns to existing orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS amount_total INTEGER,
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS shipping_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_state VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(10);

-- Add additional columns to existing order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS price_cents INTEGER,
ADD COLUMN IF NOT EXISTS qty INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Index for faster lookups by stripe_session_id
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);

-- Note: RLS policies should already exist from original table creation
-- The service role key bypasses RLS, so inserts from webhooks will work
