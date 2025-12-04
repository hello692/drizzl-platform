import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  if (!supabaseAdmin) {
    console.error('[Products API] Supabase not configured - missing service role key');
    return res.status(200).json({ 
      products: [], 
      message: 'Database not configured. Please add SUPABASE_SERVICE_ROLE_KEY.',
      error: 'configuration_error'
    });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Products API] Database error:', error);
        if (error.code === '42P01') {
          return res.status(200).json({ 
            products: [], 
            message: 'Products table not found. Run database migrations.',
            error: 'table_not_found'
          });
        }
        return res.status(200).json({ 
          products: [], 
          message: 'Database query failed',
          error: error.message
        });
      }

      return res.status(200).json({ products: data || [] });
    } catch (error: any) {
      console.error('[Products API] Error fetching products:', error);
      return res.status(200).json({ 
        products: [], 
        message: 'Could not load products',
        error: error?.message || 'unknown_error'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const productData = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ error: 'Failed to create product' });
      }

      return res.status(201).json({ product: data });
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing product ID' });
    }

    try {
      const updates = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Failed to update product' });
      }

      return res.status(200).json({ product: data });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing product ID' });
    }

    try {
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
