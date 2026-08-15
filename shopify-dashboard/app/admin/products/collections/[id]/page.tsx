"use client";

import { useState, use } from "react";
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
  Copy,
  ExternalLink,
  MoreHorizontal
} from "lucide-react";
import { CollectionIcon } from "@shopify/polaris-icons";
import { cn } from "@/lib/utils";

// Mock Collections Database
const mockCollectionsData: Record<string, { id: string; title: string; description: string; handle: string; products: Array<{ id: string; title: string; badge: string; bgGradient: string }> }> = {
  "1": {
    id: "1",
    title: "Sinhala Books",
    description: "",
    handle: "sinhala-books-sinhala-readers",
    products: [
      { id: "p1", title: "Sinhala Kiyaveem Potha 5", badge: "5", bgGradient: "from-amber-200 to-green-300" },
      { id: "p2", title: "Government Sinhala Wada Potha 3 -...", badge: "3", bgGradient: "from-blue-200 to-indigo-300" },
      { id: "p3", title: "Government Sinhala Wada Potha 2 -...", badge: "2", bgGradient: "from-purple-200 to-pink-300" },
      { id: "p4", title: "Government Sinhala Kiyaveem Potha 4 -...", badge: "4", bgGradient: "from-emerald-200 to-teal-300" },
      { id: "p5", title: "Government Sinhala Kiyaveem Potha 3 -...", badge: "3", bgGradient: "from-rose-200 to-orange-300" },
      { id: "p6", title: "Government Sinhala Kiyaveem Potha 2 -...", badge: "2", bgGradient: "from-cyan-200 to-blue-300" },
      { id: "p7", title: "MUTHU AKURU GRADE 4 - BOOK 3", badge: "3", bgGradient: "from-lime-200 to-emerald-300" },
      { id: "p8", title: "MUTHU AKURU GRADE 4 - BOOK 2", badge: "2", bgGradient: "from-violet-200 to-purple-300" },
    ]
  },
  "2": {
    id: "2",
    title: "Generic Publishers",
    description: "",
    handle: "generic-publishers",
    products: [
      { id: "p1", title: "Abacus Year 1 Workbook 1", badge: "1", bgGradient: "from-blue-200 to-cyan-300" },
      { id: "p2", title: "Abacus Year 1 Workbook 2", badge: "2", bgGradient: "from-teal-200 to-emerald-300" },
      { id: "p3", title: "Abacus Year 2 Textbook", badge: "2", bgGradient: "from-indigo-200 to-blue-300" },
    ]
  },
};

