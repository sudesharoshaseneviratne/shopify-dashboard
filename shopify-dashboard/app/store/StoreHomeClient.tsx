"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  PackageCheck, 
  Award, 
  Layers 
} from "lucide-react";
import type { StoreProduct, StoreCollection } from "@/lib/store/products";
import { ProductCarousel } from "@/components/store/ProductCarousel";
import { ProductCard } from "@/components/store/ProductCard";
import { HomeBannerSlider } from "@/components/store/HomeBannerSlider";
import { EcommerceValueBar } from "@/components/store/EcommerceValueBar";
import { CategoryShowcase } from "@/components/store/CategoryShowcase";
import { StoreFAQ } from "@/components/store/StoreFAQ";

interface StoreHomeClientProps {
  products: StoreProduct[];
  collections?: StoreCollection[];
}

export function StoreHomeClient({ products, collections }: StoreHomeClientProps) {
  // Curated collections for the carousels: dynamic from Supabase
  const featuredProducts = products.filter((p) => p.featured);
  // New arrivals: latest products added appear first
  const newArrivalProducts = products.length > 0 ? products : [];
  const bestSellerProducts = [...products]
    .sort((a, b) => b.reviewsCount - a.reviewsCount);

  // Category filter for the "All Products" grid section
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categoriesList = [
    "All", 
    ...(collections && collections.length > 0
      ? collections.map((c) => c.title)
      : [
          "Cold Storage", 
          "Mining & ASICs", 
          "Sovereign Nodes", 
          "Security & Backup", 
          "Cryptographic Relics"
        ])
  ];

  const filteredAllProducts = selectedCategory === "All" 
    ? products 
    : products.filter((p) => (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()));

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Hero Slider Carousel Banner */}
      <HomeBannerSlider />

      {/* 2. Value Props / Trust Badges Bar */}
      <EcommerceValueBar />

      {/* 3. Featured Products Carousel Section */}
      <section id="featured-products" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-700 font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>HANDPICKED SOVEREIGN SUITE</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Products</span>
            </h2>
          </div>
          <Link 
            href="/store/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-950 border-2 border-black font-heading font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#FFB800] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Auto Scrolling Product Carousel */}
        <ProductCarousel products={featuredProducts.length > 0 ? featuredProducts : products} autoScrollSpeed={3800} />
      </section>

      {/* 4. New Arrivals Carousel Section */}
      <section id="new-arrivals" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-700 font-bold tracking-wider uppercase">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>LATEST PROTOCOL ADDITIONS</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              New <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Arrivals</span>
            </h2>
          </div>
          <Link 
            href="/store/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-950 border-2 border-black font-heading font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#FFB800] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
          >
            <span>Explore Releases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Auto Scrolling Product Carousel */}
        <ProductCarousel products={newArrivalProducts.length > 0 ? newArrivalProducts : products} autoScrollSpeed={4200} />
      </section>

      {/* 5. Best Sellers Carousel Section */}
      <section id="best-sellers" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-800 font-bold tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>HIGHEST VOLUME PROVEN GEAR</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Sellers</span>
            </h2>
          </div>
          <Link 
            href="/store/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-950 border-2 border-black font-heading font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#FFB800] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
          >
            <span>View Top Rated</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Auto Scrolling Product Carousel */}
        <ProductCarousel products={bestSellerProducts.length > 0 ? bestSellerProducts : products} autoScrollSpeed={3600} />
      </section>

      {/* 6. All Products Section */}
      <section id="all-products" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-700 font-bold tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>COMPLETE HARDWARE INVENTORY</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Products</span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer shrink-0 border-2 border-black ${
                  selectedCategory === cat
                    ? "bg-black text-white shadow-[2px_2px_0px_0px_#FFB800]"
                    : "bg-white hover:bg-slate-100 text-slate-800 shadow-none"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Grid */}
        {filteredAllProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAllProducts.map((product) => (
              <ProductCard key={`all-${product.id}`} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 font-mono text-sm">
            No active products found in this category.
          </div>
        )}

        {/* Bottom Callout */}
        <div className="text-center pt-4">
          <Link
            href="/store/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-black hover:bg-slate-900 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#FFB800] hover:shadow-[6px_6px_0px_0px_#FFB800] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Explore Complete Store Catalog ({products.length} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Shop by Category Showcase */}
      <div id="categories" className="scroll-mt-24">
        <CategoryShowcase collections={collections} />
      </div>

      {/* 8. E-Commerce FAQ Accordion */}
      <div id="faq" className="scroll-mt-24">
        <StoreFAQ />
      </div>
    </div>
  );
}
