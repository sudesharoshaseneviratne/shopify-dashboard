"use client";

import { useState, useEffect, useRef } from "react";
import { InventoryIcon } from "@shopify/polaris-icons";
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
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTableLogic } from "@/hooks/admin/useTableLogic";

const baseTitles = [
  "Abacus Year 1 Workbook 1",
  "Abacus Year 1 Workbook 2",
  "Abacus Year 1 Workbook 3",
  "Abacus Year 2 Textbook",
  "Abacus Year 2 Workbook 1",
  "Abacus Year 2 Workbook 2",
  "Abacus Year 2 Workbook 3",
  "Abacus Year 3 Textbook 1",
  "Abacus Year 3 Textbook 2",
  "Abacus Year 3 Textbook 3",
  "ACCOUNTING FOR CAMBRIDGE INTL AS & AL",
  "BIOLOGY FOR CAMBRIDGE IGCSE REVISION GUIDE - 3 ED",
  "BUILDING BLOCKS YEAR 1 SPELLING GRAMMAR",
  "Sinhala Wada Potha 3",
  "Sinhala Wada Potha 2",
  "Sinhala Kiyaveem Potha 5",
  "Sinhala Kiyaveem Potha 4",
  "RADIANT WAY THIRD STEP",
  "OXFORD STUDENT LEARNERS DICTIONARY",
  "Oxford Reading Circle Primer revised edition",
  "Grade 6 Mathematics Pupil Book",
  "Grade 7 English Literature Companion",
  "Grade 8 Science & Technology Guide",
  "GCE O/L Mathematics Past Papers & Answers",
  "GCE A/L Physics Theory & Revision Manual",
  "Harry Potter and the Philosopher's Stone",
  "Famous Five - Five On A Treasure Island",
  "Malalasekera English-Sinhala Dictionary",
  "Targeting Mathematics Primary Year 1",
  "Cambridge Primary English Learner's Book 3",
];

const availableCounts = [3, 3, 3, -1, 14, 14, 2, 3, 3, 5, 0, 8, 12, 1, 6];

const initialInventory = Array.from({ length: 120 }, (_, i) => {
  const baseTitle = baseTitles[i % baseTitles.length];
  const copyNum = Math.floor(i / baseTitles.length);
  const title = copyNum > 0 ? `${baseTitle} (Edition ${copyNum + 1})` : baseTitle;
  const sku = i % 4 === 0 ? `9781408278${475 + i}` : "No SKU";
  const barcode = i % 3 === 0 ? `978955650${1000 + i}` : "No Barcode";
  const avail = availableCounts[i % availableCounts.length];

  return {
    id: i + 1,
    title,
    sku,
    barcode,
    avail,
  };
});

