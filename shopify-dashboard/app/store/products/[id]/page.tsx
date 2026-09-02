import React from "react";
import { getStoreProductById, getStoreProducts } from "@/lib/db/queries";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getStoreProductById(id);

  if (!product) {
    return {
      title: "Cryptographic Node Not Found | Satoshi DeFi",
      description: "The requested hardware slug does not exist on mainnet.",
    };
  }

  return {
    title: `${product.name} | Satoshi DeFi Store`,
    description: product.tagline || product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([
    getStoreProductById(id),
    getStoreProducts(),
  ]);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product?.id)
    .slice(0, 3);

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}
