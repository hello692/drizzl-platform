import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../../lib/supabase';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check if customer exists
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, email, first_name')
      .eq('email', email.toLowerCase())
      .single();

    // Always return success to prevent email enumeration
    if (!customer) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token (you'll need to create a password_reset_tokens table)
    // For now, we'll use metadata field
    await supabaseAdmin
      .from('customers')
      .update({
        metadata: {
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry.toISOString()
        }
      })
      .eq('id', customer.id);

    // Send email (integrate with your email service)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/account/reset-password?token=${resetToken}`;
    
    // TODO: Send email via Resend or your email service
    // For now, log it (remove in production)
    console.log('Password reset link:', resetUrl);

    // Try to send email via API
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/api/email/send-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          firstName: customer.first_name,
          resetUrl
        })
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
