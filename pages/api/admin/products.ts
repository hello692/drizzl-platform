import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          return res.status(200).json({ products: [], message: 'Products table not found' });
        }
        throw error;
      }

      return res.status(200).json({ products: data || [] });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(200).json({ products: [], message: 'Could not load products' });
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
