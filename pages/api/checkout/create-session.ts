import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, items, shippingAddress, billingAddress } = req.body;

    // Validation
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Verify customer exists
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, email, first_name, last_name')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Fetch product details and validate
    const productIds = items.map((item: any) => item.product_id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError || !products) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // Calculate totals and create line items
    let subtotalCents = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItems: any[] = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }

      if (!product.is_active) {
        return res.status(400).json({ error: `Product ${product.name} is not available` });
      }

      if (product.stock_quantity !== null && product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price_cents * item.quantity;
      subtotalCents += itemTotal;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || undefined,
            images: product.hero_image_url ? [product.hero_image_url] : undefined,
          },
          unit_amount: product.price_cents,
        },
        quantity: item.quantity,
      });

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price_cents: product.price_cents,
        total_price_cents: itemTotal,
        product_snapshot: {
          name: product.name,
          description: product.description,
          price_cents: product.price_cents,
          hero_image_url: product.hero_image_url,
        }
      });
    }

    // Calculate tax and shipping (simplified - you may want more complex logic)
    const taxRate = 0.08; // 8% tax
    const taxCents = Math.round(subtotalCents * taxRate);
    const shippingCents = subtotalCents >= 5000 ? 0 : 999; // Free shipping over $50
    const totalCents = subtotalCents + taxCents + shippingCents;

    // Generate order number
    const { data: orderNumberData } = await supabaseAdmin
      .rpc('generate_order_number');
    const orderNumber = orderNumberData || `DRZ${Date.now()}`;

    // Create order in database (pending status)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('d2c_orders')
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        subtotal_cents: subtotalCents,
        tax_cents: taxCents,
        shipping_cents: shippingCents,
        discount_cents: 0,
        total_cents: totalCents,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order creation error:', orderError);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    // Create order items
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('d2c_order_items')
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Rollback order
      await supabaseAdmin.from('d2c_orders').delete().eq('id', order.id);
      return res.status(500).json({ error: 'Failed to create order items' });
    }

    // Add shipping as a line item if not free
    if (shippingCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: shippingCents,
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (taxCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: taxCents,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: customer.email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/checkout-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/cart`,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
        customer_id: customerId,
      },
    });

    // Update order with Stripe session ID
    await supabaseAdmin
      .from('d2c_orders')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', order.id);

    res.status(200).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
      orderId: order.id,
      orderNumber: orderNumber,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
