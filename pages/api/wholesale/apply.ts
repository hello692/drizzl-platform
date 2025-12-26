import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { getUncachableResendClient } from '../../../lib/resendClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      accountType,
      fullName,
      email,
      password,
      businessName,
      dba,
      businessType,
      address,
      city,
      state,
      zip,
      phone,
      taxId,
      numberOfLocations,
      yearsInBusiness,
      expectedVolume,
      website,
      referralSource,
    } = req.body;

    if (!fullName || !email || !businessName || !businessType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await (supabase
      .from('wholesale_applications' as any)
      .insert({
        account_type: accountType,
        full_name: fullName,
        email,
        business_name: businessName,
        dba: dba || null,
        business_type: businessType,
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        phone: phone || null,
        tax_id: taxId || null,
        number_of_locations: numberOfLocations || null,
        years_in_business: yearsInBusiness || null,
        expected_volume: expectedVolume || null,
        website: website || null,
        referral_source: referralSource || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single() as any);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save wholesale application' });
    }

    try {
      const { client, fromEmail } = await getUncachableResendClient();
      await client.emails.send({
        from: `Drizzl Wellness <${fromEmail}>`,
        to: [email],
        subject: 'Wholesale Application Received - Drizzl Wellness',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank you for applying, ${fullName}!</h2>
            <p>We've received your wholesale application for <strong>${businessName}</strong>.</p>
            <p>Our team will review your application and get back to you within 48 hours.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Application ID:</strong> ${data?.id || 'Pending'}</p>
              <p><strong>Business Type:</strong> ${businessType}</p>
              <p><strong>Expected Volume:</strong> ${expectedVolume || 'Not specified'}</p>
            </div>
            <p>Best regards,<br/>The Drizzl Wellness Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }

    res.status(200).json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error('Wholesale application error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit wholesale application' });
  }
}
