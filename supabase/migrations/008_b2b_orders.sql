-- B2B Orders Migration
-- This creates the B2B order system separate from D2C orders

-- ============================================================================
-- B2B ORDERS (for retail partners)
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE RESTRICT,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- Pricing (wholesale)
    subtotal_cents INTEGER NOT NULL DEFAULT 0,
    tax_cents INTEGER NOT NULL DEFAULT 0,
    shipping_cents INTEGER NOT NULL DEFAULT 0,
    discount_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL DEFAULT 0,
    
    -- Payment terms
    payment_terms TEXT DEFAULT 'net30' CHECK (payment_terms IN ('net15', 'net30', 'net60', 'cod', 'prepaid')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'overdue')),
    due_date DATE,
    paid_at TIMESTAMPTZ,
    
    -- Shipping
    shipping_address JSONB,
    billing_address JSONB,
    tracking_number TEXT,
    carrier TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Metadata
    po_number TEXT,
    partner_notes TEXT,
    internal_notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Approval workflow
    requires_approval BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_orders_partner_id ON b2b_orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_order_number ON b2b_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_status ON b2b_orders(status);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_payment_status ON b2b_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_created_at ON b2b_orders(created_at DESC);

-- ============================================================================
-- B2B ORDER ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES b2b_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    product_snapshot JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_order_items_order_id ON b2b_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_b2b_order_items_product_id ON b2b_order_items(product_id);

-- ============================================================================
-- B2B CART (separate from D2C cart)
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(partner_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_b2b_cart_items_partner_id ON b2b_cart_items(partner_id);
CREATE INDEX IF NOT EXISTS idx_b2b_cart_items_product_id ON b2b_cart_items(product_id);

-- ============================================================================
-- B2B QUOTES (Request for Quote system)
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    quote_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected', 'expired')),
    
    -- Pricing
    subtotal_cents INTEGER NOT NULL DEFAULT 0,
    tax_cents INTEGER NOT NULL DEFAULT 0,
    shipping_cents INTEGER NOT NULL DEFAULT 0,
    discount_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL DEFAULT 0,
    
    -- Quote details
    valid_until DATE,
    partner_message TEXT,
    admin_notes TEXT,
    
    -- Conversion
    converted_to_order_id UUID REFERENCES b2b_orders(id),
    converted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_quotes_partner_id ON b2b_quotes(partner_id);
CREATE INDEX IF NOT EXISTS idx_b2b_quotes_status ON b2b_quotes(status);

-- ============================================================================
-- B2B QUOTE ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS b2b_quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES b2b_quotes(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_quote_items_quote_id ON b2b_quote_items(quote_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS update_b2b_orders_updated_at ON b2b_orders;
CREATE TRIGGER update_b2b_orders_updated_at BEFORE UPDATE ON b2b_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_b2b_cart_items_updated_at ON b2b_cart_items;
CREATE TRIGGER update_b2b_cart_items_updated_at BEFORE UPDATE ON b2b_cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_b2b_quotes_updated_at ON b2b_quotes;
CREATE TRIGGER update_b2b_quotes_updated_at BEFORE UPDATE ON b2b_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE b2b_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_quote_items ENABLE ROW LEVEL SECURITY;

-- B2B Orders: Partners can view own orders
CREATE POLICY "Partners can view own b2b orders" ON b2b_orders
    FOR SELECT USING (
        partner_id IN (
            SELECT id FROM retail_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage b2b orders" ON b2b_orders
    FOR ALL USING (true) WITH CHECK (true);

-- B2B Order Items: Via order ownership
CREATE POLICY "Partners can view own b2b order items" ON b2b_order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM b2b_orders WHERE partner_id IN (
                SELECT id FROM retail_partners WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Service role can manage b2b order items" ON b2b_order_items
    FOR ALL USING (true) WITH CHECK (true);

-- B2B Cart: Partners can manage own cart
CREATE POLICY "Partners can manage own b2b cart" ON b2b_cart_items
    FOR ALL USING (
        partner_id IN (
            SELECT id FROM retail_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage b2b cart" ON b2b_cart_items
    FOR ALL USING (true) WITH CHECK (true);

-- B2B Quotes: Partners can view own quotes
CREATE POLICY "Partners can view own quotes" ON b2b_quotes
    FOR SELECT USING (
        partner_id IN (
            SELECT id FROM retail_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage quotes" ON b2b_quotes
    FOR ALL USING (true) WITH CHECK (true);

-- B2B Quote Items: Via quote ownership
CREATE POLICY "Partners can view own quote items" ON b2b_quote_items
    FOR SELECT USING (
        quote_id IN (
            SELECT id FROM b2b_quotes WHERE partner_id IN (
                SELECT id FROM retail_partners WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Service role can manage quote items" ON b2b_quote_items
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Generate B2B order number
CREATE OR REPLACE FUNCTION generate_b2b_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM b2b_orders
    WHERE order_number LIKE 'B2B-%';
    
    new_number := 'B2B-' || LPAD(counter::TEXT, 6, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 4) AS INTEGER)), 0) + 1
    INTO counter
    FROM b2b_quotes
    WHERE quote_number LIKE 'Q-%';
    
    new_number := 'Q-' || LPAD(counter::TEXT, 6, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'B2B order system created successfully!';
    RAISE NOTICE 'Tables created: b2b_orders, b2b_order_items, b2b_cart_items, b2b_quotes, b2b_quote_items';
    RAISE NOTICE 'RLS policies enabled for all B2B tables';
END $$;
