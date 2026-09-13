"use server";

import { db } from "@/lib/db";
import { products, collections, productCollections } from "@/lib/db/schema";
import { eq, inArray, desc, or, and, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { STORE_PRODUCTS } from "@/lib/store/products";

export interface AdminProductItem {
  id: string;
  name: string;
  status: string;
  inventory: string;
  inventoryCount: number;
  inventoryColor: string;
  category: string;
  channels: string;
  type: string;
  vendor: string;
  noImage: boolean;
  image: string | null;
  price: string;
  rawPrice: number;
  comparePrice: string;
  created: string;
  updated: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  category: string;
  priceUsd: number;
  compareAtPrice?: number;
  inventory: number;
  status?: "Active" | "Draft" | "Archived" | "Unlisted";
  tagline?: string;
  features?: string[];
  specs?: { label: string; value: string }[];
  images?: string[];
  securityRating?: string;
  leadTime?: string;
  firmwareVersion?: string;
  colorAccent?: string;
  vendor?: string;
}

/**
 * Fetch all products formatted for the Admin Products Table
 */
export async function getAdminProductsAction(): Promise<AdminProductItem[]> {
  try {
    const rows = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    return rows.map((p) => {
      const inv = p.inventory ?? 0;
      const priceNum = parseFloat(p.priceUsd) || 0;
      const imagesArr = (p.images as string[]) || [];

      return {
        id: p.id,
        name: p.name,
        status: p.status || (p.inStock ? "Active" : "Draft"),
        inventory: `${inv} in stock`,
        inventoryCount: inv,
        inventoryColor: inv <= 5 ? "text-red-600" : "text-[#1a1a1a]",
        category: p.category || "General",
        channels: p.status === "Archived" ? "0" : "4",
        type: p.category || "General",
        vendor: "Prasanthi Craft",
        noImage: imagesArr.length === 0,
        image: imagesArr[0] || null,
        price: `LKR ${priceNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        rawPrice: priceNum,
        comparePrice: `LKR ${(priceNum * 1.15).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        created: p.createdAt 
          ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
          : "Recently",
        updated: p.updatedAt 
          ? new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
          : "Recently",
      };
    });
  } catch (error) {
    console.error("❌ Failed to fetch admin products from database:", error);
    return [];
  }
}

function safeRevalidate(path: string, type?: "page" | "layout") {
  try {
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
  } catch {
    // Safely ignore when called outside Next.js request context
  }
}

/**
 * Create a new product in Supabase
 */
export async function createProductAction(input: CreateProductInput) {
  try {
    const slugBase = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Add unique random suffix to ensure no slug collision
    const uniqueSlug = `${slugBase}-${Math.random().toString(36).substring(2, 7)}`;
    const id = uniqueSlug;

    const btcUsdRate = 95240;
    const priceSats = Math.round((input.priceUsd / btcUsdRate) * 100_000_000);

    await db.insert(products).values({
      id,
      name: input.name,
      slug: uniqueSlug,
      tagline: input.tagline || `${input.name} - Premium Quality`,
      category: input.category || "Books & Workbooks",
      priceUsd: input.priceUsd.toFixed(2),
      priceSats,
      rating: "5.00",
      reviewsCount: 0,
      inStock: (input.inventory ?? 0) > 0,
      inventory: input.inventory ?? 0,
      status: input.status || "Active",
      featured: false,
      badge: "New Release",
      description: input.description || "",
      features: input.features || [
        "100% Open Source Hardware Schematic",
        "Air-Gapped Optical Verification Protocol",
        "Zero Cloud Telemetry Or Tracking",
      ],
      specs: input.specs || [
        { label: "Hardware Architecture", value: "Cortex-M4 + CC EAL6+" },
        { label: "Interface", value: "QR Camera + MicroSD" },
        { label: "Battery", value: "Lithium Polymer 1200mAh" },
      ],
      firmwareVersion: input.firmwareVersion || "v1.0.0",
      securityRating: input.securityRating || "CC EAL6+",
      leadTime: input.leadTime || "Dispatches within 24h",
      colorAccent: input.colorAccent || "#FFB800",
      images: input.images || [],
    });

    // Link to matching collection if exists
    if (input.category) {
      const [matchingCol] = await db
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.title, input.category))
        .limit(1);

      if (matchingCol) {
        await db
          .insert(productCollections)
          .values({
            productId: id,
            collectionId: matchingCol.id,
          })
          .onConflictDoNothing();
      }
    }

    safeRevalidate("/admin/products");
    safeRevalidate("/", "layout");
    safeRevalidate("/");
    safeRevalidate("/products");

    return { success: true, id, slug: uniqueSlug };
  } catch (error) {
    console.error("❌ Failed to create product in database:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Bulk delete products by IDs
 */
export async function bulkDeleteProductsAction(ids: string[]) {
  try {
    if (!ids || ids.length === 0) return { success: true };

    await db.delete(products).where(inArray(products.id, ids));

    safeRevalidate("/admin/products");
    safeRevalidate("/", "layout");
    safeRevalidate("/");
    safeRevalidate("/products");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to bulk delete products:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Bulk update product status
 */
export async function bulkUpdateProductStatusAction(
  ids: string[], 
  status: "Active" | "Draft" | "Archived" | "Unlisted"
) {
  try {
    if (!ids || ids.length === 0) return { success: true };

    await db
      .update(products)
      .set({ 
        status, 
        inStock: status === "Active",
        updatedAt: new Date(),
      })
      .where(inArray(products.id, ids));

    safeRevalidate("/admin/products");
    safeRevalidate("/", "layout");
    safeRevalidate("/");
    safeRevalidate("/products");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to bulk update product status:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update status for a single product by ID
 */
export async function updateProductStatusAction(
  id: string,
  status: "Active" | "Draft" | "Archived" | "Unlisted"
) {
  return await bulkUpdateProductStatusAction([id], status);
}

export interface UpdateProductInput {
  name: string;
  description?: string;
  category: string;
  priceUsd: number;
  compareAtPrice?: number;
  inventory: number;
  status: "Active" | "Draft" | "Archived" | "Unlisted";
  tagline?: string;
  features?: string[];
  specs?: { label: string; value: string }[];
  images?: string[];
  securityRating?: string;
  leadTime?: string;
  firmwareVersion?: string;
  colorAccent?: string;
  vendor?: string;
}

/**
 * Fetch a single product by ID or slug for the Admin Edit form
 */
export async function getAdminProductByIdAction(id: string) {
  try {
    const [row] = await db
      .select()
      .from(products)
      .where(or(eq(products.id, id), eq(products.slug, id)))
      .limit(1);

    if (row) {
      const inv = row.inventory ?? 0;
      const priceNum = parseFloat(row.priceUsd) || 0;
      const imagesArr = (row.images as string[]) || [];

      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description || "",
        tagline: row.tagline || "",
        category: row.category,
        priceUsd: priceNum,
        priceFormatted: priceNum.toFixed(2),
        compareAtPrice: (priceNum * 1.15).toFixed(2),
        inventory: inv,
        status: (row.status || (row.inStock ? "Active" : "Draft")) as "Active" | "Draft" | "Archived" | "Unlisted",
        images: imagesArr,
        features: (row.features as string[]) || [],
        specs: (row.specs as { label: string; value: string }[]) || [],
        firmwareVersion: row.firmwareVersion || "v1.0.0",
        securityRating: row.securityRating || "CC EAL6+",
        leadTime: row.leadTime || "Fast Dispatch",
        colorAccent: row.colorAccent || "#FFB800",
        vendor: "Prasanthi Craft",
        productType: row.category,
      };
    }

    // Fallback search in static catalog
    const mock = STORE_PRODUCTS.find((p) => p.id === id);
    if (mock) {
      return {
        id: mock.id,
        name: mock.name,
        slug: mock.id,
        description: mock.description,
        tagline: mock.tagline,
        category: mock.category,
        priceUsd: mock.priceUsd,
        priceFormatted: mock.priceUsd.toFixed(2),
        compareAtPrice: (mock.priceUsd * 1.15).toFixed(2),
        inventory: mock.inventory,
        status: (mock.status || (mock.inStock ? "Active" : "Draft")) as "Active" | "Draft" | "Archived" | "Unlisted",
        images: mock.images || (mock.image ? [mock.image] : []),
        features: mock.features || [],
        specs: mock.specs || [],
        firmwareVersion: mock.firmwareVersion,
        securityRating: mock.securityRating,
        leadTime: mock.leadTime || "Fast Dispatch",
        colorAccent: mock.colorAccent,
        vendor: "Prasanthi Craft",
        productType: mock.category,
      };
    }

    return null;
  } catch (error) {
    console.error(`❌ Failed to fetch admin product ${id}:`, error);
    return null;
  }
}

/**
 * Update an existing product in Supabase
 */
export async function updateProductAction(id: string, input: UpdateProductInput) {
  try {
    const btcUsdRate = 95240;
    const priceSats = Math.round((input.priceUsd / btcUsdRate) * 100_000_000);

    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(or(eq(products.id, id), eq(products.slug, id)))
      .limit(1);

    if (existing) {
      await db
        .update(products)
        .set({
          name: input.name,
          description: input.description || "",
          category: input.category,
          priceUsd: input.priceUsd.toFixed(2),
          priceSats,
          inStock: (input.inventory ?? 0) > 0 && input.status === "Active",
          inventory: input.inventory ?? 0,
          status: input.status,
          tagline: input.tagline || (input.description ? input.description.slice(0, 120) : ""),
          features: input.features || [],
          specs: input.specs || [],
          images: input.images || [],
          firmwareVersion: input.firmwareVersion,
          securityRating: input.securityRating,
          leadTime: input.leadTime,
          colorAccent: input.colorAccent,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existing.id));
    } else {
      await db.insert(products).values({
        id,
        name: input.name,
        slug: id,
        tagline: input.tagline || `${input.name} - Premium Selection`,
        category: input.category,
        priceUsd: input.priceUsd.toFixed(2),
        priceSats,
        rating: "5.00",
        reviewsCount: 0,
        inStock: (input.inventory ?? 0) > 0 && input.status === "Active",
        inventory: input.inventory ?? 0,
        status: input.status,
        featured: false,
        badge: "Updated",
        description: input.description || "",
        features: input.features || [],
        specs: input.specs || [],
        images: input.images || [],
        firmwareVersion: input.firmwareVersion || "v1.0.0",
        securityRating: input.securityRating || "CC EAL6+",
        leadTime: input.leadTime || "Instant Vault Dispatch",
        colorAccent: input.colorAccent || "#FFB800",
      });
    }

    // Link to matching collection if exists
    if (input.category) {
      const [matchingCol] = await db
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.title, input.category))
        .limit(1);

      if (matchingCol) {
        await db
          .insert(productCollections)
          .values({
            productId: id,
            collectionId: matchingCol.id,
          })
          .onConflictDoNothing();
      }
    }

    safeRevalidate("/admin/products");
    safeRevalidate(`/admin/products/${id}`);
    safeRevalidate("/", "layout");
    safeRevalidate("/");
    safeRevalidate("/products");
    safeRevalidate(`/products/${id}`);

    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to update product ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete a single product by ID
 */
export async function deleteProductAction(id: string) {
  return await bulkDeleteProductsAction([id]);
}

/**
 * Update inventory count for a specific product
 */
export async function updateProductInventoryAction(id: string, newInventory: number) {
  try {
    const safeInventory = isNaN(newInventory) ? 0 : newInventory;

    await db
      .update(products)
      .set({
        inventory: safeInventory,
        inStock: safeInventory > 0,
        updatedAt: new Date(),
      })
      .where(or(eq(products.id, id), eq(products.slug, id)));

    safeRevalidate("/admin/products");
    safeRevalidate("/admin/products/inventory");
    safeRevalidate(`/admin/products/${id}`);
    safeRevalidate("/", "layout");
    safeRevalidate("/");
    safeRevalidate("/products");
    safeRevalidate(`/products/${id}`);

    return { success: true, inventory: safeInventory };
  } catch (error) {
    console.error(`❌ Failed to update inventory for product ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

export interface ImportProductItemInput {
  name: string;
  description?: string;
  images?: string[];
  status?: "Active" | "Draft" | "Archived" | "Unlisted";
  priceUsd: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  inventory?: number;
  category?: string;
  type?: string;
  vendor?: string;
  pageTitle?: string;
  metaDescription?: string;
  urlHandle?: string;
}

export interface ImportProductsResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  error?: string;
}

/**
 * Bulk import products from parsed CSV data into Supabase PostgreSQL
 */
export async function importProductsAction(
  items: ImportProductItemInput[]
): Promise<ImportProductsResult> {
  try {
    if (!items || items.length === 0) {
      return {
        success: false,
        importedCount: 0,
        skippedCount: 0,
        error: "No products provided to import.",
      };
    }

    const btcUsdRate = 95240;
    let importedCount = 0;
    let skippedCount = 0;

    // Cache collection IDs to avoid redundant DB queries
    const existingCollections = await db
      .select({ id: collections.id, title: collections.title })
      .from(collections);
    const collectionMap = new Map(
      existingCollections.map((c) => [c.title.toLowerCase().trim(), c.id])
    );

    const BATCH_SIZE = 50;
    const productsToInsert: (typeof products.$inferInsert)[] = [];
    const relationsToInsert: (typeof productCollections.$inferInsert)[] = [];

    for (const item of items) {
      if (!item.name || !item.name.trim()) {
        skippedCount++;
        continue;
      }

      const cleanName = item.name.trim();
      const slugBase = (item.urlHandle && item.urlHandle.trim())
        ? item.urlHandle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : cleanName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

      const uniqueSlug = `${slugBase || "product"}-${Math.random().toString(36).substring(2, 7)}`;
      const id = uniqueSlug;

      const price =
        typeof item.priceUsd === "number" && !isNaN(item.priceUsd)
          ? item.priceUsd
          : 0;
      const priceSats = Math.round((price / btcUsdRate) * 100_000_000);
      const inventory =
        typeof item.inventory === "number" && !isNaN(item.inventory)
          ? item.inventory
          : 0;
      const status = item.status || "Active";
      const category = item.category?.trim() || "Books & Workbooks";
      const images = item.images && item.images.length > 0 ? item.images : [];

      const specs: { label: string; value: string }[] = [];
      if (item.sku) specs.push({ label: "SKU", value: item.sku });
      if (item.barcode) specs.push({ label: "Barcode", value: item.barcode });
      if (item.type) specs.push({ label: "Product Type", value: item.type });
      if (item.vendor) specs.push({ label: "Vendor", value: item.vendor });
      if (item.metaDescription) specs.push({ label: "Meta Description", value: item.metaDescription });

      const tagline =
        item.pageTitle ||
        (item.description
          ? item.description.slice(0, 120)
          : `${cleanName} - Premium Quality`);

      productsToInsert.push({
        id,
        name: cleanName,
        slug: uniqueSlug,
        tagline,
        category,
        priceUsd: price.toFixed(2),
        priceSats,
        rating: "5.00",
        reviewsCount: 0,
        inStock: inventory > 0 && status === "Active",
        inventory,
        status,
        featured: false,
        badge: "Imported",
        description: item.description || "",
        features: [
          "100% Verified Quality",
          "Fast Fulfillment",
        ],
        specs,
        firmwareVersion: "v1.0.0",
        securityRating: "CC EAL6+",
        leadTime: "Dispatches within 24h",
        colorAccent: "#FFB800",
        images,
      });

      // Link to matching collection if exists
      const colId = collectionMap.get(category.toLowerCase().trim());
      if (colId) {
        relationsToInsert.push({
          productId: id,
          collectionId: colId,
        });
      }
    }

    // Execute bulk inserts in batches of 50 to avoid connection timeouts and statement locks
    for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
      const chunk = productsToInsert.slice(i, i + BATCH_SIZE);
      await db.insert(products).values(chunk).onConflictDoNothing();
      importedCount += chunk.length;
    }

    for (let i = 0; i < relationsToInsert.length; i += BATCH_SIZE) {
      const chunk = relationsToInsert.slice(i, i + BATCH_SIZE);
      await db.insert(productCollections).values(chunk).onConflictDoNothing();
    }

    safeRevalidate("/admin/products");
    safeRevalidate("/admin/products/inventory");
    safeRevalidate("/", "layout");
    safeRevalidate("/");
    safeRevalidate("/products");

    return {
      success: true,
      importedCount,
      skippedCount,
    };
  } catch (error) {
    console.error("❌ Failed to import products from CSV:", error);
    return {
      success: false,
      importedCount: 0,
      skippedCount: 0,
      error: String(error),
    };
  }
}

export interface SearchProductResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  priceUsd: number;
  image?: string;
  tagline?: string;
  inStock: boolean;
  inventory: number;
}

/**
 * High-speed live search action for storefront search bars.
 * Multi-token matching across name, category, description, tagline, and specs in Supabase.
 */
export async function searchStoreProductsAction(query: string): Promise<SearchProductResult[]> {
  const clean = (query || "").trim();
  if (!clean) return [];

  // Treat hyphens, underscores, slashes as word boundaries
  const normalized = clean.replace(/[-_/\\+]/g, " ");
  const terms = normalized.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  try {
    const conditions = terms.map((term) => {
      const pattern = `%${term}%`;
      return or(
        ilike(products.name, pattern),
        ilike(products.category, pattern),
        ilike(products.tagline, pattern),
        ilike(products.description, pattern),
        sql`coalesce(${products.specs}::text, '') ilike ${pattern}`
      );
    });

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        category: products.category,
        priceUsd: products.priceUsd,
        images: products.images,
        tagline: products.tagline,
        inStock: products.inStock,
        inventory: products.inventory,
      })
      .from(products)
      .where(and(eq(products.status, "Active"), ...conditions))
      .orderBy(desc(products.createdAt))
      .limit(8);

    return rows.map((r) => {
      const imagesArr = (r.images as string[]) || [];
      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category || "General",
        priceUsd: parseFloat(r.priceUsd) || 0,
        image: imagesArr[0] || undefined,
        tagline: r.tagline || undefined,
        inStock: r.inStock ?? true,
        inventory: r.inventory ?? 0,
      };
    });
  } catch (error) {
    console.error("⚠️ [Supabase Live Search] Direct query error, falling back to cached catalog:", error);
    try {
      const { getStoreProducts } = await import("@/lib/db/queries");
      const allProducts = await getStoreProducts();
      return allProducts
        .filter((p) => {
          const name = (p.name || "").toLowerCase();
          const cat = (p.category || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const tag = (p.tagline || "").toLowerCase();
          const specs = (p.specs || []).map((s) => `${s.label} ${s.value}`).join(" ").toLowerCase();
          return terms.every((t) => {
            const tl = t.toLowerCase();
            return (
              name.includes(tl) ||
              cat.includes(tl) ||
              desc.includes(tl) ||
              tag.includes(tl) ||
              specs.includes(tl)
            );
          });
        })
        .slice(0, 8)
        .map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.id,
          category: p.category || "General",
          priceUsd: p.priceUsd,
          image: p.image || p.images?.[0],
          tagline: p.tagline,
          inStock: p.inStock,
          inventory: p.inventory,
        }));
    } catch {
      return [];
    }
  }
}

export interface BulkProductItem {
  id: string;
  name: string;
  status: string;
  category: string;
  vendor: string;
  price: string;
  available: string;
  onHand: string;
  description: string;
  media: string;
  hasImage: boolean;
  imageSrc: string;
  images: string[];
  tags: string;
  type: string;
  template: string;
  salesChannels: string;
  storeSchedule: string;
  publishDate: string;
  unitPrice: string;
  comparePrice: string;
  costPerItem: string;
  chargeTaxes: string;
  sku: string;
  barcode: string;
  continueSelling: string;
  trackQuantity: string;
  package: string;
  weight: string;
  physicalProduct: string;
  hsCode: string;
  countryOrigin: string;
  seoTitle: string;
  seoDescription: string;
  seoHandle: string;
  binName?: string;
  comm?: string;
  unav?: string;
  inc?: string;
}

/**
 * Fetch products for Bulk Editor:
 * If ids are provided, fetches only those selected products;
 * If no ids provided, fetches all products from the database.
 */
export async function getBulkEditorProductsAction(ids?: string[]): Promise<BulkProductItem[]> {
  try {
    let rows;
    if (ids && ids.length > 0) {
      rows = await db
        .select()
        .from(products)
        .where(inArray(products.id, ids))
        .orderBy(desc(products.createdAt));

      // Preserve selection order
      if (rows.length > 0) {
        const idMap = new Map(rows.map((r) => [r.id, r]));
        const ordered = ids.map((id) => idMap.get(id)).filter(Boolean) as typeof rows;
        if (ordered.length > 0) rows = ordered;
      }
    } else {
      rows = await db
        .select()
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(200);
    }

    return rows.map((p) => {
      const inv = p.inventory ?? 0;
      const priceNum = parseFloat(p.priceUsd) || 0;
      const imagesArr = (p.images as string[]) || [];
      const specsArr = (p.specs as { label: string; value: string }[]) || [];

      const getSpec = (label: string) =>
        specsArr.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value || "";

      const sku = getSpec("SKU");
      const barcode = getSpec("Barcode");
      const vendor = getSpec("Vendor") || "Prasanthi Craft";
      const productType = getSpec("Product Type") || p.category || "General";
      const comparePrice = getSpec("Compare-at Price") || (priceNum > 0 ? (priceNum * 1.15).toFixed(2) : "0.00");
      const costPerItem = getSpec("Cost per item") || (priceNum > 0 ? (priceNum * 0.6).toFixed(2) : "0.00");
      const seoTitle = getSpec("Page Title") || p.name;
      const seoDesc = getSpec("Meta Description") || p.description || "";
      const binName = getSpec("Bin Name") || "";
      const tags = getSpec("Tags") || "";

      return {
        id: p.id,
        name: p.name,
        status: p.status || (p.inStock ? "Active" : "Draft"),
        category: p.category || "General",
        vendor,
        price: priceNum.toFixed(2),
        available: inv.toString(),
        onHand: inv.toString(),
        description: p.description || "",
        media: imagesArr.length > 0 ? `${imagesArr.length} image${imagesArr.length === 1 ? "" : "s"}` : "",
        hasImage: imagesArr.length > 0,
        imageSrc: imagesArr[0] || "",
        images: imagesArr,
        tags,
        type: productType,
        template: "Default product",
        salesChannels: p.status === "Archived" ? "0" : "Online Store",
        storeSchedule: "Immediate",
        publishDate: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Today",
        unitPrice: priceNum.toFixed(2),
        comparePrice,
        costPerItem,
        chargeTaxes: "Yes",
        sku,
        barcode,
        continueSelling: "No",
        trackQuantity: "Yes",
        package: "Standard",
        weight: "0.5 kg",
        physicalProduct: "Yes",
        hsCode: "4901.99",
        countryOrigin: "Sri Lanka",
        seoTitle,
        seoDescription: seoDesc,
        seoHandle: p.slug || p.id,
        binName,
        comm: "0",
        unav: "0",
        inc: "0",
      };
    });
  } catch (error) {
    console.error("❌ Failed to fetch bulk editor products:", error);
    return [];
  }
}

/**
 * Save updated products from Bulk Editor back into the database
 */
export async function saveBulkEditorProductsAction(
  items: Array<Partial<BulkProductItem> & { id: string }>
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    if (!items || items.length === 0) return { success: true, count: 0 };

    let updatedCount = 0;

    for (const item of items) {
      const [existing] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.id))
        .limit(1);

      if (!existing) continue;

      const currentSpecs = (existing.specs as { label: string; value: string }[]) || [];
      const specMap = new Map<string, string>();
      for (const s of currentSpecs) {
        specMap.set(s.label.toLowerCase(), s.value);
      }

      if (item.sku !== undefined) specMap.set("sku", item.sku);
      if (item.barcode !== undefined) specMap.set("barcode", item.barcode);
      if (item.vendor !== undefined) specMap.set("vendor", item.vendor);
      if (item.type !== undefined) specMap.set("product type", item.type);
      if (item.comparePrice !== undefined) specMap.set("compare-at price", item.comparePrice);
      if (item.costPerItem !== undefined) specMap.set("cost per item", item.costPerItem);
      if (item.seoTitle !== undefined) specMap.set("page title", item.seoTitle);
      if (item.seoDescription !== undefined) specMap.set("meta description", item.seoDescription);
      if (item.binName !== undefined) specMap.set("bin name", item.binName);
      if (item.tags !== undefined) specMap.set("tags", item.tags);

      const labelNames: Record<string, string> = {
        sku: "SKU",
        barcode: "Barcode",
        vendor: "Vendor",
        "product type": "Product Type",
        "compare-at price": "Compare-at Price",
        "cost per item": "Cost per item",
        "page title": "Page Title",
        "meta description": "Meta Description",
        "bin name": "Bin Name",
        tags: "Tags",
      };

      const updatedSpecs: { label: string; value: string }[] = [];
      for (const [key, val] of specMap.entries()) {
        const label = labelNames[key] || key;
        updatedSpecs.push({ label, value: val });
      }

      const newName = item.name !== undefined ? item.name : existing.name;
      const newDesc = item.description !== undefined ? item.description : existing.description;
      const newCategory =
        item.category !== undefined
          ? item.category
          : item.type !== undefined
          ? item.type
          : existing.category;
      const newPriceUsd =
        item.price !== undefined
          ? parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0
          : parseFloat(existing.priceUsd) || 0;
      const newInventory =
        item.available !== undefined
          ? parseInt(String(item.available).replace(/[^0-9]/g, ""), 10) || 0
          : existing.inventory ?? 0;
      const newStatus =
        (item.status as "Active" | "Draft" | "Archived" | "Unlisted") || existing.status || "Active";
      const newSlug = item.seoHandle
        ? item.seoHandle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : existing.slug;
      const newImages =
        item.images !== undefined
          ? item.images
          : item.imageSrc
          ? [item.imageSrc]
          : existing.images;

      await db
        .update(products)
        .set({
          name: newName,
          description: newDesc,
          category: newCategory,
          priceUsd: newPriceUsd.toFixed(2),
          inventory: newInventory,
          inStock: newInventory > 0 && newStatus === "Active",
          status: newStatus,
          slug: newSlug,
          images: newImages,
          specs: updatedSpecs,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existing.id));

      updatedCount++;
    }

    safeRevalidate("/admin/products");
    safeRevalidate("/admin/products/inventory");
    safeRevalidate("/products");
    safeRevalidate("/");

    return { success: true, count: updatedCount };
  } catch (error) {
    console.error("❌ Failed to save bulk editor products:", error);
    return { success: false, count: 0, error: String(error) };
  }
}



