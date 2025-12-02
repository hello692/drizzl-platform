import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'customer' | 'partner' | 'admin';
export type OrderType = 'd2c' | 'b2b';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price_cents: number;
  wholesale_price_cents: number;
  hero_image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_type: OrderType;
  status: OrderStatus;
  total_cents: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  profile?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  product?: Product;
}

export interface RetailPartner {
  id: string;
  user_id: string;
  company_name?: string;
  store_name?: string;
  contact_name?: string;
  contact_email?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status?: string;
  application_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  metadata: Record<string, any>;
  created_at: string;
}
