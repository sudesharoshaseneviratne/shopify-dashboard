"use client";

import { Badge } from "@/components/Badge";
import { ArrowDownUp, Search, Columns, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialDrafts = [
  { id: "#D2", po: "", date: "Monday at 7:54 pm", customer: "E. P. H. De Silva", status: "Completed", statusType: "neutral", total: "Rs 2,438.00 LKR" },
  { id: "#D1", po: "", date: "Jul 15 at 8:07 pm", customer: "No customer", status: "Open", statusType: "warning", total: "Rs 19,400.00 LKR" },
];

export default function Drafts() {
  const {
    sortedData: drafts,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialDrafts, "id");

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
            <FileText className="w-4 h-4 text-[#303030]" />
          </div> 
          Drafts
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition">
            Export
          </button>
          <button className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition">
            Create order
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
                  Draft order {renderSortIndicator("id")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("po")}>
                  PO number {renderSortIndicator("po")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("date")}>
                  Date {renderSortIndicator("date")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("customer")}>
                  Customer {renderSortIndicator("customer")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("status")}>
                  Status {renderSortIndicator("status")}
                </th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("total")}>
                  Total {renderSortIndicator("total")}
                </th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((d, idx) => {
                const selected = isRowSelected(d.id);
                return (
                  <tr
                    key={d.id}
                    className={`border-b border-[#f1f1f1] h-[34px] transition ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                    }`}
                  >
                    <td className="px-3 py-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, d.id)}
                        className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-1 font-medium text-[#1a1a1a] hover:underline cursor-pointer">{d.id}</td>
                    <td className="px-3 py-1 text-[#8c8c8c]">{d.po}</td>
                    <td className="px-3 py-1 text-[#616161]">{d.date}</td>
                    <td className="px-3 py-1 text-[#1a1a1a] hover:underline cursor-pointer">{d.customer}</td>
                    <td className="px-3 py-1">
                      <Badge
                        variant={d.status === "Open" ? "amber" : "neutral"}
                        icon={d.status === "Open" ? "ring" : "square"}
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-1 text-[#1a1a1a] font-medium text-right">{d.total}</td>
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
