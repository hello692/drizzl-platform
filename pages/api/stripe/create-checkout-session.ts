import type { NextApiRequest, NextApiResponse } from 'next';
import { getUncachableStripeClient } from '../../../lib/stripeClient';

interface CartItem {
  productId: string;
  name: string;
  priceCents: number;
  qty: number;
  imageUrl?: string;
}

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = await getUncachableStripeClient();
    const { items, shipping, customerEmail } = req.body as {
      items: CartItem[];
      shipping?: ShippingData;
      customerEmail?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
    const protocol = domain.includes('localhost') ? 'http' : 'https';

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [`${protocol}://${domain}${item.imageUrl}`] : [],
        },
        unit_amount: item.priceCents,
      },
      quantity: item.qty,
    }));

    const itemsForMetadata = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      priceCents: item.priceCents,
      qty: item.qty,
    }));

    const email = shipping?.email || customerEmail;

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${protocol}://${domain}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${domain}/checkout/cancel`,
      metadata: {
        items: JSON.stringify(itemsForMetadata),
        shipping_first_name: shipping?.firstName || '',
        shipping_last_name: shipping?.lastName || '',
        shipping_address: shipping?.address || '',
        shipping_city: shipping?.city || '',
        shipping_state: shipping?.state || '',
        shipping_zip: shipping?.zip || '',
      },
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    if (!shipping?.address) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ['US', 'CA'],
      };
    }

    sessionParams.billing_address_collection = 'required';

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}
