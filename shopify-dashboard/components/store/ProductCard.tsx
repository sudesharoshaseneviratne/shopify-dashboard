"use client";

import React from "react";
import Link from "next/link";
import { 
  Shield, 
  Cpu, 
  Server, 
  Lock, 
  Layers, 
  Star, 
  Eye, 
  Check, 
  Heart,
  ShoppingCart
} from "lucide-react";
import { StoreProduct } from "@/lib/store/products";
import { useCart } from "@/lib/store/cartContext";

interface ProductCardProps {
  product: StoreProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { 
    addItem, 
    formatPrice, 
    setQuickViewProduct, 
    toggleWishlist,
    isWishlisted,
  } = useCart();

  const [added, setAdded] = React.useState(false);
  const wishlisted = isWishlisted(product.id);

  // Distinct realistic discount percentages per product for realistic e-commerce variety
  const getDiscountPercent = (id: string) => {
    const discountsMap: Record<string, number> = {
      "coldkey-prime-mk4": 20,
      "orion-hydro-miner-140": 20,
      "sovereign-node-x1": 25,
      "genesis-block-gold-ingot": 20,
      "ciphersteel-24-matrix": 15,
      "nostr-pos-terminal": 18,
      "quantum-hsm-vault": 20,
      "air-gap-faraday-capsule": 12,
    };
    if (discountsMap[id]) return discountsMap[id];
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const defaults = [15, 20, 25, 18, 12, 22];
    return defaults[hash % defaults.length];
  };

  const discountPercent = getDiscountPercent(product.id);
  const compareAtPrice = Math.round(product.priceUsd / (1 - discountPercent / 100));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Determine category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cold Storage":
        return Shield;
      case "Mining & ASICs":
        return Cpu;
      case "Sovereign Nodes":
        return Server;
      case "Security & Backup":
        return Lock;
      default:
        return Layers;
    }
  };

  const CategoryIcon = getCategoryIcon(product.category);

  return (
    <div className="group relative rounded-2xl bg-white border-2 border-black flex flex-col justify-between transition-all duration-200 shadow-none hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-black overflow-hidden">
      {/* Background Decorative Watermark Icon */}
      <div className="absolute -right-6 -bottom-6 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-500 text-slate-800 transform rotate-12">
        <CategoryIcon className="w-44 h-44" />
      </div>

      {/* Top Full-Bleed Product Picture (Flush to Top, Left, and Right without Padding) */}
      <div className="relative w-full h-52 sm:h-56 bg-gradient-to-b from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-center overflow-hidden transition duration-200">
        
        {/* Top-Left Badge Inside the Image showing percentage off in Yellow with Black Bold Text */}
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#FFD600] text-black border border-black/30 shadow-xs">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Top-Right Action Buttons Inside the Image */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
          <button
            onClick={handleWishlist}
            className={`p-1.5 rounded-lg border transition shadow-xs cursor-pointer ${
              wishlisted
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white/95 border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-rose-500"
            }`}
            title={wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="p-1.5 rounded-lg bg-white/95 hover:bg-slate-50 text-slate-700 hover:text-black transition border border-slate-200 shadow-xs cursor-pointer"
            title="Quick view specs"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clickable Product Anchor for the Image */}
        <Link 
          href={`/store/products/${product.id}`} 
          className="absolute inset-0 flex items-center justify-center overflow-hidden bg-white"
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <>
              {/* Ambient inner yellow glow */}
              <div 
                className="absolute w-28 h-28 rounded-full opacity-25 blur-2xl group-hover:opacity-45 transition-opacity duration-300 bg-[#FFB800]"
              />

              {/* Icon Node Representation */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center transform group-hover:scale-105 transition duration-200">
                <CategoryIcon 
                  className="w-8 h-8 transition duration-200 text-amber-500" 
                />
              </div>
            </>
          )}
        </Link>

        {/* Bottom-Left In Stock / Out of Stock Indicator */}
        <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-200 text-[10px] font-mono font-bold shadow-xs">
          {product.inStock ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-800">In Stock</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-rose-700">Out of Stock</span>
            </>
          )}
        </div>

        {/* Bottom-Right Rating Pill Inside Image */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-200 text-[10px] font-mono text-slate-900 font-bold shadow-xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Bottom Content Area with Padding */}
      <div className="p-4 sm:p-5 flex flex-col justify-between grow relative z-10">
        {/* Product Title */}
        <Link href={`/store/products/${product.id}`} className="block mb-3">
          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-600 transition line-clamp-2 min-h-[3rem] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Product Footer & Action */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
          {/* Price & Compare-At Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {formatPrice(product.priceUsd)}
            </span>
            <span className="font-mono text-xs sm:text-sm text-slate-400 line-through font-semibold">
              {formatPrice(compareAtPrice)}
            </span>
          </div>

          {/* Add to Cart CTA with Cart Icon */}
          <button
            onClick={handleAdd}
            className={`flex items-center justify-center p-2.5 sm:px-3.5 sm:py-2 rounded-full font-heading font-bold text-xs uppercase tracking-wider border border-black/80 transition-all duration-150 cursor-pointer shadow-none active:scale-95 ${
              added
                ? "bg-emerald-500 text-black font-black"
                : "bg-[#FFD600] hover:bg-[#FFC107] text-black"
            }`}
            title="Add to Cart"
          >
            {added ? (
              <Check className="w-4 h-4 text-black stroke-[3]" />
            ) : (
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
