"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductIcon } from "@shopify/polaris-icons";
import { Badge } from "@/components/admin/Badge";
import { 
  ChevronDown, 
  Search, 
  ArrowDownUp, 
  Columns, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown,
  Check,
  ChevronsUpDown,
  XCircle,
  GripVertical,
  Eye,
  EyeOff,
  MoreHorizontal,
  Mail,
  Workflow,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableLogic } from "@/hooks/admin/useTableLogic";
import { ImportProductsModal } from "@/components/admin/ImportProductsModal";
import { ExportProductsModal } from "@/components/admin/ExportProductsModal";
import { CollectionModal } from "@/components/admin/CollectionModal";
import { 
  getAdminProductsAction, 
  bulkDeleteProductsAction, 
  bulkUpdateProductStatusAction,
  type AdminProductItem 
} from "@/app/actions/products";

const baseTitles = [
  "Abacus Year 2 Workbook 3",
  "Abacus Year 2 Textbook",
  "THE SECRET SEVEN - SECRET SEVEN ADVENTURE",
  "THE BUDDHIST WAY OF LIFE FOR GRADE 5 STU - BOOK 5",
  "Sinhala Wada Potha 3",
  "Sinhala Wada Potha 2",
  "Sinhala Kiyaveem Potha 5",
  "Sinhala Kiyaveem Potha 4",
  "Sinhala Kiyaveem Potha 3",
  "Sinhala Kiyaveem Potha 2",
  "RADIANT WAY THIRD STEP",
  "OXFORD STUDENT LEARNERS DICTIONARY",
  "Oxford Reading Circle Primer revised edition",
  "Grade 6 Mathematics Pupil Book",
  "Grade 7 English Literature Companion",
  "Grade 8 Science & Technology Guide",
  "Grade 9 History & Civics Textbook",
  "Grade 10 Information & Communication Tech",
  "GCE O/L Mathematics Past Papers & Answers",
  "GCE A/L Combined Mathematics Mechanics Vol 1",
  "GCE A/L Physics Theory & Revision Manual",
  "GCE A/L Chemistry Inorganic Chemistry Vol 2",
  "Harry Potter and the Philosopher's Stone",
  "Famous Five - Five On A Treasure Island",
  "Malalasekera English-Sinhala Dictionary",
  "Gunasena Sinhala Ingrisi Koshaya Premium",
  "Targeting Mathematics Primary Year 1",
  "Targeting Science Primary Year 2",
  "Scholastic Early Readers Level 1 Set",
  "Cambridge Primary English Learner's Book 3",
];

const statuses = ["Active", "Active", "Active", "Draft", "Unlisted", "Archived"];
const inventoryCounts = [
  { count: "2 in stock", color: "text-red-600" },
  { count: "-1 in stock", color: "text-red-600" },
  { count: "11 in stock", color: "text-[#1a1a1a]" },
  { count: "8 in stock", color: "text-red-600" },
  { count: "6 in stock", color: "text-[#1a1a1a]" },
  { count: "5 in stock", color: "text-red-600" },
  { count: "16 in stock", color: "text-[#1a1a1a]" },
  { count: "15 in stock", color: "text-[#1a1a1a]" },
  { count: "0 in stock", color: "text-red-600" },
  { count: "24 in stock", color: "text-[#1a1a1a]" },
];

const initialProducts = Array.from({ length: 120 }, (_, i) => {
  const baseTitle = baseTitles[i % baseTitles.length];
  const copyNum = Math.floor(i / baseTitles.length);
  const name = copyNum > 0 ? `${baseTitle} (Edition ${copyNum + 1})` : baseTitle;
  const status = statuses[i % statuses.length];
  const inv = inventoryCounts[i % inventoryCounts.length];
  const month = i % 2 === 0 ? "Jul" : "Jun";
  const day = (i % 28) + 1;
  const hour = (i % 12) + 1;
  const ampm = i % 2 === 0 ? "pm" : "am";

  return {
    id: i + 1,
    name,
    status,
    inventory: inv.count,
    inventoryColor: inv.color,
    category: "Print Books",
    channels: status === "Archived" ? "0" : "4",
    type: i % 3 === 0 ? "Workbook" : i % 3 === 1 ? "Reader" : "Textbook",
    vendor: "Prasanthi Craft",
    noImage: i % 7 === 0,
    price: `LKR ${((i % 50) * 150 + 450).toFixed(2)}`,
    comparePrice: `LKR ${(((i % 50) * 150 + 450) * 1.15).toFixed(2)}`,
    created: `${month} ${day} at ${hour}:15 ${ampm}`,
    updated: `${month} ${day + 1} at ${hour}:30 ${ampm}`,
  };
});

