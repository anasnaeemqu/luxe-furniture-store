import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").default(""),
  shippingAddress: text("shipping_address").notNull(),
  billingAddress: text("billing_address").default(""),
  items: jsonb("items").notNull(),
  subtotal: integer("subtotal").notNull(),
  shippingCost: integer("shipping_cost").notNull(),
  tax: integer("tax").notNull(),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method").notNull().default("card"),
  paymentStatus: text("payment_status").notNull().default("demo"),
  orderStatus: text("order_status").notNull().default("confirmed"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
