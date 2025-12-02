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

    const [ordersResult, orderTypesResult, revenueResult, topProductsResult, eventsResult] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString()),
      supabaseAdmin
        .from('orders')
        .select('order_type')
        .gte('created_at', sevenDaysAgo.toISOString()),
      supabaseAdmin
        .from('orders')
        .select('total_cents, order_type')
        .eq('status', 'paid')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabaseAdmin
        .from('order_items')
        .select(`
          product_id,
          quantity,
          products (id, name, slug)
        `)
        .order('quantity', { ascending: false })
        .limit(5),
      supabaseAdmin
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    if (ordersResult.error && ordersResult.error.code === '42P01') {
      return res.status(200).json({
        stats: {
          ordersLast7Days: 0,
          d2cOrders: 0,
          b2bOrders: 0,
        },
        revenue: {
          totalRevenue: 0,
          d2cRevenue: 0,
          b2bRevenue: 0,
        },
        topProducts: [],
        recentEvents: [],
      });
    }

    const d2cCount = orderTypesResult.data?.filter(o => o.order_type === 'd2c').length || 0;
    const b2bCount = orderTypesResult.data?.filter(o => o.order_type === 'b2b').length || 0;
    
    const totalRevenue = revenueResult.data?.reduce((sum, o) => sum + o.total_cents, 0) || 0;
    const d2cRevenue = revenueResult.data?.filter(o => o.order_type === 'd2c').reduce((sum, o) => sum + o.total_cents, 0) || 0;
    const b2bRevenue = revenueResult.data?.filter(o => o.order_type === 'b2b').reduce((sum, o) => sum + o.total_cents, 0) || 0;

    return res.status(200).json({
      stats: {
        ordersLast7Days: ordersResult.count || 0,
        d2cOrders: d2cCount,
        b2bOrders: b2bCount,
      },
      revenue: {
        totalRevenue,
        d2cRevenue,
        b2bRevenue,
      },
      topProducts: topProductsResult.data || [],
      recentEvents: eventsResult.data || [],
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(200).json({
      stats: {
        ordersLast7Days: 0,
        d2cOrders: 0,
        b2bOrders: 0,
      },
      revenue: {
        totalRevenue: 0,
        d2cRevenue: 0,
        b2bRevenue: 0,
      },
      topProducts: [],
      recentEvents: [],
    });
  }
}
