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

    const fullApplicationData = {
      legalBusinessName: applicationData.legalBusinessName,
      dbaStoreName: applicationData.dbaStoreName,
      businessAddress: applicationData.businessAddress,
      city: applicationData.city,
      state: applicationData.state,
      zip: applicationData.zip,
      country: applicationData.country || 'USA',
      businessPhone: applicationData.businessPhone,
      businessEmail: applicationData.businessEmail,
      website: applicationData.website,
      einTaxId: applicationData.einTaxId,
      resaleCertificateUrl: applicationData.resaleCertificateUrl,
      businessType: applicationData.businessType,
      yearsInBusiness: applicationData.yearsInBusiness,
      decisionMakerName: applicationData.decisionMakerName,
      decisionMakerRole: applicationData.decisionMakerRole,
      decisionMakerEmail: applicationData.decisionMakerEmail,
      decisionMakerPhone: applicationData.decisionMakerPhone,
      estimatedMonthlyVolume: applicationData.estimatedMonthlyVolume,
      preferredDeliverySchedule: applicationData.preferredDeliverySchedule,
      receivingHours: applicationData.receivingHours,
      hasLoadingDock: applicationData.hasLoadingDock,
      preferredPaymentMethod: applicationData.preferredPaymentMethod,
      agreedToTerms: applicationData.agreedToTerms,
      submittedAt: new Date().toISOString(),
    };

    const minimalData: Record<string, any> = {
      user_id: userId,
      status: 'pending',
    };

    const { data: partner, error: insertError } = await supabaseAdmin
      .from('retail_partners')
      .insert([minimalData])
      .select()
      .single();

    if (insertError) {
      console.error('Minimal insert failed:', insertError);
      
      const extendedData: Record<string, any> = {
        user_id: userId,
        status: 'pending',
        company_name: applicationData.legalBusinessName,
        contact_name: applicationData.decisionMakerName,
        email: applicationData.businessEmail,
        phone: applicationData.businessPhone,
        application_data: fullApplicationData,
      };

      const { data: partner2, error: extendedError } = await supabaseAdmin
        .from('retail_partners')
        .insert([extendedData])
        .select()
        .single();

      if (extendedError) {
        console.error('Extended insert also failed:', extendedError);
        
        const fullSchemaData: Record<string, any> = {
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
        };

        const { data: partner3, error: fullError } = await supabaseAdmin
          .from('retail_partners')
          .insert([fullSchemaData])
          .select()
          .single();

        if (fullError) {
          console.error('Full schema insert failed:', fullError);
          return res.status(500).json({ 
            error: 'Database needs to be set up. Please run the migration SQL in Supabase.',
            details: fullError.message
          });
        }

        try {
          await supabaseAdmin.from('profiles').update({ role: 'partner' }).eq('id', userId);
        } catch (e) {}

        return res.status(200).json({ success: true, partnerId: partner3.id, status: 'pending' });
      }

      try {
        await supabaseAdmin.from('profiles').update({ role: 'partner' }).eq('id', userId);
      } catch (e) {}

      return res.status(200).json({ success: true, partnerId: partner2.id, status: 'pending' });
    }

    try {
      await supabaseAdmin
        .from('retail_partners')
        .update({ application_data: fullApplicationData })
        .eq('id', partner.id);
    } catch (updateError) {
      console.log('Could not update application_data, column may not exist');
    }

    try {
      await supabaseAdmin.from('profiles').update({ role: 'partner' }).eq('id', userId);
    } catch (e) {}

    return res.status(200).json({ 
      success: true, 
      partnerId: partner.id,
      status: 'pending'
    });

  } catch (error) {
    console.error('Partner application error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
