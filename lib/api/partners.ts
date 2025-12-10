import bcrypt from 'bcryptjs';
import { supabase } from '../supabase';
import type { Partner, PartnerAddress, B2BOrder, Invoice, Product } from '../../types/database';

export async function authenticatePartner(email: string, password: string): Promise<Partner | null> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();
  
  if (error || !data) return null;
  
  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) {
    if (data.password_hash === password) {
      return data;
    }
    return null;
  }
  
  return data;
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function getPartnerAddresses(partnerId: string): Promise<PartnerAddress[]> {
  const { data, error } = await supabase
    .from('partner_addresses')
    .select('*')
    .eq('partner_id', partnerId)
    .order('is_default', { ascending: false });
  
  if (error || !data) return [];
  return data;
}

export async function getPartnerOrders(partnerId: string): Promise<B2BOrder[]> {
  const { data, error } = await supabase
    .from('b2b_orders')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  return data;
}

export async function getPartnerInvoices(partnerId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  return data;
}

export async function getWholesaleProducts(partnerTier: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error || !data) return [];
  return data;
}

export async function createB2BOrder(order: {
  partnerId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  shippingAddressId?: string;
  poNumber?: string;
  notes?: string;
}): Promise<B2BOrder | null> {
  const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = Math.round(subtotal * 0.0875);
  const shipping = subtotal > 50000 ? 0 : 1500;
  const total = subtotal + tax + shipping;

  const orderNumber = `B2B-${Date.now().toString(36).toUpperCase()}`;

  const { data: newOrder, error: orderError } = await supabase
    .from('b2b_orders')
    .insert({
      partner_id: order.partnerId,
      order_number: orderNumber,
      status: 'pending',
      subtotal,
      tax,
      shipping,
      discount: 0,
      total,
      shipping_address_id: order.shippingAddressId,
      po_number: order.poNumber,
      notes: order.notes
    })
    .select()
    .single();

  if (orderError || !newOrder) return null;

  const orderItems = order.items.map(item => ({
    order_id: newOrder.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.quantity * item.unitPrice
  }));

  await supabase.from('b2b_order_items').insert(orderItems);

  return newOrder;
}

export async function createPartner(partner: {
  email: string;
  password: string;
  businessName: string;
  contactName: string;
  phone: string;
  businessType: string;
}): Promise<Partner | null> {
  const hashedPassword = await bcrypt.hash(partner.password, 10);
  
  const { data, error } = await supabase
    .from('partners')
    .insert({
      email: partner.email,
      password_hash: hashedPassword,
      business_name: partner.businessName,
      contact_name: partner.contactName,
      phone: partner.phone,
      business_type: partner.businessType,
      tier: 'bronze',
      credit_limit: 5000,
      outstanding_balance: 0,
      payment_terms: 'Net 30',
      is_active: true,
      is_verified: false
    })
    .select()
    .single();
  
  if (error || !data) return null;
  return data;
}
