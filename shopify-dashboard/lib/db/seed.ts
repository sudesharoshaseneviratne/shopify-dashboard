import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { db, client } from "./index";
import { products, orders, discounts, storeSettings } from "./schema";
import { STORE_PRODUCTS } from "../store/products";
import { initialOrdersList } from "../admin/ordersData";

async function runSeed() {
  console.log("🌱 Starting Satoshi DeFi Database Seeder...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL is not set in .env.local. Aborting seed.");
    process.exit(1);
  }

  try {
    // 1. Seed Store Settings
    console.log("⚙️  Seeding Store Settings...");
    await db
      .insert(storeSettings)
      .values({
        id: 1,
        storeName: "SATOSHI DEFI",
        supportPhone: "+9475 245 5812",
        supportEmail: "support@satoshidefi.vault",
        freeShippingThreshold: "5000.00",
        standardShippingFee: "350.00",
        marqueeAnnouncement: "USE VOUCHER CODE SATOSHI21 FOR 21% OFF",
        btcUsdRate: "95240.00",
        isMaintenanceMode: false,
      })
      .onConflictDoNothing();

    // 2. Seed Default Promo Code: SATOSHI21
    console.log("🎟️  Seeding Promo Code (SATOSHI21)...");
    await db
      .insert(discounts)
      .values({
        id: "discount-satoshi-21",
        code: "SATOSHI21",
        discountPercent: 21,
        discountAmount: "0.00",
        minOrderAmount: "0.00",
        usageLimit: 500,
        timesUsed: 14,
        isActive: true,
      })
      .onConflictDoNothing();

    // 3. Seed Products from Store Catalog
    console.log(`📦 Seeding ${STORE_PRODUCTS.length} Hardware Products...`);
    for (const prod of STORE_PRODUCTS) {
      await db
        .insert(products)
        .values({
          id: prod.id,
          name: prod.name,
          slug: prod.id,
          tagline: prod.tagline,
          category: prod.category,
          priceUsd: prod.priceUsd.toFixed(2),
          priceSats: prod.priceSats,
          rating: prod.rating.toFixed(2),
          reviewsCount: prod.reviewsCount,
          inStock: prod.inStock,
          inventory: prod.inventory,
          featured: prod.featured,
          badge: prod.badge || "",
          description: prod.description,
          features: prod.features,
          specs: prod.specs,
          firmwareVersion: prod.firmwareVersion,
          securityRating: prod.securityRating,
          leadTime: prod.leadTime,
          colorAccent: prod.colorAccent,
          images: [],
        })
        .onConflictDoNothing();
    }

    // 4. Seed Initial Orders
    console.log(`🛒 Seeding ${initialOrdersList.length} Initial Admin Orders...`);
    for (const ord of initialOrdersList) {
      // Parse clean number e.g. "Rs 2,060.00" -> 2060.00
      const totalParsed = parseFloat(ord.total.replace(/[^0-9.]/g, "")) || 0;

      await db
        .insert(orders)
        .values({
          id: ord.id,
          cleanId: ord.id.replace("#", ""),
          orderNumber: parseInt(ord.id.replace("#", ""), 10) || 1000,
          customerName: ord.customer,
          channel: ord.channel,
          paymentStatus: ord.payment,
          paymentType: ord.paymentType,
          fulfillmentStatus: ord.fulfillment,
          deliveryStatus: ord.delivery || "",
          shippingMethod: ord.method,
          shippingPrice: "350.00",
          products: [{ name: ord.items, price: totalParsed, qty: 1 }],
          subtotal: totalParsed.toFixed(2),
          total: totalParsed.toFixed(2),
          paid: ord.payment === "Paid" ? totalParsed.toFixed(2) : "0.00",
          balance: ord.payment === "Paid" ? "0.00" : totalParsed.toFixed(2),
          status: ord.status,
          alert: ord.alert,
          due: ord.due,
        })
        .onConflictDoNothing();
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (err) {
    console.error("❌ Error while seeding database:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
