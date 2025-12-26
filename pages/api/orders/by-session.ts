import type { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '../../../lib/supabase';
import { getUncachableStripeClient } from '../../../lib/stripeClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const supabase = getServiceSupabase();

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        stripe_session_id,
        email,
        amount_total,
        currency,
        status,
        shipping_name,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        created_at,
        order_items (
          id,
          product_id,
          name,
          price_cents,
          qty
        )
      `)
      .eq('stripe_session_id', session_id)
      .single();

    if (error || !order) {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items'],
      });

      return res.status(200).json({
        id: null,
        stripe_session_id: session.id,
        email: session.customer_email || session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        status: session.payment_status === 'paid' ? 'paid' : 'pending',
        items: session.line_items?.data.map((item: any) => ({
          name: item.description,
          price_cents: item.amount_total,
          qty: item.quantity,
        })) || [],
        pending_webhook: true,
      });
    }

    res.status(200).json({
      ...order,
      items: order.order_items,
      pending_webhook: false,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}
