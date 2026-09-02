import { db } from "./index";
import { sql } from "drizzle-orm";
import { products, collections, files } from "./schema";

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function extractFilename(url: string): { name: string; ext: string } {
  try {
    const parts = url.split("/");
    const fullName = decodeURIComponent(parts[parts.length - 1].split("?")[0]);
    // remove leading timestamp or random hash if prefixed like 1788380618286-i49wy-filename.jpg
    const match = fullName.match(/^\d+-[a-zA-Z0-9]+-(.+)$/);
    const cleanName = match ? match[1] : fullName;
    const dotIdx = cleanName.lastIndexOf(".");
    const ext = dotIdx !== -1 ? cleanName.substring(dotIdx + 1).toUpperCase() : "IMG";
    const nameOnly = dotIdx !== -1 ? cleanName.substring(0, dotIdx) : cleanName;
    return { name: nameOnly, ext };
  } catch {
    return { name: "Uploaded_Image", ext: "JPG" };
  }
}

async function migrateAndSeedFiles() {
  console.log("🚀 Migrating 'files' table in Supabase PostgreSQL...");

  // 1. Create files table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      storage_key TEXT,
      provider TEXT DEFAULT 'supabase',
      size INTEGER DEFAULT 0,
      size_formatted TEXT DEFAULT '0 KB',
      mime_type TEXT DEFAULT 'image/jpeg',
      extension TEXT DEFAULT 'JPG',
      alt_text TEXT DEFAULT '',
      references_count INTEGER DEFAULT 0,
      references_summary TEXT DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log("✅ 'files' table verified/created.");

  // 2. Query all products from Supabase
  const allProds = await db.select().from(products);
  const allCols = await db.select().from(collections);

  // Map to collect references
  const urlToRefs = new Map<string, { prods: string[]; cols: string[] }>();

  for (const prod of allProds) {
    const imgs: string[] = prod.images || [];
    for (const url of imgs) {
      if (!url || typeof url !== "string" || !url.startsWith("http")) continue;
      if (!urlToRefs.has(url)) {
        urlToRefs.set(url, { prods: [], cols: [] });
      }
      urlToRefs.get(url)!.prods.push(prod.name);
    }
  }

  for (const col of allCols) {
    const url = col.image;
    if (url && typeof url === "string" && url.startsWith("http")) {
      if (!urlToRefs.has(url)) {
        urlToRefs.set(url, { prods: [], cols: [] });
      }
      urlToRefs.get(url)!.cols.push(col.title);
    }
  }

  console.log(`Found ${urlToRefs.size} unique image URLs across existing products and collections.`);

  // 3. Backfill into files table
  let insertedCount = 0;
  for (const [url, refs] of urlToRefs.entries()) {
    const { name, ext } = extractFilename(url);
    const totalRefs = refs.prods.length + refs.cols.length;
    let refsSummary = "";
    if (refs.prods.length > 0 && refs.cols.length > 0) {
      refsSummary = `${refs.prods.length} product, ${refs.cols.length} collection`;
    } else if (refs.prods.length > 0) {
      refsSummary = `${refs.prods.length} product${refs.prods.length > 1 ? "s" : ""}`;
    } else if (refs.cols.length > 0) {
      refsSummary = `${refs.cols.length} collection${refs.cols.length > 1 ? "s" : ""}`;
    }

    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const storageKey = url.includes("/products/") ? `products/${url.split("/products/")[1]}` : null;

    try {
      await db
        .insert(files)
        .values({
          id: fileId,
          name,
          url,
          storageKey,
          provider: url.includes("supabase.co") ? "supabase" : url.includes("r2") ? "cloudflare" : "supabase",
          size: 45000,
          sizeFormatted: "45.0 KB",
          mimeType: ext === "PNG" ? "image/png" : ext === "WEBP" ? "image/webp" : "image/jpeg",
          extension: ext,
          altText: name.replace(/[-_]/g, " "),
          referencesCount: totalRefs,
          referencesSummary: refsSummary,
        })
        .onConflictDoUpdate({
          target: files.url,
          set: {
            referencesCount: totalRefs,
            referencesSummary: refsSummary,
            updatedAt: new Date(),
          },
        });
      insertedCount++;
    } catch (err) {
      console.warn(`Skipped or conflict for ${url}:`, err);
    }
  }

  console.log(`🎉 Backfill completed. Successfully registered ${insertedCount} file(s) in 'files' table.`);
}

migrateAndSeedFiles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
