-- Retail Partners Table for B2B Portal
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS retail_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  application_data JSONB,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  notes TEXT,
  discount_tier TEXT DEFAULT 'standard',
  credit_limit DECIMAL(10,2) DEFAULT 0,
  payment_terms TEXT DEFAULT 'net30',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_retail_partners_user_id ON retail_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_retail_partners_status ON retail_partners(status);

-- Enable Row Level Security
ALTER TABLE retail_partners ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own applications
CREATE POLICY "Users can view own applications" ON retail_partners
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own applications
CREATE POLICY "Users can insert own applications" ON retail_partners
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can do anything (for admin operations)
CREATE POLICY "Service role full access" ON retail_partners
  FOR ALL USING (auth.role() = 'service_role');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_retail_partners_updated_at ON retail_partners;
CREATE TRIGGER update_retail_partners_updated_at
  BEFORE UPDATE ON retail_partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Profiles table for user roles (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'partner', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
