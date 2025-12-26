import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { getUncachableResendClient } from '../../lib/resendClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await (supabase
      .from('contact_submissions' as any)
      .insert({
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
      })
      .select()
      .single() as any);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save contact submission' });
    }

    try {
      const { client, fromEmail } = await getUncachableResendClient();
      await client.emails.send({
        from: `Drizzl Wellness <${fromEmail}>`,
        to: [email],
        subject: 'Thank you for contacting Drizzl Wellness',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank you for reaching out, ${name}!</h2>
            <p>We've received your message and will get back to you within 24-48 hours.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Your message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
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
    console.error('Contact submission error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit contact form' });
  }
}
