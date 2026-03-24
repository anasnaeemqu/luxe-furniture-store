import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useGetProduct, useListProducts } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { ProductFAQs } from "@/components/ProductFAQs";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useGetProduct(id ?? "");
  const { data: allProducts = [] } = useListProducts();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
    setQuantity(1);
    setJustAdded(false);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-[4/5] bg-secondary rounded-2xl" />
            <div className="space-y-6 pt-10">
              <div className="h-8 bg-secondary rounded w-3/4" />
              <div className="h-6 bg-secondary rounded w-1/4" />
              <div className="h-24 bg-secondary rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-display mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The piece you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const p = product as Product;
  const allImages = [p.image, ...p.thumbnails];

  const relatedProducts = (allProducts as Product[])
    .filter(r => r.category === p.category && r.id !== p.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(p, quantity);
      setIsAdding(false);
      setJustAdded(true);
      toast({
        title: "Added to cart",
        description: `${quantity}x ${p.name} added to your bag.`,
      });
      setTimeout(() => setJustAdded(false), 3000);
    }, 400);
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs tracking-wider uppercase text-muted-foreground mb-8 space-x-2">
          <Link href="/shop" className="hover:text-foreground transition-colors flex items-center">
            <ArrowLeft className="w-3 h-3 mr-1" /> Back
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${p.category}`} className="hover:text-foreground transition-colors">
            {p.category}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{p.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[4/5] sm:aspect-square md:aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/30"
            >
              <img 
                src={allImages[activeImage]} 
                alt={p.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 rounded-lg overflow-hidden transition-all ${
                    activeImage === idx ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-4 lg:pt-10">
            <h1 className="text-4xl md:text-5xl font-display mb-2">{p.name}</h1>
            <p className="text-2xl text-muted-foreground mb-8">${p.price.toLocaleString()}</p>
            
            <p className="text-base text-foreground/80 leading-relaxed mb-10">
              {p.description}
            </p>

            <div className="space-y-6 mb-10 pb-10 border-b border-border">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Dimensions</h4>
                <p className="text-muted-foreground">{p.dimensions}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Materials</h4>
                <p className="text-muted-foreground">{p.material}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center border border-border rounded-none h-14 w-full sm:w-32">
                <button 
                  className="px-4 py-2 text-xl text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="flex-grow text-center font-medium">{quantity}</span>
                <button 
                  className="px-4 py-2 text-xl text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>
              
              <Button 
                size="lg" 
                className={`flex-grow ${justAdded ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                onClick={handleAddToCart}
                isLoading={isAdding}
                disabled={justAdded}
              >
                {justAdded ? (
                  <span className="flex items-center"><Check className="w-5 h-5 mr-2" /> Added</span>
                ) : (
                  `Add to Cart - $${(p.price * quantity).toLocaleString()}`
                )}
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-primary"/> In Stock, ready to ship</span>
              <span className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-primary"/> Free returns within 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ProductFAQs productId={p.id} productName={p.name} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-secondary/20 py-24 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display mb-12 text-center">Complete the Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map(r => (
                <Link key={r.id} href={`/product/${r.id}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-secondary mb-4">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                  <p className="text-muted-foreground">${r.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
