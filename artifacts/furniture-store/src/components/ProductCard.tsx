import { Link } from "wouter";
import { Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your bag.`,
      duration: 3000,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block outline-none">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/50 rounded-xl mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex justify-center">
          <button
            onClick={handleAddToCart}
            className="bg-background/90 backdrop-blur text-foreground w-full py-3 rounded-lg text-sm font-medium shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <p className="font-medium text-foreground">${product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
