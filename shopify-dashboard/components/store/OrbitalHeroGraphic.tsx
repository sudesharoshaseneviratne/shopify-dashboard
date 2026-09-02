"use client";

import React from "react";
import { Shield, Zap, Lock, Cpu, Server, Activity } from "lucide-react";

export function OrbitalHeroGraphic() {
  return (
    <div className="relative w-full max-w-[520px] h-[460px] md:h-[500px] mx-auto flex items-center justify-center select-none">
      {/* Background Radial Fire Glow in Golden Yellow */}
      <div className="absolute w-[280px] md:w-[360px] h-[280px] md:h-[360px] rounded-full bg-gradient-to-tr from-[#FFB800] via-[#F59E0B] to-[#FFD600] opacity-25 blur-[90px] animate-pulse-glow" />

      {/* Outermost Orbit Ring (Clockwise) */}
      <div className="absolute w-[360px] sm:w-[420px] md:w-[460px] h-[360px] sm:h-[420px] md:h-[460px] rounded-full border border-dashed border-amber-400/50 animate-spin-slow">
        {/* Orbit Node 1 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-amber-500 shadow-md flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
        </div>
        {/* Orbit Node 2 */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-yellow-500 shadow-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
      </div>

      {/* Middle Orbit Ring (Counter-Clockwise) */}
      <div className="absolute w-[280px] sm:w-[320px] md:w-[350px] h-[280px] sm:h-[320px] md:h-[350px] rounded-full border border-amber-300/60 animate-spin-slow-reverse">
        {/* Orbit Node 3 */}
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-amber-500 shadow-md flex items-center justify-center">
          <Lock className="w-3 h-3 text-amber-600" />
        </div>
        {/* Orbit Node 4 */}
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-yellow-400 shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </div>
      </div>

      {/* Inner Glowing Core (Floating 3D Sphere) */}
      <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1 bg-gradient-to-br from-[#FFD600] via-[#FFB800] to-amber-500 shadow-xl animate-float">
        <div className="w-full h-full rounded-full bg-slate-950 border border-amber-400/30 backdrop-blur-2xl flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Subtle Grid Inside Core */}
          <div className="absolute inset-0 bg-grid-dense opacity-40" />

          {/* Glowing Bitcoin Glyph */}
          <div className="relative z-10 text-6xl sm:text-7xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 via-[#FFB800] to-[#FFD600] drop-shadow-[0_0_25px_rgba(255,184,0,0.9)]">
            ₿
          </div>

          <div className="relative z-10 text-[10px] font-mono tracking-widest text-[#FFD600] font-bold uppercase mt-1">
            GENESIS CORE
          </div>
          
          <div className="relative z-10 text-[9px] font-mono text-slate-400 font-medium">
            21M // HARD CAP
          </div>
        </div>
      </div>

      {/* Floating Bouncing Stat Card Top-Left */}
      <div className="absolute top-4 left-0 sm:-left-6 z-20 animate-float p-3 sm:p-4 rounded-2xl bg-white/95 border border-amber-200 backdrop-blur-xl shadow-lg flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-xs">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Custody Status</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-sm font-heading font-bold text-slate-900">100% Air-Gapped</div>
        </div>
      </div>

      {/* Floating Bouncing Stat Card Bottom-Right */}
      <div className="absolute bottom-6 right-0 sm:-right-6 z-20 animate-float-reverse p-3 sm:p-4 rounded-2xl bg-white/95 border border-amber-200 backdrop-blur-xl shadow-lg flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-xs">
          <Cpu className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Hash Power</div>
          <div className="text-sm font-heading font-bold text-slate-900">140 TH/s Hydro</div>
        </div>
      </div>

      {/* Floating Mini Badge Bottom-Left */}
      <div className="hidden sm:flex absolute bottom-12 left-4 z-20 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-200 backdrop-blur-md items-center gap-2 text-xs font-mono text-slate-800 shadow-md">
        <Activity className="w-3.5 h-3.5 text-amber-500" />
        <span className="font-semibold">Sub-second Lightning</span>
      </div>
    </div>
  );
}
