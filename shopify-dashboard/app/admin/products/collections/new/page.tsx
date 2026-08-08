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
  RefreshCw, 
  SlidersHorizontal,
  ChevronUp
} from "lucide-react";
import { CollectionIcon, ProductIcon } from "@shopify/polaris-icons";
import { cn } from "@/lib/utils";

export default function AddCollectionPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [channels, setChannels] = useState("4 channels");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [themeTemplate, setThemeTemplate] = useState("Default collection");

  const [conditions, setConditions] = useState<Array<{ id: number; text: string }>>([]);

  const handleAddCondition = () => {
    setConditions((prev) => [...prev, { id: Date.now(), text: "Product title equals Abacus" }]);
  };

  return (
    <div className="space-y-4 font-sans pb-16 max-w-[960px] mx-auto">
      {/* Header Breadcrumb & Title */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1.5 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/products/collections"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Collections"
          >
            <CollectionIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Add collection</h1>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Title & Description Header Box */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4 relative">
            <div className="flex gap-4">
              {/* Left Image Uploader Box */}
              <label className="w-28 h-28 border-2 border-dashed border-[#c9cccf] rounded-xl flex flex-col items-center justify-center bg-[#fafafa] hover:bg-[#f6f6f7] transition cursor-pointer shrink-0 relative group">
                <input type="file" accept="image/*" className="hidden" />
                <Upload className="w-5 h-5 text-[#616161] group-hover:scale-110 transition" />
              </label>

              {/* Right Input Fields */}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add title"
                  className="w-full text-[18px] font-bold text-[#1a1a1a] placeholder:text-[#8c8c8c] border-b border-transparent focus:border-[#005bd3] outline-none py-0.5 bg-transparent"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  rows={2}
                  className="w-full text-[13px] text-[#616161] placeholder:text-[#8c8c8c] outline-none resize-y py-0.5 bg-transparent"
                />
              </div>
            </div>

            {/* Bottom Right Sales Channels Indicator */}
            <div className="flex justify-end pt-1 border-t border-[#f1f2f4]">
              <div className="text-[12px] text-[#616161] font-medium flex items-center gap-1 hover:text-[#1a1a1a] cursor-pointer">
                <span>📢</span>
                <span>4 channels</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Collection Items Preview */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Collection Items</h3>
                <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-medium px-2 py-0.5 rounded-full">
                  0
                </span>
              </div>
              <div className="text-[12px] text-[#616161]">
                Add conditions or products to populate your collection
              </div>
            </div>

            {/* Toolbar View Switcher */}
            <div className="flex items-center gap-2 border-b border-[#f1f2f4] pb-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition",
                  viewMode === "grid" ? "bg-[#e4e5e7] text-[#1a1a1a]" : "text-[#616161] hover:bg-[#f6f6f7]"
                )}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition",
                  viewMode === "list" ? "bg-[#e4e5e7] text-[#1a1a1a]" : "text-[#616161] hover:bg-[#f6f6f7]"
                )}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-medium px-2 py-0.5 rounded">
                4
              </span>
            </div>

            {/* Faint Product Skeleton Cards (Matching Screenshot 1) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-6 px-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-[#fafafa] rounded-xl p-3 border border-[#f1f2f4] space-y-2 aspect-3/4 flex flex-col justify-end opacity-40 shadow-2xs hover:opacity-60 transition"
                >
                  <div className="w-full h-24 bg-[#e4e5e7] rounded-lg animate-pulse" />
                  <div className="h-3 w-3/4 bg-[#e4e5e7] rounded" />
                  <div className="h-2 w-1/2 bg-[#e4e5e7] rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Theme Template */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Theme template</h3>
            <select
              value={themeTemplate}
              onChange={(e) => setThemeTemplate(e.target.value)}
              className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]"
            >
              <option>Default collection</option>
            </select>
          </div>

          {/* Card 4: Search Engine Listing */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Search engine listing</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5">
              <div className="text-[14px] font-medium text-[#005bd3]">Learnix LK</div>
              <div className="text-[12px] text-[#006621]">https://learnix.lk › collections ›</div>
            </div>
          </div>
        </div>

        {/* Right Column (Conditions & Settings Card) */}
        <div className="space-y-4">
          {/* Card 1: Conditions Rules Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1a1a1a]">
                <ProductIcon className="w-4 h-4 fill-current text-[#1a1a1a]" />
                <span>Products</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#616161] cursor-pointer" />
            </div>

            {/* Inner Condition Container */}
            <div className="border border-[#e1e3e5] rounded-xl p-3 bg-[#fafafa] space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleAddCondition}
                  className="px-3 py-1.5 text-[12px] font-medium bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition shadow-2xs flex items-center gap-1 text-[#303030]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Add condition</span>
                </button>
                <button className="px-3 py-1.5 text-[12px] font-medium bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition shadow-2xs flex items-center gap-1 text-[#303030]">
                  <RefreshCw className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Add products</span>
                </button>
              </div>

              {conditions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {conditions.map((cond) => (
                    <div key={cond.id} className="text-[12px] bg-white p-2 rounded border border-[#e1e3e5] text-[#303030]">
                      {cond.text}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-1">
                <button className="px-3 py-1.5 text-[12px] font-medium bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition shadow-2xs flex items-center gap-1 text-[#303030]">
                  <Plus className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Exclude</span>
                </button>
              </div>
            </div>

            {/* Dotted Plus Container below */}
            <div className="border-2 border-dashed border-[#e1e3e5] hover:border-[#c9cccf] rounded-xl p-6 flex items-center justify-center bg-white text-[#616161] transition cursor-pointer">
              <Plus className="w-5 h-5 text-[#616161]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
