"use client";

import Link from "next/link";
import { ArrowDownUp, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { ContentIcon } from "@shopify/polaris-icons";
import { useTableLogic } from "@/hooks/admin/useTableLogic";

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
    sortColumn,
    sortDirection,
    handleSort,
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
    <div className="w-full font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-bold text-[#1a1a1a] flex items-center gap-2">
          <ContentIcon className="w-5 h-5 fill-current text-[#1a1a1a]" />
          <span>Menus</span>
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[13px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition shadow-2xs">
            URL redirects
          </button>
          <Link
            href="/admin/content/menus/new"
            className="px-3.5 py-1 text-[13px] font-semibold bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs inline-flex items-center justify-center"
          >
            Create menu
          </Link>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#fafafa] select-none">
                <th className="px-4 py-2.5 w-1/4 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    <span>Menu</span>
                    {renderSortIndicator("name")}
                  </div>
                </th>
                <th className="px-4 py-2.5 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("items")}>
                  <div className="flex items-center gap-1">
                    <span>Menu items</span>
                    {renderSortIndicator("items")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f2f4] text-[13px]">
              {menus.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-[#f6f6f7] transition"
                >
                  <td className="px-4 py-3 font-medium text-[#1a1a1a] whitespace-nowrap align-top">
                    <Link href={`/admin/content/menus/${m.id}`} className="hover:underline text-[#1a1a1a]">
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#303030] align-top leading-relaxed">
                    {m.items}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
