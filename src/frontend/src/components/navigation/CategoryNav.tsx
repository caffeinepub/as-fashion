import { Link } from '@tanstack/react-router';
import { categories } from '../../lib/catalog/categories';
import { Button } from '@/components/ui/button';

interface CategoryNavProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function CategoryNav({ mobile = false, onNavigate }: CategoryNavProps) {
  if (mobile) {
    return (
      <nav className="flex flex-col gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to="/category/$categoryId"
            params={{ categoryId: category.id }}
            onClick={onNavigate}
          >
            <Button variant="ghost" className="w-full justify-start text-base">
              {category.label}
            </Button>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1">
      {categories.map((category) => (
        <Link
          key={category.id}
          to="/category/$categoryId"
          params={{ categoryId: category.id }}
        >
          <Button variant="ghost" className="text-sm font-medium">
            {category.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
