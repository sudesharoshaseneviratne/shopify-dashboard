"use server";

import { uploadToSupabaseStorage, isSupabaseStorageReady } from "@/lib/storage/supabase";
import { uploadToR2, isR2Configured } from "@/lib/storage/r2";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  provider?: "supabase" | "cloudflare" | "local";
  error?: string;
}

/**
 * Server action to handle image uploads from the Admin panel directly to Supabase Storage
 */
export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return { success: false, error: "No file provided in form data." };
    }

    // 1. Validate file size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: "File size exceeds 8MB limit." };
    }

    // 2. Validate MIME type
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif"
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return { 
        success: false, 
        error: `Unsupported image format (${file.type}). Use PNG, JPG, WebP, SVG, or AVIF.` 
      };
    }

    // 3. Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Helper to format file size
    const formatBytes = (b: number) => {
      if (!b || b === 0) return "0 KB";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(b) / Math.log(k));
      return `${parseFloat((b / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const recordInDatabase = async (finalUrl: string, finalKey?: string, finalProvider: "supabase" | "cloudflare" | "local" = "supabase") => {
      try {
        const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const dotIdx = file.name.lastIndexOf(".");
        const ext = dotIdx !== -1 ? file.name.substring(dotIdx + 1).toUpperCase() : "IMG";
        const nameWithoutExt = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;

        await db.insert(files).values({
          id: fileId,
          name: nameWithoutExt,
          url: finalUrl,
          storageKey: finalKey,
          provider: finalProvider,
          size: file.size,
          sizeFormatted: formatBytes(file.size),
          mimeType: file.type,
          extension: ext,
          altText: nameWithoutExt.replace(/[-_]/g, " "),
          referencesCount: 1,
          referencesSummary: "1 product",
        }).onConflictDoNothing();

        try {
          revalidatePath("/admin/content/files");
        } catch {}
      } catch (dbErr) {
        console.warn("⚠️ Failed to record uploaded file in database:", dbErr);
      }
    };

    // 4. Upload to Supabase Storage (Primary free storage with 0 credit card requirement)
    const supabaseRes = await uploadToSupabaseStorage(buffer, file.name, file.type);
    if (supabaseRes.success && supabaseRes.url) {
      const provider = isSupabaseStorageReady ? "supabase" : "local";
      await recordInDatabase(supabaseRes.url, supabaseRes.key, provider);

      return {
        success: true,
        url: supabaseRes.url,
        key: supabaseRes.key,
        provider,
      };
    }

    // If Supabase upload encounters an error and R2 is configured, try R2 as a fallback
    if (isR2Configured()) {
      const r2Res = await uploadToR2(buffer, file.name, file.type);
      if (r2Res.success && r2Res.url) {
        await recordInDatabase(r2Res.url, r2Res.key, "cloudflare");

        return {
          success: true,
          url: r2Res.url,
          key: r2Res.key,
          provider: "cloudflare",
        };
      }
    }

    return {
      success: false,
      error: supabaseRes.error || "Failed to upload image to Supabase Storage.",
    };
  } catch (error) {
    console.error("❌ Failed to process image upload:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}
