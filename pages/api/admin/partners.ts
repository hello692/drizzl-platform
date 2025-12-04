import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseServiceKey) {
    console.error('[Partners API] Missing SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ error: 'Server configuration error', partners: [] });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('retail_partners')
        .select(`
          *,
          profile:profiles(
            id,
            email,
            full_name,
            name,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Partners API] Supabase error:', error);
        
        if (error.code === '42P01') {
          return res.status(200).json({ 
            partners: [], 
            message: 'Partners table not found. Please run database migrations.' 
          });
        }
        
        if (error.code === 'PGRST200' || error.message?.includes('relationship')) {
          console.log('[Partners API] Join failed, falling back to simple query');
          const { data: fallbackData, error: fallbackError } = await supabaseAdmin
            .from('retail_partners')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (fallbackError) {
            throw fallbackError;
          }
          
          return res.status(200).json({ partners: fallbackData || [] });
        }
        
        throw error;
      }

      const partners = (data || []).map(partner => ({
        ...partner,
        profile_email: partner.profile?.email || null,
        profile_name: partner.profile?.full_name || partner.profile?.name || null,
        profile_role: partner.profile?.role || null,
      }));

      return res.status(200).json({ partners });
    } catch (error) {
      console.error('[Partners API] Error fetching partners:', error);
      return res.status(200).json({ 
        partners: [], 
        message: 'Could not load partners. Check server logs for details.' 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
