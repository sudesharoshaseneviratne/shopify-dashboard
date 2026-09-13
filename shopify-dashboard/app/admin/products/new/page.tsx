"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Plus, 
  Edit2, 
  Info, 
  Settings, 
  Check, 
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  List,
  Code,
  Sparkles,
  Lock,
  X,
  Share2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CollectionModal } from "@/components/admin/CollectionModal";
import { ProductIcon } from "@shopify/polaris-icons";
import { createProductAction } from "@/app/actions/products";
import { getAdminCollectionsAction } from "@/app/actions/collections";
import { uploadProductImageAction } from "@/app/actions/upload";

export default function AddProductPage() {
  const router = useRouter();

  // Main Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Books & Workbooks");
  const [availableCollections, setAvailableCollections] = useState<string[]>([
    "Books & Workbooks",
    "Tech & Electronics",
    "Stationery & Office",
    "School Essentials",
    "Novelties & Gifts"
  ]);

  useEffect(() => {
    getAdminCollectionsAction().then((cols) => {
      if (cols && cols.length > 0) {
        setAvailableCollections(cols.map((c) => c.title));
        setCategory(cols[0].title);
      }
    }).catch((err) => console.error("Failed to load collections in new product:", err));
  }, []);
  const [price, setPrice] = useState("0.00");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [chargeTax, setChargeTax] = useState(true);
  const [costPerItem, setCostPerItem] = useState("");
  
  // Inventory States
  const [trackInventory, setTrackInventory] = useState(true);
  const [quantity, setQuantity] = useState("0");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [continueSelling, setContinueSelling] = useState(false);

  // Shipping States
  const [isPhysicalProduct, setIsPhysicalProduct] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState("Store default • Sample box - 22 × 13.7 × 4.2 cm, 0 kg");
  const [productWeight, setProductWeight] = useState("0.0");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [countryOrigin, setCountryOrigin] = useState("");
  const [hsCode, setHsCode] = useState("");

  // Organization States
  const [selectedStatus, setSelectedStatus] = useState<"Active" | "Draft">("Active");
  const [productType, setProductType] = useState("None");
  const [vendor, setVendor] = useState("None");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [themeTemplate, setThemeTemplate] = useState("Default product");

  // Modals & Expandable Section States
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  const [isPricePillExpanded, setIsPricePillExpanded] = useState(false);
  const [isInventoryPillExpanded, setIsInventoryPillExpanded] = useState(false);
  const [isShippingPillExpanded, setIsShippingPillExpanded] = useState(false);

  // Active Pill Field Toggles inside Expandable Sections
  const [activePriceField, setActivePriceField] = useState<string | null>(null);
  const [activeInventoryField, setActiveInventoryField] = useState<string | null>(null);
  const [activeShippingField, setActiveShippingField] = useState<string | null>(null);

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Close status popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Image Upload State (Supabase Storage)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProvider, setUploadProvider] = useState<"supabase" | "cloudflare" | "local" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadProductImageAction(formData);

        if (res.success && res.url) {
          setUploadedImages((prev) => [...prev, res.url!]);
          if (res.provider) setUploadProvider(res.provider);
        } else {
          setUploadError(res.error || "Failed to upload image");
        }
      }
    } catch (err) {
      setUploadError(String(err));
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveError("Please enter a product title.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
      const parsedQty = parseInt(quantity, 10) || 0;
      const cleanCategory = category !== "Choose a product category" ? category : "Books & Workbooks";

      const res = await createProductAction({
        name: title.trim(),
        description: description.trim(),
        category: cleanCategory,
        priceUsd: parsedPrice,
        inventory: parsedQty,
        status: selectedStatus,
        tagline: description ? description.slice(0, 120) : undefined,
        images: uploadedImages,
      });

      if (res.success) {
        router.push("/admin/products");
      } else {
        setSaveError(res.error || "Failed to create product");
      }
    } catch (err) {
      setSaveError(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setIsAddingTag(false);
    }
  };

  return (
    <div className="space-y-4 font-sans pb-24 max-w-[1020px] mx-auto select-none text-[#1a1a1a]">
      {/* Top Header Breadcrumb & Title */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/products"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Products"
          >
            <ProductIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Add product</h1>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Main Column (~68%) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Card 1: Title & Description */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#1a1a1a]">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short sleeve t-shirt"
                className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/20 transition bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#1a1a1a]">Description</label>
              {/* Rich Text Editor Toolbar matching Screenshot 1 */}
              <div className="border border-[#c9cccf] rounded-xl overflow-hidden focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition">
                <div className="bg-[#fafafa] border-b border-[#e1e3e5] px-2.5 py-1.5 flex items-center gap-1.5 text-[13px] text-[#616161] flex-wrap">
                  {/* Sparkles AI button */}
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-purple-600 transition" title="Generate text">
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <span className="w-px h-4 bg-[#e1e3e5] mx-0.5" />
                  <select className="bg-transparent hover:bg-[#e4e5e7] rounded-md px-1.5 py-0.5 outline-none text-[12.5px] font-medium text-[#303030] cursor-pointer">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <span className="w-px h-4 bg-[#e1e3e5] mx-0.5" />
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030] font-bold"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030] italic"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030] underline"><Underline className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]">A ▾</button>
                  <span className="w-px h-4 bg-[#e1e3e5] mx-0.5" />
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]"><List className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]"><LinkIcon className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]"><ImageIcon className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]"><Video className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]">田 ▾</button>
                  <span className="w-px h-4 bg-[#e1e3e5] mx-0.5" />
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]">...</button>
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]"><Code className="w-3.5 h-3.5" /></button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full text-[13px] p-3.5 outline-none resize-y bg-white min-h-[140px]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Media (Supabase Storage) */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Media</h3>
              {uploadProvider === "supabase" ? (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Supabase Storage Active
                </span>
              ) : uploadProvider === "cloudflare" ? (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                  Cloudflare R2 Active
                </span>
              ) : null}
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Uploaded Images Preview Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 pb-2">
                {uploadedImages.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    className="relative group rounded-xl border border-[#e1e3e5] overflow-hidden aspect-square bg-slate-50 flex items-center justify-center shadow-2xs"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Product media ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-white">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border border-dashed border-[#c9cccf] rounded-2xl p-7 text-center bg-[#fafafa] flex flex-col items-center justify-center gap-2.5">
              {uploadError && (
                <p className="text-xs text-red-600 font-medium pb-1">{uploadError}</p>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 bg-white border border-[#c9cccf] text-[#1a1a1a] rounded-xl text-[13px] font-semibold shadow-2xs hover:bg-[#f6f6f7] transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploadingImage ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <span>Upload new</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 text-[#303030] hover:text-[#1a1a1a] rounded-xl text-[13px] font-medium transition cursor-pointer"
                >
                  Select from device
                </button>
              </div>
              <p className="text-[12px] text-[#616161]">
                Accepts PNG, JPG, WebP, SVG (Uploaded directly to Supabase &apos;products&apos; bucket)
              </p>
            </div>
          </div>

          {/* Card 3: Category */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Category</h3>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/20 bg-white text-[#303030] cursor-pointer"
              >
                <option>Choose a product category</option>
                <option>Books & Workbooks</option>
                <option>Tech & Electronics</option>
                <option>Stationery & Office</option>
                <option>School Essentials</option>
                <option>Novelties & Gifts</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#616161] absolute right-3 top-2.5 pointer-events-none" />
            </div>
            <p className="text-[12px] text-[#616161] pt-0.5">
              Determines product category, storefront placement, and filter catalog index
            </p>
          </div>

          {/* Card 4: Price matching Screenshot 2 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Price</h3>

            <div className="space-y-1">
              <div className="relative max-w-[220px]">
                <span className="absolute left-3 top-2 text-[12px] text-[#616161] font-medium">LKR</span>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-xl pl-12 pr-3.5 py-2 outline-none focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/20 bg-white font-medium text-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Expandable Pill Bar matching Screenshot 2 */}
            <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-2xl p-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setIsPricePillExpanded(true);
                    setActivePriceField("compareAt");
                  }}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[12.5px] font-medium transition cursor-pointer border",
                    activePriceField === "compareAt" || compareAtPrice
                      ? "bg-white border-[#c9cccf] text-[#1a1a1a] shadow-2xs"
                      : "bg-white border-transparent text-[#303030] hover:bg-[#e4e5e7]"
                  )}
                >
                  Compare-at
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPricePillExpanded(true);
                    setActivePriceField("unitPrice");
                  }}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[12.5px] font-medium transition cursor-pointer border",
                    activePriceField === "unitPrice" || unitPrice
                      ? "bg-white border-[#c9cccf] text-[#1a1a1a] shadow-2xs"
                      : "bg-white border-transparent text-[#303030] hover:bg-[#e4e5e7]"
                  )}
                >
                  Unit price
                </button>
                <button
                  type="button"
                  onClick={() => setChargeTax(!chargeTax)}
                  className="px-3 py-1 bg-white border border-transparent hover:border-[#c9cccf] rounded-xl text-[12.5px] font-medium text-[#303030] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Charge tax</span>
                  <span className="bg-[#e4e5e7] text-[#1a1a1a] text-[11px] px-1.5 py-0.2 rounded font-semibold">
                    {chargeTax ? "Yes" : "No"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPricePillExpanded(true);
                    setActivePriceField("costPerItem");
                  }}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[12.5px] font-medium transition cursor-pointer border",
                    activePriceField === "costPerItem" || costPerItem
                      ? "bg-white border-[#c9cccf] text-[#1a1a1a] shadow-2xs"
                      : "bg-white border-transparent text-[#303030] hover:bg-[#e4e5e7]"
                  )}
                >
                  Cost per item
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPricePillExpanded(!isPricePillExpanded)}
                className="p-1 rounded-lg text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform", isPricePillExpanded && "rotate-180")} />
              </button>
            </div>

            {/* Expanded Price Fields */}
            {isPricePillExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030] flex items-center gap-1">
                    Compare-at price
                    <HelpCircle className="w-3.5 h-3.5 text-[#616161]" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[12px] text-[#616161] font-medium">LKR</span>
                    <input
                      type="text"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-[13px] border border-[#c9cccf] rounded-xl pl-12 pr-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030]">Unit price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[12px] text-[#616161] font-medium">LKR</span>
                    <input
                      type="text"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-[13px] border border-[#c9cccf] rounded-xl pl-12 pr-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030]">Cost per item</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[12px] text-[#616161] font-medium">LKR</span>
                    <input
                      type="text"
                      value={costPerItem}
                      onChange={(e) => setCostPerItem(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-[13px] border border-[#c9cccf] rounded-xl pl-12 pr-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 5: Inventory matching Screenshot 2 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Inventory</h3>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-medium text-[#303030]">Inventory tracked</span>
                {/* Polaris Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setTrackInventory(!trackInventory)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5",
                    trackInventory ? "bg-[#1a1a1a]" : "bg-[#c9cccf]"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full transition-transform shadow-xs",
                      trackInventory ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Quantity Table Box matching Screenshot 2 */}
            <div className="border border-[#e1e3e5] rounded-2xl overflow-hidden bg-white text-[13px]">
              <div className="bg-[#f6f6f7] px-4 py-2 text-[12px] font-semibold text-[#616161] flex justify-between border-b border-[#e1e3e5]">
                <span>Quantity</span>
                <span>Quantity</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-[#1a1a1a]">135/79 Neelammahara Road</span>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-24 text-[13px] border border-[#c9cccf] rounded-xl px-3 py-1.5 text-center outline-none focus:border-[#005bd3] font-medium"
                />
              </div>
            </div>

            {/* Expandable Pill Bar matching Screenshot 2 */}
            <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-2xl p-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setIsInventoryPillExpanded(true);
                    setActiveInventoryField("sku");
                  }}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[12.5px] font-medium transition cursor-pointer border",
                    activeInventoryField === "sku" || sku
                      ? "bg-white border-[#c9cccf] text-[#1a1a1a] shadow-2xs"
                      : "bg-white border-transparent text-[#303030] hover:bg-[#e4e5e7]"
                  )}
                >
                  SKU
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInventoryPillExpanded(true);
                    setActiveInventoryField("barcode");
                  }}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[12.5px] font-medium transition cursor-pointer border",
                    activeInventoryField === "barcode" || barcode
                      ? "bg-white border-[#c9cccf] text-[#1a1a1a] shadow-2xs"
                      : "bg-white border-transparent text-[#303030] hover:bg-[#e4e5e7]"
                  )}
                >
                  Barcode
                </button>
                <button
                  type="button"
                  onClick={() => setContinueSelling(!continueSelling)}
                  className="px-3 py-1 bg-white border border-transparent hover:border-[#c9cccf] rounded-xl text-[12.5px] font-medium text-[#303030] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Sell when out of stock</span>
                  <span className="bg-[#e4e5e7] text-[#1a1a1a] text-[11px] px-1.5 py-0.2 rounded font-semibold">
                    {continueSelling ? "On" : "Off"}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsInventoryPillExpanded(!isInventoryPillExpanded)}
                className="p-1 rounded-lg text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform", isInventoryPillExpanded && "rotate-180")} />
              </button>
            </div>

            {/* Expanded Inventory Fields */}
            {isInventoryPillExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030]">SKU (Stock Keeping Unit)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030]">Barcode (ISBN, UPC, GTIN, etc.)</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 6: Shipping matching Screenshot 3 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Shipping</h3>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-medium text-[#303030]">Physical product</span>
                {/* Polaris Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsPhysicalProduct(!isPhysicalProduct)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5",
                    isPhysicalProduct ? "bg-[#1a1a1a]" : "bg-[#c9cccf]"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full transition-transform shadow-xs",
                      isPhysicalProduct ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {isPhysicalProduct && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[12px] font-medium text-[#303030] flex items-center gap-1">
                    Package <Info className="w-3.5 h-3.5 text-[#616161]" />
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="w-full appearance-none text-[13px] border border-[#c9cccf] rounded-xl pl-9 pr-8 py-2 outline-none focus:border-[#005bd3] bg-white text-[#303030] truncate"
                    >
                      <option>Store default • Sample box - 22 × 13.7 × 4.2 cm, 0 kg</option>
                    </select>
                    <Lock className="w-3.5 h-3.5 text-[#616161] absolute left-3 top-3 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-[#616161] absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030]">Product weight</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={productWeight}
                      onChange={(e) => setProductWeight(e.target.value)}
                      className="w-full text-[13px] border border-r-0 border-[#c9cccf] rounded-l-xl px-3 py-2 outline-none focus:border-[#005bd3] bg-white"
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="text-[13px] border border-[#c9cccf] rounded-r-xl px-2 py-2 outline-none bg-[#f6f6f7] text-[#303030] cursor-pointer"
                    >
                      <option>kg</option>
                      <option>lb</option>
                      <option>oz</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Expandable Pill Bar matching Screenshot 3 */}
            <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-2xl p-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setIsShippingPillExpanded(true);
                    setActiveShippingField("countryOrigin");
                  }}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[12.5px] font-medium transition cursor-pointer border",
                    activeShippingField === "countryOrigin" || countryOrigin
                      ? "bg-white border-[#c9cccf] text-[#1a1a1a] shadow-2xs"
                      : "bg-white border-transparent text-[#303030] hover:bg-[#e4e5e7]"
                  )}
                >
                  Country of origin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsShippingPillExpanded(true);
                    setActiveShippingField("hsCode");
                  }}
                  className={cn(
                    "px-3 py-1 rounded-xl text-[12.5px] font-medium transition cursor-pointer border",
                    activeShippingField === "hsCode" || hsCode
                      ? "bg-white border-[#c9cccf] text-[#1a1a1a] shadow-2xs"
                      : "bg-white border-transparent text-[#303030] hover:bg-[#e4e5e7]"
                  )}
                >
                  HS Code
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsShippingPillExpanded(!isShippingPillExpanded)}
                className="p-1 rounded-lg text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform", isShippingPillExpanded && "rotate-180")} />
              </button>
            </div>

            {/* Expanded Shipping Fields */}
            {isShippingPillExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030]">Country/Region of origin</label>
                  <input
                    type="text"
                    value={countryOrigin}
                    onChange={(e) => setCountryOrigin(e.target.value)}
                    placeholder="Select country"
                    className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#303030]">Harmonized System (HS) code</label>
                  <input
                    type="text"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="Search HS code"
                    className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 7: Variants matching Screenshot 3 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Variants</h3>
            <button
              type="button"
              className="w-full border border-[#c9cccf] rounded-xl p-3 text-left hover:bg-[#fafafa] transition cursor-pointer flex items-center gap-2 bg-white"
            >
              <div className="w-5 h-5 rounded-full border border-[#c9cccf] flex items-center justify-center text-[#616161]">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="text-[13px] font-medium text-[#303030]">Add options like size or color</span>
            </button>
          </div>

          {/* Card 8: Product metafields matching Screenshot 3 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Product metafields</h3>
              <button
                type="button"
                className="px-3 py-1.5 text-[12.5px] font-semibold border border-[#c9cccf] rounded-xl bg-white hover:bg-[#f6f6f7] text-[#303030] transition shadow-2xs cursor-pointer"
              >
                Add definition
              </button>
            </div>
            <div>
              <button
                type="button"
                className="bg-[#f6f6f7] border border-[#e1e3e5] text-[#303030] text-[12.5px] font-medium px-3 py-1 rounded-xl hover:bg-[#e4e5e7] transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#616161]" />
                <span>Disclosures</span>
              </button>
            </div>
          </div>

          {/* Card 9: Search engine listing matching Screenshot 3 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Search engine listing</h3>
              <button type="button" className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md transition cursor-pointer">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12.5px] text-[#616161]">
              Add a title and description to see how this product might appear in a search engine listing
            </p>
          </div>
        </div>

        {/* Right Sidebar Column (~32%) */}
        <div className="space-y-4">
          
          {/* Card 1: Status matching Screenshot 1 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2 relative" ref={statusDropdownRef}>
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Status</h3>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full flex items-center justify-between border border-[#c9cccf] rounded-xl px-3.5 py-2 bg-white text-[13px] text-[#303030] font-medium hover:bg-[#f6f6f7] transition cursor-pointer"
              >
                <span>{selectedStatus}</span>
                <ChevronDown className="w-4 h-4 text-[#616161]" />
              </button>

              {/* Popover */}
              {isStatusDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 flex flex-col gap-1 text-[13px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStatus("Active");
                      setIsStatusDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl transition flex flex-col gap-0.5 cursor-pointer",
                      selectedStatus === "Active" ? "bg-[#f1f2f4] font-semibold" : "hover:bg-[#f6f6f7]"
                    )}
                  >
                    <div className="flex items-center gap-2 text-[#1a1a1a]">
                      {selectedStatus === "Active" && <Check className="w-4 h-4 text-[#1a1a1a]" />}
                      <span>Active</span>
                    </div>
                    <div className="text-[11.5px] text-[#616161] pl-6">Sell via selected sales channels and markets</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStatus("Draft");
                      setIsStatusDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl transition flex flex-col gap-0.5 cursor-pointer",
                      selectedStatus === "Draft" ? "bg-[#f1f2f4] font-semibold" : "hover:bg-[#f6f6f7]"
                    )}
                  >
                    <div className="flex items-center gap-2 text-[#1a1a1a]">
                      {selectedStatus === "Draft" && <Check className="w-4 h-4 text-[#1a1a1a]" />}
                      <span>Draft</span>
                    </div>
                    <div className="text-[11.5px] text-[#616161] pl-6">Not visible on selected sales channels or markets</div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Publishing matching Screenshot 1 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Publishing</h3>
              <button type="button" className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md transition cursor-pointer">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[13px] font-medium text-[#303030] flex items-center gap-2 pt-1">
              <Users className="w-4 h-4 text-[#616161]" />
              <span>All channels</span>
            </div>
          </div>

          {/* Card 3: Product organization matching Screenshot 1 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between text-[13.5px] font-semibold text-[#1a1a1a]">
              <span>Product organization</span>
              <Info className="w-4 h-4 text-[#616161]" />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] bg-white text-[#303030] cursor-pointer"
                >
                  {availableCollections.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#616161] absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Type</label>
              <div className="relative">
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full appearance-none text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] bg-white text-[#303030] cursor-pointer"
                >
                  <option>None</option>
                  <option>Apparel</option>
                  <option>Book</option>
                  <option>Textbook</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#616161] absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Vendor</label>
              <div className="relative">
                <select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full appearance-none text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] bg-white text-[#303030] cursor-pointer"
                >
                  <option>None</option>
                  <option>Prasanthi Craft</option>
                  <option>Oxford Press</option>
                  <option>Pearson</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#616161] absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Collections</label>
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(true)}
                className="w-full text-left text-[13px] font-medium text-[#303030] border border-[#c9cccf] bg-white hover:bg-[#fafafa] rounded-xl px-3.5 py-2 transition flex items-center gap-2 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-[#c9cccf] flex items-center justify-center text-[#616161]">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span>Add collections</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Tags</label>
              {isAddingTag ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag();
                    }}
                    placeholder="Enter tag name"
                    autoFocus
                    className="w-full text-[13px] border border-[#005bd3] rounded-xl px-3 py-1.5 outline-none"
                  />
                  <button type="button" onClick={handleAddTag} className="p-1.5 bg-[#1a1a1a] text-white rounded-lg">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="w-full text-left text-[13px] font-medium text-[#303030] border border-[#c9cccf] bg-white hover:bg-[#fafafa] rounded-xl px-3.5 py-2 transition flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border border-[#c9cccf] flex items-center justify-center text-[#616161]">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Add tags</span>
                </button>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tags.map((t) => (
                    <span key={t} className="bg-[#f1f2f4] text-[#1a1a1a] text-[12px] px-2.5 py-1 rounded-xl font-medium flex items-center gap-1">
                      {t}
                      <X className="w-3 h-3 cursor-pointer text-[#616161] hover:text-[#1a1a1a]" onClick={() => setTags(tags.filter((tag) => tag !== t))} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Theme template matching Screenshot 2 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Theme template</h3>
            <div className="relative">
              <select
                value={themeTemplate}
                onChange={(e) => setThemeTemplate(e.target.value)}
                className="w-full appearance-none text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] bg-white text-[#303030] cursor-pointer"
              >
                <option>Default product</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#616161] absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#e1e3e5] px-6 py-3 flex items-center justify-between z-40">
        <div>
          {saveError && (
            <span className="text-xs text-red-600 font-medium">{saveError}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-1.5 border border-[#c9cccf] rounded-xl text-[13px] font-medium text-[#303030] hover:bg-[#f6f6f7] bg-white transition cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] disabled:opacity-50 text-white text-[13px] font-semibold rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-2"
          >
            {isSaving ? "Saving to Supabase..." : "Save"}
          </button>
        </div>
      </div>

      {/* Collection Modal Integration */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        mode="add"
        selectedCount={1}
        onClose={() => setIsCollectionModalOpen(false)}
        onSave={(collectionIds) => {
          setSelectedCollections(collectionIds);
          setIsCollectionModalOpen(false);
        }}
      />
    </div>
  );
}