export default function CollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Find collection or fallback to default Sinhala Books
  const initialCollection = mockCollectionsData[resolvedParams.id] || mockCollectionsData["1"];

  const [title, setTitle] = useState(initialCollection.title);
  const [description, setDescription] = useState(initialCollection.description);
  const [handle, setHandle] = useState(initialCollection.handle);
  const [collectionProducts, setCollectionProducts] = useState(initialCollection.products);
  const [sortOption, setSortOption] = useState("Most relevant");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [themeTemplate, setThemeTemplate] = useState("Default collection");
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const handleRemoveProduct = (productId: string) => {
    setCollectionProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleSave = () => {
    router.push("/admin/products/collections");
  };

  return (
    <div className="space-y-4 font-sans pb-24 max-w-[1020px] mx-auto select-none text-[#1a1a1a]">
      {/* Top Navigation Header matching Screenshots 1 & 2 */}
      <div className="flex items-center justify-between py-1 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/products/collections"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Collections"
          >
            <CollectionIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">{title}</h1>
        </div>

        {/* Top Right Action Buttons matching Screenshot 1 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] rounded-xl text-[13px] font-semibold shadow-2xs transition cursor-pointer"
          >
            Duplicate
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] rounded-xl text-[13px] font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1"
          >
            <span>View</span>
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] rounded-xl text-[13px] font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1"
            >
              <span>More actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
            </button>
            {isMoreActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1 z-50 animate-in fade-in-0 zoom-in-95 duration-100 flex flex-col gap-0.5 text-[13px]">
                <button
                  type="button"
                  onClick={() => setIsMoreActionsOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                >
                  Create product view
                </button>
                <button
                  type="button"
                  onClick={() => setIsMoreActionsOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-[#fff5f5] rounded-lg transition font-medium"
                >
                  Delete collection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column (~68%) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Card 1: Main Header Card (Title + Description + Image) matching Screenshot 1 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4 relative">
            <div className="flex gap-5 items-start">
              {/* Left Image Uploader Dropzone Box matching Screenshot 1 */}
              <label className="w-36 h-36 border border-dashed border-[#c9cccf] rounded-2xl flex flex-col items-center justify-center bg-white hover:bg-[#fafafa] transition cursor-pointer shrink-0 relative group shadow-2xs">
                <input type="file" accept="image/*" className="hidden" />
                <Upload className="w-6 h-6 text-[#616161] group-hover:scale-110 transition" />
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

          {/* Card 2: Collection Items Cards Grid Card matching Screenshot 1 & 2 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Collection items</h3>
                <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {collectionProducts.length}
                </span>
              </div>

              {/* Default Sort Selector Dropdown matching Screenshot 1 */}
              <div className="flex items-center gap-1.5 text-[12.5px] text-[#616161]">
                <span>Default sort:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none font-semibold text-[#1a1a1a] bg-transparent outline-none pr-5 cursor-pointer"
                  >
                    <option>Most relevant</option>
                    <option>Best selling</option>
                    <option>Product title A-Z</option>
                    <option>Product title Z-A</option>
                    <option>Price low to high</option>
                    <option>Price high to low</option>
                    <option>Created new to old</option>
                    <option>Created old to new</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#616161] absolute right-0 top-1 pointer-events-none" />
                </div>
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

            {/* Rich Product Cards Grid matching Screenshot 1 & 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {collectionProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl p-2.5 border border-[#e1e3e5] space-y-2 flex flex-col justify-between hover:shadow-md transition cursor-pointer"
                >
                  {/* Top Image Box with Badge & Hover Remove Icon (Screenshot 2) */}
                  <div className={cn("w-full h-32 rounded-xl bg-gradient-to-tr flex items-end justify-end p-2 relative overflow-hidden", product.bgGradient)}>
                    {/* Hover Remove (✕) Icon on Top Right Corner matching Screenshot 2 */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProduct(product.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-[#616161] hover:text-red-600 shadow-md flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                      title="Remove from collection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Bottom Right Quantity Badge Overlay matching Screenshot 1 & 2 */}
                    <div className="w-5 h-5 rounded-full bg-white/80 backdrop-blur-xs text-[#1a1a1a] text-[11px] font-bold flex items-center justify-center shadow-2xs">
                      {product.badge}
                    </div>
                  </div>

                  {/* Product Title Label matching Screenshot 1 & 2 */}
                  <div className="px-0.5">
                    <div className="text-[12.5px] font-semibold text-[#1a1a1a] leading-tight line-clamp-2" title={product.title}>
                      {product.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Theme Template matching Screenshot 2 */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-[#1a1a1a]">Theme template</h3>
              <button type="button" className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Eye className="w-4 h-4" />
              </button>
            </div>
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
            <div className="space-y-1 pt-1">
              <div className="text-[13px] text-[#303030]">Learnix LK</div>
              <div className="text-[12px] text-[#006621]">https://learnix.lk › collections › {handle}</div>
              <div className="text-[16px] font-semibold text-[#005bd3] hover:underline cursor-pointer pt-0.5">
                {title}
              </div>
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

            {/* Inner Condition Box with count pill on right matching Screenshot 1 */}
            <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-[12.5px] font-semibold bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-xl transition shadow-2xs flex items-center gap-1.5 text-[#303030] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#616161]" />
                  <span>Add condition</span>
                </button>

                {/* Right Count Pill Badge matching Screenshot 1 (🏷️ 8) */}
                <div className="flex items-center gap-1.5 bg-white border border-[#c9cccf] px-2.5 py-1 rounded-full text-[12px] font-bold text-[#1a1a1a] shadow-2xs">
                  <Tag className="w-3 h-3 text-[#616161]" />
                  <span>{collectionProducts.length}</span>
                </div>
              </div>

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
    </div>
  );
}
