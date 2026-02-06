import { useParams, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductGallery from '../components/merch/ProductGallery';
import VariantSelector from '../components/merch/VariantSelector';
import { useGetProduct } from '../hooks/catalog/useProduct';
import { LoadingState, ErrorState } from '../components/feedback/States';
import { useCart } from '../state/cart/CartProvider';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Size } from '../backend';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading, error, refetch } = useGetProduct(Number(productId));
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;

    const hasSizes = product.availableSizes.length > 0 && product.availableSizes[0] !== 'unsized';
    
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const sizeToAdd = selectedSize || product.availableSizes[0] || 'unsized';
    
    addItem({
      product_id: product.id,
      size: sizeToAdd,
      quantity: BigInt(quantity),
    });

    toast.success('Added to cart!');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message="Failed to load product" onRetry={refetch} />
      </div>
    );
  }

  const formattedPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;

  // Ensure we have a safe image array with fallback
  const safeImages = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ['/assets/generated/product-saree-01.dim_900x1200.png'];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/category/' + product.category })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {product.category}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ProductGallery images={safeImages} productName={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Color</h3>
            <p className="text-muted-foreground">{product.color}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <VariantSelector
            sizes={product.availableSizes}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
