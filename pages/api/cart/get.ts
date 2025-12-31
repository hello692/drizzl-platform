import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, sessionId } = req.query;

    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'User ID or session ID is required' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price_cents,
          wholesale_price_cents,
          hero_image_url,
          is_active,
          stock_quantity
        )
      `);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }

    const { data: cartItems, error } = await query;

    if (error) {
      console.error('Cart fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    // Calculate totals
    const items = cartItems || [];
    const subtotal = items.reduce((sum, item) => {
      const price = item.products?.price_cents || 0;
      return sum + (price * item.quantity);
    }, 0);

    res.status(200).json({
      success: true,
      items,
      subtotal,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
