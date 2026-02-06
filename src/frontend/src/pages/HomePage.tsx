import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import CategoryTiles from '../components/merch/CategoryTiles';
import ProductGrid from '../components/merch/ProductGrid';
import { useGetTopProducts, useGetTrendingProducts } from '../hooks/catalog/useCatalog';
import { LoadingState, ErrorState } from '../components/feedback/States';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: topProducts, isLoading: topLoading, error: topError, refetch: refetchTop } = useGetTopProducts(8);
  const { data: trendingProducts, isLoading: trendingLoading, error: trendingError, refetch: refetchTrending } = useGetTrendingProducts(8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src="/assets/generated/as-fashion-hero.dim_1600x600.png"
          alt="AS FASHION Collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Discover Your Style
            </h1>
            <p className="text-lg md:text-xl mb-8 drop-shadow-md">
              Premium fashion for every occasion
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: 'women' } })}
              className="shadow-lg"
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        <CategoryTiles />
      </section>

      {/* Top Products Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold">Top Picks</h2>
          <Button 
            variant="ghost" 
            onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: 'women' } })}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {topLoading ? (
          <LoadingState message="Loading top products..." />
        ) : topError ? (
          <ErrorState message="Failed to load top products" onRetry={refetchTop} />
        ) : (
          <ProductGrid products={topProducts || []} />
        )}
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold">Trending Now</h2>
          <Button 
            variant="ghost" 
            onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: 'men' } })}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {trendingLoading ? (
          <LoadingState message="Loading trending products..." />
        ) : trendingError ? (
          <ErrorState message="Failed to load trending products" onRetry={refetchTrending} />
        ) : (
          <ProductGrid products={trendingProducts || []} />
        )}
      </section>
    </div>
  );
}
