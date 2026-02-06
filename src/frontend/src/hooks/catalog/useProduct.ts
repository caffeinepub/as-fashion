import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { CatalogProduct } from '../../backend';

export function useGetProduct(id: number) {
  const { actor, isFetching } = useActor();

  return useQuery<CatalogProduct>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.fetchCatalogProduct(BigInt(id));
    },
    enabled: !!actor && !isFetching && id > 0,
  });
}
