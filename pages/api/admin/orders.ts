import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { orderType, status } = req.query;
      
      let query = supabaseAdmin
        .from('orders')
        .select(`
          *,
          profiles:user_id (id, email, name),
          order_items (
            id,
            quantity,
            unit_price_cents,
            products:product_id (id, name, slug)
          )
        `)
        .order('created_at', { ascending: false });

      if (orderType && orderType !== 'all') {
        query = query.eq('order_type', orderType);
      }
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        if (error.code === '42P01') {
          return res.status(200).json({ orders: [], message: 'Orders table not found' });
        }
        throw error;
      }

      return res.status(200).json({ orders: data || [] });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(200).json({ orders: [], message: 'Could not load orders' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { orderId, status } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({ error: 'Missing orderId or status' });
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: 'Failed to update order status' });
      }

      return res.status(200).json({ order: data });
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
