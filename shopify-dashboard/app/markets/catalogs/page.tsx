"use client";

import { Book, ArrowDownUp, Search, Columns, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/Badge";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialCatalogs = [
  { id: 1, title: "All Products", status: "Active", assigned: "", overrides: "", adj: "None", products: "291" },
];

export default function Catalogs() {
  const {
    sortedData: catalogs,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialCatalogs, "id");

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
           <Book className="w-5 h-5 text-gray-500" /> Catalogs
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-1 transition">
            Export
          </button>
          <button className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-1 transition">
            Import
          </button>
          <button className="polaris-btn polaris-btn-primary transition">
            Create catalog
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card">
        {/* Table Tabs */}
        <div className="flex items-center gap-4 px-2 pt-2 border-b border-[#e1e3e5] text-sm font-medium text-gray-500 bg-white">
          <button className="px-2 py-1.5 text-[#1a1a1a] border-b-2 border-black">All {selectedIds.size > 0 ? `(${selectedIds.size} selected)` : ""}</button>
          <button className="px-2 py-1.5 hover:text-[#1a1a1a]">Active</button>
          <button className="px-2 py-1.5 hover:text-[#1a1a1a]">Draft</button>
          <button className="px-2 py-1.5 hover:text-[#1a1a1a]">Archived</button>
        </div>

        {/* Table Toolbar Actions */}
        <div className="flex items-center justify-end p-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2 pr-2 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent transition">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent transition">
              <Columns className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent transition">
              <ArrowDownUp className="w-4 h-4" />
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
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("status")}>
                  Status {renderSortIndicator("status")}
                </th>
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("assigned")}>
                  Assigned to {renderSortIndicator("assigned")}
                </th>
                <th className="p-3 text-center cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("overrides")}>
                  Price overrides {renderSortIndicator("overrides")}
                </th>
                <th className="p-3 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("adj")}>
                  Overall adjustment {renderSortIndicator("adj")}
                </th>
                <th className="p-3 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("products")}>
                  Products {renderSortIndicator("products")}
                </th>
              </tr>
            </thead>
            <tbody>
              {catalogs.map((c, idx) => {
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
                    <td className="p-3 font-medium text-[#1a1a1a]">{c.title}</td>
                    <td className="p-3 text-center">
                      <Badge variant="success">{c.status}</Badge>
                    </td>
                    <td className="p-3 text-center">{c.assigned}</td>
                    <td className="p-3 text-center">{c.overrides}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{c.adj}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{c.products}</td>
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
