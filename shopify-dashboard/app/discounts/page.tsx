"use client";

import { Badge } from "@/components/Badge";
import { ChevronDown, Search, ArrowDownUp, Columns, Users, Tag as TagIcon, Box, Settings, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialDiscounts = [
  { id: 1, title: "Special", desc: "20% off 34 collections", status: "Expired", method: "Automatic", eligibility: "All customers", type: "Amount off product", used: 1 },
];

export default function Discounts() {
  const {
    sortedData: discounts,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialDiscounts, "id");

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
        <h1 className="text-[20px] font-semibold text-[#202223]">Discounts</h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary transition">
            <ArrowDownUp className="w-4 h-4" /> Export
          </button>
          <button className="polaris-btn polaris-btn-primary transition">
            Create discount
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 rounded flex items-center gap-1 hover:bg-gray-200 transition">
              All {selectedIds.size > 0 ? `(${selectedIds.size} selected)` : ""} <ArrowDownUp className="w-3 h-3 text-gray-500 ml-1" />
            </button>
            <div className="flex items-center text-gray-500 text-sm font-medium gap-2 px-2 hover:bg-gray-50 cursor-pointer rounded py-1.5 transition">
              <Search className="w-4 h-4" />
              Search and filter
            </div>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 border border-transparent hover:border-gray-300 transition">
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
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("title")}>
                  Title {renderSortIndicator("title")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("status")}>
                  Status {renderSortIndicator("status")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("method")}>
                  Method {renderSortIndicator("method")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("eligibility")}>
                  Eligibility {renderSortIndicator("eligibility")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("type")}>
                  Type {renderSortIndicator("type")}
                </th>
                <th className="p-3">Combinations</th>
                <th className="p-3 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("used")}>
                  Used {renderSortIndicator("used")}
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((item, idx) => {
                const selected = isRowSelected(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-[#ebebeb] h-[44px] transition ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, item.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-semibold text-[#1a1a1a]">
                      <div>{item.title}</div>
                      <div className="font-normal text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="default">{item.status}</Badge>
                    </td>
                    <td className="p-3 text-[#1a1a1a]">{item.method}</td>
                    <td className="p-3 text-[#1a1a1a] flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      {item.eligibility}
                    </td>
                    <td className="p-3 text-[#1a1a1a]">
                      <div className="flex items-center gap-1.5">
                        <TagIcon className="w-4 h-4 text-gray-400" /> {item.type}
                      </div>
                    </td>
                    <td className="p-3 text-gray-400">
                      <div className="flex gap-1">
                        <TagIcon className="w-4 h-4" />
                        <Box className="w-4 h-4" />
                        <Settings className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="p-3 text-[#1a1a1a] text-right">{item.used}</td>
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
