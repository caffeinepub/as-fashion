import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetUserOrders } from '../hooks/orders/useOrders';
import { LoadingState, ErrorState, EmptyState } from '../components/feedback/States';
import { Package } from 'lucide-react';
import type { OrderStatus } from '../backend';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function OrdersPage() {
  const { data: orders, isLoading, error, refetch } = useGetUserOrders();

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-8">
          <LoadingState message="Loading your orders..." />
        </div>
      </RequireAuth>
    );
  }

  if (error) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-8">
          <ErrorState message="Failed to load orders" onRetry={refetch} />
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-4xl font-bold mb-8">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <EmptyState icon={Package} message="You haven't placed any orders yet" />
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const orderDate = new Date(Number(order.createdAt) / 1000000);
              const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity), 0);

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{index + 1}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {orderDate.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Items</p>
                        <p className="font-semibold">{itemCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Total</p>
                        <p className="font-semibold text-primary">
                          ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground mb-1">Shipping Address</p>
                        <p className="text-sm whitespace-pre-line">{order.shippingAddress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
