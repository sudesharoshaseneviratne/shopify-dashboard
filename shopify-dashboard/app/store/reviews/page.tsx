"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Filter,
  MessageSquare,
  Sparkles,
  Lock,
  ThumbsUp,
  Cpu,
  Server,
  Layers,
  Shield
} from "lucide-react";
import { STORE_PRODUCTS } from "@/lib/store/products";

export default function StoreReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const allReviews = [
    {
      id: "rev-1",
      author: "Alex V.",
      role: "Multisig Security Architect, Citadel Labs",
      rating: 5,
      date: "Block #884,910",
      content: "The Satoshi ColdKey MK-IV is by far the cleanest air-gapped signer in existence. Camera scanning of animated QR codes has zero latency, and the dual EAL6+ element isolation gives complete peace of mind when signing 9-figure UTXOs.",
      verifiedHardware: "Satoshi ColdKey Prime MK-IV",
      category: "Cold Storage",
      hash: "0x7f48...21ea",
      helpfulCount: 42,
    },
    {
      id: "rev-2",
      author: "Elena Rostova",
      role: "Hydro-Mining Operator, Norway",
      rating: 5,
      date: "Block #885,022",
      content: "The Orion Hydro-ASIC is astonishingly quiet. Running it in my living room office space with under 38dB sound output while hashing 140 TH/s continuously. The integrated home radiator heat reuse cut my heating bill to zero.",
      verifiedHardware: "Orion Hydro-ASIC 140 TH/s",
      category: "Mining & ASICs",
      hash: "0x91da...8842",
      helpfulCount: 38,
    },
    {
      id: "rev-3",
      author: "Marcus Chen",
      role: "Sovereign Node Runner & Lightning Routing Node Operator",
      rating: 5,
      date: "Block #885,219",
      content: "Plug-and-play validation at its best. The ZK-Lightning Node X1 was completely pre-synced with full blockchain history. Took less than 4 minutes from unboxing to routing my first Lightning invoice across Tor v3.",
      verifiedHardware: "Sovereign ZK-Lightning Node X1",
      category: "Sovereign Nodes",
      hash: "0x1b40...62f1",
      helpfulCount: 29,
    },
    {
      id: "rev-4",
      author: "Tariq Al-Mansoor",
      role: "Family Office Custodian, Dubai",
      rating: 5,
      date: "Block #885,410",
      content: "We ordered 12 units of the CipherSteel 24 Matrix for cold backup across our physical security vaults. The laser-engraved 316L stainless steel withstood our thermal furnace stress test flawlessly at 1,450°C.",
      verifiedHardware: "CipherSteel 24 Seed Matrix",
      category: "Security & Backup",
      hash: "0x4c21...99e3",
      helpfulCount: 19,
    },
    {
      id: "rev-5",
      author: "Devon Miller",
      role: "Independent Merchant, Austin TX",
      rating: 5,
      date: "Block #885,630",
      content: "Our coffee shop switched to the Nostr POS Terminal last month. Zero merchant processing fees, instantaneous NFC payments via Lightning, and printed QR receipts that customers love. An essential tool for Bitcoin circular economies.",
      verifiedHardware: "Nostr POS Terminal & Cash Register",
      category: "Security & Backup",
      hash: "0x8e5b...11a7",
      helpfulCount: 31,
    },
    {
      id: "rev-6",
      author: "Klaus Weber",
      role: "Cryptographic Historian & Collector, Zurich",
      rating: 5,
      date: "Block #885,890",
      content: "The Genesis Block Gold Ingot is a masterpiece of numismatic and cryptographic art. The micro-etched Satoshi inscription under 50x magnification is breathtaking, and the UTXO timelock script verified perfectly on mempool.",
      verifiedHardware: "Genesis Block 24K Gold Ingot",
      category: "Cryptographic Relics",
      hash: "0x3f72...aa90",
      helpfulCount: 25,
    }
  ];

  const categories = ["All", "Cold Storage", "Mining & ASICs", "Sovereign Nodes", "Security & Backup", "Cryptographic Relics"];

  const filteredReviews = selectedFilter === "All"
    ? allReviews
    : allReviews.filter((r) => r.category === selectedFilter);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12 space-y-12">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 pb-6">
        <div>
          <Link 
            href="/store"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-700 hover:text-black font-bold uppercase mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Store Home</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-black font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>CRYPTOGRAPHICALLY VERIFIED BUYERS</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Reviews &amp; Proofs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-body max-w-2xl mt-1">
            Real, cryptographically signed feedback from institutional multisig custodians, residential hydro miners, and Bitcoin Core node operators.
          </p>
        </div>

        {/* Rating Summary Badge */}
        <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-neo-card flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="font-mono text-3xl sm:text-4xl font-black text-slate-900">4.98</div>
            <div className="flex items-center gap-1 text-amber-500 mt-1 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
              ))}
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-200" />
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-slate-900">1,280+ Reviews</div>
            <div className="text-[10px] text-emerald-700 font-bold">100% Verified Signatures</div>
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>FILTER:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer shrink-0 border-2 border-black ${
              selectedFilter === cat
                ? "bg-black text-white shadow-[2px_2px_0px_0px_#FFB800]"
                : "bg-white hover:bg-slate-100 text-slate-800 shadow-none"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-black flex flex-col justify-between space-y-6 shadow-neo-card relative overflow-hidden group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-600 font-bold">{rev.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-body leading-relaxed font-medium">
                "{rev.content}"
              </p>
            </div>

            <div className="pt-4 border-t-2 border-black/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-heading font-black text-sm text-slate-900">{rev.author}</div>
                  <div className="text-[10px] font-mono text-slate-600 font-medium">{rev.role}</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-800 text-[10px] font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Hardware & TX Hash Pill */}
              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-black flex items-center justify-between text-[10px] font-mono text-black font-bold shadow-[2px_2px_0px_0px_#000]">
                <span className="truncate">{rev.verifiedHardware}</span>
                <span className="text-slate-600 ml-2 shrink-0 font-normal">{rev.hash}</span>
              </div>

              {/* Helpful Votes Count */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Verified Buyer Proof</span>
                <span className="flex items-center gap-1 text-slate-700 font-bold">
                  <ThumbsUp className="w-3 h-3 text-amber-600" />
                  <span>{rev.helpfulCount} people found this helpful</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Products */}
      <div className="p-8 rounded-3xl bg-black text-white border-2 border-black shadow-neo-card text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black font-mono font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN OVER 1,280+ SECURED CITADELS</span>
        </div>
        <h3 className="font-heading font-black text-2xl sm:text-3xl">
          Ready to Upgrade Your Sovereign Security?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-body max-w-xl mx-auto">
          Explore our complete inventory of air-gapped hardware wallets, silent ASIC home miners, and Bitcoin Core plug-and-play nodes.
        </p>
        <div className="pt-2">
          <Link
            href="/store/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FFD600] hover:bg-[#FFC107] text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-neo-btn transition cursor-pointer"
          >
            <span>Explore Store Hardware</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
