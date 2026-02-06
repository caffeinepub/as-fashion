import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Sanitize images array - remove empty/invalid values
  const validImages = images.filter((img) => img && img.trim().length > 0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getImageUrl = (index: number) => {
    if (imageErrors[index] || !validImages[index]) {
      return '/assets/generated/product-saree-01.dim_900x1200.png';
    }
    return validImages[index];
  };

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src="/assets/generated/product-saree-01.dim_900x1200.png"
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={getImageUrl(currentIndex)}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="h-full w-full object-cover"
          onError={() => handleImageError(currentIndex)}
        />
        {validImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                index === currentIndex ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img
                src={getImageUrl(index)}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
