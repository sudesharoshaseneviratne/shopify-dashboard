"use client";

import { Users, Search, MoreHorizontal, ShoppingBag, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialSegments = [
  { id: 1, name: "Customers added to companies", pct: "0%", date: "Created on Apr 9, 2026", createdBy: "Shopify" },
  { id: 2, name: "Customers not added to companies", pct: "58%", date: "Created on Apr 9, 2026", createdBy: "Shopify" },
  { id: 3, name: "Customers who have purchased at least once", pct: "13%", date: "Created on Oct 19, 2025", createdBy: "Shopify" },
  { id: 4, name: "Email subscribers", pct: "13%", date: "Created on Oct 19, 2025", createdBy: "Shopify" },
  { id: 5, name: "Abandoned checkouts in the last 30 days", pct: "7%", date: "Created on Oct 19, 2025", createdBy: "Shopify" },
  { id: 6, name: "Customers who have purchased more than once", pct: "0%", date: "Created on Oct 19, 2025", createdBy: "Shopify" },
  { id: 7, name: "Customers who haven't purchased", pct: "44%", date: "Created on Oct 19, 2025", createdBy: "Shopify" },
];

export default function Segments() {
  const {
    sortedData: segments,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialSegments, "id");

  const renderSortIndicator = (colKey: string) => {
    if (sortColumn !== colKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[18px] font-semibold text-[#1a1a1a] flex items-center gap-2">
          <div className="bg-white p-1 rounded-md border border-[#e1e3e5] shadow-xs">
            <Users className="w-4 h-4 text-[#303030]" />
          </div> 
          Segments
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition">
            Create segment
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="polaris-card">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#616161] absolute left-2.5 top-2.5" />
              <input 
                type="text" 
                placeholder="Search segments" 
                className="w-full text-[13px] bg-[#fafafa] border border-[#c9cccf] rounded-md pl-8 pr-3 py-1 outline-none focus:border-[#005bd3] focus:bg-white transition"
              />
            </div>
            {selectedIds.size > 0 && (
              <span className="text-[13px] font-medium text-[#1a1a1a]">
                {selectedIds.size} selected
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="polaris-table">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#f7f7f7] select-none">
                <th className="px-3 py-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("name")}>
                  Name {renderSortIndicator("name")}
                </th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("pct")}>
                  % of customers {renderSortIndicator("pct")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("date")}>
                  Last activity {renderSortIndicator("date")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("createdBy")}>
                  Created by {renderSortIndicator("createdBy")}
                </th>
                <th className="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {segments.map((s, idx) => {
                const selected = isRowSelected(s.id);
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-[#f1f1f1] h-[40px] transition group ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                    }`}
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, s.id)}
                        className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2 font-medium text-[#1a1a1a] hover:underline cursor-pointer">{s.name}</td>
                    <td className="px-3 py-2 text-[#1a1a1a] font-medium text-right">{s.pct}</td>
                    <td className="px-3 py-2 text-[#616161]">{s.date}</td>
                    <td className="px-3 py-2 text-[#1a1a1a] flex items-center gap-1.5 font-medium">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#95bf47] fill-[#95bf47]" /> {s.createdBy}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button className="text-[#616161] hover:text-[#1a1a1a] p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
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
