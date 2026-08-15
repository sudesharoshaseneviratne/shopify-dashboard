"use client";

import { useState, useRef } from "react";
import { X, Plus, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (count: number) => void;
}

export function ImportProductsModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportProductsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadAndPreview = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      if (onImportSuccess) {
        onImportSuccess(15);
      }
      setSelectedFile(null);
      onClose();
    }, 800);
  };

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Handle,Title,Body (HTML),Vendor,Category,Type,Tags,Published,Option1 Name,Option1 Value,SKU,Variant Grams,Variant Inventory Qty,Variant Price\r\nabacus-workbook,Abacus Year 2 Workbook 3,<p>Workbook description</p>,Learnix LK,Print Books,Workbook,books,true,Title,Default Title,SKU-001,300,10,3424.00";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_products_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-[560px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header matching Orders Export popup */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Import products by CSV</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body matching Orders Export popup */}
        <div className="p-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border border-dashed border-[#c9cccf] hover:border-[#005bd3] rounded-xl p-10 flex flex-col items-center justify-center min-h-[160px] bg-white transition cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="flex items-center gap-3 bg-[#f1f2f4] px-4 py-3 rounded-lg border border-[#e1e3e5] w-full max-w-sm justify-between">
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-5 h-5 text-[#005bd3] shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-[11px] text-[#616161]">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="p-1 text-[#616161] hover:text-red-600 rounded hover:bg-[#e4e5e7] transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] text-[#1a1a1a] text-[13px] font-medium px-3.5 py-1.5 rounded-lg shadow-2xs transition"
              >
                <Plus className="w-4 h-4 text-[#1a1a1a]" /> Add file
              </button>
            )}
          </div>
        </div>

        {/* Footer matching Orders Export popup */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e1e3e5] bg-white">
          <button
            type="button"
            onClick={handleDownloadSample}
            className="text-[13px] font-medium text-[#005bd3] hover:underline cursor-pointer"
          >
            Download sample CSV
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-lg shadow-2xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUploadAndPreview}
              className={cn(
                "px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition shadow-2xs",
                selectedFile && !isUploading
                  ? "bg-[#1a1a1a] hover:bg-[#303030] text-white cursor-pointer"
                  : "bg-[#e4e5e7] text-[#a1a1a1] cursor-not-allowed"
              )}
            >
              {isUploading ? "Uploading..." : "Upload and preview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
