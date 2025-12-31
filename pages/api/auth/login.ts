import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Find customer
    const { data: customer, error: fetchError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is active
    if (!customer.is_active) {
      return res.status(403).json({ error: 'Account is inactive. Please contact support.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, customer.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await supabaseAdmin
      .from('customers')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', customer.id);

    // Return customer data (without password hash)
    const { password_hash, ...customerData } = customer;

    res.status(200).json({
      success: true,
      customer: customerData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
