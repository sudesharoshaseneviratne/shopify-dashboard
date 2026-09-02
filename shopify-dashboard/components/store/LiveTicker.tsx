"use client";

import React from "react";
import { Zap, Shield, TrendingUp, Cpu, Server, Activity } from "lucide-react";
import { LIVE_NETWORK_METRICS } from "@/lib/store/products";

export function LiveTicker() {
  const tickerItems = [
    { label: "BLOCK HEIGHT", value: `#${LIVE_NETWORK_METRICS.blockHeight}`, icon: Activity, color: "text-[#F7931A]" },
    { label: "NETWORK HASHRATE", value: LIVE_NETWORK_METRICS.hashrateEH, icon: Cpu, color: "text-[#FFD600]" },
    { label: "MEMPOOL PRIORITY FEE", value: LIVE_NETWORK_METRICS.mempoolFeeSatsVB, icon: Zap, color: "text-[#F7931A]" },
    { label: "HALVING CYCLE PROGRESS", value: LIVE_NETWORK_METRICS.halvingProgress, icon: TrendingUp, color: "text-emerald-400" },
    { label: "LIGHTNING CAPACITY", value: LIVE_NETWORK_METRICS.lightningCapacityBTC, icon: Zap, color: "text-[#FFD600]" },
    { label: "ACTIVE VAULT NODES", value: LIVE_NETWORK_METRICS.lightningNodes, icon: Server, color: "text-[#F7931A]" },
    { label: "CIRCULATING SUPPLY", value: "19,820,412 / 21,000,000", icon: Shield, color: "text-white" },
    { label: "DIFF ADJUSTMENT", value: "+1.2% (Next: Block #887,040)", icon: Activity, color: "text-[#94A3B8]" },
  ];

  return (
    <div className="w-full bg-[#0F1115] border-y border-white/10 py-3 overflow-hidden select-none relative">
      {/* Edge gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0F1115] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0F1115] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused] gap-8">
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 shrink-0 px-3">
              <div className="p-1 rounded-md bg-white/5 border border-white/10">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#94A3B8] font-medium tracking-wider">{item.label}:</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
              <span className="text-white/20 ml-4 font-mono">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
