import React from "react";
import { getStoreProducts, getStoreCollections } from "@/lib/db/queries";
import { StoreHomeClient } from "./StoreHomeClient";

// Force dynamic fetching so any newly added product or photo shows immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StoreHomePage() {
  // Fetch live products and collections directly from Supabase via Drizzle
  const [products, collections] = await Promise.all([
    getStoreProducts(),
    getStoreCollections(),
  ]);

  return <StoreHomeClient products={products} collections={collections} />;
}
