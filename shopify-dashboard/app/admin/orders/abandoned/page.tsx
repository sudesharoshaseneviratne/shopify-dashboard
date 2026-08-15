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
  ShoppingCart, 
  ArrowUp, 
  ArrowDown,
  Check,
  ChevronDown,
  ChevronsUpDown,
  X,
  XCircle,
  GripVertical,
  Eye,
  EyeOff,
  CornerDownLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableLogic } from "@/hooks/admin/useTableLogic";

const initialCheckouts = [
  { id: "#39106630222066", date: "Yesterday at 7:52 pm", customer: "Manoji Karunaratne", status: "Not recovered", statusType: "warning", total: "Rs 3,424.00" },
  { id: "#39007857574130", date: "Jul 24 at 10:29 pm", customer: "Alex Johnson", status: "Not recovered", statusType: "warning", total: "Rs 8,400.00" },
  { id: "#38797012074738", date: "Jul 3 at 4:48 pm", customer: "Victoria Bloom", status: "Not recovered", statusType: "warning", total: "Rs 3,400.00" },
  { id: "#38709651886914", date: "Jun 22 at 7:53 pm", customer: "Ethan Williams", status: "Not recovered", statusType: "warning", total: "Rs 300.00" },
  { id: "#38558530975474", date: "May 25 at 6:55 pm", customer: "learnix.lk@ilovemyemail.net", status: "Not recovered", statusType: "warning", total: "Rs 4,580.00" },
];

const categoryOptionsMap: Record<string, string[]> = {
  "Status": ["Email sent", "Email not sent"],
  "Recovery status": ["Recovered", "Not recovered"],
  "Checkout rule status": ["Active", "Inactive"],
};

const filterCategories = [
  "Status",
  "Recovery status",
  "Checkout rule status",
];

