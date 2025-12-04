import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, credentials, photo_url, product } = req.body;
      
      const { data: maxPos } = await supabase
        .from('experts')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
        .single();
      
      const newPosition = (maxPos?.position || 0) + 1;
      
      const { data, error } = await supabase
        .from('experts')
        .insert({ name, credentials, photo_url, product, position: newPosition })
        .select()
        .single();
      
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { order } = req.body;
      
      if (order && Array.isArray(order)) {
        for (let i = 0; i < order.length; i++) {
          await supabase
            .from('experts')
            .update({ position: i + 1, updated_at: new Date().toISOString() })
            .eq('id', order[i]);
        }
        return res.status(200).json({ success: true });
      }
      
      return res.status(400).json({ success: false, error: 'Invalid request' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
