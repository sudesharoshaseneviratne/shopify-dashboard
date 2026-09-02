"use client";

import React from "react";
import { Truck, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

export function EcommerceValueBar() {
  const perks = [
    {
      icon: Truck,
      title: "ISLANDWIDE DELIVERY",
      subtitle: "Fast shipping to your doorstep.",
    },
    {
      icon: CreditCard,
      title: "SECURE PAYMENT",
      subtitle: "100% safe transactions.",
    },
    {
      icon: Sparkles,
      title: "LATEST PRODUCTS",
      subtitle: "Latest stocks & authentic items.",
    },
    {
      icon: CheckCircle2,
      title: "TRUSTED PARTNER",
      subtitle: "We are officially registered.",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-8 sm:-mt-14 relative z-20">
      <div 
        className="rounded-2xl sm:rounded-3xl bg-slate-950 border-2 border-black text-white p-5 sm:p-7 shadow-[4px_4px_0px_0px_#FFB800] hover:shadow-[6px_6px_0px_0px_#FFB800] transition-all duration-300 relative overflow-hidden"
      >
        {/* Subtle Background Glow & Cyber Grid Motif */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 lg:divide-x lg:divide-slate-800/80">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <div 
                key={index}
                className={`flex items-center gap-4 group transition-all duration-200 ${
                  index > 0 ? "lg:pl-6" : ""
                }`}
              >
                {/* Rounded Icon Box with Yellow Accents and Hover Glow */}
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#FFD600]/60 group-hover:bg-amber-950/40 group-hover:shadow-[0_0_15px_rgba(255,214,0,0.25)] transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#FFD600] stroke-[2.2] group-hover:rotate-6 transition-transform duration-300" />
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-[#FFD600] transition-colors truncate">
                      {perk.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 font-body truncate">
                    {perk.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