export default function AbandonedCheckouts() {
  const router = useRouter();
  const [checkoutsList, setCheckoutsList] = useState(initialCheckouts);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    sortedData: checkouts,
    selectedIds,
    setSelectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(checkoutsList, "id");

  // State Declarations for Popovers & Filters
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

  // Column Visibility state matching Screenshot 2
  const [columns, setColumns] = useState([
    { id: "id", label: "Checkout", visible: true },
    { id: "date", label: "Created", visible: true },
    { id: "customer", label: "Customer name", visible: true },
    { id: "status", label: "Recovery status", visible: true },
    { id: "total", label: "Total price", visible: true },
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
  const filteredCheckouts = checkouts.filter((c) => {
    // Text Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matches = 
        c.id.toLowerCase().includes(q) ||
        c.customer.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.total.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Active Category Filters
    for (const filter of activeFilters) {
      const cat = filter.category.toLowerCase();
      const vals = filter.value.toLowerCase().split(",").map(v => v.trim());
      const isNot = cat.includes("is not");

      let matches = false;
      if (cat.includes("recovery status") || cat.includes("status")) {
        matches = vals.some(v => c.status.toLowerCase().includes(v));
      } else if (cat.includes("customer")) {
        matches = vals.some(v => c.customer.toLowerCase().includes(v));
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
            <ShoppingCart className="w-4 h-4 text-[#303030]" />
          </div> 
          Abandoned checkouts
        </h1>
        <div className="flex items-center gap-2">
          {/* Export Button matching Orders & Drafts (Black Pill Style) */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition inline-flex items-center justify-center"
          >
            Export
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="polaris-card relative overflow-visible rounded-xl border border-[#e1e3e5] bg-white shadow-2xs">
        {/* Table Toolbar Controls (Exact layout matching Orders & Drafts) */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white relative z-20 rounded-t-xl">
          <div className="flex items-center gap-2 flex-1 relative min-w-0">
            {/* Unified Search and Filter Bar */}
            <div ref={searchFilterRef} className="relative flex-1 w-full flex items-center bg-white border border-[#c9cccf] rounded-lg px-2 py-1 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
              
              {/* 1. Integrated View Selector Pill on Far Left */}
              <div ref={viewsRef} className="relative z-50 shrink-0 mr-2">
                <button
                  type="button"
                  onClick={() => setIsViewsOpen(!isViewsOpen)}
                  className="bg-[#f1f2f4] hover:bg-[#e4e5e7] text-[#1a1a1a] text-[12px] font-semibold px-2 py-0.5 rounded flex items-center gap-1.5 border border-[#c9cccf] transition"
                >
                  <span>{selectedView}</span>
                  <ChevronsUpDown className="w-3 h-3 text-[#616161]" />
                </button>

                {/* Floating Views Dropdown Menu */}
                {isViewsOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out">
                    {["All"].map((view) => {
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
            {/* Separate Sort Popover Button (Matching Screenshot 3) */}
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

              {/* Floating Sort Menu Popover (Matching Screenshot 3) */}
              {isSortSubMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-[220px] bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-0.5 text-[13px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out max-h-[360px] overflow-y-auto">
                  <div className="text-[12px] font-semibold text-[#616161] px-2 py-1">Sort by</div>
                  {[
                    { label: "Checkout", key: "id" },
                    { label: "Created", key: "date" },
                    { label: "Customer name", key: "customer" },
                    { label: "Recovery status", key: "status" },
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

            {/* Columns Customization Popover Button (Matching Screenshot 2) */}
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
            <colgroup>
              <col style={{ width: "36px" }} />
              <col style={{ width: "140px" }} />
              {isColVisible("date") && <col style={{ width: "25%" }} />}
              {isColVisible("customer") && <col style={{ width: "30%" }} />}
              {isColVisible("status") && <col style={{ width: "25%" }} />}
              {isColVisible("total") && <col style={{ width: "20%" }} />}
            </colgroup>
            <thead>
              {selectedIds.size > 0 ? (
                /* Bulk Action Header Row matching Products Page */
                <tr className="bg-[#f1f2f4] border-b border-[#e1e3e5] h-[48px] text-[13px] text-[#1a1a1a] font-medium select-none">
                  <th className="pl-3 pr-1 align-middle text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded-[4px] border-[#c9cccf] cursor-pointer accent-[#1a1a1a] w-4 h-4"
                    />
                  </th>
                  <th colSpan={99} className="pl-1 pr-3 align-middle py-1.5">
                    <div className="flex items-center justify-between w-full relative z-30">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Selection count dropdown button */}
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
                            <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out text-[13px] font-normal">
                              <button
                                onClick={() => {
                                  setSelectedIds(new Set(filteredCheckouts.map((c) => c.id)));
                                  setIsBulkSelectionMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                              >
                                Select all {filteredCheckouts.length} on page
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
                  <th className="pl-3 pr-1 py-1.5 w-9 align-middle text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                    />
                  </th>
                  {isColVisible("id") && (
                    <th className="pl-1 pr-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left" onClick={() => handleSort("id")}>
                      Checkout {renderSortIndicator("id")}
                    </th>
                  )}
                  {isColVisible("date") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("date")}>
                      Created {renderSortIndicator("date")}
                    </th>
                  )}
                  {isColVisible("customer") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("customer")}>
                      Customer name {renderSortIndicator("customer")}
                    </th>
                  )}
                  {isColVisible("status") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("status")}>
                      Recovery status {renderSortIndicator("status")}
                    </th>
                  )}
                  {isColVisible("total") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left" onClick={() => handleSort("total")}>
                      Total price {renderSortIndicator("total")}
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {filteredCheckouts.length === 0 ? (
                /* Empty state matching Shopify design */
                <tr className="bg-white">
                  <td colSpan={100} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
                      <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-[#616161] stroke-[1.25]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">No abandoned checkouts found</h3>
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
                filteredCheckouts.map((c, idx) => {
                  const selected = isRowSelected(c.id);
                  return (
                    <tr
                      key={c.id}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest("input, button, a, label")) return;
                        router.push(`/admin/orders/abandoned/${c.id.replace('#', '')}`);
                      }}
                      className={`border-b border-[#f1f1f1] h-[34px] transition cursor-pointer ${
                        selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <td className="pl-3 pr-1 py-1 align-middle text-left">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}}
                          onClick={(e) => handleRowCheckboxClick(e, idx, c.id)}
                          className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                        />
                      </td>
                      {isColVisible("id") && (
                        <td className="pl-1 pr-3 py-1 font-medium text-[#1a1a1a]">
                          <Link
                            href={`/admin/orders/abandoned/${c.id.replace('#', '')}`}
                            className="hover:underline font-semibold text-[#1a1a1a]"
                          >
                            {c.id}
                          </Link>
                        </td>
                      )}
                      {isColVisible("date") && <td className="px-3 py-1 text-[#616161]">{c.date}</td>}
                      {isColVisible("customer") && <td className="px-3 py-1 text-[#1a1a1a] hover:underline cursor-pointer">{c.customer}</td>}
                      {isColVisible("status") && (
                        <td className="px-3 py-1">
                          <Badge variant={c.statusType as any} icon="none">{c.status}</Badge>
                        </td>
                      )}
                      {isColVisible("total") && <td className="px-3 py-1 text-[#1a1a1a] font-medium text-left">{c.total}</td>}
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
        orders={checkouts}
        filteredOrders={filteredCheckouts}
        selectedIds={selectedIds}
        hasSearchOrFilter={searchQuery.trim() !== "" || activeFilters.length > 0}
        title="Export abandoned checkouts"
        itemLabel="abandoned checkouts"
      />
    </div>
  );
}
