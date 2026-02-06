import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ShippingForm, { type ShippingFormData } from '../components/checkout/ShippingForm';
import RequireAuth from '../components/auth/RequireAuth';
import { useCart } from '../state/cart/CartProvider';
import { useCheckout } from '../hooks/orders/useCheckout';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { mutate: checkout, isPending } = useCheckout();

  const [shippingData, setShippingData] = useState<ShippingFormData>({
    name: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};

    if (!shippingData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!shippingData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!shippingData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const shippingAddress = `${shippingData.name}\n${shippingData.phone}\n${shippingData.address}`;

    checkout(
      { cart: items, shippingAddress },
      {
        onSuccess: (orderId) => {
          clearCart();
          toast.success('Order placed successfully!');
          navigate({ to: '/order-confirmation/$orderId', params: { orderId: orderId.toString() } });
        },
        onError: (error) => {
          toast.error('Failed to place order. Please try again.');
          console.error('Checkout error:', error);
        },
      }
    );
  };

  if (items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  return (
    <RequireAuth message="Please log in to complete your purchase">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingForm
                  data={shippingData}
                  onChange={setShippingData}
                  errors={errors}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
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
                  onClick={handlePlaceOrder}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
