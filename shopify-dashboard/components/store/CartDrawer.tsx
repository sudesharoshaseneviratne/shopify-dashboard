"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Zap, 
  ShieldCheck 
} from "lucide-react";
import { useCart } from "@/lib/store/cartContext";

export function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeItem, 
    updateQuantity, 
    totalUsd, 
    totalSats, 
    formatPrice,
    discountPercent,
    applyDiscount
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ text: string; ok: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const ok = await applyDiscount(inputCode);
    if (ok) {
      setCodeMsg({ text: "21% Satoshi Halving Discount Applied!", ok: true });
    } else {
      setCodeMsg({ text: "Invalid voucher (try 'SATOSHI21')", ok: false });
    }
  };

  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, Math.round((totalUsd / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">Vault Cart</h2>
                <p className="text-[11px] font-mono text-slate-500 font-medium">{items.length} unique assets in manifest</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Insured Air-Gap Transport Progress Bar */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5 font-medium">
              <span className="text-slate-600">Air-Gapped Insured Courier:</span>
              <span className="text-amber-700 font-bold">
                {totalUsd >= freeShippingThreshold ? "UNLOCKED FREE" : `$${Math.max(0, freeShippingThreshold - totalUsd)} to FREE`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-[#FFB800] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base">Your vault manifest is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Equip yourself with cryptographic cold keys, liquid mining hardware, or sovereign nodes.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.product.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex gap-3.5 items-start"
                >
                  <div className="w-12 h-12 rounded-lg bg-white border border-amber-200 flex items-center justify-center shrink-0 font-heading font-black text-lg text-amber-600 shadow-xs overflow-hidden">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : item.product.image ? (
                      <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      "₿"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-heading font-semibold text-sm text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono text-xs text-amber-700 font-bold mt-0.5">
                      {formatPrice(item.product.priceUsd * item.quantity)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono text-slate-900 font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 font-medium">
                        @ {formatPrice(item.product.priceUsd)} / unit
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              {/* Discount Code Form */}
              <form onSubmit={handleDiscountSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Voucher (e.g. SATOSHI21)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 uppercase placeholder:normal-case placeholder:text-slate-400 outline-none shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-heading font-semibold text-white transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {codeMsg && (
                <div className={`text-[11px] font-mono font-medium ${codeMsg.ok ? "text-emerald-700" : "text-red-600"}`}>
                  {codeMsg.text}
                </div>
              )}

              {/* Total Calculation breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs font-mono font-medium">
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Halving Discount (-21%):</span>
                    <span>- {formatPrice((totalUsd / (1 - 0.21)) * 0.21)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-heading font-semibold text-sm text-slate-900">Settlement Total:</span>
                  <div className="text-right">
                    <div className="font-mono text-xl font-bold text-slate-900">
                      {formatPrice(totalUsd)}
                    </div>
                    <div className="text-[10px] text-amber-700 font-bold">
                      ≈ {totalSats.toLocaleString()} Sats • ₿ {(totalUsd / 95240).toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/store/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-full border border-slate-300 hover:border-slate-800 bg-white text-center text-xs font-heading font-bold uppercase tracking-wider text-slate-800 transition shadow-xs"
                >
                  View Details
                </Link>

                <Link
                  href="/store/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 hover:scale-105 shadow-md shadow-amber-500/20 text-center text-xs font-heading font-bold uppercase tracking-wider text-slate-950 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-slate-950" />
                  <span>Checkout</span>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 pt-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Zero-Knowledge Proof & Lightning Settlement</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
