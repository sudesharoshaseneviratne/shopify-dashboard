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
      title: "Product Not Found | Prasanthi Craft",
      description: "The requested product does not exist in the store catalog.",
    };
  }

  return {
    title: `${product.name} | Prasanthi Craft`,
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
