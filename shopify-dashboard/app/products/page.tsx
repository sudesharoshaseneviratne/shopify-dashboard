"use client";

import { Badge } from "@/components/Badge";
import { ChevronDown, Search, ArrowDownUp, Columns, Image as ImageIcon, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialProducts = [
  { id: 1, name: "Abacus Year 2 Workbook 3", status: "Active", inventory: "3 in stock", inventoryColor: "text-red-600", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 2, name: "Abacus Year 2 Textbook", status: "Active", inventory: "3 in stock", inventoryColor: "text-red-600", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 3, name: "THE SECRET SEVEN - SECRET SEVEN ADVENTURE", status: "Active", inventory: "11 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 4, name: "THE BUDDHIST WAY OF LIFE FOR GRADE 6 STU - BOOK 5", status: "Active", inventory: "9 in stock", inventoryColor: "text-red-600", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 5, name: "Sinhala Wada Potha 3", status: "Active", inventory: "6 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 6, name: "Sinhala Wada Potha 2", status: "Active", inventory: "6 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 7, name: "Sinhala Kiyaveem Potha 5", status: "Active", inventory: "6 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 8, name: "Sinhala Kiyaveem Potha 4", status: "Unlisted", inventory: "6 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK", noImage: true },
  { id: 9, name: "Sinhala Kiyaveem Potha 3", status: "Unlisted", inventory: "6 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK", noImage: true },
  { id: 10, name: "Sinhala Kiyaveem Potha 2", status: "Unlisted", inventory: "6 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK", noImage: true },
  { id: 11, name: "RADIANT WAY THIRD STEP", status: "Active", inventory: "6 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 12, name: "OXFORD STUDENT LEARNERS DICTIONARY", status: "Active", inventory: "16 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
  { id: 13, name: "Oxford Reading Circle Primer revised edition", status: "Active", inventory: "15 in stock", inventoryColor: "text-[#1a1a1a]", category: "Print Books", channels: "4", type: "", vendor: "Learnix LK" },
];

export default function Products() {
  const {
    sortedData: products,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialProducts, "id");

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
        <h1 className="text-[20px] font-semibold text-[#202223]">Products</h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary transition">
            Export
          </button>
          <button className="polaris-btn polaris-btn-secondary transition">
            Import
          </button>
          <button className="polaris-btn polaris-btn-secondary transition">
            More actions <ChevronDown className="w-4 h-4" />
          </button>
          <button className="polaris-btn polaris-btn-primary transition">
            Add product
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
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 border border-transparent hover:border-gray-300 transition">
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="polaris-table">
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
                  Product {renderSortIndicator("name")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("status")}>
                  Status {renderSortIndicator("status")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("inventory")}>
                  Inventory {renderSortIndicator("inventory")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("category")}>
                  Category {renderSortIndicator("category")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("channels")}>
                  Channels {renderSortIndicator("channels")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("type")}>
                  Product type {renderSortIndicator("type")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("vendor")}>
                  Vendor {renderSortIndicator("vendor")}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => {
                const selected = isRowSelected(product.id);
                return (
                  <tr
                    key={product.id}
                    className={`border-b border-[#ebebeb] h-[44px] transition whitespace-nowrap ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, product.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-semibold text-[#1a1a1a] flex items-center gap-3 w-96 overflow-hidden">
                      <div className="w-8 h-8 rounded border border-[#e1e3e5] bg-gray-50 flex items-center justify-center shrink-0">
                        {product.noImage ? (
                          <ImageIcon className="w-4 h-4 text-gray-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-blue-300 to-green-300 rounded" />
                        )}
                      </div>
                      <span className="truncate" title={product.name}>{product.name}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant={product.status === "Active" ? "success" : "default"}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className={`p-3 font-medium ${product.inventoryColor}`}>{product.inventory}</td>
                    <td className="p-3 text-[#1a1a1a]">{product.category}</td>
                    <td className="p-3">{product.channels}</td>
                    <td className="p-3 text-[#1a1a1a]">{product.type}</td>
                    <td className="p-3 text-[#1a1a1a]">{product.vendor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 flex items-center justify-center gap-4 border-t border-[#e1e3e5] rounded-b-lg text-sm text-[#1a1a1a]">
          <div className="flex gap-1">
            <button className="p-1 border border-gray-300 rounded text-gray-400 bg-gray-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border polaris-btn polaris-btn-secondary text-[#1a1a1a]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span>1-50</span>
        </div>
      </div>
    </div>
  );
}
