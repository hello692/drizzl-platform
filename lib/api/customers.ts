import bcrypt from 'bcryptjs';
import { supabase } from '../supabase';
import type { Customer, CustomerAddress, CustomerPaymentMethod, D2COrder, D2COrderItem, Subscription, LoyaltyTransaction } from '../../types/database';

export interface OrderWithItems extends D2COrder {
  items?: Array<D2COrderItem & { product?: { name: string; hero_image_url: string | null } }>;
}

export async function authenticateCustomer(email: string, password: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
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

export async function createCustomer(customer: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<Customer | null> {
  const hashedPassword = await bcrypt.hash(customer.password, 10);
  
  const { data, error } = await supabase
    .from('customers')
    .insert({
      email: customer.email,
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
  
  if (error || !data) return null;
  return data;
}

export async function updateCustomerPassword(customerId: string, newPassword: string): Promise<boolean> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const { error } = await supabase
    .from('customers')
    .update({ password_hash: hashedPassword })
    .eq('id', customerId);
  
  return !error;
}
