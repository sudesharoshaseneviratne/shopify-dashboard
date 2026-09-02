"use client";

import { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
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
  X,
  Users,
  ExternalLink,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CollectionModal } from "@/components/admin/CollectionModal";
import { ProductIcon } from "@shopify/polaris-icons";
import { Badge } from "@/components/admin/Badge";
import { 
  getAdminProductByIdAction, 
  updateProductAction, 
  deleteProductAction 
} from "@/app/actions/products";
import { getAdminCollectionsAction } from "@/app/actions/collections";
import { uploadProductImageAction } from "@/app/actions/upload";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const productId = resolvedParams.id;

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Main Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cold Storage");
  const [price, setPrice] = useState("0.00");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [costPerItem, setCostPerItem] = useState("");
  const [chargeTax, setChargeTax] = useState(true);
  
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
  const [selectedStatus, setSelectedStatus] = useState<"Active" | "Draft" | "Archived" | "Unlisted">("Active");
  const [productType, setProductType] = useState("General");
  const [vendor, setVendor] = useState("Satoshi DeFi");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [themeTemplate, setThemeTemplate] = useState("Default product");

  // Media
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals & Popovers
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
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

  const [availableCollections, setAvailableCollections] = useState<string[]>([
    "Cold Storage",
    "Mining & ASICs",
    "Sovereign Nodes",
    "Cryptographic Relics",
    "Security & Backup"
  ]);

  // Fetch product data on mount
  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const [data, cols] = await Promise.all([
          getAdminProductByIdAction(productId),
          getAdminCollectionsAction(),
        ]);

        if (cols && cols.length > 0) {
          setAvailableCollections(cols.map((c) => c.title));
        }

        if (!data) {
          setProductNotFound(true);
          return;
        }

        setTitle(data.name || "");
        setDescription(data.description || "");
        setCategory(data.category || (cols?.[0]?.title ?? "Cold Storage"));
        setPrice(data.priceFormatted || data.priceUsd?.toFixed(2) || "0.00");
        setCompareAtPrice(data.compareAtPrice || "");
        setQuantity(String(data.inventory ?? 0));
        setSelectedStatus(data.status || "Active");
        setUploadedImages(data.images || []);
        setProductType(data.productType || data.category || "General");
        setVendor(data.vendor || "Satoshi DeFi");
        setSku(data.id || "");
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProductNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

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
      setSaveSuccess(false);

      const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
      const parsedCompare = compareAtPrice ? parseFloat(compareAtPrice.replace(/[^0-9.]/g, "")) : undefined;
      const parsedQty = parseInt(quantity, 10) || 0;

      const res = await updateProductAction(productId, {
        name: title.trim(),
        description: description.trim(),
        category,
        priceUsd: parsedPrice,
        compareAtPrice: parsedCompare,
        inventory: parsedQty,
        status: selectedStatus,
        images: uploadedImages,
        vendor,
        tagline: description ? description.slice(0, 120) : undefined,
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(res.error || "Failed to update product");
      }
    } catch (err) {
      setSaveError(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteProductAction(productId);
      if (res.success) {
        router.push("/admin/products");
      } else {
        setSaveError(res.error || "Failed to delete product");
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      setSaveError(String(err));
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setIsAddingTag(false);
    }
  };

  // Pricing calculations
  const priceNum = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const costNum = parseFloat(costPerItem.replace(/[^0-9.]/g, "")) || 0;
  const profit = priceNum - costNum;
  const margin = priceNum > 0 && profit > 0 ? Math.round((profit / priceNum) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-[#616161] animate-spin" />
        <p className="text-[13px] text-[#616161] font-medium">Loading product details...</p>
      </div>
    );
  }

  if (productNotFound) {
    return (
      <div className="max-w-[600px] mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mx-auto text-[#616161]">
          <ProductIcon className="w-8 h-8 fill-current text-[#616161]" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1a1a1a]">Product not found</h2>
        <p className="text-[13px] text-[#616161]">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#303030] text-white text-[13px] font-semibold rounded-xl transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans pb-28 max-w-[1020px] mx-auto select-none text-[#1a1a1a]">
      {/* Top Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/admin/products"
            className="p-1.5 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer shrink-0"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5 text-[#616161]" />
          </Link>
          <h1 className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] truncate" title={title}>
            {title || "Untitled Product"}
          </h1>
          <Badge
            variant={
              selectedStatus === "Active"
                ? "success"
                : selectedStatus === "Draft"
                ? "draft"
                : selectedStatus === "Unlisted"
                ? "unlisted"
                : "neutral"
            }
            icon="none"
          >
            {selectedStatus}
          </Badge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View in store link button */}
          <Link
            href={`/store/products/${productId}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-xl transition shadow-2xs cursor-pointer"
            title="Preview product on storefront"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#616161]" />
            <span>View in store</span>
          </Link>

          {/* Delete action button */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition cursor-pointer"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Save button */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] disabled:opacity-50 text-white text-[13px] font-semibold rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Product updated successfully across dashboard and webstore.</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-2 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

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
                placeholder="Product title"
                className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/20 transition bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#1a1a1a]">Description</label>
              <div className="border border-[#c9cccf] rounded-xl overflow-hidden focus-within:border-[#005bd3] focus-within:ring-2 focus-within:ring-[#005bd3]/20 transition">
                <div className="bg-[#fafafa] border-b border-[#e1e3e5] px-2.5 py-1.5 flex items-center gap-1.5 text-[13px] text-[#616161] flex-wrap">
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
                  <button type="button" className="p-1 hover:bg-[#e4e5e7] rounded-md text-[#303030]"><Code className="w-3.5 h-3.5" /></button>
                </div>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product description..."
                  className="w-full text-[13px] p-3.5 outline-none resize-y min-h-[140px] text-[#1a1a1a] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Media */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Media</h3>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="text-[12.5px] font-medium text-[#005bd3] hover:underline cursor-pointer disabled:opacity-50"
              >
                {isUploadingImage ? "Uploading..." : "Add from URL or local"}
              </button>
            </div>

            {uploadError && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {uploadError}
              </div>
            )}

            {/* Existing Images Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {uploadedImages.map((imgUrl, idx) => (
                  <div key={`img-${idx}`} className="relative group rounded-xl border border-[#e1e3e5] overflow-hidden aspect-square bg-gray-50 flex items-center justify-center">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#c9cccf] hover:border-[#a6a6a6] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#fafafa] hover:bg-[#f6f6f7] transition"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-[#e1e3e5] flex items-center justify-center text-[#616161]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="text-[13px] font-semibold text-[#1a1a1a]">Upload new media</span>
                <span className="text-[13px] text-[#616161]"> or drag and drop files</span>
              </div>
              <span className="text-[11.5px] text-[#8c8c8c]">Accepts images, videos, or 3D models</span>
            </div>
          </div>

          {/* Card 3: Pricing */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Pricing</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-[#303030]">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[13px] text-[#616161]">$</span>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-[13px] border border-[#c9cccf] rounded-xl pl-7 pr-3 py-2 outline-none focus:border-[#005bd3] transition bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-[#303030]">Compare-at price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[13px] text-[#616161]">$</span>
                  <input
                    type="text"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-[13px] border border-[#c9cccf] rounded-xl pl-7 pr-3 py-2 outline-none focus:border-[#005bd3] transition bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f1f2f4] flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#303030]">
                <input
                  type="checkbox"
                  checked={chargeTax}
                  onChange={(e) => setChargeTax(e.target.checked)}
                  className="rounded border-[#c9cccf] cursor-pointer"
                />
                <span>Charge tax on this product</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#f1f2f4]">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#616161]">Cost per item</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[13px] text-[#616161]">$</span>
                  <input
                    type="text"
                    value={costPerItem}
                    onChange={(e) => setCostPerItem(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-[13px] border border-[#c9cccf] rounded-xl pl-7 pr-3 py-1.5 outline-none focus:border-[#005bd3] transition bg-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[12px] font-medium text-[#616161]">Profit</span>
                <div className="text-[13px] font-semibold text-[#1a1a1a] pt-1.5">
                  {priceNum > 0 ? `$${profit.toFixed(2)}` : "--"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[12px] font-medium text-[#616161]">Margin</span>
                <div className="text-[13px] font-semibold text-[#1a1a1a] pt-1.5">
                  {priceNum > 0 ? `${margin}%` : "--"}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Inventory */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Inventory</h3>

            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#303030]">
              <input
                type="checkbox"
                checked={trackInventory}
                onChange={(e) => setTrackInventory(e.target.checked)}
                className="rounded border-[#c9cccf] cursor-pointer"
              />
              <span>Track quantity</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-[#303030]">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3 py-2 outline-none focus:border-[#005bd3] transition bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-[#303030]">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. VLT-001"
                  className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3 py-2 outline-none focus:border-[#005bd3] transition bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-[#303030]">Barcode (ISBN, UPC)</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. 0123456789"
                  className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3 py-2 outline-none focus:border-[#005bd3] transition bg-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#303030] pt-2 border-t border-[#f1f2f4]">
              <input
                type="checkbox"
                checked={continueSelling}
                onChange={(e) => setContinueSelling(e.target.checked)}
                className="rounded border-[#c9cccf] cursor-pointer"
              />
              <span>Continue selling when out of stock</span>
            </label>
          </div>

          {/* Card 5: Shipping */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Shipping</h3>
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#303030]">
              <input
                type="checkbox"
                checked={isPhysicalProduct}
                onChange={(e) => setIsPhysicalProduct(e.target.checked)}
                className="rounded border-[#c9cccf] cursor-pointer"
              />
              <span>This is a physical product</span>
            </label>

            {isPhysicalProduct && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-semibold text-[#303030]">Weight</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productWeight}
                      onChange={(e) => setProductWeight(e.target.value)}
                      placeholder="0.0"
                      className="w-full text-[13px] border border-[#c9cccf] rounded-xl px-3 py-2 outline-none focus:border-[#005bd3] transition bg-white"
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="text-[13px] border border-[#c9cccf] rounded-xl px-3 py-2 bg-white cursor-pointer"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 6: Search Engine Listing Preview */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Search engine listing</h3>
            </div>
            <div className="pt-2 space-y-1">
              <div className="text-[14px] text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                {title || "Product Title"} — Satoshi DeFi
              </div>
              <div className="text-[12px] text-[#006621] truncate">
                https://satoshidefi.store/products/{productId}
              </div>
              <div className="text-[12.5px] text-[#545454] line-clamp-2">
                {description || "No description provided."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (~32%) */}
        <div className="space-y-4">
          
          {/* Card 1: Status */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2 relative" ref={statusDropdownRef}>
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Status</h3>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full flex items-center justify-between border border-[#c9cccf] rounded-xl px-3.5 py-2 bg-white text-[13px] text-[#303030] font-medium hover:bg-[#f6f6f7] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedStatus === "Active" ? "bg-emerald-500" : selectedStatus === "Draft" ? "bg-amber-500" : "bg-slate-400"
                  }`} />
                  <span>{selectedStatus}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#616161]" />
              </button>

              {/* Popover */}
              {isStatusDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-[13px]">
                  {(["Active", "Draft", "Unlisted", "Archived"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(st);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-2.5 rounded-xl transition flex flex-col gap-0.5 cursor-pointer",
                        selectedStatus === st ? "bg-[#f1f2f4] font-semibold" : "hover:bg-[#f6f6f7]"
                      )}
                    >
                      <div className="flex items-center gap-2 text-[#1a1a1a]">
                        {selectedStatus === st && <Check className="w-4 h-4 text-[#1a1a1a]" />}
                        <span>{st}</span>
                      </div>
                      <div className="text-[11.5px] text-[#616161] pl-6">
                        {st === "Active" && "Sell via selected sales channels and storefront"}
                        {st === "Draft" && "Hidden from storefront and sales channels"}
                        {st === "Unlisted" && "Accessible via direct link only"}
                        {st === "Archived" && "Permanently hidden from store catalog"}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Publishing */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Publishing</h3>
              <button type="button" className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md transition cursor-pointer">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[13px] font-medium text-[#303030] flex items-center gap-2 pt-1">
              <Users className="w-4 h-4 text-[#616161]" />
              <span>{selectedStatus === "Active" ? "Online Store & Channels" : "Not published"}</span>
            </div>
          </div>

          {/* Card 3: Product Organization */}
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
                  <option>General</option>
                  <option>Hardware Signer</option>
                  <option>ASIC Miner</option>
                  <option>Appliance</option>
                  <option>Apparel</option>
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
                  <option>Satoshi DeFi</option>
                  <option>Learnix LK</option>
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
                <span>{selectedCollections.length > 0 ? `${selectedCollections.length} collections` : "Add collections"}</span>
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

          {/* Card 4: Theme Template */}
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

          {/* Danger Zone: Delete Product Card */}
          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-[13.5px] font-semibold text-red-600">Delete product</h3>
            <p className="text-[12.5px] text-[#616161]">
              Permanently remove this product from the database and all sales channels.
            </p>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-[13px] font-semibold rounded-xl transition cursor-pointer"
            >
              Delete product
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#e1e3e5] px-6 py-3 flex items-center justify-between z-40">
        <div>
          {saveError && (
            <span className="text-xs text-red-600 font-medium">{saveError}</span>
          )}
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-medium">Changes saved successfully</span>
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
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e1e3e5] overflow-hidden">
            <div className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                Delete {title || "this product"}?
              </h3>
              <p className="text-[13px] text-[#616161]">
                This action cannot be undone. This will permanently remove the product from your store and inventory.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-[#fafafa] border-t border-[#e1e3e5] flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-1.5 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? "Deleting..." : "Delete product"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
