-- Helper Functions for E-commerce Operations

-- Function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_product_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET stock_quantity = GREATEST(0, COALESCE(stock_quantity, 0) - quantity)
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment product stock (for returns/cancellations)
CREATE OR REPLACE FUNCTION increment_product_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET stock_quantity = COALESCE(stock_quantity, 0) + quantity
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update customer loyalty tier based on points
CREATE OR REPLACE FUNCTION update_loyalty_tier(customer_id UUID)
RETURNS VOID AS $$
DECLARE
    points INTEGER;
    new_tier TEXT;
BEGIN
    SELECT loyalty_points INTO points
    FROM customers
    WHERE id = customer_id;
    
    IF points >= 10000 THEN
        new_tier := 'platinum';
    ELSIF points >= 5000 THEN
        new_tier := 'gold';
    ELSIF points >= 2000 THEN
        new_tier := 'silver';
    ELSE
        new_tier := 'bronze';
    END IF;
    
    UPDATE customers
    SET loyalty_tier = new_tier
    WHERE id = customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update loyalty tier when points change
CREATE OR REPLACE FUNCTION trigger_update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.loyalty_points != OLD.loyalty_points THEN
        PERFORM update_loyalty_tier(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_customer_loyalty_tier ON customers;
CREATE TRIGGER update_customer_loyalty_tier
    AFTER UPDATE OF loyalty_points ON customers
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_loyalty_tier();

-- Function to get cart total
CREATE OR REPLACE FUNCTION get_cart_total(p_user_id UUID DEFAULT NULL, p_session_id TEXT DEFAULT NULL)
RETURNS TABLE(
    item_count BIGINT,
    subtotal_cents BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as item_count,
        COALESCE(SUM(ci.quantity * p.price_cents), 0)::BIGINT as subtotal_cents
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE (p_user_id IS NOT NULL AND ci.user_id = p_user_id)
       OR (p_session_id IS NOT NULL AND ci.session_id = p_session_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to migrate guest cart to user cart
CREATE OR REPLACE FUNCTION migrate_guest_cart_to_user(p_session_id TEXT, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Update existing guest cart items to user
    UPDATE cart_items
    SET user_id = p_user_id,
        session_id = NULL
    WHERE session_id = p_session_id;
    
    -- Handle duplicates by merging quantities
    WITH duplicates AS (
        SELECT product_id, SUM(quantity) as total_quantity
        FROM cart_items
        WHERE user_id = p_user_id
        GROUP BY product_id
        HAVING COUNT(*) > 1
    )
    DELETE FROM cart_items
    WHERE id IN (
        SELECT ci.id
        FROM cart_items ci
        JOIN duplicates d ON ci.product_id = d.product_id
        WHERE ci.user_id = p_user_id
    );
    
    -- Insert merged items
    INSERT INTO cart_items (user_id, product_id, quantity)
    SELECT p_user_id, product_id, total_quantity
    FROM (
        SELECT product_id, SUM(quantity) as total_quantity
        FROM cart_items
        WHERE user_id = p_user_id
        GROUP BY product_id
    ) merged
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET quantity = EXCLUDED.quantity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_totals(
    p_subtotal_cents INTEGER,
    p_shipping_cents INTEGER DEFAULT 0,
    p_discount_cents INTEGER DEFAULT 0,
    p_tax_rate DECIMAL DEFAULT 0.08
)
RETURNS TABLE(
    subtotal_cents INTEGER,
    tax_cents INTEGER,
    shipping_cents INTEGER,
    discount_cents INTEGER,
    total_cents INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p_subtotal_cents,
        ROUND((p_subtotal_cents - p_discount_cents) * p_tax_rate)::INTEGER as tax_cents,
        p_shipping_cents,
        p_discount_cents,
        (p_subtotal_cents + ROUND((p_subtotal_cents - p_discount_cents) * p_tax_rate)::INTEGER + p_shipping_cents - p_discount_cents)::INTEGER as total_cents;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if customer can place order (credit check for B2B)
CREATE OR REPLACE FUNCTION can_place_order(p_customer_id UUID, p_order_total_cents INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    is_active BOOLEAN;
BEGIN
    SELECT customers.is_active INTO is_active
    FROM customers
    WHERE id = p_customer_id;
    
    RETURN COALESCE(is_active, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get customer order stats
CREATE OR REPLACE FUNCTION get_customer_order_stats(p_customer_id UUID)
RETURNS TABLE(
    total_orders BIGINT,
    total_spent_cents BIGINT,
    avg_order_value_cents BIGINT,
    last_order_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_orders,
        COALESCE(SUM(total_cents), 0)::BIGINT as total_spent_cents,
        COALESCE(AVG(total_cents)::BIGINT, 0) as avg_order_value_cents,
        MAX(created_at) as last_order_date
    FROM d2c_orders
    WHERE customer_id = p_customer_id
      AND status != 'cancelled';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Helper functions created successfully!';
    RAISE NOTICE 'Functions: decrement_product_stock, increment_product_stock, update_loyalty_tier, get_cart_total, migrate_guest_cart_to_user, calculate_order_totals, can_place_order, get_customer_order_stats';
END $$;
