import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export interface TrackingEvent {
  id: string;
  order_id: string;
  event_type: string;
  status: string;
  location?: string;
  location_coordinates?: { lat: number; lng: number };
  description?: string;
  timestamp: string;
}

export interface DeliveryProof {
  id: string;
  order_id: string;
  proof_type: string;
  signature_image_url?: string;
  photo_urls: string[];
  recipient_name?: string;
  delivery_notes?: string;
  gps_coordinates?: { lat: number; lng: number };
  delivered_at: string;
  driver_name?: string;
}

export interface Carrier {
  id: string;
  name: string;
  code: string;
  tracking_url_template: string;
  is_active: boolean;
}

export interface OrderWithTracking {
  id: string;
  tracking_number?: string;
  carrier?: string;
  carrier_service?: string;
  status: string;
  shipped_at?: string;
  delivered_at?: string;
  estimated_delivery?: string;
  tracking_url?: string;
  events: TrackingEvent[];
  proof?: DeliveryProof;
}

const CARRIER_PATTERNS: Record<string, RegExp> = {
  'usps': /^(94|93|92|91|20|21|23|24|25|26|27|28|29|30|31|32|33|34|35)\d{18,22}$/,
  'ups': /^1Z[A-Z0-9]{16}$/i,
  'fedex': /^(\d{12}|\d{15}|\d{20}|\d{22})$/,
  'dhl': /^\d{10,11}$/,
  'amzl': /^TBA\d{12,}$/i,
  'ontrac': /^C\d{14}$/,
};

export function detectCarrier(trackingNumber: string): string | null {
  const cleaned = trackingNumber.replace(/\s/g, '').toUpperCase();
  
  for (const [carrier, pattern] of Object.entries(CARRIER_PATTERNS)) {
    if (pattern.test(cleaned)) {
      return carrier;
    }
  }
  
  return null;
}

export async function getCarriers(): Promise<Carrier[]> {
  if (!supabaseAdmin) return [];
  
  const { data } = await supabaseAdmin
    .from('carriers')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  return data || [];
}

export async function getTrackingUrl(carrier: string, trackingNumber: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  
  const { data: carrierData } = await supabaseAdmin
    .from('carriers')
    .select('tracking_url_template')
    .eq('code', carrier.toLowerCase())
    .single();
  
  if (!carrierData?.tracking_url_template) return null;
  
  return carrierData.tracking_url_template.replace('{tracking}', trackingNumber);
}

export async function updateOrderTracking(
  orderId: string,
  trackingInfo: {
    tracking_number: string;
    carrier: string;
    carrier_service?: string;
    estimated_delivery?: string;
  }
): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const trackingUrl = await getTrackingUrl(trackingInfo.carrier, trackingInfo.tracking_number);
  
  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      tracking_number: trackingInfo.tracking_number,
      carrier: trackingInfo.carrier,
      carrier_service: trackingInfo.carrier_service,
      estimated_delivery: trackingInfo.estimated_delivery,
      tracking_url: trackingUrl,
      shipped_at: new Date().toISOString(),
      status: 'shipped',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);
  
  if (error) {
    console.error('[OrderTracking] Error updating order:', error);
    return false;
  }
  
  await addTrackingEvent(orderId, {
    event_type: 'shipped',
    status: 'in_transit',
    description: `Package shipped via ${trackingInfo.carrier.toUpperCase()}`,
    timestamp: new Date().toISOString()
  });
  
  return true;
}

export async function addTrackingEvent(
  orderId: string,
  event: Omit<TrackingEvent, 'id' | 'order_id'>
): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { error } = await supabaseAdmin
    .from('shipment_events')
    .insert({
      order_id: orderId,
      ...event
    });
  
  if (error) {
    console.error('[OrderTracking] Error adding event:', error);
    return false;
  }
  
  return true;
}

export async function getOrderTracking(orderId: string): Promise<OrderWithTracking | null> {
  if (!supabaseAdmin) return null;
  
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      tracking_number,
      carrier,
      carrier_service,
      status,
      shipped_at,
      delivered_at,
      estimated_delivery,
      tracking_url
    `)
    .eq('id', orderId)
    .single();
  
  if (error || !order) return null;
  
  const { data: events } = await supabaseAdmin
    .from('shipment_events')
    .select('*')
    .eq('order_id', orderId)
    .order('timestamp', { ascending: false });
  
  const { data: proof } = await supabaseAdmin
    .from('delivery_proofs')
    .select('*')
    .eq('order_id', orderId)
    .single();
  
  return {
    ...order,
    events: events || [],
    proof: proof || undefined
  };
}

export async function recordDeliveryProof(
  orderId: string,
  proof: Omit<DeliveryProof, 'id' | 'order_id' | 'delivered_at'>
): Promise<boolean> {
  if (!supabaseAdmin) return false;
  
  const { error: proofError } = await supabaseAdmin
    .from('delivery_proofs')
    .insert({
      order_id: orderId,
      ...proof,
      delivered_at: new Date().toISOString()
    });
  
  if (proofError) {
    console.error('[OrderTracking] Error recording proof:', proofError);
    return false;
  }
  
  await supabaseAdmin
    .from('orders')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);
  
  await addTrackingEvent(orderId, {
    event_type: 'delivered',
    status: 'delivered',
    description: proof.recipient_name 
      ? `Delivered to ${proof.recipient_name}`
      : 'Package delivered',
    location: proof.delivery_notes,
    location_coordinates: proof.gps_coordinates,
    timestamp: new Date().toISOString()
  });
  
  return true;
}

export async function getOrderStats(options: {
  startDate?: string;
  endDate?: string;
  orderType?: 'd2c' | 'b2b';
} = {}): Promise<{
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
}> {
  if (!supabaseAdmin) {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      onTimeDeliveryRate: 0
    };
  }
  
  let query = supabaseAdmin
    .from('orders')
    .select('id, status, total_cents, delivered_at, estimated_delivery, order_type');
  
  if (options.startDate) query = query.gte('created_at', options.startDate);
  if (options.endDate) query = query.lte('created_at', options.endDate);
  if (options.orderType) query = query.eq('order_type', options.orderType);
  
  const { data: orders } = await query;
  
  if (!orders || orders.length === 0) {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      onTimeDeliveryRate: 0
    };
  }
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_cents || 0), 0);
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  
  const deliveredWithEstimate = orders.filter(o => 
    o.status === 'delivered' && o.delivered_at && o.estimated_delivery
  );
  const onTimeDeliveries = deliveredWithEstimate.filter(o =>
    new Date(o.delivered_at) <= new Date(o.estimated_delivery)
  ).length;
  const onTimeDeliveryRate = deliveredWithEstimate.length > 0 
    ? Math.round((onTimeDeliveries / deliveredWithEstimate.length) * 100) 
    : 100;
  
  return {
    totalOrders,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    totalRevenue,
    averageOrderValue,
    onTimeDeliveryRate
  };
}

export async function getRecentOrders(limit: number = 20, orderType?: 'd2c' | 'b2b'): Promise<any[]> {
  if (!supabaseAdmin) return [];
  
  let query = supabaseAdmin
    .from('orders')
    .select(`
      id,
      total_cents,
      status,
      order_type,
      tracking_number,
      carrier,
      shipped_at,
      delivered_at,
      created_at,
      profiles:user_id (id, name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (orderType) query = query.eq('order_type', orderType);
  
  const { data } = await query;
  return data || [];
}
