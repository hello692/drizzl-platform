import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { 
  sendApplicationApprovedNotification, 
  sendApplicationRejectedNotification 
} from '../../../../lib/notificationService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateProfileStatus(
  userId: string, 
  role: string, 
  b2bStatus: string,
  email?: string,
  fullName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          role,
          b2b_status: b2bStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('[Partner API] Profile update error:', updateError);
        if (updateError.message?.includes('b2b_status')) {
          const { error: fallbackError } = await supabaseAdmin
            .from('profiles')
            .update({
              role,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          
          if (fallbackError) {
            return { success: false, error: fallbackError.message };
          }
        } else {
          return { success: false, error: updateError.message };
        }
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          role,
          b2b_status: b2bStatus,
          email: email || '',
          full_name: fullName || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('[Partner API] Profile insert error:', insertError);
        if (insertError.message?.includes('b2b_status')) {
          const { error: fallbackError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: userId,
              role,
              email: email || '',
              full_name: fullName || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          
          if (fallbackError) {
            return { success: false, error: fallbackError.message };
          }
        } else {
          return { success: false, error: insertError.message };
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[Partner API] Profile operation failed:', error);
    return { success: false, error: String(error) };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseKey) {
    console.error('[Partner API] Missing Supabase key');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing partner ID' });
  }

  if (req.method === 'GET') {
    try {
      const { data: partner, error } = await supabaseAdmin
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
        .eq('id', id)
        .single();

      if (error || !partner) {
        console.error('[Partner API] Partner fetch error:', error);
        return res.status(404).json({ error: 'Partner not found' });
      }

      let logs: any[] = [];
      try {
        const { data: logsData } = await supabaseAdmin
          .from('partner_application_logs')
          .select('*')
          .eq('partner_id', id)
          .order('created_at', { ascending: false });
        logs = logsData || [];
      } catch (logError) {
        console.log('[Partner API] Could not fetch logs (table may not exist)');
      }

      return res.status(200).json({ partner, logs });

    } catch (error) {
      console.error('[Partner API] Error fetching partner:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status, adminNotes, adminId, rejectionReason } = req.body;

      if (!status || !adminId) {
        return res.status(400).json({ error: 'Missing required fields: status and adminId are required' });
      }

      if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const { data: existingPartner, error: fetchError } = await supabaseAdmin
        .from('retail_partners')
        .select('*, application_data')
        .eq('id', id)
        .single();

      if (fetchError || !existingPartner) {
        console.error('[Partner API] Partner not found:', fetchError);
        return res.status(404).json({ error: 'Partner not found' });
      }

      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
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
        console.error('[Partner API] Error updating retail_partners:', updateError);
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
        console.log(`[Partner API] Log entry created for partner ${id}`);
      } catch (logError) {
        console.log('[Partner API] Could not create log entry (table may not exist):', logError);
      }

      const appData = existingPartner.application_data || {};
      const contactEmail = existingPartner.email || appData.businessEmail || appData.decisionMakerEmail;
      const contactName = existingPartner.contact_name || appData.decisionMakerName || 'Partner';
      const companyName = existingPartner.company_name || appData.legalBusinessName || 'Your Business';

      let profileUpdateResult = { success: true, error: undefined as string | undefined };
      let notificationSent = false;

      if (status === 'approved' && partner.user_id) {
        profileUpdateResult = await updateProfileStatus(
          partner.user_id,
          'partner',
          'approved',
          contactEmail,
          contactName
        );

        if (!profileUpdateResult.success) {
          console.error('[Partner API] Profile update failed:', profileUpdateResult.error);
        }

        if (contactEmail) {
          try {
            await sendApplicationApprovedNotification({
              email: contactEmail,
              contactName,
              companyName,
            });
            notificationSent = true;
            console.log(`[Partner API] Approval email sent to ${contactEmail}`);
          } catch (emailError) {
            console.error('[Partner API] Failed to send approval email:', emailError);
          }
        }
      } else if (status === 'rejected' && partner.user_id) {
        profileUpdateResult = await updateProfileStatus(
          partner.user_id,
          'customer',
          'rejected',
          contactEmail,
          contactName
        );

        if (!profileUpdateResult.success) {
          console.error('[Partner API] Profile update failed:', profileUpdateResult.error);
        }

        if (contactEmail) {
          try {
            await sendApplicationRejectedNotification({
              email: contactEmail,
              contactName,
              companyName,
              reason: rejectionReason,
            });
            notificationSent = true;
            console.log(`[Partner API] Rejection email sent to ${contactEmail}`);
          } catch (emailError) {
            console.error('[Partner API] Failed to send rejection email:', emailError);
          }
        }
      } else if (status === 'suspended' && partner.user_id) {
        profileUpdateResult = await updateProfileStatus(
          partner.user_id,
          'customer',
          'rejected'
        );

        if (!profileUpdateResult.success) {
          console.error('[Partner API] Profile update failed:', profileUpdateResult.error);
        }
      }

      return res.status(200).json({ 
        success: true, 
        partner,
        notificationSent,
        profileUpdated: profileUpdateResult.success,
        profileError: profileUpdateResult.error
      });

    } catch (error) {
      console.error('[Partner API] Error updating partner:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
