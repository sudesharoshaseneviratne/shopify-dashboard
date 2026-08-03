"use client";

import { FileText, Search, ArrowDownUp, Settings, MessageSquare, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/Badge";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialPosts = [
  { id: 1, title: "Cambridge vs Pearson | Which Curriculum is Right for Your Child? | Learnix.lk", vis: "Visible", author: "Learnix LK", blog: "Blogs", updated: "Wednesday at 9:26 am", pub: "Jul 29, 2026", color: "bg-blue-100 text-blue-500" },
  { id: 2, title: "Cambridge Primary Books in Sri Lanka | Complete Parent's Guide | Learnix.lk", vis: "Visible", author: "Learnix LK", blog: "Blogs", updated: "Jul 24 at 8:19 am", pub: "Jul 24, 2026", color: "bg-green-100 text-green-500" },
  { id: 3, title: "Pearson iPrimary Reception Books in Sri Lanka: A Complete Parent's Guide", vis: "Visible", author: "Learnix LK", blog: "Blogs", updated: "Jul 22 at 4:07 pm", pub: "Jul 22, 2026", color: "bg-orange-100 text-orange-500" },
  { id: 4, title: "Our Big Exam Prep Sale is Here!", vis: "Hidden", author: "Learnix LK", blog: "News", updated: "Jul 22 at 4:00 pm", pub: "", color: "bg-gray-100 text-gray-500" },
  { id: 5, title: "Choosing Your A-Level Subjects: A Guide to Balancing Passion and Career Goals", vis: "Visible", author: "Learnix LK", blog: "Blogs", updated: "Nov 14 at 12:17 pm", pub: "Nov 14, 2025", color: "bg-red-100 text-red-500" },
  { id: 6, title: "5 Proven Study Techniques for Your Edexcel & Cambridge Exams", vis: "Visible", author: "Learnix LK", blog: "Blogs", updated: "Nov 14 at 12:16 pm", pub: "Nov 14, 2025", color: "bg-teal-100 text-teal-500" },
  { id: 7, title: "Key Update", vis: "Visible", author: "Learnix LK", blog: "News", updated: "Nov 14 at 12:12 pm", pub: "Oct 30, 2025", color: "bg-indigo-100 text-indigo-500" },
  { id: 8, title: "How to Use Past Papers Effectively", vis: "Visible", author: "Learnix LK", blog: "Blogs", updated: "Nov 14 at 12:12 pm", pub: "Nov 14, 2025", color: "bg-yellow-100 text-yellow-600" },
  { id: 9, title: "New Arrivals", vis: "Visible", author: "Learnix LK", blog: "News", updated: "Nov 14 at 12:05 pm", pub: "Nov 7, 2025", color: "bg-pink-100 text-pink-500" },
];

export default function BlogPosts() {
  const {
    sortedData: posts,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialPosts, "id");

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
           <FileText className="w-5 h-5 text-gray-500" /> Blog posts
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary transition">
            <Settings className="w-4 h-4" /> Manage blogs
          </button>
          <button className="polaris-btn polaris-btn-secondary transition">
            <MessageSquare className="w-4 h-4" /> Manage comments
          </button>
          <button className="polaris-btn polaris-btn-primary transition">
            Add blog post
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card">
        {/* Table Toolbar Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-[#e1e3e5] bg-white">
          <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 rounded">
            All {selectedIds.size > 0 ? `(${selectedIds.size} selected)` : ""}
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded">
            +
          </button>
        </div>

        {/* Table Toolbar Actions */}
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2 px-2 text-gray-500 text-sm font-medium cursor-pointer hover:bg-gray-50 rounded py-1.5 w-full max-w-sm transition">
             <Search className="w-4 h-4" />
             Search
          </div>
          <div className="flex items-center gap-2 pr-2 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent transition">
              <Search className="w-4 h-4" />
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
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("vis")}>
                  Visibility {renderSortIndicator("vis")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("author")}>
                  Author {renderSortIndicator("author")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("blog")}>
                  Blog {renderSortIndicator("blog")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("updated")}>
                  Updated {renderSortIndicator("updated")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("pub")}>
                  Published {renderSortIndicator("pub")}
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, idx) => {
                const selected = isRowSelected(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-[#ebebeb] h-[44px] transition ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, p.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-medium text-[#1a1a1a] flex items-center gap-3 w-96">
                      <div className="w-9 h-9 rounded-md bg-[#f1f1f1] border border-[#e1e3e5] flex items-center justify-center shrink-0 text-[#8c8c8c]">
                        <ImageIcon className="w-4 h-4 text-[#8c8c8c]" />
                      </div>
                      <span className="truncate">{p.title}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant={p.vis === "Visible" ? "success" : "neutral"}>
                        {p.vis}
                      </Badge>
                    </td>
                    <td className="p-3 text-[#1a1a1a]">{p.author}</td>
                    <td className="p-3 text-[#1a1a1a]">{p.blog}</td>
                    <td className="p-3 text-[#1a1a1a]">{p.updated}</td>
                    <td className="p-3 text-[#1a1a1a]">{p.pub}</td>
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
