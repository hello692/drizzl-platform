import type { NextApiRequest, NextApiResponse } from 'next';
import { getStripePublishableKey } from '../../../lib/stripeClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const publishableKey = await getStripePublishableKey();
    res.status(200).json({ publishableKey });
  } catch (error: any) {
    console.error('Error fetching publishable key:', error);
    res.status(500).json({ error: 'Failed to fetch Stripe publishable key' });
  }
}
