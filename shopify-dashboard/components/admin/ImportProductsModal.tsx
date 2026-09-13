"use client";

import { useState, useRef } from "react";
import { X, Plus, FileText, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseProductCsv, getSampleProductsCsv, type ParsedProductRow } from "@/lib/csv";
import { importProductsAction } from "@/app/actions/products";

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
  const [parsedProducts, setParsedProducts] = useState<ParsedProductRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please upload a valid .csv file.");
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);
    setErrorMessage(null);
    setParseErrors([]);
    setParsedProducts([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = parseProductCsv(text);

        setParsedProducts(result.products);
        setParseErrors(result.errors);
        setTotalRows(result.totalRows);

        if (result.products.length === 0) {
          setErrorMessage(
            result.errors.length > 0
              ? result.errors[0]
              : "No valid products found in the uploaded CSV file."
          );
        }
      } catch (err) {
        console.error("CSV parse error:", err);
        setErrorMessage("Failed to parse CSV file. Please verify the format.");
      } finally {
        setIsParsing(false);
      }
    };

    reader.onerror = () => {
      setErrorMessage("Failed to read the file. Please try again.");
      setIsParsing(false);
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setParsedProducts([]);
    setParseErrors([]);
    setTotalRows(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (parsedProducts.length === 0 || isUploading) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const res = await importProductsAction(parsedProducts);

      if (res.success) {
        if (onImportSuccess) {
          onImportSuccess(res.importedCount);
        }
        handleResetFile();
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to import products. Please try again.");
      }
    } catch (err) {
      console.error("Import error:", err);
      setErrorMessage("An unexpected error occurred during import.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = getSampleProductsCsv();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_products_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-[620px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Import products by CSV</h2>
            <p className="text-[12px] text-[#616161] mt-0.5">
              Upload a CSV file containing your product details to bulk add them.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />

          {/* Upload Dropzone */}
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border border-dashed border-[#c9cccf] hover:border-[#005bd3] rounded-xl p-8 flex flex-col items-center justify-center min-h-[160px] bg-[#fafbfb] hover:bg-white transition cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-10 h-10 rounded-full bg-[#f1f2f4] group-hover:bg-[#ebf5fa] flex items-center justify-center mb-3 transition">
                <Plus className="w-5 h-5 text-[#616161] group-hover:text-[#005bd3] transition" />
              </div>
              <span className="text-[13px] font-semibold text-[#1a1a1a] mb-1">
                Click to upload or drag and drop
              </span>
              <span className="text-[12px] text-[#616161]">
                CSV files only (up to 10MB)
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected File Card */}
              <div className="flex items-center gap-3 bg-[#f6f6f7] p-3.5 rounded-lg border border-[#e1e3e5] justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-[#e4e5e7] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#005bd3]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-[11px] text-[#616161]">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {totalRows} total row{totalRows !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetFile}
                  disabled={isUploading}
                  className="p-1.5 text-[#616161] hover:text-red-600 rounded hover:bg-[#e4e5e7] transition cursor-pointer disabled:opacity-50"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Parsing Indicator */}
              {isParsing && (
                <div className="flex items-center gap-2 text-[13px] text-[#616161] py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#005bd3]" />
                  <span>Reading and validating CSV data...</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[12.5px]">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              {/* Parsed Summary & Preview */}
              {!isParsing && parsedProducts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-[13px] font-semibold text-[#1a1a1a]">
                        {parsedProducts.length} product{parsedProducts.length !== 1 ? "s" : ""} ready to import
                      </span>
                    </div>
                    {parseErrors.length > 0 && (
                      <span className="text-[11.5px] text-amber-600 font-medium">
                        {parseErrors.length} row{parseErrors.length !== 1 ? "s" : ""} skipped
                      </span>
                    )}
                  </div>

                  {/* Preview Table */}
                  <div className="border border-[#e1e3e5] rounded-lg overflow-hidden">
                    <div className="bg-[#f6f6f7] px-3 py-2 text-[11px] font-semibold text-[#616161] uppercase tracking-wider grid grid-cols-12 gap-2 border-b border-[#e1e3e5]">
                      <span className="col-span-5">Product Title</span>
                      <span className="col-span-3">Category</span>
                      <span className="col-span-2 text-right">Price</span>
                      <span className="col-span-2 text-center">Status</span>
                    </div>
                    <div className="divide-y divide-[#f1f2f4] max-h-48 overflow-y-auto">
                      {parsedProducts.slice(0, 5).map((p, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 text-[12px] text-[#1a1a1a] grid grid-cols-12 gap-2 items-center hover:bg-[#fafafa]"
                        >
                          <div className="col-span-5 flex flex-col min-w-0">
                            <span className="font-medium truncate" title={p.name}>
                              {p.name}
                            </span>
                            {p.sku && (
                              <span className="text-[10px] text-[#8c8c8c] truncate font-mono">
                                SKU: {p.sku}
                              </span>
                            )}
                          </div>
                          <span className="col-span-3 text-[#616161] truncate" title={p.category}>
                            {p.category}
                          </span>
                          <span className="col-span-2 text-right font-medium">
                            LKR {p.priceUsd.toFixed(2)}
                          </span>
                          <span className="col-span-2 flex justify-center">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                                p.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              )}
                            >
                              {p.status}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                    {parsedProducts.length > 5 && (
                      <div className="bg-[#fafbfb] px-3 py-1.5 text-[11.5px] text-[#616161] text-center border-t border-[#e1e3e5]">
                        + {parsedProducts.length - 5} more products in file
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
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
              disabled={isUploading}
              className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-lg shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={parsedProducts.length === 0 || isUploading || isParsing}
              onClick={handleImport}
              className={cn(
                "px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition shadow-2xs flex items-center gap-2",
                parsedProducts.length > 0 && !isUploading && !isParsing
                  ? "bg-[#1a1a1a] hover:bg-[#303030] text-white cursor-pointer"
                  : "bg-[#e4e5e7] text-[#a1a1a1] cursor-not-allowed"
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                `Import ${parsedProducts.length > 0 ? `${parsedProducts.length} product${parsedProducts.length !== 1 ? "s" : ""}` : "products"}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
