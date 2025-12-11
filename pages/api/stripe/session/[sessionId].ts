import type { NextApiRequest, NextApiResponse } from 'next';
import { getUncachableStripeClient } from '../../../../lib/stripeClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Missing session ID' });
  }

  try {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });

    res.status(200).json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email || (session.customer as any)?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
      lineItems: session.line_items?.data,
    });
  } catch (error: any) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch checkout session' });
  }
}
