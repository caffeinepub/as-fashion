import { useParams } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import ProductGrid from '../components/merch/ProductGrid';
import CategoryFilters from '../components/merch/CategoryFilters';
import { useGetProductsByCategory } from '../hooks/catalog/useCatalog';
import { LoadingState, ErrorState, EmptyState } from '../components/feedback/States';
import { categories } from '../lib/catalog/categories';

export default function CategoryPage() {
  const { categoryId } = useParams({ from: '/category/$categoryId' });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('price-asc');

  const { data: products, isLoading, error, refetch } = useGetProductsByCategory(categoryId);

  const category = categories.find((c) => c.id === categoryId);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((p) => {
      const price = Number(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    filtered.sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);

      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, priceRange, sortBy]);

  const handleReset = () => {
    setPriceRange([0, 10000]);
    setSortBy('price-asc');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message="Failed to load products" onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl font-bold mb-8">
        {category?.label || 'Products'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <CategoryFilters
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onReset={handleReset}
          />
        </aside>

        <div className="lg:col-span-3">
          {filteredAndSortedProducts.length === 0 ? (
            <EmptyState message="No products match your filters" />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredAndSortedProducts.length} products
              </p>
              <ProductGrid products={filteredAndSortedProducts} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
