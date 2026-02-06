import type { CartItem, Size } from '../../backend';

export interface CartState {
  items: CartItem[];
}

export interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: bigint, size: Size) => void;
  updateQuantity: (productId: bigint, size: Size, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}
