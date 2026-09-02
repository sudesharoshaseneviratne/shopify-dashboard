"use client";

import React, { useState } from "react";
import { Cpu, Zap, TrendingUp, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { BTC_USD_RATE } from "@/lib/store/products";

export function YieldCalculator() {
  const [hashrate, setHashrate] = useState(140); // 140 TH/s default
  const [electricityCost, setElectricityCost] = useState(0.06); // $0.06 / kWh
  const [mode, setMode] = useState<"mining" | "lightning">("mining");
  const [lightningBtc, setLightningBtc] = useState(0.5); // 0.5 BTC routing liquidity

  // Mathematical modeling
  const satsPerThDay = 52;
  const powerConsumptionWatts = hashrate * 21.5; // 21.5 W/TH
  const dailyKwh = (powerConsumptionWatts * 24) / 1000;
  const dailyPowerCostUsd = dailyKwh * electricityCost;

  const dailyMiningSats = Math.round(hashrate * satsPerThDay);
  const dailyMiningRevenueUsd = (dailyMiningSats / 100_000_000) * BTC_USD_RATE;
  const dailyMiningProfitUsd = dailyMiningRevenueUsd - dailyPowerCostUsd;
  const monthlyMiningProfitUsd = dailyMiningProfitUsd * 30.4;
  const annualMiningSats = dailyMiningSats * 365;

  // Lightning Routing Model: 3.8% APY routing fees
  const annualLightningSats = Math.round(lightningBtc * 0.038 * 100_000_000);
  const monthlyLightningUsd = ((annualLightningSats / 12) / 100_000_000) * BTC_USD_RATE;

  return (
    <section id="yield" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 relative overflow-hidden shadow-sm corner-accent-tl corner-accent-br">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-400/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-mono text-[#EA580C] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRECISION PROTOCOL SIMULATOR</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
              Simulate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#F7931A]">Sovereign Yield</span>
            </h2>
            <p className="text-sm text-slate-600 font-body max-w-xl">
              Calculate projected Satoshi generation from hydro-cooled SHA-256 mining ASICs or autonomous Lightning Network routing liquidity nodes.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200 shrink-0">
            <button
              onClick={() => setMode("mining")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-semibold transition cursor-pointer ${
                mode === "mining"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Hydro ASIC Mining</span>
            </button>
            <button
              onClick={() => setMode("lightning")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-semibold transition cursor-pointer ${
                mode === "lightning"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Lightning Routing Node</span>
            </button>
          </div>
        </div>

        {/* Interactive Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80">
            {mode === "mining" ? (
              <>
                {/* Hashrate Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-600 font-semibold">Configured Hashrate:</span>
                    <span className="font-heading font-bold text-base text-[#EA580C]">{hashrate} TH/s</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="500"
                    step="10"
                    value={hashrate}
                    onChange={(e) => setHashrate(Number(e.target.value))}
                    className="w-full accent-[#EA580C] bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 font-medium">
                    <span>30 TH/s (Portable)</span>
                    <span>140 TH/s (Orion Hydro)</span>
                    <span>500 TH/s (Cluster)</span>
                  </div>
                </div>

                {/* Electricity Cost */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-600 font-semibold">Electricity Tariff ($/kWh):</span>
                    <span className="font-heading font-bold text-base text-slate-900">${electricityCost.toFixed(2)}/kWh</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.18"
                    step="0.01"
                    value={electricityCost}
                    onChange={(e) => setElectricityCost(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 font-medium">
                    <span>$0.02 (Hydro/Solar)</span>
                    <span>$0.06 (Industrial)</span>
                    <span>$0.18 (Residential peak)</span>
                  </div>
                </div>

                {/* Efficiency Badge */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-semibold">Thermal Efficiency:</span>
                  <span className="text-emerald-700 font-bold">21.5 J/TH (Whisper Silent)</span>
                </div>
              </>
            ) : (
              <>
                {/* Lightning Staking Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-600 font-semibold">Allocated Routing Capacity:</span>
                    <span className="font-heading font-bold text-base text-amber-600">{lightningBtc} BTC</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={lightningBtc}
                    onChange={(e) => setLightningBtc(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 font-medium">
                    <span>0.1 BTC (Small Node)</span>
                    <span>1.0 BTC (Community Hub)</span>
                    <span>5.0 BTC (Enterprise Sovereign)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-semibold">Average Fee Yield (APY):</span>
                  <span className="text-amber-700 font-bold">3.8% Non-Custodial APY</span>
                </div>
              </>
            )}
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: Daily Satoshi Inflow */}
            <div className="p-6 rounded-2xl bg-white border border-orange-200/80 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 font-semibold uppercase">Daily Satoshi Inflow</span>
                <Zap className="w-4 h-4 text-[#EA580C]" />
              </div>
              <div className="my-4">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-amber-500">
                  {mode === "mining" 
                    ? `+${dailyMiningSats.toLocaleString()}` 
                    : `+${Math.round(annualLightningSats / 365).toLocaleString()}`
                  }
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1 font-medium">sats / 24 hours</div>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                Directly credited to cold vault
              </div>
            </div>

            {/* Box 2: Monthly Net Est. */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 font-semibold uppercase">Estimated Monthly Net</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="my-4">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
                  ${mode === "mining" ? monthlyMiningProfitUsd.toFixed(2) : monthlyLightningUsd.toFixed(2)}
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1 font-medium">USD equivalent profit</div>
              </div>
              <div className="text-[11px] font-mono text-slate-500 font-medium">
                Based on current difficulty
              </div>
            </div>

            {/* Box 3: Annual Accumulation (Full Width) */}
            <div className="sm:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-white border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-mono text-[#EA580C] font-bold uppercase tracking-wider">
                  365-Day Projected Accumulation
                </span>
                <div className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
                  {mode === "mining" 
                    ? `${(annualMiningSats / 100_000_000).toFixed(4)} BTC` 
                    : `${(annualLightningSats / 100_000_000).toFixed(4)} BTC`
                  }
                </div>
                <div className="text-xs font-mono text-slate-600 mt-0.5 font-medium">
                  ({(mode === "mining" ? annualMiningSats : annualLightningSats).toLocaleString()} Satoshis total)
                </div>
              </div>

              <a
                href="#catalog"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F7931A] hover:scale-105 shadow-md shadow-orange-500/25 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition"
              >
                <span>Equip Rig Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
