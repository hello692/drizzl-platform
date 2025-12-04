-- Migration 006: Phase 2 - Orders 2.0, Banking Intelligence, Lead Pipeline
-- Created: December 2024

-- ============================================
-- 1. ORDERS 2.0 - ENHANCED ORDER TRACKING
-- ============================================

-- Order tracking info
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier_service TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost_cents INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS signature_required BOOLEAN DEFAULT false;

-- Shipment tracking events
CREATE TABLE IF NOT EXISTS shipment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL,
    location TEXT,
    location_coordinates JSONB,
    description TEXT,
    timestamp TIMESTAMPTZ NOT NULL,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipment_events_order ON shipment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_timestamp ON shipment_events(timestamp DESC);

-- Proof of delivery
CREATE TABLE IF NOT EXISTS delivery_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_id UUID REFERENCES partner_deliveries(id),
    proof_type TEXT NOT NULL,
    signature_image_url TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    recipient_name TEXT,
    delivery_notes TEXT,
    gps_coordinates JSONB,
    delivered_at TIMESTAMPTZ DEFAULT NOW(),
    driver_id TEXT,
    driver_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_proofs_order ON delivery_proofs(order_id);

-- Carrier configurations
CREATE TABLE IF NOT EXISTS carriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    tracking_url_template TEXT,
    api_enabled BOOLEAN DEFAULT false,
    api_credentials JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO carriers (name, code, tracking_url_template, is_active) VALUES
    ('USPS', 'usps', 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking}', true),
    ('UPS', 'ups', 'https://www.ups.com/track?tracknum={tracking}', true),
    ('FedEx', 'fedex', 'https://www.fedex.com/fedextrack/?trknbr={tracking}', true),
    ('DHL', 'dhl', 'https://www.dhl.com/us-en/home/tracking.html?tracking-id={tracking}', true),
    ('Amazon Logistics', 'amzl', 'https://track.amazon.com/tracking/{tracking}', true),
    ('OnTrac', 'ontrac', 'https://www.ontrac.com/tracking/?trackingres={tracking}', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 2. BANKING INTELLIGENCE
-- ============================================

-- Bank accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT UNIQUE,
    account_name TEXT NOT NULL,
    account_type TEXT,
    routing_number TEXT,
    account_number_last4 TEXT,
    current_balance_cents BIGINT DEFAULT 0,
    available_balance_cents BIGINT DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    bank_name TEXT,
    status TEXT DEFAULT 'active',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_status ON bank_accounts(status);

-- Bank transactions
CREATE TABLE IF NOT EXISTS bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    external_id TEXT UNIQUE,
    transaction_type TEXT NOT NULL,
    amount_cents BIGINT NOT NULL,
    running_balance_cents BIGINT,
    description TEXT,
    counterparty_name TEXT,
    counterparty_id TEXT,
    category TEXT,
    status TEXT DEFAULT 'posted',
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_transactions_account ON bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_posted ON bank_transactions(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_type ON bank_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_category ON bank_transactions(category);

-- Financial metrics snapshots
CREATE TABLE IF NOT EXISTS financial_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date DATE NOT NULL,
    total_balance_cents BIGINT DEFAULT 0,
    total_income_cents BIGINT DEFAULT 0,
    total_expenses_cents BIGINT DEFAULT 0,
    net_income_cents BIGINT DEFAULT 0,
    cash_burn_rate_cents BIGINT DEFAULT 0,
    runway_days INTEGER,
    income_by_category JSONB DEFAULT '{}'::jsonb,
    expenses_by_category JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_financial_snapshots_date ON financial_snapshots(snapshot_date DESC);

-- ============================================
-- 3. LEAD PIPELINE / CRM
-- ============================================

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_number TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company_name TEXT,
    company_type TEXT,
    website TEXT,
    source TEXT,
    status TEXT DEFAULT 'new',
    pipeline_stage TEXT DEFAULT 'new',
    assigned_to UUID REFERENCES profiles(id),
    score INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    last_contacted_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    converted_to_partner_id UUID REFERENCES retail_partners(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_number ON leads(lead_number);

-- Lead activities
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    subject TEXT,
    description TEXT,
    outcome TEXT,
    performed_by UUID REFERENCES profiles(id),
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_lead_activities_scheduled ON lead_activities(scheduled_at);

-- Lead meetings (Google Calendar integration)
CREATE TABLE IF NOT EXISTS lead_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    calendar_event_id TEXT,
    meeting_type TEXT DEFAULT 'discovery',
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone TEXT DEFAULT 'America/New_York',
    meeting_link TEXT,
    location TEXT,
    attendees JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'scheduled',
    outcome TEXT,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_meetings_lead ON lead_meetings(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_meetings_start ON lead_meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_lead_meetings_status ON lead_meetings(status);

-- Lead documents
CREATE TABLE IF NOT EXISTS lead_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    file_url TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_documents_lead ON lead_documents(lead_id);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_documents ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can manage shipment_events" ON shipment_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage delivery_proofs" ON delivery_proofs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage carriers" ON carriers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage bank_accounts" ON bank_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage bank_transactions" ON bank_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage financial_snapshots" ON financial_snapshots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage leads" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage lead_activities" ON lead_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage lead_meetings" ON lead_meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage lead_documents" ON lead_documents FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Generate lead number
CREATE OR REPLACE FUNCTION generate_lead_number()
RETURNS TEXT AS $$
DECLARE
    num TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        num := 'LD-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM leads WHERE lead_number = num) INTO exists_check;
        EXIT WHEN NOT exists_check;
    END LOOP;
    RETURN num;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-generating lead number
CREATE OR REPLACE FUNCTION set_lead_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.lead_number IS NULL THEN
        NEW.lead_number := generate_lead_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_lead_number ON leads;
CREATE TRIGGER trigger_set_lead_number
    BEFORE INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION set_lead_number();
