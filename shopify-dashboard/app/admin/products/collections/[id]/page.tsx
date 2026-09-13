"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  Upload, 
  Plus, 
  Edit2, 
  Grid, 
  List, 
  SlidersHorizontal,
  X,
  Users,
  Eye,
  Tag,
  ExternalLink,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Check,
  Search
} from "lucide-react";
import { CollectionIcon, ProductIcon } from "@shopify/polaris-icons";
import { cn } from "@/lib/utils";
import { 
  getAdminCollectionByIdAction, 
  updateCollectionAction, 
  deleteCollectionAction 
} from "@/app/actions/collections";
import { getAdminProductsAction } from "@/app/actions/products";
import { uploadProductImageAction } from "@/app/actions/upload";

export default function CollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const collectionId = resolvedParams.id;

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [collectionNotFound, setCollectionNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Collection Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [collectionImage, setCollectionImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [assignedProducts, setAssignedProducts] = useState<Array<{ id: string; name: string; price: string; status: string; image?: string | null }>>([]);
  const [themeTemplate, setThemeTemplate] = useState("Default collection");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Add Products Modal States
  const [isAddProductsModalOpen, setIsAddProductsModalOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Array<{ id: string; name: string; price: string; status: string }>>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");

  // Load collection and all products
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [colData, allProds] = await Promise.all([
          getAdminCollectionByIdAction(collectionId),
          getAdminProductsAction(),
        ]);

        if (!colData) {
          setCollectionNotFound(true);
          return;
        }

        setTitle(colData.title);
        setDescription(colData.description || "");
        setSlug(colData.slug);
        setCollectionImage(colData.image);
        setAssignedProducts(colData.assignedProducts || []);

        setAvailableProducts(
          allProds.map((p) => ({
            id: p.id,
            name: p.name,
            price: `LKR ${p.rawPrice.toFixed(2)}`,
            status: p.status,
          }))
        );
      } catch (err) {
        console.error("Failed to load collection:", err);
        setCollectionNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [collectionId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadProductImageAction(formData);
      if (res.success && res.url) {
        setCollectionImage(res.url);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveProduct = (prodId: string) => {
    setAssignedProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  const handleToggleProduct = (prod: { id: string; name: string; price: string; status: string }) => {
    setAssignedProducts((prev) => {
      const exists = prev.some((p) => p.id === prod.id);
      if (exists) {
        return prev.filter((p) => p.id !== prod.id);
      } else {
        return [...prev, { ...prod, image: null }];
      }
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveError("Please enter a collection title.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const res = await updateCollectionAction(collectionId, {
        title: title.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        image: collectionImage || undefined,
        productIds: assignedProducts.map((p) => p.id),
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(res.error || "Failed to update collection");
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
      const res = await deleteCollectionAction(collectionId);
      if (res.success) {
        router.push("/admin/products/collections");
      } else {
        setSaveError(res.error || "Failed to delete collection");
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      setSaveError(String(err));
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-[#616161] animate-spin" />
        <p className="text-[13px] text-[#616161] font-medium">Loading collection details...</p>
      </div>
    );
  }

  if (collectionNotFound) {
    return (
      <div className="max-w-[600px] mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#f1f2f4] flex items-center justify-center mx-auto text-[#616161]">
          <CollectionIcon className="w-8 h-8 fill-current text-[#616161]" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1a1a1a]">Collection not found</h2>
        <p className="text-[13px] text-[#616161]">
          The collection you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/admin/products/collections"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#303030] text-white text-[13px] font-semibold rounded-xl transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
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
            href="/admin/products/collections"
            className="p-1.5 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer shrink-0"
            title="Back to Collections"
          >
            <ArrowLeft className="w-5 h-5 text-[#616161]" />
          </Link>
          <h1 className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] truncate" title={title}>
            {title || "Untitled Collection"}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View in store link button */}
          <Link
            href={`/store/products?category=${encodeURIComponent(title)}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-xl transition shadow-2xs cursor-pointer"
            title="Preview category on storefront"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#616161]" />
            <span>View in store</span>
          </Link>

          {/* Delete action button */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition cursor-pointer"
            title="Delete collection"
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
          <span>Collection updated successfully across dashboard and webstore.</span>
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
        {/* Left Column (~68%) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Image + Title + Description Header Card */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4 relative">
            <div className="flex gap-5 items-start">
              {/* Left Image Box */}
              <label className="w-36 h-36 border border-dashed border-[#c9cccf] rounded-2xl flex flex-col items-center justify-center bg-white hover:bg-[#fafafa] transition cursor-pointer shrink-0 relative group shadow-2xs overflow-hidden">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {collectionImage ? (
                  <img src={collectionImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-[#616161] group-hover:scale-110 transition" />
                )}
              </label>

              {/* Right Input Fields */}
              <div className="flex-1 space-y-2 pt-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Collection title"
                  className="w-full text-[20px] font-bold text-[#1a1a1a] placeholder:text-[#8a8a8a] border-b border-transparent focus:border-[#005bd3] outline-none py-0.5 bg-transparent"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  rows={3}
                  className="w-full text-[13.5px] text-[#303030] placeholder:text-[#8a8a8a] outline-none resize-y py-0.5 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Collection Items List */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Products in collection</h3>
                <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {assignedProducts.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductsModalOpen(true)}
                className="text-[13px] font-medium text-[#005bd3] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add products</span>
              </button>
            </div>

            {/* Products List / Grid */}
            {assignedProducts.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[#616161] border border-dashed border-[#c9cccf] rounded-xl">
                No products currently in this collection. Click &quot;Add products&quot; to assign products.
              </div>
            ) : (
              <div className="divide-y divide-[#f1f1f1] border border-[#e1e3e5] rounded-xl overflow-hidden">
                {assignedProducts.map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between bg-white hover:bg-[#fafafa] transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg border border-[#e1e3e5] bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ProductIcon className="w-5 h-5 fill-current text-[#8c8c8c]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#1a1a1a] truncate">{p.name}</div>
                        <div className="text-[12px] text-[#616161]">{p.price}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(p.id)}
                      className="p-1 text-[#616161] hover:text-red-600 rounded transition cursor-pointer"
                      title="Remove product from collection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Search Engine Listing Preview */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Search engine listing</h3>
            <div className="space-y-1 pt-1">
              <div className="text-[14px] text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                {title || "Collection Title"} — Prasanthi Craft
              </div>
              <div className="text-[12px] text-[#006621] truncate">
                https://prasanthicraft.com/products?category={encodeURIComponent(title)}
              </div>
              <div className="text-[12.5px] text-[#545454] line-clamp-2">
                {description || "No description provided."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (~32%) */}
        <div className="space-y-4">
          {/* Card 1: Publishing / Status */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Publishing</h3>
            <div className="text-[13px] font-medium text-[#303030] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#616161]" />
              <span>Online Store &amp; Catalog</span>
            </div>
            <p className="text-[12px] text-[#616161]">
              This collection is automatically synced to the storefront categories menu, category filter pills, and hardware showcase.
            </p>
          </div>

          {/* Card 2: Theme template */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Theme template</h3>
            <div className="relative">
              <select
                value={themeTemplate}
                onChange={(e) => setThemeTemplate(e.target.value)}
                className="w-full appearance-none text-[13px] border border-[#c9cccf] rounded-xl px-3.5 py-2 outline-none focus:border-[#005bd3] bg-white text-[#303030] cursor-pointer"
              >
                <option>Default collection</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#616161] absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Danger Zone: Delete Collection */}
          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-[13.5px] font-semibold text-red-600">Delete collection</h3>
            <p className="text-[12.5px] text-[#616161]">
              Deleting this collection will not delete the products it contains.
            </p>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-[13px] font-semibold rounded-xl transition cursor-pointer"
            >
              Delete collection
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#e1e3e5] px-6 py-3 flex items-center justify-between z-40">
        <div>
          {saveError && <span className="text-xs text-red-600 font-medium">{saveError}</span>}
          {saveSuccess && <span className="text-xs text-emerald-600 font-medium">Changes saved successfully</span>}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/products/collections")}
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

      {/* Add Products Modal Overlay */}
      {isAddProductsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden text-[#1a1a1a] border border-[#e1e3e5] animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#e1e3e5] flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Add products to collection</h2>
              <button
                type="button"
                onClick={() => setIsAddProductsModalOpen(false)}
                className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-[#e1e3e5]">
              <div className="relative flex items-center bg-white border border-[#c9cccf] rounded-xl px-3 py-1.5 focus-within:border-[#005bd3]">
                <Search className="w-4 h-4 text-[#616161] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full outline-none text-[13px] text-[#1a1a1a]"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {availableProducts
                .filter((p) => p.name.toLowerCase().includes(productSearchQuery.toLowerCase()))
                .map((p) => {
                  const isChecked = assignedProducts.some((ap) => ap.id === p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleToggleProduct(p)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl cursor-pointer transition",
                        isChecked ? "bg-[#f4f6f8]" : "hover:bg-[#fafafa]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-[#c9cccf] cursor-pointer"
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-[#1a1a1a]">{p.name}</div>
                          <div className="text-[11.5px] text-[#616161]">{p.price}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="px-6 py-3 border-t border-[#e1e3e5] bg-[#fafafa] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddProductsModalOpen(false)}
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-xl text-[13px] font-semibold transition cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e1e3e5] overflow-hidden">
            <div className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">
                Delete {title || "this collection"}?
              </h3>
              <p className="text-[13px] text-[#616161]">
                This action cannot be undone. This will delete the collection, but the products inside it will remain in your store.
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
                <span>{isDeleting ? "Deleting..." : "Delete collection"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
