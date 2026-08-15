"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CollectionIcon } from "@shopify/polaris-icons";
import {
  ArrowDownUp,
  Search,
  Columns,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Check,
  ChevronsUpDown,
  XCircle,
  GripVertical,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableLogic } from "@/hooks/admin/useTableLogic";

const initialCollections = [
  { id: 1, title: "Sinhala Books", products: 8, conditions: "", updated: "Jul 15 at 2:30 pm" },
  { id: 2, title: "Generic Publishers", products: 67, conditions: "", updated: "Jul 14 at 11:20 am" },
  { id: 3, title: "Best Sellers", products: 291, conditions: "", updated: "Jul 12 at 4:15 pm" },
  { id: 4, title: "New Arrival", products: 292, conditions: "", updated: "Jul 10 at 9:45 am" },
  { id: 5, title: "All Products", products: 292, conditions: "", updated: "Jul 08 at 1:10 pm" },
  { id: 6, title: "Power Maths", products: 3, conditions: "", updated: "Jul 05 at 10:30 am" },
  { id: 7, title: "Pearson Education", products: 86, conditions: "", updated: "Jul 02 at 3:50 pm" },
  { id: 8, title: "Oxford English", products: 14, conditions: "", updated: "Jun 29 at 8:20 am" },
  { id: 9, title: "Oxford University Press", products: 61, conditions: "", updated: "Jun 25 at 4:00 pm" },
  { id: 10, title: "General Practice & Workbooks", products: 4, conditions: "", updated: "Jun 20 at 11:15 am" },
  { id: 11, title: "Religious Studies", products: 3, conditions: "", updated: "Jun 18 at 2:40 pm" },
  { id: 12, title: "Oxford Literature", products: 2, conditions: "", updated: "Jun 15 at 9:00 am" },
  { id: 13, title: "Cambridge Lower Secondary", products: 7, conditions: "", updated: "Jun 12 at 5:10 pm" },
  { id: 14, title: "Pearson & Longman Titles", products: 6, conditions: "", updated: "Jun 10 at 1:25 pm" },
  { id: 15, title: "Junior Artist", products: 6, conditions: "", updated: "Jun 08 at 10:40 am" },
  { id: 16, title: "Nelson Publishers", products: 32, conditions: "", updated: "Jun 05 at 4:15 pm" },
  { id: 17, title: "Inspire Computing International", products: 16, conditions: "", updated: "Jun 02 at 11:30 am" },
  { id: 18, title: "Abacus Workbook", products: 10, conditions: "", updated: "May 28 at 3:00 pm" },
];

