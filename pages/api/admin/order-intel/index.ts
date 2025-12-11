import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { calculateOrderMetrics, generateMockOrderIntel } from '../../../../lib/orderIntelService';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timeRange = '30d' } = req.query;
    const range = String(timeRange);

    let dateFilter = new Date();
    if (range === '7d') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (range === '30d') {
      dateFilter.setDate(dateFilter.getDate() - 30);
    } else if (range === '90d') {
      dateFilter.setDate(dateFilter.getDate() - 90);
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        profiles:user_id (id, email, name)
      `)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        const mockData = generateMockOrderIntel(range);
        return res.status(200).json({
          ...mockData,
          message: 'Orders table not found - showing demo data'
        });
      }
      throw error;
    }

    if (!orders || orders.length === 0) {
      const mockData = generateMockOrderIntel(range);
      return res.status(200).json({
        ...mockData,
        message: 'No orders found - showing demo data'
      });
    }

    const metrics = calculateOrderMetrics(orders, range);

    return res.status(200).json(metrics);

  } catch (error) {
    console.error('Error fetching order intel:', error);
    
    const mockData = generateMockOrderIntel('30d');
    return res.status(200).json({
      ...mockData,
      message: 'Could not load orders - showing demo data'
    });
  }
}
