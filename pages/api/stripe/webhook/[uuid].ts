import type { NextApiRequest, NextApiResponse } from 'next';
import { getStripeSync } from '../../../../lib/stripeClient';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    const rawBody = await buffer(req);
    const sig = Array.isArray(signature) ? signature[0] : signature;
    const { uuid } = req.query;

    if (!uuid || typeof uuid !== 'string') {
      return res.status(400).json({ error: 'Missing webhook UUID' });
    }

    const stripeSync = await getStripeSync();
    await stripeSync.processWebhook(rawBody, sig, uuid);

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    res.status(400).json({ error: 'Webhook processing error' });
  }
}
