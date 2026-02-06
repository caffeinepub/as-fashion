import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CatalogProduct } from '../../backend';

interface ProductCardProps {
  product: CatalogProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const formattedPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;

  // Get first valid image URL or use fallback
  const getImageUrl = () => {
    if (imageError || !product.imageUrls || product.imageUrls.length === 0) {
      return '/assets/generated/product-saree-01.dim_900x1200.png';
    }
    return product.imageUrls[0];
  };

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id.toString() }}
      className="group"
    >
      <Card className="overflow-hidden transition-all hover:shadow-elegant">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-sm line-clamp-2 flex-1">
              {product.name}
            </h3>
            {product.availableSizes.length > 0 && product.availableSizes[0] !== 'unsized' && (
              <Badge variant="secondary" className="text-xs shrink-0">
                {product.availableSizes.length} sizes
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            {product.color}
          </p>
          <p className="font-semibold text-primary">
            {formattedPrice}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
