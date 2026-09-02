"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Clock, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { STORE_PRODUCTS } from "@/lib/store/products";
import { useCart } from "@/lib/store/cartContext";

export function FlashDropBanner() {
  const { addItem, formatPrice } = useCart();
  const dealProduct = STORE_PRODUCTS.find((p) => p.id === "genesis-block-gold-ingot") || STORE_PRODUCTS[0];
  const [added, setAdded] = useState(false);

  // Countdown timer for flash drop
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    addItem(dealProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-white border border-orange-200/80 p-6 sm:p-10 overflow-hidden shadow-sm corner-accent-tl corner-accent-br">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-orange-400/10 blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Promotion Info & Countdown */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-xs font-mono font-bold text-[#EA580C] animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-[#EA580C]" />
                <span>LIMITED GENESIS DROP #21</span>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>99.99% Proof Gold + Loaded UTXO</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
                Physical 21,000 Sats <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] via-[#F7931A] to-amber-500">
                  Genesis Gold Ingot
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-body max-w-xl leading-relaxed">
                Serialized investment-grade pure gold proof bar with OP_CHECKLOCKTIMEVERIFY timelocked Bitcoin. Individually numbered 001 - 210 with tamper-evident holographic private key seal.
              </p>
            </div>

            {/* Countdown timer pills */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-600 uppercase flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Batch Window Closes In:</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-center min-w-16 shadow-xs">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Hours</div>
                </div>
                <span className="text-[#EA580C] font-bold text-lg">:</span>
                <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-center min-w-16 shadow-xs">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Mins</div>
                </div>
                <span className="text-[#EA580C] font-bold text-lg">:</span>
                <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-center min-w-16 shadow-xs">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#EA580C]">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Secs</div>
                </div>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="space-y-1.5 max-w-md">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">Vault Allocation Remaining:</span>
                <span className="text-[#EA580C] font-bold">Only 9 of 210 Left</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#EA580C] to-[#F7931A] rounded-full w-[94%]" />
              </div>
            </div>
          </div>

          {/* Right Column: Visual Ingot Card & Instant Action */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                1 Troy Ounce 24K .9999
              </span>
              <div className="font-mono text-right">
                <div className="text-2xl font-bold text-slate-900">{formatPrice(dealProduct.priceUsd)}</div>
                <div className="text-[11px] text-[#EA580C] font-semibold">≈ {dealProduct.priceSats.toLocaleString()} Sats</div>
              </div>
            </div>

            <div className="relative h-44 rounded-xl bg-gradient-to-tr from-amber-100/60 via-orange-50 to-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#F7931A] via-[#EA580C] to-amber-500 p-0.5 shadow-lg flex items-center justify-center animate-float">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center text-center p-2">
                  <span className="font-heading font-black text-2xl text-[#FFD600]">21K</span>
                  <span className="text-[9px] font-mono text-[#F7931A] uppercase tracking-wider font-bold">SATS INGOT</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClaim}
                className={`flex-1 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  added
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-md shadow-orange-500/25 hover:scale-105"
                }`}
              >
                {added ? (
                  <span>Secured in Cart!</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-white" />
                    <span>Claim Batch Allocation</span>
                  </>
                )}
              </button>

              <Link
                href={`/store/products/${dealProduct.id}`}
                className="px-4 py-3.5 rounded-full border border-slate-200 hover:border-slate-400 bg-slate-50 text-slate-800 text-xs font-mono transition shadow-xs"
                title="View Full Ingot Specs"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
