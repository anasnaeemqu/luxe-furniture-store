import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { faqsTable, productsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { sendFaqNotification } from "../lib/email";
import { z } from "zod";

const router = Router();

const SubmitFaqSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  question: z.string().min(10, "Question must be at least 10 characters"),
});

const AnswerFaqSchema = z.object({
  answer: z.string().min(1),
  isFeatured: z.boolean().optional().default(false),
});

// GET /api/products/:id/faqs — list answered FAQs for a product (public)
router.get("/products/:id/faqs", async (req: any, res: any) => {
  const id = req.params.id as string;
  try {
    const faqs = await db
      .select({
        id: faqsTable.id,
        question: faqsTable.question,
        answer: faqsTable.answer,
        isFeatured: faqsTable.isFeatured,
        createdAt: faqsTable.createdAt,
      })
      .from(faqsTable)
      .where(and(eq(faqsTable.productId, id), eq(faqsTable.status, "answered")))
      .orderBy(faqsTable.isFeatured, faqsTable.createdAt);
    res.json(faqs);
  } catch (err) {
    console.error("[FAQs] Failed to list FAQs:", err);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// POST /api/faqs — submit a question (public)
router.post("/faqs", async (req: any, res: any) => {
  const parsed = SubmitFaqSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.issues[0]?.message || "Invalid request data",
    });
    return;
  }

  const { productId, customerName, customerEmail, question } = parsed.data;

  // Look up product name for the email notification
  let productName = productId;
  try {
    const [product] = await db
      .select({ name: productsTable.name })
      .from(productsTable)
      .where(eq(productsTable.id, productId))
      .limit(1);
    if (product) productName = product.name;
  } catch {
    // Non-critical — continue without product name
  }

  try {
    const [inserted] = await db
      .insert(faqsTable)
      .values({ productId, customerName, customerEmail, question })
      .returning({ id: faqsTable.id });

    // Fire-and-forget email notification
    sendFaqNotification({ customerName, customerEmail, productName, productId, question }).catch(
      (err) => console.error("[FAQ] Failed to send notification email:", err)
    );

    res.status(201).json({
      success: true,
      message: "Your question has been submitted. We'll get back to you soon.",
      id: inserted.id,
    });
  } catch (err) {
    console.error("[FAQs] Failed to submit FAQ:", err);
    res.status(500).json({ error: "Failed to submit your question. Please try again." });
  }
});

// GET /api/admin/faqs — list all FAQs (admin)
router.get("/admin/faqs", async (req: any, res: any) => {
  const { status } = req.query;
  try {
    const conditions =
      status === "pending"
        ? [eq(faqsTable.status, "pending")]
        : status === "answered"
          ? [eq(faqsTable.status, "answered")]
          : [];

    const faqs = conditions.length
      ? await db.select().from(faqsTable).where(and(...conditions)).orderBy(faqsTable.createdAt)
      : await db.select().from(faqsTable).orderBy(faqsTable.createdAt);

    res.json(faqs);
  } catch (err) {
    console.error("[FAQs] Failed to list admin FAQs:", err);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// PATCH /api/admin/faqs/:id — answer a FAQ (admin)
router.patch("/admin/faqs/:id", async (req: any, res: any) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid FAQ ID" });
    return;
  }

  const parsed = AnswerFaqSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Answer is required" });
    return;
  }

  const { answer, isFeatured } = parsed.data;

  try {
    const [updated] = await db
      .update(faqsTable)
      .set({ answer, isFeatured, status: "answered" })
      .where(eq(faqsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    console.error("[FAQs] Failed to answer FAQ:", err);
    res.status(500).json({ error: "Failed to post answer" });
  }
});

export default router;
