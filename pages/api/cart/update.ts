import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItemId, quantity } = req.body;

    if (!cartItemId) {
      return res.status(400).json({ error: 'Cart item ID is required' });
    }

    if (quantity < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // If quantity is 0, delete the item
    if (quantity === 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (deleteError) {
        console.error('Cart delete error:', deleteError);
        return res.status(500).json({ error: 'Failed to remove item' });
      }

      return res.status(200).json({
        success: true,
        message: 'Item removed from cart'
      });
    }

    // Update quantity
    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select('*, products(*)')
      .single();

    if (updateError) {
      console.error('Cart update error:', updateError);
      return res.status(500).json({ error: 'Failed to update cart' });
    }

    res.status(200).json({
      success: true,
      cartItem: updatedItem,
      message: 'Cart updated'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
