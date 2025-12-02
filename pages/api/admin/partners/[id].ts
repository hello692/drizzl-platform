import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing partner ID' });
  }

  if (req.method === 'GET') {
    try {
      const { data: partner, error } = await supabaseAdmin
        .from('retail_partners')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !partner) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      const { data: logs } = await supabaseAdmin
        .from('partner_application_logs')
        .select('*')
        .eq('partner_id', id)
        .order('created_at', { ascending: false });

      return res.status(200).json({ partner, logs: logs || [] });

    } catch (error) {
      console.error('Error fetching partner:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status, adminNotes, adminId, rejectionReason } = req.body;

      if (!status || !adminId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updateData: any = {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
      };

      if (adminNotes) updateData.admin_notes = adminNotes;
      if (rejectionReason) updateData.rejection_reason = rejectionReason;

      const { data: partner, error: updateError } = await supabaseAdmin
        .from('retail_partners')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating partner:', updateError);
        return res.status(500).json({ error: 'Failed to update partner status' });
      }

      await supabaseAdmin
        .from('partner_application_logs')
        .insert([{
          partner_id: id,
          action: status,
          performed_by: adminId,
          notes: adminNotes || rejectionReason || `Status changed to ${status}`
        }]);

      if (status === 'approved') {
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'partner' })
          .eq('id', partner.user_id);
      } else if (status === 'rejected' || status === 'suspended') {
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'customer' })
          .eq('id', partner.user_id);
      }

      return res.status(200).json({ success: true, partner });

    } catch (error) {
      console.error('Error updating partner:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
