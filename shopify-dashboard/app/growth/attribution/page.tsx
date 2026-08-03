"use client";

import { ChevronDown, Printer, Download, Info, Settings, Search, Columns, ExternalLink, X, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialData = [
  { id: 1, channel: "Google Search", type: "Organic", sessions: 316, sales: "Rs 23,172.00", orders: 5, cr: "1.58%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "Rs 4,634.40", newC: 5, retC: 0, icon: "G" },
  { id: 2, channel: "Facebook", type: "Unknown", sessions: 302, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "f" },
  { id: 3, channel: "Direct", type: "Direct", sessions: 278, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "D" },
  { id: 4, channel: "Unattributed", type: "Unknown", sessions: 71, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "?" },
  { id: 5, channel: "Bing", type: "Organic", sessions: 38, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "b" },
  { id: 6, channel: "Chatgpt.com", type: "Unknown", sessions: 19, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "C" },
  { id: 7, channel: "Yahoo!", type: "Organic", sessions: 4, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "Y" },
  { id: 8, channel: "Chatgpt", type: "Unknown", sessions: 2, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "C" },
  { id: 9, channel: "Copilot.com", type: "Unknown", sessions: 2, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "C" },
  { id: 10, channel: "Shopify", type: "Organic", sessions: 1, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "S" },
  { id: 11, channel: "Yahoo images", type: "Organic", sessions: 1, sales: "Rs 0.00", orders: 0, cr: "0%", cost: "—", roas: "—", cpa: "—", ctr: "—", aov: "—", newC: 0, retC: 0, icon: "Y" },
];

export default function Attribution() {
  const {
    sortedData: data,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialData, "id");

  const renderSortIndicator = (colKey: string) => {
    if (sortColumn !== colKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2l2 3l2-6l2 3h2" /></svg>
           Attribution
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary transition">
            Print
          </button>
          <button className="polaris-btn polaris-btn-secondary transition">
            Export
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 font-medium border polaris-btn polaris-btn-secondary flex items-center gap-2 transition">
            Last 30 days
          </button>
          <button className="px-3 py-1.5 font-medium border polaris-btn polaris-btn-secondary flex items-center gap-2 transition">
            Daily <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <button className="px-3 py-1.5 font-medium border polaris-btn polaris-btn-secondary flex items-center gap-2 transition">
            Channels <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <button className="px-3 py-1.5 font-medium border polaris-btn polaris-btn-secondary flex items-center gap-2 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Last non-direct click <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Chart Section */}
      <div className="polaris-card p-4">
        <div className="flex items-center justify-between mb-6 text-sm">
          <span className="font-medium text-gray-700 flex items-center gap-1 cursor-pointer hover:underline">
            Sessions by top 5 channels over time <ChevronDown className="w-4 h-4 text-gray-500" />
          </span>
        </div>
        
        {/* Chart Area Mockup */}
        <div className="h-64 relative border-b border-[#ebebeb] mb-8">
           {/* Y-axis labels */}
           <div className="absolute left-0 top-0 text-xs text-gray-400">150</div>
           <div className="absolute left-0 top-1/3 text-xs text-gray-400">100</div>
           <div className="absolute left-0 top-2/3 text-xs text-gray-400">50</div>
           <div className="absolute left-0 bottom-0 text-xs text-gray-400">0</div>

           {/* Grid lines */}
           <div className="absolute left-8 right-0 top-0 border-t border-[#ebebeb]"></div>
           <div className="absolute left-8 right-0 top-1/3 border-t border-[#ebebeb]"></div>
           <div className="absolute left-8 right-0 top-2/3 border-t border-[#ebebeb]"></div>

           {/* SVG Chart Lines */}
           <svg className="absolute left-8 right-0 top-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d="M0,90 Q10,85 20,88 T40,65 T60,85 T80,80 T90,20 T100,85" fill="none" stroke="#008060" strokeWidth="1" className="opacity-80" />
             <path d="M0,95 Q15,90 25,92 T45,85 T65,95 T85,90 T90,60 T100,95" fill="none" stroke="#5c6ac4" strokeWidth="1" className="opacity-80" />
             <path d="M0,98 Q20,95 30,97 T50,92 T70,98 T90,95 T90,75 T100,98" fill="none" stroke="#2c6ecb" strokeWidth="1" className="opacity-80" />
           </svg>
           
           {/* X-axis labels */}
           <div className="absolute left-8 right-0 -bottom-6 flex justify-between text-xs text-gray-400">
             <span>Jul 4</span><span>Jul 8</span><span>Jul 12</span><span>Jul 16</span><span>Jul 20</span><span>Jul 24</span><span>Jul 28</span><span>Aug 1</span>
           </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 pb-2">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#008060]"></div> Bing (organic)</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#5c6ac4]"></div> Direct</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2c6ecb]"></div> Google Search (organic)</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#de3618]"></div> Unattributed (unknown)</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#47c1bf]"></div> Facebook (unknown)</div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#e4f1fe] border border-[#bce0fd] rounded-lg p-3 flex items-center justify-between text-sm text-[#003b70]">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 shrink-0 text-[#003b70]" />
          <span>Cost, click, and impression metrics are now available for supported marketing apps. <a href="#" className="underline">Learn more</a></span>
        </div>
        <button className="text-[#003b70] hover:text-black">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Data Table */}
      <div className="polaris-card">
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent transition">
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
            {selectedIds.size > 0 && (
              <span className="text-sm font-medium text-[#1a1a1a]">
                {selectedIds.size} selected
              </span>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="polaris-table whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-white select-none">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-medium cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("channel")}>
                  Channel {renderSortIndicator("channel")}
                </th>
                <th className="p-3 font-medium cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("type")}>
                  Type {renderSortIndicator("type")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("sessions")}>
                  Sessions {renderSortIndicator("sessions")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("sales")}>
                  Sales {renderSortIndicator("sales")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("orders")}>
                  Orders {renderSortIndicator("orders")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("cr")}>
                  Conversion rate {renderSortIndicator("cr")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("cost")}>
                  Cost {renderSortIndicator("cost")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("roas")}>
                  ROAS {renderSortIndicator("roas")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("cpa")}>
                  CPA {renderSortIndicator("cpa")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("ctr")}>
                  CTR {renderSortIndicator("ctr")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("aov")}>
                  AOV {renderSortIndicator("aov")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("newC")}>
                  Orders from new customers {renderSortIndicator("newC")}
                </th>
                <th className="p-3 font-medium text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("retC")}>
                  Orders from returning customers {renderSortIndicator("retC")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const selected = isRowSelected(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-[#ebebeb] h-[44px] transition ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, row.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-medium text-[#1a1a1a] flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">{row.icon}</div>
                      {row.channel}
                    </td>
                    <td className="p-3 text-[#1a1a1a]">{row.type}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{row.sessions}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{row.sales}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{row.orders}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{row.cr}</td>
                    <td className="p-3 text-gray-400 text-right">{row.cost}</td>
                    <td className="p-3 text-gray-400 text-right">{row.roas}</td>
                    <td className="p-3 text-gray-400 text-right">{row.cpa}</td>
                    <td className="p-3 text-gray-400 text-right">{row.ctr}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{row.aov}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{row.newC}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{row.retC}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
