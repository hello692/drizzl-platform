import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function tryCreateTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS retail_partners (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      status TEXT DEFAULT 'pending',
      company_name TEXT,
      contact_email TEXT,
      application_data JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  try {
    await supabaseAdmin.rpc('exec_sql', { sql: createTableSQL });
    return true;
  } catch (e) {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, applicationData } = req.body;

    if (!userId || !applicationData) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    const insertAttempts = [
      {
        name: 'simple',
        data: {
          user_id: userId,
          status: 'pending',
          company_name: applicationData.legalBusinessName,
          contact_email: applicationData.businessEmail,
          application_data: fullApplicationData,
        }
      },
      {
        name: 'extended',
        data: {
          user_id: userId,
          status: 'pending',
          legal_business_name: applicationData.legalBusinessName,
          business_email: applicationData.businessEmail,
          application_data: fullApplicationData,
        }
      },
      {
        name: 'full',
        data: {
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
        }
      },
      {
        name: 'minimal',
        data: {
          user_id: userId,
        }
      }
    ];

    let successfulInsert = null;
    let lastError = null;

    for (const attempt of insertAttempts) {
      try {
        const { data: partner, error } = await supabaseAdmin
          .from('retail_partners')
          .insert([attempt.data])
          .select()
          .single();

        if (!error && partner) {
          console.log(`Insert succeeded with ${attempt.name} schema`);
          successfulInsert = partner;
          break;
        }
        
        if (error) {
          console.log(`${attempt.name} insert failed:`, error.message);
          lastError = error;
        }
      } catch (e) {
        console.log(`${attempt.name} insert threw:`, e);
        lastError = e;
      }
    }

    if (!successfulInsert) {
      console.error('All insert attempts failed. Last error:', lastError);
      return res.status(500).json({ 
        error: 'Unable to save application. The database table may need to be created.',
        suggestion: 'Please run the migration SQL from /database/retail-partners-migration.sql in your Supabase SQL Editor.',
        details: lastError?.message || 'Unknown error'
      });
    }

    try {
      await supabaseAdmin.from('profiles').update({ role: 'partner' }).eq('id', userId);
    } catch (e) {
      console.log('Could not update user role, profiles table may not exist');
    }

    return res.status(200).json({ 
      success: true, 
      partnerId: successfulInsert.id,
      status: 'pending'
    });

  } catch (error) {
    console.error('Partner application error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
