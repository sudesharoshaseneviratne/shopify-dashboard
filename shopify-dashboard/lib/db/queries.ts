import { cache } from "react";
import { db } from "./index";
import { products, storeSettings, discounts, collections, productCollections, type StoreSettings } from "./schema";
import { STORE_PRODUCTS, type StoreProduct, type StoreCollection } from "../store/products";
import { eq, or, and, desc, asc } from "drizzle-orm";

/**
 * Transforms a raw database product row into a frontend-safe StoreProduct
 */
function mapDbProductToStoreProduct(row: typeof products.$inferSelect): StoreProduct {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || "",
    category: (row.category || "General") as StoreProduct["category"],
    priceUsd: parseFloat(row.priceUsd) || 0,
    priceSats: row.priceSats || 0,
    rating: parseFloat(row.rating || "5.0") || 5.0,
    reviewsCount: row.reviewsCount || 0,
    inStock: row.inStock ?? true,
    inventory: row.inventory ?? 0,
    featured: row.featured ?? false,
    badge: row.badge || undefined,
    description: row.description || "",
    features: (row.features as string[]) || [],
    specs: (row.specs as { label: string; value: string }[]) || [],
    firmwareVersion: row.firmwareVersion || "v1.0.0",
    securityRating: row.securityRating || "CC EAL6+",
    leadTime: row.leadTime || "Instant Dispatch",
    colorAccent: row.colorAccent || "#FFB800",
    images: (row.images as string[]) || [],
    image: (row.images as string[])?.[0] || undefined,
    status: row.status || "Active",
  };
}

/**
 * Fetch all catalog products from Supabase with fallback to mock data.
 * Only returns products with status === "Active" so Draft, Archived, and Unlisted items remain hidden.
 */
export const getStoreProducts = cache(async (): Promise<StoreProduct[]> => {
  try {
    const [rows, relations, colRows] = await Promise.all([
      db
        .select()
        .from(products)
        .where(eq(products.status, "Active"))
        .orderBy(desc(products.createdAt)),
      db.select().from(productCollections).catch(() => []),
      db.select().from(collections).catch(() => []),
    ]);

    if (rows && rows.length > 0) {
      const colMap = new Map((colRows || []).map((c) => [c.id, c]));
      const productCollectionsMap = new Map<string, string[]>();

      for (const r of relations || []) {
        const col = colMap.get(r.collectionId);
        const list = productCollectionsMap.get(r.productId) || [];
        if (col) {
          list.push(col.id.toLowerCase(), col.slug.toLowerCase(), col.title.toLowerCase());
        } else {
          list.push(r.collectionId.toLowerCase());
        }
        productCollectionsMap.set(r.productId, list);
      }

      return rows.map((r) => {
        const mapped = mapDbProductToStoreProduct(r);
        return {
          ...mapped,
          collections: productCollectionsMap.get(r.id) || [],
        };
      });
    }

    // If the database is connected and contains products, but none are Active (e.g. all drafted),
    // return an empty array rather than resurrecting static mock catalog items.
    const [anyProduct] = await db.select({ id: products.id }).from(products).limit(1);
    if (anyProduct) {
      return [];
    }
  } catch (error) {
    console.error("⚠️ [Supabase Query] Failed to fetch products from database, using fallback catalog:", error);
  }

  // Graceful fallback to static catalog ONLY if database is unseeded or unreachable
  return STORE_PRODUCTS;
});

/**
 * Fetch a single product by its ID or Slug from Supabase.
 * Only returns the product if its status is "Active".
 */
