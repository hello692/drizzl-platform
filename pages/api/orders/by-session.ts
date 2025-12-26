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
    const stripe = await getUncachableStripeClient();
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items'],
    });
    
    if (stripeSession.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    
    const sessionEmail = stripeSession.customer_email || stripeSession.customer_details?.email;
    if (!sessionEmail) {
      return res.status(400).json({ error: 'Session has no associated email' });
    }

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
          qty,
          quantity,
          unit_price_cents
        )
      `)
      .eq('stripe_session_id', session_id)
      .single();

    if (error || !order) {
      return res.status(200).json({
        id: null,
        stripe_session_id: stripeSession.id,
        email: sessionEmail,
        amount_total: stripeSession.amount_total,
        currency: stripeSession.currency,
        status: 'paid',
        items: stripeSession.line_items?.data.map((item: any) => ({
          name: item.description,
          price_cents: item.amount_total,
          qty: item.quantity,
        })) || [],
        pending_webhook: true,
      });
    }

    const normalizedItems = (order.order_items || []).map((item: any) => ({
      id: item.id,
      name: item.name || 'Product',
      price_cents: item.price_cents || item.unit_price_cents || 0,
      qty: item.qty || item.quantity || 1,
    }));

    res.status(200).json({
      ...order,
      items: normalizedItems,
      pending_webhook: false,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}
