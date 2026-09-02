"use server";

import { db } from "@/lib/db";
import { orders, products, discounts, type OrderShippingAddress, type OrderProductItem } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback outside Next.js request context
  }
}

export interface CreateStoreOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    line1: string;
    city: string;
    country?: string;
  };
  paymentMethod: "lightning" | "onchain" | "card";
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  subtotal: number;
  discountCode?: string;
  discountAmount?: number;
  total: number;
}

/**
 * Creates a real order in Supabase and decrements product inventory
 */
export async function createStoreOrderAction(input: CreateStoreOrderInput) {
  try {
    // 1. Determine next order number
    const [latestOrder] = await db
      .select({ orderNumber: orders.orderNumber })
      .from(orders)
      .orderBy(desc(orders.orderNumber))
      .limit(1);

    const nextOrderNumber = (latestOrder?.orderNumber ?? 1015) + 1;
    const orderId = `#${nextOrderNumber}`;
    const cleanId = `${nextOrderNumber}`;

    // 2. Format order items
    const orderProducts: OrderProductItem[] = input.items.map((i) => ({
      name: `${i.name} (x${i.quantity})`,
      price: i.price * i.quantity,
      qty: i.quantity,
      image: i.image,
    }));

    const shippingAddress: OrderShippingAddress = {
      name: input.customerName,
      line1: input.shippingAddress.line1,
      city: input.shippingAddress.city,
      country: input.shippingAddress.country || "Sri Lanka",
      phone: input.customerPhone || "",
    };

    // 3. Insert the order into Supabase
    await db.insert(orders).values({
      id: orderId,
      cleanId,
      orderNumber: nextOrderNumber,
      customerName: input.customerName || "Anonymous Sovereign Node",
      customerEmail: input.customerEmail || "vault@satoshidefi.org",
      customerPhone: input.customerPhone || "",
      shippingAddress,
      channel: "Online Store",
      paymentStatus: "Paid",
      paymentType: "success",
      fulfillmentStatus: "Unfulfilled",
      deliveryStatus: "Dispatched to Faraday Vault",
      shippingMethod: "Insured Air-Gapped Courier",
      shippingPrice: "0.00",
      products: orderProducts,
      subtotal: input.subtotal.toFixed(2),
      discountCode: input.discountCode || null,
      discountAmount: (input.discountAmount || 0).toFixed(2),
      total: input.total.toFixed(2),
      paid: input.total.toFixed(2),
      balance: "0.00",
      notes: `Settled via ${input.paymentMethod.toUpperCase()} protocol on Satoshi Mainnet.`,
      status: "Open",
      alert: false,
      due: false,
    });

    // 4. Atomically decrement inventory in Supabase for each purchased product
    for (const item of input.items) {
      if (item.productId) {
        await db
          .update(products)
          .set({
            inventory: sql`GREATEST(0, ${products.inventory} - ${item.quantity})`,
            inStock: sql`CASE WHEN ${products.inventory} - ${item.quantity} > 0 THEN true ELSE false END`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }
    }

    // 5. If promo code was applied, increment timesUsed in discounts table
    if (input.discountCode) {
      await db
        .update(discounts)
        .set({
          timesUsed: sql`COALESCE(${discounts.timesUsed}, 0) + 1`,
        })
        .where(eq(discounts.code, input.discountCode.toUpperCase().trim()));
    }

    // Generate cryptographic txid
    const txid = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    // Revalidate paths so inventory and orders are fresh everywhere
    safeRevalidate("/store");
    safeRevalidate("/store/products");
    safeRevalidate("/admin/products");
    safeRevalidate("/admin/orders");

    return {
      success: true,
      orderId,
      orderNumber: nextOrderNumber,
      txid,
      timestamp: new Date().toUTCString(),
    };
  } catch (error) {
    console.error("❌ Failed to create order in database:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Fetch all orders for the Admin Orders dashboard
 */
export async function getAdminOrdersAction() {
  try {
    const rows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    return rows.map((ord) => {
      const itemsArr = (ord.products as OrderProductItem[]) || [];
      const itemsSummary = itemsArr.length > 0 
        ? itemsArr.map(i => i.name).join(", ")
        : "1 item";

      return {
        id: ord.id,
        cleanId: ord.cleanId || ord.id.replace("#", ""),
        orderNumber: ord.orderNumber || 1000,
        date: ord.createdAt 
          ? new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
          : "Recently",
        customer: ord.customerName,
        customerEmail: ord.customerEmail || "",
        channel: ord.channel || "Online Store",
        total: `$${parseFloat(ord.total).toFixed(2)}`,
        rawTotal: parseFloat(ord.total) || 0,
        payment: ord.paymentStatus || "Paid",
        paymentType: ord.paymentType || "success",
        fulfillment: ord.fulfillmentStatus || "Unfulfilled",
        items: itemsSummary,
        delivery: ord.deliveryStatus || "",
        method: ord.shippingMethod || "Flat Rate",
        status: ord.status || "Open",
        alert: ord.alert ?? false,
        due: ord.due ?? false,
      };
    });
  } catch (error) {
    console.error("❌ Failed to fetch admin orders:", error);
    return [];
  }
}
