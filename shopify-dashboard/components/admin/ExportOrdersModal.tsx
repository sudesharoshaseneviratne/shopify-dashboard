"use client";

import { useState } from "react";
import { X, Upload, Check } from "lucide-react";

export interface OrderExportItem {
  id: string;
  date: string;
  customer: string;
  channel: string;
  total: string;
  payment: string;
  fulfillment: string;
  items: string;
  delivery?: string;
  method?: string;
  status: string;
}

interface ExportOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderExportItem[] | any[];
  filteredOrders: OrderExportItem[] | any[];
  selectedIds: Set<any> | (string | number)[];
  hasSearchOrFilter: boolean;
  title?: string;
  itemLabel?: string;
}

export function ExportOrdersModal({
  isOpen,
  onClose,
  orders,
  filteredOrders,
  selectedIds,
  hasSearchOrFilter,
  title = "Export orders",
  itemLabel = "orders",
}: ExportOrdersModalProps) {
  const [exportScope, setExportScope] = useState<
    "current_page" | "all" | "selected" | "matching" | "date"
  >("current_page");
  const [exportFormat, setExportFormat] = useState<"excel_csv" | "plain_csv">(
    "excel_csv"
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCount = selectedIds instanceof Set ? selectedIds.size : selectedIds.length;
  const isSelected = (id: any) => (selectedIds instanceof Set ? selectedIds.has(id) : selectedIds.includes(id));
  const matchingCount = filteredOrders.length;

  const triggerDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportOrders = () => {
    let datasetToExport: any[] = [];

    if (exportScope === "current_page") {
      datasetToExport = filteredOrders.slice(0, 10);
    } else if (exportScope === "all") {
      datasetToExport = orders;
    } else if (exportScope === "selected") {
      datasetToExport = orders.filter((o) => isSelected(o.id));
    } else if (exportScope === "matching") {
      datasetToExport = filteredOrders;
    } else if (exportScope === "date") {
      datasetToExport = orders;
    }

    if (datasetToExport.length === 0) {
      datasetToExport = orders;
    }

    const headers = [
      "ID",
      "Customer",
      "Date",
      "Total",
      "Status",
    ];

    const rows = datasetToExport.map((order) => [
      order.id,
      order.customer || "No customer",
      order.date || "",
      order.total || "",
      order.status || order.payment || "",
    ]);

    const csvContent =
      (exportFormat === "excel_csv" ? "\uFEFF" : "") +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const formatLabel = exportFormat === "excel_csv" ? "Excel CSV" : "Plain CSV";
    triggerDownload(`${itemLabel}_export_${new Date().toISOString().split("T")[0]}.csv`, csvContent);

    showToast(`Exported ${datasetToExport.length} ${itemLabel} as ${formatLabel}`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleExportHistory = () => {
    const headers = ["ID", "Date", "Customer", "Total", "Status"];
    const rows = orders.map((o) => [o.id, o.date, o.customer, o.total, o.payment || o.status]);
    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

    triggerDownload(`export_history_${new Date().toISOString().split("T")[0]}.csv`, csvContent);
    showToast("Exported history");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-[560px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast inside modal if active */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 bg-[#eefaf6] border border-[#a7f3d0] rounded-lg text-[13px] text-[#065f46] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#059669]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-6 text-[14px]">
          {/* Section 1: Export */}
          <div>
            <span className="block text-[13px] font-medium text-[#303030] mb-2.5">Export</span>
            <div className="space-y-2.5">
              {/* Option: Current page */}
              <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                <input
                  type="radio"
                  name="exportScope"
                  value="current_page"
                  checked={exportScope === "current_page"}
                  onChange={() => setExportScope("current_page")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                />
                <span>Current page</span>
              </label>

              {/* Option: All items */}
              <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                <input
                  type="radio"
                  name="exportScope"
                  value="all"
                  checked={exportScope === "all"}
                  onChange={() => setExportScope("all")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                />
                <span>All {itemLabel}</span>
              </label>

              {/* Option: Selected items */}
              <label
                className={`flex items-center gap-3 text-[13.5px] ${
                  selectedCount > 0
                    ? "cursor-pointer text-[#1a1a1a]"
                    : "cursor-not-allowed text-[#8c8c8c] opacity-60"
                }`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  value="selected"
                  disabled={selectedCount === 0}
                  checked={exportScope === "selected"}
                  onChange={() => selectedCount > 0 && setExportScope("selected")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a] disabled:opacity-40"
                />
                <span>Selected: {selectedCount} {itemLabel}</span>
              </label>

              {/* Option: Items matching search */}
              <label
                className={`flex items-center gap-3 text-[13.5px] ${
                  hasSearchOrFilter
                    ? "cursor-pointer text-[#1a1a1a]"
                    : "cursor-not-allowed text-[#8c8c8c] opacity-60"
                }`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  value="matching"
                  disabled={!hasSearchOrFilter}
                  checked={exportScope === "matching"}
                  onChange={() => hasSearchOrFilter && setExportScope("matching")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a] disabled:opacity-40"
                />
                <span>
                  {matchingCount} {matchingCount === 1 ? itemLabel.replace(/s$/, '') : itemLabel} matching your search
                </span>
              </label>

              {/* Option: Items by date */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                  <input
                    type="radio"
                    name="exportScope"
                    value="date"
                    checked={exportScope === "date"}
                    onChange={() => setExportScope("date")}
                    className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                  />
                  <span>{itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} by date</span>
                </label>

                {exportScope === "date" && (
                  <div className="ml-7 pt-1 flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="px-2.5 py-1 text-[13px] border border-[#c9cccf] rounded-md text-[#303030] focus:outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                    <span className="text-[13px] text-[#616161]">to</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="px-2.5 py-1 text-[13px] border border-[#c9cccf] rounded-md text-[#303030] focus:outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Export as */}
          <div>
            <span className="block text-[13px] font-medium text-[#303030] mb-2.5">Export as</span>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                <input
                  type="radio"
                  name="exportFormat"
                  value="excel_csv"
                  checked={exportFormat === "excel_csv"}
                  onChange={() => setExportFormat("excel_csv")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                />
                <span>CSV for Excel, Numbers, or other spreadsheet programs</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                <input
                  type="radio"
                  name="exportFormat"
                  value="plain_csv"
                  checked={exportFormat === "plain_csv"}
                  onChange={() => setExportFormat("plain_csv")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                />
                <span>Plain CSV file</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-white border-t border-[#e1e3e5]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-[13px] font-medium border border-[#c9cccf] rounded-lg bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExportHistory}
            className="px-3.5 py-1.5 text-[13px] font-medium border border-[#c9cccf] rounded-lg bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition"
          >
            Export transaction histories
          </button>

          <button
            type="button"
            onClick={handleExportOrders}
            className="px-3.5 py-1.5 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-lg shadow-2xs transition flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Export orders</span>
          </button>
        </div>
      </div>
    </div>
  );
}
