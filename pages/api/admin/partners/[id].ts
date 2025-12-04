import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { 
  sendApplicationApprovedNotification, 
  sendApplicationRejectedNotification 
} from '../../../../lib/notificationService';

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

      const { data: existingPartner } = await supabaseAdmin
        .from('retail_partners')
        .select('*, application_data')
        .eq('id', id)
        .single();

      if (!existingPartner) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      const updateData: Record<string, unknown> = {
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
        updated_at: new Date().toISOString(),
      };

      if (adminNotes) updateData.admin_notes = adminNotes;
      if (rejectionReason) updateData.rejection_reason = rejectionReason;
      if (status === 'approved') updateData.approved_at = new Date().toISOString();

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

      try {
        await supabaseAdmin
          .from('partner_application_logs')
          .insert([{
            partner_id: id,
            action: status,
            performed_by: adminId,
            notes: adminNotes || rejectionReason || `Status changed to ${status}`
          }]);
      } catch (logError) {
        console.log('Could not create log entry (table may not exist):', logError);
      }

      const appData = existingPartner.application_data || {};
      const contactEmail = existingPartner.email || appData.businessEmail || appData.decisionMakerEmail;
      const contactName = existingPartner.contact_name || appData.decisionMakerName || 'Partner';
      const companyName = existingPartner.company_name || appData.legalBusinessName || 'Your Business';

      if (status === 'approved') {
        await supabaseAdmin
          .from('profiles')
          .upsert({
            id: partner.user_id,
            role: 'partner',
            b2b_status: 'approved',
            account_type: 'b2b',
            email: contactEmail,
            full_name: contactName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        if (contactEmail) {
          try {
            await sendApplicationApprovedNotification({
              email: contactEmail,
              contactName,
              companyName,
            });
            console.log(`[Notification] Approval email sent to ${contactEmail}`);
          } catch (emailError) {
            console.error('[Notification] Failed to send approval email:', emailError);
          }
        }
      } else if (status === 'rejected') {
        await supabaseAdmin
          .from('profiles')
          .upsert({
            id: partner.user_id,
            role: 'customer',
            b2b_status: 'rejected',
            account_type: 'b2b',
            email: contactEmail,
            full_name: contactName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        if (contactEmail) {
          try {
            await sendApplicationRejectedNotification({
              email: contactEmail,
              contactName,
              companyName,
              reason: rejectionReason,
            });
            console.log(`[Notification] Rejection email sent to ${contactEmail}`);
          } catch (emailError) {
            console.error('[Notification] Failed to send rejection email:', emailError);
          }
        }
      } else if (status === 'suspended') {
        await supabaseAdmin
          .from('profiles')
          .update({ 
            role: 'customer',
            b2b_status: 'rejected',
            updated_at: new Date().toISOString(),
          })
          .eq('id', partner.user_id);
      }

      return res.status(200).json({ 
        success: true, 
        partner,
        notificationSent: !!contactEmail
      });

    } catch (error) {
      console.error('Error updating partner:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
