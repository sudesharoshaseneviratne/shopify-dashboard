import { 
  pgTable, 
  text, 
  numeric, 
  integer, 
  boolean, 
  timestamp, 
  jsonb,
  primaryKey
} from "drizzle-orm/pg-core";

// ==========================================================================
// 1. PRODUCTS TABLE
// ==========================================================================
export const products = pgTable("products", {
  id: text("id").primaryKey(), // Uses slug-based or UUID identifier
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  tagline: text("tagline").default(""),
  category: text("category").notNull(), // 'Books & Workbooks' | 'Tech & Electronics' | 'Stationery & Office' | 'School Essentials' | 'Novelties & Gifts'
  priceUsd: numeric("price_usd", { precision: 12, scale: 2 }).notNull(),
  priceSats: integer("price_sats").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("5.00"),
  reviewsCount: integer("reviews_count").default(0),
  inStock: boolean("in_stock").default(true),
  inventory: integer("inventory").default(0),
  status: text("status").default("Active"), // 'Active' | 'Draft' | 'Archived' | 'Unlisted'
  featured: boolean("featured").default(false),
  badge: text("badge"),
  description: text("description").default(""),
  features: jsonb("features").$type<string[]>().default([]),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().default([]),
  firmwareVersion: text("firmware_version").default("v1.0.0"),
  securityRating: text("security_rating").default("CC EAL6+"),
  leadTime: text("lead_time").default("Instant Vault Dispatch"),
  colorAccent: text("color_accent").default("#FFB800"),
  images: jsonb("images").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================================================
// 2. ORDERS TABLE
// ==========================================================================
export interface OrderProductItem {
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface OrderShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

export const orders = pgTable("orders", {
  id: text("id").primaryKey(), // e.g. '#1015'
  cleanId: text("clean_id"),   // e.g. '1015'
  orderNumber: integer("order_number"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  shippingAddress: jsonb("shipping_address").$type<OrderShippingAddress>(),
  channel: text("channel").default("Online Store"),
  paymentStatus: text("payment_status").default("Payment pending"), // 'Paid' | 'Payment pending' | 'Authorized' | 'Refunded'
  paymentType: text("payment_type").default("warning"), // 'warning' | 'neutral' | 'danger' | 'success'
  fulfillmentStatus: text("fulfillment_status").default("Unfulfilled"), // 'Fulfilled' | 'Unfulfilled' | 'Partially fulfilled'
  deliveryStatus: text("delivery_status").default(""),
  shippingMethod: text("shipping_method").default("Flat Shipping Rate"),
  shippingPrice: numeric("shipping_price", { precision: 10, scale: 2 }).default("0.00"),
  products: jsonb("products").$type<OrderProductItem[]>().default([]),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0.00"),
  discountCode: text("discount_code"),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0.00"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  paid: numeric("paid", { precision: 12, scale: 2 }).default("0.00"),
  balance: numeric("balance", { precision: 12, scale: 2 }).default("0.00"),
  notes: text("notes").default(""),
  status: text("status").default("Open"), // 'Open' | 'Archived' | 'Canceled'
  alert: boolean("alert").default(false),
  due: boolean("due").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================================================
// 3. CUSTOMERS TABLE
// ==========================================================================
export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  phone: text("phone"),
  ordersCount: integer("orders_count").default(0),
  totalSpent: numeric("total_spent", { precision: 12, scale: 2 }).default("0.00"),
  subscriptionStatus: text("subscription_status").default("Subscribed"), // 'Subscribed' | 'Not subscribed'
  location: text("location").default("Sri Lanka"),
  shippingAddress: jsonb("shipping_address").$type<OrderShippingAddress>(),
  notes: text("notes").default(""),
  role: text("role").default("customer"), // 'customer' | 'admin'
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================================================
// 4. DISCOUNTS & PROMOTIONS TABLE
// ==========================================================================
export const discounts = pgTable("discounts", {
  id: text("id").primaryKey(),
  code: text("code").unique().notNull(), // e.g. 'WELCOME10'
  discountPercent: integer("discount_percent").default(0),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0.00"),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }).default("0.00"),
  usageLimit: integer("usage_limit").default(100),
  timesUsed: integer("times_used").default(0),
  isActive: boolean("is_active").default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================================================
// 5. STORE SETTINGS (Singleton Row: id = 1)
// ==========================================================================
export const storeSettings = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  storeName: text("store_name").default("PRASANTHI CRAFT"),
  supportPhone: text("support_phone").default("+9477 423 0976"),
  supportEmail: text("support_email").default("prasanthicrafts@gmail.com"),
  freeShippingThreshold: numeric("free_shipping_threshold", { precision: 10, scale: 2 }).default("5000.00"),
  standardShippingFee: numeric("standard_shipping_fee", { precision: 10, scale: 2 }).default("350.00"),
  marqueeAnnouncement: text("marquee_announcement").default("USE VOUCHER CODE WELCOME10 FOR 10% OFF"),
  btcUsdRate: numeric("btc_usd_rate", { precision: 12, scale: 2 }).default("320.00"),
  isMaintenanceMode: boolean("is_maintenance_mode").default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================================================
// 6. COLLECTIONS TABLE
// ==========================================================================
export const collections = pgTable("collections", {
  id: text("id").primaryKey(), // e.g. 'cold-storage', 'mining-asics', or UUID
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description").default(""),
  image: text("image"),
  icon: text("icon").default("Shield"),
  badge: text("badge").default(""),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================================================
// 7. PRODUCT_COLLECTIONS (Join Table)
// ==========================================================================
export const productCollections = pgTable("product_collections", {
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  collectionId: text("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.productId, t.collectionId] }),
]);

// ==========================================================================
// INFERRED TYPES FOR TYPESCRIPT AUTOCOMPLETION
// ==========================================================================
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Discount = typeof discounts.$inferSelect;
export type NewDiscount = typeof discounts.$inferInsert;

export type StoreSettings = typeof storeSettings.$inferSelect;
export type NewStoreSettings = typeof storeSettings.$inferInsert;

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export type ProductCollection = typeof productCollections.$inferSelect;
export type NewProductCollection = typeof productCollections.$inferInsert;

// ==========================================================================
// 8. FILES TABLE (Media Library)
// ==========================================================================
export const files = pgTable("files", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  storageKey: text("storage_key"),
  provider: text("provider").default("supabase"),
  size: integer("size").default(0),
  sizeFormatted: text("size_formatted").default("0 KB"),
  mimeType: text("mime_type").default("image/png"),
  extension: text("extension").default("PNG"),
  altText: text("alt_text").default(""),
  referencesCount: integer("references_count").default(0),
  referencesSummary: text("references_summary").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type FileItem = typeof files.$inferSelect;
export type NewFileItem = typeof files.$inferInsert;

