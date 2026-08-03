"use client";

import { List, ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialMenus = [
  { id: 1, name: "Quick Links", items: "Profile, Search, All products, Orders, Settings" },
  { id: 2, name: "Pearson Education", items: "Abacus Workbook, Building Blocks, Heinemann Explore Science, Inspire Computing International, iPrimary Series, Key Grammar, Power Maths" },
  { id: 3, name: "Oxford University Press", items: "Oxford English, Oxford Primary Computing, Nelson Publishers, Other Oxford Titles" },
  { id: 4, name: "Main menu", items: "Home, Collection, Blog, Contact, About us" },
  { id: 5, name: "Main Collection", items: "Cambridge University Press, Oxford University Press, Pearson Education, Generic Publishers" },
  { id: 6, name: "Generic Publishers", items: "English Workbooks, I Science, Junior Artist, Lift Off English, New Heinemann Maths (NHM), Pearson & Longman Titles, Primary Mathematics, Other" },
  { id: 7, name: "Footer menu", items: "Search" },
  { id: 8, name: "Footer Extend", items: "Privacy Policy, Refund Policy, Shipping Policy, Terms of Service" },
  { id: 9, name: "Customer account main menu", items: "Orders, Profile, Settings" },
  { id: 10, name: "Cambridge University Press", items: "Cambridge Checkpoint, Cambridge Global English, Cambridge IGCSE, Cambridge International AS & A Level, Cambridge Literature, Cambridge Lower Secondary, Cambridge Primary Science, Other Cambridge Titles" },
];

export default function Menus() {
  const {
    sortedData: menus,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialMenus, "id");

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
           <List className="w-5 h-5 text-gray-500" /> Menus
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary transition">
            URL redirects
          </button>
          <button className="polaris-btn polaris-btn-primary transition">
            Create menu
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card">
        {/* Table Toolbar */}
        {selectedIds.size > 0 && (
          <div className="p-2 border-b border-[#e1e3e5] bg-white text-sm font-medium text-[#1a1a1a]">
            {selectedIds.size} selected
          </div>
        )}

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
                <th className="p-3 w-1/4 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("name")}>
                  Menu {renderSortIndicator("name")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("items")}>
                  Menu items {renderSortIndicator("items")}
                </th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m, idx) => {
                const selected = isRowSelected(m.id);
                return (
                  <tr
                    key={m.id}
                    className={`border-b border-[#ebebeb] h-[44px] transition ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3 align-top">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, m.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-medium text-[#1a1a1a] whitespace-nowrap align-top">{m.name}</td>
                    <td className="p-3 text-[#1a1a1a] align-top leading-relaxed">{m.items}</td>
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
