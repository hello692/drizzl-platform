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
    const { email, password, firstName, lastName, accountType = 'customer' } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check if customer already exists
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingCustomer) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        loyalty_points: 100, // Welcome bonus
        loyalty_tier: 'bronze',
        is_active: true,
        email_verified: false
      })
      .select()
      .single();

    if (customerError || !customer) {
      console.error('Customer creation error:', customerError);
      return res.status(500).json({ error: 'Failed to create account' });
    }

    // Return customer data (without password hash)
    const { password_hash, ...customerData } = customer;

    res.status(201).json({
      success: true,
      customer: customerData,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
