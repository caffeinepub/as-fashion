import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Size } from '../../backend';
import type { CartContextValue } from './cartTypes';
import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from './cartStorage';
import { useGetProduct } from '../../hooks/catalog/useProduct';

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    const stored = loadCartFromStorage();
    setItems(stored);
    setIsInitialized(true);
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(items);
    }
  }, [items, isInitialized]);

  const addItem = (newItem: CartItem) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.product_id === newItem.product_id && item.size === newItem.size
      );

      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }

      return [...current, newItem];
    });
  };

  const removeItem = (productId: bigint, size: Size) => {
    setItems((current) =>
      current.filter((item) => !(item.product_id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: bigint, size: Size, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.product_id === productId && item.size === size
          ? { ...item, quantity: BigInt(quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    clearCartStorage();
  };

  // Calculate subtotal (we'll need to fetch product prices)
  const subtotal = 0; // Placeholder - will be calculated in components with product data
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
