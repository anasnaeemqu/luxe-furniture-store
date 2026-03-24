import { Link, useSearch } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderNumber = params.get("order") || "LUXE-0001";

  return (
    <Layout>
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-lg w-full"
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-display mb-4">Order Confirmed</h1>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Thank you for your purchase. Your order has been received and is being prepared with the care it deserves.
          </p>

          {/* Order Number Card */}
          <div className="bg-secondary/40 border border-border rounded-2xl p-8 mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Order Number
            </p>
            <p className="text-3xl font-display tracking-widest">{orderNumber}</p>
          </div>

          {/* Info Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
            <div className="flex items-start p-4 bg-background rounded-xl border border-border">
              <Mail className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-medium text-sm mb-1">Confirmation Email</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A confirmation has been sent to your email address.
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-background rounded-xl border border-border">
              <Package className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-medium text-sm mb-1">White Glove Delivery</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You'll receive tracking details once your order ships.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="group w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
