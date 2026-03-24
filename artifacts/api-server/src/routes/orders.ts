import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmation, sendOrderNotification } from "../lib/email";
import { z } from "zod";

const router: IRouter = Router();

const OrderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const PlaceOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(1),
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().int().nonnegative(),
  shippingCost: z.number().int().nonnegative(),
  tax: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  paymentMethod: z.string().optional().default("card"),
});

router.post("/orders", async (req: Request, res: Response) => {
  const parsed = PlaceOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order data", details: parsed.error.issues });
    return;
  }

  const {
    customerName,
    customerEmail,
    shippingAddress,
    items,
    subtotal,
    shippingCost,
    tax,
    total,
    paymentMethod,
  } = parsed.data;

  try {
    // Insert order (order_number gets set after we know the ID)
    const [inserted] = await db
      .insert(ordersTable)
      .values({
        orderNumber: "PENDING",
        customerName,
        customerEmail,
        shippingAddress,
        items: items as any,
        subtotal,
        shippingCost,
        tax,
        total,
        paymentMethod,
        paymentStatus: "demo",
        orderStatus: "confirmed",
      })
      .returning({ id: ordersTable.id });

    const orderNumber = `LUXE-${String(inserted.id).padStart(4, "0")}`;

    await db
      .update(ordersTable)
      .set({ orderNumber })
      .where(eq(ordersTable.id, inserted.id));

    const orderEmailData = {
      orderNumber,
      customerName,
      customerEmail,
      shippingAddress,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
    };

    // Fire-and-forget emails (don't block the response)
    sendOrderConfirmation(orderEmailData).catch((err) =>
      console.error("[Email] Failed to send order confirmation:", err)
    );
    sendOrderNotification(orderEmailData).catch((err) =>
      console.error("[Email] Failed to send order notification:", err)
    );

    res.status(201).json({ success: true, orderNumber, orderId: inserted.id });
  } catch (err) {
    console.error("[Orders] Failed to create order:", err);
    res.status(500).json({ error: "Failed to place order. Please try again." });
  }
});

export default router;
