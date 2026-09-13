"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Columns, 
  Search, 
  Check, 
  HelpCircle,
  ChevronDown,
  X,
  Plus,
  ArrowUpDown,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/admin/Badge";

import { 
  getBulkEditorProductsAction, 
  saveBulkEditorProductsAction, 
  type BulkProductItem 
} from "@/app/actions/products";

const sampleMediaFiles = [
  { id: "m1", name: "cover_73179_90401.JPG", type: "JPG", src: "/sample_cover_1.jpg", checked: true },
  { id: "m2", name: "Gemini_Generated_I...PNG", type: "PNG", src: "/sample_cover_2.jpg", checked: false },
  { id: "m3", name: "Cambridge_Edexcel...PNG", type: "PNG", src: "/sample_cover_3.jpg", checked: false },
  { id: "m4", name: "Gemini_Generated_I...PNG", type: "PNG", src: "/sample_cover_4.jpg", checked: false },
  { id: "m5", name: "Gemini_Generated_I...PNG", type: "PNG", src: "/sample_cover_5.jpg", checked: false },
  { id: "m6", name: "cover_52528_69268.JPG", type: "JPG", src: "/sample_cover_6.jpg", checked: false },
];

const statuses = ["Active", "Active", "Active", "Draft", "Unlisted", "Archived"];

interface ColumnField {
  key: string;
  label: string;
  disabled?: boolean;
}

interface ColumnGroup {
  category: string;
  fields: ColumnField[];
}

const columnGroups: ColumnGroup[] = [
  {
    category: "General",
    fields: [
      { key: "title", label: "Product title", disabled: true },
      { key: "description", label: "Description" },
      { key: "media", label: "Product media" },
      { key: "status", label: "Status" },
      { key: "type", label: "Product type" },
      { key: "vendor", label: "Vendor" },
    ],
  },
  {
    category: "Pricing",
    fields: [
      { key: "price", label: "Base price" },
      { key: "unitPrice", label: "Unit price" },
      { key: "comparePrice", label: "Compare-at price" },
    ],
  },
  {
    category: "Inventory",
    fields: [
      { key: "sku", label: "SKU" },
      { key: "barcode", label: "Barcode (ISBN, UPC, GTIN, etc.)" },
      { key: "available", label: "Inventory quantity" },
    ],
  },
  {
    category: "SEO",
    fields: [
      { key: "seoTitle", label: "Page title (SEO)" },
      { key: "seoDescription", label: "Meta description (SEO)" },
      { key: "seoHandle", label: "URL handle (SEO)" },
    ],
  },
];

const inventoryColumnGroups: ColumnGroup[] = [
  {
    category: "Inventory Details",
    fields: [
      { key: "title", label: "Product title", disabled: true },
      { key: "sku", label: "SKU" },
      { key: "binName", label: "Bin name" },
    ],
  },
  {
    category: "Quantities",
    fields: [
      { key: "available", label: "Available" },
      { key: "onHand", label: "On hand" },
      { key: "comm", label: "Committed" },
      { key: "unav", label: "Unavailable" },
      { key: "inc", label: "Incoming" },
    ],
  },
];

