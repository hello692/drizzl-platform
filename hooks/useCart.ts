import { useEffect, useState, useCallback } from 'react';
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

const GUEST_CART_KEY = 'drizzl_guest_cart';

function getGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    console.error('Failed to save cart');
  }
}

export function useCart(userId?: string | null) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const calculateTotal = useCallback((cartItems: CartItem[]) => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      
      if (userId) {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*, product:product_id(*)')
          .eq('user_id', userId);

        if (!error && data) {
          setItems(data);
          setTotal(calculateTotal(data));
        }
      } else {
        const guestItems = getGuestCart();
        setItems(guestItems);
        setTotal(calculateTotal(guestItems));
      }
      
      setLoading(false);
    };

    fetchCart();
  }, [userId, calculateTotal]);

  const addItem = async (productId: string, quantity: number = 1, productData?: CartItem['product']) => {
    if (userId) {
      const existing = items.find(item => item.product_id === productId);

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);

        if (!error) {
          const newItems = items.map(item =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          setItems(newItems);
          setTotal(calculateTotal(newItems));
        }
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{ user_id: userId, product_id: productId, quantity }])
          .select('*, product:product_id(*)');

        if (!error && data) {
          const newItems = [...items, ...data];
          setItems(newItems);
          setTotal(calculateTotal(newItems));
        }
      }
    } else {
      const existing = items.find(item => item.product_id === productId);
      let newItems: CartItem[];

      if (existing) {
        newItems = items.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product_id: productId,
          quantity,
          product: productData,
        };
        newItems = [...items, newItem];
      }

      setItems(newItems);
      setTotal(calculateTotal(newItems));
      saveGuestCart(newItems);
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (userId) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (!error) {
        const newItems = items.filter(item => item.id !== cartItemId);
        setItems(newItems);
        setTotal(calculateTotal(newItems));
      }
    } else {
      const newItems = items.filter(item => item.id !== cartItemId);
      setItems(newItems);
      setTotal(calculateTotal(newItems));
      saveGuestCart(newItems);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    if (userId) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (!error) {
        const newItems = items.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        setItems(newItems);
        setTotal(calculateTotal(newItems));
      }
    } else {
      const newItems = items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      setItems(newItems);
      setTotal(calculateTotal(newItems));
      saveGuestCart(newItems);
    }
  };

  const clear = async () => {
    if (userId) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (!error) {
        setItems([]);
        setTotal(0);
      }
    } else {
      setItems([]);
      setTotal(0);
      saveGuestCart([]);
    }
  };

  return { items, loading, total, addItem, removeItem, updateQuantity, clear };
}
