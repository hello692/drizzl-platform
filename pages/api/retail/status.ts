import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const { data: partner, error } = await supabaseAdmin
      .from('retail_partners')
      .select('id, status, legal_business_name, reviewed_at, rejection_reason')
      .eq('user_id', userId)
      .single();

    if (error || !partner) {
      return res.status(200).json({ 
        hasApplication: false,
        status: null
      });
    }

    return res.status(200).json({
      hasApplication: true,
      partnerId: partner.id,
      status: partner.status,
      businessName: partner.legal_business_name,
      reviewedAt: partner.reviewed_at,
      rejectionReason: partner.rejection_reason
    });

  } catch (error) {
    console.error('Partner status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
