"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { InventoryIcon, ProductIcon } from "@shopify/polaris-icons";
import {
  Search,
  Columns,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Check,
  ChevronsUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getAdminProductsAction,
  bulkDeleteProductsAction,
  updateProductInventoryAction,
} from "@/app/actions/products";

export interface InventoryItem {
  id: string;
  title: string;
  sku: string;
  barcode: string;
  avail: number;
  status: string;
  image?: string | null;
}

export default function InventoryPage() {
  const router = useRouter();
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection & Sorting
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<"title" | "sku" | "barcode" | "avail">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Inline editing state for Available column
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Popovers & Dialogs
  const [isViewsOpen, setIsViewsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
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
  const columnsRef = useRef<HTMLDivElement>(null);
  const bulkSelectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (viewsRef.current && !viewsRef.current.contains(target)) {
        setIsViewsOpen(false);
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

  // Fetch real products from Supabase database
  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const prods = await getAdminProductsAction();
      const mapped: InventoryItem[] = prods.map((p) => ({
        id: p.id,
        title: p.name,
        sku: p.id,
        barcode: "No barcode",
        avail: p.inventoryCount ?? 0,
        status: p.status,
        image: p.image,
      }));
      setInventoryList(mapped);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Filter & Sort Logic
  const filteredInventory = useMemo(() => {
    let result = [...inventoryList];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.barcode.toLowerCase().includes(q) ||
          item.avail.toString().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortColumn === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortColumn === "sku") {
        return sortDirection === "asc"
          ? a.sku.localeCompare(b.sku)
          : b.sku.localeCompare(a.sku);
      }
      if (sortColumn === "barcode") {
        return sortDirection === "asc"
          ? a.barcode.localeCompare(b.barcode)
          : b.barcode.localeCompare(a.barcode);
      }
      if (sortColumn === "avail") {
        return sortDirection === "asc" ? a.avail - b.avail : b.avail - a.avail;
      }
      return 0;
    });

    return result;
  }, [inventoryList, searchQuery, sortColumn, sortDirection]);

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / ITEMS_PER_PAGE));
  const paginatedInventory = useMemo(() => {
    return filteredInventory.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredInventory, currentPage]);

  const startItem = filteredInventory.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredInventory.length);

  // Selection Logic
  const currentPageIds = paginatedInventory.map((item) => item.id);
  const isPageAllSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));
  const isPageSomeSelected =
    currentPageIds.some((id) => selectedIds.has(id)) && !isPageAllSelected;

  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = isPageSomeSelected;
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

  const handleRowCheckbox = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSort = (colKey: "title" | "sku" | "barcode" | "avail") => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (colKey: string) => {
    if (sortColumn !== colKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    );
  };

  // Inline Available Quantity Save
  const handleStartEdit = (id: string, currentVal: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(String(currentVal));
  };

  const handleSaveEdit = async (id: string) => {
    const parsed = parseInt(editValue.trim(), 10);
    if (isNaN(parsed)) {
      setEditingId(null);
      return;
    }

    try {
      setSavingId(id);
      setInventoryList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, avail: parsed } : item))
      );
      setEditingId(null);

      const res = await updateProductInventoryAction(id, parsed);
      if (res.success) {
        setSavedId(id);
        setTimeout(() => setSavedId(null), 1800);
      }
    } catch (err) {
      console.error("Failed to update inventory:", err);
    } finally {
      setSavingId(null);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    try {
      const idsToDelete = Array.from(selectedIds);
      const res = await bulkDeleteProductsAction(idsToDelete);
      if (res.success) {
        setInventoryList((prev) => prev.filter((item) => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
        setDeleteConfirmOpen(false);
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  };

  return (
    <div className="w-full relative pb-10 select-none font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[20px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <InventoryIcon className="w-5 h-5 fill-current text-[#1a1a1a]" />
            <span>Inventory</span>
          </h1>
          <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {inventoryList.length} {inventoryList.length === 1 ? "product" : "products"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/products/new")}
            className="px-3.5 py-1.5 text-[13px] font-semibold text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-xl transition shadow-2xs cursor-pointer"
          >
            Add product
          </button>
        </div>
      </div>

      {/* Main Table Area Card Container */}
      <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Toolbar Header Row */}
        <div className="p-2 border-b border-[#e1e3e5] bg-white flex items-center justify-between">
          {/* Unified Search and View Filter Bar */}
          <div className="relative flex-1 w-full flex items-center bg-white border border-[#c9cccf] rounded-xl px-2.5 py-1 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
            {/* View Selector */}
            <div ref={viewsRef} className="relative z-50 shrink-0 mr-2">
              <button
                type="button"
                onClick={() => setIsViewsOpen(!isViewsOpen)}
                className="bg-[#f1f2f4] hover:bg-[#e4e5e7] text-[#1a1a1a] text-[12px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5 border border-[#c9cccf] transition cursor-pointer"
              >
                <span>{selectedView}</span>
                <ChevronsUpDown className="w-3 h-3 text-[#616161]" />
              </button>

              {isViewsOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 duration-100">
                  {["All"].map((view) => (
                    <div
                      key={view}
                      onClick={() => {
                        setSelectedView(view);
                        setIsViewsOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-lg transition text-left cursor-pointer bg-[#f1f2f4] text-[#1a1a1a] font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />
                        <span>{view}</span>
                      </div>
                    </div>
                  ))}
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
                placeholder="Search products by title, SKU, or quantity"
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
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-1 ml-2">
            {/* Columns Customizer */}
            <div ref={columnsRef} className="relative">
              <button
                type="button"
                onClick={() => setIsColumnsOpen(!isColumnsOpen)}
                className={cn(
                  "p-1.5 rounded-lg border transition cursor-pointer text-[#616161] hover:text-[#1a1a1a] flex items-center justify-center",
                  isColumnsOpen
                    ? "bg-[#f1f2f4] border-[#c9cccf]"
                    : "border-transparent hover:bg-[#f1f2f4]"
                )}
                title="Edit columns"
              >
                <Columns className="w-4 h-4" />
              </button>

              {isColumnsOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-48 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in-0 zoom-in-95 duration-100 flex flex-col gap-1 text-[13px]">
                  <div className="text-[11px] font-semibold text-[#616161] uppercase px-2 py-1">
                    Toggle columns
                  </div>
                  {columns.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#f6f6f7] cursor-pointer text-[#303030]"
                    >
                      <input
                        type="checkbox"
                        checked={col.visible}
                        onChange={() => toggleColumnVisibility(col.id)}
                        className="rounded border-[#c9cccf] cursor-pointer"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table View Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <colgroup>
              <col style={{ width: "42px" }} />
              <col />
              {isColVisible("sku") && <col />}
              {isColVisible("barcode") && <col />}
              {isColVisible("avail") && <col style={{ width: "180px" }} />}
            </colgroup>
            <thead>
              {selectedIds.size > 0 ? (
                /* Bulk Action Bar */
                <tr className="bg-[#f1f2f4] border-b border-[#e1e3e5] h-[48px] text-[13px] text-[#1a1a1a] font-medium">
                  <th className="pl-3.5 pr-1 align-middle text-left">
                    <input
                      ref={masterCheckboxRef}
                      type="checkbox"
                      checked={isPageAllSelected}
                      onChange={handleMasterCheckboxToggle}
                      className="rounded border-[#c9cccf] cursor-pointer accent-[#1a1a1a] w-4 h-4"
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
                                setSelectedIds(new Set(inventoryList.map((i) => i.id)));
                                setIsBulkSelectionMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium text-[13px]"
                            >
                              Select all in this store
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedIds(new Set());
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

                      {/* Delete Inventory / Products */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmOpen(true)}
                        className="bg-white hover:bg-[#fff5f5] border border-[#c9cccf] text-red-600 px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete products</span>
                      </button>
                    </div>
                  </th>
                </tr>
              ) : (
                /* Regular Column Headers */
                <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#fafafa] select-none h-[44px]">
                  <th className="pl-3.5 pr-1 py-1.5 w-9 align-middle text-left">
                    <input
                      ref={masterCheckboxRef}
                      type="checkbox"
                      checked={isPageAllSelected}
                      onChange={handleMasterCheckboxToggle}
                      className="rounded border-[#c9cccf] cursor-pointer"
                    />
                  </th>
                  <th
                    className="pl-1 pr-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition align-middle text-left"
                    onClick={() => handleSort("title")}
                  >
                    Product {renderSortIndicator("title")}
                  </th>
                  {isColVisible("sku") && (
                    <th
                      className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition align-middle text-left"
                      onClick={() => handleSort("sku")}
                    >
                      SKU {renderSortIndicator("sku")}
                    </th>
                  )}
                  {isColVisible("barcode") && (
                    <th
                      className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition align-middle text-left"
                      onClick={() => handleSort("barcode")}
                    >
                      Barcode {renderSortIndicator("barcode")}
                    </th>
                  )}
                  {isColVisible("avail") && (
                    <th
                      className="px-4 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition align-middle text-right"
                      onClick={() => handleSort("avail")}
                    >
                      Available {renderSortIndicator("avail")}
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {isLoading ? (
                <tr>
                  <td colSpan={100} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="w-8 h-8 text-[#616161] animate-spin" />
                      <p className="text-[13px] text-[#616161] font-medium">Loading inventory from database...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedInventory.length === 0 ? (
                <tr>
                  <td colSpan={100} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
                      <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-[#616161] stroke-[1.25]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">
                        No inventory items found
                      </h3>
                      <p className="text-[13px] text-[#616161] mb-5">
                        {searchQuery ? "Try changing your search query." : "No products available in store."}
                      </p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="bg-[#1a1a1a] hover:bg-[#303030] text-white text-[13px] font-semibold px-4 py-2 rounded-xl shadow-2xs transition cursor-pointer"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedInventory.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const isEditingThis = editingId === item.id;
                  const isSavingThis = savingId === item.id;
                  const isSavedThis = savedId === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/admin/products/${item.id}`)}
                      className={cn(
                        "h-[48px] transition cursor-pointer group",
                        isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#fafafa]"
                      )}
                    >
                      {/* Checkbox cell */}
                      <td className="pl-3.5 pr-1 py-1.5 align-middle text-left">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          onClick={(e) => handleRowCheckbox(item.id, e)}
                          className="rounded border-[#c9cccf] cursor-pointer"
                        />
                      </td>

                      {/* Product Name & Image */}
                      <td className="pl-1 pr-3 py-1.5 align-middle font-semibold text-[#1a1a1a]">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg border border-[#e1e3e5] bg-[#f9fafb] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ProductIcon className="w-4 h-4 fill-current text-[#8c8c8c]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span
                              className="truncate text-[13px] font-semibold text-[#1a1a1a] group-hover:text-[#005bd3] transition"
                              title={item.title}
                            >
                              {item.title}
                            </span>
                            {item.status !== "Active" && (
                              <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                {item.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      {isColVisible("sku") && (
                        <td className="px-3 py-1.5 text-[12.5px] text-[#616161] font-mono align-middle text-left">
                          {item.sku}
                        </td>
                      )}

                      {/* Barcode */}
                      {isColVisible("barcode") && (
                        <td className="px-3 py-1.5 text-[12.5px] text-[#8c8c8c] align-middle text-left">
                          {item.barcode}
                        </td>
                      )}

                      {/* Available (Interactive Inline Editing) */}
                      {isColVisible("avail") && (
                        <td
                          className="px-4 py-1.5 align-middle text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isEditingThis ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <input
                                type="number"
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit(item.id);
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                onBlur={() => handleSaveEdit(item.id)}
                                className="w-20 text-right text-[13px] font-mono font-semibold bg-white border border-[#005bd3] ring-2 ring-[#005bd3]/20 rounded-lg px-2 py-1 outline-none text-[#1a1a1a]"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(item.id)}
                                className="p-1 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-md transition"
                                title="Save quantity"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={(e) => handleStartEdit(item.id, item.avail, e)}
                              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#e4e5e7] transition cursor-pointer group/qty"
                              title="Click to edit available inventory"
                            >
                              {isSavingThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#616161]" />
                              ) : isSavedThis ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : null}
                              <span
                                className={cn(
                                  "font-mono font-semibold text-[13px]",
                                  item.avail <= 0
                                    ? "text-red-600"
                                    : item.avail < 10
                                    ? "text-amber-600"
                                    : "text-[#1a1a1a]"
                                )}
                              >
                                {item.avail}
                              </span>
                              <Edit3 className="w-3 h-3 text-[#8c8c8c] opacity-0 group-hover/qty:opacity-100 transition" />
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-[#e1e3e5] text-sm text-[#1a1a1a] select-none bg-white">
          <span className="text-[13px] text-[#616161]">
            Showing {startItem}-{endItem} of {filteredInventory.length} products
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={cn(
                "p-1.5 border border-[#c9cccf] rounded-lg transition",
                currentPage <= 1
                  ? "text-[#8a8a8a] bg-[#f6f6f7] cursor-not-allowed"
                  : "text-[#1a1a1a] bg-white hover:bg-[#f1f2f4] cursor-pointer"
              )}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[12px] font-mono text-[#616161]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className={cn(
                "p-1.5 border border-[#c9cccf] rounded-lg transition",
                currentPage >= totalPages
                  ? "text-[#8a8a8a] bg-[#f6f6f7] cursor-not-allowed"
                  : "text-[#1a1a1a] bg-white hover:bg-[#f1f2f4] cursor-pointer"
              )}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e1e3e5] overflow-hidden">
            <div className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                Delete {selectedIds.size} {selectedIds.size === 1 ? "product" : "products"}?
              </h3>
              <p className="text-[13px] text-[#616161]">
                This will delete the selected products from your inventory and product catalog permanently. This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-[#fafafa] border-t border-[#e1e3e5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-4 py-1.5 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-2xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
