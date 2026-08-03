"use client";

import { Folder, Columns, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialCampaigns = [
  { id: 1, name: "CMP1", updated: "Jul 26, 2026", created: "Jul 22, 2026", sessions: "2,160", sales: "LKR 69,464.00" },
];

export default function Campaigns() {
  const {
    sortedData: campaigns,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialCampaigns, "id");

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
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           <Folder className="w-5 h-5 text-gray-500" /> Campaigns
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-primary transition">
            Create campaign
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 rounded flex items-center gap-1 hover:bg-gray-200 transition">
              All {selectedIds.size > 0 ? `(${selectedIds.size} selected)` : ""}
            </button>
          </div>
          <div className="flex items-center gap-2 pr-2 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent transition">
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
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
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("name")}>
                  Campaign {renderSortIndicator("name")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("updated")}>
                  Updated {renderSortIndicator("updated")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("created")}>
                  Created {renderSortIndicator("created")}
                </th>
                <th className="p-3 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("sessions")}>
                  Sessions (YTD) {renderSortIndicator("sessions")}
                </th>
                <th className="p-3 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("sales")}>
                  Sales (YTD) {renderSortIndicator("sales")}
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, idx) => {
                const selected = isRowSelected(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-[#ebebeb] h-[44px] transition ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, c.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-medium text-[#1a1a1a]">{c.name}</td>
                    <td className="p-3 text-[#1a1a1a]">{c.updated}</td>
                    <td className="p-3 text-[#1a1a1a]">{c.created}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{c.sessions}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{c.sales}</td>
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