export default function ProductsPage() {
  const router = useRouter();
  const [productsList, setProductsList] = useState<AdminProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from Supabase
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminProductsAction();
      setProductsList(data);
    } catch (err) {
      console.error("Failed to load products from database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const {
    sortedData: products,
    selectedIds,
    setSelectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(productsList, "id");

  // State Declarations for Toolbar & Popovers
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isViewsOpen, setIsViewsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All");
  const [collectionModalMode, setCollectionModalMode] = useState<"add" | "remove" | null>(null);
  const [confirmModalType, setConfirmModalType] = useState<
    "active" | "draft" | "unlisted" | "archive" | "delete" | null
  >(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isSortSubMenuOpen, setIsSortSubMenuOpen] = useState(false);
  const [isBulkSelectionMenuOpen, setIsBulkSelectionMenuOpen] = useState(false);
  const [isMoreBulkActionsOpen, setIsMoreBulkActionsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmBulkAction = async () => {
    if (!confirmModalType) return;
    const ids = Array.from(selectedIds) as string[];

    if (confirmModalType === "active") {
      setProductsList((prev) =>
        prev.map((p) => (selectedIds.has(p.id) ? { ...p, status: "Active" } : p))
      );
      await bulkUpdateProductStatusAction(ids, "Active");
    } else if (confirmModalType === "draft") {
      setProductsList((prev) =>
        prev.map((p) => (selectedIds.has(p.id) ? { ...p, status: "Draft" } : p))
      );
      await bulkUpdateProductStatusAction(ids, "Draft");
    } else if (confirmModalType === "unlisted") {
      setProductsList((prev) =>
        prev.map((p) => (selectedIds.has(p.id) ? { ...p, status: "Unlisted" } : p))
      );
      await bulkUpdateProductStatusAction(ids, "Unlisted");
    } else if (confirmModalType === "archive") {
      setProductsList((prev) =>
        prev.map((p) => (selectedIds.has(p.id) ? { ...p, status: "Archived" } : p))
      );
      await bulkUpdateProductStatusAction(ids, "Archived");
    } else if (confirmModalType === "delete") {
      setProductsList((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      await bulkDeleteProductsAction(ids);
    }

    setSelectedIds(new Set());
    setConfirmModalType(null);
  };

  // Pagination state (50 products per page)
  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Column Visibility state
  const [columns, setColumns] = useState([
    { id: "status", label: "Status", visible: true },
    { id: "inventory", label: "Inventory", visible: true },
    { id: "price", label: "Price", visible: true },
    { id: "comparePrice", label: "Compare-at price", visible: true },
    { id: "type", label: "Product type", visible: true },
    { id: "vendor", label: "Vendor", visible: true },
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

  // Click outside refs
  const viewsRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bulkSelectionRef = useRef<HTMLDivElement>(null);
  const moreBulkRef = useRef<HTMLDivElement>(null);

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
      if (moreBulkRef.current && !moreBulkRef.current.contains(target)) {
        setIsMoreBulkActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter Logic for Live Table
  const filteredProducts = products.filter((p) => {
    // View Tab Filter (Screenshot 1: All, Active, Draft, Archived)
    if (selectedView === "Active" && p.status !== "Active") return false;
    if (selectedView === "Draft" && p.status !== "Draft") return false;
    if (selectedView === "Archived" && p.status !== "Archived") return false;

    // Search Query Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.inventory.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });

  // Reset to page 1 on search or view filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedView]);

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);

  // Selection Helper Calculations for Page-by-Page Selection
  const currentPageIds = paginatedProducts.map((p) => p.id);

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
    const next = new Set(products.map((p) => p.id));
    setSelectedIds(next);
  };

  const unselectAll = () => {
    setSelectedIds(new Set());
  };

  // Status bulk action button visibility rules matching user specifications:
  // - Active products selected -> draft, unlisted, archived
  // - Draft products selected -> active, unlisted, archived
  // - Unlisted products selected -> active, draft, archived
  // - Archived products selected -> active, draft, unlisted
  const selectedProducts = productsList.filter((p) => selectedIds.has(p.id));
  const selectedStatuses = new Set(selectedProducts.map((p) => p.status));

  const showSetActiveBtn =
    selectedStatuses.size === 0 ||
    !Array.from(selectedStatuses).every((s) => s === "Active");

  const showSetDraftBtn =
    selectedStatuses.size === 0 ||
    !Array.from(selectedStatuses).every((s) => s === "Draft");

  const showSetUnlistedBtn =
    selectedStatuses.size === 0 ||
    !Array.from(selectedStatuses).every((s) => s === "Unlisted" || s === "Unlist");

  const showSetArchivedBtn =
    selectedStatuses.size === 0 ||
    !Array.from(selectedStatuses).every((s) => s === "Archived");

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
      {/* Top Action Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-bold text-[#1a1a1a] flex items-center gap-2">
          <ProductIcon className="w-5 h-5 fill-current text-[#1a1a1a]" />
          <span>Products</span>
        </h1>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1 text-[13px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition shadow-2xs cursor-pointer"
          >
            Export
          </button>
          <button 
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1 text-[13px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition shadow-2xs cursor-pointer"
          >
            Import
          </button>
          <Link
            href="/admin/products/new"
            className="px-3.5 py-1 text-[13px] font-semibold bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs inline-flex items-center justify-center cursor-pointer"
          >
            Add product
          </Link>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl shadow-2xs">
        {/* Table Toolbar Header Row */}
        <div className="p-2 border-b border-[#e1e3e5] bg-white flex items-center justify-between rounded-t-xl">
          {/* Unified Search and Filter Bar */}
          <div className="relative flex-1 w-full flex items-center bg-white border border-[#c9cccf] rounded-lg px-2 py-1 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
            
            {/* 1. Integrated View Selector Pill on Far Left (Matching Reference Image) */}
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
                  {["All", "Active", "Draft", "Archived"].map((view) => {
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
                          "w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition text-left cursor-pointer",
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

            {/* 3. Cross Button (X) on Far Right when search query is typed */}
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
            {/* Separate Sort Popover Button */}
            <div ref={sortRef} className="relative">
              <button 
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
                <div className="absolute top-full right-0 mt-1.5 w-[220px] bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-0.5 text-[13px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out max-h-[380px] overflow-y-auto">
                  <div className="text-[12px] font-semibold text-[#616161] px-2 py-1">Sort by</div>
                  {[
                    { label: "Product title", key: "name" },
                    { label: "Inventory", key: "inventory" },
                    { label: "Price", key: "price" },
                    { label: "Product type", key: "type" },
                    { label: "Vendor", key: "vendor" },
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
                    onClick={() => {
                      if (sortDirection !== "asc") handleSort(sortColumn || "name");
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
                    onClick={() => {
                      if (sortDirection !== "desc") handleSort(sortColumn || "name");
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

            {/* Columns Customization Popover Button */}
            <div ref={columnsRef} className="relative">
              <button 
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
        <div className="overflow-x-auto [overscroll-behavior-x:contain] [transform:translateZ(0)]">
          <table className="polaris-table w-full">
            <colgroup>
              <col style={{ width: "36px" }} />
              <col style={{ width: "240px" }} />
              {isColVisible("status") && <col style={{ width: "100px" }} />}
              {isColVisible("inventory") && <col style={{ width: "110px" }} />}
              {isColVisible("price") && <col style={{ width: "120px" }} />}
              {isColVisible("comparePrice") && <col style={{ width: "140px" }} />}
              {isColVisible("type") && <col style={{ width: "130px" }} />}
              {isColVisible("vendor") && <col />}
            </colgroup>
            <thead>
              {selectedIds.size > 0 ? (
                /* Bulk Action Bar matching user reference screenshots */
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
                      {/* Selected Pill Dropdown (Screenshots 4 & 5) */}
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
                                Select all {paginatedProducts.length} on page
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

                      {/* Edit Product / Bulk Edit Button */}
                      {selectedIds.size === 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            const id = Array.from(selectedIds)[0];
                            router.push(`/admin/products/${id}`);
                          }}
                          className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                        >
                          Edit product
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const ids = Array.from(selectedIds).join(",");
                            router.push(`/admin/products/bulk-editor?ids=${encodeURIComponent(ids)}`);
                          }}
                          className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                        >
                          Bulk edit
                        </button>
                      )}

                      {/* Dynamic Status Action Buttons based on selection */}
                      {showSetActiveBtn && (
                        <button
                          type="button"
                          onClick={() => setConfirmModalType("active")}
                          className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                        >
                          Set as active
                        </button>
                      )}

                      {showSetDraftBtn && (
                        <button
                          type="button"
                          onClick={() => setConfirmModalType("draft")}
                          className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                        >
                          Set as draft
                        </button>
                      )}

                      {showSetUnlistedBtn && (
                        <button
                          type="button"
                          onClick={() => setConfirmModalType("unlisted")}
                          className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                        >
                          Set as unlisted
                        </button>
                      )}

                      {showSetArchivedBtn && (
                        <button
                          type="button"
                          onClick={() => setConfirmModalType("archive")}
                          className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-3 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer"
                        >
                          Set as archived
                        </button>
                      )}

                      {/* More Actions Pill Button (...) */}
                      <div ref={moreBulkRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsMoreBulkActionsOpen(!isMoreBulkActionsOpen)}
                          className="bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] px-2.5 py-1 rounded-lg text-[13px] font-medium shadow-2xs transition cursor-pointer flex items-center justify-center"
                          title="More actions"
                        >
                          <MoreHorizontal className="w-4 h-4 text-[#1a1a1a]" />
                        </button>

                        {isMoreBulkActionsOpen && (
                          <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out flex flex-col text-[13px] text-[#303030]">
                            {/* Collections */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsMoreBulkActionsOpen(false);
                                setCollectionModalMode("add");
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#f6f6f7] rounded-lg transition font-medium text-[#1a1a1a]"
                            >
                              Add to collection(s)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsMoreBulkActionsOpen(false);
                                setCollectionModalMode("remove");
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#f6f6f7] rounded-lg transition font-medium text-[#1a1a1a]"
                            >
                              Remove from collection(s)
                            </button>

                            <hr className="my-1 border-[#e1e3e5]" />

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsMoreBulkActionsOpen(false);
                                setConfirmModalType("delete");
                              }}
                              className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-[#fff5f5] rounded-lg transition font-medium"
                            >
                              Delete products
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                </tr>
              ) : (
                /* Regular Column Headers Row */
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
                  <th className="pl-1 pr-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left" onClick={() => handleSort("name")}>
                    Product {renderSortIndicator("name")}
                  </th>
                  {isColVisible("status") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("status")}>
                      Status {renderSortIndicator("status")}
                    </th>
                  )}
                  {isColVisible("inventory") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("inventory")}>
                      Inventory {renderSortIndicator("inventory")}
                    </th>
                  )}
                  {isColVisible("price") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("price")}>
                      Price {renderSortIndicator("price")}
                    </th>
                  )}
                  {isColVisible("comparePrice") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("comparePrice")}>
                      Compare-at price {renderSortIndicator("comparePrice")}
                    </th>
                  )}
                  {isColVisible("type") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("type")}>
                      Product type {renderSortIndicator("type")}
                    </th>
                  )}
                  {isColVisible("vendor") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("vendor")}>
                      Vendor {renderSortIndicator("vendor")}
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="bg-white">
                  <td colSpan={100} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-7 h-7 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                      <p className="text-[13px] font-medium text-[#616161]">Loading products from Supabase...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                /* Empty state matching Shopify design */
                <tr className="bg-white">
                  <td colSpan={100} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
                      <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-[#616161] stroke-[1.25]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">No products found</h3>
                      <p className="text-[13px] text-[#616161] mb-5">
                        Try changing the filters or search terms for this view
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
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
                paginatedProducts.map((product, idx) => {
                  const selected = isRowSelected(product.id);
                  return (
                    <tr
                      key={product.id}
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                      className={`border-b border-[#f1f1f1] h-[38px] transition cursor-pointer ${
                        selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <td className="pl-3 pr-1 py-1 align-middle text-left" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}}
                          onClick={(e) => handleRowCheckboxClick(e, idx, product.id)}
                          className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                        />
                      </td>
                      <td className="pl-1 pr-3 py-1 align-middle font-semibold text-[#1a1a1a]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded border border-[#e1e3e5] bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            ) : product.noImage ? (
                              <ImageIcon className="w-4.5 h-4.5 text-gray-300" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-amber-400 to-[#FFB800] rounded flex items-center justify-center text-[11px] font-black text-slate-950">
                                ₿
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/admin/products/${product.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="truncate text-[#1a1a1a] hover:underline font-semibold"
                            title={product.name}
                          >
                            {product.name}
                          </Link>
                        </div>
                      </td>
                      {isColVisible("status") && (
                        <td className="px-3 py-1.5 align-middle">
                          <Badge
                            variant={
                              product.status === "Active"
                                ? "success"
                                : product.status === "Draft"
                                ? "draft"
                                : product.status === "Unlisted" || product.status === "Unlist"
                                ? "unlisted"
                                : "neutral"
                            }
                            icon="none"
                          >
                            {product.status}
                          </Badge>
                        </td>
                      )}
                      {isColVisible("inventory") && (
                        <td className={`px-3 py-1.5 font-medium align-middle ${product.inventoryColor}`}>
                          {product.inventory}
                        </td>
                      )}
                      {isColVisible("price") && (
                        <td className="px-3 py-1.5 text-[#1a1a1a] font-medium align-middle">
                          {product.price}
                        </td>
                      )}
                      {isColVisible("comparePrice") && (
                        <td className="px-3 py-1.5 text-[#616161] line-through align-middle">
                          {product.comparePrice}
                        </td>
                      )}
                      {isColVisible("type") && <td className="px-3 py-1.5 text-[#1a1a1a] align-middle">{product.type}</td>}
                      {isColVisible("vendor") && <td className="px-3 py-1.5 text-[#1a1a1a] align-middle">{product.vendor}</td>}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer (50 products per page) */}
        <div className="px-4 py-3 flex items-center justify-center gap-4 border-t border-[#e1e3e5] text-sm text-[#1a1a1a] select-none">
          <div className="flex gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

      {/* Export Products CSV Modal */}
      <ExportProductsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        products={products}
        filteredProducts={filteredProducts}
        selectedIds={selectedIds}
        hasSearchOrFilter={searchQuery.trim() !== "" || selectedView !== "All"}
      />

      {/* Import Products CSV Modal */}
      <ImportProductsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(count) => {
          loadProducts();
          showToast(`Successfully imported ${count} ${count === 1 ? "product" : "products"}`);
        }}
      />

      {/* Collection Modal for Add/Remove to Collection(s) */}
      <CollectionModal
        isOpen={collectionModalMode !== null}
        mode={collectionModalMode || "add"}
        selectedCount={selectedIds.size}
        onClose={() => setCollectionModalMode(null)}
      />

      {/* Bulk Action Confirmation Modal matching reference screenshots */}
      {confirmModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200 select-none">
          <div className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
              <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
                {confirmModalType === "active" &&
                  `Set ${selectedIds.size} ${selectedIds.size === 1 ? "product" : "products"} as active?`}
                {confirmModalType === "draft" &&
                  `Set ${selectedIds.size} ${selectedIds.size === 1 ? "product" : "products"} as draft?`}
                {confirmModalType === "unlisted" &&
                  `Set ${selectedIds.size} ${selectedIds.size === 1 ? "product" : "products"} as unlisted?`}
                {confirmModalType === "archive" &&
                  `Archive ${selectedIds.size} ${selectedIds.size === 1 ? "product" : "products"}?`}
                {confirmModalType === "delete" &&
                  `Delete ${selectedIds.size} ${selectedIds.size === 1 ? "product" : "products"}?`}
              </h2>
              <button
                type="button"
                onClick={() => setConfirmModalType(null)}
                className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-[13.5px] text-[#303030] leading-normal">
              {confirmModalType === "active" &&
                "Setting products as active will make them available to their selected sales channels and apps."}
              {confirmModalType === "draft" &&
                "Setting products as draft will hide them from all sales channels and apps."}
              {confirmModalType === "unlisted" &&
                "Setting products as unlisted will hide them from storefront listings and search results."}
              {confirmModalType === "archive" &&
                "Archiving products will hide them from your online store, sales channels, and admin list."}
              {confirmModalType === "delete" &&
                "This action cannot be undone. This will permanently delete the selected products."}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e1e3e5] bg-white">
              <button
                type="button"
                onClick={() => setConfirmModalType(null)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-lg shadow-2xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkAction}
                className={cn(
                  "px-3.5 py-1.5 text-[13px] font-semibold text-white rounded-lg shadow-2xs transition cursor-pointer",
                  confirmModalType === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#1a1a1a] hover:bg-[#303030]"
                )}
              >
                {confirmModalType === "active" && "Set as active"}
                {confirmModalType === "draft" && "Set as draft"}
                {confirmModalType === "unlisted" && "Set as unlisted"}
                {confirmModalType === "archive" && "Archive products"}
                {confirmModalType === "delete" && "Delete products"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-Center Dark Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#000000] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-medium border border-[#262626] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#8c8c8c] hover:text-white transition p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
