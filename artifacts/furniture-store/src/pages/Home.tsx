import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useListProducts } from "@workspace/api-client-react";
import type { Product } from "@/lib/products";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { data: products = [], isLoading } = useListProducts();
  const featuredProducts = products.slice(0, 4) as Product[];

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=80" 
            alt="Minimalist Living Room" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-foreground/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="space-y-6">
            <motion.p variants={FADE_UP} className="text-background/90 uppercase tracking-[0.3em] text-sm font-medium">
              New Collection 2025
            </motion.p>
            <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-8xl font-display text-background text-balance leading-tight">
              Design That Breathes.
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-background/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Elevate your sanctuary with pieces crafted from natural materials, 
              focusing on organic warmth and understated elegance.
            </motion.p>
            <motion.div variants={FADE_UP} className="pt-8">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="bg-background text-foreground hover:bg-background/90">
                  Explore Collection
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-24 bg-background px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-display">Curated Spaces</h2>
          <Link href="/shop" className="hidden md:flex items-center text-sm uppercase tracking-widest font-medium hover:text-primary transition-colors">
            Shop All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { name: "Living Room", img: "https://images.unsplash.com/photo-1583847268964-b28ce8f300f3?w=800&q=80" },
            { name: "Bedroom", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80" },
            { name: "Dining", img: "https://images.unsplash.com/photo-1617806118233-18e1c12e4023?w=800&q=80" }
          ].map((cat) => (
            <Link key={cat.name} href={`/shop?category=${cat.name}`} className="group relative aspect-[3/4] overflow-hidden rounded-2xl block">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl text-background font-display mb-2">{cat.name}</h3>
                <span className="text-background/80 flex items-center text-sm font-medium opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  Discover <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display mb-4">Signature Pieces</h2>
            <p className="text-muted-foreground">Our most loved designs, embodying the perfect balance of form and function.</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-secondary rounded-xl" />
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button variant="outline" size="lg">View All Furniture</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY / TEXTURE SECTION */}
      <section className="relative py-32 overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/abstract-texture.png`} 
            alt="Texture background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display mb-6 leading-tight">Crafted for life. Designed for beauty.</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We believe that your home should be a reflection of your true self. 
              Our pieces are sustainably sourced and meticulously crafted to age gracefully,
              becoming a lasting part of your story.
            </p>
            <Link href="/about">
              <span className="inline-flex items-center text-primary font-medium tracking-widest uppercase hover:text-foreground transition-colors border-b-2 border-primary pb-1">
                Read Our Story <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
