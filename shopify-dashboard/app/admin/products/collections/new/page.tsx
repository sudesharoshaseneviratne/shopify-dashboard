"use client";

import { useState } from "react";
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
  Search,
  Check,
  Tag
} from "lucide-react";
import { CollectionIcon, ProductIcon } from "@shopify/polaris-icons";
import { cn } from "@/lib/utils";
import { createCollectionAction } from "@/app/actions/collections";
import { getAdminProductsAction } from "@/app/actions/products";
import { uploadProductImageAction } from "@/app/actions/upload";
import { useEffect } from "react";

export default function AddCollectionPage() {
  const router = useRouter();

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectionImage, setCollectionImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [themeTemplate, setThemeTemplate] = useState("Default collection");
  
  // Products Modal & Conditions States
  const [availableProducts, setAvailableProducts] = useState<Array<{ id: string; name: string; price: string; status: string }>>([]);
  const [isAddProductsModalOpen, setIsAddProductsModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [conditions, setConditions] = useState<Array<{ id: number; text: string }>>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const prods = await getAdminProductsAction();
        setAvailableProducts(
          prods.map((p) => ({
            id: p.id,
            name: p.name,
            price: `LKR ${p.rawPrice.toFixed(2)}`,
            status: p.status,
          }))
        );
      } catch (err) {
        console.error("Failed to load products for collection:", err);
      }
    }
    loadProducts();
  }, []);

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

  const handleAddCondition = () => {
    setConditions((prev) => [...prev, { id: Date.now(), text: "Product title equals Abacus" }]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveError("Please enter a collection title.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      const res = await createCollectionAction({
        title: title.trim(),
        description: description.trim(),
        image: collectionImage || undefined,
        productIds: selectedProductIds,
      });

      if (res.success) {
        router.push("/admin/products/collections");
      } else {
        setSaveError(res.error || "Failed to create collection");
      }
    } catch (err) {
      setSaveError(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 font-sans pb-24 max-w-[1020px] mx-auto select-none text-[#1a1a1a]">
      {/* Header Breadcrumb & Title matching Screenshot 1 */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/products/collections"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Collections"
          >
            <CollectionIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Add collection</h1>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column (~68%) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Card 1: Image + Title + Description Header Card matching Screenshot 1 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4 relative">
            <div className="flex gap-5 items-start">
              {/* Left Image Uploader Box matching Screenshot 1 */}
              <label className="w-36 h-36 border border-dashed border-[#c9cccf] rounded-2xl flex flex-col items-center justify-center bg-white hover:bg-[#fafafa] transition cursor-pointer shrink-0 relative group shadow-2xs overflow-hidden">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {collectionImage ? (
                  <img src={collectionImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-[#616161] group-hover:scale-110 transition" />
                )}
              </label>

              {/* Right Input Fields matching Screenshot 1 */}
              <div className="flex-1 space-y-2 pt-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add title"
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

            {/* Bottom Right Sales Channels Indicator matching Screenshot 1 */}
            <div className="flex justify-end pt-2 border-t border-[#f1f2f4]">
              <div className="text-[12.5px] text-[#616161] font-medium flex items-center gap-1.5 hover:text-[#1a1a1a] cursor-pointer transition">
                <Users className="w-4 h-4 text-[#616161]" />
                <span>4 channels</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Collection Items Preview Grid Card matching Screenshot 1 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Collection items</h3>
                <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {selectedProductIds.length}
                </span>
              </div>
              <div className="text-[12px] text-[#616161]">
                Add conditions or products to populate your collection
              </div>
            </div>

            {/* Toolbar View Switcher matching Screenshot 1 */}
            <div className="flex items-center justify-between border-b border-[#f1f2f4] pb-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-lg border transition cursor-pointer",
                    viewMode === "grid" ? "bg-[#f1f2f4] border-[#c9cccf] text-[#1a1a1a]" : "bg-white border-transparent text-[#616161] hover:bg-[#f6f6f7]"
                  )}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-lg border transition cursor-pointer",
                    viewMode === "list" ? "bg-[#f1f2f4] border-[#c9cccf] text-[#1a1a1a]" : "bg-white border-transparent text-[#616161] hover:bg-[#f6f6f7]"
                  )}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <span className="bg-[#f1f2f4] text-[#616161] text-[12px] font-medium px-2 py-0.5 rounded-lg ml-1">
                  4
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-lg transition">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Filter Pill Bar matching Screenshot 1 */}
            <div className="flex items-center gap-2 flex-wrap text-[12.5px]">
              <span className="bg-white border border-[#c9cccf] text-[#303030] px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>Status: Active, Draft, Unlisted, and Suspended</span>
                <X className="w-3.5 h-3.5 text-[#616161] hover:text-[#1a1a1a] cursor-pointer" />
              </span>
              <button type="button" className="text-[#616161] hover:text-[#1a1a1a] font-medium transition cursor-pointer">
                Clear all
              </button>
            </div>

            {/* Faint Product Skeleton Cards Grid matching Screenshot 1 & 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-3 border border-[#e1e3e5] space-y-2 aspect-3/4 flex flex-col justify-between opacity-35 hover:opacity-75 transition shadow-2xs"
                >
                  <div className="w-full h-28 bg-[#f1f2f4] rounded-xl" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-3/4 bg-[#e4e5e7] rounded" />
                    <div className="h-2.5 w-1/2 bg-[#e4e5e7] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Theme Template matching Screenshot 2 */}
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

          {/* Card 4: Search Engine Listing matching Screenshot 2 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Search engine listing</h3>
              <button type="button" className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md transition cursor-pointer">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-0.5 pt-1">
              <div className="text-[14px] font-semibold text-[#005bd3]">Prasanthi Craft</div>
              <div className="text-[12px] text-[#006621]">https://prasanthicraft.com › collections ›</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (~32%) matching Screenshot 1 */}
        <div className="space-y-4">
          
          {/* Card 1: Products Condition Box matching Screenshot 1 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between text-[13.5px] font-semibold text-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#1a1a1a]" />
                <span>Products</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#616161] cursor-pointer" />
            </div>

            {/* Inner Condition Buttons Box matching Screenshot 1 */}
            <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-2xl p-3 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-3 py-1.5 text-[12.5px] font-semibold bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-xl transition shadow-2xs flex items-center gap-1.5 text-[#303030] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Add condition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductsModalOpen(true)}
                  className="px-3 py-1.5 text-[12.5px] font-semibold bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-xl transition shadow-2xs flex items-center gap-1.5 text-[#303030] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Add products</span>
                </button>
              </div>

              {conditions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {conditions.map((cond) => (
                    <div key={cond.id} className="text-[12px] bg-white p-2 rounded-xl border border-[#e1e3e5] text-[#303030] font-medium">
                      {cond.text}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  className="px-3 py-1.5 text-[12.5px] font-semibold bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-xl transition shadow-2xs flex items-center gap-1.5 text-[#303030] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Exclude</span>
                </button>
              </div>
            </div>

            {/* Dotted Plus Container below matching Screenshot 1 */}
            <div className="border border-dashed border-[#c9cccf] hover:border-[#a1a1a1] rounded-2xl p-4 flex items-center justify-center bg-white text-[#616161] transition cursor-pointer">
              <Plus className="w-5 h-5 text-[#616161]" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#e1e3e5] px-6 py-3 flex items-center justify-end z-40">
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
            onClick={handleSave}
            className="px-5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white text-[13px] font-semibold rounded-xl transition shadow-2xs cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* Add Products Modal Overlay */}
      {isAddProductsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden text-[#1a1a1a] border border-[#e1e3e5] animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#e1e3e5] flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Add products</h2>
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
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelectProduct(p.id)}
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
                className="px-4 py-1.5 border border-[#c9cccf] rounded-xl text-[13px] font-medium text-[#303030] hover:bg-[#f6f6f7] bg-white transition cursor-pointer"
              >
                Cancel
              </button>
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
    </div>
  );
}
