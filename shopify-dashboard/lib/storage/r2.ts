import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const r2BucketName = process.env.R2_BUCKET_NAME || "shopify-products";
export const r2PublicUrl = process.env.NEXT_PUBLIC_R2_URL || process.env.R2_PUBLIC_DOMAIN || "";

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey);
}

/**
 * Cloudflare R2 S3-Compatible Client
 */
export const r2Client = isR2Configured()
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

/**
 * Uploads a file buffer directly to Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ success: boolean; url: string; key: string }> {
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueKey = `products/${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanName}`;

  if (!r2Client || !isR2Configured()) {
    // Graceful fallback when R2 credentials aren't yet populated
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;
    return {
      success: true,
      url: dataUrl,
      key: uniqueKey,
    };
  }

  const command = new PutObjectCommand({
    Bucket: r2BucketName,
    Key: uniqueKey,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  const finalUrl = r2PublicUrl
    ? `${r2PublicUrl.replace(/\/$/, "")}/${uniqueKey}`
    : `https://${r2BucketName}.${accountId}.r2.dev/${uniqueKey}`;

  return {
    success: true,
    url: finalUrl,
    key: uniqueKey,
  };
}
