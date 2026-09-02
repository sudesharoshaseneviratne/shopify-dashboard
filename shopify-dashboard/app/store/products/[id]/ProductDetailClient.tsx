"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Cpu, 
  Star, 
  Check, 
  Zap, 
  ChevronRight, 
  Terminal, 
  Copy, 
  ArrowLeft, 
  Truck, 
  RefreshCw 
} from "lucide-react";
import type { StoreProduct } from "@/lib/store/products";
import { useCart } from "@/lib/store/cartContext";
import { ProductCard } from "@/components/store/ProductCard";

interface ProductDetailClientProps {
  product: StoreProduct | null;
  relatedProducts: StoreProduct[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem, formatPrice } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-heading font-bold text-3xl text-slate-900">Cryptographic Node Not Found</h1>
        <p className="text-sm font-mono text-slate-500">The requested hardware slug does not exist on mainnet.</p>
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-heading font-bold text-xs uppercase shadow-md shadow-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/store" className="hover:text-slate-900 transition">
          Vault Mainnet
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/store/products" className="hover:text-slate-900 transition">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-amber-700 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Visual Hardware Inspection Node / Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] overflow-hidden corner-accent-tl corner-accent-br shadow-sm">
            {/* Background Grid Texture */}
            <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />

            {/* Ambient Radial Bloom in Golden Yellow */}
            <div className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl bg-[#FFB800] pointer-events-none" />

            {/* Main Product Image Display */}
            {product.images && product.images.length > 0 ? (
              <div className="relative z-10 w-full h-[320px] sm:h-[380px] flex items-center justify-center">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-2xl drop-shadow-md animate-in fade-in duration-300"
                />
              </div>
            ) : product.image ? (
              <div className="relative z-10 w-full h-[320px] sm:h-[380px] flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-2xl drop-shadow-md"
                />
              </div>
            ) : (
              /* Floating Central Node Core Fallback */
              <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-slate-950 border border-amber-400/30 shadow-xl flex items-center justify-center animate-float">
                <span className="font-heading font-black text-6xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 via-[#FFB800] to-[#FFD600] drop-shadow-[0_0_20px_rgba(255,184,0,0.8)]">
                  ₿
                </span>
              </div>
            )}

            {/* Floating Top-Left Status Pill */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-mono text-emerald-700 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Hardware Node</span>
            </div>

            {/* Floating Bottom Badge */}
            <div className="absolute bottom-6 right-6 z-20 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-800">
              {product.securityRating}
            </div>
          </div>

          {/* Multiple Images Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition bg-white cursor-pointer p-1 shadow-2xs ${
                    selectedImageIndex === idx 
                      ? "border-amber-500 ring-2 ring-amber-400/30" 
                      : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}

          {/* SHA-256 Firmware Checksum Block */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-2 text-slate-900">
                <Terminal className="w-4 h-4 text-amber-600" />
                <span className="font-bold">Reproducible SHA-256 Checksum:</span>
              </div>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-amber-700 font-bold hover:underline cursor-pointer"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 break-all border border-slate-200 font-medium">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Order Configuration */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-slate-500">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-body leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing & Sats Conversion Block */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {formatPrice(product.priceUsd)}
              </div>
              <div className="font-mono text-xs text-amber-700 mt-1 font-bold">
                ≈ {product.priceSats.toLocaleString()} Sats • ₿ {(product.priceUsd / 95240).toFixed(6)}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono space-y-1">
              <div className="text-emerald-700 font-bold flex items-center sm:justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{product.inventory} Units Reserved in Vault</span>
              </div>
              <div className="text-slate-500 font-medium">Lead Time: {product.leadTime}</div>
            </div>
          </div>

          {/* Key Architectural Features */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900">
              Sovereignty Guarantees
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs font-body text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5 text-amber-600">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity and Add CTA Action Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center rounded-full bg-slate-100 border border-slate-200 px-4 py-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-slate-600 hover:text-slate-900 px-2 text-base font-bold cursor-pointer"
              >
                -
              </button>
              <span className="px-4 font-mono text-base font-bold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-slate-600 hover:text-slate-900 px-2 text-base font-bold cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 w-full py-4 rounded-full font-heading font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white">Secured in Vault Cart</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>Equip Hardware Vault</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-600 pt-2 font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Insured Air-Gapped Courier</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Lifetime PGP Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Matrix */}
      <section className="space-y-6 pt-12 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-700 font-bold">
          <Cpu className="w-4 h-4" />
          <span>CRYPTOGRAPHIC DATASHEET</span>
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
          Hardware & Firmware <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Specifications</span>
        </h2>

        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100 font-mono text-xs shadow-xs">
          {product.specs.map((spec, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50 transition">
              <div className="text-slate-500 font-semibold">{spec.label}</div>
              <div className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">{spec.value}</div>
            </div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50 transition">
            <div className="text-slate-500 font-semibold">Active Firmware</div>
            <div className="sm:col-span-2 text-amber-700 font-bold mt-1 sm:mt-0">{product.firmwareVersion}</div>
          </div>
        </div>
      </section>

      {/* Related Hardware Section */}
      <section className="space-y-6 pt-12 border-t border-slate-200">
        <h2 className="font-heading font-bold text-2xl text-slate-900">
          Complementary <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Protocol Hardware</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((relProduct) => (
            <ProductCard key={relProduct.id} product={relProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}
