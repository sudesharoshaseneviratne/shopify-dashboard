"use client";

import { useState } from "react";
import { 
  Bot, 
  ArrowUp, 
  ChevronDown, 
  Plus
} from "lucide-react";

export default function Home() {
  const [searchInputValue, setSearchInputValue] = useState("");

  return (
    <div className="w-full min-h-screen bg-white flex flex-col select-none relative overflow-x-hidden">
      {/* Background Dotted Globe Pattern (Right Side) */}
      <div className="absolute top-0 right-[-80px] w-[550px] h-[550px] pointer-events-none opacity-20 z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full fill-[#8a8a8a]">
          {Array.from({ length: 22 }).map((_, r) => (
            Array.from({ length: 34 }).map((_, c) => {
              const radius = (r + 1) * 8.5;
              const angle = (c * 10.5 * Math.PI) / 180;
              const cx = Number((200 + radius * Math.cos(angle)).toFixed(2));
              const cy = Number((200 + radius * Math.sin(angle)).toFixed(2));
              return <circle key={`${r}-${c}`} cx={cx} cy={cy} r={r % 3 === 0 ? 1.2 : 0.7} />;
            })
          ))}
        </svg>
      </div>

      {/* Mini Analytics Bar (Static Top Header) */}
      <div className="w-full z-10 mb-6">
        <div className="flex items-center justify-between gap-4 py-2 border-b border-[#e1e3e5] px-1 bg-white rounded-xl">
          {/* Channel & Date */}
          <div className="shrink-0">
            <div className="text-[11px] font-normal text-[#616161] flex items-center gap-1 cursor-pointer hover:text-[#1a1a1a]">
              All channels
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a1a]">Last 30 days</div>
          </div>

          {/* 4 Metric Stats Bar */}
          <div className="flex items-center justify-center gap-6 flex-1 max-w-2xl bg-[#f6f6f7] py-2 px-4 rounded-xl border border-[#e1e3e5]">
            {/* Stat 1: Sessions */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-[11px] text-[#616161]">Sessions</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] flex items-center gap-1.5 mt-0.5">
                <span>1,045</span>
                <span className="text-[11px] font-medium text-[#107c41] flex items-center gap-0.5">
                  <svg className="w-3 h-2 text-[#107c41]" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 7L4.5 3.5L7 6L11 1" />
                  </svg>
                  +106%
                </span>
              </div>
            </div>

            {/* Stat 2: Total Sales */}
            <div className="flex flex-col items-center justify-center border-l border-[#e1e3e5] pl-6">
              <div className="text-[11px] text-[#616161] border-b border-dashed border-[#a6a6a6]">Total sales</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] flex items-center gap-1.5 mt-0.5">
                <span>LKR 25.6K</span>
                <span className="text-[11px] font-medium text-[#107c41] flex items-center gap-0.5">
                  <svg className="w-3 h-2 text-[#107c41]" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 7L4.5 3.5L7 6L11 1" />
                  </svg>
                  +46%
                </span>
              </div>
            </div>

            {/* Stat 3: Orders */}
            <div className="flex flex-col items-center justify-center border-l border-[#e1e3e5] pl-6">
              <div className="text-[11px] text-[#616161]">Orders</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] flex items-center gap-1.5 mt-0.5">
                <span>6</span>
                <span className="text-[11px] font-medium text-[#107c41] flex items-center gap-0.5">
                  <svg className="w-3 h-2 text-[#107c41]" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 7L4.5 3.5L7 6L11 1" />
                  </svg>
                  +100%
                </span>
              </div>
            </div>

            {/* Stat 4: Conversion Rate */}
            <div className="flex flex-col items-center justify-center border-l border-[#e1e3e5] pl-6">
              <div className="text-[11px] text-[#616161] border-b border-dashed border-[#a6a6a6]">Conversion rate</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] flex items-center gap-1.5 mt-0.5">
                <span>0.47%</span>
                <span className="text-[11px] font-medium text-[#616161] flex items-center gap-0.5">
                  <svg className="w-3 h-2 text-[#616161]" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1L4.5 4.5L7 2L11 7" />
                  </svg>
                  -19%
                </span>
              </div>
            </div>
          </div>

          {/* Live Visitors */}
          <div className="shrink-0 text-right">
            <div className="text-[11px] font-normal text-[#616161]">Live visitors</div>
            <div className="text-[13px] font-semibold text-[#1a1a1a] flex items-center justify-end gap-1.5 mt-0.5">
              <span>0</span>
              <span className="w-3 h-3 rounded-full border-2 border-[#107c41] inline-block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
