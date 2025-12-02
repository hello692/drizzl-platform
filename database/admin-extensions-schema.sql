-- =====================================================
-- ADMIN EXTENSIONS SCHEMA
-- Drizzl Wellness Admin Module Database Extensions
-- Run this SQL in Supabase SQL Editor AFTER the main schema
-- This extends the existing schema with admin-specific tables
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ROLE_PERMISSIONS TABLE
-- Role-based access control for granular admin permissions
-- Each role has a set of permission strings stored as JSONB array
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT NOT NULL UNIQUE CHECK (role_name IN (
    'super_admin',
    'factory_manager',
    'finance',
    'marketing',
    'support',
    'warehouse',
    'b2b_sales'
  )),
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_name ON role_permissions(role_name);

COMMENT ON TABLE role_permissions IS 'Defines permissions for each admin role. Permissions are stored as a JSONB array of permission strings.';
COMMENT ON COLUMN role_permissions.permissions IS 'Array of permission strings, e.g., ["products:read", "products:write", "orders:manage"]';

-- =====================================================
-- USER_ROLE_ASSIGNMENTS TABLE
-- Maps users to their assigned admin roles
-- A user can have multiple role assignments
-- =====================================================
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL CHECK (role_name IN (
    'super_admin',
    'factory_manager',
    'finance',
    'marketing',
    'support',
    'warehouse',
    'b2b_sales'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_name ON user_role_assignments(role_name);

COMMENT ON TABLE user_role_assignments IS 'Maps users to admin roles. Users can have multiple roles assigned.';

-- =====================================================
-- PRODUCT_COSTS TABLE
-- Extended product costing and margin tracking
-- Links to products table for detailed cost breakdown
-- =====================================================
CREATE TABLE IF NOT EXISTS product_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cost_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0,
  margin_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ingredients_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  packaging_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  labor_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_costs_product_id ON product_costs(product_id);

COMMENT ON TABLE product_costs IS 'Extended cost breakdown for each product including ingredients, packaging, and labor costs.';
COMMENT ON COLUMN product_costs.cost_per_unit IS 'Total cost per unit (sum of ingredients, packaging, labor, and other costs)';
COMMENT ON COLUMN product_costs.margin_per_unit IS 'Profit margin per unit after all costs';

-- =====================================================
-- PRODUCT_INGREDIENTS TABLE
-- Detailed ingredient information per SKU/product
-- Includes nutritional data and supplier information
-- =====================================================
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  weight_grams NUMERIC(10, 2) NOT NULL DEFAULT 0,
  nutrition_data JSONB DEFAULT '{}',
  supplier TEXT
);

CREATE INDEX IF NOT EXISTS idx_product_ingredients_product_id ON product_ingredients(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ingredients_supplier ON product_ingredients(supplier);

COMMENT ON TABLE product_ingredients IS 'Lists all ingredients for each product with weights and nutritional data.';
COMMENT ON COLUMN product_ingredients.nutrition_data IS 'JSON object containing nutritional info: calories, protein, carbs, fat, vitamins, etc.';

-- =====================================================
-- INVENTORY_ITEMS TABLE
-- Tracks ingredient, packaging, and finished goods inventory
-- Includes lot tracking, expiration, and storage location
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type TEXT NOT NULL CHECK (item_type IN ('ingredient', 'packaging', 'finished_good')),
  name TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_threshold NUMERIC(12, 2) DEFAULT 0,
  expiration_date TIMESTAMP WITH TIME ZONE,
  lot_number TEXT,
  supplier_name TEXT,
  storage_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_type ON inventory_items(item_type);
CREATE INDEX IF NOT EXISTS idx_inventory_items_name ON inventory_items(name);
CREATE INDEX IF NOT EXISTS idx_inventory_items_lot ON inventory_items(lot_number);
CREATE INDEX IF NOT EXISTS idx_inventory_items_expiration ON inventory_items(expiration_date);
CREATE INDEX IF NOT EXISTS idx_inventory_items_supplier ON inventory_items(supplier_name);

COMMENT ON TABLE inventory_items IS 'Tracks all inventory including raw ingredients, packaging materials, and finished goods.';
COMMENT ON COLUMN inventory_items.min_threshold IS 'Minimum quantity threshold for low stock alerts';
COMMENT ON COLUMN inventory_items.lot_number IS 'Lot/batch number for traceability';

-- =====================================================
-- MANUFACTURING_BATCHES TABLE
-- Production batch tracking and status management
-- Links to products and tracks manufacturing lifecycle
-- =====================================================
CREATE TABLE IF NOT EXISTS manufacturing_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity_produced INTEGER NOT NULL DEFAULT 0,
  manufacture_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN (
    'in_progress',
    'completed',
    'qa_hold',
    'released'
  )),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manufacturing_batches_batch_number ON manufacturing_batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_manufacturing_batches_product_id ON manufacturing_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_manufacturing_batches_status ON manufacturing_batches(status);
CREATE INDEX IF NOT EXISTS idx_manufacturing_batches_manufacture_date ON manufacturing_batches(manufacture_date);

COMMENT ON TABLE manufacturing_batches IS 'Tracks production batches from manufacturing through QA release.';
COMMENT ON COLUMN manufacturing_batches.status IS 'Batch lifecycle: in_progress → completed → qa_hold → released';

-- =====================================================
-- MEDIA_ASSETS TABLE
-- Video and image asset management for marketing
-- Supports autoplay, looping, and positioning
-- =====================================================
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('video', 'image')),
  url TEXT NOT NULL,
  caption TEXT,
  position INTEGER DEFAULT 0,
  autoplay BOOLEAN DEFAULT false,
  loop BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(type);
