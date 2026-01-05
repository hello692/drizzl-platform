import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '../../../lib/supabase';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.order_id;

        if (!orderId) {
          console.error('No order_id in session metadata');
          break;
        }

        // Update order status
        const { error: updateError } = await supabaseAdmin
          .from('d2c_orders')
          .update({
            status: 'paid',
            payment_status: 'succeeded',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Failed to update order:', updateError);
          break;
        }

        // Get order details
        const { data: order } = await supabaseAdmin
          .from('d2c_orders')
          .select('*, customers(*)')
          .eq('id', orderId)
          .single();

        if (order) {
          // Clear customer's cart
          await supabaseAdmin
            .from('cart_items')
            .delete()
            .eq('user_id', order.customer_id);

          // Update product stock
          const { data: orderItems } = await supabaseAdmin
            .from('d2c_order_items')
            .select('product_id, quantity')
            .eq('order_id', orderId);

          if (orderItems) {
            for (const item of orderItems) {
              await supabaseAdmin.rpc('decrement_product_stock', {
                product_id: item.product_id,
                quantity: item.quantity
              });
            }
          }

          // Award loyalty points (1 point per dollar spent)
          const pointsEarned = Math.floor(order.total_cents / 100);
          
          await supabaseAdmin
            .from('loyalty_transactions')
            .insert({
              customer_id: order.customer_id,
              points: pointsEarned,
              transaction_type: 'earned',
              description: `Order ${order.order_number}`,
              order_id: orderId
            });

          await supabaseAdmin
            .from('customers')
            .update({
              loyalty_points: supabaseAdmin.raw(`loyalty_points + ${pointsEarned}`)
            })
            .eq('id', order.customer_id);

          // Send order confirmation email
          try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/api/email/send-order-confirmation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: order.customers.email,
                orderNumber: order.order_number,
                orderId: order.id
              })
            });
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }

        console.log(`Payment successful for order ${orderId}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.order_id;

        if (orderId) {
          await supabaseAdmin
            .from('d2c_orders')
            .update({
              status: 'cancelled',
              payment_status: 'failed',
            })
            .eq('id', orderId);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed', message: error.message });
  }
}
