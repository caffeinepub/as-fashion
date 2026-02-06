import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { CatalogProduct } from '../../backend';

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CatalogProduct[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchCatalogProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTopProducts(limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<CatalogProduct[]>({
    queryKey: ['products', 'top', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopCatalogProducts(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrendingProducts(limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<CatalogProduct[]>({
    queryKey: ['products', 'trending', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingCatalogProducts(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}
