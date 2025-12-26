'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
  qty: number;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

type AddItemInput = Omit<CartItem, 'qty'> & { qty?: number };

type CartContextValue = CartState & {
  addItem: (item: AddItemInput) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  itemCount: number;
  subtotalCents: number;
};

const CART_STORAGE_KEY = 'drizzl_cart_v1';

function readItemsFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { items?: CartItem[] };
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function writeItemsToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
  } catch {
    // ignore
  }
}

type Action =
  | { type: 'ADD'; item: AddItemInput }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QTY'; productId: string; qty: number }
  | { type: 'CLEAR' };

const initialState: CartState = { items: [], hydrated: false };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD': {
      const qtyToAdd = Math.max(1, action.item.qty ?? 1);
      const idx = state.items.findIndex((i) => i.productId === action.item.productId);

      if (idx === -1) {
        return {
          ...state,
          items: [
            ...state.items,
            {
              productId: action.item.productId,
              name: action.item.name,
              priceCents: action.item.priceCents,
              imageUrl: action.item.imageUrl ?? null,
              qty: qtyToAdd,
            },
          ],
        };
      }

      const next = state.items.slice();
      next[idx] = { ...next[idx], qty: next[idx].qty + qtyToAdd };
      return { ...state, items: next };
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };

    case 'SET_QTY': {
      const qty = Math.max(0, Math.floor(action.qty));
      if (qty === 0) return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
      return {
        ...state,
        items: state.items.map((i) => (i.productId === action.productId ? { ...i, qty } : i)),
      };
    }

    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (init): CartState => ({
      items: readItemsFromStorage(),
      hydrated: true,
    }),
  );

  useEffect(() => {
    if (!state.hydrated) return;
    writeItemsToStorage(state.items);
  }, [state.items, state.hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((n, i) => n + i.qty, 0);
    const subtotalCents = state.items.reduce((n, i) => n + i.qty * i.priceCents, 0);

    return {
      ...state,
      addItem: (item) => dispatch({ type: 'ADD', item }),
      removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQty: (productId, qty) => dispatch({ type: 'SET_QTY', productId, qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
      itemCount,
      subtotalCents,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider />');
  return ctx;
}
