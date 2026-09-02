"use client";

import React, { useState } from "react";
import { Mail, Check, Copy, Sparkles, Zap, Tag } from "lucide-react";
import { useCart } from "@/lib/store/cartContext";

export function NewsletterVip() {
  const { applyDiscount } = useCart();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const promoCode = "GENESIS10";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      await applyDiscount(promoCode);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-white border border-orange-200/80 p-8 sm:p-12 overflow-hidden shadow-sm corner-accent-tl corner-accent-br">
        {/* Ambient Top Flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-orange-400/10 blur-[100px] pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-xs font-mono font-bold text-[#EA580C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP DISPATCH CLUB</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900">
              Join the Satoshi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#F7931A]">Dispatch</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-body">
              Receive early allocation notifications for limited hardware batches, mempool fee alerts, and firmware security advisories. Plus get 10% off your first hardware order.
            </p>
          </div>

          {subscribed ? (
            <div className="p-6 rounded-2xl bg-white border border-orange-300 space-y-4 animate-in zoom-in-95 duration-200 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-mono text-sm font-bold">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Subscribed! Your VIP Discount Voucher is Activated</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-lg font-bold text-[#EA580C] tracking-widest">
                  {promoCode}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied to Clipboard!" : "Copy Code"}</span>
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                10% discount has also been automatically applied to your vault checkout manifest!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="satoshi@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 focus:border-[#EA580C] rounded-full pl-11 pr-4 py-3.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 hover:scale-105 transition cursor-pointer shrink-0"
              >
                Claim 10% Off
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#EA580C]" />
              <span>Instant 10% Coupon</span>
            </span>
            <span>•</span>
            <span>Zero Spam Guarantee</span>
            <span>•</span>
            <span>Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
