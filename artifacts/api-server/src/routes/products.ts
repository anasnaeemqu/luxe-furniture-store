import { Router } from "express";
import { db, eq, productsTable } from "@workspace/db";
const router = Router();

// GET /api/products — return all products
router.get("/products", async (_req: any, res: any) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .orderBy(productsTable.id);
    res.json(products);
  } catch (err) {
    console.error("[Products] Failed to list products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id — return a single product
router.get("/products/:id", async (req: any, res: any) => {
  try {
    const id = req.params.id as string;
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (err) {
    console.error("[Products] Failed to get product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET /api/categories — return unique categories (hardcoded order)
router.get("/categories", async (_req: any, res: any) => {
  try {
    const rows = await db
      .selectDistinct({ category: productsTable.category })
      .from(productsTable);

    // Preserve a consistent display order
    const ORDER = ["Living Room", "Bedroom", "Dining", "Office"];
    const categories = ["All", ...ORDER.filter(c => rows.some(r => r.category === c))];
    res.json(categories);
  } catch (err) {
    console.error("[Categories] Failed to list categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
