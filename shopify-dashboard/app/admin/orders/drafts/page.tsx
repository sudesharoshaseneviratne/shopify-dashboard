"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/admin/Badge";
import { ExportOrdersModal } from "@/components/admin/ExportOrdersModal";
import { 
  ArrowDownUp, 
  Search, 
  Columns, 
  ArrowUp, 
  ArrowDown, 
  FileText,
  Check,
  ChevronDown,
  ChevronsUpDown,
  X,
  XCircle,
  GripVertical,
  Eye,
  EyeOff,
  CornerDownLeft,
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableLogic } from "@/hooks/admin/useTableLogic";

const initialDrafts = [
  { id: "#D3", date: "Wednesday at 1:46 pm", customer: "K.D.J Tharini Kumaragama", status: "Completed", statusType: "neutral", total: "Rs 47,000.00 LKR" },
  { id: "#D2", date: "Jul 27 at 7:54 pm", customer: "E. P. H. De Silva", status: "Completed", statusType: "neutral", total: "Rs 2,436.00 LKR" },
  { id: "#D1", date: "Jul 15 at 8:07 pm", customer: "No customer", status: "Open", statusType: "amber", total: "Rs 18,400.00 LKR" },
];

const categoryOptionsMap: Record<string, string[]> = {
  "Status": ["Open", "Completed", "Invoice sent", "Submitted for review"],
  "Updated at": ["Today", "Last 7 days", "Last 30 days", "Custom date"],
  "Created at": ["Today", "Last 7 days", "Last 30 days", "Custom date"],
  "Source": ["Shopify Admin", "Custom App", "Draft Orders"],
};

const filterCategories = [
  "Status",
  "Updated at",
  "Created at",
  "Customer",
  "Source",
  "Tagged with",
];

