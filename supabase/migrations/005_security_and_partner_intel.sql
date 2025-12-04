-- Migration 005: Security Hardening & Partner Intelligence
-- Created: December 2024

-- ============================================
-- 1. SECURITY TABLES
-- ============================================

-- User Sessions (Device Tracking & Remote Kill)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    device_info JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = true;

-- Two-Factor Authentication
CREATE TABLE IF NOT EXISTS user_2fa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    secret_key TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    backup_codes TEXT[] DEFAULT '{}',
    recovery_email TEXT,
    last_verified_at TIMESTAMPTZ,
    setup_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_2fa_user_id ON user_2fa(user_id);

-- Security Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    status TEXT DEFAULT 'success',
    risk_level TEXT DEFAULT 'low',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_level ON audit_logs(risk_level);

-- Failed Login Attempts (Brute Force Protection)
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN DEFAULT false,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created ON login_attempts(created_at DESC);

-- ============================================
-- 2. PARTNER INTELLIGENCE TABLES
-- ============================================

-- Add new columns to retail_partners for Partner Intelligence
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS partner_code TEXT UNIQUE;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS qr_code_data TEXT;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS account_manager_id UUID REFERENCES profiles(id);
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS total_revenue_cents BIGINT DEFAULT 0;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS contract_status TEXT DEFAULT 'pending';
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS contract_expiry_date DATE;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS license_verified BOOLEAN DEFAULT false;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'pending';
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE retail_partners ADD COLUMN IF NOT EXISTS risk_flags JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_retail_partners_code ON retail_partners(partner_code);
CREATE INDEX IF NOT EXISTS idx_retail_partners_account_manager ON retail_partners(account_manager_id);
CREATE INDEX IF NOT EXISTS idx_retail_partners_contract_status ON retail_partners(contract_status);

-- Partner Documents (License & Compliance)
CREATE TABLE IF NOT EXISTS partner_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    file_url TEXT,
    file_size INTEGER,
    mime_type TEXT,
    status TEXT DEFAULT 'pending',
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_documents_partner ON partner_documents(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_documents_type ON partner_documents(document_type);

-- Partner Support Tickets
CREATE TABLE IF NOT EXISTS partner_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    ticket_number TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    category TEXT,
    assigned_to UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_tickets_partner ON partner_tickets(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tickets_status ON partner_tickets(status);
CREATE INDEX IF NOT EXISTS idx_partner_tickets_number ON partner_tickets(ticket_number);

-- Partner Invoices
CREATE TABLE IF NOT EXISTS partner_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    order_id UUID REFERENCES orders(id),
    amount_cents BIGINT NOT NULL,
    tax_cents BIGINT DEFAULT 0,
    total_cents BIGINT NOT NULL,
    status TEXT DEFAULT 'pending',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_invoices_partner ON partner_invoices(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_invoices_status ON partner_invoices(status);
CREATE INDEX IF NOT EXISTS idx_partner_invoices_number ON partner_invoices(invoice_number);

-- Partner Deliveries (for GPS tracking)
CREATE TABLE IF NOT EXISTS partner_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES retail_partners(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    batch_number TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    vehicle_info TEXT,
    tracking_number TEXT,
    status TEXT DEFAULT 'pending',
    estimated_arrival TIMESTAMPTZ,
    actual_arrival TIMESTAMPTZ,
    current_location JSONB,
    route_history JSONB DEFAULT '[]'::jsonb,
    proof_of_delivery_url TEXT,
    signature_url TEXT,
    recipient_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_deliveries_partner ON partner_deliveries(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_deliveries_order ON partner_deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_partner_deliveries_status ON partner_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_partner_deliveries_tracking ON partner_deliveries(tracking_number);

-- ============================================
-- 3. DOCUSIGN INTEGRATION TABLES
-- ============================================

-- Extend partner_agreements table (created in 004)
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS envelope_id TEXT;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS envelope_status TEXT;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS declined_at TIMESTAMPTZ;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS decline_reason TEXT;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS voided_at TIMESTAMPTZ;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS void_reason TEXT;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS signer_email TEXT;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS signer_name TEXT;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE partner_agreements ADD COLUMN IF NOT EXISTS completed_document_url TEXT;

CREATE INDEX IF NOT EXISTS idx_partner_agreements_envelope ON partner_agreements(envelope_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreements_status ON partner_agreements(envelope_status);

-- DocuSign Webhook Events (for audit trail)
CREATE TABLE IF NOT EXISTS docusign_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    envelope_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_docusign_events_envelope ON docusign_events(envelope_id);
CREATE INDEX IF NOT EXISTS idx_docusign_events_processed ON docusign_events(processed);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE docusign_events ENABLE ROW LEVEL SECURITY;

-- Admin policies (service role bypasses RLS)
CREATE POLICY "Admins can manage user_sessions" ON user_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage user_2fa" ON user_2fa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage login_attempts" ON login_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage partner_documents" ON partner_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage partner_tickets" ON partner_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage partner_invoices" ON partner_invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage partner_deliveries" ON partner_deliveries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage docusign_events" ON docusign_events FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to generate unique partner code
CREATE OR REPLACE FUNCTION generate_partner_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        code := 'DW-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM retail_partners WHERE partner_code = code) INTO exists_check;
        EXIT WHEN NOT exists_check;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    num TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        num := 'TKT-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        SELECT EXISTS(SELECT 1 FROM partner_tickets WHERE ticket_number = num) INTO exists_check;
        EXIT WHEN NOT exists_check;
    END LOOP;
    RETURN num;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    num TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        num := 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM partner_invoices WHERE invoice_number = num) INTO exists_check;
        EXIT WHEN NOT exists_check;
    END LOOP;
    RETURN num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate partner code on insert
CREATE OR REPLACE FUNCTION set_partner_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.partner_code IS NULL THEN
        NEW.partner_code := generate_partner_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_partner_code ON retail_partners;
CREATE TRIGGER trigger_set_partner_code
    BEFORE INSERT ON retail_partners
    FOR EACH ROW
    EXECUTE FUNCTION set_partner_code();

-- Update existing partners without codes
UPDATE retail_partners 
SET partner_code = generate_partner_code() 
WHERE partner_code IS NULL;