function StatusCell({
  status,
  onChange,
}: {
  status: string;
  onChange: (newStatus: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ["Active", "Archived", "Draft", "Unlisted"];

  return (
    <div ref={ref} className="relative w-full flex items-center justify-between px-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full hover:bg-[#f6f6f7] p-1 rounded-lg transition cursor-pointer text-left"
      >
        <Badge
          variant={
            status === "Active"
              ? "success"
              : status === "Draft"
              ? "draft"
              : status === "Unlisted"
              ? "unlisted"
              : "neutral"
          }
          icon="none"
        >
          {status}
        </Badge>
        {/* Double chevron ↕ icon */}
        <div className="flex flex-col items-center justify-center text-[#616161] ml-1 shrink-0">
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.5 6L8 2.5 11.5 6h-7zM4.5 10L8 13.5 11.5 10h-7z" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-40 bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 flex flex-col gap-0.5 text-[13px]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition cursor-pointer",
                opt === status
                  ? "bg-[#f1f2f4] text-[#1a1a1a]"
                  : "hover:bg-[#f6f6f7] text-[#303030]"
              )}
            >
              <span>{opt}</span>
              {opt === status && <Check className="w-4 h-4 text-[#1a1a1a]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Media Cell Popover matching reference Screenshots 1 & 2
function MediaCellPopover({
  productName,
  hasImage,
  imageSrc,
  onOpenSelectFileModal,
}: {
  productName: string;
  hasImage: boolean;
  imageSrc?: string;
  onOpenSelectFileModal: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full flex items-center px-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center gap-2 px-2 py-0.5 hover:bg-[#fafafa] transition cursor-pointer text-left rounded"
      >
        {hasImage && imageSrc ? (
          <div className="w-6 h-6 rounded border border-[#e1e3e5] bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
            <img src={imageSrc} alt="" className="w-full h-full object-cover" />
          </div>
        ) : hasImage ? (
          <div className="w-6 h-6 rounded border border-[#e1e3e5] bg-amber-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-amber-800">
            {productName.charAt(0)}
          </div>
        ) : (
          <div className="w-6 h-6 rounded border border-dashed border-[#c9cccf] bg-gray-50 flex items-center justify-center shrink-0">
            <ImageIcon className="w-3.5 h-3.5 text-[#8a8a8a]" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-80 bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-100 text-[13px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f1f1] mb-3">
            <h3 className="font-semibold text-[#1a1a1a] truncate max-w-[220px]" title={`Media: ${productName}`}>
              Media: {productName}
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          {hasImage ? (
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 border border-[#e1e3e5] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-2xs">
                {imageSrc ? (
                  <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-200 to-yellow-300 flex items-center justify-center text-xs font-semibold text-amber-900">
                    {productName.charAt(0)}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSelectFileModal();
                }}
                className="w-16 h-16 border border-dashed border-[#c9cccf] rounded-xl flex items-center justify-center cursor-pointer bg-[#fafafa] hover:bg-[#f1f2f4] text-[#616161] transition"
              >
                <Plus className="w-5 h-5 text-[#616161]" />
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-[#c9cccf] rounded-xl p-5 text-center bg-[#fafafa] flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSelectFileModal();
                  }}
                  className="px-3 py-1.5 bg-white border border-[#c9cccf] text-[#1a1a1a] rounded-lg text-[13px] font-medium shadow-2xs hover:bg-[#f6f6f7] transition cursor-pointer"
                >
                  Upload new
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSelectFileModal();
                  }}
                  className="px-3 py-1.5 text-[#303030] hover:text-[#1a1a1a] rounded-lg text-[13px] font-medium transition cursor-pointer"
                >
                  Select existing
                </button>
              </div>
              <p className="text-[12px] text-[#616161]">
                Accepts images, videos, or 3D models
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Select File Modal matching reference Screenshot 3 1:1
function SelectFileModal({
  isOpen,
  onClose,
  onDone,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [files, setFiles] = useState(sampleMediaFiles);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, checked: !f.checked } : f))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#1a1a1a] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e1e3e5] flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Select file</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 flex-1">
          {/* Top Controls: Search Bar & Filter Pills */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 flex items-center bg-white border border-[#c9cccf] rounded-xl px-3 py-2 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
                <Search className="w-4 h-4 text-[#616161] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search files"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none text-[13.5px] text-[#1a1a1a] bg-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 border border-[#c9cccf] rounded-xl text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] transition"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Sort</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 text-[13px]">
              {["File type", "File size", "Used in", "Product"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="flex items-center gap-1 px-3 py-1 border border-[#c9cccf] rounded-xl text-[#303030] hover:bg-[#f6f6f7] transition bg-white"
                >
                  <span>{filter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Upload Container */}
          <div className="border border-dashed border-[#c9cccf] rounded-2xl p-6 text-center bg-[#fafafa] flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#c9cccf] text-[#1a1a1a] rounded-lg text-[13px] font-medium shadow-2xs hover:bg-[#f6f6f7] transition cursor-pointer"
              >
                <span>Add media</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#c9cccf] text-[#1a1a1a] rounded-lg text-[13px] font-medium shadow-2xs hover:bg-[#f6f6f7] transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Generate image</span>
              </button>
            </div>
            <p className="text-[12.5px] text-[#616161]">
              Drag and drop images, videos, 3D models, and files
            </p>
          </div>

          {/* Files Cards Grid */}
          <div className="grid grid-cols-6 gap-4 pt-2">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => toggleCheck(file.id)}
                className={cn(
                  "flex flex-col items-center p-2 rounded-2xl border transition cursor-pointer relative bg-white group",
                  file.checked
                    ? "border-[#1a1a1a] bg-[#f4f6f8] ring-1 ring-[#1a1a1a]"
                    : "border-[#e1e3e5] hover:border-[#c9cccf]"
                )}
              >
                <input
                  type="checkbox"
                  checked={file.checked}
                  onChange={() => {}}
                  className="absolute top-3 left-3 rounded border-[#c9cccf] z-10 cursor-pointer"
                />
                <div className="w-full aspect-square rounded-xl bg-gradient-to-tr from-blue-200 via-indigo-100 to-green-200 mb-2 flex items-center justify-center overflow-hidden border border-[#e1e3e5]">
                  <span className="text-[11px] font-semibold text-gray-700">Media</span>
                </div>
                <span className="text-[11px] font-medium text-[#1a1a1a] truncate w-full text-center" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[10px] text-[#8a8a8a]">{file.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e1e3e5] bg-[#fafafa] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-[#c9cccf] rounded-lg text-[13px] font-medium text-[#303030] hover:bg-[#f6f6f7] bg-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDone}
            className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-[13px] font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const modeParam = searchParams.get("mode");
  const isInventoryMode = modeParam === "inventory";

  const currentColumnGroups = isInventoryMode ? inventoryColumnGroups : columnGroups;
  const allColumnFields = useMemo(
    () => currentColumnGroups.flatMap((group) => group.fields),
    [isInventoryMode]
  );

  const [products, setProducts] = useState<BulkProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Leave page confirmation modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Select File Modal state
  const [isSelectFileModalOpen, setIsSelectFileModalOpen] = useState(false);
  const [activeMediaProductId, setActiveMediaProductId] = useState<string | null>(null);

  // Excel Cell Focus & Editing State
  const [focusedCell, setFocusedCell] = useState<{ id: string; field: string } | null>(null);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);

  // Excel Vertical Drag-to-Fill Handle State (Column-only)
  const [isDraggingFill, setIsDraggingFill] = useState(false);
  const [fillStartCell, setFillStartCell] = useState<{
    rowIdx: number;
    colIdx: number;
    id: string;
    field: string;
    value: string;
  } | null>(null);
  const [fillCurrentCell, setFillCurrentCell] = useState<{ rowIdx: number; colIdx: number } | null>(null);

  // Columns Popover state
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [fieldSearchQuery, setFieldSearchQuery] = useState("");
  const columnsRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Active visible columns state
  const [activeColumns, setActiveColumns] = useState<Set<string>>(() => {
    if (isInventoryMode) {
      return new Set(["sku", "available", "onHand", "comm", "unav", "inc"]);
    }
    return new Set(["status", "price", "comparePrice", "sku", "barcode", "available"]);
  });

  // Active columns list for index calculation
  const activeFieldsList = useMemo(() => {
    return allColumnFields.filter(
      (f) => f.key === "title" || activeColumns.has(f.key)
    );
  }, [allColumnFields, activeColumns]);

  // Browser beforeunload prompt when trying to close/refresh tab with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isModified]);

  // Close columns popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnsRef.current && !columnsRef.current.contains(e.target as Node)) {
        setIsColumnsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real database products based on query param IDs (or all products if no ids)
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setIsLoading(true);
      try {
        const ids = idsParam
          ? idsParam.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined;
        const data = await getBulkEditorProductsAction(ids);
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products for bulk editor:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [idsParam]);

  // Dynamic Categories and Vendors based on loaded products
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category?.trim()).filter(Boolean)));
    const defaults = [
      "Cake Toppers",
      "Pipe cleaner products",
      "Happy birthday",
      "Valentine",
      "Christmas",
      "Anniversary",
      "Children's day",
      "New year",
      "Heart",
      "Father's day",
      "Butterfly",
      "Teacher's day",
      "Love",
      "Flower",
      "Vesak",
      "Animals",
      "Leaves",
      "Mother's day",
      "Cake box",
      "Boarder",
      "Couple",
      "General",
    ];
    return Array.from(new Set([...cats, ...defaults]));
  }, [products]);

  const availableVendors = useMemo(() => {
    const vens = Array.from(new Set(products.map((p) => p.vendor?.trim()).filter(Boolean)));
    const defaults = ["Prasanthi Craft"];
    return Array.from(new Set([...vens, ...defaults]));
  }, [products]);

  // Back button click handler
  const handleBackClick = () => {
    if (isModified) {
      setIsLeaveModalOpen(true);
    } else {
      router.push(isInventoryMode ? "/admin/products/inventory" : "/admin/products");
    }
  };

  // Field change handler
  const handleCellChange = (id: string, field: string, value: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === "title") {
          updated.name = value;
        }
        if (field === "type") {
          updated.category = value;
        } else if (field === "category") {
          updated.type = value;
        }
        return updated;
      })
    );
    setIsModified(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await saveBulkEditorProductsAction(products);
      if (res.success) {
        setIsModified(false);
        setToastMessage(`Saved ${res.count} product${res.count === 1 ? "" : "s"} successfully`);
      } else {
        setToastMessage(res.error || "Failed to save product changes");
      }
    } catch (err: any) {
      setToastMessage(err.message || "Failed to save product changes");
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const toggleColumnKey = (key: string) => {
    setActiveColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Keyboard Excel Shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!focusedCell) return;

      const isInputEditing = editingCell !== null;

      if (e.key === "Enter") {
        if (isInputEditing) {
          setEditingCell(null);
        } else {
          setEditingCell(focusedCell);
        }
        return;
      }

      if (e.key === "Escape") {
        setEditingCell(null);
        return;
      }

      if (isInputEditing) return;

      // Copy: Ctrl+C or Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        const prod = products.find((p) => p.id === focusedCell.id);
        if (prod) {
          const val =
            focusedCell.field === "title"
              ? prod.name
              : (prod as Record<string, any>)[focusedCell.field] || "";
          await navigator.clipboard.writeText(val);
          setToastMessage(`Copied "${val}" to clipboard`);
          setTimeout(() => setToastMessage(null), 2500);
        }
        return;
      }

      // Paste: Ctrl+V or Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        try {
          const text = await navigator.clipboard.readText();
          if (text !== undefined) {
            handleCellChange(focusedCell.id, focusedCell.field, text);
            setToastMessage(`Pasted "${text}" into cell`);
            setTimeout(() => setToastMessage(null), 2500);
          }
        } catch (err) {
          console.error("Clipboard paste error", err);
        }
        return;
      }

      // Arrow Keys Grid Navigation
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const currentRowIdx = products.findIndex((p) => p.id === focusedCell.id);
        const currentColIdx = activeFieldsList.findIndex((f) => f.key === focusedCell.field);

        if (currentRowIdx === -1 || currentColIdx === -1) return;

        let nextRow = currentRowIdx;
        let nextCol = currentColIdx;

        if (e.key === "ArrowUp") nextRow = Math.max(0, currentRowIdx - 1);
        if (e.key === "ArrowDown") nextRow = Math.min(products.length - 1, currentRowIdx + 1);
        if (e.key === "ArrowLeft") nextCol = Math.max(0, currentColIdx - 1);
        if (e.key === "ArrowRight") nextCol = Math.min(activeFieldsList.length - 1, currentColIdx + 1);

        setFocusedCell({
          id: products[nextRow].id,
          field: activeFieldsList[nextCol].key,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedCell, editingCell, products, activeFieldsList]);

  // Excel Vertical-Only Column Drag-to-Fill MouseUp Commit Handler (Applies to all editable columns including dropdowns)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingFill && fillStartCell && fillCurrentCell) {
        const startRow = Math.min(fillStartCell.rowIdx, fillCurrentCell.rowIdx);
        const endRow = Math.max(fillStartCell.rowIdx, fillCurrentCell.rowIdx);
        const targetField = fillStartCell.field;
        const valToCopy = fillStartCell.value;

        setProducts((prev) => {
          return prev.map((p, rIdx) => {
            if (rIdx >= startRow && rIdx <= endRow && targetField !== "title") {
              const updatedP = { ...p, [targetField]: valToCopy };
              if (targetField === "media" && valToCopy) {
                updatedP.hasImage = true;
              }
              return updatedP;
            }
            return p;
          });
        });

        setIsModified(true);
        setToastMessage(`Copied "${valToCopy}" to selected rows`);
        setTimeout(() => setToastMessage(null), 2500);
      }
      setIsDraggingFill(false);
      setFillStartCell(null);
      setFillCurrentCell(null);
    };

    if (isDraggingFill) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDraggingFill, fillStartCell, fillCurrentCell]);

  // Filtered Column Groups for Popover Search
  const filteredColumnGroups = useMemo(() => {
    if (!fieldSearchQuery.trim()) return columnGroups;
    const q = fieldSearchQuery.toLowerCase();
    return columnGroups
      .map((group) => ({
        ...group,
        fields: group.fields.filter(
          (f) =>
            f.label.toLowerCase().includes(q) ||
            group.category.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.fields.length > 0);
  }, [fieldSearchQuery]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans select-none text-[#1a1a1a] bg-white">
      {/* Top Fixed Header Bar */}
      <header className="h-[52px] shrink-0 bg-white border-b border-[#e1e3e5] px-4 flex items-center justify-between z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#303030] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-lg transition cursor-pointer"
          >
            {/* Exact Shopify Back Button Icon */}
            <svg className="w-4 h-4 text-[#616161] shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11Zm1.5 0v11c0 .01.008.018.018.018h11a.018.018 0 0 0 .018-.018v-11a.018.018 0 0 0-.018-.018h-11a.018.018 0 0 0-.018.018Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12.75 10a.75.75 0 0 1-.75.75H7.56l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 1.06L7.56 9.25h4.44a.75.75 0 0 1 .75.75Z" clipRule="evenodd" />
            </svg>
            <span>Back</span>
          </button>
          <div className="h-4 w-[1px] bg-[#e1e3e5]" />
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-[#1a1a1a]">
              {isLoading
                ? "Loading items..."
                : `Editing ${products.length} ${
                    isInventoryMode
                      ? products.length === 1
                        ? "inventory item"
                        : "inventory items"
                      : products.length === 1
                      ? "product"
                      : "products"
                  }`}
            </h1>
            {/* Unsaved Changes Badge matching Screenshot 1 */}
            {isModified && (
              <span className="bg-[#e4e5e7] text-[#303030] px-2.5 py-0.5 rounded-md text-[12px] font-medium animate-in fade-in duration-150">
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Columns Selector Dropdown */}
          <div ref={columnsRef} className="relative">
            <button
              type="button"
              onClick={() => setIsColumnsOpen(!isColumnsOpen)}
              className="flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-lg shadow-2xs transition cursor-pointer"
            >
              <Columns className="w-4 h-4 text-[#616161]" />
              <span>Columns</span>
            </button>

            {/* Categorized Columns Popover */}
            {isColumnsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col text-[13px] text-[#303030] animate-in fade-in-0 zoom-in-95 duration-150">
                {/* Search Bar */}
                <div className="p-3 border-b border-[#e1e3e5] bg-white sticky top-0 z-10">
                  <div className="relative flex items-center bg-white border border-[#c9cccf] rounded-lg px-2.5 py-1.5 focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition shadow-2xs">
                    <Search className="w-4 h-4 text-[#616161] mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search fields"
                      value={fieldSearchQuery}
                      onChange={(e) => setFieldSearchQuery(e.target.value)}
                      className="w-full outline-none text-[13px] text-[#1a1a1a] bg-transparent"
                    />
                  </div>
                </div>

                {/* Categorized Fields List */}
                <div className="px-3 py-2 max-h-[380px] overflow-y-auto flex flex-col gap-3">
                  {filteredColumnGroups.length === 0 ? (
                    <div className="py-6 text-center text-[#8a8a8a] text-[13px]">
                      No fields match "{fieldSearchQuery}"
                    </div>
                  ) : (
                    filteredColumnGroups.map((group) => (
                      <div key={group.category} className="flex flex-col gap-0.5">
                        <div className="text-[12px] font-semibold text-[#1a1a1a] pt-1 pb-0.5">
                          {group.category}
                        </div>
                        {group.fields.map((field) => (
                          <label
                            key={field.key}
                            className={cn(
                              "flex items-center gap-2.5 py-1 px-1 rounded-md select-none text-[13px]",
                              field.disabled
                                ? "opacity-50 cursor-not-allowed text-[#8a8a8a]"
                                : "hover:bg-[#f6f6f7] cursor-pointer text-[#303030]"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={field.disabled || activeColumns.has(field.key)}
                              disabled={field.disabled}
                              onChange={() => toggleColumnKey(field.key)}
                              className="rounded border-[#c9cccf] cursor-pointer disabled:cursor-not-allowed"
                            />
                            <span>{field.label}</span>
                          </label>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isModified || isSaving}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1 text-[13px] font-semibold rounded-lg shadow-2xs transition cursor-pointer",
              isModified && !isSaving
                ? "bg-[#1a1a1a] hover:bg-[#303030] text-white"
                : "bg-[#e4e5e7] text-[#8a8a8a] cursor-not-allowed"
            )}
          >
            {isSaving && (
              <div className="w-3 h-3 border-2 border-[#8a8a8a] border-t-[#1a1a1a] rounded-full animate-spin" />
            )}
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </header>

      {/* Main Bulk Editor Spreadsheet Grid Container */}
      <main ref={mainRef} className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto bulk-editor-scroll bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[350px] gap-3 text-[#616161]">
            <div className="w-8 h-8 border-2 border-[#005bd3] border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] font-medium text-[#303030]">Loading selected products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[350px] gap-4 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f4f6f8] border border-[#e1e3e5] flex items-center justify-center text-[#616161]">
              <Columns className="w-7 h-7 text-[#8a8a8a]" />
            </div>
            <div className="max-w-md">
              <h2 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">No products found to edit</h2>
              <p className="text-[13px] text-[#616161]">
                {idsParam
                  ? "None of the selected product IDs were found in your store database."
                  : "No products exist in your store database yet."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(isInventoryMode ? "/admin/products/inventory" : "/admin/products")}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-xl text-[13px] font-semibold transition cursor-pointer shadow-2xs"
            >
              Return to {isInventoryMode ? "Inventory" : "Products"}
            </button>
          </div>
        ) : (
          <table 
            className="border-collapse text-[13px] text-left border-b border-[#e1e3e5]"
            style={{ width: "max-content", minWidth: "100%" }}
          >
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#f7f7f7] border-b border-[#e1e3e5] h-[38px] text-[12.5px] font-medium text-[#616161] select-none">
                {allColumnFields.map((field) => {
                  if (field.key !== "title" && !activeColumns.has(field.key)) return null;

                  if (field.key === "title") {
                    return (
                      <th
                        key={field.key}
                        className="px-4 py-2 font-medium text-[#616161] min-w-[280px] w-[280px] border-r border-[#e1e3e5] sticky left-0 bg-[#f7f7f7] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.03)]"
                      >
                        Product title
                      </th>
                    );
                  }

                  return (
                    <th
                      key={field.key}
                      className="px-3 py-2 font-medium text-[#616161] min-w-[200px] w-[200px] border-r border-[#e1e3e5] whitespace-nowrap bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>{field.label}</span>
                        {(field.key === "category" || field.key === "type" || field.key === "available") && (
                          <HelpCircle className="w-3.5 h-3.5 text-[#8a8a8a]" />
                        )}
                        {field.key === "price" && (
                          <span className="text-[11px] text-[#8a8a8a] uppercase font-bold ml-auto">LKR</span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {products.map((product, productIdx) => (
                <tr
                  key={product.id}
                  className="border-b border-[#e1e3e5] h-[36px] hover:bg-[#fafafa] transition"
                >
                  {allColumnFields.map((field) => {
                    if (field.key !== "title" && !activeColumns.has(field.key)) return null;

                    const fieldIdx = activeFieldsList.findIndex((f) => f.key === field.key);

                    // Calculate if cell is in Vertical-Only Column Drag Selection
                    const isInFillSelection = isDraggingFill && fillStartCell && fillCurrentCell && (
                      fillStartCell.field === field.key &&
                      productIdx >= Math.min(fillStartCell.rowIdx, fillCurrentCell.rowIdx) &&
                      productIdx <= Math.max(fillStartCell.rowIdx, fillCurrentCell.rowIdx) &&
                      field.key !== "title"
                    );

                    // Product Title Cell (Mandatory)
                    if (field.key === "title") {
                      const isFocused = focusedCell?.id === product.id && focusedCell?.field === field.key;
                      const isEditing = editingCell?.id === product.id && editingCell?.field === field.key;
                      return (
                        <td
                          key={field.key}
                          onClick={() => setFocusedCell({ id: product.id, field: field.key })}
                          onDoubleClick={() => setEditingCell({ id: product.id, field: field.key })}
                          className={cn(
                            "px-3 py-1 border-r border-[#e1e3e5] align-middle bg-white sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] cursor-pointer select-none transition",
                            (isFocused || isEditing) && "outline outline-2 outline-[#005bd3] outline-offset-[-2px] bg-[#f4f6f8]"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-[280px]">
                            <div className="w-7 h-7 rounded border border-[#e1e3e5] bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                              {product.imageSrc ? (
                                <img src={product.imageSrc} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-[10px] font-bold text-gray-700">
                                  {product.name?.charAt(0) || "P"}
                                </div>
                              )}
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                autoFocus
                                value={product.name}
                                onChange={(e) => handleCellChange(product.id, "title", e.target.value)}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") setEditingCell(null);
                                }}
                                className="w-full border-none outline-none ring-0 bg-transparent text-[13px] font-semibold text-[#1a1a1a]"
                              />
                            ) : (
                              <span className="font-semibold text-[#1a1a1a] truncate" title={product.name}>
                                {product.name}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    }

                    // Product Media Cell
                    if (field.key === "media") {
                      const isFocused = focusedCell?.id === product.id && focusedCell?.field === field.key;
                      return (
                        <td
                          key={field.key}
                          onClick={() => setFocusedCell({ id: product.id, field: field.key })}
                          onMouseEnter={() => {
                            if (isDraggingFill) {
                              setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                            }
                          }}
                          className={cn(
                            "p-0 border-r border-[#e1e3e5] align-middle min-w-[200px] w-[200px] cursor-pointer transition relative h-[36px]",
                            isInFillSelection
                              ? "bg-[#005bd3]/10 border-2 border-dashed border-[#005bd3] z-20"
                              : isFocused
                              ? "outline outline-2 outline-[#005bd3] outline-offset-[-2px] bg-[#f4f6f8] z-10"
                              : "hover:bg-[#fafafa]"
                          )}
                        >
                          <MediaCellPopover
                            productName={product.name}
                            hasImage={product.hasImage}
                            imageSrc={product.imageSrc}
                            onOpenSelectFileModal={() => {
                              setActiveMediaProductId(product.id);
                              setIsSelectFileModalOpen(true);
                            }}
                          />

                          {/* Drag Fill Handle */}
                          {isFocused && (
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDraggingFill(true);
                                setFillStartCell({
                                  rowIdx: productIdx,
                                  colIdx: fieldIdx,
                                  id: product.id,
                                  field: field.key,
                                  value: product.media || "",
                                });
                                setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                              }}
                              className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-[#005bd3] border border-white cursor-s-resize z-30 shadow-2xs hover:scale-125 transition-transform"
                              title="Drag down to copy value to column rows"
                            />
                          )}
                        </td>
                      );
                    }

                    // Status Dropdown Cell
                    if (field.key === "status") {
                      const isFocused = focusedCell?.id === product.id && focusedCell?.field === field.key;
                      return (
                        <td
                          key={field.key}
                          onClick={() => setFocusedCell({ id: product.id, field: field.key })}
                          onMouseEnter={() => {
                            if (isDraggingFill) {
                              setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                            }
                          }}
                          className={cn(
                            "px-2 py-1 border-r border-[#e1e3e5] align-middle min-w-[170px] w-[170px] relative cursor-pointer",
                            isInFillSelection
                              ? "bg-[#005bd3]/10 border-2 border-dashed border-[#005bd3] z-20"
                              : isFocused && "outline outline-2 outline-[#005bd3] outline-offset-[-2px] bg-white z-10"
                          )}
                        >
                          <StatusCell
                            status={product.status}
                            onChange={(newStatus) => handleCellChange(product.id, "status", newStatus)}
                          />

                          {/* Drag Fill Handle */}
                          {isFocused && (
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDraggingFill(true);
                                setFillStartCell({
                                  rowIdx: productIdx,
                                  colIdx: fieldIdx,
                                  id: product.id,
                                  field: field.key,
                                  value: product.status,
                                });
                                setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                              }}
                              className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-[#005bd3] border border-white cursor-s-resize z-30 shadow-2xs hover:scale-125 transition-transform"
                              title="Drag down to copy value to column rows"
                            />
                          )}
                        </td>
                      );
                    }

                    // Product Category / Type Dropdown Cell
                    if (field.key === "category" || field.key === "type") {
                      const isFocused = focusedCell?.id === product.id && focusedCell?.field === field.key;
                      const currentCategory = product.category || product.type || availableCategories[0] || "General";
                      return (
                        <td
                          key={field.key}
                          onClick={() => setFocusedCell({ id: product.id, field: field.key })}
                          onMouseEnter={() => {
                            if (isDraggingFill) {
                              setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                            }
                          }}
                          className={cn(
                            "px-2 py-1 border-r border-[#e1e3e5] align-middle min-w-[200px] w-[200px] relative cursor-pointer",
                            isInFillSelection
                              ? "bg-[#005bd3]/10 border-2 border-dashed border-[#005bd3] z-20"
                              : isFocused && "outline outline-2 outline-[#005bd3] outline-offset-[-2px] bg-white z-10"
                          )}
                        >
                          <div className="relative flex items-center">
                            <select
                              value={currentCategory}
                              onChange={(e) => handleCellChange(product.id, field.key, e.target.value)}
                              className="w-full appearance-none bg-transparent outline-none cursor-pointer px-2 py-1 text-[13px] text-[#303030] hover:bg-[#f1f2f4] rounded transition"
                            >
                              {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                              {product.category && !availableCategories.includes(product.category) && (
                                <option value={product.category}>{product.category}</option>
                              )}
                            </select>
                            <ChevronDown className="w-3 h-3 text-[#616161] absolute right-2 pointer-events-none" />
                          </div>

                          {/* Drag Fill Handle */}
                          {isFocused && (
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDraggingFill(true);
                                setFillStartCell({
                                  rowIdx: productIdx,
                                  colIdx: fieldIdx,
                                  id: product.id,
                                  field: field.key,
                                  value: currentCategory,
                                });
                                setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                              }}
                              className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-[#005bd3] border border-white cursor-s-resize z-30 shadow-2xs hover:scale-125 transition-transform"
                              title="Drag down to copy value to column rows"
                            />
                          )}
                        </td>
                      );
                    }

                    // Vendor Dropdown Cell
                    if (field.key === "vendor") {
                      const isFocused = focusedCell?.id === product.id && focusedCell?.field === field.key;
                      const currentVendor = product.vendor || availableVendors[0] || "Prasanthi Craft";
                      return (
                        <td
                          key={field.key}
                          onClick={() => setFocusedCell({ id: product.id, field: field.key })}
                          onMouseEnter={() => {
                            if (isDraggingFill) {
                              setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                            }
                          }}
                          className={cn(
                            "px-2 py-1 border-r border-[#e1e3e5] align-middle min-w-[200px] w-[200px] relative cursor-pointer",
                            isInFillSelection
                              ? "bg-[#005bd3]/10 border-2 border-dashed border-[#005bd3] z-20"
                              : isFocused && "outline outline-2 outline-[#005bd3] outline-offset-[-2px] bg-white z-10"
                          )}
                        >
                          <div className="relative flex items-center">
                            <select
                              value={currentVendor}
                              onChange={(e) => handleCellChange(product.id, "vendor", e.target.value)}
                              className="w-full appearance-none bg-transparent outline-none cursor-pointer px-2 py-1 text-[13px] text-[#303030] hover:bg-[#f1f2f4] rounded transition"
                            >
                              {availableVendors.map((ven) => (
                                <option key={ven} value={ven}>
                                  {ven}
                                </option>
                              ))}
                              {product.vendor && !availableVendors.includes(product.vendor) && (
                                <option value={product.vendor}>{product.vendor}</option>
                              )}
                            </select>
                            <ChevronDown className="w-3 h-3 text-[#616161] absolute right-2 pointer-events-none" />
                          </div>

                          {/* Drag Fill Handle */}
                          {isFocused && (
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDraggingFill(true);
                                setFillStartCell({
                                  rowIdx: productIdx,
                                  colIdx: fieldIdx,
                                  id: product.id,
                                  field: field.key,
                                  value: currentVendor,
                                });
                                setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                              }}
                              className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-[#005bd3] border border-white cursor-s-resize z-30 shadow-2xs hover:scale-125 transition-transform"
                              title="Drag down to copy value to column rows"
                            />
                          )}
                        </td>
                      );
                    }

                    // Standard Text / Number Cells
                    const isFocused = focusedCell?.id === product.id && focusedCell?.field === field.key;
                    const isEditing = editingCell?.id === product.id && editingCell?.field === field.key;
                    const cellVal = (product as Record<string, any>)[field.key] || "";

                    return (
                      <td
                        key={field.key}
                        onClick={() => setFocusedCell({ id: product.id, field: field.key })}
                        onDoubleClick={() => setEditingCell({ id: product.id, field: field.key })}
                        onMouseEnter={() => {
                          if (isDraggingFill) {
                            setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                          }
                        }}
                        className={cn(
                          "p-0 border-r border-[#e1e3e5] align-middle min-w-[200px] w-[200px] select-none cursor-pointer transition relative h-[36px]",
                          isInFillSelection
                            ? "bg-[#005bd3]/10 border-2 border-dashed border-[#005bd3] z-20"
                            : isFocused || isEditing
                            ? "outline outline-2 outline-[#005bd3] outline-offset-[-2px] bg-white z-10"
                            : "hover:bg-[#fafafa]"
                        )}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            autoFocus
                            value={cellVal}
                            onChange={(e) => handleCellChange(product.id, field.key, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingCell(null);
                            }}
                            className="w-full h-full border-none outline-none ring-0 bg-transparent px-3 py-1.5 text-[13px] text-[#1a1a1a]"
                          />
                        ) : (
                          <div className="px-3 py-1.5 truncate text-[13px] text-[#1a1a1a] h-full flex items-center">
                            {cellVal || <span className="text-[#a1a1a1] italic text-[12px]">&mdash;</span>}
                          </div>
                        )}

                        {/* Drag Fill Handle */}
                        {isFocused && !isEditing && (
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsDraggingFill(true);
                              setFillStartCell({
                                rowIdx: productIdx,
                                colIdx: fieldIdx,
                                id: product.id,
                                field: field.key,
                                value: cellVal,
                              });
                              setFillCurrentCell({ rowIdx: productIdx, colIdx: fieldIdx });
                            }}
                            className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-[#005bd3] border border-white cursor-s-resize z-30 shadow-2xs hover:scale-125 transition-transform"
                            title="Drag down to copy value to column rows"
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Leave Page Confirmation Modal matching Screenshot 2 */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-[#1a1a1a] border border-[#e1e3e5] animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e1e3e5] flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Leave page with unsaved changes?</h2>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-[13.5px] text-[#616161]">
              Leaving this page will delete all unsaved changes.
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#e1e3e5] bg-[#fafafa] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="px-4 py-1.5 border border-[#c9cccf] rounded-xl text-[13px] font-medium text-[#303030] hover:bg-[#f6f6f7] bg-white transition cursor-pointer"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  router.push(isInventoryMode ? "/admin/products/inventory" : "/admin/products");
                }}
                className="px-4 py-1.5 bg-[#d82c0d] hover:bg-[#bc2200] text-white rounded-xl text-[13px] font-semibold transition cursor-pointer shadow-2xs"
              >
                Leave page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select File Modal matching Screenshot 3 */}
      <SelectFileModal
        isOpen={isSelectFileModalOpen}
        onClose={() => setIsSelectFileModalOpen(false)}
        onDone={() => {
          if (activeMediaProductId) {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === activeMediaProductId
                  ? { ...p, media: "1 image", hasImage: true }
                  : p
              )
            );
            setIsModified(true);
          }
          setIsSelectFileModalOpen(false);
          setToastMessage("Updated product media");
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-[#1a1a1a] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 z-50 text-[13.5px] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function BulkEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#616161]">Loading Bulk Editor...</div>}>
      <BulkEditorContent />
    </Suspense>
  );
}
