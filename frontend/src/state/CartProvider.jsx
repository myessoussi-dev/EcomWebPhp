// src/state/CartProvider.jsx
import { useState, useMemo, useEffect } from 'react';
import { CartContext } from './cart-context.js';
import { formatCurrency } from '../utils/format.js';

export default function CartProvider({ children }) {
  // Load cart from localStorage (so refresh doesn’t lose items)
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Helper actions
  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  // Total price memoised
  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    addItem,
    removeItem,
    clearCart,
    total,
    formatCurrency,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