export default function Drafts() {
  const router = useRouter();
  const [draftsList, setDraftsList] = useState(initialDrafts);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    sortedData: drafts,
    selectedIds,
    setSelectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(draftsList, "id");

  // State Declarations for Popovers & Filters (Matching Orders Section Design)
  const [isViewsOpen, setIsViewsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredFilterIndex, setHoveredFilterIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubOptions, setSelectedSubOptions] = useState<string[]>([]);
  const [operatorMode, setOperatorMode] = useState<"is" | "is_not">("is");
  const [hoveredSubOptionIndex, setHoveredSubOptionIndex] = useState<number>(0);
  const [activeFilters, setActiveFilters] = useState<{ category: string; value: string }[]>([]);

  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isSortSubMenuOpen, setIsSortSubMenuOpen] = useState(false);
  const [isBulkSelectionMenuOpen, setIsBulkSelectionMenuOpen] = useState(false);

  // Column Visibility state matching Screenshot 3
  const [columns, setColumns] = useState([
    { id: "id", label: "Draft order", visible: true },
    { id: "date", label: "Date", visible: true },
    { id: "customer", label: "Customer", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "total", label: "Total", visible: true },
  ]);

  const toggleColumnVisibility = (colId: string) => {
    setColumns(prev =>
      prev.map(col => (col.id === colId ? { ...col, visible: !col.visible } : col))
    );
  };

  const isColVisible = (colId: string) => {
    const col = columns.find(c => c.id === colId);
    return col ? col.visible : true;
  };

  // Click outside ref declarations
  const viewsRef = useRef<HTMLDivElement>(null);
  const searchFilterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bulkSelectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (viewsRef.current && !viewsRef.current.contains(target)) {
        setIsViewsOpen(false);
      }
      if (searchFilterRef.current && !searchFilterRef.current.contains(target)) {
        setIsFilterOpen(false);
        setSelectedCategory(null);
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

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubOptions([]);
    setOperatorMode("is");
    setHoveredSubOptionIndex(0);
    setIsFilterOpen(false);
  };

  const commitCategoryFilter = () => {
    if (selectedCategory && selectedSubOptions.length > 0) {
      const opText = operatorMode === "is_not" ? "is not" : "is";
      const catLabel = `${selectedCategory} ${opText}`;
      const valStr = selectedSubOptions.join(", ");

      setActiveFilters(prev => [
        ...prev.filter(f => !f.category.startsWith(selectedCategory)),
        { category: catLabel, value: valStr }
      ]);
    }
    setSelectedCategory(null);
    setSelectedSubOptions([]);
  };

  // Dynamic filter logic for live UI table
  const filteredDrafts = drafts.filter((d) => {
    // View Tab Filter
    if (selectedView === "Open" && d.status !== "Open") return false;
    if (selectedView === "Completed" && d.status !== "Completed") return false;
    if (selectedView === "Invoice sent" && d.status !== "Invoice sent") return false;
    if (selectedView === "Submitted for review" && d.status !== "Submitted for review") return false;
    if (selectedView === "Open and invoice sent" && !["Open", "Invoice sent"].includes(d.status)) return false;

    // Text Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matches = 
        d.id.toLowerCase().includes(q) ||
        d.customer.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q) ||
        d.total.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Active Category Filters
    for (const filter of activeFilters) {
      const cat = filter.category.toLowerCase();
      const vals = filter.value.toLowerCase().split(",").map(v => v.trim());
      const isNot = cat.includes("is not");

      let matches = false;
      if (cat.includes("status")) {
        matches = vals.some(v => d.status.toLowerCase().includes(v));
      } else if (cat.includes("customer")) {
        matches = vals.some(v => d.customer.toLowerCase().includes(v));
      } else {
        matches = true;
      }

      if (isNot ? matches : !matches) return false;
    }

    return true;
  });

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
        <h1 className="text-[18px] font-semibold text-[#1a1a1a] flex items-center gap-2">
          <div className="bg-white p-1 rounded-md border border-[#e1e3e5] shadow-xs">
            <FileText className="w-4 h-4 text-[#303030]" />
          </div> 
          Drafts
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition"
          >
            Export
          </button>
          <Link
            href="/admin/orders/create"
            className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition inline-flex items-center justify-center"
          >
            Create order
          </Link>
        </div>
      </div>

      {/* Main Table Card (Rounded Top Corners matching Orders) */}
      <div className="polaris-card relative overflow-visible rounded-xl border border-[#e1e3e5] bg-white shadow-2xs">
        {/* Table Toolbar Controls (Exact layout matching Orders) */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white relative z-20 rounded-t-xl">
          <div className="flex items-center gap-2 flex-1 relative min-w-0">
            {/* Unified Search and Filter Bar (Matching Orders Page Design) */}
            <div ref={searchFilterRef} className="relative flex-1 w-full flex items-center bg-white border border-[#c9cccf] rounded-lg px-2 py-1 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
              
              {/* 1. Integrated View Selector Pill on Far Left (Matching Reference Screenshot 1) */}
              <div ref={viewsRef} className="relative z-50 shrink-0 mr-2">
                <button
                  type="button"
                  onClick={() => setIsViewsOpen(!isViewsOpen)}
                  className="bg-[#f1f2f4] hover:bg-[#e4e5e7] text-[#1a1a1a] text-[12px] font-semibold px-2 py-0.5 rounded flex items-center gap-1.5 border border-[#c9cccf] transition"
                >
                  <span>{selectedView}</span>
                  <ChevronsUpDown className="w-3 h-3 text-[#616161]" />
                </button>

                {/* Floating Views Dropdown Menu (Reference Screenshot 1) */}
                {isViewsOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out">
                    {[
                      "All", 
                      "Open and invoice sent", 
                      "Open", 
                      "Invoice sent", 
                      "Completed", 
                      "Submitted for review"
                    ].map((view) => {
                      const isSelected = selectedView === view;
                      return (
                        <button
                          key={view}
                          type="button"
                          onClick={() => {
                            setSelectedView(view);
                            setIsViewsOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition text-left",
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
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Text Search Input */}
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

              {/* 3. Clear Button (X) on Far Right when search query is typed */}
              {searchQuery.trim() !== "" && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-[#616161] hover:text-[#1a1a1a] shrink-0 ml-1 rounded-full hover:bg-[#f1f2f4] transition"
                  title="Clear search"
                >
                  <XCircle className="w-4 h-4 text-[#8a8a8a] hover:text-[#1a1a1a]" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls: Sort and Columns */}
          <div className="flex items-center gap-1.5 ml-2.5 shrink-0">
            {/* Separate Sort Popover Button (Reference Screenshot 4) */}
            <div ref={sortRef} className="relative">
              <button 
                onClick={() => {
                  setIsSortSubMenuOpen(!isSortSubMenuOpen);
                  setIsColumnsOpen(false);
                }}
                className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-md border border-transparent transition flex items-center gap-1"
                title="Sort by"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>

              {/* Floating Sort Menu Popover (Reference Screenshot 4) */}
              {isSortSubMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-[220px] bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-0.5 text-[13px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out max-h-[360px] overflow-y-auto">
                  <div className="text-[12px] font-semibold text-[#616161] px-2 py-1">Sort by</div>
                  {[
                    { label: "Draft order number", key: "id" },
                    { label: "Date", key: "date" },
                    { label: "Customer name", key: "customer" },
                    { label: "Status", key: "status" },
                    { label: "Total price", key: "total" },
                  ].map((col) => {
                    const isSelected = sortColumn === col.key;
                    return (
                      <button
                        key={col.key}
                        onClick={() => {
                          handleSort(col.key);
                          setIsSortSubMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition select-none",
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
                    onClick={() => {
                      if (sortDirection !== "asc") handleSort(sortColumn || "id");
                      setIsSortSubMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition select-none",
                      sortDirection === "asc" ? "bg-[#f1f2f4] text-[#1a1a1a] font-semibold" : "text-[#303030] hover:bg-[#f6f6f7]"
                    )}
                  >
                    <span className="w-3.5 flex items-center justify-center">
                      {sortDirection === "asc" && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                    </span>
                    <span>Oldest first</span>
                  </button>
                  <button
                    onClick={() => {
                      if (sortDirection !== "desc") handleSort(sortColumn || "id");
                      setIsSortSubMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition select-none",
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

            {/* Columns Customization Popover Button (Reference Screenshot 3) */}
            <div ref={columnsRef} className="relative">
              <button 
                onClick={() => {
                  setIsColumnsOpen(!isColumnsOpen);
                  setIsSortSubMenuOpen(false);
                }}
                className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-md border border-transparent transition"
                title="Edit columns"
              >
                <Columns className="w-4 h-4" />
              </button>

              {/* Columns Customization Popover */}
              {isColumnsOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-[300px] max-h-[460px] overflow-y-auto bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-3 z-40 flex flex-col gap-2 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out">
                  <div className="text-[12px] font-semibold text-[#616161]">Columns</div>
                  <div className="flex flex-col gap-0.5">
                    {columns.map((col) => (
                      <div
                        key={col.id}
                        className="flex items-center justify-between px-1.5 py-1.5 rounded-md hover:bg-[#f1f2f4] transition text-[13px]"
                      >
                        <div className="flex items-center gap-2 text-[#303030]">
                          <GripVertical className="w-3.5 h-3.5 text-[#a6a6a6] cursor-grab" />
                          <span>{col.label}</span>
                        </div>
                        <button
                          onClick={() => toggleColumnVisibility(col.id)}
                          className="text-[#616161] hover:text-[#1a1a1a]"
                        >
                          {col.visible ? (
                            <Eye className="w-4 h-4 text-[#303030]" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-[#a6a6a6]" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="polaris-table w-full">
            <thead>
              {selectedIds.size > 0 ? (
                /* Bulk Action Header Row */
                <tr className="border-b border-[#e1e3e5] bg-white select-none h-[44px]">
                  <th colSpan={100} className="px-3 py-1 font-normal text-left h-[44px] align-middle">
                    <div className="flex items-center justify-between w-full relative z-30">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div ref={bulkSelectionRef} className="relative">
                          <button
                            onClick={() => setIsBulkSelectionMenuOpen(!isBulkSelectionMenuOpen)}
                            className="bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-[13px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs transition"
                          >
                            <span className="w-3.5 h-3.5 rounded bg-[#1a1a1a] flex items-center justify-center text-white shrink-0">
                              <span className="w-2 h-0.5 bg-white rounded-full" />
                            </span>
                            <span>{selectedIds.size} selected</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
                          </button>

                          {isBulkSelectionMenuOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out text-[13px] font-normal">
                              <button
                                onClick={() => {
                                  setSelectedIds(new Set(filteredDrafts.map((d) => d.id)));
                                  setIsBulkSelectionMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                              >
                                Select all {filteredDrafts.length} on page
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedIds(new Set());
                                  setIsBulkSelectionMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                              >
                                Unselect all
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              ) : (
                /* Regular Column Headers Row */
                <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#f7f7f7] select-none h-[44px]">
                  <th className="px-3 py-1.5 w-10 h-[44px] align-middle">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                    />
                  </th>
                  {isColVisible("id") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("id")}>
                      Draft order {renderSortIndicator("id")}
                    </th>
                  )}
                  {isColVisible("date") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("date")}>
                      Date {renderSortIndicator("date")}
                    </th>
                  )}
                  {isColVisible("customer") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("customer")}>
                      Customer {renderSortIndicator("customer")}
                    </th>
                  )}
                  {isColVisible("status") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("status")}>
                      Status {renderSortIndicator("status")}
                    </th>
                  )}
                  {isColVisible("total") && (
                    <th className="px-3 py-1.5 !text-right cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("total")}>
                      Total {renderSortIndicator("total")}
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {filteredDrafts.length === 0 ? (
                /* Empty state matching Shopify design */
                <tr className="bg-white">
                  <td colSpan={100} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
                      <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-[#616161] stroke-[1.25]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">No drafts found</h3>
                      <p className="text-[13px] text-[#616161] mb-5">
                        Try changing the filters or search terms for this view
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveFilters([]);
                          setSelectedCategory(null);
                          setSelectedSubOptions([]);
                          setSelectedView("All");
                        }}
                        className="bg-[#1a1a1a] hover:bg-[#303030] text-white text-[13px] font-semibold px-4 py-2 rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        Clear search and filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrafts.map((d, idx) => {
                  const selected = isRowSelected(d.id);
                  return (
                    <tr
                      key={d.id}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest("input, button, a, label")) return;
                        router.push(`/admin/orders/drafts/${d.id.replace('#', '')}`);
                      }}
                      className={`border-b border-[#f1f1f1] h-[34px] transition cursor-pointer ${
                        selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <td className="px-3 py-1">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}}
                          onClick={(e) => handleRowCheckboxClick(e, idx, d.id)}
                          className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                        />
                      </td>
                      {isColVisible("id") && (
                        <td className="px-3 py-1 font-medium text-[#1a1a1a]">
                          <Link
                            href={`/admin/orders/drafts/${d.id.replace('#', '')}`}
                            className="hover:underline font-semibold text-[#1a1a1a]"
                          >
                            {d.id}
                          </Link>
                        </td>
                      )}
                      {isColVisible("date") && <td className="px-3 py-1 text-[#616161]">{d.date}</td>}
                      {isColVisible("customer") && <td className="px-3 py-1 text-[#1a1a1a] hover:underline cursor-pointer">{d.customer}</td>}
                      {isColVisible("status") && (
                        <td className="px-3 py-1">
                          <Badge
                            variant={d.status === "Open" ? "amber" : "neutral"}
                            icon={d.status === "Open" ? "ring" : "square"}
                          >
                            {d.status}
                          </Badge>
                        </td>
                      )}
                      {isColVisible("total") && <td className="px-3 py-1 text-[#1a1a1a] font-medium !text-right">{d.total}</td>}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Confirmation Modal */}
      <ExportOrdersModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        orders={drafts}
        filteredOrders={filteredDrafts}
        selectedIds={selectedIds}
        hasSearchOrFilter={searchQuery.trim() !== "" || activeFilters.length > 0}
        title="Export drafts"
        itemLabel="drafts"
      />
    </div>
  );
}
