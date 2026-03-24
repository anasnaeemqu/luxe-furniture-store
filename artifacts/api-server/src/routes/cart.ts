import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { cartsTable, cartItemsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const CartSyncItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  priceAtTime: z.number().int().nonnegative(),
});

const CartSyncSchema = z.object({
  items: z.array(CartSyncItemSchema),
});

// POST /cart/:sessionId/sync — Replace cart items in DB (upsert)
router.post("/cart/:sessionId/sync", async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const parsed = CartSyncSchema.safeParse(req.body);

  if (!parsed.success || !sessionId) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  try {
    // Upsert cart row
    const existing = await db
      .select({ id: cartsTable.id })
      .from(cartsTable)
      .where(eq(cartsTable.sessionId, sessionId));

    let cartId: number;

    if (existing.length > 0) {
      cartId = existing[0].id;
      // Clear existing items
      await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));
    } else {
      const [newCart] = await db
        .insert(cartsTable)
        .values({ sessionId })
        .returning({ id: cartsTable.id });
      cartId = newCart.id;
    }

    // Insert all current items
    if (parsed.data.items.length > 0) {
      await db.insert(cartItemsTable).values(
        parsed.data.items.map((item) => ({
          cartId,
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.priceAtTime,
        }))
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[Cart] Sync failed:", err);
    res.status(500).json({ error: "Cart sync failed" });
  }
});

// DELETE /cart/:sessionId — Clear cart from DB
router.delete("/cart/:sessionId", async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const existing = await db
      .select({ id: cartsTable.id })
      .from(cartsTable)
      .where(eq(cartsTable.sessionId, sessionId));

    if (existing.length > 0) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, existing[0].id));
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[Cart] Clear failed:", err);
    res.status(500).json({ error: "Cart clear failed" });
  }
});

export default router;
