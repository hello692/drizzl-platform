import bcrypt from 'bcryptjs';
import { supabase } from '../supabase';
import { getSupabaseAdmin } from '../supabase';
import type { Customer, CustomerAddress, CustomerPaymentMethod, D2COrder, D2COrderItem, Subscription, LoyaltyTransaction } from '../../types/database';

export interface OrderWithItems extends D2COrder {
  items?: Array<D2COrderItem & { product?: { name: string; hero_image_url: string | null } }>;
}

/**
 * Authenticate customer via API endpoint (recommended for client-side)
 */
export async function authenticateCustomer(email: string, password: string): Promise<Customer | null> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.customer;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Authenticate customer directly (server-side only)
 */
export async function authenticateCustomerDirect(email: string, password: string): Promise<Customer | null> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();
    
    if (error || !data) return null;
    
    const isValid = await bcrypt.compare(password, data.password_hash);
    if (!isValid) return null;
    
    return data;
  } catch (error) {
    console.error('Direct authentication error:', error);
    return null;
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
  const { data, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', customerId)
    .order('is_default', { ascending: false });
  
  if (error || !data) return [];
  return data;
}

export async function getCustomerPaymentMethods(customerId: string): Promise<CustomerPaymentMethod[]> {
  const { data, error } = await supabase
    .from('customer_payment_methods')
    .select('*')
    .eq('customer_id', customerId)
    .order('is_default', { ascending: false });
  
  if (error || !data) return [];
  return data;
}

export async function getCustomerOrders(customerId: string): Promise<OrderWithItems[]> {
  const { data: orders, error: ordersError } = await supabase
    .from('d2c_orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  
  if (ordersError || !orders) return [];

  const ordersWithItems: OrderWithItems[] = await Promise.all(
    orders.map(async (order) => {
      const { data: items } = await supabase
        .from('d2c_order_items')
        .select('*, products(name, hero_image_url)')
        .eq('order_id', order.id);
      
      return {
        ...order,
        items: items?.map((item: any) => ({
          ...item,
          product: item.products
        })) || []
      };
    })
  );

  return ordersWithItems;
}

export async function getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  return data;
}

export async function getLoyaltyTransactions(customerId: string): Promise<LoyaltyTransaction[]> {
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error || !data) return [];
  return data;
}

/**
 * Create customer via API endpoint (recommended for client-side)
 */
export async function createCustomer(customer: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<Customer | null> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: customer.email,
        password: customer.password,
        firstName: customer.firstName,
        lastName: customer.lastName
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    return data.customer;
  } catch (error) {
    console.error('Create customer error:', error);
    throw error;
  }
}

/**
 * Create customer directly (server-side only)
 */
export async function createCustomerDirect(customer: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<Customer | null> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const hashedPassword = await bcrypt.hash(customer.password, 10);
    
    const { data, error } = await supabaseAdmin
      .from('customers')
      .insert({
        email: customer.email.toLowerCase(),
        password_hash: hashedPassword,
        first_name: customer.firstName,
        last_name: customer.lastName,
        loyalty_points: 100,
        loyalty_tier: 'bronze',
        is_active: true,
        email_verified: false
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error('Create customer error:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Create customer direct error:', error);
    return null;
  }
}

export async function updateCustomerPassword(customerId: string, newPassword: string): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { error } = await supabaseAdmin
      .from('customers')
      .update({ password_hash: hashedPassword })
      .eq('id', customerId);
    
    return !error;
  } catch (error) {
    console.error('Update password error:', error);
    return false;
  }
}

export async function addCustomerAddress(address: Omit<CustomerAddress, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerAddress | null> {
  const { data, error } = await supabase
    .from('customer_addresses')
    .insert(address)
    .select()
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function updateCustomerAddress(id: string, updates: Partial<CustomerAddress>): Promise<CustomerAddress | null> {
  const { data, error } = await supabase
    .from('customer_addresses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function deleteCustomerAddress(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('customer_addresses')
    .delete()
    .eq('id', id);
  
  return !error;
}