export default function InventoryPage() {
  const router = useRouter();
  const [inventoryList, setInventoryList] = useState(initialInventory);

  const {
    sortedData: inventory,
    selectedIds,
    setSelectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(inventoryList, "id");

  // State Declarations for Toolbar & Popovers
  const [isViewsOpen, setIsViewsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isSortSubMenuOpen, setIsSortSubMenuOpen] = useState(false);
  const [isBulkSelectionMenuOpen, setIsBulkSelectionMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Pagination state
  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Column Visibility state (SKU, Barcode, Available)
  const [columns, setColumns] = useState([
    { id: "sku", label: "SKU", visible: true },
    { id: "barcode", label: "Barcode", visible: true },
    { id: "avail", label: "Available", visible: true },
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
  const filteredInventory = inventory.filter((item) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.barcode.toLowerCase().includes(q) ||
        item.avail.toString().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / ITEMS_PER_PAGE));
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const startItem = filteredInventory.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredInventory.length);

  // Selection Helper Calculations for Page-by-Page Selection
  const currentPageIds = paginatedInventory.map((item) => item.id);

  const isPageAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.has(id));

  const isPageSomeSelected =
    currentPageIds.some((id) => selectedIds.has(id)) && !isPageAllSelected;

  const masterCheckboxRef1 = useRef<HTMLInputElement>(null);
  const masterCheckboxRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (masterCheckboxRef1.current) {
      masterCheckboxRef1.current.indeterminate = isPageSomeSelected;
    }
    if (masterCheckboxRef2.current) {
      masterCheckboxRef2.current.indeterminate = isPageSomeSelected;
    }
  }, [isPageSomeSelected, selectedIds]);

  const handleMasterCheckboxToggle = () => {
    if (isPageAllSelected || isPageSomeSelected) {
      const next = new Set(selectedIds);
      currentPageIds.forEach((id) => next.delete(id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      currentPageIds.forEach((id) => next.add(id));
      setSelectedIds(next);
    }
  };

  const selectAllOnCurrentPage = () => {
    const next = new Set(selectedIds);
    currentPageIds.forEach((id) => next.add(id));
    setSelectedIds(next);
  };

  const selectAllInStore = () => {
    const next = new Set(inventory.map((item) => item.id));
    setSelectedIds(next);
  };

  const unselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    setInventoryList((prev) => prev.filter((item) => !selectedIds.has(item.id)));
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
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-bold text-[#1a1a1a] flex items-center gap-2">
          <InventoryIcon className="w-5 h-5 fill-current text-[#1a1a1a]" />
          <span>Inventory</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 text-[13px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition shadow-2xs cursor-pointer"
          >
            Export
          </button>
          <button
            type="button"
            className="px-3 py-1 text-[13px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition shadow-2xs cursor-pointer"
          >
            Import
          </button>
        </div>
      </div>

      {/* Main Table Area Card Container with Rounded Top Corners */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs">
        {/* Table Toolbar Header Row */}
        <div className="p-2 border-b border-[#e1e3e5] bg-white flex items-center justify-between rounded-t-xl">
          {/* Unified Search and View Filter Bar */}
          <div className="relative flex-1 w-full flex items-center bg-white border border-[#c9cccf] rounded-lg px-2 py-1 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
            {/* Integrated View Selector Pill on Far Left (Matching Reference Image 0) */}
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

          {/* Right Action Controls: Sort, Columns, Save */}
          <div className="flex items-center gap-1.5 ml-2.5 shrink-0">
            {/* Sort Popover Button (Matching Image 2) */}
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

              {/* Floating Sort Menu Popover (Matching Image 2) */}
              {isSortSubMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-[220px] bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-0.5 text-[13px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out max-h-[380px] overflow-y-auto">
                  {[
                    { label: "Product", key: "title" },
                    { label: "SKU", key: "sku" },
                    { label: "Barcode", key: "barcode" },
                    { label: "Available", key: "avail" },
                  ].map((col) => {
                    const isSelected = (sortColumn || "title") === col.key;
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
                    <span>Ascending</span>
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
                    <span>Descending</span>
                  </button>
                </div>
              )}
            </div>

            {/* Columns Customization Popover Button (Matching Image 1) */}
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

              {/* Floating Columns Popover (Matching Image 1) */}
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
              <col style={{ width: "240px" }} />
              {isColVisible("sku") && <col style={{ width: "35%" }} />}
              {isColVisible("barcode") && <col />}
              {isColVisible("avail") && <col style={{ width: "160px" }} />}
            </colgroup>
            <thead>
              {selectedIds.size > 0 ? (
                /* Bulk Action Bar matching product & collection pages */
                <tr className="bg-[#f1f2f4] border-b border-[#e1e3e5] h-[48px] text-[13px] text-[#1a1a1a] font-medium">
                  <th className="pl-3 pr-1 align-middle text-left">
                    <input
                      ref={masterCheckboxRef1}
                      type="checkbox"
                      checked={isPageAllSelected}
                      onChange={handleMasterCheckboxToggle}
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
                            {!isPageAllSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  selectAllOnCurrentPage();
                                  setIsBulkSelectionMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium text-[13px]"
                              >
                                Select all {paginatedInventory.length} on page
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                selectAllInStore();
                                setIsBulkSelectionMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium text-[13px]"
                            >
                              Select all in this store
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                unselectAll();
                                setIsBulkSelectionMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium text-[13px]"
                            >
                              Unselect all
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Bulk Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const ids = Array.from(selectedIds).join(",");
                          router.push(`/admin/products/bulk-editor?ids=${encodeURIComponent(ids)}&mode=inventory`);
                        }}
                        className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                      >
                        Bulk edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmOpen(true)}
                        className="bg-white hover:bg-[#fff5f5] border border-[#c9cccf] text-red-600 px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                      >
                        Delete inventory items
                      </button>
                    </div>
                  </th>
                </tr>
              ) : (
                /* Regular Column Headers Row matching product & collection page measurements */
                <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#f7f7f7] select-none h-[44px]">
                  <th className="pl-3 pr-1 py-1.5 w-9 align-middle text-left">
                    <input
                      ref={masterCheckboxRef2}
                      type="checkbox"
                      checked={isPageAllSelected}
                      onChange={handleMasterCheckboxToggle}
                      className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                    />
                  </th>
                  <th
                    className="pl-1 pr-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left"
                    onClick={() => handleSort("title")}
                  >
                    Product {renderSortIndicator("title")}
                  </th>
                  {isColVisible("sku") && (
                    <th
                      className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left"
                      onClick={() => handleSort("sku")}
                    >
                      SKU {renderSortIndicator("sku")}
                    </th>
                  )}
                  {isColVisible("barcode") && (
                    <th
                      className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left"
                      onClick={() => handleSort("barcode")}
                    >
                      Barcode {renderSortIndicator("barcode")}
                    </th>
                  )}
                  {isColVisible("avail") && (
                    <th
                      className="px-4 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-right"
                      onClick={() => handleSort("avail")}
                    >
                      Available {renderSortIndicator("avail")}
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {paginatedInventory.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan={100} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
                      <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-[#616161] stroke-[1.25]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">
                        No inventory items found
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
                paginatedInventory.map((item, idx) => {
                  const selected = isRowSelected(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-[#f1f1f1] h-[38px] transition cursor-pointer ${
                        selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <td className="pl-3 pr-1 py-1 align-middle text-left">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}}
                          onClick={(e) => handleRowCheckboxClick(e, idx, item.id)}
                          className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                        />
                      </td>
                      <td className="pl-1 pr-3 py-1 align-middle font-semibold text-[#1a1a1a]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded border border-[#e1e3e5] bg-gray-50 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                          </div>
                          <span className="truncate text-[#1a1a1a] no-underline" title={item.title}>
                            {item.title}
                          </span>
                        </div>
                      </td>
                      {isColVisible("sku") && (
                        <td className="px-3 py-1.5 text-[#616161] align-middle text-left">
                          {item.sku}
                        </td>
                      )}
                      {isColVisible("barcode") && (
                        <td className="px-3 py-1.5 text-[#616161] align-middle text-left">
                          {item.barcode}
                        </td>
                      )}
                      {isColVisible("avail") && (
                        <td
                          className={cn(
                            "px-4 py-1.5 font-medium align-middle text-right",
                            item.avail < 0 ? "text-red-600" : "text-[#1a1a1a]"
                          )}
                        >
                          {item.avail}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer matching Screenshot 0 */}
        <div className="px-4 py-3 flex items-center justify-center gap-4 border-t border-[#e1e3e5] text-sm text-[#1a1a1a] select-none">
          <div className="flex gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={cn(
                "p-1 border border-[#c9cccf] rounded transition",
                currentPage <= 1
                  ? "text-[#8a8a8a] bg-[#f6f6f7] cursor-not-allowed"
                  : "text-[#1a1a1a] bg-white hover:bg-[#f1f2f4] cursor-pointer"
              )}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className={cn(
                "p-1 border border-[#c9cccf] rounded transition",
                currentPage >= totalPages
                  ? "text-[#8a8a8a] bg-[#f6f6f7] cursor-not-allowed"
                  : "text-[#1a1a1a] bg-white hover:bg-[#f1f2f4] cursor-pointer"
              )}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[13px] text-[#616161] font-medium">
            {startItem}-{endItem}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200 select-none">
          <div className="relative w-full max-w-[480px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
              <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
                Delete {selectedIds.size} {selectedIds.size === 1 ? "item" : "items"}?
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
              This action cannot be undone. This will permanently delete the selected inventory items.
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
                Delete items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

