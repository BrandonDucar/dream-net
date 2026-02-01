export type ContactCategory = "collectibles" | "metals" | "custom" | "media";
export type ContactStatus = "new" | "review" | "replied" | "closed";

export interface ContactRequest {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  channel?: string;
  message: string;
  category: ContactCategory;
  tags?: string[];
  status: ContactStatus;
}

export type OrderCurrency = "USD" | "ETH" | "USDC";
export type PaymentMethod = "stripe" | "crypto" | "manual";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "open" | "sourcing" | "awaiting-payment" | "fulfilled" | "canceled";

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  itemName: string;
  sku?: string;
  quantity: number;
  currency: OrderCurrency;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  txId?: string;
  stripeSessionId?: string;
  customerEmail?: string;
  notes?: string;
  meta?: Record<string, unknown>;
  status: OrderStatus;
}

export interface CreateContactRequestInput {
  name: string;
  email: string;
  channel?: string;
  message: string;
  category: ContactCategory;
  tags?: string[];
}

export interface CreateOrderInput {
  itemName: string;
  sku?: string;
  quantity: number;
  currency: OrderCurrency;
  amount: number;
  paymentMethod: PaymentMethod;
  customerEmail?: string;
  notes?: string;
  meta?: Record<string, unknown>;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  txId?: string;
  stripeSessionId?: string;
  meta?: Record<string, unknown>;
}

export interface UpdateContactInput {
  status?: ContactStatus;
  tags?: string[];
  notes?: string;
}

export interface OrderFilter {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  currency?: OrderCurrency;
  paymentMethod?: PaymentMethod;
}

export interface ContactFilter {
  category?: ContactCategory;
  status?: ContactStatus;
}

