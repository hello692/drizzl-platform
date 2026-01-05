-- Core E-commerce Tables Migration
-- This migration creates all the essential tables for D2C commerce functionality
-- Run this in Supabase SQL Editor

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    wholesale_price_cents INTEGER NOT NULL DEFAULT 0,
    hero_image_url TEXT,
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT,
    weight_grams INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- ============================================================================
-- CUSTOMERS TABLE (D2C Customers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty_tier ON customers(loyalty_tier);

-- ============================================================================
-- CUSTOMER ADDRESSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_type TEXT DEFAULT 'shipping' CHECK (address_type IN ('shipping', 'billing', 'both')),
    is_default BOOLEAN DEFAULT false,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default ON customer_addresses(is_default);

-- ============================================================================
-- CUSTOMER PAYMENT METHODS
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT,
    card_brand TEXT,
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_payment_methods_customer_id ON customer_payment_methods(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_payment_methods_stripe_id ON customer_payment_methods(stripe_payment_method_id);

-- ============================================================================
-- CART ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_id TEXT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT cart_items_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_user_product ON cart_items(user_id, product_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- D2C ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS d2c_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    
    -- Pricing
    subtotal_cents INTEGER NOT NULL DEFAULT 0,
    tax_cents INTEGER NOT NULL DEFAULT 0,
    shipping_cents INTEGER NOT NULL DEFAULT 0,
    discount_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL DEFAULT 0,
    
    -- Payment
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ,
    
    -- Shipping
    shipping_address JSONB,
    billing_address JSONB,
    tracking_number TEXT,
    carrier TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Metadata
    customer_notes TEXT,
    internal_notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_d2c_orders_customer_id ON d2c_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_d2c_orders_order_number ON d2c_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_d2c_orders_status ON d2c_orders(status);
CREATE INDEX IF NOT EXISTS idx_d2c_orders_payment_status ON d2c_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_d2c_orders_created_at ON d2c_orders(created_at DESC);

-- ============================================================================
-- D2C ORDER ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS d2c_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES d2c_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    product_snapshot JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_d2c_order_items_order_id ON d2c_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_d2c_order_items_product_id ON d2c_order_items(product_id);

-- ============================================================================
-- SUBSCRIPTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
    frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_cents INTEGER NOT NULL,
    next_delivery_date DATE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    paused_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);

-- ============================================================================
-- LOYALTY TRANSACTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    description TEXT,
    order_id UUID REFERENCES d2c_orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_customer_id ON loyalty_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_created_at ON loyalty_transactions(created_at DESC);

-- ============================================================================
-- PRODUCT REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_customer_id ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);

-- ============================================================================
-- WISHLIST
-- ============================================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_customer_id ON wishlist_items(customer_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_addresses_updated_at ON customer_addresses;
CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_payment_methods_updated_at ON customer_payment_methods;
CREATE TRIGGER update_customer_payment_methods_updated_at BEFORE UPDATE ON customer_payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_d2c_orders_updated_at ON d2c_orders;
CREATE TRIGGER update_d2c_orders_updated_at BEFORE UPDATE ON d2c_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE d2c_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE d2c_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage products" ON products
    FOR ALL USING (true) WITH CHECK (true);

-- Customers: Own data only
CREATE POLICY "Customers can view own data" ON customers
    FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Customers can update own data" ON customers
    FOR UPDATE USING (id = auth.uid()::uuid);

CREATE POLICY "Service role can manage customers" ON customers
    FOR ALL USING (true) WITH CHECK (true);

-- Customer Addresses: Own addresses only
CREATE POLICY "Customers can manage own addresses" ON customer_addresses
    FOR ALL USING (customer_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage addresses" ON customer_addresses
    FOR ALL USING (true) WITH CHECK (true);

-- Customer Payment Methods: Own methods only
CREATE POLICY "Customers can manage own payment methods" ON customer_payment_methods
    FOR ALL USING (customer_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage payment methods" ON customer_payment_methods
    FOR ALL USING (true) WITH CHECK (true);

-- Cart Items: Own cart only
CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL USING (user_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage cart" ON cart_items
    FOR ALL USING (true) WITH CHECK (true);

-- D2C Orders: Own orders only
CREATE POLICY "Customers can view own orders" ON d2c_orders
    FOR SELECT USING (customer_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage orders" ON d2c_orders
    FOR ALL USING (true) WITH CHECK (true);

-- D2C Order Items: Via order ownership
CREATE POLICY "Customers can view own order items" ON d2c_order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM d2c_orders WHERE customer_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Service role can manage order items" ON d2c_order_items
    FOR ALL USING (true) WITH CHECK (true);

-- Subscriptions: Own subscriptions only
CREATE POLICY "Customers can manage own subscriptions" ON subscriptions
    FOR ALL USING (customer_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL USING (true) WITH CHECK (true);

-- Loyalty Transactions: Own transactions only
CREATE POLICY "Customers can view own loyalty transactions" ON loyalty_transactions
    FOR SELECT USING (customer_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage loyalty transactions" ON loyalty_transactions
    FOR ALL USING (true) WITH CHECK (true);

-- Product Reviews: Public read, own write
CREATE POLICY "Anyone can view approved reviews" ON product_reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Customers can manage own reviews" ON product_reviews
    FOR ALL USING (customer_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage reviews" ON product_reviews
    FOR ALL USING (true) WITH CHECK (true);

-- Wishlist: Own wishlist only
CREATE POLICY "Customers can manage own wishlist" ON wishlist_items
    FOR ALL USING (customer_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage wishlist" ON wishlist_items
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS FOR ORDER NUMBER GENERATION
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
    INTO counter
    FROM d2c_orders
    WHERE order_number LIKE 'DRZ%';
    
    new_number := 'DRZ' || LPAD(counter::TEXT, 6, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert sample products (only if products table is empty)
INSERT INTO products (name, slug, description, category, price_cents, wholesale_price_cents, hero_image_url, is_active, stock_quantity)
SELECT * FROM (VALUES
    ('Pink Pitaya Smoothie Mix', 'pink-pitaya-smoothie', 'Delicious dragon fruit smoothie blend', 'smoothies', 2499, 1899, '/products/pink-pitaya.jpg', true, 100),
    ('Green Wellness Blend', 'green-wellness-blend', 'Nutrient-packed green smoothie', 'smoothies', 2699, 2099, '/products/green-wellness.jpg', true, 150),
    ('Berry Blast Mix', 'berry-blast-mix', 'Mixed berry superfood blend', 'smoothies', 2399, 1799, '/products/berry-blast.jpg', true, 120)
) AS v(name, slug, description, category, price_cents, wholesale_price_cents, hero_image_url, is_active, stock_quantity)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Core e-commerce tables created successfully!';
    RAISE NOTICE 'Tables created: products, customers, customer_addresses, customer_payment_methods, cart_items, d2c_orders, d2c_order_items, subscriptions, loyalty_transactions, product_reviews, wishlist_items';
    RAISE NOTICE 'RLS policies enabled for all tables';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Set environment variables in your application';
    RAISE NOTICE '2. Test authentication flow';
    RAISE NOTICE '3. Test cart and checkout functionality';
END $$;
