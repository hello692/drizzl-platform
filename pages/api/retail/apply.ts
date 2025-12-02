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

    const { data: existingApp, error: checkError } = await supabaseAdmin
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

    const insertData = {
      user_id: userId,
      company_name: applicationData.legalBusinessName || 'Unnamed Business',
      contact_name: applicationData.decisionMakerName || null,
      email: applicationData.businessEmail || null,
      phone: applicationData.businessPhone || null,
      status: 'pending',
      application_data: fullApplicationData,
    };

    const { data: partner, error: insertError } = await supabaseAdmin
      .from('retail_partners')
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      if (insertError.code === '42P01') {
        return res.status(500).json({ 
          error: 'Database table not found. Please run the migration.',
          suggestion: 'Run the SQL from /database/retail-partners-migration.sql in Supabase SQL Editor.',
          details: insertError.message
        });
      }
      
      if (insertError.code === '23505') {
        return res.status(400).json({ 
          error: 'You already have an existing application.',
          details: 'Duplicate application detected.'
        });
      }
      
      return res.status(500).json({ 
        error: 'Unable to save application. Please try again.',
        details: insertError.message
      });
    }

    if (!partner) {
      return res.status(500).json({ error: 'Application saved but no confirmation received.' });
    }

    try {
      await supabaseAdmin.from('profiles').update({ role: 'partner' }).eq('id', userId);
    } catch (e) {
      console.log('Could not update user role - profiles table may not exist');
    }

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