export const getStoreProductById = cache(async (idOrSlug: string): Promise<StoreProduct | null> => {
  try {
    const [row] = await db
      .select()
      .from(products)
      .where(
        and(
          or(eq(products.id, idOrSlug), eq(products.slug, idOrSlug)),
          eq(products.status, "Active")
        )
      )
      .limit(1);

    if (row) {
      return mapDbProductToStoreProduct(row);
    }

    // Check if the product exists in the DB with an inactive status (Draft, Archived, Unlisted).
    // If it exists in DB as Draft/Archived, return null so storefront shows 404/not found.
    const [inactiveRow] = await db
      .select({ id: products.id })
      .from(products)
      .where(or(eq(products.id, idOrSlug), eq(products.slug, idOrSlug)))
      .limit(1);

    if (inactiveRow) {
      return null;
    }

    // If database is populated, the product does not exist
    const [anyProduct] = await db.select({ id: products.id }).from(products).limit(1);
    if (anyProduct) {
      return null;
    }
  } catch (error) {
    console.error(`⚠️ [Supabase Query] Failed to fetch product ${idOrSlug} from database:`, error);
  }

  // Fallback to static catalog search ONLY if DB is unreachable or unseeded
  const staticFound = STORE_PRODUCTS.find((p) => p.id === idOrSlug);
  return staticFound || null;
});

/**
 * Default fallback store settings if not yet populated in database
 */
export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 1,
  storeName: "PRASANTHI CRAFT",
  supportPhone: "+9477 423 0976",
  supportEmail: "prasanthicrafts@gmail.com",
  freeShippingThreshold: "5000.00",
  standardShippingFee: "350.00",
  marqueeAnnouncement: "USE VOUCHER CODE WELCOME10 FOR 10% OFF",
  btcUsdRate: "320.00",
  isMaintenanceMode: false,
  updatedAt: new Date(),
};

/**
 * Fetch dynamic store settings from Supabase
 */
export const getStoreSettings = cache(async (): Promise<StoreSettings> => {
  try {
    const [settings] = await db
      .select()
      .from(storeSettings)
      .where(eq(storeSettings.id, 1))
      .limit(1);

    if (settings) {
      return settings;
    }
  } catch (error) {
    console.error("⚠️ [Supabase Query] Failed to fetch store settings from database, using defaults:", error);
  }

  return DEFAULT_STORE_SETTINGS;
});

/**
 * Validate a discount code against Supabase discounts table
 */
export async function verifyDiscountCode(code: string): Promise<{
  valid: boolean;
  code?: string;
  discountPercent?: number;
  discountAmount?: number;
  message: string;
}> {
  const cleanCode = code.trim().toUpperCase();

  try {
    const [discount] = await db
      .select()
      .from(discounts)
      .where(eq(discounts.code, cleanCode))
      .limit(1);

    if (!discount) {
      return { valid: false, message: "Invalid voucher code" };
    }

    if (!discount.isActive) {
      return { valid: false, message: "This voucher has been disabled" };
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return { valid: false, message: "This voucher has expired" };
    }

    if (discount.usageLimit && (discount.timesUsed || 0) >= discount.usageLimit) {
      return { valid: false, message: "This voucher has reached maximum usage" };
    }

    return {
      valid: true,
      code: discount.code,
      discountPercent: discount.discountPercent || 0,
      discountAmount: parseFloat(discount.discountAmount || "0"),
      message: `${discount.discountPercent ? `${discount.discountPercent}% off` : "Discount"} applied!`,
    };
  } catch (error) {
    console.error("⚠️ [Supabase Query] Error validating discount code:", error);

    // Fallback logic for offline / local mock codes
    if (cleanCode === "WELCOME10" || cleanCode === "PRASANTHI10" || cleanCode === "PROMO15") {
      return { valid: true, code: cleanCode, discountPercent: 10, message: "10% Discount applied!" };
    }
    if (cleanCode === "VIP20" || cleanCode === "SUPER20") {
      return { valid: true, code: cleanCode, discountPercent: 20, message: "20% VIP Discount applied!" };
    }

    return { valid: false, message: "Invalid voucher code" };
  }
}

/**
 * Default fallback store collections if not yet populated in database
 */
