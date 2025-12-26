import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { getUncachableStripeClient, getStripeSecretKey } from '../../../lib/stripeClient';
import { getServiceSupabase } from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface OrderItem {
  productId: string;
  name: string;
  priceCents: number;
  qty: number;
}

async function getWebhookSecret(): Promise<string> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken || !hostname) {
    const fallbackSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (fallbackSecret) return fallbackSecret;
    throw new Error('Webhook secret not found');
  }

  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  const targetEnvironment = isProduction ? 'production' : 'development';

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', 'stripe');
  url.searchParams.set('environment', targetEnvironment);

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X_REPLIT_TOKEN': xReplitToken
    }
  });

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings?.settings?.webhookSecret) {
    const fallbackSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (fallbackSecret) return fallbackSecret;
    throw new Error('Webhook secret not found in connection settings');
  }

  return connectionSettings.settings.webhookSecret;
}

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
    
    const webhookSecret = await getWebhookSecret();
    const secretKey = await getStripeSecretKey();
    
    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-04-30.basil' as any,
    });

    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.payment_status === 'paid') {
        await createOrderFromSession(session);
      }
    }

    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      await createOrderFromSession(session);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    res.status(400).json({ error: `Webhook error: ${error.message}` });
  }
}

async function createOrderFromSession(session: Stripe.Checkout.Session) {
  const supabase = getServiceSupabase();
  
  const existingOrder = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single();

  if (existingOrder.data) {
    console.log('Order already exists for session:', session.id);
    return;
  }

  const metadata = session.metadata || {};
  let items: OrderItem[] = [];
  
  try {
    items = JSON.parse(metadata.items || '[]');
  } catch (e) {
    console.error('Failed to parse items from metadata:', e);
  }

  const shippingDetails = session.shipping_details || session.customer_details;
  const shippingAddress = shippingDetails?.address;

  const orderData = {
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent?.id || null,
    email: session.customer_email || session.customer_details?.email || '',
    amount_total: session.amount_total || 0,
    currency: session.currency || 'usd',
    status: 'paid',
    shipping_name: shippingDetails?.name || 
      `${metadata.shipping_first_name || ''} ${metadata.shipping_last_name || ''}`.trim() || null,
    shipping_address: shippingAddress?.line1 || metadata.shipping_address || null,
    shipping_city: shippingAddress?.city || metadata.shipping_city || null,
    shipping_state: shippingAddress?.state || metadata.shipping_state || null,
    shipping_postal_code: shippingAddress?.postal_code || metadata.shipping_zip || null,
    shipping_country: shippingAddress?.country || 'US',
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select('id')
    .single();

  if (orderError) {
    console.error('Failed to create order:', orderError);
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  if (items.length > 0 && order) {
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      price_cents: item.priceCents,
      qty: item.qty,
      quantity: item.qty,
      unit_price_cents: item.priceCents,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Failed to create order items:', itemsError);
    }
  }

  console.log('Order created successfully:', order.id);
}
