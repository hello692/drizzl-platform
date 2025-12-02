import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, applicationData } = req.body;

    if (!userId || !applicationData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: existingPartner } = await supabaseAdmin
      .from('retail_partners')
      .select('id, status')
      .eq('user_id', userId)
      .single();

    if (existingPartner) {
      return res.status(400).json({ 
        error: 'Application already exists',
        status: existingPartner.status
      });
    }

    const { data: partner, error: insertError } = await supabaseAdmin
      .from('retail_partners')
      .insert([{
        user_id: userId,
        status: 'pending',
        legal_business_name: applicationData.legalBusinessName,
        dba_store_name: applicationData.dbaStoreName,
        business_address: applicationData.businessAddress,
        city: applicationData.city,
        state: applicationData.state,
        zip: applicationData.zip,
        country: applicationData.country || 'USA',
        business_phone: applicationData.businessPhone,
        business_email: applicationData.businessEmail,
        website: applicationData.website,
        ein_tax_id: applicationData.einTaxId,
        resale_certificate_url: applicationData.resaleCertificateUrl,
        business_type: applicationData.businessType,
        years_in_business: applicationData.yearsInBusiness ? parseInt(applicationData.yearsInBusiness) : null,
        decision_maker_name: applicationData.decisionMakerName,
        decision_maker_role: applicationData.decisionMakerRole,
        decision_maker_email: applicationData.decisionMakerEmail,
        decision_maker_phone: applicationData.decisionMakerPhone,
        estimated_monthly_volume: applicationData.estimatedMonthlyVolume,
        preferred_delivery_schedule: applicationData.preferredDeliverySchedule,
        receiving_hours: applicationData.receivingHours,
        has_loading_dock: applicationData.hasLoadingDock === 'yes',
        preferred_payment_method: applicationData.preferredPaymentMethod,
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating partner application:', insertError);
      return res.status(500).json({ error: 'Failed to submit application' });
    }

    await supabaseAdmin
      .from('profiles')
      .update({ role: 'partner' })
      .eq('id', userId);

    await supabaseAdmin
      .from('partner_application_logs')
      .insert([{
        partner_id: partner.id,
        action: 'submitted',
        performed_by: userId,
        notes: 'Application submitted via wholesale portal'
      }]);

    return res.status(200).json({ 
      success: true, 
      partnerId: partner.id,
      status: 'pending'
    });

  } catch (error) {
    console.error('Partner application error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
