"use client";

import {
  FileText,
  Search,
  Columns,
  Image as ImageIcon,
  Link as LinkIcon,
  Paperclip,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialFiles = [
  { id: 1, name: "Gemini_Generated_Image_nhd3tnhd3tnhd3tn", ext: "PNG", date: "Wednesday at 9:25 am", size: "2.04 MB", refs: "", color: "bg-purple-100 text-purple-500" },
  { id: 2, name: "Cambridge_Edexcel_International_School_Books_3", ext: "PNG", date: "Tuesday at 4:30 pm", size: "706.83 KB", refs: "", color: "bg-blue-100 text-blue-500" },
  { id: 3, name: "Gemini_Generated_Image_qg68gdq068gdq068", ext: "PNG", date: "Jul 24 at 9:19 am", size: "2.27 MB", refs: "", color: "bg-green-100 text-green-500" },
  { id: 4, name: "Gemini_Generated_Image_dyzsdpdyzsdpdyzs", ext: "PNG", date: "Jul 22 at 3:51 pm", size: "1.08 MB", refs: "", color: "bg-orange-100 text-orange-500" },
  { id: 5, name: "cover_52528_89268", ext: "JPG", date: "Jul 21 at 8:25 pm", size: "26.82 KB", refs: "1 product", color: "bg-red-100 text-red-500" },
  { id: 6, name: "04cc7a5d33a2181bbb1a88f998ac89a9", ext: "JPG", date: "Jul 21 at 8:24 pm", size: "421.74 KB", refs: "1 product", color: "bg-teal-100 text-teal-500", hasIcons: true },
  { id: 7, name: "40757", ext: "JPG", date: "Jul 21 at 8:14 pm", size: "34.08 KB", refs: "1 product", color: "bg-indigo-100 text-indigo-500" },
  { id: 8, name: "40759_4f02f7e1-0d90-42f1-9b8c-fe4c26eb0d54", ext: "JPG", date: "Jul 21 at 8:14 pm", size: "37.72 KB", refs: "1 product", color: "bg-yellow-100 text-yellow-600" },
  { id: 9, name: "40759", ext: "JPG", date: "Jul 21 at 8:13 pm", size: "37.72 KB", refs: "1 product", color: "bg-pink-100 text-pink-500" },
  { id: 10, name: "81onyFmCg1L...AC_UF1000,1000_QL80", ext: "JPG", date: "Jul 21 at 8:13 pm", size: "89.49 KB", refs: "1 product", color: "bg-gray-100 text-gray-500" },
  { id: 11, name: "40761", ext: "JPG", date: "Jul 21 at 8:13 pm", size: "33.25 KB", refs: "1 product", color: "bg-blue-100 text-blue-500" },
  { id: 12, name: "cover_48817_96880", ext: "JPG", date: "Jul 21 at 8:12 pm", size: "31.04 KB", refs: "1 product", color: "bg-green-100 text-green-500" },
];

export default function Files() {
  const {
    sortedData: files,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialFiles, "id");

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
           <FileText className="w-5 h-5 text-gray-500" /> Files
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary transition">
            Upload from URL
          </button>
          <button className="polaris-btn polaris-btn-primary transition">
            Upload files
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 rounded flex items-center gap-1 hover:bg-gray-200 transition">
              All {selectedIds.size > 0 ? `(${selectedIds.size} selected)` : ""}
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
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("name")}>
                  File name {renderSortIndicator("name")}
                </th>
                <th className="p-3">Alt text</th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("date")}>
                  Date added {renderSortIndicator("date")}
                </th>
                <th className="p-3 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("size")}>
                  Size {renderSortIndicator("size")}
                </th>
                <th className="p-3 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("refs")}>
                  References {renderSortIndicator("refs")}
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, idx) => {
                const selected = isRowSelected(f.id);
                return (
                  <tr
                    key={f.id}
                    className={`border-b border-[#ebebeb] h-[44px] transition group ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {}}
                        onClick={(e) => handleRowCheckboxClick(e, idx, f.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-medium text-[#1a1a1a] flex items-center gap-3">
                      <div className={`w-10 h-10 rounded border border-[#e1e3e5] flex flex-col items-center justify-center shrink-0 ${f.color}`}>
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="truncate w-64 text-[#1a1a1a]">{f.name}</div>
                        <div className="text-xs text-gray-500 font-normal">{f.ext}</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-500"></td>
                    <td className="p-3 text-[#1a1a1a]">{f.date}</td>
                    <td className="p-3 text-[#1a1a1a] text-right">{f.size}</td>
                    <td className="p-3 text-[#1a1a1a]">
                       <div className="flex items-center justify-between">
                         {f.refs && (
                           <span className="cursor-pointer hover:underline flex items-center gap-1">
                             {f.refs} <ChevronDown className="w-3 h-3" />
                           </span>
                         )}
                         {!f.refs && <span></span>}
                         
                         {f.hasIcons && (
                           <div className="flex gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                             <LinkIcon className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
                             <Paperclip className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
                           </div>
                         )}
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-3 flex items-center gap-4 bg-gray-50 rounded-b-lg border-t border-[#e1e3e5] text-sm text-[#1a1a1a]">
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-gray-400 hover:bg-gray-200" disabled>&lt;</button>
            <button className="p-1 rounded text-[#1a1a1a] hover:bg-gray-200">&gt;</button>
          </div>
          <span>1-50</span>
        </div>
      </div>
    </div>
  );
}
