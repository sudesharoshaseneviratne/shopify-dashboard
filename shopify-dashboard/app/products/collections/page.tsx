"use client";

import { ArrowDownUp, Search, Columns, Tag, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialCollections = [
  { id: 1, title: "General Practice & Workbooks", products: 4, conditions: "" },
  { id: 2, title: "Religious Studies", products: 3, conditions: "" },
  { id: 3, title: "Sinhala Books", products: 8, conditions: "" },
  { id: 4, title: "Oxford Literature", products: 2, conditions: "" },
  { id: 5, title: "Cambridge Lower Secondary", products: 7, conditions: "" },
  { id: 6, title: "Pearson & Longman Titles", products: 6, conditions: "" },
  { id: 7, title: "Junior Artist", products: 6, conditions: "" },
  { id: 8, title: "Other", products: 8, conditions: "" },
  { id: 9, title: "Other Cambridge Titles", products: 6, conditions: "" },
  { id: 10, title: "Nelson Publishers", products: 32, conditions: "" },
  { id: 11, title: "Inspire Computing International", products: 16, conditions: "" },
  { id: 12, title: "Abacus Workbook", products: 10, conditions: "" },
  { id: 13, title: "Building Blocks", products: 6, conditions: "" },
  { id: 14, title: "English Workbooks", products: 9, conditions: "" },
];

export default function Collections() {
  const {
    sortedData: collections,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialCollections, "id");

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
          <Tag className="w-5 h-5" /> Collections
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-primary transition">
            Add collection
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
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("title")}>
                  Title {renderSortIndicator("title")}
                </th>
                <th className="p-3 w-24 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("products")}>
                  Products {renderSortIndicator("products")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("conditions")}>
                  Conditions {renderSortIndicator("conditions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c, idx) => {
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
                    <td className="p-3 font-medium text-[#1a1a1a] flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 border border-[#e1e3e5] rounded flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      {c.title}
                    </td>
                    <td className="p-3 text-[#1a1a1a] text-center">{c.products}</td>
                    <td className="p-3 text-[#1a1a1a]">{c.conditions}</td>
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
