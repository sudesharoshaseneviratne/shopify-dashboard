"use server";

import { db } from "@/lib/db";
import { files, products, collections } from "@/lib/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadToSupabaseStorage, isSupabaseStorageReady } from "@/lib/storage/supabase";
import { uploadToR2, isR2Configured } from "@/lib/storage/r2";

export interface AdminFileItem {
  id: string;
  name: string;
  url: string;
  storageKey?: string | null;
  provider: string;
  size: number;
  sizeFormatted: string;
  mimeType: string;
  extension: string;
  altText: string;
  referencesCount: number;
  referencesSummary: string;
  createdAt: string;
  updatedAt: string;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function extractFilename(nameOrUrl: string): { name: string; ext: string } {
  try {
    const parts = nameOrUrl.split("/");
    const fullName = decodeURIComponent(parts[parts.length - 1].split("?")[0]);
    const match = fullName.match(/^\d+-[a-zA-Z0-9]+-(.+)$/);
    const cleanName = match ? match[1] : fullName;
    const dotIdx = cleanName.lastIndexOf(".");
    const ext = dotIdx !== -1 ? cleanName.substring(dotIdx + 1).toUpperCase() : "FILE";
    const nameOnly = dotIdx !== -1 ? cleanName.substring(0, dotIdx) : cleanName;
    return { name: nameOnly, ext };
  } catch {
    return { name: "Uploaded_File", ext: "JPG" };
  }
}

/**
 * Fetch all files stored in the database, with updated references count
 */
export async function getAdminFilesAction(): Promise<AdminFileItem[]> {
  try {
    const allFiles = await db
      .select()
      .from(files)
      .orderBy(desc(files.createdAt));

    // Also get products and collections to accurately calculate current references
    const [allProds, allCols] = await Promise.all([
      db.select({ id: products.id, name: products.name, images: products.images }).from(products),
      db.select({ id: collections.id, title: collections.title, image: collections.image }).from(collections),
    ]);

    return allFiles.map((f) => {
      // Check references
      const matchingProducts = allProds.filter((p) => p.images?.includes(f.url));
      const matchingCollections = allCols.filter((c) => c.image === f.url);
      const totalRefs = matchingProducts.length + matchingCollections.length;

      let refsSummary = "";
      if (matchingProducts.length > 0 && matchingCollections.length > 0) {
        refsSummary = `${matchingProducts.length} product, ${matchingCollections.length} collection`;
      } else if (matchingProducts.length > 0) {
        refsSummary = `${matchingProducts.length} product${matchingProducts.length > 1 ? "s" : ""}`;
      } else if (matchingCollections.length > 0) {
        refsSummary = `${matchingCollections.length} collection${matchingCollections.length > 1 ? "s" : ""}`;
      }

      return {
        id: f.id,
        name: f.name,
        url: f.url,
        storageKey: f.storageKey,
        provider: f.provider || "supabase",
        size: f.size ?? 0,
        sizeFormatted: f.sizeFormatted || formatBytes(f.size ?? 0),
        mimeType: f.mimeType || "image/jpeg",
        extension: f.extension || "JPG",
        altText: f.altText || "",
        referencesCount: totalRefs,
        referencesSummary: refsSummary,
        createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: f.updatedAt ? f.updatedAt.toISOString() : new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("❌ Failed to fetch admin files from database:", error);
    return [];
  }
}

/**
 * Upload one or more files from the Content > Files section directly to Supabase
 */
export async function uploadFilesAction(formData: FormData): Promise<{ success: boolean; files?: AdminFileItem[]; error?: string }> {
  try {
    const rawFiles = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const fileList: File[] = rawFiles.length > 0 ? rawFiles : singleFile ? [singleFile] : [];

    if (fileList.length === 0) {
      return { success: false, error: "No files found in upload request." };
    }

    const uploadedItems: AdminFileItem[] = [];

    for (const file of fileList) {
      // Validate file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      let finalUrl = "";
      let finalKey = "";
      let provider = "supabase";

      // 1. Try Supabase Storage
      const supabaseRes = await uploadToSupabaseStorage(buffer, file.name, file.type);
      if (supabaseRes.success && supabaseRes.url) {
        finalUrl = supabaseRes.url;
        finalKey = supabaseRes.key || "";
        provider = isSupabaseStorageReady ? "supabase" : "local";
      } else if (isR2Configured()) {
        // Fallback to Cloudflare R2
        const r2Res = await uploadToR2(buffer, file.name, file.type);
        if (r2Res.success && r2Res.url) {
          finalUrl = r2Res.url;
          finalKey = r2Res.key || "";
          provider = "cloudflare";
        }
      }

      if (!finalUrl) {
        continue;
      }

      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const { name, ext } = extractFilename(file.name);
      const sizeFormatted = formatBytes(file.size);

      await db
        .insert(files)
        .values({
          id: fileId,
          name,
          url: finalUrl,
          storageKey: finalKey,
          provider,
          size: file.size,
          sizeFormatted,
          mimeType: file.type || "image/jpeg",
          extension: ext,
          altText: name.replace(/[-_]/g, " "),
          referencesCount: 0,
          referencesSummary: "",
        })
        .onConflictDoNothing();

      uploadedItems.push({
        id: fileId,
        name,
        url: finalUrl,
        storageKey: finalKey,
        provider,
        size: file.size,
        sizeFormatted,
        mimeType: file.type || "image/jpeg",
        extension: ext,
        altText: name.replace(/[-_]/g, " "),
        referencesCount: 0,
        referencesSummary: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    try {
      revalidatePath("/admin/content/files");
    } catch {}

    return { success: true, files: uploadedItems };
  } catch (error) {
    console.error("❌ Failed to upload files:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Register a file directly from an external URL
 */
export async function uploadFileFromUrlAction(url: string, customName?: string): Promise<{ success: boolean; file?: AdminFileItem; error?: string }> {
  try {
    if (!url || !url.startsWith("http")) {
      return { success: false, error: "Please enter a valid HTTP or HTTPS URL." };
    }

    const { name, ext } = extractFilename(customName || url);
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await db
      .insert(files)
      .values({
        id: fileId,
        name,
        url,
        storageKey: null,
        provider: url.includes("supabase.co") ? "supabase" : "external",
        size: 50000,
        sizeFormatted: "50.0 KB",
        mimeType: ext === "PNG" ? "image/png" : ext === "WEBP" ? "image/webp" : "image/jpeg",
        extension: ext,
        altText: name.replace(/[-_]/g, " "),
        referencesCount: 0,
        referencesSummary: "",
      })
      .onConflictDoNothing();

    try {
      revalidatePath("/admin/content/files");
    } catch {}

    return {
      success: true,
      file: {
        id: fileId,
        name,
        url,
        storageKey: null,
        provider: "external",
        size: 50000,
        sizeFormatted: "50.0 KB",
        mimeType: ext === "PNG" ? "image/png" : "image/jpeg",
        extension: ext,
        altText: name.replace(/[-_]/g, " "),
        referencesCount: 0,
        referencesSummary: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("❌ Failed to register file from URL:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete a single file by ID
 */
export async function deleteFileAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(files).where(eq(files.id, id));

    try {
      revalidatePath("/admin/content/files");
    } catch {}

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete file:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Bulk delete files by IDs
 */
export async function bulkDeleteFilesAction(ids: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ids || ids.length === 0) return { success: true };

    await db.delete(files).where(inArray(files.id, ids));

    try {
      revalidatePath("/admin/content/files");
    } catch {}

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to bulk delete files:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update alt text for a file
 */
export async function updateFileAltTextAction(id: string, altText: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(files)
      .set({ altText, updatedAt: new Date() })
      .where(eq(files.id, id));

    try {
      revalidatePath("/admin/content/files");
    } catch {}

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to update file alt text:", error);
    return { success: false, error: String(error) };
  }
}
