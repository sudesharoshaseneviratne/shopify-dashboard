import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseStorageReady = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseKey.includes("your-anon-key")
);

export const supabaseStorage = createClient(supabaseUrl, supabaseKey);

export const BUCKET_NAME = "products";

/**
 * Uploads a file buffer directly to the public 'products' Supabase Storage Bucket
 */
export async function uploadToSupabaseStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ success: boolean; url: string; key: string; error?: string }> {
  try {
    const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanName}`;

    if (!isSupabaseStorageReady) {
      // Graceful local base64 fallback if Supabase key hasn't been pasted yet
      const base64 = buffer.toString("base64");
      return {
        success: true,
        url: `data:${contentType};base64,${base64}`,
        key: filePath,
      };
    }

    const { data, error } = await supabaseStorage.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType,
        cacheControl: "31536000", // 1 year cache for fast CDN delivery
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage upload error:", error);
      throw error;
    }

    const { data: publicUrlData } = supabaseStorage.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      key: filePath,
    };
  } catch (err: any) {
    console.error("❌ Failed to upload to Supabase Storage:", err);
    return {
      success: false,
      url: "",
      key: "",
      error: err.message || String(err),
    };
  }
}
