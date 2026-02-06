import { Link } from '@tanstack/react-router';
import { categories } from '../../lib/catalog/categories';
import { Card, CardContent } from '@/components/ui/card';

export default function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          to="/category/$categoryId"
          params={{ categoryId: category.id }}
          className="group"
        >
          <Card className="overflow-hidden transition-all hover:shadow-elegant">
            <div className="aspect-square overflow-hidden bg-muted">
              <div 
                className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-105"
                style={{
                  backgroundImage: `url(/assets/generated/as-fashion-categories.dim_1200x800.png)`,
                  backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
                }}
              />
            </div>
            <CardContent className="p-4 text-center">
              <h3 className="font-serif font-semibold">{category.label}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
