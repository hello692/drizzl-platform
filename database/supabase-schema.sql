-- Drizzl Wellness Database Schema
-- Run this SQL in Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Stores user profile data with role-based access
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'partner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''), 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PRODUCTS TABLE
-- Complete product catalog with D2C and B2B pricing
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0,
  wholesale_price_cents INTEGER NOT NULL DEFAULT 0,
  hero_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for product lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- =====================================================
-- ORDERS TABLE
-- Stores both D2C and B2B orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_type TEXT NOT NULL DEFAULT 'd2c' CHECK (order_type IN ('d2c', 'b2b')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for order lookups
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- =====================================================
-- ORDER_ITEMS TABLE
-- Line items for each order
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL DEFAULT 0
);

-- Create index for order item lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- =====================================================
-- RETAIL_PARTNERS TABLE (Updated with Status System)
-- B2B partner information with approval workflow
-- =====================================================
CREATE TABLE IF NOT EXISTS retail_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Account Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  
  -- Business Information (Step 1)
  legal_business_name TEXT NOT NULL,
  dba_store_name TEXT,
  business_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  business_phone TEXT NOT NULL,
  business_email TEXT NOT NULL,
  website TEXT,
  
  -- Business Verification (Step 2)
  ein_tax_id TEXT,
  resale_certificate_url TEXT,
  business_type TEXT CHECK (business_type IN ('retail_store', 'cafe', 'gym', 'hotel', 'distributor', 'other')),
  years_in_business INTEGER,
  
  -- Decision Maker (Step 3)
  decision_maker_name TEXT NOT NULL,
  decision_maker_role TEXT CHECK (decision_maker_role IN ('owner', 'buyer', 'manager', 'other')),
  decision_maker_email TEXT NOT NULL,
  decision_maker_phone TEXT,
  
  -- Order & Logistics Profile (Step 4)
  estimated_monthly_volume TEXT CHECK (estimated_monthly_volume IN ('under_500', '500_2000', '2000_5000', '5000_10000', 'over_10000')),
  preferred_delivery_schedule TEXT CHECK (preferred_delivery_schedule IN ('weekly', 'bi_weekly', 'monthly')),
  receiving_hours TEXT,
  has_loading_dock BOOLEAN DEFAULT false,
  preferred_payment_method TEXT CHECK (preferred_payment_method IN ('credit_card', 'ach', 'net_30', 'net_60')),
  
  -- Metadata
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for partner lookups
CREATE INDEX IF NOT EXISTS idx_retail_partners_user ON retail_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_retail_partners_status ON retail_partners(status);
CREATE INDEX IF NOT EXISTS idx_retail_partners_created ON retail_partners(created_at);

-- =====================================================
-- PARTNER_APPLICATIONS TABLE
-- Tracks application history and admin actions
-- =====================================================
CREATE TABLE IF NOT EXISTS partner_application_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'suspended', 'reactivated', 'updated')),
  performed_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_logs_partner ON partner_application_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_logs_action ON partner_application_logs(action);

-- =====================================================
-- ADMIN_NOTIFICATIONS TABLE
-- Notifications for admin dashboard
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_partner_application', 'new_order', 'low_stock', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at);

-- =====================================================
-- ANALYTICS_EVENTS TABLE
-- Event tracking for analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- =====================================================
-- CART_ITEMS TABLE
-- Shopping cart for customers
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE retail_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_application_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products: Anyone can read active products, admins can manage all
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders: Users can view own orders, partners can view B2B orders, admins can view all
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order Items: Same as orders
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can create order items" ON order_items;
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Retail Partners: Partners can view own data, anyone can insert (for applications), admins can manage all
DROP POLICY IF EXISTS "Partners can view own data" ON retail_partners;
CREATE POLICY "Partners can view own data" ON retail_partners FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create partner application" ON retail_partners;
CREATE POLICY "Users can create partner application" ON retail_partners FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage partners" ON retail_partners;
CREATE POLICY "Admins can manage partners" ON retail_partners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Partner Application Logs: Partners can view own logs, admins can manage all
DROP POLICY IF EXISTS "Partners can view own logs" ON partner_application_logs;
CREATE POLICY "Partners can view own logs" ON partner_application_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM retail_partners WHERE retail_partners.id = partner_application_logs.partner_id AND retail_partners.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage partner logs" ON partner_application_logs;
CREATE POLICY "Admins can manage partner logs" ON partner_application_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin Notifications: Only admins can access
DROP POLICY IF EXISTS "Admins can manage notifications" ON admin_notifications;
CREATE POLICY "Admins can manage notifications" ON admin_notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Analytics: Anyone can insert, admins can read all
DROP POLICY IF EXISTS "Anyone can insert analytics" ON analytics_events;
CREATE POLICY "Anyone can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view analytics" ON analytics_events;
CREATE POLICY "Admins can view analytics" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Cart Items: Users can manage own cart
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_retail_partners_updated_at ON retail_partners;
CREATE TRIGGER update_retail_partners_updated_at BEFORE UPDATE ON retail_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Create admin notification on new partner application
-- =====================================================
CREATE OR REPLACE FUNCTION notify_admin_new_partner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (notification_type, title, message, metadata)
  VALUES (
    'new_partner_application',
    'New Partner Application',
    'A new wholesale partner application has been submitted by ' || NEW.legal_business_name,
    jsonb_build_object('partner_id', NEW.id, 'business_name', NEW.legal_business_name, 'email', NEW.business_email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_partner_application ON retail_partners;
CREATE TRIGGER on_new_partner_application
  AFTER INSERT ON retail_partners
  FOR EACH ROW EXECUTE FUNCTION notify_admin_new_partner();

-- =====================================================
-- MIGRATION SCRIPT (Run separately if updating existing DB)
-- =====================================================
-- ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
-- ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
-- ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id);
-- etc...
