import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalOrdersResult, orderTypesResult, revenueResult] = await Promise.all([
      supabaseAdmin.from('orders').select('id', { count: 'exact' }),
      supabaseAdmin.from('orders').select('order_type').gte('created_at', sevenDaysAgo.toISOString()),
      supabaseAdmin.from('orders').select('total_cents').eq('status', 'paid').gte('created_at', thirtyDaysAgo.toISOString()),
    ]);

    if (totalOrdersResult.error && totalOrdersResult.error.code === '42P01') {
      return res.status(200).json({
        totalOrders: 0,
        totalRevenue: 0,
        d2cOrders: 0,
        b2bOrders: 0,
        ordersLast7Days: 0,
      });
    }

    const d2cCount = orderTypesResult.data?.filter(o => o.order_type === 'd2c').length || 0;
    const b2bCount = orderTypesResult.data?.filter(o => o.order_type === 'b2b').length || 0;
    const totalRevenue = revenueResult.data?.reduce((sum, o) => sum + o.total_cents, 0) || 0;

    return res.status(200).json({
      totalOrders: totalOrdersResult.count || 0,
      totalRevenue,
      d2cOrders: d2cCount,
      b2bOrders: b2bCount,
      ordersLast7Days: (orderTypesResult.data?.length || 0),
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(200).json({
      totalOrders: 0,
      totalRevenue: 0,
      d2cOrders: 0,
      b2bOrders: 0,
      ordersLast7Days: 0,
    });
  }
}
