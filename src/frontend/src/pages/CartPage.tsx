import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../state/cart/CartProvider';
import { EmptyState } from '../components/feedback/States';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useGetProduct } from '../hooks/catalog/useProduct';

function CartItem({ item }: { item: any }) {
  const { updateQuantity, removeItem } = useCart();
  const { data: product } = useGetProduct(Number(item.product_id));
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const quantity = Number(item.quantity);
  const price = Number(product.price);
  const total = price * quantity;

  // Get first valid image URL or use fallback
  const getImageUrl = () => {
    if (imageError || !product.imageUrls || product.imageUrls.length === 0) {
      return '/assets/generated/product-saree-01.dim_900x1200.png';
    }
    return product.imageUrls[0];
  };

  // Format size label
  const formatSize = (size: string) => {
    const sizeMap: Record<string, string> = {
      xs: 'XS',
      s: 'S',
      m: 'M',
      l: 'L',
      xl: 'XL',
      xxl: 'XXL',
      xxxl: 'XXXL',
      unsized: 'One Size',
    };
    return sizeMap[size] || size.toUpperCase();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="h-24 w-24 rounded object-cover"
            onError={() => setImageError(true)}
          />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Size: {formatSize(item.size)}
            </p>
            <p className="font-semibold text-primary">
              ₹{price.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex flex-col items-end justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.product_id, item.size)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.product_id, item.size, Math.max(1, quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.product_id, item.size, quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-3 text-right">
          <p className="text-sm text-muted-foreground">
            Subtotal: <span className="font-semibold text-foreground">₹{total.toLocaleString('en-IN')}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          message="Your cart is empty"
        />
        <div className="flex justify-center mt-8">
          <Button onClick={() => navigate({ to: '/' })}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={`${item.product_id}-${item.size}`} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-serif text-2xl font-bold">Order Summary</h2>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({itemCount})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
