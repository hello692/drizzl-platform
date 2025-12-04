import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { applicationData, accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Authentication required. Please log in first.' });
    }

    if (!applicationData) {
      return res.status(400).json({ error: 'Application data is required.' });
    }

    if (!applicationData.legalBusinessName) {
      return res.status(400).json({ error: 'Business name is required.' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });

    const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !userData?.user) {
      console.error('Auth verification failed:', authError);
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    const userId = userData.user.id;

    const { data: existingApp, error: checkError } = await supabase
      .from('retail_partners')
      .select('id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing application:', checkError);
    }

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

    const insertData = {
      user_id: userId,
      company_name: applicationData.legalBusinessName || 'Unnamed Business',
      contact_name: applicationData.decisionMakerName || null,
      email: applicationData.businessEmail || null,
      phone: applicationData.businessPhone || null,
      status: 'pending',
      application_data: fullApplicationData,
    };

    console.log('Attempting to insert retail partner application:', { userId, company: insertData.company_name });

    const { data: partner, error: insertError } = await supabase
      .from('retail_partners')
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      if (insertError.code === '42P01') {
        return res.status(500).json({ 
          error: 'Database table not found. Please contact support.',
          details: 'The retail_partners table needs to be created.'
        });
      }
      
      if (insertError.code === '23505') {
        return res.status(400).json({ 
          error: 'You already have an existing application.',
        });
      }

      if (insertError.code === '42501') {
        return res.status(500).json({ 
          error: 'Permission denied. Please contact support.',
          details: 'Database security policy is blocking the request.'
        });
      }
      
      return res.status(500).json({ 
        error: 'Unable to save application. Please try again.',
        details: insertError.message
      });
    }

    try {
      await supabase.from('profiles').update({ role: 'partner' }).eq('id', userId);
    } catch (e) {
      console.log('Could not update user role - profiles table may not exist or missing permissions');
    }

    console.log('Application saved successfully:', partner?.id);

    return res.status(200).json({ 
      success: true, 
      partnerId: partner.id,
      status: 'pending',
      message: 'Your application has been submitted successfully!'
    });

  } catch (error) {
    console.error('Partner application error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
