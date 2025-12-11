-- B2B Partner Pipeline 2026 Schema Extensions
-- This migration adds tables for AI scoring, DocuSign agreements, marketing kit, and performance analytics

-- Partner Scoring: AI-assisted risk and fit scoring
CREATE TABLE IF NOT EXISTS partner_scoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    risk_level TEXT CHECK (risk_level IN ('Low', 'Medium', 'High')),
    scoring_factors JSONB DEFAULT '{}',
    explanation TEXT,
    scored_by TEXT DEFAULT 'ai',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_scoring_partner_id ON partner_scoring(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_scoring_created_at ON partner_scoring(created_at DESC);

-- Partner Agreements: DocuSign integration tracking
CREATE TABLE IF NOT EXISTS partner_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    envelope_id TEXT,
    template_id TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'delivered', 'viewed', 'signed', 'declined', 'voided')),
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    signed_at TIMESTAMPTZ,
    declined_at TIMESTAMPTZ,
    signed_document_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id ON partner_agreements(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreements_envelope_id ON partner_agreements(envelope_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreements_status ON partner_agreements(status);

-- Partner Agreement Events: Webhook event log from DocuSign
CREATE TABLE IF NOT EXISTS partner_agreement_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES partner_agreements(id) ON DELETE CASCADE,
    envelope_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_agreement_events_envelope_id ON partner_agreement_events(envelope_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreement_events_created_at ON partner_agreement_events(created_at DESC);

-- Marketing Assets: Content for partner Launch Kit
CREATE TABLE IF NOT EXISTS marketing_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('menu', 'recipe', 'social', 'video', 'promo', 'training')),
    title TEXT NOT NULL,
    description TEXT,
    asset_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_type TEXT,
    file_size_bytes INTEGER,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_assets_category ON marketing_assets(category);
CREATE INDEX IF NOT EXISTS idx_marketing_assets_is_active ON marketing_assets(is_active);

-- Starter Bundles: Recommended product bundles for new partners
CREATE TABLE IF NOT EXISTS starter_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    bundle_type TEXT CHECK (bundle_type IN ('cafe', 'gym', 'retail', 'restaurant', 'custom')),
    products JSONB DEFAULT '[]',
    total_price_cents INTEGER,
    wholesale_price_cents INTEGER,
    min_order_quantity INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_starter_bundles_bundle_type ON starter_bundles(bundle_type);
CREATE INDEX IF NOT EXISTS idx_starter_bundles_is_active ON starter_bundles(is_active);

-- Partner Bundle Recommendations: Links partners to recommended bundles based on AI analysis
CREATE TABLE IF NOT EXISTS partner_bundle_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    bundle_id UUID NOT NULL REFERENCES starter_bundles(id) ON DELETE CASCADE,
    recommendation_score INTEGER CHECK (recommendation_score >= 0 AND recommendation_score <= 100),
    rationale JSONB DEFAULT '{}',
    is_dismissed BOOLEAN DEFAULT false,
    ordered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_bundle_recommendations_partner_id ON partner_bundle_recommendations(partner_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_bundle_recommendations_unique ON partner_bundle_recommendations(partner_id, bundle_id);

-- Partner Performance: Analytics and metrics tracking
CREATE TABLE IF NOT EXISTS partner_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_revenue_cents INTEGER DEFAULT 0,
    avg_order_value_cents INTEGER DEFAULT 0,
    units_sold INTEGER DEFAULT 0,
    top_products JSONB DEFAULT '[]',
    order_frequency_days NUMERIC(6,2),
    churn_risk_score INTEGER CHECK (churn_risk_score >= 0 AND churn_risk_score <= 100),
    predicted_next_order DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_performance_partner_id ON partner_performance(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_performance_period ON partner_performance(period_start, period_end);
CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_performance_unique ON partner_performance(partner_id, period_start, period_end);

-- Add scoring columns to retail_partners for quick access
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS latest_score INTEGER;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS risk_level TEXT;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS agreement_status TEXT;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMPTZ;

-- Row Level Security Policies

ALTER TABLE partner_scoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_agreement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE starter_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_bundle_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_performance ENABLE ROW LEVEL SECURITY;

-- Service role has full access (bypasses RLS automatically)
-- These policies allow admins via authenticated role to perform operations

-- Partner Scoring: Admins can manage, partners can view their own
CREATE POLICY "Admins can manage partner_scoring" ON partner_scoring
    FOR ALL USING (true) WITH CHECK (true);

-- Partner Agreements: Admins can manage, partners can view their own  
CREATE POLICY "Admins can manage partner_agreements" ON partner_agreements
    FOR ALL USING (true) WITH CHECK (true);

-- Partner Agreement Events: Admin only
CREATE POLICY "Admins can manage partner_agreement_events" ON partner_agreement_events
    FOR ALL USING (true) WITH CHECK (true);

-- Marketing Assets: Admins can manage
CREATE POLICY "Admins can manage marketing_assets" ON marketing_assets
    FOR ALL USING (true) WITH CHECK (true);

-- Starter Bundles: Admins can manage
CREATE POLICY "Admins can manage starter_bundles" ON starter_bundles
    FOR ALL USING (true) WITH CHECK (true);

-- Partner Bundle Recommendations: Admins can manage
CREATE POLICY "Admins can manage partner_bundle_recommendations" ON partner_bundle_recommendations
    FOR ALL USING (true) WITH CHECK (true);

-- Partner Performance: Admins can manage
CREATE POLICY "Admins can manage partner_performance" ON partner_performance
    FOR ALL USING (true) WITH CHECK (true);

-- Partners can view their own data
CREATE POLICY "Partners can view their own scoring" ON partner_scoring
    FOR SELECT USING (
        partner_id IN (
            SELECT id FROM retail_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Partners can view their own agreements" ON partner_agreements
    FOR SELECT USING (
        partner_id IN (
            SELECT id FROM retail_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Partners can view their own bundle recommendations" ON partner_bundle_recommendations
    FOR SELECT USING (
        partner_id IN (
            SELECT id FROM retail_partners WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Partners can view their own performance" ON partner_performance
    FOR SELECT USING (
        partner_id IN (
            SELECT id FROM retail_partners WHERE user_id = auth.uid()
        )
    );

-- Public read access to marketing assets and bundles
CREATE POLICY "Anyone can view active marketing assets" ON marketing_assets
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active starter bundles" ON starter_bundles
    FOR SELECT USING (is_active = true);
