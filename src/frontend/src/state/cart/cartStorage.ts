import type { CartItem } from '../../backend';

const CART_STORAGE_KEY = 'as-fashion-cart';

export function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert plain objects back to proper types
    return parsed.map((item: any) => ({
      product_id: BigInt(item.product_id),
      size: item.size,
      quantity: BigInt(item.quantity),
    }));
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  try {
    // Convert BigInt to string for JSON serialization
    const serializable = items.map((item) => ({
      product_id: item.product_id.toString(),
      size: item.size,
      quantity: item.quantity.toString(),
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

export function clearCartStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart storage:', error);
  }
}
