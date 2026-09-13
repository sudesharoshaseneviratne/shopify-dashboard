import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { db, client } from "./index";
import { products, orders, discounts, storeSettings, customers } from "./schema";
import { STORE_PRODUCTS } from "../store/products";
import { initialOrdersList } from "../admin/ordersData";

async function runSeed() {
  console.log("🌱 Starting Prasanthi Craft Database Seeder...");

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
        storeName: "PRASANTHI CRAFT",
        supportPhone: "+9477 423 0976",
        supportEmail: "prasanthicrafts@gmail.com",
        freeShippingThreshold: "5000.00",
        standardShippingFee: "350.00",
        marqueeAnnouncement: "USE VOUCHER CODE WELCOME10 FOR 10% OFF",
        btcUsdRate: "320.00",
        isMaintenanceMode: false,
      })
      .onConflictDoNothing();

    // 2. Seed Default Promo Code: WELCOME10
    console.log("🎟️  Seeding Promo Code (WELCOME10)...");
    await db
      .insert(discounts)
      .values({
        id: "discount-welcome-10",
        code: "WELCOME10",
        discountPercent: 10,
        discountAmount: "0.00",
        minOrderAmount: "0.00",
        usageLimit: 1000,
        timesUsed: 12,
        isActive: true,
      })
      .onConflictDoNothing();

    // 3. Seed Products from Store Catalog
    console.log(`📦 Seeding ${STORE_PRODUCTS.length} Craft & Stationery Products...`);
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

    // 5. Seed Initial Customers
    console.log("👥 Seeding Initial Customers...");
    const initialCustomersList = [
      { id: "cust_seed_1", name: "Amila Upulitha", email: "upulitha84@gmail.com", phone: "0718376329", location: "Galle, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "20560.00" },
      { id: "cust_seed_2", name: "Wasantha Ekanayake", email: "ekanayakewasantha58@gmail.com", phone: "0771234567", location: "Kandy, Sri Lanka", subscription: "Subscribed", orders: 0, spent: "0.00" },
      { id: "cust_seed_3", name: "Fathima Hirshard", email: "hirshard.fathima@gmail.com", phone: "0768901234", location: "Colombo, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "2060.00" },
      { id: "cust_seed_4", name: "Isuru Abeyrama", email: "isuru.abey@outlook.com", phone: "0714567890", location: "Tangalle, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "3960.00" },
      { id: "cust_seed_5", name: "E. P. H. De Silva", email: "desilva.eph@yahoo.com", phone: "0782345678", location: "Polgolla, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "2436.00" },
      { id: "cust_seed_6", name: "Kavinda Perera", email: "kavinda.perera@gmail.com", phone: "+9475 245 5812", location: "Colombo, Sri Lanka", subscription: "Subscribed", orders: 3, spent: "14500.00" },
    ];

    for (const c of initialCustomersList) {
      await db
        .insert(customers)
        .values({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          location: c.location,
          subscriptionStatus: c.subscription,
          ordersCount: c.orders,
          totalSpent: c.spent,
          notes: "Seeded test customer",
          role: "customer",
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
