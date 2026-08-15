"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductExportItem {
  id: number | string;
  name: string;
  status: string;
  inventory: string;
  category: string;
  channels: string;
  type: string;
  vendor: string;
  created?: string;
  updated?: string;
}

interface ExportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductExportItem[];
  filteredProducts: ProductExportItem[];
  selectedIds: Set<any> | (string | number)[];
  hasSearchOrFilter: boolean;
}

export function ExportProductsModal({
  isOpen,
  onClose,
  products,
  filteredProducts,
  selectedIds,
  hasSearchOrFilter,
}: ExportProductsModalProps) {
  const [exportScope, setExportScope] = useState<
    "current_page" | "all" | "selected" | "matching"
  >("current_page");
  const [exportFormat, setExportFormat] = useState<"excel_csv" | "plain_csv">(
    "excel_csv"
  );

  if (!isOpen) return null;

  const selectedCount = selectedIds instanceof Set ? selectedIds.size : selectedIds.length;
  const isSelected = (id: any) => (selectedIds instanceof Set ? selectedIds.has(id) : selectedIds.includes(id));

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

  const handleExportProducts = () => {
    let datasetToExport: ProductExportItem[] = [];

    if (exportScope === "current_page") {
      datasetToExport = filteredProducts.slice(0, 50);
    } else if (exportScope === "all") {
      datasetToExport = products;
    } else if (exportScope === "selected") {
      datasetToExport = products.filter((p) => isSelected(p.id));
    } else if (exportScope === "matching") {
      datasetToExport = filteredProducts;
    }

    if (datasetToExport.length === 0) {
      datasetToExport = products;
    }

    const headers = [
      "ID",
      "Title",
      "Status",
      "Inventory",
      "Category",
      "Channels",
      "Type",
      "Vendor",
      "Created",
      "Updated",
    ];

    const rows = datasetToExport.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.status,
      `"${p.inventory}"`,
      `"${p.category}"`,
      p.channels,
      `"${p.type}"`,
      `"${p.vendor}"`,
      `"${p.created || ""}"`,
      `"${p.updated || ""}"`,
    ]);

    const csvContent =
      (exportFormat === "excel_csv" ? "\uFEFF" : "") +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    triggerDownload("products_export.csv", csvContent);
    onClose();
  };

  const handleInventoryCsvDownload = () => {
    const headers = ["Title", "SKU", "Inventory Qty"];
    const rows = products.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `SKU-${p.id}`,
      p.inventory.replace(/[^0-[#1a1a1a]9-]/g, "") || "0",
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\r\n"
    );
    triggerDownload("inventory_export.csv", csvContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-[560px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header matching Orders Export popup */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Export products</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body matching Orders Export popup structure */}
        <div className="p-6 space-y-6 text-[14px]">
          {/* Subtitle Notice */}
          <p className="text-[#303030] leading-normal text-[13.5px]">
            This CSV file can update all product information. To update just inventory quantities use the{" "}
            <button
              type="button"
              onClick={handleInventoryCsvDownload}
              className="text-[#005bd3] hover:underline font-normal cursor-pointer text-left inline"
            >
              CSV file for inventory
            </button>
            .
          </p>

          {/* Export Section */}
          <div>
            <span className="block text-[13px] font-medium text-[#303030] mb-2.5">Export</span>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                <input
                  type="radio"
                  name="product_export_scope"
                  value="current_page"
                  checked={exportScope === "current_page"}
                  onChange={() => setExportScope("current_page")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                />
                <span>Current page</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                <input
                  type="radio"
                  name="product_export_scope"
                  value="all"
                  checked={exportScope === "all"}
                  onChange={() => setExportScope("all")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                />
                <span>All products</span>
              </label>

              <label
                className={`flex items-center gap-3 text-[13.5px] ${
                  selectedCount > 0
                    ? "cursor-pointer text-[#1a1a1a]"
                    : "cursor-not-allowed text-[#8c8c8c] opacity-60"
                }`}
              >
                <input
                  type="radio"
                  name="product_export_scope"
                  value="selected"
                  disabled={selectedCount === 0}
                  checked={exportScope === "selected"}
                  onChange={() => selectedCount > 0 && setExportScope("selected")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a] disabled:opacity-40"
                />
                <span>Selected: {selectedCount} products</span>
              </label>

              <label
                className={`flex items-center gap-3 text-[13.5px] ${
                  hasSearchOrFilter
                    ? "cursor-pointer text-[#1a1a1a]"
                    : "cursor-not-allowed text-[#8c8c8c] opacity-60"
                }`}
              >
                <input
                  type="radio"
                  name="product_export_scope"
                  value="matching"
                  disabled={!hasSearchOrFilter}
                  checked={exportScope === "matching"}
                  onChange={() => hasSearchOrFilter && setExportScope("matching")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a] disabled:opacity-40"
                />
                <span>50+ products matching your search</span>
              </label>
            </div>
          </div>

          {/* Export as Section */}
          <div>
            <span className="block text-[13px] font-medium text-[#303030] mb-2.5">Export as</span>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer text-[#1a1a1a] text-[13.5px]">
                <input
                  type="radio"
                  name="product_export_format"
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
                  name="product_export_format"
                  value="plain_csv"
                  checked={exportFormat === "plain_csv"}
                  onChange={() => setExportFormat("plain_csv")}
                  className="w-4 h-4 text-[#1a1a1a] border-gray-300 focus:ring-[#1a1a1a] accent-[#1a1a1a]"
                />
                <span>Plain CSV file</span>
              </label>
            </div>
          </div>

          {/* Learn More Text */}
          <p className="text-[13px] text-[#303030] pt-1">
            Learn more about{" "}
            <a
              href="https://help.shopify.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#005bd3] hover:underline"
            >
              exporting products to CSV file
            </a>{" "}
            or the{" "}
            <a
              href="https://help.shopify.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#005bd3] hover:underline"
            >
              bulk editor
            </a>
            .
          </p>
        </div>

        {/* Footer matching Orders Export popup */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e1e3e5] bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-lg shadow-2xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExportProducts}
            className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-white shrink-0" />
            <span>Export products</span>
          </button>
        </div>
      </div>
    </div>
  );
}
