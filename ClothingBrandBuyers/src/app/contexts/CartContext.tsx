import React, { createContext, useContext, useEffect, useState } from 'react';
import * as cartApi from '../../api/cartApi';
import type { CartItem } from '../../types/cart';
import { useAuth } from './AuthContext';

// minimal cart context for UI and quick updates
type CartContextType = {
  items: CartItem[] | null;
  refresh: () => Promise<void>;
  add: (payload: any) => Promise<CartItem>;
  update: (id: string, payload: any) => Promise<CartItem>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const { isAuthenticated } = useAuth();

  const refresh = async () => {
    const data = await cartApi.listCart();
    setItems(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // load cart when logged in
      refresh().catch(() => setItems([]));
    } else {
      // clear cart when logged out
      setItems([]);
    }
  }, [isAuthenticated]);

  const add = async (payload: any) => {
    const data = await cartApi.addToCart(payload);
    await refresh();
    return data;
  };

  const update = async (id: string, payload: any) => {
    const data = await cartApi.updateCartItem(id, payload);
    await refresh();
    return data;
  };

  const remove = async (id: string) => {
    await cartApi.deleteCartItem(id);
    await refresh();
  };

  const clear = async () => {
    await cartApi.clearCart();
    await refresh();
  };

  return (
    <CartContext.Provider value={{ items, refresh, add, update, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
