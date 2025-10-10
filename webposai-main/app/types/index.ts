// ==========================
// Enums
// ==========================
export enum CustomerType {
  INDIVIDUAL = "Individual",
  BUSINESS = "Business",
  NGO = "NGO",
}

export enum SaleType {
  RETAIL = "Retail",
  WHOLESALE = "Wholesale",
  BULK = "Bulk",
}

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum InventoryMovementType {
  PURCHASE = "purchase",
  SALE = "sale",
  ADJUSTMENT = "adjustment",
}

// ==========================
// Base Interfaces
// ==========================
export interface BaseModel {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// ==========================
// Product
// ==========================
export interface Product extends BaseModel {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status?: "active" | "inactive";
  image_url?: string;
}

export interface CartItem extends Product {
  quantity: number;
  cartIndex: number;
}


// ==========================
// User
// ==========================
export interface User extends BaseModel {
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier" | "customer";
  is_active?: boolean;
}

// ==========================
// Category
// ==========================
export interface Category extends BaseModel {
  name: string;
  description?: string;
}

// ==========================
// Payment Method
// ==========================
export interface PaymentMethod extends BaseModel {
  name: string;
  icon?: string;
  bg_color?: string;
  border_color?: string;
}

// ==========================
// OrderItem
// ==========================
export interface OrderItem extends BaseModel {
  order_id: string;
  product_id: string;
  name?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  category?: string;
  status?: string;

  product?: Product; // optional nested relation
}

// ==========================
// Order
// ==========================
export interface Order extends BaseModel {
  user_id?: string;
  customer_name?: string;
  customer_type: CustomerType;
  sale_type: SaleType;
  payment_method?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
  total_amount?: number;
  status?: OrderStatus;

  items?: OrderItem[]; // nested relation
  user?: User;
}

// ==========================
// Transaction
// ==========================
export interface Transaction extends BaseModel {
  order_id: string;
  payment_method_id: string;
  amount: number;
  status?: TransactionStatus;
  risk_score?: number;
  risk_category?: "low" | "medium" | "high";
  is_fraud?: boolean;
  anomaly_flags?: string[]; // converted to array

  order?: Order;
  payment_method?: PaymentMethod;
}

// ==========================
// Shop
// ==========================
export interface Shop extends BaseModel {
  name: string;
  vat_number?: string;
  terminal_id?: string;
}

// ==========================
// Cashier Session
// ==========================
export interface CashierSession extends BaseModel {
  cashier_id: string;
  shop_id: string;
  shift?: string;
  till_number?: string;
  session_start?: string;
  session_end?: string;
  total_transactions?: number;
}

// ==========================
// Purchase
// ==========================
export interface Purchase extends BaseModel {
  product_id: string;
  shop_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  vat_amount: number;

  product?: Product;
  shop?: Shop;
}

// ==========================
// Inventory
// ==========================
export interface Inventory extends BaseModel {
  product_id: string;
  shop_id: string;
  quantity: number;
  last_update?: string;
  movement_type?: InventoryMovementType;
  movement_ref_id?: string;

  product?: Product;
  shop?: Shop;
}
