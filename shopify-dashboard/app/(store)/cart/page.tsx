"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Zap, 
  ArrowLeft, 
  Lock
} from "lucide-react";
import { useCart } from "@/lib/store/cartContext";

export default function StoreCartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    totalUsd, 
    totalSats, 
    totalBtc,
    formatPrice, 
    discountPercent,
    applyDiscount
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const ok = await applyDiscount(inputCode);
    if (ok) {
      setCodeMsg({ text: "10% Welcome Voucher Applied!", ok: true });
    } else {
      setCodeMsg({ text: "Invalid code. Try 'WELCOME10'", ok: false });
    }
  };

  const freeShippingThreshold = 50;
  const isFreeShipping = totalUsd >= freeShippingThreshold;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-heading font-bold text-3xl text-slate-900">Your Shopping Cart is Empty</h1>
        <p className="text-sm font-body text-slate-500 max-w-md mx-auto">
          Discover our collection of educational books, workbooks, fine stationery, and smart tech.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:scale-105 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Store Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900">
            Shopping Cart & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">Summary</span>
          </h1>
          <p className="text-xs sm:text-sm font-body text-slate-500 mt-1">
            Review your selected items before proceeding to checkout.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-amber-700 font-bold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items Table / Manifest */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-amber-300 transition shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white border border-amber-200 flex items-center justify-center font-heading font-black text-2xl text-amber-600 shrink-0 shadow-xs overflow-hidden">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : item.product.image ? (
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>📦</span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {item.product.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    Unit Price: {formatPrice(item.product.priceUsd)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-center">
                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1.5 rounded-full hover:bg-white text-slate-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1.5 rounded-full hover:bg-white text-slate-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-28">
                  <div className="font-mono text-lg font-bold text-slate-900">
                    {formatPrice(item.product.priceUsd * item.quantity)}
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-50 transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm corner-accent-tl corner-accent-br">
          <h2 className="font-heading font-bold text-xl text-slate-900">
            Order Summary
          </h2>

          {/* Discount Voucher Form */}
          <form onSubmit={handleDiscountSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code: WELCOME10"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 uppercase placeholder:normal-case placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-heading font-bold text-white transition cursor-pointer"
              >
                Apply
              </button>
            </div>
            {codeMsg && (
              <div className={`text-[11px] font-mono font-medium ${codeMsg.ok ? "text-emerald-700" : "text-red-600"}`}>
                {codeMsg.text}
              </div>
            )}
          </form>

          {/* Breakdown */}
          <div className="space-y-3 font-mono text-xs border-t border-slate-200 pt-4">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="text-slate-900 font-semibold">{formatPrice(totalUsd / (1 - (discountPercent / 100)))}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Voucher ({discountPercent}% Off):</span>
                <span>- {formatPrice((totalUsd / (1 - discountPercent / 100)) * (discountPercent / 100))}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Islandwide Delivery:</span>
              <span className="text-emerald-700 font-bold">
                FREE
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-heading font-bold text-base text-slate-900">Grand Total:</span>
              <div className="text-right">
                <div className="font-mono text-2xl font-black text-slate-900">
                  {formatPrice(totalUsd)}
                </div>
              </div>
            </div>
          </div>

          {/* Checkout CTA Button */}
          <Link
            href="/checkout"
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 hover:scale-105 shadow-md shadow-amber-500/20 text-slate-950 text-center font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Proceed to Checkout</span>
          </Link>

          <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 pt-1 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>100% Secure SSL Protected Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
