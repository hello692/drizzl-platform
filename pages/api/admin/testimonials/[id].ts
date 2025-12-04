import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      updates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
