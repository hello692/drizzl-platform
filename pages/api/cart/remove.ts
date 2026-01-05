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
    const { cartItemId } = req.body;

    if (!cartItemId) {
      return res.status(400).json({ error: 'Cart item ID is required' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('Cart remove error:', error);
      return res.status(500).json({ error: 'Failed to remove item' });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
