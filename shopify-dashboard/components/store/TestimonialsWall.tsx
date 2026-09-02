"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export function TestimonialsWall() {
  const reviews = [
    {
      author: "Alex V.",
      role: "Multisig Security Architect, Citadel Labs",
      rating: 5,
      date: "Block #884,910",
      content: "The Satoshi ColdKey MK-IV is by far the cleanest air-gapped signer in existence. Camera scanning of animated QR codes has zero latency, and the dual EAL6+ element isolation gives complete peace of mind when signing 9-figure UTXOs.",
      verifiedHardware: "Satoshi ColdKey Prime MK-IV",
      hash: "0x7f48...21ea"
    },
    {
      author: "Elena Rostova",
      role: "Hydro-Mining Operator, Norway",
      rating: 5,
      date: "Block #885,022",
      content: "The Orion Hydro-ASIC is astonishingly quiet. Running it in my living room office space with under 38dB sound output while hashing 140 TH/s continuously. The integrated home radiator heat reuse cut my heating bill to zero.",
      verifiedHardware: "Orion Hydro-ASIC 140 TH/s",
      hash: "0x91da...8842"
    },
    {
      author: "Marcus Chen",
      role: "Sovereign Node Runner & Lightning Routing Node Operator",
      rating: 5,
      date: "Block #885,219",
      content: "Plug-and-play validation at its best. The ZK-Lightning Node X1 was completely pre-synced with full blockchain history. Took less than 4 minutes from unboxing to routing my first Lightning invoice across Tor v3.",
      verifiedHardware: "Sovereign ZK-Lightning Node X1",
      hash: "0x1b40...62f1"
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-black font-bold">
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          <span>CRYPTOGRAPHICALLY VERIFIED BUYERS</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
          Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Sovereign Hodlers</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-body font-medium">
          Real feedback from institutional multisig custodians, residential hydro miners, and Bitcoin Core node operators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
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

              <p className="text-xs text-slate-700 font-body leading-relaxed font-medium">
                "{rev.content}"
              </p>
            </div>

            <div className="pt-4 border-t-2 border-black/10 space-y-2">
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

              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-black flex items-center justify-between text-[10px] font-mono text-black font-bold shadow-[2px_2px_0px_0px_#000]">
                <span className="truncate">{rev.verifiedHardware}</span>
                <span className="text-slate-600 ml-2 shrink-0 font-normal">{rev.hash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
