import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
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

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  total: number;
  itemCount: number;
  addItem: (productId: string, quantity: number, productData?: CartItem['product']) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  setUserId: (userId: string | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const calculateTotal = useCallback((cartItems: CartItem[]) => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  }, []);

  const total = calculateTotal(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
        }
      } else {
        const guestItems = getGuestCart();
        setItems(guestItems);
      }
      
      setLoading(false);
    };

    fetchCart();
  }, [userId]);

  const addItem = async (productId: string, quantity: number = 1, productData?: CartItem['product']) => {
    console.log('[Cart] Adding item:', { productId, quantity, productData });
    
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
        }
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{ user_id: userId, product_id: productId, quantity }])
          .select('*, product:product_id(*)');

        if (!error && data) {
          const newItems = [...items, ...data];
          setItems(newItems);
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

      console.log('[Cart] New items:', newItems);
      setItems(newItems);
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
      }
    } else {
      const newItems = items.filter(item => item.id !== cartItemId);
      setItems(newItems);
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
      }
    } else {
      const newItems = items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      setItems(newItems);
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
      }
    } else {
      setItems([]);
      saveGuestCart([]);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      setUserId,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
