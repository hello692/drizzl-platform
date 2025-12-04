-- Migration: Create experts and testimonials tables for Content Manager
-- This migration adds tables for managing expert endorsements and customer testimonials

CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credentials TEXT,
  photo_url TEXT,
  product TEXT,
  position INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo_url TEXT,
  video_url TEXT,
  product TEXT,
  position INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_experts_position ON experts(position);
CREATE INDEX IF NOT EXISTS idx_experts_is_active ON experts(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_position ON testimonials(position);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);

-- Seed sample data for experts
INSERT INTO experts (name, credentials, photo_url, product, position, is_active)
VALUES 
  ('Dr. Sarah Chen', 'Ph.D. Nutritional Science, Harvard Medical School', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', 'Smoothies', 1, true),
  ('Dr. Michael Torres', 'M.D., Sports Medicine Specialist', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', 'Protein Bowls', 2, true),
  ('Dr. Emily Watson', 'R.D., Certified Dietitian', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', 'Wellness Products', 3, true)
ON CONFLICT DO NOTHING;

-- Seed sample data for testimonials
INSERT INTO testimonials (name, photo_url, video_url, product, position, is_active)
VALUES 
  ('Jessica M.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', '', 'Strawberry Peach Smoothie', 1, true),
  ('Marcus T.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', '', 'Mint Cacao Bowl', 2, true),
  ('Amanda K.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', '', 'High Protein Pack', 3, true)
ON CONFLICT DO NOTHING;
