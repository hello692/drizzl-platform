import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // First, try to find and delete any existing user with this email
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('List users error:', listError);
      return res.status(500).json({ error: 'Failed to check existing users' });
    }

    const existingUser = usersData?.users?.find((u: any) => u.email === email);
    
    if (existingUser) {
      // Delete existing user
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      
      if (deleteError) {
        console.error('Delete user error:', deleteError);
        return res.status(500).json({ error: 'Failed to remove existing account' });
      }

      // Also delete the profile if it exists
      await supabaseAdmin.from('profiles').delete().eq('id', existingUser.id);
    }

    // Create new user with admin privileges
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error('Create user error:', createError);
      return res.status(500).json({ error: 'Failed to create new account' });
    }

    if (!newUser.user) {
      return res.status(500).json({ error: 'User creation failed' });
    }

    // Create admin profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        email: email,
        full_name: 'Admin',
        role: 'admin',
        account_type: 'admin',
        b2b_status: 'none',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('Profile error:', profileError);
      return res.status(500).json({ error: 'Account created but profile failed' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Admin account created successfully',
      email: email
    });

  } catch (error: any) {
    console.error('Reset admin error:', error);
    return res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
}
