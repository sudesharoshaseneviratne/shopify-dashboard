"use server";

import { db } from "@/lib/db";
import { products, collections, productCollections } from "@/lib/db/schema";
import { eq, inArray, desc, or } from "drizzle-orm";
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
        category: p.category || "Hardware",
        channels: p.status === "Archived" ? "0" : "4",
        type: p.category || "General",
        vendor: "Satoshi DeFi",
        noImage: imagesArr.length === 0,
        image: imagesArr[0] || null,
        price: `$${priceNum.toFixed(2)}`,
        rawPrice: priceNum,
        comparePrice: `$${(priceNum * 1.15).toFixed(2)}`,
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
      tagline: input.tagline || `${input.name} - Sovereign Hardware`,
      category: input.category || "Cold Storage",
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
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

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
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

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
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

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
        leadTime: row.leadTime || "Instant Vault Dispatch",
        colorAccent: row.colorAccent || "#FFB800",
        vendor: "Satoshi DeFi",
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
        leadTime: mock.leadTime,
        colorAccent: mock.colorAccent,
        vendor: "Satoshi DeFi",
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
        tagline: input.tagline || `${input.name} - Sovereign Hardware`,
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
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");
    safeRevalidate(`/store/products/${id}`);

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
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");
    safeRevalidate(`/store/products/${id}`);

    return { success: true, inventory: safeInventory };
  } catch (error) {
    console.error(`❌ Failed to update inventory for product ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

