import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { client, db } from "./index";
import { collections, productCollections, products } from "./schema";

const DEFAULT_COLLECTIONS = [
  {
    id: "cold-storage",
    title: "Cold Storage",
    slug: "cold-storage",
    description: "Zero RF, air-gapped cryptographic hardware signers with CC EAL6+ element isolation.",
    icon: "Shield",
    badge: "CC EAL6+ Sealed",
    sortOrder: 1,
  },
  {
    id: "mining-asics",
    title: "Mining & ASICs",
    slug: "mining-asics",
    description: "Ultra-silent liquid cooled SHA-256 home mining hardware for boutique hashers.",
    icon: "Cpu",
    badge: "Liquid Cooled 21 J/TH",
    sortOrder: 2,
  },
  {
    id: "sovereign-nodes",
    title: "Sovereign Nodes",
    slug: "sovereign-nodes",
    description: "Dedicated Bitcoin Core & Lightning appliances with zero cloud telemetry.",
    icon: "Server",
    badge: "Non-Custodial ZK",
    sortOrder: 3,
  },
  {
    id: "security-backup",
    title: "Security & Backup",
    slug: "security-backup",
    description: "Indestructible titanium seed matrices, Faraday capsules, and tamper shields.",
    icon: "Lock",
    badge: "Indestructible Titanium",
    sortOrder: 4,
  },
  {
    id: "cryptographic-relics",
    title: "Cryptographic Relics",
    slug: "cryptographic-relics",
    description: "Physical Bitcoin genesis ingots, commemorative proof bars, and sovereign collectibles.",
    icon: "Sparkles",
    badge: "24K .9999 Proof Bar",
    sortOrder: 5,
  },
];

export async function runCollectionsSeed() {
  console.log("🚀 Initializing Collections & Product-Collections Tables in Supabase...");

  try {
    // 1. Create tables if they do not exist
    await client`
      CREATE TABLE IF NOT EXISTS "collections" (
        "id" text PRIMARY KEY,
        "title" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "description" text DEFAULT '',
        "image" text,
        "icon" text DEFAULT 'Shield',
        "badge" text DEFAULT '',
        "sort_order" integer DEFAULT 0,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now()
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS "product_collections" (
        "product_id" text NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "collection_id" text NOT NULL REFERENCES "collections"("id") ON DELETE CASCADE,
        "created_at" timestamp with time zone DEFAULT now(),
        PRIMARY KEY ("product_id", "collection_id")
      );
    `;

    console.log("✅ Tables verified/created successfully.");

    // 2. Seed Default Collections
    console.log("📦 Seeding core collections...");
    for (const col of DEFAULT_COLLECTIONS) {
      await db
        .insert(collections)
        .values(col)
        .onConflictDoUpdate({
          target: collections.id,
          set: {
            title: col.title,
            slug: col.slug,
            description: col.description,
            icon: col.icon,
            badge: col.badge,
            sortOrder: col.sortOrder,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${DEFAULT_COLLECTIONS.length} core collections.`);

    // 3. Link Existing Products to Collections based on product.category
    const allProducts = await db.select({ id: products.id, category: products.category }).from(products);
    console.log(`🔗 Linking ${allProducts.length} products to matching collections...`);

    for (const p of allProducts) {
      const matchingCol = DEFAULT_COLLECTIONS.find(
        (c) => c.title.toLowerCase() === (p.category || "").toLowerCase()
      );

      if (matchingCol) {
        await db
          .insert(productCollections)
          .values({
            productId: p.id,
            collectionId: matchingCol.id,
          })
          .onConflictDoNothing();
      }
    }

    console.log("🎉 Collections initialization and linking complete!");
  } catch (error) {
    console.error("❌ Collections seed failed:", error);
    throw error;
  }
}

// Auto-run if executed directly
if (require.main === module || process.argv[1]?.includes("seed-collections")) {
  runCollectionsSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
