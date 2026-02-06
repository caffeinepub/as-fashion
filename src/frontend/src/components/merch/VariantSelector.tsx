import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Size } from '../../backend';

interface VariantSelectorProps {
  sizes: Size[];
  selectedSize: Size | null;
  onSizeChange: (size: Size) => void;
}

const sizeLabels: Record<Size, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
  xxl: 'XXL',
  xxxl: 'XXXL',
  unsized: 'One Size',
};

export default function VariantSelector({ sizes, selectedSize, onSizeChange }: VariantSelectorProps) {
  if (sizes.length === 0 || (sizes.length === 1 && sizes[0] === 'unsized')) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label>Select Size</Label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSizeChange(size)}
            className="min-w-[60px]"
          >
            {sizeLabels[size]}
          </Button>
        ))}
      </div>
    </div>
  );
}
