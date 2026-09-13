"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  X, 
  Shield, 
  Cpu, 
  Server, 
  Lock, 
  Layers, 
  Star, 
  Check, 
  Plus, 
  Zap, 
  ArrowRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { useCart } from "@/lib/store/cartContext";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addItem, formatPrice, currency } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative bg-white border border-amber-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200 overflow-hidden corner-accent-tl corner-accent-br">
        {/* Ambient Top Glow in Golden Yellow */}
        <div 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-20 blur-3xl pointer-events-none bg-[#FFB800]"
        />

        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Visual Hologram Preview / Product Image */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden h-72 md:h-full">
            <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />
            
            {product.images && product.images.length > 0 ? (
              <div className="relative z-10 w-full h-44 flex items-center justify-center">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-md rounded-xl"
                />
              </div>
            ) : product.image ? (
              <div className="relative z-10 w-full h-44 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-md rounded-xl"
                />
              </div>
            ) : (
              <div className="relative z-10 w-24 h-24 rounded-2xl bg-white border border-amber-300 shadow-lg flex items-center justify-center animate-float">
                <span className="font-heading font-black text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-amber-600 via-[#FFB800] to-yellow-500">
                  ₿
                </span>
              </div>
            )}

            <div className="relative z-10 mt-4 text-center">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {product.securityRating}
              </span>
              <div className="text-[11px] font-mono text-slate-500 mt-2 font-medium">
                Firmware: {product.firmwareVersion}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Ordering */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-amber-700 font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-amber-600 font-semibold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{product.rating} ({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-heading font-bold text-2xl text-slate-900">
                {product.name}
              </h2>

              <p className="text-xs text-slate-600 font-body mt-1 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Price block */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Price</span>
                <div className="font-mono text-xl font-bold text-slate-900">
                  {formatPrice(product.priceUsd)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Availability</span>
                <div className="font-mono text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>In Stock</span>
                </div>
              </div>
            </div>

            {/* Key Specs Preview */}
            <div className="space-y-1.5 text-xs font-mono">
              {product.specs.slice(0, 3).map((spec, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{spec.label}:</span>
                  <span className="text-slate-800 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Quantity and Add CTA */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-600 hover:text-slate-900 px-1 text-sm font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 font-mono text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-600 hover:text-slate-900 px-1 text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  added
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-white">Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-slate-950" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <Link
                href={`/products/${product.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="text-xs font-mono text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
