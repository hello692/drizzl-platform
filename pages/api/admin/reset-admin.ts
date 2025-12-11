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
    return res.status(500).json({ error: 'Server configuration error - missing Supabase credentials' });
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
      // Delete existing profile first using raw SQL
      await supabaseAdmin.rpc('delete_profile_by_id', { user_id: existingUser.id }).catch(() => {
        // If RPC doesn't exist, try direct delete
        return supabaseAdmin.from('profiles').delete().eq('id', existingUser.id);
      });
      
      // Delete existing user
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      
      if (deleteError) {
        console.error('Delete user error:', deleteError);
        return res.status(500).json({ error: 'Failed to remove existing account' });
      }
    }

    // Create new user with admin privileges
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error('Create user error:', createError);
      return res.status(500).json({ error: 'Failed to create new account: ' + createError.message });
    }

    if (!newUser.user) {
      return res.status(500).json({ error: 'User creation failed' });
    }

    // Use raw SQL query to insert profile - bypasses schema cache
    const insertSQL = `
      INSERT INTO profiles (id, email, role, created_at, updated_at)
      VALUES ('${newUser.user.id}', '${email}', 'admin', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = NOW();
    `;
    
    // Try using the sql query via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({ sql: insertSQL })
    });

    // If RPC doesn't exist, try direct SQL via postgres connection
    if (!response.ok) {
      // Fallback: Just insert minimum fields
      const { error: directError } = await supabaseAdmin
        .from('profiles')
        .insert({ id: newUser.user.id, role: 'admin' })
        .select();
      
      if (directError) {
        // Last resort: update if row exists
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', newUser.user.id);
          
        if (updateError) {
          console.error('All profile methods failed:', updateError);
          // Even if profile fails, the auth user was created successfully
          // We'll try to fix this with a workaround
          return res.status(200).json({ 
            success: true, 
            message: 'Auth account created. Profile may need manual setup.',
            email: email,
            userId: newUser.user.id,
            note: 'Login at /admin/auth should work after manually setting role in Supabase'
          });
        }
      }
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
