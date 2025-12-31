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
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Find customer with valid reset token
    const { data: customers } = await supabaseAdmin
      .from('customers')
      .select('*')
      .not('metadata', 'is', null);

    const customer = customers?.find(c => {
      const metadata = c.metadata as any;
      if (!metadata?.reset_token || !metadata?.reset_token_expiry) return false;
      
      const isTokenValid = metadata.reset_token === token;
      const isNotExpired = new Date(metadata.reset_token_expiry) > new Date();
      
      return isTokenValid && isNotExpired;
    });

    if (!customer) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        password_hash: passwordHash,
        metadata: {
          ...((customer.metadata as any) || {}),
          reset_token: null,
          reset_token_expiry: null
        }
      })
      .eq('id', customer.id);

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({ error: 'Failed to reset password' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
