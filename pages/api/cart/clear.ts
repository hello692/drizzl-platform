import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, sessionId } = req.body;

    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'User ID or session ID is required' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin
      .from('cart_items')
      .delete();

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }

    const { error } = await query;

    if (error) {
      console.error('Cart clear error:', error);
      return res.status(500).json({ error: 'Failed to clear cart' });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
