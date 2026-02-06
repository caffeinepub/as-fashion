import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">AS FASHION</h3>
            <p className="text-sm text-muted-foreground">
              Your destination for premium fashion, from traditional Indian wear to contemporary styles.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link 
                  to="/category/$categoryId" 
                  params={{ categoryId: 'men' }}
                  className="hover:text-foreground transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/$categoryId" 
                  params={{ categoryId: 'women' }}
                  className="hover:text-foreground transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/$categoryId" 
                  params={{ categoryId: 'shoes' }}
                  className="hover:text-foreground transition-colors"
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/$categoryId" 
                  params={{ categoryId: 'baby' }}
                  className="hover:text-foreground transition-colors"
                >
                  Baby
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/orders" className="hover:text-foreground transition-colors">My Orders</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
