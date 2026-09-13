import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { client, db } from "./index";
import { collections, productCollections, products } from "./schema";

const DEFAULT_COLLECTIONS = [
  {
    id: "featured-products",
    title: "Featured Products",
    slug: "featured-products",
    description: "Curated store selections and highlighted products on the homepage.",
    icon: "Sparkles",
    badge: "Homepage Section",
    sortOrder: 0,
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    slug: "new-arrivals",
    description: "New term arrivals and latest product releases on the homepage.",
    icon: "PackageCheck",
    badge: "Homepage Section",
    sortOrder: 0,
  },
  {
    id: "best-sellers",
    title: "Best Sellers",
    slug: "best-sellers",
    description: "Top-rated customer favorite products showcased on the homepage.",
    icon: "Award",
    badge: "Homepage Section",
    sortOrder: 0,
  },
  {
    id: "all-products",
    title: "All Products",
    slug: "all-products",
    description: "Complete product catalog showcase on the homepage.",
    icon: "Layers",
    badge: "Homepage Section",
    sortOrder: 0,
  },
  {
    id: "books-workbooks",
    title: "Books & Workbooks",
    slug: "books-workbooks",
    description: "Educational textbooks, curriculum workbooks, guides, and reference literature.",
    icon: "BookOpen",
    badge: "Bestsellers",
    sortOrder: 1,
  },
  {
    id: "tech-electronics",
    title: "Tech & Electronics",
    slug: "tech-electronics",
    description: "Scientific calculators, smart study accessories, audio devices, and digital learning tools.",
    icon: "Cpu",
    badge: "Tech Essentials",
    sortOrder: 2,
  },
  {
    id: "stationery-office",
    title: "Stationery & Office",
    slug: "stationery-office",
    description: "Premium notebooks, fine pens, planners, organizers, and office supplies.",
    icon: "Layers",
    badge: "Premium Quality",
    sortOrder: 3,
  },
  {
    id: "school-essentials",
    title: "School Essentials",
    slug: "school-essentials",
    description: "Backpacks, pencil cases, geometry kits, art supplies, and daily classroom gear.",
    icon: "Package",
    badge: "Student Favorite",
    sortOrder: 4,
  },
  {
    id: "novelties-gifts",
    title: "Novelties & Gifts",
    slug: "novelties-gifts",
    description: "Curated gift sets, educational games, bookmarks, and creative collectibles.",
    icon: "Gift",
    badge: "Curated Gifts",
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
