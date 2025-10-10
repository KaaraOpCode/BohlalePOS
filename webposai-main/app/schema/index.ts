import { z } from "zod";

// ==========================
// Enums
// ==========================
export const customerTypeEnum = z.enum(["Individual", "Business", "NGO"]);
export const saleTypeEnum = z.enum(["Retail", "Wholesale", "Bulk"]);
export const orderStatusEnum = z.enum(["pending", "completed", "cancelled"]);
export const transactionStatusEnum = z.enum(["pending", "completed", "failed"]);
export const inventoryMovementTypeEnum = z.enum(["purchase", "sale", "adjustment"]);

// ==========================
// Base
// ==========================
export const baseModelSchema = z.object({
  id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// ==========================
// Product
// ==========================
export const productSchema = baseModelSchema.extend({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  status: z.enum(["active", "inactive"]).optional(),
  image_url: z.string().url().optional(),
});

export const cartItemSchema = productSchema.extend({
  quantity: z.number().int().positive(),
  cartIndex: z.number(),
});

// ==========================
// User
// ==========================
export const userSchema = baseModelSchema.extend({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "cashier", "customer"]),
  is_active: z.boolean().optional(),
});

// ==========================
// Category
// ==========================
export const categorySchema = baseModelSchema.extend({
  name: z.string().min(1),
  description: z.string().optional(),
});

// ==========================
// Payment Method
// ==========================
export const paymentMethodSchema = baseModelSchema.extend({
  name: z.string().min(1),
  icon: z.string().optional(),
  bg_color: z.string().optional(),
  border_color: z.string().optional(),
});

// ==========================
// Order Item
// ==========================
export const orderItemSchema = baseModelSchema.extend({
  order_id: z.string(),
  product_id: z.string(),
  name: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().int().optional(),
  stock: z.number().int().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  product: z.lazy(() => productSchema).optional(),
});

// ==========================
// Order
// ==========================
export const orderSchema = baseModelSchema.extend({
  user_id: z.string().optional(),
  customer_name: z.string().optional(),
  customer_type: customerTypeEnum,
  sale_type: saleTypeEnum,
  payment_method: z.string().optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  total_amount: z.number().optional(),
  status: orderStatusEnum.optional(),
  items: z.array(z.lazy(() => orderItemSchema)).optional(),
  user: z.lazy(() => userSchema).optional(),
});

// ==========================
// Transaction
// ==========================
export const transactionSchema = baseModelSchema.extend({
  order_id: z.string(),
  payment_method_id: z.string(),
  amount: z.number().positive(),
  status: transactionStatusEnum.optional(),
  risk_score: z.number().optional(),
  risk_category: z.enum(["low", "medium", "high"]).optional(),
  is_fraud: z.boolean().optional(),
  anomaly_flags: z.array(z.string()).optional(),
  order: z.lazy(() => orderSchema).optional(),
  payment_method: z.lazy(() => paymentMethodSchema).optional(),
});

// ==========================
// Shop
// ==========================
export const shopSchema = baseModelSchema.extend({
  name: z.string().min(1),
  vat_number: z.string().optional(),
  terminal_id: z.string().optional(),
});

// ==========================
// Cashier Session
// ==========================
export const cashierSessionSchema = baseModelSchema.extend({
  cashier_id: z.string(),
  shop_id: z.string(),
  shift: z.string().optional(),
  till_number: z.string().optional(),
  session_start: z.string().optional(),
  session_end: z.string().optional(),
  total_transactions: z.number().optional(),
});

// ==========================
// Purchase
// ==========================
export const purchaseSchema = baseModelSchema.extend({
  product_id: z.string(),
  shop_id: z.string(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  total_price: z.number().positive(),
  vat_amount: z.number().nonnegative(),
  product: z.lazy(() => productSchema).optional(),
  shop: z.lazy(() => shopSchema).optional(),
});

// ==========================
// Inventory
// ==========================
export const inventorySchema = baseModelSchema.extend({
  product_id: z.string(),
  shop_id: z.string(),
  quantity: z.number().int(),
  last_update: z.string().optional(),
  movement_type: inventoryMovementTypeEnum.optional(),
  movement_ref_id: z.string().optional(),
  product: z.lazy(() => productSchema).optional(),
  shop: z.lazy(() => shopSchema).optional(),
});

// ==========================
// Inferred Types (optional)
// ==========================
export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type User = z.infer<typeof userSchema>;
export type Category = z.infer<typeof categorySchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Shop = z.infer<typeof shopSchema>;
export type CashierSession = z.infer<typeof cashierSessionSchema>;
export type Purchase = z.infer<typeof purchaseSchema>;
export type Inventory = z.infer<typeof inventorySchema>;
