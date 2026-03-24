import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/Button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[80vh]">
        <h1 className="text-4xl md:text-5xl font-display mb-12">Your Bag</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6 stroke-[1]" />
            <h2 className="text-2xl font-medium mb-4">Your bag is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any pieces yet.</p>
            <Link href="/shop">
              <Button>Explore Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
            {/* Items List */}
            <div className="flex-grow">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs uppercase tracking-widest font-bold text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="space-y-6 md:space-y-0">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="py-6 border-b border-border flex flex-col md:grid md:grid-cols-12 gap-4 items-center relative"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center w-full">
                        <Link href={`/product/${item.product.id}`} className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-secondary mr-4 sm:mr-6 block">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex flex-col">
                          <Link href={`/product/${item.product.id}`} className="font-medium text-lg hover:text-primary transition-colors mb-1">
                            {item.product.name}
                          </Link>
                          <span className="text-sm text-muted-foreground mb-2">{item.product.category}</span>
                          <span className="text-sm font-medium md:hidden">${item.product.price.toLocaleString()}</span>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs text-destructive hover:underline self-start flex items-center mt-2"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-3 w-full md:w-auto flex justify-between md:justify-center items-center mt-4 md:mt-0">
                        <span className="md:hidden text-sm font-bold uppercase text-muted-foreground">Qty</span>
                        <div className="flex items-center border border-border rounded-none h-10 w-28">
                          <button 
                            className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >-</button>
                          <span className="flex-grow text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >+</button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="col-span-3 w-full md:w-auto flex justify-between md:justify-end items-center mt-2 md:mt-0">
                        <span className="md:hidden text-sm font-bold uppercase text-muted-foreground">Total</span>
                        <span className="font-medium text-lg">${(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-secondary/30 rounded-2xl p-8 sticky top-32">
                <h2 className="text-xl font-display mb-6 pb-4 border-b border-border">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : `$${shipping.toLocaleString()}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-primary mt-1">Spend ${(1000 - subtotal).toLocaleString()} more for complimentary shipping.</p>
                  )}
                </div>

                <div className="flex justify-between text-xl font-medium pt-6 border-t border-border mb-8">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button className="w-full group">
                    Secure Checkout 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                  <p>Taxes calculated at checkout.</p>
                  <p className="mt-2 flex items-center justify-center">
                    <span className="inline-block w-4 h-4 rounded-full border border-current mr-2 flex items-center justify-center">🔒</span>
                    Secure Encrypted Payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
