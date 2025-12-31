import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, sessionId, productId, quantity = 1 } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'User ID or session ID is required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check if product exists and is active
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, name, price_cents, stock_quantity, is_active')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.is_active) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    // Check stock
    if (product.stock_quantity !== null && product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already exists in cart
    let query = supabaseAdmin
      .from('cart_items')
      .select('*')
      .eq('product_id', productId);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }

    const { data: existingItem } = await query.single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      const { data: updatedItem, error: updateError } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select('*, products(*)')
        .single();

      if (updateError) {
        console.error('Cart update error:', updateError);
        return res.status(500).json({ error: 'Failed to update cart' });
      }

      return res.status(200).json({
        success: true,
        cartItem: updatedItem,
        message: 'Cart updated'
      });
    } else {
      // Add new item
      const { data: newItem, error: insertError } = await supabaseAdmin
        .from('cart_items')
        .insert({
          user_id: userId || null,
          session_id: sessionId || null,
          product_id: productId,
          quantity
        })
        .select('*, products(*)')
        .single();

      if (insertError) {
        console.error('Cart insert error:', insertError);
        return res.status(500).json({ error: 'Failed to add to cart' });
      }

      return res.status(201).json({
        success: true,
        cartItem: newItem,
        message: 'Added to cart'
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
