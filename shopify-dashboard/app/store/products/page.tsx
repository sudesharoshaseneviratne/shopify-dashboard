import React, { Suspense } from "react";
import { getStoreProducts, getStoreCollections } from "@/lib/db/queries";
import { ProductsCatalogClient } from "./ProductsCatalogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocol Hardware Catalog | Satoshi DeFi",
  description: "Browse mathematical cold storage keys, ultra-silent residential hydro miners, dedicated sovereign nodes, and indestructible seed vaults.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsCatalogPage() {
  const [products, collections] = await Promise.all([
    getStoreProducts(),
    getStoreCollections(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center font-mono text-sm text-slate-500">Loading catalog...</div>}>
      <ProductsCatalogClient initialProducts={products} collections={collections} />
    </Suspense>
  );
}
