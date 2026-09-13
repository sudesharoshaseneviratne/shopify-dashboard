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
import { StoreCollection, StoreProduct } from "@/lib/store/products";
import { isShowcaseCollection } from "@/lib/store/collections";
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
  // Helper to check if a product is linked to a collection by ID, slug, or title
  const isProductInCollection = (p: StoreProduct, keywords: string[]) => {
    if (!p.collections || p.collections.length === 0) return false;
    const lowerCols = p.collections.map((c) => c.toLowerCase());
    return keywords.some((k) => lowerCols.includes(k.toLowerCase()));
  };

  // 1. Featured Products section: Products assigned to "Featured Products" collection in dashboard (or marked featured)
  const assignedFeatured = products.filter((p) =>
    isProductInCollection(p, ["featured-products", "featured products", "featured"])
  );
  const featuredProducts = assignedFeatured.length > 0 ? assignedFeatured : products.filter((p) => p.featured);

  // 2. New Arrivals section: Products assigned to "New Arrivals" collection in dashboard (or newest catalog items)
  const assignedNewArrivals = products.filter((p) =>
    isProductInCollection(p, ["new-arrivals", "new arrivals"])
  );
  const newArrivalProducts = assignedNewArrivals.length > 0 ? assignedNewArrivals : products;

  // 3. Best Sellers section: Products assigned to "Best Sellers" collection in dashboard (or top reviews)
  const assignedBestSellers = products.filter((p) =>
    isProductInCollection(p, ["best-sellers", "best sellers", "bestsellers"])
  );
  const bestSellerProducts = assignedBestSellers.length > 0 
    ? assignedBestSellers 
    : [...products].sort((a, b) => b.reviewsCount - a.reviewsCount);

  // 4. All Products section: Products assigned to "All Products" collection (or all active catalog items)
  const assignedAllProducts = products.filter((p) =>
    isProductInCollection(p, ["all-products", "all products"])
  );
  const baseAllProducts = assignedAllProducts.length > 0 ? assignedAllProducts : products;

  // Filter out the 4 showcase collections so they NEVER appear in the category tabs!
  const productCollections = (collections || []).filter((c) => !isShowcaseCollection(c));

  // Category filter for the "All Products" grid section
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categoriesList = [
    "All", 
    ...(productCollections.length > 0
      ? productCollections.map((c) => c.title)
      : [
          "Books & Workbooks", 
          "Tech & Electronics", 
          "Stationery & Office", 
          "School Essentials", 
          "Novelties & Gifts"
        ])
  ];

  const filteredAllProducts = selectedCategory === "All" 
    ? baseAllProducts 
    : baseAllProducts.filter((p) => (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()));

  // Limit home page grid to 2 rows (4 columns = 8 products)
  const HOME_PRODUCTS_LIMIT = 8;
  const displayedProducts = filteredAllProducts.slice(0, HOME_PRODUCTS_LIMIT);

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
              <span>CURATED STORE SELECTIONS</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Products</span>
            </h2>
          </div>
          <Link 
            href="/products"
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
              <span>NEW TERM ARRIVALS</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              New <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Arrivals</span>
            </h2>
          </div>
          <Link 
            href="/products"
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
              <span>TOP RATED CUSTOMER FAVORITES</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Sellers</span>
            </h2>
          </div>
          <Link 
            href="/products"
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
              <span>EXPLORE FULL PRODUCT CATALOG</span>
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

        {/* 4-Column Product Grid (limited to 2 rows on desktop) */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={`all-${product.id}`} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 font-mono text-sm">
            No active products found in this category.
          </div>
        )}

        {/* Bottom Callout */}
        <div className="text-center pt-4 space-y-2">
          {filteredAllProducts.length > HOME_PRODUCTS_LIMIT && (
            <p className="text-xs font-mono text-slate-500">
              Showing {displayedProducts.length} of {filteredAllProducts.length} products
            </p>
          )}
          <Link
            href="/products"
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
