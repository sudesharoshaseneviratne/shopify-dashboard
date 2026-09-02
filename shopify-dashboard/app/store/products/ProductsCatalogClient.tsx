"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  ChevronRight, 
  RotateCcw, 
  Sparkles,
  Grid3X3,
  LayoutGrid
} from "lucide-react";
import { type StoreProduct, type StoreCollection } from "@/lib/store/products";
import { ProductCard } from "@/components/store/ProductCard";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "reviews";
type PriceRange = "all" | "under-300" | "300-1000" | "over-1000";

interface ProductsCatalogClientProps {
  initialProducts: StoreProduct[];
  collections?: StoreCollection[];
}

export function ProductsCatalogClient({ initialProducts, collections }: ProductsCatalogClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q");

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "All Protocol Gear"
  );
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [securityFilter, setSecurityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Sync state if URL search params change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  const categoriesList = useMemo(() => {
    const dynamicCats = collections && collections.length > 0
      ? collections.map((c) => c.title)
      : ["Cold Storage", "Mining & ASICs", "Sovereign Nodes", "Cryptographic Relics", "Security & Backup"];

    return ["All Protocol Gear", ...dynamicCats];
  }, [collections]);

  // Filter & Sort Products from live database
  const filteredAndSortedProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All Protocol Gear" ||
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      let matchesPrice = true;
      if (priceRange === "under-300") matchesPrice = product.priceUsd < 300;
      else if (priceRange === "300-1000") matchesPrice = product.priceUsd >= 300 && product.priceUsd <= 1000;
      else if (priceRange === "over-1000") matchesPrice = product.priceUsd > 1000;

      // In-stock filter
      const matchesStock = !inStockOnly || product.inventory > 0;

      // Security rating filter
      const matchesSecurity =
        securityFilter === "all" ||
        product.securityRating === securityFilter ||
        (product.badge && product.badge.includes(securityFilter));

      return matchesCategory && matchesSearch && matchesPrice && matchesStock && matchesSecurity;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceUsd - b.priceUsd;
      if (sortBy === "price-desc") return b.priceUsd - a.priceUsd;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [initialProducts, selectedCategory, searchQuery, priceRange, inStockOnly, securityFilter, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "All Protocol Gear" ||
    searchQuery !== "" ||
    priceRange !== "all" ||
    inStockOnly ||
    securityFilter !== "all";

  const resetFilters = () => {
    setSelectedCategory("All Protocol Gear");
    setSearchQuery("");
    setPriceRange("all");
    setInStockOnly(false);
    setSecurityFilter("all");
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/store" className="hover:text-slate-900 transition">
          Vault Mainnet
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-amber-700 font-bold">Complete Hardware Catalog</span>
      </nav>

      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>FULL SOVEREIGN INVENTORY</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900">
            Protocol Hardware <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-body max-w-2xl leading-relaxed">
            Browse mathematical cold storage keys, ultra-silent residential hydro miners, dedicated sovereign nodes, and indestructible seed vaults.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search chips, signers, nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-full pl-10 pr-4 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-xs"
          />
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="space-y-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-bold shadow-sm"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Controls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Price Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Price:</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-300">Under $300</option>
                <option value="300-1000">$300 - $1,000</option>
                <option value="over-1000">Over $1,000</option>
              </select>
            </div>

            {/* Security Standard Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Security:</span>
              <select
                value={securityFilter}
                onChange={(e) => setSecurityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Standards</option>
                <option value="CC EAL6+ Certified">EAL6+ Certified</option>
                <option value="Hardware Secure Boot">Secure Boot</option>
                <option value="FIPS 140-3 Level 4">FIPS 140-3</option>
                <option value="BIP-174 Air-Gapped">BIP-174 Air-Gap</option>
              </select>
            </div>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 select-none font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-amber-500"
              />
              <span>In-Stock Only</span>
            </label>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            {/* Grid Columns Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1 rounded cursor-pointer ${gridCols === 3 ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                title="3 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1 rounded cursor-pointer ${gridCols === 4 ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                title="4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-amber-700 font-bold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-medium">
        <div>
          Showing <strong className="text-slate-900">{filteredAndSortedProducts.length}</strong> sovereign hardware artifacts
        </div>
        {searchQuery && (
          <div>
            Filtered by query: "<span className="text-amber-700 font-bold">{searchQuery}</span>"
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
        } gap-6`}
      >
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">No Sovereign Hardware Found</h3>
          <p className="text-xs font-mono text-slate-500 max-w-md mx-auto">
            No hardware artifacts match your active filter criteria. Try adjusting your search query, price range, or category.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:scale-105 transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