export default function Collections() {
  const router = useRouter();
  const [collectionsList, setCollectionsList] = useState(initialCollections);

  const {
    sortedData: collections,
    selectedIds,
    setSelectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(collectionsList, "id");

  // State Declarations for Toolbar & Popovers
  const [isViewsOpen, setIsViewsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isSortSubMenuOpen, setIsSortSubMenuOpen] = useState(false);
  const [isBulkSelectionMenuOpen, setIsBulkSelectionMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Column Visibility state (Products)
  const [columns, setColumns] = useState([
    { id: "products", label: "Products", visible: true },
  ]);

  const toggleColumnVisibility = (colId: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === colId ? { ...col, visible: !col.visible } : col))
    );
  };

  const isColVisible = (colId: string) => {
    const col = columns.find((c) => c.id === colId);
    return col ? col.visible : true;
  };

  // Click outside refs
  const viewsRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bulkSelectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (viewsRef.current && !viewsRef.current.contains(target)) {
        setIsViewsOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(target)) {
        setIsSortSubMenuOpen(false);
      }
      if (columnsRef.current && !columnsRef.current.contains(target)) {
        setIsColumnsOpen(false);
      }
      if (bulkSelectionRef.current && !bulkSelectionRef.current.contains(target)) {
        setIsBulkSelectionMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter Logic for Live Table
  const filteredCollections = collections.filter((c) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matches =
        c.title.toLowerCase().includes(q) ||
        c.conditions.toLowerCase().includes(q) ||
        c.products.toString().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  const handleBulkDelete = () => {
    setCollectionsList((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
    setDeleteConfirmOpen(false);
  };

  const renderSortIndicator = (colKey: string) => {
    if (sortColumn !== colKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    );
  };

  return (
    <div className="w-full relative pb-10 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-bold text-[#1a1a1a] flex items-center gap-2">
          <CollectionIcon className="w-5 h-5 fill-current text-[#1a1a1a]" />
          <span>Collections</span>
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/collections/new"
            className="px-3.5 py-1 text-[13px] font-semibold bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs inline-flex items-center justify-center cursor-pointer"
          >
            Add collection
          </Link>
        </div>
      </div>

      {/* Main Table Area Card Container with Rounded Top Corners */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs">
        {/* Table Toolbar Header Row */}
        <div className="p-2 border-b border-[#e1e3e5] bg-white flex items-center justify-between rounded-t-xl">
          {/* Unified Search and View Filter Bar */}
          <div className="relative flex-1 w-full flex items-center bg-white border border-[#c9cccf] rounded-lg px-2 py-1 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
            {/* Integrated View Selector Pill on Far Left (Matching Reference Images) */}
            <div ref={viewsRef} className="relative z-50 shrink-0 mr-2">
              <button
                type="button"
                onClick={() => setIsViewsOpen(!isViewsOpen)}
                className="bg-[#f1f2f4] hover:bg-[#e4e5e7] text-[#1a1a1a] text-[12px] font-semibold px-2 py-0.5 rounded flex items-center gap-1.5 border border-[#c9cccf] transition cursor-pointer"
              >
                <span>{selectedView}</span>
                <ChevronsUpDown className="w-3 h-3 text-[#616161]" />
              </button>

              {/* Floating Views Dropdown Menu */}
              {isViewsOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out">
                  {["All"].map((view) => {
                    const isSelected = selectedView === view;
                    return (
                      <div
                        key={view}
                        onClick={() => {
                          setSelectedView(view);
                          setIsViewsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition text-left cursor-pointer select-none",
                          isSelected
                            ? "bg-[#f1f2f4] text-[#1a1a1a] font-semibold"
                            : "text-[#303030] hover:bg-[#f6f6f7]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />
                          ) : (
                            <div className="w-3.5 h-3.5" />
                          )}
                          <span>{view}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] rounded transition"
                          title="More actions"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Text Search Input */}
            <div className="flex-1 flex items-center gap-1.5 min-w-0 py-0.5">
              {searchQuery === "" && (
                <Search className="w-3.5 h-3.5 text-[#616161] shrink-0 mr-1" />
              )}
              <input
                type="text"
                placeholder="Search and filter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[60px] text-[13px] bg-transparent outline-none text-[#1a1a1a]"
              />
            </div>

            {searchQuery.trim() !== "" && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-[#616161] hover:text-[#1a1a1a] shrink-0 ml-1 rounded-full hover:bg-[#f1f2f4] transition cursor-pointer"
                title="Clear search"
              >
                <XCircle className="w-4 h-4 text-[#8a8a8a] hover:text-[#1a1a1a]" />
              </button>
            )}
          </div>

          {/* Right Action Controls: Sort and Columns */}
          <div className="flex items-center gap-1.5 ml-2.5 shrink-0">
            {/* Sort Popover Button (Matching Image 1) */}
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSortSubMenuOpen(!isSortSubMenuOpen);
                  setIsColumnsOpen(false);
                }}
                className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-md border border-transparent transition flex items-center gap-1 cursor-pointer"
                title="Sort by"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>

              {/* Floating Sort Menu Popover */}
              {isSortSubMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-[220px] bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-0.5 text-[13px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out">
                  {[
                    { label: "Title", key: "title" },
                    { label: "Updated", key: "updated" },
                  ].map((col) => {
                    const isSelected = sortColumn === col.key;
                    return (
                      <button
                        key={col.key}
                        type="button"
                        onClick={() => {
                          handleSort(col.key);
                          setIsSortSubMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition select-none cursor-pointer",
                          isSelected ? "bg-[#f1f2f4] text-[#1a1a1a] font-semibold" : "text-[#303030] hover:bg-[#f6f6f7]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 flex items-center justify-center">
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                          </span>
                          <span>{col.label}</span>
                        </div>
                      </button>
                    );
                  })}

                  <hr className="my-1 border-[#e1e3e5]" />

                  <button
                    type="button"
                    onClick={() => {
                      if (sortDirection !== "asc") handleSort(sortColumn || "title");
                      setIsSortSubMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition select-none cursor-pointer",
                      sortDirection === "asc" ? "bg-[#f1f2f4] text-[#1a1a1a] font-semibold" : "text-[#303030] hover:bg-[#f6f6f7]"
                    )}
                  >
                    <span className="w-3.5 flex items-center justify-center">
                      {sortDirection === "asc" && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                    </span>
                    <span>Oldest first</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (sortDirection !== "desc") handleSort(sortColumn || "title");
                      setIsSortSubMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition select-none cursor-pointer",
                      sortDirection === "desc" ? "bg-[#f1f2f4] text-[#1a1a1a] font-semibold" : "text-[#303030] hover:bg-[#f6f6f7]"
                    )}
                  >
                    <span className="w-3.5 flex items-center justify-center">
                      {sortDirection === "desc" && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                    </span>
                    <span>Newest first</span>
                  </button>
                </div>
              )}
            </div>

            {/* Columns Customization Popover Button (Matching Image 0) */}
            <div ref={columnsRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsColumnsOpen(!isColumnsOpen);
                  setIsSortSubMenuOpen(false);
                }}
                className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-md border border-transparent transition flex items-center gap-1 cursor-pointer"
                title="Edit columns"
              >
                <Columns className="w-4 h-4" />
              </button>

              {/* Floating Columns Popover */}
              {isColumnsOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-[260px] bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-2.5 z-50 flex flex-col gap-1 text-[13px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out">
                  <div className="text-[12px] font-semibold text-[#616161] px-2 py-1">Columns</div>
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      onClick={() => toggleColumnVisibility(col.id)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#f6f6f7] transition cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2 text-[#303030]">
                        <GripVertical className="w-4 h-4 text-[#8a8a8a] cursor-grab" />
                        <span className="font-medium text-[#1a1a1a]">{col.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleColumnVisibility(col.id);
                        }}
                        className="text-[#616161] hover:text-[#1a1a1a] p-1 transition"
                      >
                        {col.visible ? (
                          <Eye className="w-4 h-4 text-[#1a1a1a]" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-[#8a8a8a]" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="polaris-table w-full">
            <colgroup>
              <col style={{ width: "36px" }} />
              <col />
              {isColVisible("products") && <col style={{ width: "160px" }} />}
            </colgroup>
            <thead>
              {selectedIds.size > 0 ? (
                /* Bulk Action Bar matching product page */
                <tr className="bg-[#f1f2f4] border-b border-[#e1e3e5] h-[48px] text-[13px] text-[#1a1a1a] font-medium">
                  <th className="pl-3 pr-1 align-middle text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded-[4px] border-[#c9cccf] cursor-pointer accent-[#1a1a1a] w-4 h-4"
                    />
                  </th>
                  <th colSpan={99} className="pl-1 pr-3 align-middle py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div ref={bulkSelectionRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsBulkSelectionMenuOpen(!isBulkSelectionMenuOpen)}
                          className="flex items-center gap-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                        >
                          <span>{selectedIds.size} selected</span>
                          <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
                        </button>

                        {isBulkSelectionMenuOpen && (
                          <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1 z-50 animate-in fade-in-0 zoom-in-95 duration-100 flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                toggleSelectAll();
                                setIsBulkSelectionMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium text-[13px]"
                            >
                              {isAllSelected ? "Unselect all" : "Select all"}
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmOpen(true)}
                        className="bg-white hover:bg-[#fff5f5] border border-[#c9cccf] text-red-600 px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                      >
                        Delete collections
                      </button>
                    </div>
                  </th>
                </tr>
              ) : (
                /* Regular Column Headers Row matching product page measurements */
                <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#f7f7f7] select-none h-[44px]">
                  <th className="pl-3 pr-1 py-1.5 w-9 align-middle text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                    />
                  </th>
                  <th
                    className="pl-1 pr-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left"
                    onClick={() => handleSort("title")}
                  >
                    Title {renderSortIndicator("title")}
                  </th>
                  {isColVisible("products") && (
                    <th
                      className="px-4 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-right"
                      onClick={() => handleSort("products")}
                    >
                      Products {renderSortIndicator("products")}
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {filteredCollections.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan={100} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
                      <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-[#616161] stroke-[1.25]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">
                        No collections found
                      </h3>
                      <p className="text-[13px] text-[#616161] mb-5">
                        Try changing the search terms
                      </p>
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="bg-[#1a1a1a] hover:bg-[#303030] text-white text-[13px] font-semibold px-4 py-2 rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        Clear search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCollections.map((c, idx) => {
                  const selected = isRowSelected(c.id);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/admin/products/collections/${c.id}`)}
                      className={`border-b border-[#f1f1f1] h-[38px] transition cursor-pointer ${
                        selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <td className="pl-3 pr-1 py-1 align-middle text-left" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}}
                          onClick={(e) => handleRowCheckboxClick(e, idx, c.id)}
                          className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                        />
                      </td>
                      <td className="pl-1 pr-3 py-1 align-middle font-semibold text-[#1a1a1a]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded border border-[#e1e3e5] bg-gray-50 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                          </div>
                          <span className="truncate text-[#1a1a1a] no-underline" title={c.title}>
                            {c.title}
                          </span>
                        </div>
                      </td>
                      {isColVisible("products") && (
                        <td className="px-4 py-1.5 text-[#1a1a1a] font-medium align-middle text-right">
                          {c.products}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200 select-none">
          <div className="relative w-full max-w-[480px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
              <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
                Delete {selectedIds.size} {selectedIds.size === 1 ? "collection" : "collections"}?
              </h2>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[13.5px] text-[#303030] leading-normal">
              This action cannot be undone. This will permanently delete the selected collections.
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e1e3e5] bg-white">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-lg shadow-2xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-3.5 py-1.5 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition cursor-pointer"
              >
                Delete collections
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

