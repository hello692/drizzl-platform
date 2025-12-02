-- Retail Partners Table Migration for Drizzl Wellness
-- Run this SQL in your Supabase SQL Editor to update the retail_partners table

-- First, drop the existing table if it exists (be careful - this removes existing data)
-- Uncomment the line below ONLY if you want to start fresh:
-- DROP TABLE IF EXISTS retail_partners CASCADE;

-- Create or update retail_partners table
CREATE TABLE IF NOT EXISTS retail_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core Fields
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  rejection_reason TEXT,
  
  -- Store all application data as JSON for flexibility
  application_data JSONB DEFAULT '{}',
  
  -- Admin notes
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'retail_partners' AND column_name = 'application_data') THEN
    ALTER TABLE retail_partners ADD COLUMN application_data JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'retail_partners' AND column_name = 'status') THEN
    ALTER TABLE retail_partners ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'retail_partners' AND column_name = 'reviewed_at') THEN
    ALTER TABLE retail_partners ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'retail_partners' AND column_name = 'reviewed_by') THEN
    ALTER TABLE retail_partners ADD COLUMN reviewed_by UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'retail_partners' AND column_name = 'rejection_reason') THEN
    ALTER TABLE retail_partners ADD COLUMN rejection_reason TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'retail_partners' AND column_name = 'admin_notes') THEN
    ALTER TABLE retail_partners ADD COLUMN admin_notes TEXT;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_retail_partners_user ON retail_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_retail_partners_status ON retail_partners(status);
CREATE INDEX IF NOT EXISTS idx_retail_partners_created ON retail_partners(created_at);

-- Enable Row Level Security
ALTER TABLE retail_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Partners can view own data" ON retail_partners;
CREATE POLICY "Partners can view own data" ON retail_partners FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create partner application" ON retail_partners;
CREATE POLICY "Users can create partner application" ON retail_partners FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage partners" ON retail_partners;
CREATE POLICY "Admins can manage partners" ON retail_partners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_retail_partners_updated_at ON retail_partners;
CREATE TRIGGER update_retail_partners_updated_at 
  BEFORE UPDATE ON retail_partners 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for certificates (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true)
-- ON CONFLICT DO NOTHING;

-- Storage policy for certificates bucket
-- CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');

-- CREATE POLICY "Allow public read" ON storage.objects FOR SELECT
-- USING (bucket_id = 'certificates');
