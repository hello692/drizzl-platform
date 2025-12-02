import { supabase } from './supabaseClient';

export type EventType = 
  | 'page_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'order_completed'
  | 'b2b_order_created'
  | 'product_view'
  | 'search'
  | 'signup'
  | 'login';

export interface EventMetadata {
  page?: string;
  product_id?: string;
  product_name?: string;
  order_id?: string;
  order_total?: number;
  order_type?: 'd2c' | 'b2b';
  search_query?: string;
  [key: string]: any;
}

export async function logEvent(
  eventType: EventType,
  metadata: EventMetadata = {}
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('analytics_events').insert({
      user_id: user?.id || null,
      event_type: eventType,
      metadata,
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

export async function getAnalyticsSummary() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [ordersResult, topProductsResult, orderTypesResult] = await Promise.all([
    supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .gte('created_at', sevenDaysAgo.toISOString()),
    
    supabase
      .from('order_items')
      .select('product_id, quantity')
      .gte('created_at', sevenDaysAgo.toISOString()),
    
    supabase
      .from('orders')
      .select('order_type')
      .gte('created_at', sevenDaysAgo.toISOString()),
  ]);

  const d2cCount = orderTypesResult.data?.filter(o => o.order_type === 'd2c').length || 0;
  const b2bCount = orderTypesResult.data?.filter(o => o.order_type === 'b2b').length || 0;

  return {
    ordersLast7Days: ordersResult.count || 0,
    d2cOrders: d2cCount,
    b2bOrders: b2bCount,
  };
}

export async function getTopProducts(limit: number = 3) {
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      product_id,
      quantity,
      products (
        id,
        name,
        slug
      )
    `)
    .order('quantity', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top products:', error);
    return [];
  }

  return data || [];
}

export async function getRevenueStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('orders')
    .select('total_cents, order_type, created_at')
    .eq('status', 'paid')
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching revenue:', error);
    return { totalRevenue: 0, d2cRevenue: 0, b2bRevenue: 0 };
  }

  const totalRevenue = data?.reduce((sum, o) => sum + o.total_cents, 0) || 0;
  const d2cRevenue = data?.filter(o => o.order_type === 'd2c').reduce((sum, o) => sum + o.total_cents, 0) || 0;
  const b2bRevenue = data?.filter(o => o.order_type === 'b2b').reduce((sum, o) => sum + o.total_cents, 0) || 0;

  return { totalRevenue, d2cRevenue, b2bRevenue };
}
