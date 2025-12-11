import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('experts')
        .select('id, name, credentials, photo_url, product, position, is_active, created_at, updated_at')
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching experts:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Error fetching experts:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, credentials, photo_url, product } = req.body;

      const { data: maxPosData } = await supabaseAdmin
        .from('experts')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
        .single();

      const nextPosition = (maxPosData?.position || 0) + 1;

      const { data, error } = await supabaseAdmin
        .from('experts')
        .insert({
          name: name || '',
          credentials: credentials || '',
          photo_url: photo_url || '',
          product: product || '',
          position: nextPosition,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating expert:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Error creating expert:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { order } = req.body;

      if (order && Array.isArray(order)) {
        for (let i = 0; i < order.length; i++) {
          const { error } = await supabaseAdmin
            .from('experts')
            .update({ position: i + 1, updated_at: new Date().toISOString() })
            .eq('id', order[i]);

          if (error) {
            console.error('Error updating expert order:', error);
            return res.status(500).json({ success: false, error: error.message });
          }
        }
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ success: false, error: 'Invalid request' });
    } catch (error: any) {
      console.error('Error updating expert order:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
