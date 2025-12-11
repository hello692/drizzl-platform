import { supabase, Product, Order, OrderItem, Profile, RetailPartner } from './supabaseClient';

export async function getProducts(activeOnly: boolean = true) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function getOrders(filters?: { orderType?: 'd2c' | 'b2b'; status?: string; userId?: string }) {
  let query = supabase
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
  
  if (filters?.orderType) {
    query = query.eq('order_type', filters.orderType);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (id, email, name),
      order_items (
        id,
        quantity,
        unit_price_cents,
        products:product_id (id, name, slug, hero_image_url)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createOrder(
  userId: string,
  orderType: 'd2c' | 'b2b',
  items: { productId: string; quantity: number; unitPriceCents: number }[]
) {
  const totalCents = items.reduce((sum, item) => sum + (item.unitPriceCents * item.quantity), 0);
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_type: orderType,
      status: 'paid',
      total_cents: totalCents,
    })
    .select()
    .single();
  
  if (orderError) throw orderError;
  
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price_cents: item.unitPriceCents,
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) throw itemsError;
  
  return order;
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getRetailPartners() {
  const { data, error } = await supabase
    .from('retail_partners')
    .select(`
      *,
      profiles:user_id (id, email, name, role)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getRetailPartnerByUserId(userId: string) {
  const { data, error } = await supabase
    .from('retail_partners')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as RetailPartner | null;
}

export async function createRetailPartner(partner: Partial<RetailPartner>) {
  const { data, error } = await supabase
    .from('retail_partners')
    .insert(partner)
    .select()
    .single();
  
  if (error) throw error;
  return data as RetailPartner;
}

export async function updateRetailPartner(id: string, updates: Partial<RetailPartner>) {
  const { data, error } = await supabase
    .from('retail_partners')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as RetailPartner;
}

export async function deleteRetailPartner(id: string) {
  const { error } = await supabase
    .from('retail_partners')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
}

export async function updateUserRole(userId: string, role: Profile['role']) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
}

export async function getOrderStats() {
  const [totalOrdersResult, paidOrdersResult, revenueResult] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }),
    supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'paid'),
    supabase.from('orders').select('total_cents').eq('status', 'paid'),
  ]);

  const totalRevenue = revenueResult.data?.reduce((sum, o) => sum + o.total_cents, 0) || 0;

  return {
    totalOrders: totalOrdersResult.count || 0,
    paidOrders: paidOrdersResult.count || 0,
    totalRevenue,
  };
}
