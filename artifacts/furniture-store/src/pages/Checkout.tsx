import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { usePlaceOrder } from "@workspace/api-client-react";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  cardNumber: z.string().min(16, "Invalid card number"),
  expDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Format: MM/YY"),
  cvv: z.string().min(3, "Invalid CVV"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const [orderError, setOrderError] = useState<string | null>(null);

  const shippingCost = subtotal >= 1000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.085);
  const total = subtotal + shippingCost + tax;

  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  // Redirect if cart is empty (must be in useEffect to avoid render-time setState)
  useEffect(() => {
    if (items.length === 0 && !isPending) {
      setLocation("/cart");
    }
  }, [items.length, isPending, setLocation]);

  const onSubmit = async (data: CheckoutForm) => {
    setOrderError(null);

    const shippingAddress = `${data.firstName} ${data.lastName}\n${data.address}\n${data.city}, ${data.state} ${data.zip}`;

    placeOrder(
      {
        data: {
          customerName: `${data.firstName} ${data.lastName}`,
          customerEmail: data.email,
          shippingAddress,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          subtotal,
          shippingCost,
          tax,
          total,
          paymentMethod: "card",
        },
      },
      {
        onSuccess: (result) => {
          clearCart();
          setLocation(`/order-confirmation?order=${encodeURIComponent(result.orderNumber)}`);
        },
        onError: () => {
          setOrderError("Failed to place order. Please try again.");
        },
      }
    );
  };

  const inputClass =
    "w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <Layout>
      <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Return to Bag
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* ── Form ──────────────────────────────────────────────────── */}
          <div className="xl:col-span-7">
            <h1 className="text-3xl font-display mb-8">Checkout</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Contact */}
              <section>
                <h2 className="text-xl font-medium mb-6 pb-2 border-b border-border">
                  Contact Information
                </h2>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    {...register("email")}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="text-xl font-medium mb-6 pb-2 border-b border-border">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input {...register("firstName")} className={inputClass} />
                    {errors.firstName && (
                      <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input {...register("lastName")} className={inputClass} />
                    {errors.lastName && (
                      <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input {...register("address")} className={inputClass} />
                    {errors.address && (
                      <p className="text-destructive text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input {...register("city")} className={inputClass} />
                    {errors.city && (
                      <p className="text-destructive text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State / Province</label>
                    <input {...register("state")} className={inputClass} />
                    {errors.state && (
                      <p className="text-destructive text-xs mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP / Postal Code</label>
                    <input {...register("zip")} className={inputClass} />
                    {errors.zip && (
                      <p className="text-destructive text-xs mt-1">{errors.zip.message}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-xl font-medium mb-6 pb-2 border-b border-border">
                  Payment (Demo)
                </h2>
                <div className="bg-secondary/30 p-6 rounded-xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      {...register("cardNumber")}
                      placeholder="0000 0000 0000 0000"
                      className={`${inputClass} font-mono`}
                    />
                    {errors.cardNumber && (
                      <p className="text-destructive text-xs mt-1">{errors.cardNumber.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiration (MM/YY)</label>
                      <input
                        {...register("expDate")}
                        placeholder="MM/YY"
                        className={`${inputClass} font-mono`}
                      />
                      {errors.expDate && (
                        <p className="text-destructive text-xs mt-1">{errors.expDate.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        {...register("cvv")}
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        className={`${inputClass} font-mono`}
                      />
                      {errors.cvv && (
                        <p className="text-destructive text-xs mt-1">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Order error */}
              {orderError && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{orderError}</p>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" isLoading={isPending}>
                Place Order — ${total.toLocaleString()}
              </Button>

              <p className="text-center text-xs text-muted-foreground -mt-6">
                🔒 Secure encrypted transaction. This is a demo — no real payment is processed.
              </p>
            </form>
          </div>

          {/* ── Sidebar Summary ───────────────────────────────────────── */}
          <div className="xl:col-span-5 hidden lg:block">
            <div className="bg-foreground text-background rounded-2xl p-8 sticky top-32">
              <h2 className="text-xl font-display mb-6 pb-4 border-b border-background/20">
                In Your Bag
              </h2>

              <div className="space-y-4 max-h-[36vh] overflow-y-auto hide-scrollbar mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded bg-background/10 overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-background/60 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-background/20 text-sm">
                <div className="flex justify-between text-background/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-background/70">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? "Complimentary" : `$${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-background/70">
                  <span>Tax (8.5%)</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-4 border-t border-background/20">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
