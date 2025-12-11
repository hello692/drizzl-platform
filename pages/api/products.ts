import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase) {
    console.error('[Products API] Supabase not configured');
    return res.status(200).json({ 
      products: [], 
      error: 'Database not configured'
    });
  }

  try {
    const { category, search, sort } = req.query;

    let query = supabase
      .from('products')
      .select('id, name, slug, description, category, price_cents, hero_image_url, is_active')
      .eq('is_active', true);

    if (category && category !== 'All' && typeof category === 'string') {
      query = query.eq('category', category);
    }

    if (search && typeof search === 'string') {
      query = query.ilike('name', `%${search}%`);
    }

    if (sort && typeof sort === 'string') {
      switch (sort) {
        case 'price_asc':
          query = query.order('price_cents', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price_cents', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Products API] Database error:', error);
      if (error.code === '42P01') {
        return res.status(200).json({ 
          products: [], 
          error: 'Products table not found'
        });
      }
      return res.status(200).json({ 
        products: [], 
        error: error.message
      });
    }

    const products = (data || []).map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: product.price_cents / 100,
      image: product.hero_image_url || '/products/acai/gallery-1.jpg'
    }));

    return res.status(200).json({ products });
  } catch (error: any) {
    console.error('[Products API] Error:', error);
    return res.status(200).json({ 
      products: [], 
      error: error?.message || 'Unknown error'
    });
  }
}
