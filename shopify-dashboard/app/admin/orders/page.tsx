"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/admin/Badge";
import { ExportOrdersModal } from "@/components/admin/ExportOrdersModal";
import { 
  ChevronDown, 
  Search, 
  ArrowDownUp, 
  Columns, 
  ShieldAlert, 
  Inbox, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  MoreHorizontal,
  Check,
  GripVertical,
  Eye,
  EyeOff,
  X,
  XCircle,
  CornerDownLeft,
  ArrowDownRight,
  ChevronsUpDown,
  Filter,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableLogic } from "@/hooks/admin/useTableLogic";
import { initialOrdersList as initialOrders } from "@/lib/admin/ordersData";

const categoryOptionsMap: Record<string, string[]> = {
  "Order status": ["Open", "Archived", "Canceled"],
  "Date": ["Today", "Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "Custom date", "Custom range"],
  "Payment status": ["Authorized", "Due", "Expired", "Paid", "Partially paid", "Partially refunded", "Pending", "Refunded", "Unpaid", "Voided"],
  "Fulfillment status": ["Fulfilled", "Unfulfilled", "Partially fulfilled", "Scheduled", "On hold", "Request declined"],
  "Delivery status": ["In transit", "Out for delivery", "Attempted delivery", "Delayed", "Failed delivery", "Delivered", "Ready for pickup", "Tracking added", "No status"],
  "Delivery method": ["In store", "Local delivery", "Pickup in store", "Pickup point", "Shipping"],
};

export default function Orders() {
  const router = useRouter();
  const [ordersList, setOrdersList] = useState(initialOrders);

  const {
    sortedData: orders,
    selectedIds,
    setSelectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(ordersList, "id");

  // Popover & Bulk Action States
  const [showAnalyticsBar, setShowAnalyticsBar] = useState(true);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [isBulkSelectionMenuOpen, setIsBulkSelectionMenuOpen] = useState(false);
  const [isBulkPrintMenuOpen, setIsBulkPrintMenuOpen] = useState(false);
  const [isBulkMarkAsMenuOpen, setIsBulkMarkAsMenuOpen] = useState(false);
  const [isBulkMoreActionsMenuOpen, setIsBulkMoreActionsMenuOpen] = useState(false);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  // Notification Banner & Progress Card States (Matching Screenshot)
  const [darkToastMessage, setDarkToastMessage] = useState<string | null>(null);
  const [actionNotification, setActionNotification] = useState<{
    title: string;
    label: string;
    count: number;
    total: number;
    status: "in_progress" | "completed";
  } | null>(null);

  const triggerProgressAction = (
    toastText: string,
    actionLabel: string,
    onCompleteAction: () => void
  ) => {
    const totalCount = selectedIds.size || 1;

    setDarkToastMessage(toastText);
    setActionNotification({
      title: "In progress",
      label: actionLabel,
      count: 0,
      total: totalCount,
      status: "in_progress",
    });

    onCompleteAction();

    setTimeout(() => {
      setActionNotification((prev) =>
        prev
          ? {
              ...prev,
              title: "Task completed",
              count: totalCount,
              status: "completed",
            }
          : null
      );
    }, 1200);

    setTimeout(() => {
      setDarkToastMessage(null);
    }, 4500);

    setTimeout(() => {
      setActionNotification(null);
    }, 6000);
  };

  const handleShowToast = (msg: string) => {
    setDarkToastMessage(msg);
    setTimeout(() => setDarkToastMessage(null), 3500);
  };

  const handleBulkMarkAs = (statusOption: string) => {
    triggerProgressAction(
      "Fulfilling order...",
      `Marking orders as ${statusOption.toLowerCase()}`,
      () => {
        setOrdersList((prev) =>
          prev.map((item) => {
            if (selectedIds.has(item.id)) {
              if (["Fulfilled", "Unfulfilled", "In progress", "On hold"].includes(statusOption)) {
                return { ...item, fulfillment: statusOption };
              } else if (statusOption === "Delivered") {
                return { ...item, delivery: "Delivered" };
              } else if (statusOption === "Cancel orders") {
                return { ...item, status: "Canceled", fulfillment: "Canceled" };
              }
            }
            return item;
          })
        );
      }
    );
  };

  const handleBulkCapturePayments = () => {
    triggerProgressAction(
      "Capturing payments...",
      "Capturing payments for selected orders",
      () => {
        setOrdersList((prev) =>
          prev.map((item) => {
            if (selectedIds.has(item.id)) {
              return { ...item, payment: "Paid" };
            }
            return item;
          })
        );
      }
    );
  };

  const handleBulkArchive = (archive: boolean) => {
    triggerProgressAction(
      archive ? "Archiving orders..." : "Unarchiving orders...",
      archive ? "Archiving selected orders" : "Unarchiving selected orders",
      () => {
        setOrdersList((prev) =>
          prev.map((item) => {
            if (selectedIds.has(item.id)) {
              return { ...item, status: archive ? "Archived" : "Open" };
            }
            return item;
          })
        );
      }
    );
  };

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("All time");

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

  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isSortSubMenuOpen, setIsSortSubMenuOpen] = useState(false);
  const [hideArchived, setHideArchived] = useState(false);

  // Click outside ref declarations
  const dateRef = useRef<HTMLDivElement>(null);
  const viewsRef = useRef<HTMLDivElement>(null);
  const searchFilterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bulkSelectionRef = useRef<HTMLDivElement>(null);
  const bulkPrintRef = useRef<HTMLDivElement>(null);
  const bulkMarkAsRef = useRef<HTMLDivElement>(null);
  const bulkMoreActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dateRef.current && !dateRef.current.contains(target)) {
        setIsDateOpen(false);
      }
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
      if (bulkPrintRef.current && !bulkPrintRef.current.contains(target)) {
        setIsBulkPrintMenuOpen(false);
      }
      if (bulkMarkAsRef.current && !bulkMarkAsRef.current.contains(target)) {
        setIsBulkMarkAsMenuOpen(false);
      }
      if (bulkMoreActionsRef.current && !bulkMoreActionsRef.current.contains(target)) {
        setIsBulkMoreActionsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Column Visibility state matching Screenshots 2 & 4
  const [columns, setColumns] = useState([
    { id: "id", label: "Order", visible: true },
    { id: "date", label: "Date", visible: true },
    { id: "customer", label: "Customer", visible: true },
    { id: "total", label: "Total", visible: true },
    { id: "payment", label: "Payment status", visible: true },
    { id: "fulfillmentStatus", label: "Fulfillment status", visible: true },
    { id: "items", label: "Items", visible: true },
    { id: "delivery", label: "Delivery status", visible: true },
    { id: "method", label: "Delivery method", visible: true },
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

  // Filter criteria list matching table headers column exactly
  const filterCategories = [
    "Order status",
    "Date",
    "Customer",
    "Order total",
    "Payment status",
    "Fulfillment status",
    "Number of items",
    "Delivery status",
    "Delivery method",
  ];

  // Dynamic filter logic for live UI table
  const filteredOrders = orders.filter((order) => {
    // Show only selected toggle
    if (showOnlySelected && !selectedIds.has(order.id)) return false;

    // Date Range Filter
    if (selectedDateRange === "Today") {
      if (!order.date.includes("Tuesday") && !order.date.includes("Today") && !order.date.includes("Jul 27")) return false;
    } else if (selectedDateRange === "Last 7 days") {
      if (!order.date.includes("Tuesday") && !order.date.includes("Today") && !order.date.includes("Jul 27") && !order.date.includes("Jul 21")) return false;
    } else if (selectedDateRange === "Last 30 days") {
      if (
        !order.date.includes("Tuesday") &&
        !order.date.includes("Today") &&
        !order.date.includes("Jul 27") &&
        !order.date.includes("Jul 21") &&
        !order.date.includes("Jul 9") &&
        !order.date.includes("Jul 3")
      ) return false;
    }

    // View Tab Filter
    if (selectedView === "Unfulfilled" && order.fulfillment !== "Unfulfilled") return false;
    if (selectedView === "Unpaid" && order.payment !== "Payment pending") return false;
    if (selectedView === "Open" && order.status !== "Open") return false;
    if (selectedView === "Archived" && order.status !== "Archived") return false;

    // Text Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matches = 
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.channel.toLowerCase().includes(q) ||
        order.payment.toLowerCase().includes(q) ||
        order.fulfillment.toLowerCase().includes(q) ||
        order.total.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Active Category Filters
    for (const filter of activeFilters) {
      const cat = filter.category.toLowerCase();
      const vals = filter.value.toLowerCase().split(",").map(v => v.trim());
      const isNot = cat.includes("is not");

      let matches = false;
      if (cat.includes("payment")) {
        matches = vals.some(v => order.payment.toLowerCase().includes(v));
      } else if (cat.includes("fulfillment")) {
        matches = vals.some(v => order.fulfillment.toLowerCase().includes(v));
      } else if (cat.includes("order status")) {
        matches = vals.some(v => order.status.toLowerCase().includes(v));
      } else if (cat.includes("delivery status")) {
        matches = vals.some(v => order.delivery && order.delivery.toLowerCase().includes(v));
      } else if (cat.includes("delivery method")) {
        matches = vals.some(v => order.method.toLowerCase().includes(v));
      } else if (cat.includes("channel")) {
        matches = vals.some(v => order.channel.toLowerCase().includes(v));
      } else if (cat.includes("customer")) {
        matches = vals.some(v => order.customer.toLowerCase().includes(v));
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
          <div className="bg-white p-1 rounded-md border border-[#e1e3e5] shadow-2xs">
            <Inbox className="w-4 h-4 text-[#303030]" />
          </div>
          Orders
        </h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition"
          >
            Export
          </button>

          {/* Hide/Show analytics bar button */}
          <button 
            onClick={() => setShowAnalyticsBar(!showAnalyticsBar)}
            className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs flex items-center gap-1.5 transition"
          >
            {showAnalyticsBar ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-[#616161]" />
                <span>Hide analytics bar</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#616161]" />
                <span>Show analytics bar</span>
              </>
            )}
          </button>

          <Link
            href="/admin/orders/create"
            className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition inline-flex items-center justify-center"
          >
            Create order
          </Link>
        </div>
      </div>

      {/* Metric Summary Card (Analytics Bar) */}
      {showAnalyticsBar && (
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-1.5 mb-3 shadow-2xs flex items-stretch relative z-30">
          {/* Today / Date Range Dropdown Button */}
          <div ref={dateRef} className="relative flex items-center pr-1 z-50">
            <button 
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="px-2.5 py-1.5 text-[13px] font-medium text-[#303030] flex items-center gap-1.5 hover:bg-[#f6f6f7] rounded-md transition"
            >
              <Calendar className="w-4 h-4 text-[#616161]" /> {selectedDateRange}
            </button>

            {/* Today / Date Range Popover (Floating ON TOP, matching Screenshot 4) */}
            {isDateOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-[310px] bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-2 z-50 flex flex-col gap-1">
                {[
                  { name: "Today", desc: "Compared to yesterday up to current hour" },
                  { name: "Last 7 days", desc: "Compared to the previous 7 days" },
                  { name: "Last 30 days", desc: "Compared to the previous 30 days" },
                  { name: "All time", desc: "Show all historical order records" },
                ].map((item) => {
                  const isSelected = selectedDateRange === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setSelectedDateRange(item.name);
                        setIsDateOpen(false);
                      }}
                      className="flex items-start gap-3 p-2 rounded-lg text-left hover:bg-[#f1f2f4] transition"
                    >
                      <div className="mt-0.5 shrink-0">
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center p-0.5">
                            <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#8a8a8a]" />
                        )}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#1a1a1a]">{item.name}</div>
                        <div className="text-[12px] text-[#616161]">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Metric Columns (Internal Scroll Container) */}
          <div className="flex items-center flex-1 min-w-0 overflow-x-auto">
            {/* Orders */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[100px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Orders</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                {filteredOrders.length} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>

            {/* Total sales */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[130px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Total sales</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                Rs {filteredOrders.reduce((sum, o) => sum + (parseFloat(o.total.replace(/[^0-9.]/g, "")) || 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>

            {/* Items ordered */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[110px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Items ordered</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                {filteredOrders.reduce((sum, o) => sum + (parseInt(o.items) || 1), 0)} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>

            {/* Orders paid */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[110px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Orders paid</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                {filteredOrders.filter(o => o.payment === "Paid").length} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>

            {/* Orders fulfilled */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[120px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Orders fulfilled</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                {filteredOrders.filter(o => o.fulfillment === "Fulfilled").length} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>

            {/* Orders delivered */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[120px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Orders delivered</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                {filteredOrders.filter(o => o.delivery === "Delivered").length} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Main Table Card */}
      <div className="polaris-card relative overflow-visible">
        {/* Table Toolbar Controls (Always Visible, Matching Screenshot 2) */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white relative z-20 rounded-t-xl">
          <div className="flex items-center gap-2 flex-1 relative min-w-0">
            {/* Unified Search and Filter Bar (Matching Real Shopify Dashboard) */}
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
                  <div className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out">
                    {["All", "Unfulfilled", "Unpaid", "Open", "Archived"].map((view) => {
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
            {/* Separate Sort Popover Button (Left Side Next to Columns) */}
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

              {/* Floating Sort Menu Popover */}
              {isSortSubMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-[220px] bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-0.5 text-[13px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out max-h-[360px] overflow-y-auto">
                  <div className="text-[12px] font-semibold text-[#616161] px-2 py-1">Sort by</div>
                  {[
                    "Order", 
                    "Date", 
                    "Customer", 
                    "Total", 
                    "Fulfillment status", 
                    "Payment status", 
                    "Items"
                  ].map((colName) => {
                    const isSelected = (sortColumn === colName.toLowerCase() || (sortColumn === "id" && colName === "Order"));
                    return (
                      <button
                        key={colName}
                        onClick={() => {
                          handleSort(colName.toLowerCase() === "order" ? "id" : colName.toLowerCase());
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
                          <span>{colName}</span>
                        </div>
                        {isSelected && (
                          <span className="inline-flex items-center gap-0.5 bg-[#e4e5e7] text-[#616161] text-[10px] px-1 py-0.5 rounded font-medium">
                            <CornerDownLeft className="w-2.5 h-2.5" /> Enter
                          </span>
                        )}
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

            {/* Columns Customization Popover Button */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="polaris-table w-full">
            <colgroup>
              <col style={{ width: "36px" }} />
              <col style={{ width: "120px" }} />
              {isColVisible("date") && <col style={{ width: "130px" }} />}
              {isColVisible("customer") && <col style={{ width: "20%" }} />}
              {isColVisible("total") && <col style={{ width: "110px" }} />}
              {isColVisible("payment") && <col style={{ width: "130px" }} />}
              {isColVisible("fulfillment") && <col style={{ width: "140px" }} />}
              {isColVisible("items") && <col style={{ width: "90px" }} />}
              {isColVisible("deliveryMethod") && <col style={{ width: "130px" }} />}
              {isColVisible("tags") && <col style={{ width: "120px" }} />}
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
                      {/* Left Group: Bulk Action Buttons */}
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
                                  setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
                                  setIsBulkSelectionMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                              >
                                Select all {filteredOrders.length} on page
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

                        {/* 2. Print v */}
                        <div ref={bulkPrintRef} className="relative">
                          <button
                            onClick={() => setIsBulkPrintMenuOpen(!isBulkPrintMenuOpen)}
                            className="bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-[13px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs transition"
                          >
                            <span>Print</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
                          </button>

                          {isBulkPrintMenuOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out text-[13px] font-normal">
                              <button
                                onClick={() => {
                                  setIsBulkPrintMenuOpen(false);
                                  window.print();
                                }}
                                className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                              >
                                Print packing slips
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 3. Mark as v */}
                        <div ref={bulkMarkAsRef} className="relative">
                          <button
                            onClick={() => setIsBulkMarkAsMenuOpen(!isBulkMarkAsMenuOpen)}
                            className="bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-[13px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs transition"
                          >
                            <span>Mark as</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
                          </button>

                          {isBulkMarkAsMenuOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-40 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out text-[13px] font-normal">
                              {["Unfulfilled", "In progress", "Fulfilled", "On hold", "Delivered"].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    handleBulkMarkAs(opt);
                                    setIsBulkMarkAsMenuOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 4. Capture payments */}
                        <button
                          onClick={handleBulkCapturePayments}
                          className="bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-[13px] font-medium px-2.5 py-1 rounded-md shadow-2xs transition"
                        >
                          Capture payments
                        </button>

                        {/* 5. More actions (...) */}
                        <div ref={bulkMoreActionsRef} className="relative">
                          <button
                            onClick={() => setIsBulkMoreActionsMenuOpen(!isBulkMoreActionsMenuOpen)}
                            className="bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-[13px] font-medium px-2 py-1 rounded-md shadow-2xs transition flex items-center justify-center"
                          >
                            <MoreHorizontal className="w-4 h-4 text-[#303030]" />
                          </button>

                          {isBulkMoreActionsMenuOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ease-out divide-y divide-[#f1f2f4] text-[13px] font-normal">
                              <div className="py-0.5 space-y-0.5">
                                <button onClick={() => { handleBulkMarkAs("Request fulfillment"); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Request fulfillment</button>
                                <button onClick={() => { handleBulkMarkAs("Cancel fulfillment requests"); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Cancel fulfillment requests</button>
                                <button onClick={() => { handleBulkMarkAs("Change fulfillment location"); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Change fulfillment location</button>
                              </div>
                              <div className="py-0.5 space-y-0.5">
                                <button onClick={() => { handleBulkArchive(true); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Archive orders</button>
                                <button onClick={() => { handleBulkArchive(false); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Unarchive orders</button>
                                <button onClick={() => { handleBulkMarkAs("Cancel orders"); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Cancel orders</button>
                              </div>
                              <div className="py-0.5 space-y-0.5">
                                <button onClick={() => { handleShowToast("Tags added"); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Add tags</button>
                                <button onClick={() => { handleShowToast("Tags removed"); setIsBulkMoreActionsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">Remove tags</button>
                              </div>
                              <div className="py-1 space-y-0.5">
                                <div className="px-3 pt-1 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Apps</div>
                                <button onClick={() => { handleShowToast("Flow automation triggered"); setIsBulkMoreActionsMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium">
                                  <div className="w-4 h-4 rounded bg-[#008060] flex items-center justify-center text-white text-[10px] font-bold shrink-0">F</div>
                                  <span>Run Flow automation</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Group: Show all selected toggle switch */}
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-[12px] text-[#303030] font-medium cursor-pointer select-none">
                          <button
                            type="button"
                            onClick={() => setShowOnlySelected(!showOnlySelected)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              showOnlySelected ? "bg-[#1a1a1a]" : "bg-[#c9cccf]"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                showOnlySelected ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span>Show all selected</span>
                        </label>
                      </div>
                    </div>
                  </th>
                </tr>
              ) : (
                /* Regular Column Headers Row (Matching h-[44px] height of bulk action row) */
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
                      Order {renderSortIndicator("id")}
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
                  {isColVisible("total") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle text-left" onClick={() => handleSort("total")}>
                      Total {renderSortIndicator("total")}
                    </th>
                  )}
                  {isColVisible("payment") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("payment")}>
                      Payment status {renderSortIndicator("payment")}
                    </th>
                  )}
                  {isColVisible("fulfillmentStatus") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("fulfillment")}>
                      Fulfillment status {renderSortIndicator("fulfillment")}
                    </th>
                  )}
                  {isColVisible("items") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("items")}>
                      Items {renderSortIndicator("items")}
                    </th>
                  )}
                  {isColVisible("delivery") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("delivery")}>
                      Delivery status {renderSortIndicator("delivery")}
                    </th>
                  )}
                  {isColVisible("method") && (
                    <th className="px-3 py-1.5 cursor-pointer hover:text-[#1a1a1a] transition h-[44px] align-middle" onClick={() => handleSort("method")}>
                      Delivery method {renderSortIndicator("method")}
                    </th>
                  )}

                </tr>
              )}
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                /* Empty state matching real Shopify screenshot 2 */
                <tr className="bg-white">
                  <td colSpan={100} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-6">
                      <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-[#616161] stroke-[1.25]" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">No orders found</h3>
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
                filteredOrders.map((order, idx) => {
                const selected = isRowSelected(order.id);
                return (
                  <tr
                    key={order.id}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest("input, button, a, label")) return;
                      router.push(`/admin/orders/${order.id.replace('#', '')}`);
                    }}
                    className={`border-b border-[#f1f1f1] h-[34px] transition cursor-pointer ${
                      selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                    }`}
                  >
                    <td className="pl-3 pr-1 py-1 align-middle text-left">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => { }}
                        onClick={(e) => handleRowCheckboxClick(e, idx, order.id)}
                        className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                      />
                    </td>
                    {isColVisible("id") && (
                      <td className="pl-1 pr-3 py-1 font-medium text-[#1a1a1a]">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/admin/orders/${order.id.replace('#', '')}`} className="hover:underline font-semibold text-[#1a1a1a]">
                            {order.id}
                          </Link>
                          {order.alert && <ShieldAlert className="w-3.5 h-3.5 text-[#c5221f] shrink-0" />}
                        </div>
                      </td>
                    )}
                    {isColVisible("date") && <td className="px-3 py-1 text-[#616161]">{order.date}</td>}
                    {isColVisible("customer") && <td className="px-3 py-1 text-[#1a1a1a] hover:underline cursor-pointer">{order.customer}</td>}
                    {isColVisible("total") && <td className="px-3 py-1 text-[#1a1a1a] font-medium text-left">{order.total}</td>}
                    {isColVisible("payment") && (
                      <td className="px-3 py-1">
                        <div className="flex gap-1.5 items-center">
                          <Badge
                            variant={order.payment === "Payment pending" ? "warning" : "neutral"}
                            icon={order.payment === "Payment pending" ? "ring" : "square"}
                          >
                            {order.payment}
                          </Badge>
                          {order.due && <Badge variant="danger" icon="none">Due</Badge>}
                        </div>
                      </td>
                    )}
                    {isColVisible("fulfillmentStatus") && (
                      <td className="px-3 py-1">
                        <Badge variant="neutral" icon="square">{order.fulfillment}</Badge>
                      </td>
                    )}
                    {isColVisible("items") && <td className="px-3 py-1 text-[#616161]">{order.items}</td>}
                    {isColVisible("delivery") && (
                      <td className="px-3 py-1">
                        {order.delivery ? <Badge variant="neutral" icon="circle">{order.delivery}</Badge> : null}
                      </td>
                    )}
                    {isColVisible("method") && <td className="px-3 py-1 text-[#616161]">{order.method}</td>}
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
        orders={orders}
        filteredOrders={filteredOrders}
        selectedIds={selectedIds}
        hasSearchOrFilter={searchQuery.trim() !== "" || activeFilters.length > 0}
      />

      {/* 1. Bottom-Center Dark Toast Banner (Matching Screenshot - Black Pill) */}
      {darkToastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#000000] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-medium border border-[#262626] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span>{darkToastMessage}</span>
          <button
            onClick={() => setDarkToastMessage(null)}
            className="text-[#8c8c8c] hover:text-white transition p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Bottom-Right Progress Notification Card (Matching Screenshot - White Floating Card) */}
      {actionNotification && (
        <div className="fixed bottom-5 right-5 z-50 w-[340px] bg-white border border-[#e1e3e5] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-[13px]">
          {/* Card Header */}
          <div className="px-4 py-3 bg-white border-b border-[#f1f2f4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {actionNotification.status === "in_progress" ? (
                <Loader2 className="w-4 h-4 text-[#616161] animate-spin shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-[#059669] shrink-0" />
              )}
              <span className="text-[13px] font-semibold text-[#1a1a1a]">
                {actionNotification.title}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActionNotification(null)}
                className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Body Progress Row */}
          <div className="px-4 py-3.5 bg-white flex items-center justify-between text-[#303030]">
            <div className="flex items-center gap-2.5 min-w-0">
              {actionNotification.status === "in_progress" ? (
                <div className="w-3.5 h-3.5 rounded-full border border-[#8c8c8c] shrink-0" />
              ) : (
                <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              )}
              <span className="truncate">{actionNotification.label}</span>
            </div>
            <span className="text-[#616161] text-[12px] font-mono shrink-0 ml-2">
              {actionNotification.count} of {actionNotification.total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
