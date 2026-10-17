import { useAuth } from './AuthContext';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  nameEn: string;
  nameNe: string;
  price: number;
  quantity: number;
  unitEn: string;
  unitNe: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { customer, loading } = useAuth();
  // Each account has its own cart; logged-out visitors use a guest cart.
  const storageKey = customer ? `hz_cart_${customer.id}` : 'hz_cart_guest';
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const readCart = (key: string): CartItem[] => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Switch carts when the user logs in / out (wait until the session check finishes)
  useEffect(() => {
    if (loading) return;
    let next = readCart(storageKey);
    if (customer) {
      // Items added as a guest move into the account's cart on login
      const guest = readCart('hz_cart_guest');
      if (guest.length > 0) {
        for (const g of guest) {
          const existing = next.find((i) => i.id === g.id);
          if (existing) existing.quantity += g.quantity;
          else next = [...next, g];
        }
        try { localStorage.removeItem('hz_cart_guest'); } catch { /* ignore */ }
      }
    }
    setCart(next);
    setLoadedKey(storageKey);
  }, [storageKey, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loadedKey !== storageKey) return;
    try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart, storageKey, loadedKey]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, qty = 15) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};