CREATE INDEX IF NOT EXISTS idx_media_assets_active ON media_assets(is_active);
CREATE INDEX IF NOT EXISTS idx_media_assets_position ON media_assets(position);

COMMENT ON TABLE media_assets IS 'Manages video and image assets for website and marketing materials.';
COMMENT ON COLUMN media_assets.position IS 'Display order for galleries and carousels';
COMMENT ON COLUMN media_assets.autoplay IS 'Whether video should autoplay (only applies to video type)';

-- =====================================================
-- SOCIAL_ACCOUNTS TABLE
-- Connected social media account management
-- Stores encrypted access tokens for API integration
-- =====================================================
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'facebook')),
  account_id TEXT NOT NULL,
  account_name TEXT,
  access_token_encrypted TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(platform, account_id)
);

CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_active ON social_accounts(is_active);

COMMENT ON TABLE social_accounts IS 'Stores connected social media accounts for analytics and posting.';
COMMENT ON COLUMN social_accounts.access_token_encrypted IS 'Encrypted OAuth access token for API calls - NEVER store plain text';

-- =====================================================
-- SOCIAL_POSTS TABLE
-- Tracks individual social media posts and their metrics
-- Syncs engagement data from connected platforms
-- =====================================================
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  post_id TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  posted_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_social_posts_account_id ON social_posts(account_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_posted_at ON social_posts(posted_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_last_synced ON social_posts(last_synced);

COMMENT ON TABLE social_posts IS 'Tracks individual posts from connected social accounts with engagement metrics.';
COMMENT ON COLUMN social_posts.last_synced IS 'Last time engagement metrics were fetched from the platform API';

-- =====================================================
-- AI_INSIGHTS TABLE
-- Stores AI-generated business insights and recommendations
-- Preserves context data used for generating each insight
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_type TEXT NOT NULL,
  content TEXT NOT NULL,
  data_context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created ON ai_insights(created_at);

COMMENT ON TABLE ai_insights IS 'Logs AI-generated insights for business intelligence and recommendations.';
COMMENT ON COLUMN ai_insights.insight_type IS 'Category of insight: sales_trend, inventory_alert, marketing_recommendation, etc.';
COMMENT ON COLUMN ai_insights.data_context IS 'JSON snapshot of data used to generate the insight for reproducibility';

-- =====================================================
-- COMMAND_CENTER_SNAPSHOTS TABLE
-- Daily analytics snapshots for the admin command center
-- Stores aggregated metrics for historical analysis
-- =====================================================
CREATE TABLE IF NOT EXISTS command_center_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_date DATE NOT NULL UNIQUE,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_command_center_snapshots_date ON command_center_snapshots(snapshot_date);

COMMENT ON TABLE command_center_snapshots IS 'Daily snapshots of key business metrics for the admin command center dashboard.';
COMMENT ON COLUMN command_center_snapshots.metrics IS 'JSON object containing all metrics: revenue, orders, inventory levels, social engagement, etc.';

-- =====================================================
-- UPDATED_AT TRIGGERS
-- Automatically update the updated_at column on row changes
-- =====================================================

-- Ensure the trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables with updated_at column
DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON role_permissions;
CREATE TRIGGER update_role_permissions_updated_at
  BEFORE UPDATE ON role_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_costs_updated_at ON product_costs;
CREATE TRIGGER update_product_costs_updated_at
  BEFORE UPDATE ON product_costs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON inventory_items;
CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_assets_updated_at ON media_assets;
CREATE TRIGGER update_media_assets_updated_at
  BEFORE UPDATE ON media_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Admin-only access for all extension tables
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturing_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE command_center_snapshots ENABLE ROW LEVEL SECURITY;

-- Role Permissions: Admin only
DROP POLICY IF EXISTS "Admins can manage role permissions" ON role_permissions;
CREATE POLICY "Admins can manage role permissions" ON role_permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User Role Assignments: Admin only
DROP POLICY IF EXISTS "Admins can manage user role assignments" ON user_role_assignments;
CREATE POLICY "Admins can manage user role assignments" ON user_role_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Product Costs: Admin only
DROP POLICY IF EXISTS "Admins can manage product costs" ON product_costs;
CREATE POLICY "Admins can manage product costs" ON product_costs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Product Ingredients: Admin only
DROP POLICY IF EXISTS "Admins can manage product ingredients" ON product_ingredients;
CREATE POLICY "Admins can manage product ingredients" ON product_ingredients FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Inventory Items: Admin only
DROP POLICY IF EXISTS "Admins can manage inventory" ON inventory_items;
CREATE POLICY "Admins can manage inventory" ON inventory_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Manufacturing Batches: Admin only
DROP POLICY IF EXISTS "Admins can manage manufacturing batches" ON manufacturing_batches;
CREATE POLICY "Admins can manage manufacturing batches" ON manufacturing_batches FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Media Assets: Admin only for management, public read for active
DROP POLICY IF EXISTS "Admins can manage media assets" ON media_assets;
CREATE POLICY "Admins can manage media assets" ON media_assets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Anyone can view active media assets" ON media_assets;
CREATE POLICY "Anyone can view active media assets" ON media_assets FOR SELECT USING (is_active = true);

-- Social Accounts: Admin only
DROP POLICY IF EXISTS "Admins can manage social accounts" ON social_accounts;
CREATE POLICY "Admins can manage social accounts" ON social_accounts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Social Posts: Admin only
DROP POLICY IF EXISTS "Admins can manage social posts" ON social_posts;
CREATE POLICY "Admins can manage social posts" ON social_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- AI Insights: Admin only
DROP POLICY IF EXISTS "Admins can manage ai insights" ON ai_insights;
CREATE POLICY "Admins can manage ai insights" ON ai_insights FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Command Center Snapshots: Admin only
DROP POLICY IF EXISTS "Admins can manage command center snapshots" ON command_center_snapshots;
CREATE POLICY "Admins can manage command center snapshots" ON command_center_snapshots FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- HELPER FUNCTION: Check if user has specific permission
-- Usage: SELECT has_permission(auth.uid(), 'products:write')
-- =====================================================
CREATE OR REPLACE FUNCTION has_permission(user_uuid UUID, permission_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_role_assignments ura
    JOIN role_permissions rp ON ura.role_name = rp.role_name
    WHERE ura.user_id = user_uuid
    AND rp.permissions ? permission_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION has_permission IS 'Checks if a user has a specific permission through any of their assigned roles';

-- =====================================================
-- HELPER FUNCTION: Get all permissions for a user
-- Usage: SELECT get_user_permissions(auth.uid())
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  all_permissions JSONB := '[]';
BEGIN
  SELECT COALESCE(jsonb_agg(DISTINCT perm), '[]')
  INTO all_permissions
  FROM user_role_assignments ura
  JOIN role_permissions rp ON ura.role_name = rp.role_name,
  jsonb_array_elements_text(rp.permissions) AS perm
  WHERE ura.user_id = user_uuid;
  
  RETURN all_permissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_permissions IS 'Returns all unique permissions for a user across all their assigned roles';

-- =====================================================
-- END OF ADMIN EXTENSIONS SCHEMA
-- =====================================================
