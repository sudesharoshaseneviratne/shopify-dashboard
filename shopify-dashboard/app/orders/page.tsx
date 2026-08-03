"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
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
  CornerDownLeft,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialOrders = [
  { id: "#1015", date: "Tuesday at 3:57 pm", customer: "Fathima Hirshard", channel: "Online Store", total: "Rs 2,060.00", payment: "Payment pending", paymentType: "warning", fulfillment: "Fulfilled", items: "1 item", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1014", date: "Jul 27 at 11:00 pm", customer: "Isuru Abeyrama", channel: "Online Store", total: "Rs 3,960.00", payment: "Payment pending", paymentType: "warning", fulfillment: "Fulfilled", items: "1 item", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1013", date: "Jul 27 at 7:54 pm", customer: "E. P. H. De Silva", channel: "Draft Orders", total: "Rs 2,436.00", payment: "Payment pending", paymentType: "warning", fulfillment: "Fulfilled", items: "1 item", delivery: "", method: "Custom", alert: true, due: true, status: "Open" },
  { id: "#1012", date: "Jul 21 at 4:54 pm", customer: "fathima Raihana", channel: "Online Store", total: "Rs 4,200.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1011", date: "Jul 21 at 8:46 am", customer: "Pradeepa Prasadini", channel: "Online Store", total: "Rs 8,560.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "2 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1010", date: "Jul 9 at 7:21 pm", customer: "Manjula Karunanayaka", channel: "Online Store", total: "Rs 4,392.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1009", date: "Jul 3 at 4:38 pm", customer: "Victoria Bloom", channel: "Online Store", total: "Rs 3,400.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1008", date: "Jun 16 at 11:26 am", customer: "Dihan Hettige", channel: "Online Store", total: "Rs 1,812.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "2 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1007", date: "Jun 12 at 6:19 am", customer: "Dahamsiri HA", channel: "Online Store", total: "Rs 12,324.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "3 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1006", date: "Apr 1 at 11:53 am", customer: "Thilini Premachandra", channel: "Online Store", total: "Rs 10,536.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "10 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1005", date: "Mar 6 at 1:17 pm", customer: "Isuru Weerasuriya", channel: "Online Store", total: "Rs 2,260.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1004", date: "Feb 6 at 12:51 pm", customer: "Kalpana de Silva", channel: "Online Store", total: "Rs 11,820.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "6 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1003", date: "Feb 3 at 10:56 pm", customer: "Imalka Nishadi", channel: "Online Store", total: "Rs 4,140.00", payment: "Paid", paymentType: "neutral", fulfillment: "Unfulfilled", items: "2 items", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1002", date: "Jan 28 at 2:41 pm", customer: "Zainab Fathima", channel: "Online Store", total: "Rs 2,220.00", payment: "Paid", paymentType: "neutral", fulfillment: "Unfulfilled", items: "1 item", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1001", date: "Dec 11 at 6:23 pm", customer: "Dileepa Wattegama", channel: "Online Store", total: "Rs 1,300.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
];

export default function Orders() {
  const {
    sortedData: orders,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(initialOrders, "id");

  // Popover States
  const [showAnalyticsBar, setShowAnalyticsBar] = useState(true);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Today");

  const [isViewsOpen, setIsViewsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredFilterIndex, setHoveredFilterIndex] = useState<number>(0);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ category: string; value: string }[]>([]);

  const applyFilter = (filterName: string) => {
    let defaultValue = "All";
    if (filterName === "Payment status") defaultValue = "Payment pending";
    else if (filterName === "Fulfillment status") defaultValue = "Unfulfilled";
    else if (filterName === "Order status") defaultValue = "Open";
    else if (filterName === "Delivery status") defaultValue = "Delivered";

    setActiveFilters(prev => {
      if (prev.some(f => f.category === filterName)) return prev;
      return [...prev, { category: filterName, value: defaultValue }];
    });
    setIsFilterOpen(false);
  };

  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isSortSubMenuOpen, setIsSortSubMenuOpen] = useState(false);
  const [hideArchived, setHideArchived] = useState(false);

  // Column Visibility state matching Screenshots 2 & 4
  const [columns, setColumns] = useState([
    { id: "id", label: "Order", visible: true },
    { id: "date", label: "Date", visible: true },
    { id: "customer", label: "Customer", visible: true },
    { id: "fulfillment", label: "Fulfill by", visible: true },
    { id: "channel", label: "Channel", visible: true },
    { id: "total", label: "Total", visible: true },
    { id: "payment", label: "Payment status", visible: true },
    { id: "fulfillmentStatus", label: "Fulfillment status", visible: true },
    { id: "items", label: "Items", visible: true },
    { id: "delivery", label: "Delivery status", visible: true },
    { id: "method", label: "Delivery method", visible: true },
    { id: "tags", label: "Tags", visible: true },
    { id: "destination", label: "Destination", visible: false },
    { id: "returnStatus", label: "Return status", visible: false },
    { id: "poNumber", label: "PO number", visible: false },
    { id: "labelStatus", label: "Label status", visible: false },
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

  // Full filter criteria list from Screenshots 1, 2, 3
  const filterCategories = [
    "Order status",
    "Payment status",
    "Fulfillment status",
    "Delivery status",
    "Return status",
    "Label status",
    "Chargeback and inquiry status",
    "Order total",
    "Delivery method",
    "Destination",
    "Address validation",
    "Number of items",
    "Total product weight",
    "Product",
    "Discount code",
    "App",
    "Channel",
    "B2B",
    "Payout action required",
    "Fraud risk",
    "Customer request",
    "Credit card (last 4 digits)",
    "Tagged with",
    "Date",
    "Fulfill by",
  ];

  // Dynamic filter logic for live UI table
  const filteredOrders = orders.filter((order) => {
    // Date Range Filter
    if (selectedDateRange === "Today") {
      if (!order.date.includes("Tuesday") && !order.date.includes("Today")) return false;
    } else if (selectedDateRange === "Last 7 days") {
      if (!order.date.includes("Tuesday") && !order.date.includes("Today") && !order.date.includes("Jul 27")) return false;
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
      const val = filter.value.toLowerCase();
      if (val === "all") continue;

      if (cat.includes("payment")) {
        if (!order.payment.toLowerCase().includes(val)) return false;
      } else if (cat.includes("fulfillment status")) {
        if (!order.fulfillment.toLowerCase().includes(val)) return false;
      } else if (cat.includes("order status")) {
        if (!order.status.toLowerCase().includes(val)) return false;
      } else if (cat.includes("delivery status")) {
        if (!order.delivery || !order.delivery.toLowerCase().includes(val)) return false;
      } else if (cat.includes("delivery method")) {
        if (!order.method.toLowerCase().includes(val)) return false;
      } else if (cat.includes("channel")) {
        if (!order.channel.toLowerCase().includes(val)) return false;
      } else if (cat.includes("customer")) {
        if (!order.customer.toLowerCase().includes(val)) return false;
      }
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
          <button className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition">
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

          <button className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition">
            Create order
          </button>
        </div>
      </div>

      {/* Metric Summary Card (Analytics Bar) */}
      {showAnalyticsBar && (
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-1.5 mb-3 shadow-2xs flex items-stretch relative overflow-x-auto">
          {/* Today Dropdown Button */}
          <div className="relative flex items-center pr-1">
            <button 
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="px-2.5 py-1.5 text-[13px] font-normal text-[#303030] flex items-center gap-1.5 hover:bg-[#f6f6f7] rounded-md transition"
            >
              <Calendar className="w-4 h-4 text-[#616161]" /> {selectedDateRange}
            </button>

            {/* Today Popover */}
            {isDateOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-[310px] bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-2 z-40 flex flex-col gap-1">
                {[
                  { name: "Today", desc: "Compared to yesterday up to current hour" },
                  { name: "Last 7 days", desc: "Compared to the previous 7 days" },
                  { name: "Last 30 days", desc: "Compared to the previous 30 days" },
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

          {/* Metric Columns */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Orders */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[110px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Orders</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                {filteredOrders.length} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>

            {/* Items ordered */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[110px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Items ordered</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                {filteredOrders.reduce((sum, o) => sum + (parseInt(o.items) || 1), 0)} <span className="font-normal text-[#616161] ml-0.5">—</span>
              </div>
            </div>

            {/* Sales reversals */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[130px]">
              <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Sales reversals</div>
              <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">
                LKR 0 <span className="font-normal text-[#616161] ml-0.5">—</span>
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

            {/* Order to fulfillment time */}
            <div className="px-4 py-1 border-l border-[#e1e3e5] flex-1 min-w-[230px] flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[#616161] border-b border-dashed border-[#a6a6a6] inline-block cursor-pointer">Order to fulfillment time</div>
                <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5 flex items-center gap-1.5">
                  <span>8.5 hours</span>
                  <span className="text-[12px] font-medium text-[#107c41] flex items-center gap-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-[#107c41]" /> 63%
                  </span>
                </div>
              </div>

              {/* Blue Sparkline Chart */}
              <svg className="w-20 h-6 text-[#38bdf8] shrink-0" viewBox="0 0 80 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 5 6 L 18 6 L 28 16 L 75 16" />
                <circle cx="75" cy="16" r="1.5" fill="#38bdf8" stroke="none" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="polaris-card overflow-visible">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white relative">
          <div className="flex items-center gap-2 flex-1 relative">
            {/* Views Button ("All ↕") */}
            <div className="relative">
              <button 
                onClick={() => setIsViewsOpen(!isViewsOpen)}
                className="px-2.5 py-1 text-[13px] font-medium bg-[#f1f2f4] text-[#1a1a1a] rounded-md flex items-center gap-1 hover:bg-[#e4e5e7] transition"
              >
                {selectedView} {selectedIds.size > 0 ? `(${selectedIds.size} selected)` : ""} <ArrowDownUp className="w-3 h-3 text-[#616161] ml-0.5" />
              </button>

              {/* Views Popover (Screenshot 2) */}
              {isViewsOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-[160px] bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-1 z-40 flex flex-col gap-0.5">
                  {["All", "Unfulfilled", "Unpaid", "Open", "Archived"].map((view) => {
                    const isSelected = selectedView === view;
                    return (
                      <button
                        key={view}
                        onClick={() => {
                          setSelectedView(view);
                          setIsViewsOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-[13px] transition",
                          isSelected ? "bg-[#f1f2f4] font-medium text-[#1a1a1a]" : "text-[#303030] hover:bg-[#f1f2f4]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 flex items-center justify-center shrink-0">
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                          </span>
                          <span>{view}</span>
                        </div>
                        {isSelected && <MoreHorizontal className="w-3.5 h-3.5 text-[#616161] hover:text-[#1a1a1a] cursor-pointer shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search and Filter Input Container */}
            <div className="relative flex-1 max-w-md flex items-center gap-1.5">
              {/* Active Filter Badges */}
              {activeFilters.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-[#e4e5e7] text-[#1a1a1a] text-[12px] px-2 py-0.5 rounded-md font-medium shrink-0">
                  <span>{f.category}: {f.value}</span>
                  <X 
                    className="w-3 h-3 text-[#616161] hover:text-[#1a1a1a] cursor-pointer" 
                    onClick={() => setActiveFilters(prev => prev.filter((_, idx) => idx !== i))}
                  />
                </span>
              ))}

              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#616161] absolute left-2.5 top-2.5 z-10" />
                <input
                  type="text"
                  placeholder="Search and filter"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFilterOpen(true)}
                  onBlur={() => setTimeout(() => setIsFilterOpen(false), 250)}
                  onKeyDown={(e) => {
                    if (!isFilterOpen) {
                      if (e.key === "ArrowDown") setIsFilterOpen(true);
                      return;
                    }
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHoveredFilterIndex((prev) => (prev + 1) % filterCategories.length);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHoveredFilterIndex((prev) => (prev - 1 + filterCategories.length) % filterCategories.length);
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      if (hoveredFilterIndex >= 0 && hoveredFilterIndex < filterCategories.length) {
                        applyFilter(filterCategories[hoveredFilterIndex]);
                      }
                    } else if (e.key === "Escape") {
                      setIsFilterOpen(false);
                    }
                  }}
                  className="w-full text-[13px] bg-white border border-[#c9cccf] rounded-md pl-8 pr-3 py-1 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] hover:border-[#a6a6a6] transition"
                />

                {/* Filter Options Popover */}
                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-[320px] max-h-[340px] overflow-y-auto bg-white border border-[#e1e3e5] rounded-xl shadow-xl py-1 z-40 flex flex-col">
                    {filterCategories.map((filterName, idx) => {
                      const isHovered = hoveredFilterIndex === idx;
                      return (
                        <button
                          key={filterName}
                          onMouseEnter={() => setHoveredFilterIndex(idx)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFilter(filterName);
                          }}
                          className={cn(
                            "flex items-center justify-between px-3 py-1.5 text-left text-[13px] transition",
                            isHovered ? "bg-[#f1f2f4] text-[#1a1a1a]" : "text-[#303030] hover:bg-[#f1f2f4]"
                          )}
                        >
                          <span>{filterName}</span>
                          {isHovered && (
                            <span className="inline-flex items-center gap-0.5 bg-[#e4e5e7] text-[#616161] text-[11px] px-1.5 py-0.5 rounded font-medium">
                              <CornerDownLeft className="w-3 h-3" /> Enter
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columns Popover Button */}
          <div className="relative">
            <button 
              onClick={() => setIsColumnsOpen(!isColumnsOpen)}
              className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-md border border-transparent transition"
            >
              <Columns className="w-4 h-4" />
            </button>

            {/* Columns Customization Popover (Screenshot 4) */}
            {isColumnsOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-[300px] max-h-[460px] overflow-y-auto bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-3 z-40 flex flex-col gap-2">
                {/* Sort by Header & Submenu trigger */}
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] relative">
                  <span className="text-[13px] font-medium text-[#303030] flex items-center gap-1">
                    <ArrowDownUp className="w-3.5 h-3.5 text-[#616161]" /> Sort by
                  </span>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setIsSortSubMenuOpen(!isSortSubMenuOpen)}
                      className="px-2 py-0.5 text-[12px] font-medium bg-[#f1f2f4] rounded flex items-center gap-1 hover:bg-[#e3e3e3] text-[#303030] transition"
                    >
                      {sortColumn === "total" ? "Total" : "Date"} <ArrowDownUp className="w-3 h-3 text-[#616161]" />
                    </button>

                    {/* Sort Sub-menu Popover (Screenshot 4) */}
                    {isSortSubMenuOpen && (
                      <div className="absolute top-0 right-full mr-1.5 w-[180px] bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-[13px]">
                        {["Order", "Date", "Customer", "Channel", "Total", "Fulfillment status", "Payment status", "Items"].map((colName) => {
                          const isSelected = (sortColumn === colName.toLowerCase());
                          return (
                            <button
                              key={colName}
                              onClick={() => {
                                handleSort(colName.toLowerCase());
                                setIsSortSubMenuOpen(false);
                              }}
                              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#f1f2f4] text-left text-[#303030] transition"
                            >
                              <span className="w-3.5 flex items-center justify-center">
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                              </span>
                              <span>{colName}</span>
                            </button>
                          );
                        })}
                        <div className="my-1 border-t border-[#e1e3e5]" />
                        <button
                          onClick={() => {
                            if (sortDirection !== "asc") handleSort(sortColumn || "id");
                            setIsSortSubMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#f1f2f4] text-left text-[#303030] transition"
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
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#f1f2f4] text-left text-[#303030] transition"
                        >
                          <span className="w-3.5 flex items-center justify-center">
                            {sortDirection === "desc" && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                          </span>
                          <span>Newest first</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hide archived toggle */}
                <div className="flex items-center justify-between py-1 border-b border-[#e1e3e5]">
                  <span className="text-[13px] font-medium text-[#303030] flex items-center gap-1.5">
                    <Inbox className="w-3.5 h-3.5 text-[#616161]" /> Hide archived
                  </span>
                  <button 
                    onClick={() => setHideArchived(!hideArchived)}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${hideArchived ? "bg-[#303030]" : "bg-[#c9cccf]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hideArchived ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* Columns Section */}
                <div className="text-[12px] font-semibold text-[#616161] mt-1">Columns</div>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="polaris-table">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#f7f7f7] select-none">
                <th className="px-3 py-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                  />
                </th>
                {isColVisible("id") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("id")}>
                    Order {renderSortIndicator("id")}
                  </th>
                )}
                {isColVisible("date") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("date")}>
                    Date ↓ {renderSortIndicator("date")}
                  </th>
                )}
                {isColVisible("customer") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("customer")}>
                    Customer {renderSortIndicator("customer")}
                  </th>
                )}
                {isColVisible("fulfillment") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("fulfillment")}>
                    Fulfill by {renderSortIndicator("fulfillment")}
                  </th>
                )}
                {isColVisible("channel") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("channel")}>
                    Channel {renderSortIndicator("channel")}
                  </th>
                )}
                {isColVisible("total") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("total")}>
                    Total {renderSortIndicator("total")}
                  </th>
                )}
                {isColVisible("payment") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("payment")}>
                    Payment status {renderSortIndicator("payment")}
                  </th>
                )}
                {isColVisible("fulfillmentStatus") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("fulfillment")}>
                    Fulfillment status {renderSortIndicator("fulfillment")}
                  </th>
                )}
                {isColVisible("items") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("items")}>
                    Items {renderSortIndicator("items")}
                  </th>
                )}
                {isColVisible("delivery") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("delivery")}>
                    Delivery status {renderSortIndicator("delivery")}
                  </th>
                )}
                {isColVisible("method") && (
                  <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("method")}>
                    Delivery method {renderSortIndicator("method")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => {
                const selected = isRowSelected(order.id);
                return (
                  <tr
                    key={order.id}
                    className={`border-b border-[#f1f1f1] h-[34px] transition ${selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                      }`}
                  >
                    <td className="px-3 py-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => { }}
                        onClick={(e) => handleRowCheckboxClick(e, idx, order.id)}
                        className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                      />
                    </td>
                    {isColVisible("id") && (
                      <td className="px-3 py-1 font-medium text-[#1a1a1a]">
                        <div className="flex items-center gap-1.5">
                          <span className="hover:underline cursor-pointer">{order.id}</span>
                          {order.alert && <ShieldAlert className="w-3.5 h-3.5 text-[#c5221f] shrink-0" />}
                        </div>
                      </td>
                    )}
                    {isColVisible("date") && <td className="px-3 py-1 text-[#616161]">{order.date}</td>}
                    {isColVisible("customer") && <td className="px-3 py-1 text-[#1a1a1a] hover:underline cursor-pointer">{order.customer}</td>}
                    {isColVisible("fulfillment") && <td className="px-3 py-1"></td>}
                    {isColVisible("channel") && <td className="px-3 py-1 text-[#616161]">{order.channel}</td>}
                    {isColVisible("total") && <td className="px-3 py-1 text-[#1a1a1a] font-medium">{order.total}</td>}
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Learn More link */}
      <div className="text-center my-6">
        <a href="#" className="text-[13px] text-[#303030] hover:underline font-normal transition">
          Learn more about orders
        </a>
      </div>
    </div>
  );
}
