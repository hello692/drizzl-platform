import { supabase } from '../supabase';
import type { Product } from '../../types/database';

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error || !data) return [];
  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('name');
  
  if (error || !data) return [];
  return data;
}

export async function getSubscriptionEligibleProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_subscription_eligible', true)
    .order('name');
  
  if (error || !data) return [];
  return data;
}

export async function getLowStockProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);
  
  if (error || !data) return [];
  return (data as Product[]).filter(p => p.stock_quantity <= p.low_stock_threshold);
}

export async function updateProductStock(productId: string, quantity: number): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({ stock_quantity: quantity } as Partial<Product>)
    .eq('id', productId);
  
  return !error;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getB2BPrice(product: Product, tier: 'bronze' | 'silver' | 'gold' | 'platinum'): number {
  switch (tier) {
    case 'platinum':
    case 'gold':
      return product.price_b2b_tier3_cents || product.wholesale_price_cents || product.price_cents;
    case 'silver':
      return product.price_b2b_tier2_cents || product.wholesale_price_cents || product.price_cents;
    default:
      return product.price_b2b_tier1_cents || product.wholesale_price_cents || product.price_cents;
  }
}
