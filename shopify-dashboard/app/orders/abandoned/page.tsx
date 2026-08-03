"use client";

import { Badge } from "@/components/Badge";
import { ArrowDownUp, Search, Columns, ShoppingCart, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialCheckouts = [
  { id: "#39007857574130", date: "Jul 24 at 10:29 pm", customer: "Alex Johnson", region: "Sri Lanka", status: "Not recovered", statusType: "attention", total: "Rs 8,400.00" },
  { id: "#38797012074738", date: "Jul 3 at 4:48 pm", customer: "Victoria Bloom", region: "Sri Lanka", status: "Not recovered", statusType: "attention", total: "Rs 3,400.00" },
  { id: "#38709651996914", date: "Jun 22 at 7:59 pm", customer: "Ethan Williams", region: "United States", status: "Not recovered", statusType: "attention", total: "Rs 300.00" },
  { id: "#38559630975474", date: "May 25 at 6:55 pm", customer: "learnix.lk@ilovemyemail.net", region: "Sri Lanka", status: "Not recovered", statusType: "attention", total: "Rs 4,580.00" },
];

export default function AbandonedCheckouts() {
  const {
    sortedData: checkouts,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialCheckouts, "id");

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
            <ShoppingCart className="w-4 h-4 text-[#303030]" />
          </div> 
          Abandoned checkouts
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition">
            Export
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="polaris-card">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2 flex-1">
            <button className="px-2.5 py-1 text-[13px] font-medium bg-[#f1f2f4] text-[#1a1a1a] rounded-md flex items-center gap-1 hover:bg-[#e4e5e7] transition">
              All {selectedIds.size > 0 ? `(${selectedIds.size} selected)` : ""} <ArrowDownUp className="w-3 h-3 text-[#616161] ml-0.5" />
            </button>
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#616161] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search and filter"
                className="w-full text-[13px] bg-[#fafafa] border border-[#c9cccf] rounded-md pl-8 pr-3 py-1 outline-none focus:border-[#005bd3] focus:bg-white transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-md border border-transparent transition">
              <Columns className="w-4 h-4" />
            </button>
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
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("id")}>
                  Checkout {renderSortIndicator("id")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("date")}>
                  Created {renderSortIndicator("date")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("customer")}>
                  Customer name {renderSortIndicator("customer")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("region")}>
                  Region {renderSortIndicator("region")}
                </th>
                <th className="px-3 py-2 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("status")}>
                  Recovery status {renderSortIndicator("status")}
                </th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("total")}>
                  Total price {renderSortIndicator("total")}
                </th>
              </tr>
            </thead>
            <tbody>
              {checkouts.map((c, idx) => {
                const selected = isRowSelected(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-[#f1f1f1] h-[34px] transition ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                    }`}
                  >
                    <td className="px-3 py-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, c.id)}
                        className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-1 font-medium text-[#1a1a1a] hover:underline cursor-pointer">{c.id}</td>
                    <td className="px-3 py-1 text-[#616161]">{c.date}</td>
                    <td className="px-3 py-1 text-[#1a1a1a] hover:underline cursor-pointer">{c.customer}</td>
                    <td className="px-3 py-1 text-[#616161]">{c.region}</td>
                    <td className="px-3 py-1 text-center">
                      <Badge variant={c.statusType as any} icon="none">{c.status}</Badge>
                    </td>
                    <td className="px-3 py-1 text-[#1a1a1a] font-medium text-right">{c.total}</td>
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
