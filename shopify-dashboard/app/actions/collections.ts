"use server";

import { db } from "@/lib/db";
import { collections, productCollections, products } from "@/lib/db/schema";
import { eq, inArray, desc, asc, or, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface AdminCollectionItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  icon: string;
  badge: string;
  productsCount: number;
  conditions: string;
  updated: string;
}

export interface CreateCollectionInput {
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  badge?: string;
  productIds?: string[];
}

export interface UpdateCollectionInput {
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  badge?: string;
  productIds?: string[];
}

function safeRevalidate(path: string, type?: "layout" | "page") {
  try {
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
  } catch {
    // Graceful no-op in non-request contexts
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fetch all collections for Admin Dashboard with live product count
 */
export async function getAdminCollectionsAction(): Promise<AdminCollectionItem[]> {
  try {
    const colRows = await db
      .select()
      .from(collections)
      .orderBy(asc(collections.sortOrder), desc(collections.updatedAt));

    const allProducts = await db
      .select({ id: products.id, category: products.category })
      .from(products);

    const relations = await db.select().from(productCollections);

    return colRows.map((col) => {
      const linkedProductIds = new Set(
        relations
          .filter((r) => r.collectionId === col.id)
          .map((r) => r.productId)
      );

      const count = allProducts.filter(
        (p) =>
          (p.category && p.category.toLowerCase() === col.title.toLowerCase()) ||
          linkedProductIds.has(p.id)
      ).length;

      const dateObj = col.updatedAt || col.createdAt || new Date();
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date(dateObj));

      return {
        id: col.id,
        title: col.title,
        slug: col.slug,
        description: col.description || "",
        image: col.image || null,
        icon: col.icon || "Shield",
        badge: col.badge || "",
        productsCount: count,
        conditions: "Manual",
        updated: formattedDate,
      };
    });
  } catch (error) {
    console.error("❌ Failed to fetch admin collections:", error);
    return [];
  }
}

/**
 * Fetch a single collection by ID or slug with its assigned products
 */
export async function getAdminCollectionByIdAction(idOrSlug: string) {
  try {
    const [col] = await db
      .select()
      .from(collections)
      .where(or(eq(collections.id, idOrSlug), eq(collections.slug, idOrSlug)))
      .limit(1);

    if (!col) return null;

    // Fetch linked products
    const relations = await db
      .select()
      .from(productCollections)
      .where(eq(productCollections.collectionId, col.id));

    const linkedIds = relations.map((r) => r.productId);

    const allDbProducts = await db.select().from(products);

    const assignedProducts = allDbProducts
      .filter(
        (p) =>
          (p.category && p.category.toLowerCase() === col.title.toLowerCase()) ||
          linkedIds.includes(p.id)
      )
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: `$${parseFloat(p.priceUsd).toFixed(2)}`,
        status: p.status || "Active",
        image: (p.images as string[])?.[0] || null,
        inventory: p.inventory ?? 0,
      }));

    return {
      id: col.id,
      title: col.title,
      slug: col.slug,
      description: col.description || "",
      image: col.image || null,
      icon: col.icon || "Shield",
      badge: col.badge || "",
      assignedProducts,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch collection ${idOrSlug}:`, error);
    return null;
  }
}

/**
 * Create a new collection in Supabase and associate selected products
 */
export async function createCollectionAction(input: CreateCollectionInput) {
  try {
    const baseSlug = input.slug || slugify(input.title);
    const id = baseSlug;

    // Insert collection
    await db
      .insert(collections)
      .values({
        id,
        title: input.title.trim(),
        slug: baseSlug,
        description: input.description || "",
        image: input.image || null,
        icon: input.icon || "Shield",
        badge: input.badge || "",
        sortOrder: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: collections.id,
        set: {
          title: input.title.trim(),
          description: input.description || "",
          image: input.image || null,
          updatedAt: new Date(),
        },
      });

    // Link products
    if (input.productIds && input.productIds.length > 0) {
      for (const prodId of input.productIds) {
        await db
          .insert(productCollections)
          .values({
            productId: prodId,
            collectionId: id,
          })
          .onConflictDoNothing();
      }
    }

    safeRevalidate("/admin/products/collections");
    safeRevalidate("/admin/products");
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

    return { success: true, id };
  } catch (error) {
    console.error("❌ Failed to create collection:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update an existing collection and its product associations
 */
export async function updateCollectionAction(id: string, input: UpdateCollectionInput) {
  try {
    const updates: Partial<typeof collections.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input.title !== undefined) updates.title = input.title.trim();
    if (input.slug !== undefined) updates.slug = input.slug.trim();
    if (input.description !== undefined) updates.description = input.description;
    if (input.image !== undefined) updates.image = input.image;
    if (input.icon !== undefined) updates.icon = input.icon;
    if (input.badge !== undefined) updates.badge = input.badge;

    await db
      .update(collections)
      .set(updates)
      .where(or(eq(collections.id, id), eq(collections.slug, id)));

    // Update product associations if provided
    if (input.productIds !== undefined) {
      // Remove current associations
      await db
        .delete(productCollections)
        .where(eq(productCollections.collectionId, id));

      // Insert new associations
      for (const prodId of input.productIds) {
        await db
          .insert(productCollections)
          .values({
            productId: prodId,
            collectionId: id,
          })
          .onConflictDoNothing();
      }
    }

    safeRevalidate("/admin/products/collections");
    safeRevalidate(`/admin/products/collections/${id}`);
    safeRevalidate("/admin/products");
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to update collection ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete a collection by ID
 */
export async function deleteCollectionAction(id: string) {
  try {
    await db
      .delete(collections)
      .where(or(eq(collections.id, id), eq(collections.slug, id)));

    safeRevalidate("/admin/products/collections");
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to delete collection ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Bulk delete collections by IDs
 */
export async function bulkDeleteCollectionsAction(ids: string[]) {
  try {
    await db.delete(collections).where(inArray(collections.id, ids));

    safeRevalidate("/admin/products/collections");
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to bulk delete collections:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Add a product to a collection
 */
export async function addProductToCollectionAction(productId: string, collectionId: string) {
  try {
    await db
      .insert(productCollections)
      .values({ productId, collectionId })
      .onConflictDoNothing();

    safeRevalidate("/admin/products/collections");
    safeRevalidate(`/admin/products/collections/${collectionId}`);
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to add product to collection:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Remove a product from a collection
 */
export async function removeProductFromCollectionAction(productId: string, collectionId: string) {
  try {
    await db
      .delete(productCollections)
      .where(
        and(
          eq(productCollections.productId, productId),
          eq(productCollections.collectionId, collectionId)
        )
      );

    safeRevalidate("/admin/products/collections");
    safeRevalidate(`/admin/products/collections/${collectionId}`);
    safeRevalidate("/store", "layout");
    safeRevalidate("/store");
    safeRevalidate("/store/products");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to remove product from collection:", error);
    return { success: false, error: String(error) };
  }
}
