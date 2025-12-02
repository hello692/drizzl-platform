import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export function useCart(userId: string | undefined) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:product_id(*)')
        .eq('user_id', userId);

      if (!error && data) {
        setItems(data);
        const cartTotal = data.reduce((sum, item) => {
          return sum + (item.product?.price || 0) * item.quantity;
        }, 0);
        setTotal(cartTotal);
      }
      setLoading(false);
    };

    fetchCart();
  }, [userId]);

  const addItem = async (productId: string, quantity: number = 1) => {
    if (!userId) return;

    const existing = items.find(item => item.product_id === productId);

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);

      if (!error) {
        setItems(items.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity }])
        .select('*, product:product_id(*)');

      if (!error && data) {
        setItems([...items, ...data]);
      }
    }
  };

  const removeItem = async (cartItemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (!error) {
      setItems(items.filter(item => item.id !== cartItemId));
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (!error) {
      setItems(items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      ));
    }
  };

  const clear = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (!error) {
      setItems([]);
    }
  };

  return { items, loading, total, addItem, removeItem, updateQuantity, clear };
}
