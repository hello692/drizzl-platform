import type { NextApiRequest, NextApiResponse } from 'next';
import { getUncachableResendClient } from '../../../lib/resendClient';
import { welcomeEmail } from '../../../lib/emailTemplates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, customerName } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Missing email address' });
    }

    const { client, fromEmail } = await getUncachableResendClient();
    const emailContent = welcomeEmail({ customerName: customerName || 'there' });

    const { data, error } = await client.emails.send({
      from: `Drizzl Wellness <${fromEmail}>`,
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ success: true, messageId: data?.id });
  } catch (error: any) {
    console.error('Email send error:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
