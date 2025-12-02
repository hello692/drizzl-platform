import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, applicationData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required. Please log in first.' });
    }
    
    if (!applicationData) {
      return res.status(400).json({ error: 'Application data is required.' });
    }

    if (!applicationData.legalBusinessName) {
      return res.status(400).json({ error: 'Business name is required.' });
    }

    const { data: existingApp } = await supabaseAdmin
      .from('retail_partners')
      .select('id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingApp) {
      return res.status(400).json({ 
        error: `You already have a ${existingApp.status} application.`,
        existingId: existingApp.id,
        status: existingApp.status
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

    const insertAttempts = [
      {
        name: 'full_with_jsonb',
        data: {
          user_id: userId,
          company_name: applicationData.legalBusinessName || 'Unnamed Business',
          contact_name: applicationData.decisionMakerName || null,
          email: applicationData.businessEmail || null,
          phone: applicationData.businessPhone || null,
          status: 'pending',
          application_data: fullApplicationData,
        }
      },
      {
        name: 'basic_columns',
        data: {
          user_id: userId,
          company_name: applicationData.legalBusinessName || 'Unnamed Business',
          contact_name: applicationData.decisionMakerName || null,
          email: applicationData.businessEmail || null,
          phone: applicationData.businessPhone || null,
          status: 'pending',
        }
      },
      {
        name: 'store_name_variant',
        data: {
          user_id: userId,
          store_name: applicationData.legalBusinessName || 'Unnamed Business',
          contact_name: applicationData.decisionMakerName || null,
          contact_email: applicationData.businessEmail || null,
          phone: applicationData.businessPhone || null,
          status: 'pending',
        }
      },
      {
        name: 'minimal',
        data: {
          user_id: userId,
          status: 'pending',
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
      
      if (lastError?.code === '42P01') {
        return res.status(500).json({ 
          error: 'Database table not found. Please contact support.',
          details: 'The retail_partners table needs to be created.'
        });
      }
      
      if (lastError?.code === '23505') {
        return res.status(400).json({ 
          error: 'You already have an existing application.',
        });
      }
      
      return res.status(500).json({ 
        error: 'Unable to save application. Please try again.',
        details: lastError?.message || 'Unknown database error'
      });
    }

    try {
      await supabaseAdmin.from('profiles').update({ role: 'partner' }).eq('id', userId);
    } catch (e) {
      console.log('Could not update user role - profiles table may not exist');
    }

    return res.status(200).json({ 
      success: true, 
      partnerId: successfulInsert.id,
      status: 'pending',
      message: 'Your application has been submitted successfully!'
    });

  } catch (error) {
    console.error('Partner application error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
