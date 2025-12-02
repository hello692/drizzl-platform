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
        .from('retail_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          return res.status(200).json({ partners: [], message: 'Partners table not found' });
        }
        throw error;
      }

      return res.status(200).json({ partners: data || [] });
    } catch (error) {
      console.error('Error fetching partners:', error);
      return res.status(200).json({ partners: [], message: 'Could not load partners' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