export const DEFAULT_STORE_COLLECTIONS: StoreCollection[] = [
  {
    id: "books-workbooks",
    title: "Books & Workbooks",
    slug: "books-workbooks",
    description: "Educational textbooks, curriculum workbooks, guides, and reference literature.",
    icon: "BookOpen",
    badge: "Bestsellers",
    productCount: 1,
  },
  {
    id: "tech-electronics",
    title: "Tech & Electronics",
    slug: "tech-electronics",
    description: "Scientific calculators, smart study accessories, audio devices, and digital learning tools.",
    icon: "Cpu",
    badge: "Tech Essentials",
    productCount: 1,
  },
  {
    id: "stationery-office",
    title: "Stationery & Office",
    slug: "stationery-office",
    description: "Premium notebooks, fine pens, planners, organizers, and office supplies.",
    icon: "Layers",
    badge: "Premium Quality",
    productCount: 1,
  },
  {
    id: "school-essentials",
    title: "School Essentials",
    slug: "school-essentials",
    description: "Backpacks, pencil cases, geometry kits, art supplies, and daily classroom gear.",
    icon: "Package",
    badge: "Student Favorite",
    productCount: 1,
  },
  {
    id: "novelties-gifts",
    title: "Novelties & Gifts",
    slug: "novelties-gifts",
    description: "Curated gift sets, educational games, bookmarks, and creative collectibles.",
    icon: "Gift",
    badge: "Curated Gifts",
    productCount: 1,
  },
];

/**
 * Fetch dynamic collections / categories from Supabase with live active product counts
 */
export const getStoreCollections = cache(async (): Promise<StoreCollection[]> => {
  try {
    const [colRows, activeProducts, relations] = await Promise.all([
      db
        .select()
        .from(collections)
        .orderBy(asc(collections.sortOrder), desc(collections.createdAt))
        .catch(() => []),
      db
        .select({ id: products.id, category: products.category })
        .from(products)
        .where(eq(products.status, "Active"))
        .catch(() => []),
      db.select().from(productCollections).catch(() => []),
    ]);

    if (colRows && colRows.length > 0) {
      return colRows.map((col) => {
        const linkedProductIds = new Set(
          relations
            .filter((r) => r.collectionId === col.id)
            .map((r) => r.productId)
        );

        const count = activeProducts.filter(
          (p) =>
            (p.category && p.category.toLowerCase() === col.title.toLowerCase()) ||
            linkedProductIds.has(p.id)
        ).length;

        return {
          id: col.id,
          title: col.title,
          slug: col.slug,
          description: col.description || "",
          image: col.image || undefined,
          icon: col.icon || "Shield",
          badge: col.badge || undefined,
          productCount: count,
        };
      });
    }
  } catch (error) {
    console.error("⚠️ [Supabase Query] Failed to fetch collections from database:", error);
  }

  return DEFAULT_STORE_COLLECTIONS;
});

/**
 * Fetch a single collection by slug or ID with its associated products
 */
export async function getStoreCollectionBySlug(slugOrId: string) {
  try {
    const [col] = await db
      .select()
      .from(collections)
      .where(or(eq(collections.slug, slugOrId), eq(collections.id, slugOrId)))
      .limit(1);

    if (!col) return null;

    // Fetch associated active products
    const relations = await db
      .select()
      .from(productCollections)
      .where(eq(productCollections.collectionId, col.id));

    const linkedProductIds = relations.map((r) => r.productId);

    const activeProducts = await db
      .select()
      .from(products)
      .where(eq(products.status, "Active"));

    const matchingProducts = activeProducts.filter(
      (p) =>
        (p.category && p.category.toLowerCase() === col.title.toLowerCase()) ||
        linkedProductIds.includes(p.id)
    );

    return {
      collection: {
        id: col.id,
        title: col.title,
        slug: col.slug,
        description: col.description || "",
        image: col.image || undefined,
        icon: col.icon || "Shield",
        badge: col.badge || undefined,
        productCount: matchingProducts.length,
      },
      products: matchingProducts.map(mapDbProductToStoreProduct),
    };
  } catch (error) {
    console.error(`⚠️ [Supabase Query] Failed to fetch collection ${slugOrId}:`, error);
    return null;
  }
}
