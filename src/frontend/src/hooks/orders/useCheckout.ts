import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { CartItem } from '../../backend';

interface CheckoutParams {
  cart: CartItem[];
  shippingAddress: string;
}

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cart, shippingAddress }: CheckoutParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkout(cart, shippingAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
