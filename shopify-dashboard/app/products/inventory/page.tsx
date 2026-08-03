"use client";

import { ArrowDownUp, Search, Columns, Package, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialInventory = [
  { id: 1, title: "Abacus Year 1 Workbook 1", sku: "No SKU", unav: 0, comm: 0, avail: 4, onhand: 4, inc: 0 },
  { id: 2, title: "Abacus Year 1 Workbook 2", sku: "No SKU", unav: 0, comm: 0, avail: 4, onhand: 4, inc: 0 },
  { id: 3, title: "Abacus Year 1 Workbook 3", sku: "No SKU", unav: 0, comm: 0, avail: 0, onhand: 0, inc: 0 },
  { id: 4, title: "Abacus Year 2 Textbook", sku: "No SKU", unav: 0, comm: 0, avail: 3, onhand: 3, inc: 0 },
  { id: 5, title: "Abacus Year 2 Workbook 1", sku: "No SKU", unav: 0, comm: 0, avail: 15, onhand: 15, inc: 0 },
  { id: 6, title: "Abacus Year 2 Workbook 2", sku: "No SKU", unav: 0, comm: 0, avail: 15, onhand: 15, inc: 0 },
  { id: 7, title: "Abacus Year 2 Workbook 3", sku: "No SKU", unav: 0, comm: 0, avail: 3, onhand: 3, inc: 0 },
  { id: 8, title: "Abacus Year 3 Textbook 1", sku: "9781408278475", unav: 0, comm: 0, avail: 3, onhand: 3, inc: 0 },
  { id: 9, title: "Abacus Year 3 Textbook 2", sku: "9781408278482", unav: 0, comm: 0, avail: 3, onhand: 3, inc: 0 },
  { id: 10, title: "Abacus Year 3 Textbook 3", sku: "9781408278499", unav: 0, comm: 0, avail: 3, onhand: 3, inc: 0 },
  { id: 11, title: "ACCOUNTING FOR CAMBRIDGE INTL AS & AL", sku: "No SKU", unav: 0, comm: 0, avail: 1, onhand: 1, inc: 0 },
  { id: 12, title: "BIOLOGY FOR CAMBRIDGE IGCSE REVISION GUIDE - 3 ED", sku: "No SKU", unav: 0, comm: 0, avail: 5, onhand: 5, inc: 0 },
  { id: 13, title: "BUILDING BLOCKS YEAR 1 SPELLING GRAMMAR", sku: "No SKU", unav: 0, comm: 0, avail: 3, onhand: 3, inc: 0 },
];

export default function Inventory() {
  const {
    sortedData: inventory,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialInventory, "id");

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
          <Package className="w-5 h-5" /> Inventory
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary transition">
            Export
          </button>
          <button className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-1 transition">
            Import
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
                  Product {renderSortIndicator("title")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("sku")}>
                  SKU {renderSortIndicator("sku")}
                </th>
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("unav")}>
                  Unavailable {renderSortIndicator("unav")}
                </th>
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("comm")}>
                  Committed {renderSortIndicator("comm")}
                </th>
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("avail")}>
                  Available {renderSortIndicator("avail")}
                </th>
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("onhand")}>
                  On hand {renderSortIndicator("onhand")}
                </th>
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("inc")}>
                  Incoming {renderSortIndicator("inc")}
                </th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, idx) => {
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
                    <td className="p-3 font-medium text-[#1a1a1a] flex items-center gap-3 w-80 truncate">
                      <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded flex items-center justify-center text-blue-400 shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="truncate">{item.title}</span>
                    </td>
                    <td className="p-3 text-[#1a1a1a]">{item.sku}</td>
                    <td className="p-3 text-[#1a1a1a] text-center">{item.unav}</td>
                    <td className="p-3 text-[#1a1a1a] text-center">{item.comm}</td>
                    <td className="p-3 text-[#1a1a1a] text-center font-medium">{item.avail}</td>
                    <td className="p-3 text-[#1a1a1a] text-center">{item.onhand}</td>
                    <td className="p-3 text-[#1a1a1a] text-center">{item.inc}</td>
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
